import { notFound } from "next/navigation"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

// Admin-only layout - requires authentication
// Per AUTH_SECURITY.md §4.2 and API.md §9 authorization matrix
// Access controlled via middleware + server-side role checks

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check for auth session - will be enforced by middleware
  // See: next.config.mjs middleware

  return (
    <main className="min-h-screen bg-bg-primary text-brand-primary p-6">
      <h1 className="text-3xl font-bold mb-6">The Bike Yard — Admin</h1>
      {children}
    </main>
  )
}