// Admin layout for the Motorcycle Data Integration Engine screens.
// These live under the real `/admin/*` segment so the middleware `/admin/:path*`
// guard applies. Data access is additionally enforced server-side by every API.
export const dynamic = 'force-dynamic';

export default function AdminIntegrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-bg-primary text-brand-primary p-6">
      <h1 className="text-3xl font-bold mb-2">The Bike Yard — Admin</h1>
      <p className="text-sm text-brand-secondary mb-6">
        Motorcycle data integration: provider-managed specifications, staff-managed pricing.
      </p>
      {children}
    </main>
  );
}
