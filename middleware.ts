import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const publicRoutes = ["/login", "/forget-password", "/reset-password", "/verify-email"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isStatic = pathname.startsWith("/_next") || pathname.includes(".");

  if (!token && !isPublicRoute && !isStatic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If token exists, enforce role-based access control
  if (token) {
    const role = token.role;

    // Admin access rules
    if (role === "admin") {
      const adminAccessibleRoutes = ["/", "/hub-list", "/hub-manager-list", "/transporter-list"];
      const isAdminAllowed = adminAccessibleRoutes.some((route) => pathname.startsWith(route));

      if (!isAdminAllowed) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // HubManager access rules
    if (role === "hubManager") {
      const hubManagerAccessibleRoutes = ["/shipper", "/receiver", "/transporter", ];
      const isHubManagerAllowed = hubManagerAccessibleRoutes.some((route) => pathname.startsWith(route));

      if (!isHubManagerAllowed) {
        return NextResponse.redirect(new URL("/shipper", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
