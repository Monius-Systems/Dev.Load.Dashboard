import type { Metadata } from 'next';
import CustomersPage from '@/components/profiles/customers-page';

export const metadata: Metadata = {
  title: 'Customers & Clients · Load Desk',
  description: 'Loads and flat rates for each customer.',
};

export default function Page() {
  return <CustomersPage />;
}
