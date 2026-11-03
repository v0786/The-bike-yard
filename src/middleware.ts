// Middleware for The Bike Yard
// Authentication and authorization checks per AUTH_SECURITY.md and API.md §9

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public routes - no auth required
  // Protected routes start with /admin or /staff
  const isAdminRoute = path.startsWith("/admin")
  const isStaffRoute = path.startsWith("/staff")

  // Skip middleware for auth pages and public assets
  if (
    path.startsWith("/auth") ||
    path === "/favicon.ico" ||
    path === "/next/font/css/processor.css"
  ) {
    return NextResponse.next()
  }

  // Check for auth session
  const authHeader = request.headers.get("authorization") || ""
  const isAuthenticated = authHeader.startsWith("Bearer ") || authHeader.startsWith("Credentials ")

  // If not on a protected route and not authenticated, just pass through
  if (!isAuthenticated && !isAdminRoute && !isStaffRoute) {
    return NextResponse.next()
  }

  // If on a protected route but not authenticated, redirect to sign-in
  if (!isAuthenticated && (isAdminRoute || isStaffRoute)) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("redirectUrl", request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Role-based authorization per API.md §9
  const role = request.headers.get("x-user-role") || ""

  // Admin route checks - Super Admin has full access,
  // Owner/Manager/Sales Exec/Accountant have restricted access
  // More restrictive checks enforced in route handlers

  // Staff route checks
  const allowedStaffRoles: string[] = [
    "Super Admin",
    "Owner",
    "Manager",
    "Sales Exec",
    "Accountant",
  ]
  if (isStaffRoute && !allowedStaffRoles.includes(role)) {
    // Return 403 Forbidden
    const forbiddenResponse = new NextResponse("Forbidden: insufficient permissions", {
      status: 403,
    })
    return forbiddenResponse
  }

  return NextResponse.next()
}

export const config = {
  // Match all routes except static assets and auth pages
  matcher: [
    "/admin/:path*",
    "/staff/:path*",
    "/api/:path*",
    "/auth/:path*",
  ],
}