import { NextRequest, NextResponse } from "next/server";

const PASSWORD = "clearance";
const COOKIE_NAME = "site-auth";

export function middleware(request: NextRequest) {
  // Allow the password API route through
  if (request.nextUrl.pathname === "/api/auth") {
    return NextResponse.next();
  }

  // Allow static assets and Next.js internals through
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/favicon") ||
    request.nextUrl.pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const authCookie = request.cookies.get(COOKIE_NAME);
  if (authCookie?.value === PASSWORD) {
    return NextResponse.next();
  }

  // Redirect to password page
  if (request.nextUrl.pathname !== "/password") {
    const url = request.nextUrl.clone();
    url.pathname = "/password";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
