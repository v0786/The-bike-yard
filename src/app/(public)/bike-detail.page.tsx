// Motorcycle Detail Page
// Follows FEATURES.md bike detail, PRD.md, and DESIGN.md

import Metadata from "next/metadata"

// Types for detail page
type SpecsItem = {
  label: string
  value: string
  unit?: string
}

type EMIOptions = {
  downPayment: number
  tenure: number
  interestRate: number
  monthlyEMI: number
}

interface BikeDetailProps {
  brand: "Suzuki" | "Honda" | "TVS"
  model: string
  variant: string
  condition: "New" | "Used"
  year?: number
  kmDriven?: number
  colours: { name: string; hex: string }[]
  exShowroomPrice: number
  onRoadPrice: number
  specs: SpecsItem[]
  features: string[]
  imageGallery: string[]
  available: boolean
  EMIOptions: EMIOptions
}

export const metadata: Metadata = {
  title: "The Bike Yard — Motorcycle Detail",
  description:
    "The Bike Yard motorcycle detail page. New and second-hand motorcycles with specifications, pricing, and enquiry options.",
}

export function BikeDetailPage({
  brand,
  model,
  variant,
  condition,
  year,
  kmDriven,
  colours,
  exShowroomPrice,
  onRoadPrice,
  specs,
  features,
  imageGallery,
  available,
  EMIOptions,
}: BikeDetailProps) {
  const isUsed = condition === "Used"

  return (
    <section className="py-24 sm:py-32 bg-bg-secondary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Image Gallery */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
              {isUsed ? "Used Vehicle" : "New Vehicle"}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-primary">
              {brand} {model} {variant}
            </h1>
            <p className="text-brand-secondary/60 text-lg mb-8">
              {isUsed ? (
                `${year} · {kmDriven.toLocaleString()} km · {colours.map((c) => c.name).join(", ")}`
              ) : "Latest model available in multiple colours"}
            </p>

            <div className="space-y-3">
              {imageGallery.map((img, idx) => (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden bg-border hover:shadow-lg transition-shadow"
                >
                  <img
                    src={img}
                    alt={`${brand} ${model} detail ${idx + 1}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Available badge */}
            {available && (
              <div className="mt-6 p-4 bg-brand-success/10 border-l-4 border-brand-success rounded">
                <p className="font-medium text-brand-success">
                  ✅ Available for immediate delivery
                </p>
              </div>
            )}
            {!available && (
              <div className="mt-6 p-4 bg-brand-accent/10 border-l-4 border-brand-accent rounded">
                <p className="font-medium text-brand-accent">
                  ⚠️ Currently unavailable - enquire for restock timeline
                </p>
              </div>
            )}
          </div>

          {/* Details Sidebar */}
          <div>
            <div className="border rounded-2xl p-6 bg-white shadow-sm mb-8">
              <h2 className="font-bold text-brand-primary text-lg mb-4">Price Breakdown</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-brand-secondary/60">Ex-showroom Price</p>
                  <p className="font-medium">₹ {exShowroomPrice.toLocaleString()}</p>
                </div>
                <p className="text-brand-secondary/60">On-Road Price</p>
                <p className="font-medium">₹ {onRoadPrice.toLocaleString()}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="font-semibold text-brand-primary">EMI Calculator</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs text-brand-secondary mb-1">Down Payment</label>
                    <input
                      type="range"
                      min="0"
                      max={exShowroomPrice / 10}
                      step="10000"
                      className="w-full rounded-border border-border h-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                      defaultValue={exShowroomPrice / 20}
                    />
                    <p className="text-xs text-brand-primary">₹ {Math.round(exShowroomPrice / 20).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-xs text-brand-secondary mb-1">Tenure (months)</label>
                    <select
                      className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-2 pl-3"
                    >
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                      <option value="24">24 months</option>
                      <option value="36">36 months</option>
                      <option value="48">48 months</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="font-semibold text-brand-primary mb-2">Monthly EMI</p>
                  <p className="text-3xl font-bold text-brand-primary">
                    ₹ {EMIOptions.monthlyEMI.toLocaleString()}{EMIOptions.interestRate > 0 ? ` @ ${EMIOptions.interestRate}%` : ""}
                  </p>
                  <p className="text-xs text-brand-secondary">
                    Based on {EMIOptions.downPayment}% down payment, {EMIOptions.tenure} months tenure
                  </p>
                </div>
              </div>
            </div>

            {/* Specifications Table */}
            <div className="border rounded-2xl p-6 bg-white shadow-sm">
              <h2 className="font-bold text-brand-primary text-lg mb-6">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label}>
                    <p className="text-xs text-brand-secondary uppercase mb-1">{spec.label}</p>
                    <p className="font-medium">{spec.value}{spec.unit ? ` ${spec.unit}` : ""}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features List */}
            <div className="border rounded-2xl p-6 bg-white shadow-sm mt-6">
              <h2 className="font-bold text-brand-primary text-lg mb-6">Features</h2>
              <ul className="space-y-3 text-sm">
                {features.map((feature, idx) => (
                  <li key={idx}>
                    <svg
                      className="w-4 h-4 text-brand-success inline-block mr-2 align-middle"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 5.75a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Z" />
                    </path>
                    <path d="M12 1L12 5.75" />
                    <span className="ml-2">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                {isUsed && !available && (
                  <button
                    className="rounded-md px-6 py-3 bg-brand-accent text-white font-medium hover:bg-brand-secondary/90 transition-colors"
                  >
                    Contact for Restock
                  </button>
                )}
                <button
                  className={`rounded-md px-6 py-3 bg-brand-primary text-white font-medium hover:bg-brand-accent transition-colors ${available ? "bg-brand-success" : ""} text-white ${!available ? "opacity-50" : ""}`}>
                    {available ? "Schedule Test Ride" : "Enquire"}
                  </button>
                </button>
              </div>

              {/* WhatsApp Enquiry */}
              <div className="mt-4">
                <a
                  href="https://wa.me/918097172040?text=Hello%20The%20Bike%20Yard.%20I%20am%20interested%20in%20the%20{brand}%20{model}%20{variant}%20{%22condition%22:%20%22{condition}%22}.%20Please%20send%20me%20more%20details.%20%7C%20Year%3A%20{year || "N/A"}%20%7C%20Kilometers%3A%20{kmDriven || "N/A"}"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-brand-primary hover:text-brand-accent transition-colors">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M2.01 21L2 19l3.99-5a1.995 1.995 0 0 1 1.84-.07l.33.06a1 1 0 0 1 .98.58l1.83 4.45c.53.93.09 2.11-1.23 2.02l-4.36 2.55a1 1 0 0 1-1.21-.35l-2.16-5.26a1 1 0 0 1-.1-1.47 1 1 0 0 1 .92-.83L8.06 3.92c.55-.07.78-.41.66-.94l-2.22-3.09a1 1 0 0 1 .37-1.25l4.42-2.33a8.18 8.18 0 0 1 1.78-1.51l3.26 6.68c.52.28.85.09 1.01-.38.16-.46.07-1.09-.08-1.39L2.01 21zM6.93 15a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Zm7.78-7.22h2.06l1.96-3.76c.53-.99.08-1.99-1.03-2.05L3.17 4.06a1 1 0 0 0-.95-.37H1.96a1 1 0 1 0 0 2h2.74l-1.03 1.95c-.52.96-.09 1.99 1.03 2.05l2.05 3.88h2.06l1.96-3.76c.53-.99.08-1.99-1.03-2.05L5.11 7.78a1 1 0 0 0-.95-.37H3.17Z" />
                  </svg>
                  Message on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}