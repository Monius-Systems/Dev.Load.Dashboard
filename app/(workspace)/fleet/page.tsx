import type { Metadata } from 'next';
import FleetPage from '@/components/profiles/fleet-page';

export const metadata: Metadata = {
  title: 'Truck Fleet · Load Desk',
  description: 'Trucks, drivers and loads per truck.',
};

export default function Page() {
  return <FleetPage />;
}
