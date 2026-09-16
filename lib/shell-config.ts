import {
  Database,
  LayoutGrid,
  ScanLine,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import clientConfig from '@/client.config.json';

export type ShellNavItem = { href: string; label: string; icon: LucideIcon };

// Branding comes from client.config.json; each client deployment has its own.
// Add a route under app/ and an entry here to give it a place in the sidebar.
export const shellConfig: {
  companyName: string;
  workspaceName: string;
  accentColor: string;
  navigation: ShellNavItem[];
  /** Top-bar titles for pages reached outside the sidebar. */
  pageTitles: Record<string, string>;
} = {
  companyName: clientConfig.companyName,
  workspaceName: clientConfig.workspaceName,
  accentColor: clientConfig.accentColor,
  pageTitles: { '/account': 'Account' },
  navigation: [
    { href: '/', label: 'Home', icon: LayoutGrid },
    { href: '/load-desk', label: 'Load Desk', icon: ScanLine },
    { href: '/records', label: 'Invoices & Tickets', icon: Database },
    { href: '/customers', label: 'Customers & Clients', icon: Users },
    { href: '/fleet', label: 'Truck Fleet', icon: Truck },
  ],
};
