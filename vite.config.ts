import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

// Serves the Vercel function in api/paystack-verify.ts during `npm run dev`,
// so Paystack verification works locally without `vercel dev`.
function paystackDevApi(env: Record<string, string>): Plugin {
  return {
    name: 'paystack-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/paystack-verify', async (req, res) => {
        for (const [k, v] of Object.entries(env)) process.env[k] ??= v;
        const mod = await server.ssrLoadModule('/api/paystack-verify.ts');
        const response: Response = await mod.GET(new Request(`http://localhost${req.originalUrl}`));
        res.statusCode = response.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(await response.text());
      });
    },
  };
}

export default defineConfig(({mode}) => {
  // Load all vars (not just VITE_-prefixed) so the user's lowercase Paystack names work
  const env = loadEnv(mode, process.cwd(), '');
  const paystackPublicKey = env.PAYSTACK_PUBLIC_KEY || env.paystack_public_key || '';

  return {
    plugins: [react(), tailwindcss(), paystackDevApi(env)],
    define: {
      // Public key is safe to ship to the browser; the secret key is only read by api/paystack-verify.ts
      __PAYSTACK_PUBLIC_KEY__: JSON.stringify(paystackPublicKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
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
