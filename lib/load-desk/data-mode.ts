// Where this session keeps its data. Signed-in members use the server (the
// workspace database); the unprotected local preview keeps data in this
// browser. Resolved once per page load from /api/auth/session.

import { websiteLoginUrl } from '../website-login.ts';

export type DataMode = 'remote' | 'local' | 'unavailable';

/** The one answer this page load needs from /api/auth/session. */
type Session = { mode: DataMode; loginUrl: string };

let resolved: Promise<Session> | null = null;

function session(): Promise<Session> {
  resolved ??= fetch('/api/auth/session', { cache: 'no-store' })
    .then(
      (response) =>
        response.json() as Promise<{
          mode?: string;
          user?: unknown;
          websiteUrl?: string | null;
        }>,
    )
    .then((value): Session => ({
      mode:
        value.mode === 'local'
          ? 'local'
          : value.mode === 'supabase' && value.user
            ? 'remote'
            : 'unavailable',
      loginUrl: websiteLoginUrl(value.websiteUrl),
    }))
    .catch((): Session => ({ mode: 'unavailable', loginUrl: '/login' }));
  return resolved;
}

export function dataMode(): Promise<DataMode> {
  return session().then((value) => value.mode);
}

/**
 * Where to send someone to sign in: the Client Login on the Monius website
 * this dashboard is reached from, or its own page when that is not set.
 */
export function loginUrl(): Promise<string> {
  return session().then((value) => value.loginUrl);
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };

/**
 * Calls a JSON API route. A 401 means the session ended, so the browser goes
 * to the login page. Errors come back as user-facing messages.
 */
export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  const headers = new Headers(init.headers);
  if (typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  let response: Response;
  try {
    response = await fetch(path, { cache: 'no-store', ...init, headers });
  } catch {
    return {
      ok: false,
      error: 'Could not reach the server. Check your connection and try again.',
      status: 0,
    };
  }
  const body = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    if (response.status === 401) window.location.assign('/login');
    return {
      ok: false,
      error: body.error ?? 'Something went wrong. Please try again.',
      status: response.status,
    };
  }
  return { ok: true, data: body };
}
