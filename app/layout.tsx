import type { Metadata } from 'next';
import AppCursor from '@/components/shell/app-cursor';
import './globals.css';

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
