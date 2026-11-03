// API authorization helper — server-side enforcement per AUTH_SECURITY §4.3 and API.md §9.
// Every admin/staff API route must call requireAuth() or requireRole() to gate access.

import { auth } from "@/lib/auth"

export type Role =
  | "Super Admin"
  | "Owner"
  | "Manager"
  | "Sales Exec"
  | "Accountant"
  | "Insurance Staff"
  | "RTO Staff"

interface SessionUser {
  id?: string
  email?: string
  role?: string
  roleId?: string
  dealershipId?: string
}

/** Return the authenticated user, or null if unauthenticated. */
export async function getAuthUser(): Promise<SessionUser | null> {
  const session = await auth()
  return (session?.user as SessionUser) ?? null
}

/** Require authentication; return user or throw a 401 response. */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getAuthUser()
  if (!user) {
    throw new AuthError("UNAUTHENTICATED", "Authentication required", 401)
  }
  return user
}

/** Require one of the allowed roles; return user or throw 403. */
export async function requireRole(allowedRoles: Role[]): Promise<SessionUser> {
  const user = await requireAuth()
  if (!user.role || !allowedRoles.includes(user.role as Role)) {
    throw new AuthError(
      "FORBIDDEN",
      "Insufficient permissions for this action",
      403
    )
  }
  return user
}

export class AuthError extends Error {
  code: string
  status: number

  constructor(code: string, message: string, status: number) {
    super(message)
    this.code = code
    this.status = status
  }
}

/** Catch AuthError and return a NextResponse per API.md §2 error contract. */
export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status }
    )
  }
  return Response.json(
    { error: { code: "INTERNAL_ERROR", message: "Authentication error" } },
    { status: 500 }
  )
}
