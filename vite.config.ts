import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

// Same stack as the Monius website and client dashboard: vinext on Cloudflare
// Workers, packaged for OpenAI Sites. Server settings (Supabase URL and key,
// AUTH_MODE) come from .dev.vars locally and from the host in production.
export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local.
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import('@cloudflare/vite-plugin');

  return {
    css: { postcss: { plugins: [tailwindcss()] } },
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config: {
          main: 'vinext/server/fetch-handler',
          compatibility_date: '2026-08-01',
          compatibility_flags: ['nodejs_compat'],
          // Settings that are the same for every deployment of this app and
          // are not secret. The Supabase URL and publishable key stay on the
          // host so one build can serve more than one project, and a
          // service-role or secret key never belongs in any of them.
          // `.dev.vars` still wins locally, so AUTH_MODE=local keeps working.
          //
          // OPENAI_API_KEY, which reads load tickets, is deliberately NOT here.
          // Everything in `vars` is committed to this file and deployed as
          // plaintext, and a var also shadows a secret of the same name, so
          // naming it here would both publish the key and quietly replace the
          // real one. It is set as a secret on the host and locally in
          // `.dev.vars`; Cloudflare needs no declaration for a secret, which is
          // why nothing is added below. See CLIENT-LAUNCH.md step 3.
          vars: {
            AUTH_MODE: 'supabase',
            WEBSITE_URL: 'https://moniussystems.com',
          },
        },
      }),
    ],
  };
});
