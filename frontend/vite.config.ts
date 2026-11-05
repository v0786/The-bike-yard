import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// The SPA runs on :3000. The Next.js API/server runs on :3001.
// All API, auth and file routes are proxied so the browser stays same-origin
// and NextAuth session cookies are sent with every request.
const API_TARGET = process.env.VITE_API_TARGET ?? 'http://localhost:3001';

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
      '/auth': { target: API_TARGET, changeOrigin: true },
      '/download': { target: API_TARGET, changeOrigin: true },
      '/uploads': { target: API_TARGET, changeOrigin: true },
    },
  },
  preview: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': { target: API_TARGET, changeOrigin: true },
      '/auth': { target: API_TARGET, changeOrigin: true },
      '/download': { target: API_TARGET, changeOrigin: true },
      '/uploads': { target: API_TARGET, changeOrigin: true },
    },
  },
}));
