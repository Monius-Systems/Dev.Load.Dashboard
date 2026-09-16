// The chosen dashboard language for the person using this browser. It is kept
// in this browser (so pages open in the right language straight away) and, for
// signed-in members, on their account so it follows them to other devices.

import { apiJson, dataMode } from '@/lib/load-desk/data-mode';
import { isLocale, type Locale } from '@/lib/i18n/translate';

const KEY = 'load-desk-language';

let locale: Locale = 'en';
let started = false;
const listeners = new Set<() => void>();

function readSaved(): Locale {
  try {
    const saved = localStorage.getItem(KEY);
    return isLocale(saved) ? saved : 'en';
  } catch {
    return 'en';
  }
}

function apply(next: Locale) {
  locale = next;
  document.documentElement.lang = next;
  for (const listener of listeners) listener();
}

function remember(next: Locale) {
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // Storage blocked: the choice lasts for this visit (and the account).
  }
}

export function subscribeLocale(listener: () => void) {
  listeners.add(listener);
  if (!started) {
    started = true;
    const saved = readSaved();
    if (saved !== locale) apply(saved);
    else document.documentElement.lang = saved;
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY && isLocale(event.newValue)) apply(event.newValue);
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/**
 * Forgets the language kept in this browser and goes back to English. Used
 * when a different person signs in here: the previous person's choice is no
 * more theirs than the previous person's name.
 */
export function forgetSavedLocale() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: nothing was kept to forget.
  }
  if (locale !== 'en') apply('en');
}

export const localeSnapshot = () => locale;
export const serverLocaleSnapshot = (): Locale => 'en';

/** Switches the language here and saves it. Returns an error message, or null. */
export async function setLocale(next: Locale): Promise<string | null> {
  remember(next);
  apply(next);
  if ((await dataMode()) !== 'remote') return null;
  const result = await apiJson<{ ok: true }>('/api/account/language', {
    method: 'PUT',
    body: JSON.stringify({ locale: next }),
  });
  return result.ok ? null : result.error;
}

/** Uses the language saved on the signed-in account (for example, set on another device). */
export function adoptAccountLocale(value: unknown) {
  if (!isLocale(value) || value === locale) return;
  remember(value);
  apply(value);
}
