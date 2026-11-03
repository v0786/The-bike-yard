// Staff Dashboard
// Follows FEATURES.md, AUTH_SECURITY.md, and DESIGN.md

import Metadata from "next/metadata"

export const metadata: Metadata = {
  title: "The Bike Yard — Staff Dashboard",
  description:
    "Staff dashboard for The Bike Yard dealership management system.",
}

export function StaffDashboardPage() {
  return (
    <section className="pt-6">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KPI Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border rounded-2xl p-6 bg-white shadow-sm">
              <div className="flex items-between justify-between">
                <span className="text-sm text-brand-secondary/60 uppercase tracking-wider">Total Sales</span>
                <span className="text-3xl font-bold text-brand-primary">47</span>
              </div>
              <p className="text-sm text-brand-secondary/60 mt-1">This month</p>
            </div>

            <div className="border rounded-2xl p-6 bg-white shadow-sm mt-4">
              <div className="flex items-between">
                <span className="text-sm text-brand-secondary/60 uppercase tracking-wider">Revenue</span>
                <span className="text-3xl font-bold text-brand-primary">₹ 85.5 Lakhs</span>
              </div>
              <p className="text-sm text-brand-secondary/60 mt-1">Current month</p>
            </div>

            <div className="border rounded-2xl p-6 bg-white shadow-sm mt-4">
              <div className="flex items-between">
                <span className="text-sm text-brand-secondary/60 uppercase tracking-wider">Active Bookings</span>
                <span className="text-3xl font-bold text-brand-primary">12</span>
              </div>
              <p className="text-sm text-brand-secondary/60 mt-1">This month</p>
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h3 className="font-bold text-brand-primary text-sm uppercase mb-4">Recent Activities</h3>
            <div className="space-y-4">
              <div className="border rounded-xl p-4 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-secondary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-brand-primary">New booking created</p>
                    <p className="text-xs text-brand-secondary/60">John booked Honda CB350</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-xl p-4 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-secondary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-brand-primary">Test ride scheduled</p>
                    <p className="text-xs text-brand-secondary/60">Test ride for Suzuki Intruder</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-xl p-4 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-secondary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-brand-primary">Payment received</p>
                    <p className="text-xs text-brand-secondary/60">₹ 50,000 - Customer XYZ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Staff-specific views */}
        <div className="space-y-6">
          {/* Sales Executive view */}
          <div>
            <h3 className="font-bold text-brand-primary text-sm uppercase">Sales Executive Tasks</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="font-medium text-brand-primary">Follow up on 5 leads</span>
                <span className="text-xs text-brand-secondary/60 float-right">Due: Yesterday</span>
              </li>
              <li>
                <span className="font-medium text-brand-primary">2 test rides to conduct</span>
                <span className="text-xs text-brand-secondary/60 float-right">Due: Today</span>
              </li>
              <li>
                <span className="font-medium text-brand-primary">Prepare 3 proposals</span>
                <span className="text-xs text-brand-secondary/60 float-right">Due: 2 days</span>
              </li>
            </ul>
          </div>

          {/* Accountant view */}
          <div>
            <h3 className="font-bold text-brand-primary text-sm uppercase">Accountant Tasks</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <span className="font-medium text-brand-primary">Reconcile payments</span>
                <span className="text-xs text-brand-secondary/60 float-right">Due: Yesterday</span>
              </li>
              <li>
                <span className="font-medium text-brand-primary">Generate monthly invoice</span>
                <span className="text-xs text-brand-secondary/60 float-right">Due: 5th</span>
              </li>
              <li>
                <span className="font-medium text-brand-primary">Record expenses</span>
                <span className="text-xs text-brand-secondary/60 float-right">Due: End of month</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}