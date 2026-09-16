import type { Metadata } from 'next';
import AccountPage from '@/components/account/account-page';

export const metadata: Metadata = {
  title: 'Account · Load Desk',
  description: 'Your profile, workspace access, password and sessions.',
};

export default function Page() {
  return <AccountPage />;
}
