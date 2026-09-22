import type { Metadata } from 'next';
import RatesPage from '@/components/rates/rates-page';

export const metadata: Metadata = {
  title: 'Rates · Load Desk',
  description:
    'Weekly hauling rates and fuel surcharges: what to ask each customer, what they answered, and what every invoice is priced on.',
};

export default function Page() {
  return <RatesPage />;
}
