// Finance Page
// Follows FEATURES.md F-PAY-06, F-FIN-01 to F-FIN-06, PRD.md, and DESIGN.md

import Metadata from "next/metadata"

export const metadata: Metadata = {
  title: "The Bike Yard — Finance",
  description:
    "Finance options for new and used motorcycles at The Bike Yard. EMI calculator and loan enquiry.",
}

export function FinancePage() {
  return (
    <section className="py-24 sm:py-32 bg-bg-primary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
              Finance
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
              Two-Wheeler Finance
            </h2>
            <p className="text-brand-secondary/60 text-lg mb-8 leading-relaxed">
              Get flexible financing options for your new or used motorcycle. We work with
              trusted financial partners to offer competitive EMI plans tailored to your
              budget.
            </p>

            <div className="border rounded-2xl p-6 bg-white shadow-sm mb-8">
              <h4 className="font-bold text-brand-primary text-sm uppercase mb-4">EMI Calculator</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-brand-secondary mb-1">Ex-showroom Price</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    className="w-full rounded-border border-border py-2 pl-3 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    placeholder="₹ 100000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-brand-secondary mb-1">Down Payment</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    className="w-full rounded-border border-border py-2 pl-3 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                    placeholder="₹ 20000"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm text-brand-secondary mb-1">Tenure (months)</label>
                <select
                  className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-2 pl-3"
                >
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                </select>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                <p className="font-semibold text-brand-primary text-lg">Estimated Monthly EMI</p>
                <p className="text-4xl font-bold text-brand-primary">₹ 3,500</p>
                <p className="text-sm text-brand-secondary">Based on current interest rates</p>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-bold text-brand-primary text-sm uppercase mb-3">Available Schemes</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-brand-success"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 5.75a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Z" />
                  </path>
                  <path d="M12 1L12 5.75" />
                  <span>Zero down payment schemes</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-brand-success"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 5.75a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Z" />
                  </path>
                  <path d="M12 1L12 5.75" />
                  <span>Flexible tenure up to 5 years</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-brand-success"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 5.75a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Z" />
                  </path>
                  <path d="M12 1L12 5.75" />
                  <span>Interest rates starting at competitive rates</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <h4 className="font-bold text-brand-primary text-sm uppercase">Required Documents</h4>
              <ul className="text-sm text-brand-secondary/60 space-y-2">
                <li>• Proof of identity (PAN card, Aadhaar card)</li>
                <li>• Proof of address (Aadhaar, utility bill)</li>
                <li>• Income proof (salary slips, ITR)</li>
                <li>• Passport-sized photographs</li>
                <li>• Duly filled application form</li>
              </ul>
            </div>
          </div>

          {/* Right side - financing partners card */}
          <div className="space-y-6">
            <div className="border rounded-2xl p-6 bg-white shadow-sm">
              <h4 className="font-bold text-brand-primary text-sm uppercase mb-3">Our Partners</h4>
              <p className="text-sm text-brand-secondary/60 mb-4">
                We collaborate with trusted financial institutions to provide the best
                financing options for our customers.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div
                    className="border rounded-xl p-2 bg-brand-secondary/20"
                  >
                    <svg
                      className="w-4 h-4 text-brand-primary"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    Bank 1
                  </div>
                </div>
                <div>
                  <div
                    className="border rounded-xl p-2 bg-brand-secondary/20"
                  >
                    <svg
                      className="w-4 h-4 text-brand-primary"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    NBFC 2
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-brand-primary text-sm uppercase">Apply Online</h4>
              <p className="text-sm text-brand-secondary/60">
                Start your finance application online and get approved quickly. Contact
                our team for assistance.
              </p>
              <a
                href="/contact"
                className="w-full rounded-md px-6 py-3 bg-brand-primary text-white font-medium hover:bg-brand-accent transition-colors"
              >
                Contact for Finance Assistance
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}