/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features for App Router
  experimental: {
    // App Router stable in Next.js 16
  },
  // TypeScript errors are enforced in the build (typecheck passes with zero errors).
  // See tsconfig.json; `ignoreBuildErrors` removed once typecheck is clean.
  // Enable React 19 strict mode
  reactStrictMode: true,

  // Security headers per AUTH_SECURITY §10
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self';",
          },
        ],
      },
    ];
  },
}

export default nextConfig
