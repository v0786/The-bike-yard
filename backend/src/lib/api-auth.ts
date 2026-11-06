import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new AuthError('Unauthorized: Active dealership session required.', 401);
  }
  return session.user;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  const roleName = (user as any).role || 'GUEST';

  if (!allowedRoles.includes(roleName)) {
    throw new AuthError(
      `Forbidden: Role '${roleName}' does not hold required privileges.`,
      403
    );
  }
  return user;
}
