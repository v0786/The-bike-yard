// Central role constants + a lightweight, next-auth-free authorization guard.
// Keeping this module free of NextAuth lets services (and their tests) enforce
// role rules without constructing an auth session.

export const ALL_STAFF_ROLES = [
  'Super Admin',
  'Owner',
  'Manager',
  'Sales Exec',
  'Accountant',
  'Insurance Staff',
  'RTO Staff',
] as const;

/** Roles permitted to create / edit / approve motorcycle pricing. */
export const PRICING_ROLES = ['Super Admin', 'Owner', 'Manager'] as const;

/** Roles permitted to trigger a manual data synchronisation. */
export const SYNC_ROLES = ['Super Admin', 'Owner', 'Manager'] as const;

export type RoleName = (typeof ALL_STAFF_ROLES)[number];

export function hasRole(role: string | undefined | null, allowed: readonly string[]): boolean {
  return !!role && allowed.includes(role);
}

/** Thrown when a server-side role check fails. Maps to HTTP 403. */
export class RoleAuthorizationError extends Error {
  readonly code = 'FORBIDDEN';
  readonly status = 403;
  constructor(action: string) {
    super(`Insufficient permissions for this action: ${action}`);
    this.name = 'RoleAuthorizationError';
  }
}

/** Assert the acting user holds one of `allowed` roles, else throw 403. */
export function assertRole(
  role: string | undefined | null,
  allowed: readonly string[],
  action: string,
): void {
  if (!hasRole(role, allowed)) {
    throw new RoleAuthorizationError(action);
  }
}
