import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig, type Plugin } from 'vite';

// Same stack as the Monius website and client dashboard: vinext on Cloudflare
// Workers, packaged for OpenAI Sites. Server settings (Supabase URL and key,
// AUTH_MODE) come from .dev.vars locally and from the host in production.
/**
 * Web workers are the browser's. The scanner's worker is OpenCV — ten megabytes
 * of it — and rectify.ts loads it behind `import.meta.env.SSR`, so the server
 * builds drop the import. The reference scan that precedes them ("[2/5] analyze
 * server references") does not: it reads every import in every module, on
 * purpose, to find the server functions. Following a `?worker` import starts
 * Vite's own nested build of the worker, which walked into the Emscripten
 * output asking for `fs`, `path` and `crypto` — the warning that used to print
 * on every build — and, in the real server build, shipped the worker inside the
 * Worker script where nothing could run it.
 *
 * So in the server environments a `?worker` module is a stub: a constructor
 * that cannot be called, because there is no page to run a worker on. The
 * nested build never starts, nothing of the worker is bundled for the server,
 * and the browser build, which is where the worker is really built, is not
 * touched. (Marking the package external would be simpler, but the Cloudflare
 * plugin forbids externals in a Worker, which cannot resolve them.)
 */
const WORKER_IMPORT = /[?&](?:shared)?worker(?:&|$)/;
const workersBrowserOnly = (): Plugin => ({
  name: 'workers-browser-only',
  enforce: 'pre',
  applyToEnvironment: (environment) => environment.config.consumer === 'server',
  load: {
    filter: { id: WORKER_IMPORT },
    handler: () =>
      'export default class ServerWorker { constructor() { throw new Error("Web workers are not available on the server."); } }',
  },
});

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
      workersBrowserOnly(),
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
