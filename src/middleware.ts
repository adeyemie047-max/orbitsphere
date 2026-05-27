import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { isDashboardRole } from "@/lib/rbac";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!request.auth?.user) {
    const signInUrl = new URL("/sign-in", request.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (!isDashboardRole(request.auth.user.role)) {
    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  }

  if (pathname.startsWith("/admin")) {
    const dashboardPath =
      pathname.replace(/^\/admin/, "/dashboard") || "/dashboard";
    return NextResponse.redirect(new URL(dashboardPath, request.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
