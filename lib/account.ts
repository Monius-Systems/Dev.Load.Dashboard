// The signed-in person's own account, shared by the sidebar account menu and
// the Account page so a saved name or photo shows everywhere at once. Members
// read and change it through /api/account; the local preview keeps it in this
// browser.

import { remembersSamePerson } from '@/lib/account-owner';
import type { ShellAccount } from '@/lib/account-display';
import { adoptAccountLocale, forgetSavedLocale } from '@/lib/i18n/store';
import { apiJson, dataMode, loginUrl, type DataMode } from '@/lib/load-desk/data-mode';

/** The account as the server sends it. */
type ServerAccount = {
  id: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  createdAt: string | null;
  lastSignInAt: string | null;
  memberSince: string | null;
  /** The stored profile photo's version, or null. */
  avatarVersion: string | null;
  /** The dashboard language saved on the account, or null. */
  locale?: string | null;
};

export type Account = ServerAccount & {
  /** Where to load the profile photo from, or null to show initials. */
  avatarUrl: string | null;
};

export type AccountSnapshot = {
  mode: DataMode | null;
  account: Account | null;
  ready: boolean;
  error: string | null;
};

export const MIN_PASSWORD = 10;

const LOCAL_KEY = 'load-desk-account';
const AVATAR_KEY = 'load-desk-account-avatar';
/**
 * The account as this browser last saw it. The photo and name are on screen
 * from the first paint, instead of after the session and account requests come
 * back, and the server's answer replaces it a moment later.
 */
const CACHE_KEY = 'load-desk-account-cache';
/** Profile photos are stored as a square this many pixels wide. */
const AVATAR_SIZE = 256;
const INITIAL: AccountSnapshot = { mode: null, account: null, ready: false, error: null };

/** Only this app's own photo addresses are shown from the remembered account. */
const safeAvatarUrl = (value: unknown) =>
  typeof value === 'string' &&
  (value.startsWith('/api/account/avatar?v=') || value.startsWith('data:image/'))
    ? value
    : null;

function readCache(): Account | null {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null') as Account | null;
    return saved && typeof saved === 'object'
      ? { ...saved, avatarUrl: safeAvatarUrl(saved.avatarUrl) }
      : null;
  } catch {
    return null;
  }
}

function writeCache(account: Account | null) {
  try {
    if (account) localStorage.setItem(CACHE_KEY, JSON.stringify(account));
    else localStorage.removeItem(CACHE_KEY);
  } catch {
    // Storage blocked: the account still loads from the server as usual.
  }
}

let snapshot: AccountSnapshot =
  typeof window === 'undefined' ? INITIAL : { ...INITIAL, account: readCache() };
let loading = false;
const listeners = new Set<() => void>();

function update(next: Partial<AccountSnapshot>) {
  snapshot = { ...snapshot, ...next };
  if ('account' in next) writeCache(snapshot.account);
  for (const listener of listeners) listener();
}

const withAvatarUrl = (account: ServerAccount | null): Account | null =>
  account && {
    ...account,
    avatarUrl: account.avatarVersion
      ? `/api/account/avatar?v=${encodeURIComponent(account.avatarVersion)}`
      : null,
  };

function readLocalAvatar(): string | null {
  try {
    const saved = localStorage.getItem(AVATAR_KEY);
    return saved?.startsWith('data:image/') ? saved : null;
  } catch {
    return null;
  }
}

function readLocal(): Account {
  let saved: { name?: unknown; phone?: unknown } = {};
  try {
    saved = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '{}') as typeof saved;
  } catch {
    // Storage blocked or corrupt: start with an empty preview profile.
  }
  const text = (value: unknown) =>
    typeof value === 'string' && value.trim() ? value.trim() : null;
  return {
    id: null,
    email: null,
    name: text(saved.name),
    phone: text(saved.phone),
    createdAt: null,
    lastSignInAt: null,
    memberSince: null,
    avatarVersion: null,
    avatarUrl: readLocalAvatar(),
  };
}

async function load() {
  if (loading || snapshot.ready) return;
  loading = true;
  const mode = await dataMode();
  if (mode === 'local') {
    update({ mode, account: readLocal(), ready: true, error: null });
  } else if (mode === 'remote') {
    const result = await apiJson<{ account: ServerAccount | null }>('/api/account');
    if (result.ok) adoptAccountLocale(result.data.account?.locale);
    update(
      result.ok
        ? { mode, account: withAvatarUrl(result.data.account), ready: true, error: null }
        : { mode, ready: true, error: result.error },
    );
  } else {
    update({ mode, ready: true, error: 'Sign-in is unavailable right now.' });
  }
  loading = false;
}

/**
 * Checks the remembered account against the session before any of it is shown.
 *
 * What this browser remembers belongs to whoever signed in here last, and the
 * sign-in cookie can change without this code running: somebody signs in as
 * another person, a session expires, a shared computer passes to the next
 * shift. The session the server read is the only authority on who is here now,
 * so when it is somebody else the remembered name, email, phone and photo are
 * dropped — along with the remembered language, which is theirs too.
 *
 * Runs once, during the shell's first render, so nothing stale ever paints.
 */
let sessionChecked = false;

export function adoptSessionAccount(session: ShellAccount | null) {
  if (sessionChecked || typeof window === 'undefined') return;
  sessionChecked = true;
  const remembered = snapshot.account;
  if (!remembered) return;
  if (remembersSamePerson(remembered.id, session?.id ?? null)) return;
  forgetSavedLocale();
  update({ account: null });
}

export function subscribeAccount(listener: () => void) {
  listeners.add(listener);
  void load();
  return () => {
    listeners.delete(listener);
  };
}

export const accountSnapshot = () => snapshot;
export const initialAccountSnapshot = () => INITIAL;

export const initialsOf = (text: string) =>
  text
    .replace(/@.*/, '')
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || '?';

/** Saves name and phone. Returns an error message, or null when saved. */
export async function saveAccountProfile(profile: {
  name: string;
  phone: string;
}): Promise<string | null> {
  const name = profile.name.replace(/\s+/g, ' ').trim();
  const phone = profile.phone.replace(/\s+/g, ' ').trim();
  if (snapshot.mode === 'local') {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ name, phone }));
    } catch {
      return 'This browser is blocking storage, so the preview cannot save.';
    }
    update({ account: readLocal() });
    return null;
  }
  const result = await apiJson<{ account: ServerAccount | null }>('/api/account', {
    method: 'PUT',
    body: JSON.stringify({ full_name: name, phone }),
  });
  if (!result.ok) return result.error;
  update({ account: withAvatarUrl(result.data.account) });
  return null;
}

/**
 * The photo as a square JPEG, small enough to store and load fast.
 *
 * What arrives here has already been cut to the square the person chose in the
 * cropper, so there is nothing left to choose and this only shrinks it. The
 * middle is taken only from a picture that is not square at all — one that
 * reached here without going through the cropper — because a photo has to end up
 * square and there is no chosen square to use. A picture that was framed is
 * never re-cut here: that would put the middle of the photograph back whatever
 * the person had dragged into the window.
 *
 * `from-image` because a photograph off a phone carries the way it was held as a
 * tag rather than in its rows of pixels, and this decodes the file rather than
 * the upright picture that was on the screen. Without it a portrait photo is
 * stored a quarter turn over.
 */
async function squarePhoto(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('That photo could not be read. Use a JPG, PNG or WebP image.');
  }
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('This browser cannot prepare the photo.');
  }
  context.imageSmoothingQuality = 'high';
  context.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    AVATAR_SIZE,
    AVATAR_SIZE,
  );
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.88),
  );
  if (!blob) throw new Error('This browser cannot prepare the photo.');
  return blob;
}

const dataUrlOf = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('This browser cannot prepare the photo.'));
    reader.onerror = () => reject(new Error('This browser cannot prepare the photo.'));
    reader.readAsDataURL(blob);
  });

/** Crops, shrinks and saves a new profile photo. Returns an error message, or null. */
export async function uploadAvatar(file: File): Promise<string | null> {
  if (!file.type.startsWith('image/')) return 'Choose an image file (JPG, PNG or WebP).';
  if (file.size > 20_000_000) return 'Choose a photo under 20 MB.';
  let photo: Blob;
  try {
    photo = await squarePhoto(file);
  } catch (error) {
    return error instanceof Error ? error.message : 'That photo could not be read.';
  }
  if (snapshot.mode === 'local') {
    try {
      localStorage.setItem(AVATAR_KEY, await dataUrlOf(photo));
    } catch {
      return 'This browser is blocking storage, so the preview cannot save the photo.';
    }
    update({ account: readLocal() });
    return null;
  }
  const result = await apiJson<{ account: ServerAccount | null }>('/api/account/avatar', {
    method: 'PUT',
    headers: { 'Content-Type': 'image/jpeg' },
    body: photo,
  });
  if (!result.ok) return result.error;
  update({ account: withAvatarUrl(result.data.account) });
  return null;
}

/** Removes the profile photo so initials show again. Returns an error message, or null. */
export async function removeAvatar(): Promise<string | null> {
  if (snapshot.mode === 'local') {
    try {
      localStorage.removeItem(AVATAR_KEY);
    } catch {
      return 'This browser is blocking storage, so the preview cannot change the photo.';
    }
    update({ account: readLocal() });
    return null;
  }
  const result = await apiJson<{ account: ServerAccount | null }>('/api/account/avatar', {
    method: 'DELETE',
  });
  if (!result.ok) return result.error;
  update({ account: withAvatarUrl(result.data.account) });
  return null;
}

/** Changes the password after the server confirms the current one. */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<string | null> {
  const result = await apiJson<{ ok: true }>('/api/account/password', {
    method: 'POST',
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
  return result.ok ? null : result.error;
}

/**
 * Signs out of this browser, or of every device. On success the browser goes
 * back to the Client Login on the Monius website, which is where this
 * dashboard is reached from; otherwise the error message comes back.
 */
export async function signOut(everywhere = false): Promise<string | null> {
  const result = everywhere
    ? await apiJson<{ ok: true }>('/api/account/sessions', { method: 'DELETE' })
    : await apiJson<{ ok: true }>('/api/auth/logout', { method: 'POST' });
  if (!result.ok) return result.error;
  // Nothing of this account stays behind for the next person at this browser.
  writeCache(null);
  window.location.assign(await loginUrl());
  return null;
}
