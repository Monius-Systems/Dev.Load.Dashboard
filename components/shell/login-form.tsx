'use client';

import { useEffect, useId, useState, type SyntheticEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useT } from '@/lib/i18n/use-t';
import { shellConfig } from '@/lib/shell-config';

type Mode = 'loading' | 'supabase' | 'local' | 'setup';

/** Invite-only email/password sign-in for the client workspace. */
export default function LoginForm() {
  const fieldId = useId();
  const { t } = useT();
  const [mode, setMode] = useState<Mode>('loading');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  // The Monius website's Client Login links here; this is the way back.
  const [websiteUrl, setWebsiteUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/session')
      .then(
        (response) =>
          response.json() as Promise<{ mode: Mode; user: unknown; websiteUrl?: string | null }>,
      )
      .then((value) => {
        if (!active) return;
        if (value.user) {
          window.location.replace('/');
          return;
        }
        setWebsiteUrl(value.websiteUrl ?? null);
        setMode(value.mode);
      })
      .catch(() => {
        if (active) setMode('setup');
      });
    return () => {
      active = false;
    };
  }, []);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password'),
        }),
      });
      const value = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(value.error || 'Sign-in failed.');
      window.location.assign('/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Sign-in failed.');
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      {websiteUrl ? (
        <a className="login-back" href={websiteUrl}>
          {t('← Back to Monius Systems')}
        </a>
      ) : null}
      <section className="login-card" aria-labelledby="login-title">
        <Image
          unoptimized
          src="/monius-logo.png"
          width={188}
          height={63}
          alt="Monius Systems"
          className="login-logo"
        />
        <p className="eyebrow">{shellConfig.companyName.toUpperCase()}</p>
        <h1 id="login-title">
          {t('Sign In to {workspace}', { workspace: t(shellConfig.workspaceName) })}
        </h1>

        {mode === 'supabase' ? (
          <form className="login-form" onSubmit={(event) => void submit(event)}>
            <div className="ld-field">
              <label htmlFor={`${fieldId}-email`}>{t('Email')}</label>
              <Input
                id={`${fieldId}-email`}
                name="email"
                type="email"
                autoComplete="username"
                required
              />
            </div>
            <div className="ld-field">
              <label htmlFor={`${fieldId}-password`}>{t('Password')}</label>
              <Input
                id={`${fieldId}-password`}
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {error ? (
              <p className="ld-status" data-tone="error" role="alert">
                {t(error)}
              </p>
            ) : null}
            <Button type="submit" size="lg" disabled={busy}>
              {busy ? t('Signing in…') : t('Sign in')}
            </Button>
            <p className="login-note">
              {t(
                'Access is by invitation. Contact Monius Systems for an account or a password reset.',
              )}
            </p>
          </form>
        ) : (
          <p className="login-note" aria-live="polite">
            {mode === 'loading'
              ? t('Checking sign-in…')
              : mode === 'local'
                ? t('This is an unprotected local preview. Data is saved in this browser only.')
                : t(
                    'Sign-in is not available right now. Please try again later or contact Monius Systems.',
                  )}
          </p>
        )}
        {mode === 'local' ? <Link href="/">{t('Open the local preview')}</Link> : null}
      </section>
    </main>
  );
}
