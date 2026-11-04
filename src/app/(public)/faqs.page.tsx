// FAQ page (public)
// Follows PRD.md F-PUB-14

import type { Metadata } from '@/types/metadata';
import { Navbar, Footer } from '@/components/public/Navbar';

export const metadata: Metadata = {
  title: 'FAQs — The Bike Yard',
  description: 'Frequently asked questions about bikes, finance, insurance, and RTO at The Bike Yard.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: 'What brands do you sell?',
      answer: 'We sell motorcycles from leading brands including Suzuki, Honda, and TVS. Visit our showroom at Khopat, Thane to see the full range.',
    },
    {
      question: 'Can I book a test ride online?',
      answer: 'Yes, you can book a test ride through our website. Test rides do not reserve stock — availability is confirmed at the time of your visit.',
    },
    {
      question: 'Do you offer finance options?',
      answer: 'Yes, we assist with finance applications through partner banks and NBFCs. EMI estimates are available on our website and are labeled as estimates.',
    },
    {
      question: 'Do you provide GST invoices?',
      answer: 'Yes, we generate GST-compliant tax invoices with CGST/SGST/IGST breakdown for all sales. GST configuration requires owner approval.',
    },
    {
      question: 'Can you help with insurance and RTO registration?',
      answer: 'Yes, we assist with insurance applications and RTO registration processes. Our staff will guide you through the required documents.',
    },
    {
      question: 'Where is your showroom located?',
      answer: 'Our showroom is at Shop Number A/01, THE BIKE YARD, Mount Casa Building, Lal Bahadur Shastri Marg, Opposite Amar Gyan Industrial Estate, Khopat Signal, Thane, Maharashtra 400601.',
    },
  ];

  return (
    <main className="min-h-screen bg-bg-primary text-brand-primary">
      <Navbar />
      <section className="pt-24 sm:pt-32 pb-24">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
              FAQs
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
              Frequently Asked Questions
            </h2>
            <p className="text-brand-secondary/60 text-lg max-w-2xl mx-auto">
              Answers to common questions about bikes, finance, insurance, and RTO.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border border-brand-secondary p-6 mb-4 shadow-sm">
                <button
                  className="w-full flex justify-between items-center text-brand-primary font-semibold text-lg hover:text-brand-accent transition-colors"
                  onClick={() => {}}
                >
                  <span>{faq.question}</span>
                  <svg className="w-5 h-5 text-brand-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className="mt-4 pt-4 border-t border-brand-secondary/10 text-brand-secondary/60 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
