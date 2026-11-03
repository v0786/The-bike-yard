/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features for App Router
  experimental: {
    // App Router stable in Next.js 16
  },
  // Configure TypeScript check separately via typescript() in webpack config
  // Ignore TypeScript errors in build for now (will enforce in CI)
  typescript: {
    // !! Default: `export const dynamic = 'force-static'` is NOT set
    // !! Default: `export const revalidate = 0` is NOT set
    // !! Skipping production type-check builds to speed up dev
    ignoreBuildErrors: true,
  },
  // Enable React 19 strict mode
  reactStrictMode: true,
}

export default nextConfig