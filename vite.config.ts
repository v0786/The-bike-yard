import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ['OPENAI_API_KEY', 'OPENAI_MODEL']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key];
  }
  return {
    plugins: [react(), tailwindcss(), {
      name: 'customer-chat-dev-api',
      configureServer(server) {
        for (const endpoint of ['customer-chat', 'bike-search']) server.middlewares.use(`/api/${endpoint}`, async (req, res) => {
          try {
            const { default: handler } = await server.ssrLoadModule(`/api/${endpoint}.ts`);
            await handler(req, res);
          } catch {
            res.statusCode = 503;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Chat is temporarily unavailable. Please try again.' }));
          }
        });
      },
    }],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    test: {
      exclude: ['**/node_modules/**', '**/dist/**', 'backend/**'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
