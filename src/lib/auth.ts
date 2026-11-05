// Auth.js (NextAuth) configuration for The Bike Yard
// Follows AUTH_SECURITY.md and API.md §9 authorization rules.
//
// Session strategy: database-backed sessions (AUTH_SECURITY §2, §3).
// JWT is explicitly NOT used. Sessions are stored in PostgreSQL via the
// Prisma adapter and validated against the Session table on every request.

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { getServerSession, type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { role: true },
        });

        if (!user || !user.passwordHash || !user.isActive || user.deletedAt) {
          return null;
        }

        const isValid = await compare(credentials.password as string, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.name,
          roleId: user.roleId,
          dealershipId: user.dealershipId,
        };
      },
    }),
  ],

  // Database-backed sessions per AUTH_SECURITY §2 (§3: JWT not used)
  session: {
    strategy: 'database',
    maxAge: 60 * 60 * 8, // 8 hours idle
  },

  // Callbacks per AUTH_SECURITY §4
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { role: true },
        });

        if (dbUser && dbUser.isActive && !dbUser.deletedAt) {
          (session.user as any).id = dbUser.id;
          (session.user as any).role = dbUser.role.name;
          (session.user as any).roleId = dbUser.roleId;
          (session.user as any).dealershipId = dbUser.dealershipId;
        } else {
          // User deactivated or deleted — strip all privileges.
          (session.user as any).role = '';
          (session.user as any).roleId = '';
          (session.user as any).dealershipId = '';
        }
      }
      return session;
    },
  },

  // Pages per AUTH_SECURITY §1
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },

  // Debug: enable in development only
  debug: process.env.NODE_ENV === 'development',
};

const nextAuth = NextAuth(authOptions);

// `handlers` exposes GET/POST route handlers for the App Router route.
export const handlers = {
  GET: nextAuth,
  POST: nextAuth,
};

/** Resolve the current session server-side (database session). */
export async function auth() {
  return getServerSession(authOptions);
}

// Re-exported for compatibility with the rest of the codebase.
export const signIn = nextAuth;
export const signOut = nextAuth;
