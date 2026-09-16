import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDate,
  isLocale,
  pluralize,
  polishPluralForm,
  translate,
} from '../lib/i18n/translate.ts';
import { PL_NOUNS, PL_TEXT } from '../lib/i18n/pl.ts';

void test('English text is shown as written, with placeholders filled', () => {
  assert.equal(translate('en', 'Language'), 'Language');
  assert.equal(translate('en', 'Invoice {number} saved', { number: 1001 }), 'Invoice 1001 saved');
  assert.equal(translate('en', 'Keep {missing}'), 'Keep {missing}');
});

void test('Polish uses the dictionary and falls back to English for anything missing', () => {
  assert.equal(translate('pl', 'Language'), 'Język');
  assert.equal(translate('pl', 'A sentence nobody translated'), 'A sentence nobody translated');
});

void test('Polish plural forms follow 1, 2–4 and 5+ (with 12–14 as 5+)', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 11, 12, 14, 21, 22, 25, 102, 112, 0].map(polishPluralForm), [0, 1, 1, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2]);
});

void test('counts read naturally in both languages', () => {
  assert.equal(pluralize('en', 1, 'ticket'), '1 ticket');
  assert.equal(pluralize('en', 3, 'ticket'), '3 tickets');
  assert.equal(pluralize('en', 2, 'Truck', 'Trucks'), '2 Trucks');
  if (PL_NOUNS.ticket) {
    assert.equal(pluralize('pl', 1, 'ticket'), `1 ${PL_NOUNS.ticket[0]}`);
    assert.equal(pluralize('pl', 3, 'ticket'), `3 ${PL_NOUNS.ticket[1]}`);
    assert.equal(pluralize('pl', 7, 'ticket'), `7 ${PL_NOUNS.ticket[2]}`);
  }
  assert.equal(pluralize('pl', 2, 'untranslated-thing'), '2 untranslated-things');
});

void test('dates use the local style', () => {
  assert.equal(formatDate('en', '2026-09-05'), '9/5/2026');
  assert.equal(formatDate('pl', '2026-09-05'), '05.09.2026');
  assert.equal(formatDate('pl', null), '');
  assert.equal(formatDate('pl', 'not a date'), 'not a date');
});

void test('only English and Polish are accepted', () => {
  assert.equal(isLocale('en'), true);
  assert.equal(isLocale('pl'), true);
  assert.equal(isLocale('de'), false);
  assert.equal(isLocale(null), false);
});

void test('every Polish entry has text', () => {
  for (const [english, polish] of Object.entries(PL_TEXT)) {
    assert.ok(polish.trim(), `missing Polish for "${english}"`);
  }
});

void test('Polish entries keep every placeholder of the English text', () => {
  const names = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
  for (const [english, polish] of Object.entries(PL_TEXT)) {
    assert.deepEqual(names(polish), names(english), `placeholders differ for "${english}"`);
  }
});

void test('messages built from parts are translated too', () => {
  assert.equal(translate('pl', 'Missing required field: ticket date'), 'Brak wymaganego pola: data kwitu');
  assert.equal(translate('pl', 'Weight arithmetic differs by 1,200 lb'), 'Wagi różnią się o 1,200 lb');
  assert.equal(translate('pl', 'Sep 4, 2026'), '4 wrz 2026');
  assert.equal(translate('pl', '1 PM – 2 PM'), '13:00–14:00');
  assert.equal(translate('pl', 'Reading text · page 2 of 3'), 'Odczytywanie tekstu · strona 2 z 3');
  assert.equal(
    translate('pl', '12.50 Tons × $8.00 + $20.00 fuel = $120.00'),
    '12.50 t × $8.00 + $20.00 za paliwo = $120.00',
  );
  assert.equal(pluralize('pl', 3, 'customer'), '3 klienci');
  assert.equal(pluralize('pl', 5, 'invoice'), '5 faktur');
});
