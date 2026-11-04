// Main homepage bringing together all sections
// Follows DESIGN.md, FEATURES.md, and PRD.md specifications

import type { Metadata } from '@/types/metadata';
import { Navbar, Footer } from '@/components/public/Navbar';
import { HeroSection } from '@/components/public/HeroSection';

type NavLink = {
  href: string;
  label: string;
  description?: string;
};

export const metadata: Metadata = {
  title: 'The Bike Yard — Premium Motorcycle Showroom',
  description:
    'Complete motorcycle dealership management and digital showroom for The Bike Yard, Khopat, Thane, Maharashtra, India. Suzuki, Honda, TVS new and second-hand motorcycles. Rating: 4.9/5 | 267 reviews.',
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

      {/* Explore New Bikes Section */}
      <section className="py-24 sm:py-32 bg-bg-secondary">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
              New Vehicles
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
              Explore New Motorcycles & Scooters
            </h2>
            <p className="text-brand-secondary/60 text-lg max-w-2xl mx-auto">
              Suzuki, Honda and TVS new motorcycles and scooters. Find your perfect ride today.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample new bike cards */}
            <article className="border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <div className="relative h-64">
                <div className="absolute inset-0">
                  <div className="w-full h-full bg-gradient-to-br from-brand-secondary/30 to-brand-primary/30 rounded-t-lg overflow-hidden">
                    <svg
                      className="w-full h-full object-cover"
                      viewBox="0 0 400 300"
                      fill="currentColor"
                    >
                      <path d="M100 100 C 200 50, 300 150, 400 100 C 500 50, 600 150, 700 100 L 700 200 L 100 200 Z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-brand-secondary/20 text-xs font-medium text-brand-secondary rounded">
                      New
                    </span>
                  </div>
                  <h3 className="font-semibold text-brand-primary hover:text-brand-accent transition-colors">
                    Suzuki Intruder
                  </h3>
                  <p className="text-sm text-brand-secondary/60">150cc · Standard · Available</p>
                </div>
              </div>
              <div className="p-4 flex justify-between items-end">
                <div>
                  <p className="font-medium">₹ 1.25 Lakhs</p>
                  <p className="text-xs text-brand-secondary">Ex-showroom</p>
                </div>
                <button className="text-sm font-medium text-brand-primary hover:text-brand-accent transition-colors">
                  View Details
                </button>
              </div>
            </article>

            <article className="border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <div className="relative h-64">
                <div className="absolute inset-0">
                  <div className="w-full h-full bg-gradient-to-br from-brand-secondary/30 to-brand-primary/30 rounded-t-lg overflow-hidden">
                    <svg
                      className="w-full h-full object-cover"
                      viewBox="0 0 400 300"
                      fill="currentColor"
                    >
                      <path d="M100 100 C 200 50, 300 150, 400 100 C 500 50, 600 150, 700 100 L 700 200 L 100 200 Z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-brand-secondary/20 text-xs font-medium text-brand-secondary rounded">
                      New
                    </span>
                  </div>
                  <h3 className="font-semibold text-brand-primary hover:text-brand-accent transition-colors">
                    Honda CB350
                  </h3>
                  <p className="text-sm text-brand-secondary/60">350cc · Standard · Available</p>
                </div>
              </div>
              <div className="p-4 flex justify-between items-end">
                <div>
                  <p className="font-medium">₹ 1.85 Lakhs</p>
                  <p className="text-xs text-brand-secondary">Ex-showroom</p>
                </div>
                <button className="text-sm font-medium text-brand-primary hover:text-brand-accent transition-colors">
                  View Details
                </button>
              </div>
            </article>

            <article className="border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <div className="relative h-64">
                <div className="absolute inset-0">
                  <div className="w-full h-full bg-gradient-to-br from-brand-secondary/30 to-brand-primary/30 rounded-t-lg overflow-hidden">
                    <svg
                      className="w-full h-full object-cover"
                      viewBox="0 0 400 300"
                      fill="currentColor"
                    >
                      <path d="M100 100 C 200 50, 300 150, 400 100 C 500 50, 600 150, 700 100 L 700 200 L 100 200 Z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-brand-secondary/20 text-xs font-medium text-brand-secondary rounded">
                      New
                    </span>
                  </div>
                  <h3 className="font-semibold text-brand-primary hover:text-brand-accent transition-colors">
                    TVS Jupiter
                  </h3>
                  <p className="text-sm text-brand-secondary/60">110cc · Scooter · Available</p>
                </div>
              </div>
              <div className="p-4 flex justify-between items-end">
                <div>
                  <p className="font-medium">₹ 85,000</p>
                  <p className="text-xs text-brand-secondary">Ex-showroom</p>
                </div>
                <button className="text-sm font-medium text-brand-primary hover:text-brand-accent transition-colors">
                  View Details
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 sm:py-32 bg-bg-primary">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
                India&rsquo;s Most Trusted Motorcycle Showroom
              </h2>
              <p className="text-brand-secondary/60 text-lg mb-6 leading-relaxed">
                With 267 verified reviews and a 4.9/5 rating, The Bike Yard has become Thane&rsquo;s most
                trusted motorcycle dealership. We pride ourselves on transparency, quality service,
                and helping customers find their perfect motorcycle.
              </p>
              <ul className="grid grid-cols-2 gap-4 text-sm mb-6">
                <li>
                  <svg
                    className="w-4 h-4 text-brand-success inline-block mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 5.75a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Z" />
                    <path d="M12 1L12 5.75M5.25 12h1.5a4.75 4.75 0 0 1 0 9.5h-1.5M12 19.25h.0079" />
                  </svg>
                  Premium Suzuki, Honda, TVS brands
                </li>
                <li>
                  <svg
                    className="w-4 h-4 text-brand-success inline-block mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 5.75a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Z" />
                    <path d="M12 1L12 5.75M5.25 12h1.5a4.75 4.75 0 0 1 0 9.5h-1.5M12 19.25h.0079" />
                  </svg>
                  4.9⭐ rating | 267 reviews
                </li>
                <li>
                  <svg
                    className="w-4 h-4 text-brand-success inline-block mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 5.75a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Z" />
                    <path d="M12 1L12 5.75M5.25 12h1.5a4.75 4.75 0 0 1 0 9.5h-1.5M12 19.25h.0079" />
                  </svg>
                  Home: Khopat, Thane, Maharashtra
                </li>
                <li>
                  <svg
                    className="w-4 h-4 text-brand-success inline-block mr-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 5.75a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Z" />
                    <path d="M12 1L12 5.75M5.25 12h1.5a4.75 4.75 0 0 1 0 9.5h-1.5M12 19.25h.0079" />
                  </svg>
                  Test rides available
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-brand-primary pl-6">
                <h3 className="font-bold text-brand-primary text-lg">Opening Hours</h3>
                <p className="text-sm text-brand-secondary/60">
                  Monday - Friday: 9:00 AM - 8:00 PM
                  <br />
                  Saturday: 9:00 AM - 9:00 PM
                  <br />
                  Sunday: 10:00 AM - 6:00 PM
                </p>
              </div>

              <div>
                <h3 className="font-bold text-brand-primary text-lg">Contact</h3>
                <p className="text-sm text-brand-secondary/60">
                  <svg
                    className="w-4 h-4 text-brand-secondary inline-block mr-2 align-middle"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.02 19.5 19.5 0 0 1-6-1.02m-3.5-3.5a2 2 0 0 0-2.73-.57l-2.17 2.72a1 1 0 0 1-2.02 0l-2.17-2.72A2 2 0 0 0 4.27 21H5a2 2 0 0 1 2 1.92 19.79 19.79 0 0 1 6.73-6.07L16.73 4.07a2 2 0 0 0-.57-2.73ZM5 10v5h14V10H5zm0 8v-2a6 6 0 0 1 12 0v2a6 6 0 0 0 12 0v-6a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0v-6Z" />
                  </svg>
                  Shop No A/01, Mount Casa Building, Khopat Signal, Thane 400601
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
