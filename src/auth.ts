// @ts-nocheck: Module resolution configured at project setup
// Auth.js configuration for The Bike Yard
// Follows AUTH_SECURITY.md and API.md §9 authorization rules

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

type MockUser = {
  id: string
  email: string
  name: string
  password: string
  role: string
}

const mockUsers: Record<string, MockUser> = {
  "admin@thebikeyard.local": {
    id: "1",
    email: "admin@thebikeyard.local",
    name: "Super Admin",
    password: "admin123",
    role: "Super Admin",
  },
}

// OAuth providers stubbed for MVP; real providers integrated post-launch per INTEGRATIONS.md
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@thebikeyard.local" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // $ExpectedDataLoss: credentials may have unknown fields
        const user = mockUsers[credentials?.email as string]
        if (!user) return null
        if (credentials?.password !== user.password) return null
        return {
          // Omit password from returned user object
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],

  // Session strategy per AUTH_SECURITY.md §2
  session: {
    strategy: "jwt",
  },

  // Callbacks per AUTH_SECURITY.md
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },

  // Pages per AUTH_SECURITY.md §1
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },

  // Debug: enable in development only
  debug: process.env.NODE_ENV === "development",
})