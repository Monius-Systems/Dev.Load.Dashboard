import type { Metadata } from 'next';
import RecordsPage from '@/components/records/records-page';

export const metadata: Metadata = {
  title: 'Invoices & Tickets · Load Desk',
  description: 'Search, reprint and export saved invoices and load tickets.',
};

export default function Page() {
  return <RecordsPage />;
}
