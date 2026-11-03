import Metadata from "next/metadata"

export const metadata: Metadata = {
  title: "The Bike Yard — Admin Dashboard",
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-bg-primary text-brand-primary">
      <AdminSidebar />
      <AdminHeader />
      <section className="p-6 sm:p-8 lg:p-6 overflow-x-auto">
        {children}
      </section>
    </main>
  )
}