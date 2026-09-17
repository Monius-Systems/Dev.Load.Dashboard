import type { Metadata, Viewport } from 'next';
import AppCursor from '@/components/shell/app-cursor';
import Upright from '@/components/shell/upright';
import './globals.css';

/**
 * The page is allowed under the status bar and the home indicator, which is
 * what lets the home page's colour run to the very top of the screen. Without
 * viewport-fit=cover iOS keeps the page inside the safe area and reports every
 * env(safe-area-inset-*) as zero, so a header can never reach the top however
 * it is laid out.
 */
/**
 * No theme-color, on purpose.
 *
 * Given one, Safari stops letting the page reach the top of the screen: it
 * keeps a strip behind the clock and the battery and fills it with that colour
 * flat — the solid blue band above the page. Given none, the page runs to the
 * physical top edge under viewport-fit=cover, whatever is at the top of it is
 * what is behind the clock, and Safari lays its own soft scrim over that so
 * the time stays readable. That is the fade this app is meant to have: the
 * band's blue under the clock at the top of a page, the sheet's white under it
 * once the page has been scrolled, and no flat strip at any point.
 *
 * It costs the tinted address bar on Android, which is the same flat fill by
 * another name. The installed app keeps its own colour, in app/manifest.ts.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Load Desk',
  // The Monius Systems mark. Only the .ico is offered for the tab: browsers
  // prefer an SVG when one is listed, and the favicon.svg that came with the
  // starter is a different logo entirely.
  // ?v= is a cache-buster, not a path: browsers hold on to a favicon long past
  // a normal refresh, so a changed icon needs a changed address. Bump it when
  // the icon itself changes.
  icons: {
    icon: [{ url: '/favicon.ico?v=2', type: 'image/x-icon', sizes: '64x64' }],
    shortcut: '/favicon.ico?v=2',
    apple: { url: '/apple-touch-icon.png?v=2', type: 'image/png', sizes: '180x180' },
  },
  description: 'Load tickets, invoices, customers and trucks.',
  /**
   * Added to a home screen, iOS decides for itself what happens behind the
   * clock and the battery, and it does not look at theme-color to do it —
   * that is Android's. With the default style it keeps that strip, fills it
   * white, and starts the page underneath, which is the white band above the
   * header. "black-translucent" hands the strip to the page: the header runs
   * up behind the clock, and env(safe-area-inset-top) finally reports the
   * height of it so the greeting can be padded clear.
   */
  appleWebApp: {
    capable: true,
    title: 'Load Desk',
    statusBarStyle: 'black-translucent',
  },
  other: {
    // Next writes the standardised mobile-web-app-capable only. Safari has
    // wanted the apple-prefixed name for standalone since long before that,
    // and the status-bar style above is read only while standalone — so
    // without this line the strip stays white however it is styled.
    'apple-mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <AppCursor />
        <Upright />
      </body>
    </html>
  );
}
