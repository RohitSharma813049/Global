import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Optional: Protect /admin routes to only admins and super_admins
    if (pathname.startsWith("/admin") && token?.role !== "admin" && token?.role !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If user is authenticated and trying to access public auth pages, redirect to dashboard
    if (token && (pathname === '/signin' || pathname === '/signup' || pathname === '/')) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Require auth for these specific routes
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
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
  matcher: ["/dashboard/:path*", "/admin/:path*", "/signin", "/signup", "/"],
};
