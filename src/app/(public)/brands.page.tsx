// Brands listing page (public)
// Follows PRD.md F-CAT-01, F-CAT-02

import type { Metadata } from '@/types/metadata';
import { Navbar, Footer } from '@/components/public/Navbar';

export const metadata: Metadata = {
  title: 'Our Brands — The Bike Yard',
  description: 'Explore motorcycle brands available at The Bike Yard showroom in Khopat, Thane.',
};

export default function BrandsPage() {
  const brands = [
    { name: 'Suzuki', description: 'Japanese motorcycle manufacturer' },
    { name: 'Honda', description: 'Japanese motorcycle manufacturer' },
    { name: 'TVS', description: 'Indian motorcycle manufacturer' },
  ];

  return (
    <main className="min-h-screen bg-bg-primary text-brand-primary">
      <Navbar />
      <section className="pt-24 sm:pt-32 pb-24">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
              Brands
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
              Our Brands
            </h2>
            <p className="text-brand-secondary/60 text-lg max-w-2xl mx-auto">
              Explore motorcycles from leading manufacturers available at our showroom.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <a
                key={brand.name}
                href="/new-bikes"
                className="border rounded-2xl p-8 bg-white hover:shadow-lg transition-shadow group flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-brand-secondary/20 flex items-center justify-center mb-4 group-hover:bg-brand-secondary/30 transition-colors">
                  <svg className="w-8 h-8 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h3 className="font-bold text-brand-primary text-lg">{brand.name}</h3>
                <p className="text-sm text-brand-secondary/60 mt-2">{brand.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
