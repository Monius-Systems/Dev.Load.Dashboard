import type { Metadata } from 'next';
import IftaPage from '@/components/ifta/ifta-page';

export const metadata: Metadata = {
  title: 'IFTA & Mileage · Load Desk',
  description: 'Estimated road miles and fuel per truck and day, from saved tickets.',
};

export default function Page() {
  return <IftaPage />;
}
