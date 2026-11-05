// Admin Test Rides page
// Follows PRD.md F-CRM-04, FEATURES.md

import type { Metadata } from '@/types/metadata';
import { prisma } from '@/lib/prisma';
import { StatusChip } from '@/components/ui/status-chip';

export const metadata: Metadata = {
  title: 'The Bike Yard — Test Rides',
  description: 'Manage test ride bookings for The Bike Yard dealership.',
};

export default function TestRidesPage() {
  return (
    <section className="py-24 sm:py-32 bg-bg-primary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
            Test Rides
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
            Test Ride Bookings
          </h1>
          <p className="text-brand-secondary/60 text-lg">
            Manage test ride appointments and customer follow-up.
          </p>
        </div>

        <TestRidesList />
      </div>
    </section>
  );
}

async function TestRidesList() {
  const testRides = await prisma.testRide.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-brand-secondary">
      <h3 className="font-bold text-brand-primary text-sm uppercase mb-6">Test Ride Bookings</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-secondary/10">
          <thead>
            <tr className="border-b border-brand-secondary">
              <th className="text-left text-sm font-medium text-brand-primary pb-3">Customer</th>
              <th className="text-left text-sm font-medium text-brand-primary pb-3">Bike</th>
              <th className="text-left text-sm font-medium text-brand-primary pb-3">Status</th>
              <th className="text-right text-sm font-medium text-brand-primary pb-3">Scheduled</th>
            </tr>
          </thead>
          <tbody>
            {testRides.map((tr) => (
              <tr key={tr.id} className="text-left">
                <td className="py-4 text-sm">{tr.customer?.fullName ?? tr.customerName}</td>
                <td className="py-4 text-sm text-brand-secondary">{tr.bikeModel}</td>
                <td className="py-4 text-sm"><StatusChip status={tr.status} /></td>
                <td className="py-4 text-sm text-brand-secondary/60">{new Date(tr.preferredDate).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
            {testRides.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-brand-secondary/60">No test rides found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
