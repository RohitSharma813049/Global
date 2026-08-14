import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter if Upstash Redis environment variables are available
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
      limiter: Ratelimit.slidingWindow(100, '10 s'), // Allow 100 requests per 10 seconds window
      analytics: true,
    });
  }
} catch (error) {
  console.warn("Could not initialize Upstash rate limiting in proxy.ts", error);
}

export default withAuth(
  async function proxy(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const ip = req.headers.get("x-forwarded-for")?.split(',')[0]?.trim() || req.headers.get("x-real-ip") || '127.0.0.1';

    let success = true;
    let limit = 100;
    let remaining = 100;
    let reset = Date.now() + 10000;

    // Apply Rate Limiting to dynamic API and page routes
    if (ratelimit) {
      try {
        if (!pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf)$/i)) {
          const result = await ratelimit.limit(ip);
          success = result.success;
          limit = result.limit;
          remaining = result.remaining;
          reset = result.reset;
        }
      } catch (error) {
        console.error('Proxy rate limiting error:', error);
      }
    }

    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    let response = NextResponse.next();

    // Protect /admin routes strictly to admin & super_admin roles
    if (pathname.startsWith("/admin") && token?.role !== "admin" && token?.role !== "super_admin") {
      response = NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Redirect authenticated users away from public auth pages
    if (token && (pathname === '/signin' || pathname === '/signup')) {
      response = NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Apply robust Security Headers to every response
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN'); // Prevent clickjacking
    response.headers.set('X-Content-Type-Options', 'nosniff'); // Prevent MIME-type sniffing
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    
    // Attach Rate Limit telemetry headers
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Require auth for protected routes
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/crm")) {
          return !!token;
        }
        // Allow public pages through
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, _next internal files, and favicons
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"
  ],
};
