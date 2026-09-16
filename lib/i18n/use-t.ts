'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { localeSnapshot, serverLocaleSnapshot, subscribeLocale } from '@/lib/i18n/store';
import { makeTranslator, type Translator } from '@/lib/i18n/translate';

/** Text, counts and dates in the person's chosen language; re-renders when it changes. */
export function useT(): Translator {
  const locale = useSyncExternalStore(subscribeLocale, localeSnapshot, serverLocaleSnapshot);
  return useMemo(() => makeTranslator(locale), [locale]);
}
