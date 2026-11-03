import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

// Staff portal layout - role-scoped access per AUTH_SECURITY.md
// Access controlled via middleware + server-side permission checks per API.md §9

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-bg-primary text-brand-primary p-6">
      <h1 className="text-3xl font-bold mb-6">The Bike Yard — Staff Portal</h1>
      {children}
    </main>
  )
}