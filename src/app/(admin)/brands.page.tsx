// Brands & Models Management
// Follows FEATURES.md F-CAT-01 to F-CAT-08, DATABASE.md, DESIGN.md

import Metadata from "next/metadata"

type Brand = {
  id: string
  name: "Suzuki" | "Honda" | "TVS" | string
  description: string
  createdAt: string
}

type Model = {
  id: string
  brandId: string
  name: string
  description: string
  engineCC: number
}

export const metadata: Metadata = {
  title: "The Bike Yard — Brands & Models",
  description:
    "Manage motorcycle brands and models for The Bike Yard dealership.",
}

export function BrandsPage() {
  // Sample brands data
  const brands: Brand[] = [
    { id: "1", name: "Suzuki", description: "Japanese motorcycle manufacturer", createdAt: "2024-01-15" },
    { id: "2", name: "Honda", description: "Japanese motorcycle manufacturer", createdAt: "2024-01-15" },
    { id: "3", name: "TVS", description: "Indian motorcycle manufacturer", createdAt: "2024-01-15" },
  ]

  return (
    <section className="py-24 sm:py-32 bg-bg-primary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
            Brands & Models
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
            Manage Brands and Models
          </h2>
          <p className="text-brand-secondary/60 text-lg">
            Add and manage motorcycle brands and models available at The Bike Yard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Brands cards */}
          <div>
            <h3 className="font-bold text-brand-primary text-sm uppercase mb-4">Brands</h3>
            <div className="space-y-3">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-brand-secondary/20 flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6 text-brand-primary"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-brand-primary">{brand.name}</h4>
                  <p className="text-xs text-brand-secondary/60">{brand.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add Brand form */}
          <div>
            <h3 className="font-bold text-brand-primary text-sm uppercase mb-4">Add New Brand</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-brand-primary mb-2">Brand Name</label>
                <input
                  type="text"
                  className="w-full rounded-border border-border py-3 pl-3 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  placeholder="e.g. Suzuki"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-brand-primary mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full rounded-border border-border py-3 pl-3 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  placeholder="e.g. Japanese motorcycle manufacturer"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full rounded-md px-6 py-3 bg-brand-primary text-white font-medium hover:bg-brand-accent transition-colors"
              >
                Add Brand
              </button>
            </form>
          </div>
        </div>

        {/* Models table */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-sm">
          <h3 className="font-bold text-brand-primary text-sm uppercase mb-6">Models by Brand</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-brand-secondary">
                  <th className="text-left text-sm font-medium text-brand-primary">Model</th>
                  <th className="text-left text-sm font-medium text-brand-primary">Brand</th>
                  <th className="text-center text-sm font-medium text-brand-primary">Engine CC</th>
                  <th className="text-right text-sm font-medium text-brand-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-brand-secondary/10">
                  <td className="p-4 text-left text-sm font-medium text-brand-primary">Intruder</td>
                  <td className="p-4 text-left text-sm text-brand-secondary">Suzuki</td>
                  <td className="p-4 text-center text-sm text-brand-secondary">150</td>
                  <td className="p-4 text-right text-sm">
                    <button className="text-xs text-brand-primary hover:text-brand-accent transition-colors">Edit</button>
                    <button className="text-xs text-brand-secondary hover:text-red-600 transition-colors ml-2">Delete</button>
                  </td>
                </tr>
                <tr className="border-b border-brand-secondary/10">
                  <td className="p-4 text-left text-sm font-medium text-brand-primary">CB350</td>
                  <td className="p-4 text-left text-sm text-brand-secondary">Honda</td>
                  <td className="p-4 text-center text-sm text-brand-secondary">350</td>
                  <td className="p-4 text-right text-sm">
                    <button className="text-xs text-brand-primary hover:text-brand-accent transition-colors">Edit</button>
                    <button className="text-xs text-brand-secondary hover:text-red-600 transition-colors ml-2">Delete</button>
                  </td>
                </tr>
                <tr className="border-b border-brand-secondary/10">
                  <td className="p-4 text-left text-sm font-medium text-brand-primary">Jupiter</td>
                  <td className="p-4 text-left text-sm text-brand-secondary">TVS</td>
                  <td className="p-4 text-center text-sm text-brand-secondary">110</td>
                  <td className="p-4 text-right text-sm">
                    <button className="text-xs text-brand-primary hover:text-brand-accent transition-colors">Edit</button>
                    <button className="text-xs text-brand-secondary hover:text-red-600 transition-colors ml-2">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-right">
            <button className="rounded-md px-4 py-2 bg-brand-primary text-white text-sm font-medium hover:bg-brand-accent transition-colors">
              Add New Model
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}