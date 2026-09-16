import { PL_NOUNS, PL_PATTERNS, PL_TEXT } from './pl.ts';

// The dashboard's languages. Text is written in English in the components and
// looked up in the Polish dictionary when Polish is chosen; anything not in the
// dictionary shows in English, so a missing entry never breaks a page.
// Printed invoices are not translated (they always print in English).

export const LOCALES = ['en', 'pl'] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  pl: 'Polski',
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);

export type Vars = Record<string, string | number>;

const fill = (template: string, vars?: Vars) =>
  vars
    ? template.replace(/\{(\w+)\}/g, (match, key: string) =>
        key in vars ? String(vars[key]) : match,
      )
    : template;

/** Polish plural category: 1 → one; 2–4 (not 12–14) → few; else many. */
export function polishPluralForm(count: number): 0 | 1 | 2 {
  const whole = Math.abs(Math.trunc(count));
  if (!Number.isInteger(count)) return 1;
  if (whole === 1) return 0;
  const lastTwo = whole % 100;
  const last = whole % 10;
  return last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? 1 : 2;
}

/**
 * Text in the chosen language. `text` is the English wording (with {name}
 * placeholders filled from `vars`). Polish uses the exact dictionary entry,
 * then any matching pattern (for messages built from parts, such as server
 * errors), then falls back to English.
 */
export function translate(locale: Locale, text: string, vars?: Vars): string {
  if (locale === 'pl') {
    const exact = PL_TEXT[text];
    if (exact !== undefined) return fill(exact, vars);
    const filled = fill(text, vars);
    for (const [pattern, replace] of PL_PATTERNS) {
      const match = pattern.exec(filled);
      if (match) return replace(match, (inner) => translate(locale, inner));
    }
    return filled;
  }
  return fill(text, vars);
}

/**
 * "3 tickets" / "3 bilety". `word` is the English singular; English adds "s"
 * (or uses `englishPlural`), Polish uses its three forms.
 */
export function pluralize(
  locale: Locale,
  count: number,
  word: string,
  englishPlural = `${word}s`,
): string {
  if (locale === 'pl') {
    const forms = PL_NOUNS[word];
    if (forms) return `${count} ${forms[polishPluralForm(count)]}`;
  }
  return `${count} ${count === 1 ? word : englishPlural}`;
}

/** A calendar date (YYYY-MM-DD): 9/15/2026 in English, 15.09.2026 in Polish. */
export function formatDate(locale: Locale, value: string | null | undefined): string {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value ?? '';
  const [, year, month, day] = match;
  return locale === 'pl'
    ? `${day}.${month}.${year}`
    : `${Number(month)}/${Number(day)}/${year}`;
}

export type Translator = {
  locale: Locale;
  t: (text: string, vars?: Vars) => string;
  plural: (count: number, word: string, englishPlural?: string) => string;
  date: (value: string | null | undefined) => string;
};

export const makeTranslator = (locale: Locale): Translator => ({
  locale,
  t: (text, vars) => translate(locale, text, vars),
  plural: (count, word, englishPlural) => pluralize(locale, count, word, englishPlural),
  date: (value) => formatDate(locale, value),
});
