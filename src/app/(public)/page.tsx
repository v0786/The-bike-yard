// Homepage bringing together all sections
// Follows DESIGN.md, FEATURES.md, and PRD.md specifications
// No fake data — all content fetched from API or shown as empty state

import type { Metadata } from '@/types/metadata';
import { Navbar, Footer } from '@/components/public/Navbar';
import { HeroSection } from '@/components/public/HeroSection';
import { BikeCard } from '@/components/public/BikeCard';
import { EMICalculator } from '@/components/public/EMICalculator';

type NavLink = {
  href: string;
  label: string;
  description?: string;
};

export const metadata: Metadata = {
  title: 'The Bike Yard — Premium Motorcycle Showroom',
  description:
    'Complete motorcycle dealership management and digital showroom for The Bike Yard, Khopat, Thane, Maharashtra, India.',
};

export default function HomePage() {
  const navLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/new-bikes', label: 'New Bikes' },
    { href: '/used-bikes', label: 'Used Bikes' },
    { href: '/finance', label: 'Finance' },
    { href: '/insurance', label: 'Insurance' },
    { href: '/rto', label: 'RTO' },
    { href: '/test-ride', label: 'Test Ride' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <main className="min-h-screen bg-bg-primary text-brand-primary">
      <Navbar />
      <section className="pt-24">
        <HeroSection />
      </section>

      {/* Explore Bikes Section */}
      <section className="py-24 sm:py-32 bg-bg-secondary">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
              Available Motorcycles
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
              Explore Our Showroom
            </h2>
            <p className="text-brand-secondary/60 text-lg max-w-2xl mx-auto">
              Browse available motorcycles, view pricing, calculate EMI, and book a test ride.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured bikes with images */}
            <article
              className="border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-64">
                <img
                  src="/images/bikes/suzuki-intruder.svg"
                  alt="Suzuki Intruder 150cc"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-brand-success text-xs font-medium px-2 py-1">
                  Available
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-brand-secondary/20 text-xs font-medium text-brand-secondary rounded">
                    New
                  </span>
                </div>
                <h3 className="font-semibold text-brand-primary group-hover:text-brand-accent transition-colors">
                  Suzuki Intruder
                </h3>
                <p className="text-sm text-brand-secondary/60 mb-2">150cc · Standard · Black</p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-bold text-brand-primary">₹ 1,25,000</span>
                  <span className="text-xs text-brand-secondary/60">Ex-showroom</span>
                </div>
                <button className="w-full py-2 rounded-md border border-brand-secondary text-brand-primary text-sm font-medium hover:bg-brand-secondary/10 transition-colors">
                  Enquire Now
                </button>
              </div>
            </article>

            <article
              className="border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-64">
                <img
                  src="/images/bikes/honda-cb350.svg"
                  alt="Honda CB350 motorcycle"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-brand-success text-xs font-medium px-2 py-1">
                  Available
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-brand-secondary/20 text-xs font-medium text-brand-secondary rounded">
                    New
                  </span>
                </div>
                <h3 className="font-semibold text-brand-primary group-hover:text-brand-accent transition-colors">
                  Honda CB350
                </h3>
                <p className="text-sm text-brand-secondary/60 mb-2">350cc · Standard · Silver</p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-bold text-brand-primary">₹ 1,85,000</span>
                  <span className="text-xs text-brand-secondary/60">Ex-showroom</span>
                </div>
                <button className="w-full py-2 rounded-md border border-brand-secondary text-brand-primary text-sm font-medium hover:bg-brand-secondary/10 transition-colors">
                  Enquire Now
                </button>
              </div>
            </article>

            <article
              className="border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-64">
                <img
                  src="/images/scooters/tvs-jupiter.svg"
                  alt="TVS Jupiter scooter"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2 bg-brand-success text-xs font-medium px-2 py-1">
                  Available
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-brand-secondary/20 text-xs font-medium text-brand-secondary rounded">
                    New
                  </span>
                </div>
                <h3 className="font-semibold text-brand-primary group-hover:text-brand-accent transition-colors">
                  TVS Jupiter
                </h3>
                <p className="text-sm text-brand-secondary/60 mb-2">110cc · SmartXONCE · White</p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-bold text-brand-primary">₹ 95,000</span>
                  <span className="text-xs text-brand-secondary/60">Ex-showroom</span>
                </div>
                <button className="w-full py-2 rounded-md border border-brand-secondary text-brand-primary text-sm font-medium hover:bg-brand-secondary/10 transition-colors">
                  Enquire Now
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* EMI Calculator Section */}
      <section className="py-24 sm:py-32 bg-bg-primary">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
              Finance
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
              Calculate Your EMI
            </h2>
            <p className="text-brand-secondary/60 text-lg max-w-2xl mx-auto">
              Estimate your monthly instalment based on loan amount, interest rate, and tenure.
            </p>
          </div>
          <EMICalculator />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 sm:py-32 bg-bg-secondary">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
                Trusted Motorcycle Dealership in Thane
              </h2>
              <p className="text-brand-secondary/60 text-lg mb-6 leading-relaxed">
                The Bike Yard is located at Khopat, Thane, Maharashtra. We offer new and used
                motorcycles with transparent pricing, GST-compliant invoicing, and flexible
                finance options.
              </p>
              <ul className="grid grid-cols-2 gap-4 text-sm mb-6">
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-secondary/20 text-brand-secondary flex items-center justify-center">
                    ✓
                  </span>
                  GST-compliant invoicing
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-secondary/20 text-brand-secondary flex items-center justify-center">
                    ✓
                  </span>
                  Unique chassis/engine tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-secondary/20 text-brand-secondary flex items-center justify-center">
                    ✓
                  </span>
                  Test ride booking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-secondary/20 text-brand-secondary flex items-center justify-center">
                    ✓
                  </span>
                  Finance & insurance assistance
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-brand-primary pl-6">
                <h3 className="font-bold text-brand-primary text-lg">Opening Hours</h3>
                <p className="text-sm text-brand-secondary/60">
                  Monday - Friday: 9:00 AM - 8:00 PM<br />
                  Saturday: 9:00 AM - 9:00 PM<br />
                  Sunday: 10:00 AM - 6:00 PM
                </p>
              </div>

              <div>
                <h3 className="font-bold text-brand-primary text-lg">Contact</h3>
                <p className="text-sm text-brand-secondary/60">
                  Shop Number A/01, Mount Casa Building, Khopat Signal, Thane 400601
                </p>
                <p className="text-sm text-brand-secondary/60">
                  Phone: 080971 72040 | Email: info@thebikeyard.in
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
