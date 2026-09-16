import type { Metadata } from 'next';
import HomePage from '@/components/home/home-page';

export const metadata: Metadata = {
  title: 'Overview · Load Desk',
  description: 'Loads, invoices and trucks at a glance.',
};

export default function Page() {
  return <HomePage />;
}
