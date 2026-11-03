// Staff Login Page
// Follows AUTH_SECURITY.md, API.md §9, and DESIGN.md

import Metadata from "next/metadata"

export const metadata: Metadata = {
  title: "The Bike Yard — Staff Login",
  description:
    "Staff login for The Bike Yard dealership management system.",
}

export function StaffLoginPage() {
  return (
    <section className="min-h-screen bg-bg-primary text-brand-primary flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl max-md:p-6">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent mx-auto mb-6 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-primary">Sign In</h2>
          <p className="text-brand-secondary/60 mt-2">Staff Portal</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm text-brand-primary mb-2">Employee ID</label>
            <input
              type="text"
              className="w-full rounded-border border-border py-3 pl-3 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              placeholder="EMP-001"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-brand-primary mb-2">Password</label>
            <input
              type="password"
              className="w-full rounded-border border-border py-3 pl-3 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md px-6 py-3 bg-brand-primary text-white font-medium hover:bg-brand-accent transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-8 text-sm text-brand-secondary/60">
          <p>New staff? <a href="/register-staff" className="text-brand-primary hover:text-brand-accent transition-colors">Register</a></p>
        </div>
      </div>
    </section>
  )
}