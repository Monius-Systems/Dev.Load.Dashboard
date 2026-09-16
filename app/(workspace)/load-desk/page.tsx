import type { Metadata } from 'next';
import LoadDesk from '@/components/load-desk/load-desk';

export const metadata: Metadata = {
  title: 'Load Desk',
  description: 'Review load tickets and create invoices.',
};

export default function Page() {
  return <LoadDesk />;
}
