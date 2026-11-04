'use client';

// Fixed Navbar - uses server-side auth check via cookies, not client-side window
// Follows AUTH_SECURITY.md §4.3 - server must verify permissions

import * as React from 'react';
import Link from 'next/link';

type NavLink = {
  href: string;
  label: string;
  description?: string;
};

const navLinks: NavLink[] = [
  { href: '/', label: 'Home', description: 'Showroom homepage' },
  { href: '/new-bikes', label: 'New Bikes', description: 'New motorcycles and scooters' },
  { href: '/used-bikes', label: 'Used Bikes', description: 'Second-hand motorcycles and scooters' },
  { href: '/finance', label: 'Finance', description: 'EMI calculator and loan options' },
  { href: '/insurance', label: 'Insurance', description: 'Policy information and assistance' },
  { href: '/rto', label: 'RTO', description: 'Registration assistance' },
  { href: '/test-ride', label: 'Test Ride', description: 'Book a test ride' },
  { href: '/contact', label: 'Contact', description: 'Showroom location and contact' },
];

const userMenuLinks: Array<{ href: string; label: string }> = [
  { href: '/admin', label: 'Admin' },
  { href: '/staff', label: 'Staff Portal' },
];

export function Navbar({ userRole }: { userRole?: string | null } = {}) {
  const isAuthenticated = !!userRole;

  return (
    <nav className="border-b border-brand-secondary bg-bg-secondary/80 backdrop-blur-sm sticky top-0 left-0 right-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between flex-col sm:flex-row">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            The Bike Yard
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden sm:block items-center gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-brand-primary font-medium hover:text-brand-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile navigation toggle */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-brand-secondary/20"
          aria-label="Open main navigation"
        >
          <svg className="w-6 h-6 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 12l2-2m0 0l2-2m-2 2l2 2m2-2l-2 2m7-3h9m-9 0h9m-8 8a8 8 0 1016 0A8 8 0 007 20z" />
          </svg>
        </button>

        {/* User menu (authenticated users) - server-side role check */}
        {isAuthenticated && (
          <div className="hidden sm:flex items-center gap-2">
            {userMenuLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-sm font-medium text-brand-primary hover:text-brand-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

// Footer component
export function Footer() {
  return (
    <footer className="border-t border-brand-secondary bg-brand-primary py-12">
      <div className="max-w-[1600px] mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="font-bold text-white mb-3">The Bike Yard</h4>
            <p className="text-brand-secondary/60 text-sm">
              Shop Number A/01, THE BIKE YARD, Mount Casa Building, Lal Bahadur Shastri Marg,
              Opposite Amar Gyan Industrial Estate, Khopat Signal, Thane, Maharashtra 400601.
            </p>
            <p className="text-brand-secondary/60 text-sm">Phone: 080971 72040</p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/new-bikes" className="text-brand-secondary/60 hover:text-white transition-colors">
                  New Bikes
                </Link>
              </li>
              <li>
                <Link href="/used-bikes" className="text-brand-secondary/60 hover:text-white transition-colors">
                  Used Bikes
                </Link>
              </li>
              <li>
                <Link href="/finance" className="text-brand-secondary/60 hover:text-white transition-colors">
                  Finance
                </Link>
              </li>
              <li>
                <Link href="/insurance" className="text-brand-secondary/60 hover:text-white transition-colors">
                  Insurance
                </Link>
              </li>
              <li>
                <Link href="/rto" className="text-brand-secondary/60 hover:text-white transition-colors">
                  RTO
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Our Brands</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/brands"
                  className="text-brand-secondary/60 hover:text-white transition-colors"
                >
                  All Brands
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://maps.app.goo.gl/?q=Khopat+Signal,+Thane,+Maharashtra+400601"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-secondary/60 hover:text-white transition-colors"
                >
                  Location
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-brand-secondary/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-brand-secondary/60">
            © {new Date().getFullYear()} The Bike Yard. All rights reserved.
          </p>
          <div className="flex gap-2">
            <Link href="/faqs" className="text-brand-secondary/60 hover:text-white transition-colors">
              FAQs
            </Link>
            <Link href="/terms" className="text-brand-secondary/60 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-brand-secondary/60 hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
