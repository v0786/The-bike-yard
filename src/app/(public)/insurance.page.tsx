// Insurance Page
// Follows FEATURES.md F-FIN-03, PRD.md, and DESIGN.md

import type { Metadata } from "next/metadata"

export const metadata: Metadata = {
  title: "The Bike Yard — Insurance",
  description:
    "Insurance options for motorcycles at The Bike Yard. Policy information and assistance.",
}

export function InsurancePage() {
  return (
    <section className="py-24 sm:py-32 bg-bg-primary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
              Insurance
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
              Two-Wheeler Insurance
            </h2>
            <p className="text-brand-secondary/60 text-lg mb-8 leading-relaxed">
              Protect your motorcycle with comprehensive insurance coverage. We assist with
                policy selection, renewal, and claims processing for all major brands.
            </p>

            <div className="border rounded-2xl p-6 bg-white shadow-sm mb-8">
              <h4 className="font-bold text-brand-primary text-sm uppercase mb-3">Coverage Types</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-brand-primary border-brand-primary/20 focus:ring-brand-primary"
                      checked
                    />
                    <span>
                      <strong>Third-Party Liability</strong> (Mandatory by law)
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-brand-primary border-brand-primary/20 focus:ring-brand-primary"
                      />
                    <span>
                      <strong>Comprehensive Coverage</strong> (Own damage + third-party)
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="font-semibold text-brand-primary">Insured Declared Value (IDV)</p>
                <p className="text-lg font-medium">₹ 1,00,000</p>
                <p className="text-xs text-brand-secondary">Declared value of your motorcycle</p>
              </div>

              <div className="mt-8">
                <p className="font-semibold text-brand-primary">No-Claim Bonus</p>
                <p className="text-lg font-medium">Up to 50%</p>
                <p className="text-xs text-brand-secondary">Bonus for claim-free years</p>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-bold text-brand-primary text-sm uppercase">Available Policies</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-brand-success"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 5.75a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Z" />
                  </svg>
                  <path d="M12 1L12 5.75" />
                  <span>Silver Policy</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-brand-success"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 5.75a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Z" />
                  </svg>
                  <path d="M12 1L12 5.75" />
                  <span>Gold Policy</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-brand-success"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 5.75a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Z" />
                  </svg>
                  <path d="M12 1L12 5.75" />
                  <span>Platinum Policy</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right side - assistance card */}
          <div className="space-y-6">
            <div className="border rounded-2xl p-6 bg-white shadow-sm">
              <h4 className="font-bold text-brand-primary text-sm uppercase">Our Services</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <svg
                    className="w-4 h-4 text-brand-secondary inline-block mr-2 align-middle"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.02 19.5 19.5 0 0 1-6-1.02m-3.5-3.5a2 2 0 0 0-2.73-.57l-2.17 2.72a1 1 0 0 1-2.02 0l-2.17-2.72A2 2 0 0 0 4.27 21H5a2 2 0 0 1 2 1.92 19.79 19.79 0 0 1 6.73-6.07L16.73 4.07a2 2 0 0 0-.57-2.73ZM5 10v5h14V10H5zm0 8v-2a6 6 0 0 1 12 0v2a6 6 0 0 0 12 0v-6a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0v-6Z" />
                  </svg>
                  Policy Selection Assistance
                </li>
                <li>
                  <svg
                    className="w-4 h-4 text-brand-secondary inline-block mr-2 align-middle"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.02 19.5 19.5 0 0 1-6-1.02m-3.5-3.5a2 2 0 0 0-2.73-.57l-2.17 2.72a1 1 0 0 1-2.02 0l-2.17-2.72A2 2 0 0 0 4.27 21H5a2 2 0 0 1 2 1.92 19.79 19.79 0 0 1 6.73-6.07L16.73 4.07a2 2 0 0 0-.57-2.73ZM5 10v5h14V10H5zm0 8v-2a6 6 0 0 1 12 0v2a6 6 0 0 0 12 0v-6a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0v-6Z" />
                  </svg>
                  Renewal Support
                </li>
                <li>
                  <svg
                    className="w-4 h-4 text-brand-secondary inline-block mr-2 align-middle"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.02 19.5 19.5 0 0 1-6-1.02m-3.5-3.5a2 2 0 0 0-2.73-.57l-2.17 2.72a1 1 0 0 1-2.02 0l-2.17-2.72A2 2 0 0 0 4.27 21H5a2 2 0 0 1 2 1.92 19.79 19.79 0 0 1 6.73-6.07L16.73 4.07a2 2 0 0 0-.57-2.73ZM5 10v5h14V10H5zm0 8v-2a6 6 0 0 1 12 0v2a6 6 0 0 0 12 0v-6a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0v-6Z" />
                  </svg>
                  Claims Processing
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-brand-primary text-sm uppercase">Contact</h4>
              <p className="text-sm text-brand-secondary/60">
                <svg
                  className="w-4 h-4 text-brand-secondary inline-block mr-2 align-middle"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.02 19.5 19.5 0 0 1-6-1.02m-3.5-3.5a2 2 0 0 0-2.73-.57l-2.17 2.72a1 1 0 0 1-2.02 0l-2.17-2.72A2 2 0 0 0 4.27 21H5a2 2 0 0 1 2 1.92 19.79 19.79 0 0 1 6.73-6.07L16.73 4.07a2 2 0 0 0-.57-2.73ZM5 10v5h14V10H5zm0 8v-2a6 6 0 0 1 12 0v2a6 6 0 0 0 12 0v-6a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0v-6Z" />
                  </svg>
                info@thebikeyard.in
              </p>
              <p className="text-sm text-brand-secondary/60">
                Phone: 080971 72040
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}