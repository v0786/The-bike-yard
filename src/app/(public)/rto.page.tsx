// RTO Assistance Page
// Follows FEATURES.md F-FIN-04, PRD.md, and DESIGN.md

import type { Metadata } from '@/types/metadata';

export const metadata: Metadata = {
  title: 'The Bike Yard — RTO Assistance',
  description:
    'RTO registration assistance for new and used motorcycles at The Bike Yard, Khopat, Thane.',
};

export function RTOPage() {
  return (
    <section className="py-24 sm:py-32 bg-bg-primary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
              RTO
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
              Registration & RTO Assistance
            </h2>
            <p className="text-brand-secondary/60 text-lg mb-8 leading-relaxed">
              Get help with motorcycle registration, transfer, and RTO formalities at The Bike Yard.
              We guide you through the entire process for new and used vehicles.
            </p>

            <div className="border rounded-2xl p-6 bg-white shadow-sm mb-8">
              <h4 className="font-bold text-brand-primary text-sm uppercase mb-3">
                Services Offered
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <svg
                    className="w-4 h-4 text-brand-secondary inline-block mr-2 align-middle"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.02 19.5 19.5 0 0 1-6-1.02m-3.5-3.5a2 2 0 0 0-2.73-.57l-2.17 2.72a1 1 0 0 1-2.02 0l-2.17-2.72A2 2 0 0 0 4.27 21H5a2 2 0 0 1 2 1.92 19.79 19.79 0 0 1 6.73-6.07L16.73 4.07a2 2 0 0 0-.57-2.73ZM5 10v5h14V10H5zm0 8v-2a6 6 0 0 1 12 0v2a6 6 0 0 0 12 0v-6a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0v-6Z" />
                  </svg>
                  New Registration
                </li>
                <li>
                  <svg
                    className="w-4 h-4 text-brand-secondary inline-block mr-2 align-middle"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.02 19.5 19.5 0 0 1-6-1.02m-3.5-3.5a2 2 0 0 0-2.73-.57l-2.17 2.72a1 1 0 0 1-2.02 0l-2.17-2.72A2 2 0 0 0 4.27 21H5a2 2 0 0 1 2 1.92 19.79 19.79 0 0 1 6.73-6.07L16.73 4.07a2 2 0 0 0-.57-2.73ZM5 10v5h14V10H5zm0 8v-2a6 6 0 0 1 12 0v2a6 6 0 0 0 12 0v-6a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0v-6Z" />
                  </svg>
                  Transfer Ownership
                </li>
                <li>
                  <svg
                    className="w-4 h-4 text-brand-secondary inline-block mr-2 align-middle"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.02 19.5 19.5 0 0 1-6-1.02m-3.5-3.5a2 2 0 0 0-2.73-.57l-2.17 2.72a1 1 0 0 1-2.02 0l-2.17-2.72A2 2 0 0 0 4.27 21H5a2 2 0 0 1 2 1.92 19.79 19.79 0 0 1 6.73-6.07L16.73 4.07a2 2 0 0 0-.57-2.73ZM5 10v5h14V10H5zm0 8v-2a6 6 0 0 1 12 0v2a6 6 0 0 0 12 0v-6a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0v-6Z" />
                  </svg>
                  Duplicate RC
                </li>
                <li>
                  <svg
                    className="w-4 h-4 text-brand-secondary inline-block mr-2 align-middle"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.02 19.5 19.5 0 0 1-6-1.02m-3.5-3.5a2 2 0 0 0-2.73-.57l-2.17 2.72a1 1 0 0 1-2.02 0l-2.17-2.72A2 2 0 0 0 4.27 21H5a2 2 0 0 1 2 1.92 19.79 19.79 0 0 1 6.73-6.07L16.73 4.07a2 2 0 0 0-.57-2.73ZM5 10v5h14V10H5zm0 8v-2a6 6 0 0 1 12 0v2a6 6 0 0 0 12 0v-6a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0v-6Z" />
                  </svg>
                  Address Change
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <h4 className="font-bold text-brand-primary text-sm uppercase">Required Documents</h4>
              <ul className="text-sm text-brand-secondary/60 space-y-2">
                <li>• Original RC book</li>
                <li>• PUC certificate</li>
                <li>• Insurance policy copy</li>
                <li>• Proof of address</li>
                <li>• Proof of identity</li>
                <li>• Passport-sized photographs</li>
                <li>• Sale deed / invoice</li>
              </ul>
            </div>
          </div>

          {/* Right side - RTO info card */}
          <div className="space-y-6">
            <div className="border rounded-2xl p-6 bg-white shadow-sm">
              <h4 className="font-bold text-brand-primary text-sm uppercase">
                Maharashtra RTO Info
              </h4>
              <p className="text-sm text-brand-secondary/60">
                <strong>RTO Code:</strong> MH-04 (Thane)
                <br />
                <strong>Form 20:</strong> Application for registration of vehicle
                <br />
                <strong>Form 35:</strong> Intimation of transfer of ownership
                <br />
                <strong>Processing time:</strong> 15-30 working days
              </p>
            </div>

            <div>
              <h4 className="font-bold text-brand-primary text-sm uppercase">RTO Office</h4>
              <p className="text-sm text-brand-secondary/60">
                <svg
                  className="w-4 h-4 text-brand-secondary inline-block mr-2 align-middle"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.02 19.5 19.5 0 0 1-6-1.02m-3.5-3.5a2 2 0 0 0-2.73-.57l-2.17 2.72a1 1 0 0 1-2.02 0l-2.17-2.72A2 2 0 0 0 4.27 21H5a2 2 0 0 1 2 1.92 19.79 19.79 0 0 1 6.73-6.07L16.73 4.07a2 2 0 0 0-.57-2.73ZM5 10v5h14V10H5zm0 8v-2a6 6 0 0 1 12 0v2a6 6 0 0 0 12 0v-6a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0v-6Z" />
                </svg>
                Thane RTO Office, Ghodbunder Road, Thane West
              </p>
              <p className="text-sm text-brand-secondary/60">Phone: 022-25891234</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
