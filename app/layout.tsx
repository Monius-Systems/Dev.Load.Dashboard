import type { Metadata, Viewport } from 'next';
import AppCursor from '@/components/shell/app-cursor';
import './globals.css';

/**
 * The page is allowed under the status bar and the home indicator, which is
 * what lets the home page's colour run to the very top of the screen. Without
 * viewport-fit=cover iOS keeps the page inside the safe area and reports every
 * env(safe-area-inset-*) as zero, so a header can never reach the top however
 * it is laid out.
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
      </body>
    </html>
  );
}
