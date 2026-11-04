// Terms and conditions page (public)

import type { Metadata } from '@/types/metadata';
import { Navbar, Footer } from '@/components/public/Navbar';

export const metadata: Metadata = {
  title: 'Terms and Conditions — The Bike Yard',
  description: 'Terms and conditions for using The Bike Yard website and services.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-brand-primary">
      <Navbar />
      <section className="pt-24 sm:pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-primary mb-6">
            Terms and Conditions
          </h1>
          <div className="bg-white rounded-lg border border-brand-secondary p-8 sm:p-12 shadow-sm text-brand-secondary/60 leading-relaxed">
            <h2 className="text-xl font-bold text-brand-primary mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using The Bike Yard website, you agree to these terms and conditions.
            </p>
            <h2 className="text-xl font-bold text-brand-primary mb-4">2. Pricing and Availability</h2>
            <p className="mb-4">
              All prices shown are in Indian Rupees (INR) and are ex-showroom prices unless otherwise
              stated. Prices are subject to change without notice. Vehicle availability is subject to
              stock and is confirmed at the time of booking.
            </p>
            <h2 className="text-xl font-bold text-brand-primary mb-4">3. Test Rides</h2>
            <p className="mb-4">
              Test rides do not reserve or hold any vehicle. Availability is subject to prior sale.
            </p>
            <h2 className="text-xl font-bold text-brand-primary mb-4">4. GST and Invoicing</h2>
            <p className="mb-4">
              GST-compliant invoices are issued for all sales. GST rates and HSN/SAC codes are subject
              to applicable tax laws and require owner/advisor verification.
            </p>
            <h2 className="text-xl font-bold text-brand-primary mb-4">5. Contact</h2>
            <p className="mb-4">
              The Bike Yard, Khopat, Thane, Maharashtra 400601. Phone: 080971 72040.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
