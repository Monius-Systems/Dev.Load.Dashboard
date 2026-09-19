import type { Metadata } from 'next';
import MileagePage from '@/components/mileage/mileage-page';

export const metadata: Metadata = {
  title: 'Mileage · Load Desk',
  description: 'Estimated road miles and fuel per truck and day, from saved tickets.',
};

export default function Page() {
  return <MileagePage />;
}
