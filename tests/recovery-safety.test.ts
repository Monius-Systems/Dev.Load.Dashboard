import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FIELD_ORDER,
  applyRecovery,
  fieldClass,
  resolveField,
  resolveTicket,
  SILENT_FIELDS,
  UNKNOWN_FRAME,
  type Evidence,
  type EvidenceSource,
  type ObservedField,
  type ObservedTicket,
  type PaperFrame,
  type RecoveryContext,
} from '../lib/load-desk/recovery/index.ts';
import { parseRecovery } from '../lib/load-desk/record-input.ts';
import { emptyTicket } from '../lib/load-desk/types.ts';

// The guarantees the whole layer exists for, checked across every source and
// strength rather than at one example of each. These are the tests that are
// allowed to fail a release: a partial number that leaves with a value, or a
// name filled in from the pile, is the failure this feature was built to
// prevent, and one source added to the table later must not quietly acquire
// the power to do it.

const SOURCES: EvidenceSource[] = [
  'visible',
  'model_proposed',
  'same_ticket',
  'vendor_rule',
  'verified_profile',
  'verified_history',
  'historical_relationship',
  'batch_context',
  'user_correction',
  'user_confirmed',
];

const STRENGTHS: Evidence['strength'][] = ['strong', 'moderate', 'weak'];

const frame = (patch: Partial<PaperFrame> = {}): PaperFrame => ({
  detected: true,
  left: 'inside',
  right: 'inside',
  top: 'inside',
  bottom: 'inside',
  ...patch,
});

const seen = (patch: Partial<ObservedField> = {}): ObservedField => ({
  visible: null,
  proposed: null,
  clipped_edge: null,
  partial: false,
  ...patch,
});

const here: RecoveryContext = { vendor: 'ontario-trap-rock', customer: 'Markham Paving' };

const derives = (source: EvidenceSource, strength: Evidence['strength']) =>
  strength === 'strong' && (source === 'same_ticket' || source === 'vendor_rule');

void test('a partial weight is completed by the ticket itself or by nothing at all', () => {
  for (const source of SOURCES) {
    for (const strength of STRENGTHS) {
      const resolved = resolveField(
        'net_lb',
        seen({ visible: '5,440', clipped_edge: 'left', partial: true }),
        frame(),
        [
          {
            field: 'net_lb',
            candidate: '45440',
            source,
            strength,
            note: `${source} at ${strength}`,
          },
        ],
        here,
      );
      const where = `${source}/${strength}`;
      if (derives(source, strength)) {
        assert.equal(resolved.status, 'recovered', where);
        assert.equal(resolved.value, 45440, where);
      } else {
        assert.equal(resolved.status, 'needs_review', where);
        assert.equal(resolved.value, null, where);
      }
    }
  }
});

void test('a partial identifier is completed by the ticket itself or by nothing at all', () => {
  for (const source of SOURCES) {
    for (const strength of STRENGTHS) {
      const resolved = resolveField(
        'customer_id',
        seen({ visible: 'CUS-104', clipped_edge: 'right', partial: true }),
        frame(),
        [
          {
            field: 'customer_id',
            candidate: 'CUS-10412',
            source,
            strength,
            note: `${source} at ${strength}`,
          },
        ],
        here,
      );
      const where = `${source}/${strength}`;
      if (derives(source, strength)) {
        assert.equal(resolved.status, 'recovered', where);
      } else {
        assert.equal(resolved.status, 'needs_review', where);
        assert.equal(resolved.value, null, where);
      }
    }
  }
});

void test('nothing recovers print that ran off the photograph', () => {
  for (const source of SOURCES) {
    for (const strength of STRENGTHS) {
      for (const field of ['customer_name', 'net_lb', 'ticket_date'] as const) {
        const resolved = resolveField(
          field,
          seen({ visible: 'MARK', clipped_edge: 'left', partial: true }),
          frame({ left: 'cut' }),
          [
            {
              field,
              candidate: field === 'net_lb' ? '45440' : 'Markham Paving',
              source,
              strength,
              note: `${source} at ${strength}`,
            },
          ],
          here,
        );
        const where = `${field} ${source}/${strength}`;
        assert.equal(resolved.status, 'needs_review', where);
        assert.equal(resolved.reason, 'camera_crop', where);
        if (fieldClass(field) !== 'text') assert.equal(resolved.value, null, where);
      }
    }
  }
});

void test('the reader alone never fills a name in, however sure it sounds', () => {
  for (const strength of STRENGTHS) {
    for (const copies of [1, 2, 5, 20]) {
      const resolved = resolveField(
        'customer_name',
        seen({ visible: 'ARKHAM PAVING', proposed: 'Markham Paving', clipped_edge: 'left', partial: true }),
        frame(),
        Array.from({ length: copies }, (_, index) => ({
          field: 'customer_name' as const,
          candidate: 'Markham Paving',
          source: 'model_proposed' as const,
          strength,
          note: `reading ${index}`,
        })),
        here,
      );
      assert.notEqual(resolved.status, 'recovered', `${strength} x${copies}`);
      assert.equal(resolved.status, 'needs_review');
    }
  }
});

void test('the rest of the upload alone never fills a name in either', () => {
  for (const strength of STRENGTHS) {
    for (const copies of [1, 2, 5, 20]) {
      const resolved = resolveField(
        'customer_name',
        seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
        frame(),
        Array.from({ length: copies }, (_, index) => ({
          field: 'customer_name' as const,
          candidate: 'Markham Paving',
          source: 'batch_context' as const,
          strength,
          note: `ticket ${index} of the upload`,
        })),
        here,
      );
      assert.notEqual(resolved.status, 'recovered', `${strength} x${copies}`);
    }
  }
});

void test('no field waiting for a person ever leaves a fragment where a number goes', () => {
  const fields: ObservedTicket['fields'] = {};
  for (const field of FIELD_ORDER) {
    fields[field] = seen({ visible: 'X9', clipped_edge: 'right', partial: true });
  }
  const recovery = resolveTicket(
    { fields, timestamps: [], branding: null, paper_edges: null },
    frame(),
    [],
    here,
  );
  const after = applyRecovery(emptyTicket(), recovery);
  for (const field of FIELD_ORDER) {
    // The job and the site are never a question: the print stands (recovered
    // from the print itself). Everything else waits for a person.
    assert.equal(
      recovery.fields[field]?.status,
      SILENT_FIELDS.has(field) && fieldClass(field) === 'text' ? 'recovered' : 'needs_review',
      field,
    );
    if (fieldClass(field) === 'text') {
      assert.equal(after[field], 'X9', field);
    } else {
      assert.equal(after[field], null, `${field} must not carry a fragment`);
    }
  }
});

void test('a field the workspace has a great deal to say about still fits on the record', () => {
  // Thirty job sites fit a fragment; the validator allows twenty notes of
  // three hundred characters and refuses anything longer, so an unbounded
  // list made the ticket unsaveable. The notes are trimmed, the verdict is not.
  const evidence = Array.from({ length: 30 }, (_, i) => ({
    field: 'project_address' as const,
    candidate: `MARKHAM SITE ${i} ${'X'.repeat(280)}`,
    source: 'verified_history' as const,
    strength: 'weak' as const,
    note: `Known verified location: MARKHAM SITE ${i} ${'X'.repeat(280)}`,
  }));
  const resolution = resolveField(
    'project_address',
    { visible: 'ARKHAM', proposed: null, clipped_edge: 'left', partial: true },
    UNKNOWN_FRAME,
    evidence,
    { vendor: null },
  );
  assert.equal(resolution.status, 'recovered');
  assert.equal(resolution.value, 'ARKHAM', 'the print stands, none of the thirty picked');
  assert.ok((resolution.candidates?.length ?? 0) <= 10);
  assert.ok(resolution.candidates?.every((value) => value.length <= 200));
  assert.ok(resolution.evidence.length <= 20);
  assert.ok(resolution.evidence.every((line) => line.length <= 300));
  assert.match(resolution.evidence.at(-1) ?? '', /more\.$/);
  const parsed = parseRecovery({ version: 1, vendor: null, paper: UNKNOWN_FRAME, fields: { project_address: resolution } });
  assert.ok(parsed, 'the server accepts it');
});
