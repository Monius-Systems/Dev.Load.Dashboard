import {
  Database,
  FileText,
  LayoutGrid,
  Route,
  ScanLine,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import clientConfig from '@/client.config.json';

export type ShellNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** What the bottom bar on a phone calls it, where a tab is a thumb wide. */
  shortLabel?: string;
  /**
   * `false` keeps the page out of the bar along the bottom and out of the row a
   * swipe moves through, for a page a phone reaches from another page rather
   * than from a tab of its own. The sidebar still lists it.
   */
  phone?: false;
};

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
    { href: '/load-desk', label: 'Load Desk', icon: ScanLine, shortLabel: 'Scan' },
    { href: '/records', label: 'Invoices & Tickets', icon: Database, shortLabel: 'Invoices' },
    { href: '/customers', label: 'Customers & Clients', icon: Users, shortLabel: 'Customers' },
    { href: '/fleet', label: 'Truck Fleet', icon: Truck, shortLabel: 'Fleet' },
    { href: '/mileage', label: 'Mileage', icon: Route, shortLabel: 'Mileage' },
    { href: '/ifta', label: 'IFTA', icon: FileText, phone: false },
  ],
};
