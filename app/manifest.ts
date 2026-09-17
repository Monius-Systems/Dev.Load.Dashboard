import type { MetadataRoute } from 'next';
import { shellConfig } from '@/lib/shell-config';

/**
 * The installed app. Its one job here is `orientation`: an app installed from
 * the browser is held to it, which is the only place a page can actually stop a
 * phone turning on its side (components/shell/upright.tsx asks, everywhere
 * else). The rest is written to match what the app already declares in
 * app/layout.tsx, so installing changes nothing but that.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Load Desk',
    short_name: 'Load Desk',
    description: 'Load tickets, invoices, customers and trucks.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    // The colour the app opens on, behind the clock and on the splash screen.
    theme_color: shellConfig.accentColor,
    background_color: shellConfig.accentColor,
    icons: [
      { src: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' },
      { src: '/favicon.ico?v=2', sizes: '64x64', type: 'image/x-icon' },
    ],
  };
}
