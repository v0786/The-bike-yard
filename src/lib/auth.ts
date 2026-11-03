// Auth.js (NextAuth) configuration for The Bike Yard
// Follows AUTH_SECURITY.md and API.md §9 authorization rules.
//
// Session strategy: database-backed sessions (AUTH_SECURITY §2, §3).
// JWT is explicitly NOT used. Sessions are stored in PostgreSQL via the
// Prisma adapter and validated against the Session table on every request.

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
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
        });

        if (!user || !user.passwordHash || !user.isActive) {
          return null;
        }

        const isValid = await compare(credentials.password as string, user.passwordHash);
        if (!isValid) {
          return null;
        }

        // Record last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
          role: user.roleId,
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
    async jwt({ token, user, account }) {
      // Initial sign-in: populate token from user account
      if (user) {
        token.role = (user as any).role;
        token.roleId = (user as any).roleId;
        token.dealershipId = (user as any).dealershipId;
      }
      // On subsequent requests, refresh role from DB to reflect deactivation/role changes
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub as string },
        });
        if (!dbUser || !dbUser.isActive) {
          // User deactivated — invalidate token
          token.role = '';
          token.roleId = '';
          token.dealershipId = '';
        } else {
          token.role = dbUser.roleId;
          token.roleId = dbUser.roleId;
          token.dealershipId = dbUser.dealershipId;
        }
      }
      return token as JWT;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).roleId = token.roleId as string;
        (session.user as any).dealershipId = token.dealershipId as string;
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
});
