import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for static assets and API routes
  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons")

  if (isStatic) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const publicRoutes = ["/login", "/forget-password", "/reset-password", "/verify-email"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Redirect to login if no token and not on public route
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If token exists, enforce role-based access control
  if (token) {
    const role = token.role

    // Admin access rules
    if (role === "admin") {
      const adminAccessibleRoutes = ["/", "/hub-list", "/hub-manager-list", "/transporter-list"]
      const isAdminAllowed = adminAccessibleRoutes.some((route) => {
        if (route === "/") {
          return pathname === "/"
        }
        return pathname.startsWith(route)
      })

      if (!isAdminAllowed) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    // HubManager access rules
    if (role === "hubManager") {
      const hubManagerAccessibleRoutes = ["/shipper", "/receiver", "/transporter"]
      const isHubManagerAllowed = hubManagerAccessibleRoutes.some((route) => pathname.startsWith(route))

      // If hubManager tries to access root or other restricted routes, redirect to shipper
      if (!isHubManagerAllowed) {
        return NextResponse.redirect(new URL("/shipper", request.url))
      }
    }

    // Handle unknown roles
    if (!role || (role !== "admin" && role !== "hubManager")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.png (logo file)
     * - Any file with an extension (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\..*).*)",
  ],
}
