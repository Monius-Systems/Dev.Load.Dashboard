import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dateMisread, figureMisread, singleCharacterChange } from '../lib/load-desk/recovery/learned.ts';
import { oneDigitConfused, setLearnedConfusions, LEARNED_MIN_COUNT } from '../lib/load-desk/recovery/misread.ts';
import { resolveField, UNKNOWN_FRAME, type TicketRecovery } from '../lib/load-desk/recovery/index.ts';

// What a person typing over a misread teaches — and what of it may leave the
// workspace: two characters and the vendor, never the value.

const readAs = (visible: string, vendor: string | null = 'heidelberg'): TicketRecovery => ({
  version: 1,
  vendor,
  paper: UNKNOWN_FRAME,
  fields: {
    ticket_date: { status: 'needs_review', value: null, visible_text: visible, source: null, source_clipped: false, clipped_edge: null, confidence: 0, evidence: [], reason: 'not_read' },
    tare_lb: { status: 'confirmed', value: 27720, visible_text: '27120 *', source: 'user_confirmed', source_clipped: false, clipped_edge: null, confidence: 1, evidence: [], confirmed_by_user: true },
  },
});

void test('one character changed is the misread; more is another value, and teaches nothing', () => {
  assert.deepEqual(singleCharacterChange('12182025', '12152025'), ['8', '5']);
  assert.equal(singleCharacterChange('12182025', '11152025'), null, 'two changes');
  assert.equal(singleCharacterChange('1218202', '12152025'), null, 'a different length');
  assert.equal(singleCharacterChange('12152025', '12152025'), null, 'nothing changed');
});

void test('a date typed over teaches the digit pair and the vendor, not the date', () => {
  assert.deepEqual(dateMisread(readAs('12/18/2025'), '2025-12-15'), { vendor: 'heidelberg', field: 'date', read: '8', actual: '5' });
  assert.deepEqual(dateMisread(readAs('12/13/25'), '2025-12-15'), { vendor: 'heidelberg', field: 'date', read: '3', actual: '5' }, 'a two-digit year lines up');
  assert.equal(dateMisread(readAs('12/18/2025'), '2026-01-15'), null, 'another day entirely');
  assert.equal(dateMisread(readAs('12/18/2025', null), '2025-12-15'), null, 'no vendor, nothing to file it under');
  assert.equal(dateMisread(readAs('12/1?/2025'), '2025-12-15'), null, 'a gap is not a misread');
  assert.equal(dateMisread(undefined, '2025-12-15'), null);
});

void test('a weight typed over teaches its pair; the marks around it do not', () => {
  assert.deepEqual(figureMisread(readAs('x'), 'tare_lb', 27720), { vendor: 'heidelberg', field: 'weight', read: '1', actual: '7' });
  assert.equal(figureMisread(readAs('x'), 'tare_lb', 28720), null, 'two digits off is a different figure');
});

void test('a pair the deployment has seen enough times is as good as a built-in one', () => {
  setLearnedConfusions([]);
  assert.equal(oneDigitConfused('12142025', '12152025'), false, 'a 4 for a 5 is not built in');
  setLearnedConfusions([{ read: '4', actual: '5', count: LEARNED_MIN_COUNT - 1 }]);
  assert.equal(oneDigitConfused('12142025', '12152025'), false, 'not yet');
  setLearnedConfusions([{ read: '4', actual: '5', count: LEARNED_MIN_COUNT }]);
  assert.equal(oneDigitConfused('12142025', '12152025'), true, 'learned');
  assert.equal(oneDigitConfused('12152025', '12142025'), true, 'either way round');
  // And the resolver corrects on it: a 4 read on clear print where the run says the 15th.
  const fixed = resolveField(
    'ticket_date',
    { visible: '12/14/2025', proposed: null, clipped_edge: null, partial: false },
    UNKNOWN_FRAME,
    [{ field: 'ticket_date', candidate: '2025-12-15', source: 'verified_history', strength: 'strong', note: 'run' }],
    { vendor: 'heidelberg' },
  );
  assert.equal(fixed.status, 'recovered');
  assert.equal(fixed.value, '2025-12-15');
  setLearnedConfusions([]);
});
