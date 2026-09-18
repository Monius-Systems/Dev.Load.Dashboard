import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { env } from 'cloudflare:workers';
import { shellAccountFrom, type ShellAccount } from '@/lib/account-display';

// Server-only sign-in for client workspaces, following the Monius client
// dashboard: Supabase email/password, httpOnly cookies, and a membership row
// in public.workspace_members. Never import from the browser.
//
// Which workspace a request works in comes from the signed-in person's
// membership — never from a constant in this build. More than one company uses
// this app, and neither may see the other's tickets, customers or invoices.

export type AuthMode = 'supabase' | 'local' | 'setup';
export type WorkspaceUser = {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  createdAt: string | null;
  lastSignInAt: string | null;
  memberSince: string | null;
  /** The workspace this person's data lives in. Scopes every query they make. */
  workspaceId: string;
  /** The stored profile photo's version (see /api/account/avatar), or null. */
  avatarVersion: string | null;
  /** The person's dashboard language ('en' or 'pl'), or null for the default. */
  locale: string | null;
};

const metadataText = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

export function authSettings() {
  const settings = env as unknown as {
    SUPABASE_URL?: string;
    SUPABASE_PUBLISHABLE_KEY?: string;
    AUTH_MODE?: string;
  };
  const mode =
    settings.AUTH_MODE ||
    (settings.SUPABASE_URL || settings.SUPABASE_PUBLISHABLE_KEY
      ? 'supabase'
      : 'local');
  return {
    mode,
    url: settings.SUPABASE_URL || '',
    key: settings.SUPABASE_PUBLISHABLE_KEY || '',
  };
}

/**
 * The unprotected browser-storage preview: only with AUTH_MODE=local, in
 * development, on a loopback address. A production build never allows it.
 */
export function localPreview(request: Request) {
  return (
    authSettings().mode === 'local' &&
    process.env.NODE_ENV === 'development' &&
    ['127.0.0.1', 'localhost', '[::1]'].includes(new URL(request.url).hostname)
  );
}

/**
 * The Monius website, for the login page's way back (WEBSITE_URL): its origin
 * over HTTPS, or plain HTTP on a loopback address in development. Null when
 * unset or unsafe.
 */
export function websiteUrl(): string | null {
  const value = (env as unknown as { WEBSITE_URL?: string }).WEBSITE_URL?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname);
    const allowed =
      url.protocol === 'https:' ||
      (url.protocol === 'http:' && loopback && process.env.NODE_ENV === 'development');
    return allowed && !url.username && !url.password ? `${url.origin}/` : null;
  } catch {
    return null;
  }
}

/** A request-scoped Supabase client whose session lives in httpOnly cookies. */
export function authClient(request: Request) {
  const settings = authSettings();
  if (!settings.url || !settings.key || settings.mode !== 'supabase') {
    throw new Error('Supabase sign-in is not configured yet.');
  }
  if (new URL(settings.url).protocol !== 'https:') {
    throw new Error('Supabase needs an HTTPS project URL.');
  }
  const changed: string[] = [];
  const cookies = parseCookieHeader(request.headers.get('cookie') || '').map(
    (cookie) => ({ name: cookie.name, value: cookie.value || '' }),
  );
  const client = createServerClient(settings.url, settings.key, {
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: new URL(request.url).protocol === 'https:',
      path: '/',
    },
    cookies: {
      getAll: () => cookies,
      setAll: (values) => {
        for (const { name, value, options } of values) {
          const found = cookies.find((cookie) => cookie.name === name);
          if (found) found.value = value;
          else cookies.push({ name, value });
          changed.push(serializeCookieHeader(name, value, options));
        }
      },
    },
  });
  const finish = (response: Response) => {
    response.headers.set('Cache-Control', 'no-store');
    for (const cookie of changed) response.headers.append('Set-Cookie', cookie);
    return response;
  };
  return { client: client as SupabaseClient, finish };
}

/**
 * The name and photo for the sidebar, from the token already held in the
 * cookies, so the shell renders them into the HTML. Display only: every request
 * for real data is authorized again, and the photo itself is fetched from
 * /api/account/avatar like any other member request.
 *
 * Read from the token's verified claims rather than from `getSession()`, whose
 * user object is whatever the cookie says it is: the claims are checked against
 * the project's signing key — locally, with the key cached, on a project using
 * asymmetric keys — so what the sidebar shows is what the token actually
 * carries. A token that does not verify shows nobody, which is what the proxy
 * has already decided for the request anyway.
 */
export async function sessionShellAccount(
  cookies: { name: string; value: string }[],
): Promise<ShellAccount | null> {
  const settings = authSettings();
  if (settings.mode !== 'supabase' || !settings.url || !settings.key) return null;
  try {
    const client = createServerClient(settings.url, settings.key, {
      // A render may not set cookies; a refreshed token is kept for the
      // browser's own next request instead.
      cookies: { getAll: () => cookies, setAll: () => {} },
    });
    const { data } = await client.auth.getClaims();
    const claims = data?.claims;
    if (!claims) return null;
    return shellAccountFrom({
      id: claims.sub,
      email: claims.email ?? null,
      user_metadata: (claims.user_metadata ?? null) as Record<string, unknown> | null,
    });
  } catch {
    return null;
  }
}

/**
 * The signed-in user with the workspace they belong to, or null when they
 * belong to none — which is how someone with an account but no access is kept
 * out.
 *
 * Row level security only ever returns this person's own membership rows, so
 * this cannot see, let alone choose, another company's workspace. Somebody in
 * more than one gets the one they joined first; a way to switch between them
 * can come when anyone actually needs it.
 */
export async function workspaceUser(
  client: SupabaseClient,
): Promise<WorkspaceUser | null> {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  const member = await client
    .from('workspace_members')
    .select('workspace_id, created_at')
    .eq('user_id', data.user.id)
    .order('created_at', { ascending: true })
    .order('workspace_id', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (member.error || !member.data) return null;
  const workspaceId = (member.data as { workspace_id?: unknown }).workspace_id;
  if (typeof workspaceId !== 'string' || !workspaceId) return null;
  const metadata = (data.user.user_metadata ?? {}) as Record<string, unknown>;
  return {
    id: data.user.id,
    email: data.user.email ?? null,
    name: metadataText(metadata.full_name),
    phone: metadataText(metadata.phone),
    createdAt: data.user.created_at ?? null,
    lastSignInAt: data.user.last_sign_in_at ?? null,
    memberSince: (member.data as { created_at?: string }).created_at ?? null,
    avatarVersion: metadataText(metadata.avatar_version),
    locale: metadataText(metadata.locale),
    workspaceId,
  };
}

/** Rejects cross-site state-changing requests. */
export const sameOrigin = (request: Request) =>
  request.headers.get('origin') === new URL(request.url).origin;

export const noStore = { 'Cache-Control': 'no-store' };
