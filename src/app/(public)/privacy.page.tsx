// Privacy policy page (public)

import type { Metadata } from '@/types/metadata';
import { Navbar, Footer } from '@/components/public/Navbar';

export const metadata: Metadata = {
  title: 'Privacy Policy — The Bike Yard',
  description: 'Privacy policy for The Bike Yard website and services.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg-primary text-brand-primary">
      <Navbar />
      <section className="pt-24 sm:pt-32 pb-24">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-primary mb-6">
            Privacy Policy
          </h1>
          <div className="bg-white rounded-lg border border-brand-secondary p-8 sm:p-12 shadow-sm text-brand-secondary/60 leading-relaxed">
            <h2 className="text-xl font-bold text-brand-primary mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide through enquiry forms, test ride bookings, and contact
              forms, including name, phone number, email address, and message.
            </p>
            <h2 className="text-xl font-bold text-brand-primary mb-4">2. Use of Information</h2>
            <p className="mb-4">
              Your information is used to respond to your enquiries, schedule test rides, and provide
              information about our motorcycles and services.
            </p>
            <h2 className="text-xl font-bold text-brand-primary mb-4">3. Data Sharing</h2>
            <p className="mb-4">
              We do not sell or share your personal information with third parties except as required
              by law or for processing finance, insurance, or RTO applications with your consent.
            </p>
            <h2 className="text-xl font-bold text-brand-primary mb-4">4. Data Retention</h2>
            <p className="mb-4">
              Customer records and documents are retained for a duration pending owner approval and
              applicable legal requirements.
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
