// Test ride booking page (public)
// Follows PRD.md F-PUB-20, FEATURES.md - no stock reservation for test rides

import type { Metadata } from '@/types/metadata';
import { Navbar, Footer } from '@/components/public/Navbar';

export const metadata: Metadata = {
  title: 'Book a Test Ride — The Bike Yard',
  description: 'Book a test ride at The Bike Yard showroom in Khopat, Thane, Maharashtra.',
};

export default function TestRidePage() {
  return (
    <main className="min-h-screen bg-bg-primary text-brand-primary">
      <Navbar />
      <section className="pt-24 sm:pt-32 pb-24">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
              Test Ride
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
              Book a Test Ride
            </h2>
            <p className="text-brand-secondary/60 text-lg max-w-2xl mx-auto">
              Experience the ride before you buy. Schedule a test ride at our Khopat, Thane showroom.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-brand-secondary p-8 sm:p-12 shadow-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-primary mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="Rahul Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-primary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    placeholder="rahul@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-primary mb-2">
                    Bike of Interest
                  </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="e.g. Honda CB350"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-primary mb-2">
                    Preferred Date & Time
                  </label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full px-4 py-3 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-primary mb-2">
                    Message
                  </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 rounded-md border border-brand-secondary bg-brand-secondary/10 text-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="Any additional details…"
                    />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-md bg-brand-primary text-white font-semibold hover:bg-brand-accent transition-colors"
                >
                  Book Test Ride
                </button>
              </form>
            </div>

            <div className="mt-8 bg-brand-secondary/5 rounded-xl p-6 border border-brand-secondary/20">
              <h3 className="font-bold text-brand-primary text-lg mb-3">Showroom Location</h3>
              <p className="text-sm text-brand-secondary/60 mb-2">
                Shop Number A/01, THE BIKE YARD, Mount Casa Building, Lal Bahadur Shastri Marg,
                Opposite Amar Gyan Industrial Estate, Khopat Signal, Thane, Maharashtra 400601.
              </p>
              <p className="text-sm text-brand-secondary/60 mb-2">
                Phone: 080971 72040
              </p>
              <p className="text-sm text-brand-secondary/60">
                Test rides do not reserve stock — availability is confirmed at the time of your visit.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
