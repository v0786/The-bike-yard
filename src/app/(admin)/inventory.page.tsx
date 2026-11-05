// Inventory Management
// Follows FEATURES.md F-STK-01 to F-STK-07, DATABASE.md, DESIGN.md
// Fetches real data from database — no hardcoded sample data

import type { Metadata } from '@/types/metadata';
import { prisma } from '@/lib/prisma';
import { StatusChip } from '@/components/ui/status-chip';
import { formatInr } from '@/lib/currency';

export const metadata: Metadata = {
  title: 'The Bike Yard — Inventory',
  description: 'Manage motorcycle inventory, stock movements, and stock units for The Bike Yard.',
};

export default function InventoryPage() {
  return (
    <section className="py-24 sm:py-32 bg-bg-primary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
            Inventory
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
            Motorcycle Inventory
          </h1>
          <p className="text-brand-secondary/60 text-lg">
            Manage stock units, track status, and record movements.
          </p>
        </div>

        <InventoryDashboard />
      </div>
    </section>
  );
}

async function InventoryDashboard() {
  const units = await prisma.stockUnit.findMany({
    include: {
      variant: { include: { model: { include: { brand: true } } } },
    },
    orderBy: { inwardDate: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          ['IN_STOCK', 'Available', 'bg-green-100 text-green-800'],
          ['RESERVED', 'Reserved', 'bg-amber-100 text-amber-800'],
          ['SOLD', 'Sold', 'bg-red-100 text-red-800'],
          ['DISPLAY', 'Showroom Display', 'bg-blue-100 text-blue-800'],
        ].map(([status, label, tw]) => {
          const count = units.filter((u) => u.status === status).length;
          return (
            <div key={status} className={`border rounded-2xl p-6 ${tw}`}>
              <h3 className="font-medium mb-1">{label}</h3>
              <p className="text-2xl font-bold">{count} units</p>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-white rounded-2xl shadow-sm border border-brand-secondary">
        <h3 className="font-bold text-brand-primary text-sm uppercase mb-6">Stock Units</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-brand-secondary">
                <th className="text-left text-sm font-medium text-brand-primary pb-3">Chassis Number</th>
                <th className="text-left text-sm font-medium text-brand-primary pb-3">Engine Number</th>
                <th className="text-left text-sm font-medium text-brand-primary pb-3">Model &amp; Colour</th>
                <th className="text-center text-sm font-medium text-brand-primary pb-3">Purchase Price</th>
                <th className="text-center text-sm font-medium text-brand-primary pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-secondary/10">
              {units.map((unit) => (
                <tr key={unit.id} className="text-left">
                  <td className="py-4 text-sm font-medium text-brand-primary">
                    {unit.chassisNumber}
                  </td>
                  <td className="py-4 text-sm text-brand-secondary">{unit.engineNumber}</td>
                  <td className="py-4 text-sm">
                    {unit.variant?.model?.brand?.name} {unit.variant?.model?.name} {unit.variant?.name} - {unit.colorName || 'N/A'}
                  </td>
                  <td className="py-4 text-sm text-center">{formatInr(unit.purchasePricePaise)}</td>
                  <td className="py-4 text-center">
                    <StatusChip status={unit.status} />
                  </td>
                </tr>
              ))}
              {units.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-brand-secondary/60">
                    No stock units found. Add your first stock unit below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-brand-secondary">
        <h4 className="font-bold text-brand-primary text-sm uppercase mb-4">Record Stock Inward</h4>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" action="/api/admin/stock/inward" method="POST">
          <div>
            <label className="block text-sm text-brand-primary mb-2">Chassis Number</label>
            <input type="text" name="chassisNumber" required className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary" />
          </div>
          <div>
            <label className="block text-sm text-brand-primary mb-2">Engine Number</label>
            <input type="text" name="engineNumber" required className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary" />
          </div>
          <div>
            <label className="block text-sm text-brand-primary mb-2">Variant</label>
            <select name="variantId" required className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary">
              <option value="">Select variant</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-brand-primary mb-2">Colour</label>
            <input type="text" name="colorName" required className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary" />
          </div>
          <div>
            <label className="block text-sm text-brand-primary mb-2">Purchase Price (paise)</label>
            <input type="number" name="purchasePricePaise" required className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary" />
          </div>
          <div>
            <label className="block text-sm text-brand-primary mb-2">Inward Date</label>
            <input type="datetime-local" name="inwardDate" required className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-brand-primary mb-2">Supplier Name</label>
            <input type="text" name="supplierName" className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary" />
          </div>
          <button type="submit" className="sm:col-span-2 py-3 rounded-md bg-brand-primary text-white font-medium hover:bg-brand-accent transition-colors">
            Record Stock Inward
          </button>
        </form>
      </div>
    </div>
  );
}
