import type { Metadata } from 'next';
import MileagePage from '@/components/mileage/mileage-page';

export const metadata: Metadata = {
  title: 'Mileage · Load Desk',
  description: 'See where each truck drove and how many miles it traveled.',
};

export default function Page() {
  return <MileagePage />;
}
