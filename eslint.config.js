// ESLint flat config for The Bike Yard.
// Built on `eslint-config-next` (Next.js 16) with TypeScript strictness preserved.
const nextConfig = require('eslint-config-next');

module.exports = [
  {
    // `frontend/` is a separate, standalone Vite application with its own tooling
    // and is not part of the Next.js project lint surface. Generated output and
    // test artefacts are excluded as well.
    ignores: [
      'frontend/**',
      'dist/**',
      '.next/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'coverage/**',
    ],
  },
  ...nextConfig,
  {
    // Project-specific additions can go here without weakening the base rules.
  },
];
