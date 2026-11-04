// Brands & Models Management
// Follows FEATURES.md F-CAT-01 to F-CAT-08, DATABASE.md, DESIGN.md
// Fetches real data from database — no hardcoded sample data

import type { Metadata } from '@/types/metadata';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'The Bike Yard — Brands & Models',
  description: 'Manage motorcycle brands and models for The Bike Yard dealership.',
};

export default function BrandsPage() {
  return (
    <section className="py-24 sm:py-32 bg-bg-primary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
            Brands & Models
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
            Manage Brands and Models
          </h1>
          <p className="text-brand-secondary/60 text-lg">
            Add and manage motorcycle brands and models available at The Bike Yard.
          </p>
        </div>

        <BrandsList />
      </div>
    </section>
  );
}

async function BrandsList() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <h3 className="font-bold text-brand-primary text-sm uppercase mb-4">Brands</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand.id} className="border rounded-xl p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-brand-primary">{brand.name}</h4>
                  <p className="text-xs text-brand-secondary/60">Brand</p>
                </div>
                <Button size="sm">Manage Models</Button>
              </div>
            </div>
          ))}
          {brands.length === 0 && (
            <p className="text-brand-secondary/60">No brands found. Add your first brand below.</p>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <h3 className="font-bold text-brand-primary text-sm uppercase mb-4">Add New Brand</h3>
        <form className="space-y-4" action="/api/admin/brands" method="POST">
          <div>
            <label className="block text-sm text-brand-primary mb-2">Brand Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              placeholder="e.g. Suzuki"
            />
          </div>
          <div>
            <label className="block text-sm text-brand-primary mb-2">Description</label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              placeholder="e.g. Japanese motorcycle manufacturer"
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-md bg-brand-primary text-white font-medium hover:bg-brand-accent transition-colors">
            Add Brand
          </button>
        </form>
      </div>
    </div>
  );
}
