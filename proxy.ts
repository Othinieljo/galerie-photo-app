import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const user = req.cookies.get("session_user");
  const { pathname } = req.nextUrl;

  // Don't interfere with API routes or static assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (!user && pathname.startsWith("/gallery")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/gallery", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
