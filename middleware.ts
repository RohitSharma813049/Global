import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Optional: Protect /admin routes to only admins and super_admins
    if (pathname.startsWith("/admin") && token?.role !== "admin" && token?.role !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect these routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
