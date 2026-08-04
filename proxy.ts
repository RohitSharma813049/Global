import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only create ratelimiter if UPSTASH_REDIS_URL exists
let ratelimit: Ratelimit | null = null;
try {
  const upstashUrl = process.env.UPSTASH_REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (upstashUrl && upstashToken && upstashUrl.startsWith('http')) {
    const redis = new Redis({
      url: upstashUrl,
      token: upstashToken,
    });
    ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(100, '10 s'), // Allow 100 requests per 10 seconds
      analytics: true,
    });
  } else {
    console.warn("Upstash Redis credentials missing or invalid. Rate limiting is disabled.");
  }
} catch (error) {
  console.warn("Could not initialize Upstash rate limiting in proxy.ts", error);
}

export default withAuth(
  async function proxy(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;
    const ip = req.headers.get("x-forwarded-for") ?? '127.0.0.1';

    let success = true;
    let limit = 30;
    let remaining = 30;
    let reset = Date.now() + 10000;

    // Apply Rate Limiting
    if (ratelimit) {
      try {
        if (!pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
          const result = await ratelimit.limit(ip);
          success = result.success;
          limit = result.limit;
          remaining = result.remaining;
          reset = result.reset;
        }
      } catch (error) {
        console.error('Rate limiting error:', error);
      }
    }

    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    let response = NextResponse.next();

    // Optional: Protect /admin routes to only admins and super_admins
    if (pathname.startsWith("/admin") && token?.role !== "admin" && token?.role !== "super_admin") {
      response = NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If user is authenticated and trying to access public auth pages, redirect to dashboard
    if (token && (pathname === '/signin' || pathname === '/signup' || pathname === '/')) {
      // Don't redirect / if we actually want them to see the homepage while logged in
      // Let's only redirect signin/signup
      if (pathname === '/signin' || pathname === '/signup') {
        response = NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Add robust Security Headers to every response
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN'); // Prevent clickjacking
    response.headers.set('X-Content-Type-Options', 'nosniff'); // Prevent MIME-sniffing
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    
    // Rate Limit Headers
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Require auth for these specific routes
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/crm")) {
          return !!token;
        }
        // Allow public pages through so the proxy function can redirect them if they are logged in
        return true;
      },
    },
  }
);

// Protect these routes and intercept public ones
export const config = {
  matcher: [
    // Apply to everything so rate limiting works, except static files
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"
  ],
};
