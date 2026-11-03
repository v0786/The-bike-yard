// About Us Page
// Follows PRD.md, DESIGN.md, FEATURES.md

import type { Metadata } from '@/types/metadata';

export const metadata: Metadata = {
  title: 'The Bike Yard — About Us',
  description:
    'Learn about The Bike Yard motorcycle dealership in Khopat, Thane, Maharashtra. Rating 4.9/5 from 267 reviews.',
};

export function AboutPage() {
  return (
    <section className="py-24 sm:py-32 bg-bg-primary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
              Our Story
            </h2>
            <p className="text-brand-secondary/60 text-lg mb-8 leading-relaxed">
              The Bike Yard was established with a single mission: to provide Thane and the
              surrounding communities with premium motorcycles and scooters from trusted brands —
              Suzuki, Honda, and TVS. Located at Shop No A/01, Mount Casa Building, Lal Bahadur
              Shastri Marg, opposite Amar Gyan Industrial Estate, Khopat Signal, we've been serving
              the local riding community since our founding.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <h3 className="font-bold text-brand-primary text-sm uppercase">4.9⭐ Rating</h3>
                <p className="text-sm text-brand-secondary/60">267+ verified reviews</p>
              </div>
              <div>
                <h3 className="font-bold text-brand-primary text-sm uppercase">Trusted Since</h3>
                <p className="text-sm text-brand-secondary/60">2018</p>
              </div>
            </div>

            <blockquote className="pt-8 border-t border-border border-brand-secondary/30 ml-8">
              <p className="text-brand-secondary/60 italic">
                "The Bike Yard made finding my perfect Honda CB350 effortless. The team was
                knowledgeable, transparent, and never pressured me. Highly recommended!"
              </p>
              <cite className="font-medium text-brand-primary mt-2">— Verified Customer</cite>
            </blockquote>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-brand-primary text-sm uppercase">Our Brands</h3>
              <ul className="grid grid-cols-3 gap-2">
                <li>
                  <div className="border rounded-xl p-3 bg-brand-secondary/20">
                    <svg
                      className="w-6 h-6 text-brand-primary"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span>Suzuki</span>
                  </div>
                </li>
                <li>
                  <div className="border rounded-xl p-3 bg-brand-secondary/20">
                    <svg
                      className="w-6 h-6 text-brand-primary"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span>Honda</span>
                  </div>
                </li>
                <li>
                  <div className="border rounded-xl p-3 bg-brand-secondary/20">
                    <svg
                      className="w-6 h-6 text-brand-primary"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span>TVS</span>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-brand-primary text-sm uppercase">Opening Hours</h3>
              <p className="text-sm text-brand-secondary/60">
                Monday - Friday: 9:00 AM - 8:00 PM
                <br />
                Saturday: 9:00 AM - 9:00 PM
                <br />
                Sunday: 10:00 AM - 6:00 PM
              </p>
            </div>

            <div>
              <h3 className="font-bold text-brand-primary text-sm uppercase">Contact</h3>
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

        {/* Right side - hero image */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/about-hero.jpg"
              alt="The Bike Yard showroom exterior"
              className="w-full h-[400px] object-cover"
              loading="lazy"
            />
            <div className="p-6 bg-brand-primary text-white text-center">
              <h3 className="font-bold">Visit Us</h3>
              <p className="text-white/70 mt-1">Shop No A/01, Mount Casa Building</p>
              <p className="text-white/70 small">Khopat Signal, Thane 400601</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
