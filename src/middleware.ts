// Middleware for The Bike Yard
// Authentication and authorization checks per AUTH_SECURITY.md and API.md §9.
// Uses NextAuth session cookies (database-backed sessions, NOT JWT per AUTH_SECURITY §3).

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const ADMIN_ROUTES = ["/admin"]
const STAFF_ROUTES = ["/staff"]

// Roles permitted on staff routes per API.md §9 matrix
const STAFF_ALLOWED_ROLES = new Set([
  "Super Admin",
  "Owner",
  "Manager",
  "Sales Exec",
  "Accountant",
])

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Skip middleware for auth pages and public assets
  if (
    path.startsWith("/auth") ||
    path === "/favicon.ico" ||
    path.startsWith("/_next") ||
    path.startsWith("/api/webhooks")
  ) {
    return NextResponse.next()
  }

  const isAdminRoute = ADMIN_ROUTES.some((p) => path.startsWith(p))
  const isStaffRoute = STAFF_ROUTES.some((p) => path.startsWith(p))
  const isProtectedRoute = isAdminRoute || isStaffRoute

  // Read and verify NextAuth session cookie (database-backed session)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token
  const userRole = (token as any)?.role ?? ""

  // Not on a protected route and not authenticated → pass through
  if (!isAuthenticated && !isProtectedRoute) {
    return NextResponse.next()
  }

  // On a protected route but not authenticated → redirect to sign-in
  if (!isAuthenticated && isProtectedRoute) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("redirectUrl", path)
    return NextResponse.redirect(signInUrl)
  }

  // Staff route: enforce role-based access per API.md §9
  if (isStaffRoute && !STAFF_ALLOWED_ROLES.has(userRole)) {
    return new NextResponse("Forbidden: insufficient permissions", {
      status: 403,
    })
  }

  // Admin route: all authenticated roles may reach admin; finer checks in service layer
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/staff/:path*",
    "/api/admin/:path*",
    "/api/staff/:path*",
  ],
}
