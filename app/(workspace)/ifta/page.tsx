import type { Metadata } from 'next';
import IftaPage from '@/components/ifta/ifta-page';

export const metadata: Metadata = {
  title: 'IFTA · Load Desk',
  description: 'Quarterly mileage reporting for IFTA.',
};

export default function Page() {
  return <IftaPage />;
}
