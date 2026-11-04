// Admin Leads & CRM page
// Follows PRD.md F-CRM-01 to F-CRM-03, FEATURES.md

import type { Metadata } from '@/types/metadata';
import { prisma } from '@/lib/prisma';
import { StatusChip } from '@/components/ui/status-chip';

export const metadata: Metadata = {
  title: 'The Bike Yard — Leads & CRM',
  description: 'Manage customer leads and enquiries for The Bike Yard dealership.',
};

export default function LeadsPage() {
  return (
    <section className="py-24 sm:py-32 bg-bg-primary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
            Leads & CRM
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
            Customer Leads
          </h1>
          <p className="text-brand-secondary/60 text-lg">
            Manage customer enquiries, leads, and follow-up activities.
          </p>
        </div>

        <LeadsList />
      </div>
    </section>
  );
}

async function LeadsList() {
  const leads = await prisma.lead.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-brand-secondary">
      <h3 className="font-bold text-brand-primary text-sm uppercase mb-6">All Leads</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-secondary/10">
          <thead>
            <tr className="border-b border-brand-secondary">
              <th className="text-left text-sm font-medium text-brand-primary pb-3">Customer</th>
              <th className="text-left text-sm font-medium text-brand-primary pb-3">Phone</th>
              <th className="text-left text-sm font-medium text-brand-primary pb-3">Source</th>
              <th className="text-left text-sm font-medium text-brand-primary pb-3">Status</th>
              <th className="text-right text-sm font-medium text-brand-primary pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="text-left">
                <td className="py-4 text-sm">{lead.customer?.firstName} {lead.customer?.lastName}</td>
                <td className="py-4 text-sm text-brand-secondary">{lead.customer?.phone}</td>
                <td className="py-4 text-sm text-brand-secondary">{lead.source}</td>
                <td className="py-4 text-sm"><StatusChip status={lead.status} /></td>
                <td className="py-4 text-sm text-brand-secondary/60">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-brand-secondary/60">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
