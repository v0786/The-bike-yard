// Inventory Management
// Follows FEATURES.md F-STK-01 to F-STK-07, DATABASE.md, DESIGN.md

import Metadata from "next/metadata"

type StockUnit = {
  id: string
  chassisNumber: string
  engineNumber: string
  variant: { model: string; brand: string; colour: string }
  purchasePrice: number
  receivedDate: string
  currentStatus: "available" | "reserved" | "sold" | "delivered"
}

export const metadata: Metadata = {
  title: "The Bike Yard — Inventory",
  description:
    "Manage motorcycle inventory, stock movements, and stock units for The Bike Yard.",
}

export function InventoryPage() {
  const stockUnits: StockUnit[] = [
    {
      id: "1",
      chassisNumber: "ME4JC654K98765432",
      engineNumber: "JC65E98765432",
      variant: { model: "Intruder", brand: "Suzuki", colour: "Black" },
      purchasePrice: 6500000,
      receivedDate: "2024-01-15",
      currentStatus: "available",
    },
    {
      id: "2",
      chassisNumber: "ME4JC654K98765433",
      engineNumber: "JC65E98765433",
      variant: { model: "CB350", brand: "Honda", colour: "Silver" },
      purchasePrice: 8200000,
      receivedDate: "2024-01-20",
      currentStatus: "reserved",
    },
    {
      id: "3",
      chassisNumber: "ME4JC654K98765434",
      engineNumber: "JC65E98765434",
      variant: { model: "Jupiter", brand: "TVS", colour: "White" },
      purchasePrice: 95000,
      receivedDate: "2024-01-25",
      currentStatus: "sold",
    },
    {
      id: "4",
      chassisNumber: "ME4JC654K98765435",
      engineNumber: "JC65E98765435",
      variant: { model: "Access 125", brand: "Suzuki", colour: "Red" },
      purchasePrice: 105000,
      receivedDate: "2024-02-01",
      currentStatus: "available",
    },
  ]

  return (
    <section className="py-24 sm:py-32 bg-bg-primary">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-brand-primary to-brand-accent text-xs font-medium text-white uppercase tracking-wider mb-6">
            Inventory
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-primary">
            Motorcycle Inventory
          </h2>
          <p className="text-brand-secondary/60 text-lg">
            Manage stock units, track status, and record movements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status cards */}
          {[["available", "Available", "bg-brand-success/10", "text-brand-success"], ["reserved", "Reserved", "bg-brand-secondary/10", "text-brand-secondary"], ["sold", "Sold", "bg-brand-accent/10", "text-brand-accent"], ["delivered", "Delivered", "bg-brand-primary/10", "text-brand-primary"]].map(
            ([status, label, bg, color]) => {
              const count = stockUnits.filter((u) => u.currentStatus === status).length
              return (
                <div
                  key={status}
                  className={`border rounded-2xl p-6 ${bg} ${color} text-sm`}
                )
                >
                  <div className="w-12 h-12 rounded-lg mb-3 flex items-center justify-center">
                    <svg
                      className={`w-6 h-6 ${color}`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      {status === "available" &&
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />}
                      {status === "reserved" &&
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />}
                      {status === "sold" &&
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />}
                      {status === "delivered" &&
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />}
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">{label}</h3>
                  <p className="">{count} units</p>
                </div>
              )
            }
          )}
        </div>

        {/* Stock units table */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-sm">
          <h3 className="font-bold text-brand-primary text-sm uppercase mb-6">Stock Units</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-brand-secondary">
                  <th className="text-left text-sm font-medium text-brand-primary">Chassis Number</th>
                  <th className="text-left text-sm font-medium text-brand-primary">Engine Number</th>
                  <th className="text-left text-sm font-medium text-brand-primary">Model & Colour</th>
                  <th className="text-center text-sm font-medium text-brand-primary">Purchase Price</th>
                  <th className="text-center text-sm font-medium text-brand-primary">Received Date</th>
                  <th className="text-center text-sm font-medium text-brand-primary">Status</th>
                  <th className="text-right text-sm font-medium text-brand-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stockUnits.map((unit) => {
                  const statusClasses = {
                    available: "bg-brand-success/20 text-brand-success",
                    reserved: "bg-brand-secondary/20 text-brand-secondary",
                    sold: "bg-brand-accent/20 text-brand-accent",
                    delivered: "bg-brand-primary/20 text-brand-primary",
                  }
                  const statusClass = statusClasses[unit.currentStatus]

                  return (
                    <tr key={unit.id} className="border-b border-brand-secondary/10">
                      <td className="p-4 text-left text-sm font-medium text-brand-primary">
                        {unit.chassisNumber}
                      </td>
                      <td className="p-4 text-left text-sm text-brand-secondary">
                        {unit.engineNumber}
                      </td>
                      <td className="p-4 text-left text-sm">
                        {unit.variant.brand} {unit.variant.model} - {unit.variant.colour}
                      </td>
                      <td className="p-4 text-center text-sm">
                        ₹ {unit.purchasePrice.toLocaleString()}
                      </td>
                      <td className="p-4 text-center text-sm text-brand-secondary/60">
                        {unit.receivedDate}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusClasses[unit.currentStatus]}`}>
                          {unit.currentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right text-sm">
                        <button className="text-xs text-brand-primary hover:text-brand-accent transition-colors mr-1">Edit</button>
                        <button className="text-xs text-brand-secondary hover:text-red-600 transition-colors">Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Stock movement form */}
          <div className="mt-8 pt-8 border-t border-border">
            <h4 className="font-bold text-brand-primary text-sm uppercase mb-4">Record Stock Inward</h4>
            <form className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-brand-primary mb-2">Chassis Number</label>
                <input
                  type="text"
                  className="w-full rounded-border border-border py-3 pl-3 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  placeholder="ME4JC654K98765432"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-brand-primary mb-2">Engine Number</label>
                <input
                  type="text"
                  className="w-full rounded-border border-border py-3 pl-3 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  placeholder="JC65E98765432"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-brand-primary mb-2">Variant</label>
                <select
                  className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-3 pl-3"
                >
                  <option value="">Select variant</option>
                  <option>Suzuki Intruder 150cc</option>
                  <option>Honda CB350 350cc</option>
                  <option>TVS Jupiter 110cc</option>
                  <option>Suzuki Access 125</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-brand-primary mb-2">Colour</label>
                <select
                  className="w-full rounded-border border-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 py-3 pl-3"
                >
                  <option value="">Select colour</option>
                  <option>Black</option>
                  <option>Silver</option>
                  <option>White</option>
                  <option>Red</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-brand-primary mb-2">Purchase Price (paise)</label>
                <input
                  type="number"
                  className="w-full rounded-border border-border py-3 pl-3 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  placeholder="6500000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-brand-primary mb-2">Received Date</label>
                <input
                  type="date"
                  className="w-full rounded-border border-border py-3 pl-3 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  required
                />
              </div>
              <button
                type="submit"
                className="col-span-2 rounded-md px-6 py-3 bg-brand-primary text-white font-medium hover:bg-brand-accent transition-colors"
              >
                Record Stock Inward
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}