import Metadata from "next/metadata"
import { Navbar, Footer } from "@/components/public/Navbar"

// Type for navbar links
type NavLink = {
  href: string
  label: string
  description?: string
}

// Type for hero CTA buttons
type HeroCTA = {
  href: string
  label: string
  variant: "primary" | "secondary"
}

export const metadata: Metadata = {
  title: "The Bike Yard — Premium Motorcycle Showroom",
  description: "Complete motorcycle dealership management and digital showroom for The Bike Yard, Khopat, Thane, Maharashtra, India. Suzuki, Honda, TVS new and second-hand motorcycles.",
}

Navbar.displayName = "Navbar"
Footer.displayName = "Footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-bg-primary text-brand-primary">
      <Navbar />
      <section className="pt-24">
        {children}
      </section>
      <Footer />
    </main>
  )
}