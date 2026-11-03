/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DESIGN.md colour palette tokens
        brand: {
          primary: "#1B1B1B",      // Primary text/brand colour
          secondary: "#6B7280",    // Secondary text
          accent: "#EF4444",       // Accent/action colour (warnings, errors)
          success: "#10B981",      // Success states
          info: "#3B82F6",         // Info links
          warning: "#F59E0B",      // Warnings
          light: "#F3F4F6",        // Light backgrounds
          dark: "#111827",         // Dark backgrounds
        },
        bg: {
          primary: "#FFFFFF",
          secondary: "#F9FAFB",
        },
      },
      fontFamily: {
        // DESIGN.md font tokens (system fonts, swap to brand later)
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Menlo", "monospace"],
      },
      borderRadius: {
        md: "0.375rem",
        lg: "0.5rem",
      },
      screen: {
        // RESPONSIVE BREAKPOINTS from DESIGN.md
        xs: "475px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [
    // shadcn/ui plugins will be added here
  ],
}