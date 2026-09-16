'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ChevronsUpDown, LogIn, LogOut, UserRound } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  accountSnapshot,
  initialAccountSnapshot,
  signOut,
  subscribeAccount,
} from '@/lib/account';
import type { ShellAccount } from '@/lib/account-display';
import { useT } from '@/lib/i18n/use-t';
import { shellConfig } from '@/lib/shell-config';
import { useCompanyName } from '@/components/shell/use-company-name';
import { companyInitials } from '@/lib/load-desk/business';
import { AvatarContent } from '@/components/shell/user-avatar';

/** The signed-in person in the sidebar footer, with their account menu. */
export default function AccountMenu({ initial = null }: { initial?: ShellAccount | null }) {
  const { mode, account, ready, error: loadError } = useSyncExternalStore(
    subscribeAccount,
    accountSnapshot,
    initialAccountSnapshot,
  );
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { companyName } = useCompanyName();
  const { t } = useT();
  // Until the account has loaded, what the server read from the session. Once
  // it has, that answer is the only one: a removed photo must not come back.
  const photo = account ? account.avatarUrl : (initial?.avatarUrl ?? null);

  const local = mode === 'local';
  const signedIn = mode === 'remote' && account !== null;
  const name =
    account?.name ??
    account?.email ??
    initial?.name ??
    initial?.email ??
    (local ? t('Local preview') : ready ? t('Account') : t('Loading account…'));
  // The sidebar shows just the person's name; the email is in the menu.
  const detail = local ? t('Local preview') : null;

  async function leave() {
    setBusy(true);
    setError('');
    const message = await signOut();
    if (message) {
      setError(message);
      setBusy(false);
    }
  }

  return (
    // Non-modal: opening it neither locks page scroll nor lays a backdrop under
    // the pointer, which would make the system cursor reappear over the smooth
    // cursor. It still closes on an outside click or Escape.
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className="profile account-profile"
        aria-label={t('Account: {name}. Open account menu', { name })}
      >
        <span className="profile-avatar">
          <AvatarContent name={name} src={photo} />
        </span>
        <span className="account-profile-copy">
          <strong>{name}</strong>
          {detail ? <small>{detail}</small> : null}
        </span>
        <ChevronsUpDown size={16} aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        className="account-menu w-max min-w-64 max-w-[calc(100vw-2rem)]"
      >
        <div className="account-menu-person">
          <span className="profile-avatar account-menu-avatar">
            <AvatarContent name={name} src={photo} />
          </span>
          <span>
            <strong>{name}</strong>
            <small>
              {local
                ? t('Unprotected local preview')
                : account?.name && account.email
                  ? account.email
                  : signedIn
                    ? t('Signed in')
                    : t('Not signed in')}
            </small>
          </span>
        </div>
        <div className="account-menu-workspace">
          <span className="client-avatar">{companyInitials(companyName)}</span>
          <span>
            <strong>{companyName}</strong>
            <small>
              {t(shellConfig.workspaceName)} · {local ? t('This browser only') : t('Member')}
            </small>
          </span>
        </div>
        <DropdownMenuSeparator />
        {signedIn || local ? (
          <DropdownMenuItem render={<Link href="/account" />}>
            <UserRound aria-hidden="true" />
            {t('Account profile')}
          </DropdownMenuItem>
        ) : null}
        {signedIn ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              closeOnClick={false}
              disabled={busy}
              onClick={() => void leave()}
            >
              <LogOut aria-hidden="true" />
              {busy ? t('Signing out…') : t('Sign out')}
            </DropdownMenuItem>
          </>
        ) : local ? null : (
          <DropdownMenuItem disabled={!ready} render={<Link href="/login" />}>
            <LogIn aria-hidden="true" />
            {ready ? t('Sign in') : t('Loading account…')}
          </DropdownMenuItem>
        )}
        {error || (loadError && !local) ? (
          <p role="alert" className="account-menu-error">
            {t(error || loadError || '')}
          </p>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
