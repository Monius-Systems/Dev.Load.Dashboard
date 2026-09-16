import { cookies } from 'next/headers';
import AppShell from '@/components/shell/app-shell';
import { sessionShellAccount } from '@/lib/server/auth';
import './load-desk/load-desk.css';
import './profiles.css';
import './home.css';
import './records/records.css';
import './account/account.css';

// One shell for every workspace page, so the sidebar, logo and account stay
// mounted while pages change. The signed-in name and photo are read from the
// session here, so they are in the HTML instead of appearing after the page
// starts up.
export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await cookies();
  const account = await sessionShellAccount(
    store.getAll().map((cookie) => ({ name: cookie.name, value: cookie.value })),
  );
  return <AppShell initialAccount={account}>{children}</AppShell>;
}
