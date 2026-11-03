// Second-Hand Vehicles Catalogue Page
// Follows FEATURES.md F-STK-01 to F-STK-07, PRD.md, and DESIGN.md

import type { Metadata } from "next/metadata"

type BikeCardProps = {
  id: string
  brand: "Suzuki" | "Honda" | "TVS"
  model: string
  condition: "Used"
  year: number
  kmDriven: number
  price: number
  colour: string
  image: string
  available: boolean
}

export const metadata: Metadata = {
  title: "The Bike Yard — Used Motorcycles and Scooters",
  description:
    "Second-hand motorcycles and scooters at The Bike Yard, Khopat, Thane. Suzuki, Honda, TVS verified used vehicles with kilometres and year.",
}

export function UsedBikesPage() {
  // Sample used bikes data - in production this comes from DATABASE.md stockUnit queries
  const usedBikes = [
    {
      id: "1",
      brand: "Suzuki",
      model: "Intruder",
      condition: "Used",
      year: 2021,
      kmDriven: 15000,
      price: 1150000,
      colour: "Black",
      image: "/placeholder-used.svg",
      available: true,
    },
    {
      id: "2",
      brand: "Honda",
      model: "CB350",
      condition: "Used",
      year: 2022,
      kmDriven: 8500,
      price: 1750000,
      colour: "Silver",
      image: "/placeholder-used.svg",
      available: true,
    },
    {
      id: "3",
      brand: "TVS",
      model: "Jupiter",
      condition: "Used",
      year: 2020,
      kmDriven: 22000,
      price: 75000,
      colour: "White",
      image: "/placeholder-used.svg",
      available: false,
    },
    {
      id: "4",
      brand: "Honda",
      model: "Activa",
      condition: "Used",
      year: 2019,
      kmDriven: 30000,
      price: 65000,
      colour: "Red",
      image: "/placeholder-used.svg",
      available: true,
    },
  ]

  return (
    <section className="py-24 sm:py-32 bg-bg-secondary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
            Second-Hand Vehicles
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
            Used Motorcycles & Scooters
          </h2>
          <p className="text-brand-secondary/60 text-lg max-w-2xl mx-auto">
            Verified second-hand motorcycles and scooters. All vehicles inspected and certified.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {usedBikes.map((bike) => (
            <article
              key={bike.id}
              className={`border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-shadow ${!bike.available ? "opacity-50" : ""}`}
            >
              <div className="relative h-64">
                <div className="absolute inset-0">
                  <div className="w-full h-full bg-gradient-to-br from-brand-secondary/30 to-brand-primary/30 rounded-t-lg overflow-hidden">
                    <img
                      src={bike.image}
                      alt={`${bike.brand} ${bike.model} ${bike.year} - ${bike.colour}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                {/* Availability badge */}
                {!bike.available && (
                  <div className="absolute top-2 right-2 bg-brand-accent text-xs font-medium px-2 py-1">
                    Unavailable
                  </div>
                )}
                {bike.available && (
                  <div className="absolute top-2 right-2 bg-brand-success text-xs font-medium px-2 py-1">
                    Available
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-brand-secondary/20 text-xs font-medium text-brand-secondary rounded">
                    Used
                  </span>
                  <span className="text-sm font-medium text-brand-primary">
                    {bike.brand} {bike.model}
                  </span>
                </div>

                <p className="text-sm text-brand-secondary/60 mb-3">
                  {bike.year} · {bike.kmDriven.toLocaleString()} km · {bike.colour}
                </p>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-medium">₹ {bike.price.toLocaleString()}</p>
                    <p className="text-xs text-brand-secondary">On-road estimate</p>
                  </div>
                  <button
                    className="text-sm font-medium text-brand-primary hover:text-brand-accent transition-colors w-full"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Filter controls */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-sm mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-brand-primary mb-2">
                Brand
              </label>
              <select className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-2 pl-3">
                <option value="">All Brands</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Honda">Honda</option>
                <option value="TVS">TVS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-brand-primary mb-2">
                Price Range
              </label>
              <input
                type="range"
                className="w-full rounded-border border-border h-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                min="50000"
                max="2000000"
                step="50000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-brand-primary mb-2">
                Year
              </label>
              <select className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-2 pl-3">
                <option value="">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-brand-primary mb-2">
                Condition
              </label>
              <select className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-2 pl-3">
                <option value="">All Conditions</option>
                <option value="Used">Used</option>
                <option value="New">New</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}