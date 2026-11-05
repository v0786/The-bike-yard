// API authorization helper — server-side enforcement per AUTH_SECURITY §4.3 and API.md §9.
// Every admin/staff API route must call requireAuth() or requireRole() to gate access.

import { auth } from '@/lib/auth';
import { RoleAuthorizationError } from '@/lib/roles';

export type Role =
  | 'Super Admin'
  | 'Owner'
  | 'Manager'
  | 'Sales Exec'
  | 'Accountant'
  | 'Insurance Staff'
  | 'RTO Staff';

interface SessionUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  roleId?: string;
  dealershipId?: string;
}

/** Return the authenticated user, or null if unauthenticated. */
export async function getAuthUser(): Promise<SessionUser | null> {
  const session = await auth();
  return (session?.user as SessionUser) ?? null;
}

/** Require authentication; return user or throw a 401 error. */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getAuthUser();
  if (!user) {
    throw new AuthError('UNAUTHENTICATED', 'Authentication required', 401);
  }
  return user;
}

/** Require one of the allowed roles; return user or throw 403. */
export async function requireRole(allowedRoles: Role[] | string[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!user.role || !(allowedRoles as string[]).includes(user.role)) {
    throw new AuthError('FORBIDDEN', 'Insufficient permissions for this action', 403);
  }
  return user;
}

export class AuthError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.status = status;
  }
}

/** Catch AuthError and return a NextResponse per API.md §2 error contract. */
export function authErrorResponse(error: unknown) {
  return apiErrorResponse(error);
}

/**
 * Canonical API error handler for route handlers. Handles AuthError (401/403),
 * RoleAuthorizationError (403) and ZodError (400), falling back to a safe 500.
 * Never leaks stack traces or internal details (API.md §2).
 */
export function apiErrorResponse(error: unknown, fallbackMessage = 'Request failed') {
  if (error instanceof AuthError) {
    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status }
    );
  }
  if (error instanceof RoleAuthorizationError) {
    return Response.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status }
    );
  }
  // Generic application errors carrying an HTTP status + safe code.
  if (
    error &&
    typeof error === 'object' &&
    typeof (error as { status?: unknown }).status === 'number' &&
    typeof (error as { code?: unknown }).code === 'string'
  ) {
    const appError = error as { status: number; code: string; message?: string };
    return Response.json(
      { error: { code: appError.code, message: appError.message ?? 'Request failed' } },
      { status: appError.status }
    );
  }
  // ZodError is duck-typed to avoid importing zod into every route.
  if (
    error &&
    typeof error === 'object' &&
    (error as { name?: string }).name === 'ZodError' &&
    Array.isArray((error as { issues?: unknown[] }).issues)
  ) {
    const issues = (error as { issues: Array<{ path: (string | number)[]; message: string }> })
      .issues;
    return Response.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
      },
      { status: 400 }
    );
  }
  return Response.json(
    { error: { code: 'INTERNAL_ERROR', message: fallbackMessage } },
    { status: 500 }
  );
}

/** Throw a validation error that apiErrorResponse recognises (not a real ZodError). */
export function validationError(
  message: string,
  details?: Array<{ field: string; message: string }>,
) {
  const error = new Error(message);
  (error as { name: string }).name = 'ZodError';
  (error as { issues?: unknown[] }).issues =
    details?.map((d) => ({ path: d.field.split('.'), message: d.message })) ?? [];
  return error;
}
