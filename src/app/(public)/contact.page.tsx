// Contact Us Page
// Follows PRD.md, DESIGN.md, FEATURES.md

import type { Metadata } from "next/metadata"

export const metadata: Metadata = {
  title: "The Bike Yard — Contact Us",
  description:
    "Contact The Bike Yard showroom in Khopat, Thane. Phone: 080971 72040. Location and map.",
}

export function ContactPage() {
  return (
    <section className="py-24 sm:py-32 bg-bg-primary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
              Contact
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
              Get in Touch
            </h2>
            <p className="text-brand-secondary/60 text-lg mb-8 leading-relaxed">
              Visit us at our showroom or send us a message. We'd love to help you
              find your perfect motorcycle.
            </p>

            <div className="space-y-6">
              <div className="border rounded-2xl p-6 bg-white shadow-sm">
                <h4 className="font-bold text-brand-primary text-sm uppercase mb-4">Showroom Location</h4>
                <p className="text-sm text-brand-secondary/60">
                  <svg
                    className="w-4 h-4 text-brand-secondary inline-block mr-2 align-middle"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.02 19.5 19.5 0 0 1-6-1.02m-3.5-3.5a2 2 0 0 0-2.73-.57l-2.17 2.72a1 1 0 0 1-2.02 0l-2.17-2.72A2 2 0 0 0 4.27 21H5a2 2 0 0 1 2 1.92 19.79 19.79 0 0 1 6.73-6.07L16.73 4.07a2 2 0 0 0-.57-2.73ZM5 10v5h14V10H5zm0 8v-2a6 6 0 0 1 12 0v2a6 6 0 0 0 12 0v-6a6 6 0 0 0-12 0v2a6 6 0 0 0 12 0v-6Z" />
                  </svg>
                  Shop No A/01, THE BIKE YARD, Mount Casa Building, Lal Bahadur Shastri Marg,
                  Opposite Amar Gyan Industrial Estate, Khopat Signal, Thane, Maharashtra 400601
                </p>
                <p className="text-sm text-brand-secondary/60 mt-2">
                  Phone: 080971 72040 | Email: info@thebikeyard.in
                </p>
              </div>

              <div className="border rounded-2xl p-6 bg-white shadow-sm">
                <h4 className="font-bold text-brand-primary text-sm uppercase mb-4">Social Links</h4>
                <div className="grid grid-cols-3 gap-3">
                  <a
                    href="https://www.instagram.com/thebikeyard.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-brand-secondary hover:text-white transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M12 2.163c3.204 0 3.584.81 4.356 1.23.771.42.894 1.134.697 1.878l-.56 3.764a5.988 5.988 0 0 1-1.844.073A5.989 5.989 0 0 1 12 5.091c-1.414 0-1.855.694-1.96 1.388l-.165.865a3.958 3.958 0 0 0-.053 1.088c0 1.815.739 3.3 1.64 3.953l.322.655.83.38a5.964 5.964 0 0 1-1.086 2.011 5.966 5.966 0 0 1-2.132.559L5.137 16.41a5.967 5.967 0 0 1-1.96-.073 5.966 5.966 0 0 0-.027 1.378l.166.865a3.961 3.961 0 0 0 .187.915c0 .513.177.95.474 1.268l.256.25.615.264a4.003 4.003 0 0 0 1.366 1.037l.316.455c-.017.208-.015.432-.003.65.024.313.183.695.41.894l3.154 1.205a3.968 3.968 0 0 0 1.528-.185 3.967 3.968 0 0 1 1.294-.518l3.093-1.195a3.965 3.965 0 0 0 .074-1.485l-3.154-1.205c-.227-.368-.366-.77-.39-1.09l-.196-.816a5.988 5.988 0 0 1-.032-1.385c0-1.815.728-3.3-1.653-3.953l-.323-.655-.83-.38a5.969 5.969 0 0 1-2.133-.558L1 5.091c-1.413 0-1.854.687-1.96 1.388l-.166.865a3.946 3.946 0 0 0-.052 1.088c0 1.815.74 3.3 1.648 3.953l.323.655.83.38a5.966 5.966 0 0 1 1.086 2.012 5.966 5.966 0 0 1 2.132.558l3.155 1.205a3.967 3.967 0 0 1 1.295.518l3.094 1.195a3.965 3.965 0 0 0 .073 1.484l3.154 1.205c.23.367.387.769.42 1.092l.196.816a5.989 5.989 0 0 1 .031 1.386Z"
                      /></svg>
                    Instagram
                  </a>
                  <a
                    href="https://maps.app.goo.gl/?q=Khopat+Signal,+Thane,+Maharashtra+400601"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-brand-secondary hover:text-white transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <path d="M12 2L2 7l10 5 10-5L12 2zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    Google Maps
                  </a>
                  <a
                    href="https://www.instagram.com/thebikeyard.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-brand-secondary hover:text-white transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M12 2.163c3.204 0 3.584.81 4.356 1.23.771.42.894 1.134.697 1.878l-.56 3.764a5.988 5.988 0 0 1-1.844.073A5.989 5.989 0 0 1 12 5.091c-1.414 0-1.855.694-1.96 1.388l-.165.865a3.958 3.958 0 0 0-.053 1.088c0 1.815.739 3.3 1.64 3.953l.322.655.83.38a5.964 5.964 0 0 1-1.086 2.011 5.966 5.966 0 0 1-2.132.559L5.137 16.41a5.967 5.967 0 0 1-1.96-.073 5.966 5.966 0 0 0-.027 1.378l.166.865a3.961 3.961 0 0 0 .187.915c0 .513.177.95.474 1.268l.256.25.615.264a4.003 4.003 0 0 0 1.366 1.037l.316.455c-.017.208-.015.432-.003.65.024.313.183.695.41.894l3.154 1.205a3.968 3.968 0 0 0 1.528-.185 3.967 3.968 0 0 1 1.294-.518l3.093-1.195a3.965 3.965 0 0 0 .074-1.485l-3.154-1.205c-.227-.368-.366-.77-.39-1.09l-.196-.816a5.988 5.988 0 0 1-.032-1.385c0-1.815.728-3.3-1.653-3.953l-.323-.655-.83-.38a5.969 5.969 0 0 1-2.133-.558L1 5.091c-1.413 0-1.854.687-1.96 1.388l-.166.865a3.946 3.946 0 0 0-.052 1.088c0 1.815.74 3.3 1.648 3.953l.323.655.83.38a5.966 5.966 0 0 1 1.086 2.012 5.966 5.966 0 0 1 2.132.558l3.155 1.205a3.967 3.967 0 0 1 1.295.518l3.094 1.195a3.965 3.965 0 0 0 .073 1.484l3.154 1.205c.23.367.387.769.42 1.092l.196.816a5.989 5.989 0 0 1 .031 1.386Z"
                      /></svg>
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <div className="border rounded-2xl p-6 bg-white shadow-sm">
              <h3 className="font-bold text-brand-primary text-sm uppercase mb-4">Send Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm text-brand-primary mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-2 pl-3"
                    required
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-brand-primary mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-2 pl-3"
                    required
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-brand-primary mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-2 pl-3"
                    placeholder="080971 72040"
                  />
                </div>
                <div>
                  <label className="block text-sm text-brand-primary mb-2">Subject</label>
                  <select
                    className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-2 pl-3"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Test Ride">Test Ride Enquiry</option>
                    <option value="Finance">Finance Question</option>
                    <option value="Parts & Accessories">Parts & Accessories</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-brand-primary mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-3 pl-3 resize-none"
                    required
                    placeholder="Tell us about your enquiry...">
                  </textarea>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md px-6 py-3 bg-brand-primary text-white font-medium hover:bg-brand-accent transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}