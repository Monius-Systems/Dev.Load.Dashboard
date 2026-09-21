import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EVIDENCE_WEIGHTS,
  UNKNOWN_FRAME,
  UNVERIFIED_FRAME_CONFIDENCE_CAP,
  recoveredConfidence,
  resolveField,
  type Evidence,
  type ObservedField,
  type PaperFrame,
  type RecoveryContext,
} from '../lib/load-desk/recovery/index.ts';
import type { Ticket } from '../lib/load-desk/types.ts';

// The sheet is whole in the picture unless a test says otherwise, so that a
// test about clipping is about the printer and not about the photograph.
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

type EvidenceSeed = Omit<Evidence, 'note' | 'field'> & { note?: string; field?: keyof Ticket };

const ev = ({ note, field, ...rest }: EvidenceSeed): Evidence => ({
  field: field ?? 'customer_name',
  ...rest,
  note: note ?? `${rest.source} offers "${rest.candidate}"`,
});

const here: RecoveryContext = { vendor: 'ontario-trap-rock', customer: 'Markham Paving' };

const notesMention = (notes: string[], text: string) =>
  notes.some((note) => note.includes(text));

// --- what was read whole --------------------------------------------------

void test('a field read whole is exact, and a printed weight loses its commas', () => {
  const resolved = resolveField(
    'gross_lb',
    seen({ visible: '68,000' }),
    frame(),
    [],
    here,
  );
  assert.equal(resolved.status, 'exact');
  assert.equal(resolved.value, 68000);
  assert.equal(resolved.visible_text, '68,000');
  assert.equal(resolved.source, 'visible');
  assert.equal(resolved.confidence, 1);
  assert.equal(resolved.source_clipped, false);
});

void test('print a number field cannot hold is not read rather than not a number', () => {
  const resolved = resolveField('net_lb', seen({ visible: '45,4O0' }), frame(), [], here);
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.reason, 'not_read');
  assert.equal(resolved.value, null);
  assert.equal(resolved.visible_text, '45,4O0');
});

void test('(g) a profile that remembers a whole field differently does not disturb the print', () => {
  const resolved = resolveField(
    'customer_name',
    seen({ visible: 'MARKHAM PAVING' }),
    frame(),
    [ev({ candidate: 'Markham Paving & Excavating', source: 'verified_profile', strength: 'strong' })],
    here,
  );
  assert.equal(resolved.status, 'exact');
  assert.equal(resolved.value, 'MARKHAM PAVING');
  assert.equal(resolved.reason, undefined);
  assert.ok(notesMention(resolved.evidence, 'the printed value stands'));
});

void test('(d, 4) a date read whole still loses to the ticket disagreeing with itself', () => {
  const resolved = resolveField(
    'ticket_date',
    seen({ visible: '09/14/2026' }),
    frame(),
    [
      ev({
        field: 'ticket_date',
        candidate: '2026-09-15',
        source: 'vendor_rule',
        strength: 'strong',
        note: 'The machine timestamp reads 26SEP15 06:11.',
      }),
    ],
    here,
  );
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.reason, 'conflicting_evidence');
  assert.deepEqual(resolved.candidates, ['09/14/2026', '2026-09-15']);
  assert.equal(resolved.value, null, 'a disputed date never sits in the date column');
});

void test('a timestamp naming the same day written another way is no conflict', () => {
  const resolved = resolveField(
    'ticket_date',
    seen({ visible: '09/14/2026' }),
    frame(),
    [ev({ field: 'ticket_date', candidate: '9/14/26', source: 'vendor_rule', strength: 'strong' })],
    here,
  );
  assert.equal(resolved.status, 'exact');
  assert.equal(resolved.value, '2026-09-14', 'filed the way the app files every date');
});

void test('a date read whole is filed the way the app files dates, not as printed', () => {
  const resolved = resolveField('ticket_date', seen({ visible: '9/14/26' }), frame(), [], here);
  assert.equal(resolved.status, 'exact');
  assert.equal(resolved.value, '2026-09-14');
  assert.equal(resolved.visible_text, '9/14/26', 'the print is kept as printed');
  assert.equal(resolved.confidence, 1);
});

void test('a date already written the way it is filed comes back unchanged', () => {
  const resolved = resolveField('ticket_date', seen({ visible: '2026-09-14' }), frame(), [], here);
  assert.equal(resolved.status, 'exact');
  assert.equal(resolved.value, '2026-09-14');
});

void test('a day the calendar has not got is not read, the way a bad weight is not', () => {
  const resolved = resolveField('ticket_date', seen({ visible: '2026-02-31' }), frame(), [], here);
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.reason, 'not_read');
  assert.equal(resolved.value, null, 'it never reaches the date column as a day');
  assert.equal(resolved.visible_text, '2026-02-31');
});

// --- the camera versus the printer ---------------------------------------

void test('(a) print that ran off the picture is a retake, and no evidence recovers it', () => {
  const evidence = [
    ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' }),
    ev({ candidate: 'Markham Paving', source: 'same_ticket', strength: 'strong' }),
  ];
  const resolved = resolveField(
    'customer_name',
    seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
    frame({ left: 'cut' }),
    evidence,
    here,
  );
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.reason, 'camera_crop');
  assert.equal(resolved.source_clipped, false);
  assert.equal(resolved.value, 'ARKHAM PAVING', 'the reviewer still sees what printed');
  assert.ok(notesMention(resolved.evidence, 'never recovered'));
});

void test('(a) a cropped number is held empty, not half full', () => {
  const resolved = resolveField(
    'net_lb',
    seen({ visible: '45,4', clipped_edge: 'right', partial: true }),
    frame({ right: 'cut' }),
    [ev({ field: 'net_lb', candidate: '45440', source: 'same_ticket', strength: 'strong' })],
    here,
  );
  assert.equal(resolved.reason, 'camera_crop');
  assert.equal(resolved.value, null);
});

void test('(b) print stopped at a paper edge in the picture is the printer clipping it', () => {
  const resolved = resolveField(
    'project_address',
    seen({ visible: 'ARKHAM, IL', clipped_edge: 'left', partial: true }),
    frame({ left: 'inside' }),
    [ev({ field: 'project_address', candidate: 'Markham, IL', source: 'verified_profile', strength: 'strong' })],
    here,
  );
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.source_clipped, true);
});

void test('(b) an unverified frame still recovers, with the doubt on the record', () => {
  const evidence = [
    ev({ candidate: 'Markham Paving', source: 'same_ticket', strength: 'strong' }),
    ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' }),
    ev({ candidate: 'Markham Paving', source: 'user_correction', strength: 'strong' }),
    ev({ candidate: 'Markham Paving', source: 'verified_history', strength: 'strong' }),
  ];
  const resolved = resolveField(
    'customer_name',
    seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
    frame({ left: 'unknown' }),
    evidence,
    here,
  );
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.source_clipped, true, 'taken at face value so it stays recoverable');
  assert.equal(resolved.confidence, UNVERIFIED_FRAME_CONFIDENCE_CAP);
  assert.ok(notesMention(resolved.evidence, 'No sheet edge was found'));
});

// --- identifiers and weights ---------------------------------------------

void test('(c) an incomplete BOL number lists what is on file and adopts none of it', () => {
  const resolved = resolveField(
    'ticket_number',
    seen({ visible: '17254464_', clipped_edge: 'right', partial: true }),
    frame(),
    [
      ev({ field: 'ticket_number', candidate: '172544641', source: 'verified_history', strength: 'strong' }),
      ev({ field: 'ticket_number', candidate: '172544647', source: 'batch_context', strength: 'moderate' }),
    ],
    here,
  );
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.reason, 'partial_numeric');
  assert.equal(resolved.value, null);
  assert.equal(resolved.visible_text, '17254464_', 'the placeholder is kept exactly as read');
  assert.deepEqual(resolved.candidates, ['172544641', '172544647']);
});

void test('(c) an incomplete customer number is never finished from a resemblance', () => {
  const resolved = resolveField(
    'customer_id',
    seen({ visible: 'CUS-104', clipped_edge: 'right', partial: true }),
    frame(),
    [ev({ field: 'customer_id', candidate: 'CUS-10412', source: 'verified_profile', strength: 'strong' })],
    here,
  );
  assert.equal(resolved.reason, 'partial_numeric');
  assert.equal(resolved.value, null);
  assert.deepEqual(resolved.candidates, ['CUS-10412']);
});

void test('(c) a clipped weight the ticket itself works out is recovered', () => {
  const resolved = resolveField(
    'net_lb',
    seen({ visible: '5,440', clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({
        field: 'net_lb',
        candidate: '45440',
        source: 'same_ticket',
        strength: 'strong',
        note: 'Gross 68,000 lb less tare 22,560 lb is 45,440 lb, and the printed 22.72 net tons agree.',
      }),
    ],
    here,
  );
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.value, 45440);
  assert.equal(resolved.source, 'same_ticket');
  assert.ok(resolved.confidence <= 0.9);
  assert.ok(resolved.confidence > 0.5);
});

void test('(c) the same clipped weight without the arithmetic waits for a person', () => {
  const resolved = resolveField(
    'net_lb',
    seen({ visible: '5,440', clipped_edge: 'left', partial: true }),
    frame(),
    [],
    here,
  );
  assert.equal(resolved.reason, 'partial_numeric');
  assert.equal(resolved.value, null);
});

void test('(c) a derivation that does not fit the digits that printed is thrown out', () => {
  const resolved = resolveField(
    'net_lb',
    seen({ visible: '5,440', clipped_edge: 'left', partial: true }),
    frame(),
    [ev({ field: 'net_lb', candidate: '38200', source: 'same_ticket', strength: 'strong' })],
    here,
  );
  assert.equal(resolved.reason, 'partial_numeric');
  assert.equal(resolved.value, null);
  assert.ok(notesMention(resolved.evidence, 'Not applied'));
});

void test('(c, 4) two derivations that disagree are a question, not a vote', () => {
  const resolved = resolveField(
    'net_lb',
    seen({ visible: '440', clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({ field: 'net_lb', candidate: '45440', source: 'same_ticket', strength: 'strong' }),
      ev({ field: 'net_lb', candidate: '46440', source: 'vendor_rule', strength: 'strong' }),
    ],
    here,
  );
  assert.equal(resolved.reason, 'conflicting_evidence');
  assert.equal(resolved.value, null);
  assert.deepEqual(resolved.candidates, ['45440', '46440']);
});

void test('(c) the reader completing a clipped number is recorded and refused', () => {
  const resolved = resolveField(
    'ticket_number',
    seen({ visible: '1725', proposed: '17254464', clipped_edge: 'right', partial: true }),
    frame(),
    [],
    here,
  );
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.reason, 'partial_numeric', 'the reason stays about the print');
  assert.equal(resolved.value, null);
  assert.ok(notesMention(resolved.evidence, '17254464'));
  assert.ok(notesMention(resolved.evidence, 'nothing on the ticket or on file supports'));
});

void test('a partly printed field outside the risky classes is not filled in either', () => {
  const resolved = resolveField(
    'rate',
    seen({ visible: '12', clipped_edge: 'right', partial: true }),
    frame(),
    [ev({ field: 'rate', candidate: '12.50', source: 'verified_profile', strength: 'strong' })],
    here,
  );
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.reason, 'insufficient_evidence');
  assert.equal(resolved.value, null);
});

// --- dates ----------------------------------------------------------------

void test('(d) a date with its month clipped off is recovered from the machine timestamp', () => {
  const resolved = resolveField(
    'ticket_date',
    seen({ visible: '14/2026', clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({
        field: 'ticket_date',
        candidate: '2026-09-14',
        source: 'vendor_rule',
        strength: 'strong',
        note: 'The scale timestamp 26SEP14 12:02 names 14 September 2026.',
      }),
    ],
    here,
  );
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.value, '2026-09-14');
  assert.equal(resolved.source, 'vendor_rule');
  assert.ok(resolved.confidence <= 0.9);
});

void test('(d) a date with its year clipped off fits the same day from the other side', () => {
  const resolved = resolveField(
    'ticket_date',
    seen({ visible: '9/14', clipped_edge: 'right', partial: true }),
    frame(),
    [ev({ field: 'ticket_date', candidate: '2026-09-14', source: 'same_ticket', strength: 'strong' })],
    here,
  );
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.value, '2026-09-14');
});

void test('(d) a timestamp naming a day the print cannot have said is not used', () => {
  const resolved = resolveField(
    'ticket_date',
    seen({ visible: '14/2026', clipped_edge: 'left', partial: true }),
    frame(),
    [ev({ field: 'ticket_date', candidate: '2026-09-15', source: 'vendor_rule', strength: 'strong' })],
    here,
  );
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.reason, 'insufficient_evidence');
  assert.equal(resolved.value, null);
});

void test('(d) a partly missing date with nothing behind it waits for the original', () => {
  const resolved = resolveField(
    'ticket_date',
    seen({ visible: '9/14', clipped_edge: 'right', partial: true }),
    frame(),
    [],
    here,
  );
  assert.equal(resolved.reason, 'insufficient_evidence');
  assert.equal(resolved.value, null);
});

void test('(d) two timestamps naming two days is a conflict, both days listed', () => {
  const resolved = resolveField(
    'ticket_date',
    seen({ visible: '9/1', clipped_edge: 'right', partial: true }),
    frame(),
    [
      ev({ field: 'ticket_date', candidate: '2026-09-14', source: 'vendor_rule', strength: 'strong' }),
      ev({ field: 'ticket_date', candidate: '2026-09-15', source: 'same_ticket', strength: 'strong' }),
    ],
    here,
  );
  assert.equal(resolved.reason, 'conflicting_evidence');
  assert.deepEqual(resolved.candidates, ['2026-09-14', '2026-09-15']);
});

void test('(d) a softer record naming another day still stops the recovery', () => {
  const resolved = resolveField(
    'ticket_date',
    seen({ visible: '14/2026', clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({ field: 'ticket_date', candidate: '2026-09-14', source: 'vendor_rule', strength: 'strong' }),
      ev({ field: 'ticket_date', candidate: '2026-10-14', source: 'batch_context', strength: 'moderate' }),
    ],
    here,
  );
  assert.equal(resolved.reason, 'conflicting_evidence');
  assert.deepEqual(resolved.candidates, ['2026-09-14', '2026-10-14']);
});

void test('(d) a clipped date is never completed from a profile or the pile', () => {
  // The pile, a profile, a correction: none of them is about this ticket's
  // day. The one piece of history that is — the plant's run of numbers
  // either side of this one, which is the only date memory ever emits — may
  // complete it (see the run tests); nothing else from outside the ticket.
  const resolved = resolveField(
    'ticket_date',
    seen({ visible: '9/14', clipped_edge: 'right', partial: true }),
    frame(),
    [
      ev({ field: 'ticket_date', candidate: '2026-09-14', source: 'verified_profile', strength: 'strong' }),
      ev({ field: 'ticket_date', candidate: '2026-09-14', source: 'user_correction', strength: 'strong' }),
      ev({ field: 'ticket_date', candidate: '2026-09-14', source: 'batch_context', strength: 'strong' }),
    ],
    here,
  );
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.value, null);
});

// --- prose ----------------------------------------------------------------

void test('(e) a customer name clipped on the left is recovered from a verified profile', () => {
  const resolved = resolveField(
    'customer_name',
    seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({
        candidate: 'Markham Paving',
        source: 'verified_profile',
        strength: 'strong',
        note: 'Markham Paving is on file and its name ends in what printed.',
      }),
    ],
    here,
  );
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.value, 'Markham Paving', 'the profile spelling, not the shouted print');
  assert.equal(resolved.source, 'verified_profile');
  assert.equal(
    resolved.confidence,
    recoveredConfidence(EVIDENCE_WEIGHTS.verified_profile.strong),
  );
  assert.equal(resolved.visible_text, 'ARKHAM PAVING');
});

void test('(e) a project location clipped on the right is recovered the other way round', () => {
  const resolved = resolveField(
    'project_address',
    seen({ visible: '1400 INDUSTR', clipped_edge: 'right', partial: true }),
    frame(),
    [
      ev({
        field: 'project_address',
        candidate: '1400 Industrial Drive, Markham IL',
        source: 'verified_profile',
        strength: 'strong',
      }),
    ],
    here,
  );
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.value, '1400 Industrial Drive, Markham IL');
});

void test('(e) print clipped at the top or bottom only has to appear somewhere in it', () => {
  for (const edge of ['top', 'bottom'] as const) {
    const resolved = resolveField(
      'product_description',
      seen({ visible: 'CRUSHED STONE', clipped_edge: edge, partial: true }),
      frame(),
      [
        ev({
          field: 'product_description',
          candidate: 'CA-6 Crushed Stone Base',
          source: 'verified_history',
          strength: 'strong',
        }),
      ],
      here,
    );
    assert.equal(resolved.status, 'recovered', edge);
    assert.equal(resolved.value, 'CA-6 Crushed Stone Base', edge);
  }
});

void test('(e) several plausible matches are listed, never chosen between', () => {
  const resolved = resolveField(
    'project_name',
    seen({ visible: 'HAM', clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({ field: 'project_name', candidate: 'Markham', source: 'verified_profile', strength: 'strong' }),
      ev({ field: 'project_name', candidate: 'Graham', source: 'verified_profile', strength: 'strong' }),
      ev({ field: 'project_name', candidate: 'Hammond', source: 'verified_profile', strength: 'strong' }),
    ],
    here,
  );
  // Never a question (SILENT_FIELDS): the print stands, the two listed.
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.source, 'visible');
  assert.equal(resolved.value, 'HAM');
  assert.equal(resolved.reason, 'ambiguous_candidates');
  assert.deepEqual(resolved.candidates, ['Graham', 'Markham']);
  assert.ok(notesMention(resolved.evidence, '"Hammond" does not fit'), 'Hammond does not end in HAM');
});

void test('(e) a fragment of two characters picks nothing at all', () => {
  const resolved = resolveField(
    'project_name',
    seen({ visible: 'HA', clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({ field: 'project_name', candidate: 'Markham', source: 'verified_profile', strength: 'strong' }),
      ev({ field: 'project_name', candidate: 'Graham', source: 'verified_profile', strength: 'strong' }),
    ],
    here,
  );
  assert.equal(resolved.source, 'visible');
  assert.equal(resolved.value, 'HA');
  assert.equal(resolved.reason, 'insufficient_evidence');
  assert.deepEqual(resolved.candidates, ['Graham', 'Markham']);
  assert.ok(notesMention(resolved.evidence, 'too little to tell'));
});

void test('(e) a clear winner over a weak also-ran is recovered', () => {
  const resolved = resolveField(
    'customer_name',
    seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' }),
      ev({ candidate: 'Markham Paving', source: 'verified_history', strength: 'strong' }),
      ev({ candidate: 'Barkham Paving', source: 'batch_context', strength: 'weak' }),
    ],
    here,
  );
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.value, 'Markham Paving');
});

void test('(e) a winner only just ahead of the next is still ambiguous', () => {
  const resolved = resolveField(
    'customer_name',
    seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' }),
      ev({ candidate: 'Barkham Paving', source: 'verified_history', strength: 'strong' }),
    ],
    here,
  );
  assert.equal(resolved.reason, 'ambiguous_candidates');
  assert.deepEqual(resolved.candidates, ['Barkham Paving', 'Markham Paving']);
});

void test('(e) case and spacing are not two different candidates', () => {
  const resolved = resolveField(
    'customer_name',
    seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({ candidate: 'markham  paving', source: 'batch_context', strength: 'strong' }),
      ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' }),
      ev({ candidate: 'MARKHAM, PAVING', source: 'historical_relationship', strength: 'moderate' }),
    ],
    here,
  );
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.value, 'Markham Paving', 'the checked source sets the spelling');
});

void test('(e) the pile agreeing with itself is not enough to fill a name in', () => {
  const resolved = resolveField(
    'customer_name',
    seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
    frame(),
    ['a', 'b', 'c', 'd'].map((tag) =>
      ev({ candidate: 'Markham Paving', source: 'batch_context', strength: 'strong', note: tag }),
    ),
    here,
  );
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.reason, 'insufficient_evidence');
});

void test('(e) the reader reconstructing a name with nothing behind it is refused', () => {
  const resolved = resolveField(
    'customer_name',
    seen({
      visible: 'ARKHAM PAVING',
      proposed: 'Markham Paving',
      clipped_edge: 'left',
      partial: true,
    }),
    frame(),
    [],
    here,
  );
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.reason, 'unsupported_proposal');
  assert.equal(resolved.value, 'ARKHAM PAVING');
  assert.ok(notesMention(resolved.evidence, 'nothing on file supports'));
});

void test('(e) the reader agreeing with a value that stood on its own is only noted', () => {
  const resolved = resolveField(
    'customer_name',
    seen({
      visible: 'ARKHAM PAVING',
      proposed: 'markham paving',
      clipped_edge: 'left',
      partial: true,
    }),
    frame(),
    [ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' })],
    here,
  );
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.value, 'Markham Paving');
  assert.equal(resolved.source, 'verified_profile', 'not the reader');
  assert.ok(notesMention(resolved.evidence, 'which agrees'));
});

void test('(f) a candidate that contradicts the print is thrown away and said so', () => {
  const resolved = resolveField(
    'customer_name',
    seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
    frame(),
    [ev({ candidate: 'Witech Company', source: 'verified_profile', strength: 'strong' })],
    here,
  );
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.reason, 'insufficient_evidence');
  assert.ok(notesMention(resolved.evidence, 'does not fit the printed "ARKHAM PAVING"'));
});

void test('(4) two sources that derive rather than remember are never picked between', () => {
  const resolved = resolveField(
    'plant_name',
    seen({ visible: 'RAP ROCK', clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({ field: 'plant_name', candidate: 'Ontario Trap Rock', source: 'vendor_rule', strength: 'strong' }),
      ev({ field: 'plant_name', candidate: 'Hamilton Trap Rock', source: 'same_ticket', strength: 'strong' }),
      ev({ field: 'plant_name', candidate: 'Ontario Trap Rock', source: 'verified_profile', strength: 'strong' }),
      ev({ field: 'plant_name', candidate: 'Ontario Trap Rock', source: 'user_correction', strength: 'strong' }),
    ],
    here,
  );
  assert.equal(resolved.reason, 'conflicting_evidence');
  assert.deepEqual(resolved.candidates, ['Hamilton Trap Rock', 'Ontario Trap Rock']);
});

// --- nothing printed ------------------------------------------------------

void test('(h) a field that was simply not printed is missing, whatever is on file', () => {
  const resolved = resolveField(
    'weighmaster',
    seen({ visible: null }),
    frame(),
    [ev({ field: 'weighmaster', candidate: 'R. Alvarez', source: 'verified_history', strength: 'strong' })],
    here,
  );
  assert.equal(resolved.status, 'missing');
  assert.equal(resolved.value, null);
  assert.ok(notesMention(resolved.evidence, 'not printed on the ticket'));
});

void test('(h) a blank the reader filled in from nowhere is refused', () => {
  const resolved = resolveField(
    'carrier_name',
    seen({ visible: null, proposed: 'Monius Haulage' }),
    frame(),
    [],
    here,
  );
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.reason, 'unsupported_proposal');
  assert.equal(resolved.value, null);
});

void test('(h) a name clipped away entirely is not supplied from history', () => {
  const resolved = resolveField(
    'customer_name',
    seen({ visible: null, clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' }),
      ev({ candidate: 'Markham Paving', source: 'verified_history', strength: 'strong' }),
    ],
    here,
  );
  assert.equal(resolved.status, 'needs_review');
  assert.equal(resolved.reason, 'insufficient_evidence');
  assert.ok(notesMention(resolved.evidence, 'nothing of this field printed'));
});

void test('(h) a name clipped away entirely may still come off the ticket itself', () => {
  const resolved = resolveField(
    'customer_name',
    seen({ visible: null, clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({
        candidate: 'Markham Paving',
        source: 'same_ticket',
        strength: 'strong',
        note: 'The bill-to block on the same ticket reads Markham Paving.',
      }),
    ],
    here,
  );
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.value, 'Markham Paving');
});

void test('nothing seen, nothing proposed, nothing on file is missing', () => {
  const resolved = resolveField('po_number', undefined, frame(), [], here);
  assert.equal(resolved.status, 'missing');
  assert.equal(resolved.value, null);
  assert.equal(resolved.confidence, 0);
  assert.deepEqual(resolved.evidence, []);
});

// --- evidence that belongs to somebody else -------------------------------

void test('(i) evidence tied to another customer is not applied and says why', () => {
  const resolved = resolveField(
    'project_address',
    seen({ visible: 'ARKHAM, IL', clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({
        field: 'project_address',
        candidate: 'Markham, IL',
        source: 'verified_profile',
        strength: 'strong',
        context: { customer: 'Witech Company' },
      }),
    ],
    here,
  );
  assert.equal(resolved.source, 'visible');
  assert.equal(resolved.value, 'ARKHAM, IL');
  assert.equal(resolved.reason, 'insufficient_evidence');
  assert.deepEqual(resolved.candidates, undefined);
  assert.ok(notesMention(resolved.evidence, 'a different customer'));
});

void test('(i) the same evidence inside its own customer is applied', () => {
  const resolved = resolveField(
    'project_address',
    seen({ visible: 'ARKHAM, IL', clipped_edge: 'left', partial: true }),
    frame(),
    [
      ev({
        field: 'project_address',
        candidate: 'Markham, IL',
        source: 'verified_profile',
        strength: 'strong',
        context: { customer: 'markham  paving' },
      }),
    ],
    here,
  );
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.value, 'Markham, IL');
});

void test('(i) evidence tied to another vendor or project stays out of it', () => {
  for (const context of [{ vendor: 'heidelberg' }, { project: 'Route 30 Widening' }]) {
    const resolved = resolveField(
      'project_address',
      seen({ visible: 'ARKHAM, IL', clipped_edge: 'left', partial: true }),
      frame(),
      [
        ev({
          field: 'project_address',
          candidate: 'Markham, IL',
          source: 'verified_profile',
          strength: 'strong',
          context,
        }),
      ],
      here,
    );
    assert.equal(resolved.source, 'visible', JSON.stringify(context));
    assert.equal(resolved.value, 'ARKHAM, IL', JSON.stringify(context));
  }
});

void test('(i) evidence tied to nothing applies anywhere', () => {
  const resolved = resolveField(
    'project_address',
    seen({ visible: 'ARKHAM, IL', clipped_edge: 'left', partial: true }),
    frame(),
    [ev({ field: 'project_address', candidate: 'Markham, IL', source: 'verified_profile', strength: 'strong' })],
    { vendor: null },
  );
  assert.equal(resolved.status, 'recovered');
});

// --- housekeeping ---------------------------------------------------------

void test('the same evidence twice is one piece of evidence', () => {
  const twice = [
    ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' }),
    ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' }),
  ];
  const resolved = resolveField(
    'customer_name',
    seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
    frame(),
    twice,
    here,
  );
  assert.equal(resolved.status, 'recovered');
  assert.equal(resolved.evidence.length, 1);
  assert.equal(
    resolved.confidence,
    recoveredConfidence(EVIDENCE_WEIGHTS.verified_profile.strong),
    'counted once, not twice',
  );
});

void test('(j) nothing the reader says becomes a confidence', () => {
  const withProposal = resolveField(
    'customer_name',
    seen({ visible: 'ARKHAM PAVING', proposed: 'Markham Paving', clipped_edge: 'left', partial: true }),
    frame(),
    [ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' })],
    here,
  );
  const without = resolveField(
    'customer_name',
    seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true }),
    frame(),
    [ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' })],
    here,
  );
  assert.equal(withProposal.confidence, without.confidence);
});

void test('resolving the same field twice gives the same answer', () => {
  const observed = seen({ visible: 'ARKHAM PAVING', clipped_edge: 'left', partial: true });
  const evidence = [
    ev({ candidate: 'Markham Paving', source: 'verified_profile', strength: 'strong' }),
    ev({ candidate: 'Barkham Paving', source: 'batch_context', strength: 'weak' }),
  ];
  const first = resolveField('customer_name', observed, frame(), evidence, here);
  const second = resolveField('customer_name', observed, frame(), evidence, here);
  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
});

void test('a date read whole but one faded digit from the day the evidence names is read as that day', () => {
  // "12/13/2025" in a faded box, against a machine stamp and the plant's run
  // both saying the 15th: a 3 for a 5 with its top gone, not a ticket from
  // another day. Corrected, with the print kept beside it.
  const stamped = resolveField(
    'ticket_date',
    { visible: '12/13/2025', proposed: null, clipped_edge: null, partial: false },
    UNKNOWN_FRAME,
    [
      { field: 'ticket_date', candidate: '2025-12-15', source: 'vendor_rule', strength: 'strong', note: 'Machine timestamp 25DEC15 08:33 encodes 2025-12-15.' },
      { field: 'ticket_date', candidate: '2025-12-15', source: 'verified_history', strength: 'strong', note: 'Tickets 1725331380–1725331402 on file are all dated 2025-12-15.' },
    ],
    { vendor: 'heidelberg' },
  );
  assert.equal(stamped.status, 'recovered');
  assert.equal(stamped.value, '2025-12-15');
  assert.equal(stamped.visible_text, '12/13/2025');
  assert.ok(stamped.evidence.some((line) => /one faded digit/.test(line)));
  // Two digits away is another day, and still a question.
  const far = resolveField(
    'ticket_date',
    { visible: '11/13/2025', proposed: null, clipped_edge: null, partial: false },
    UNKNOWN_FRAME,
    [{ field: 'ticket_date', candidate: '2025-12-15', source: 'vendor_rule', strength: 'strong', note: 'stamp' }],
    { vendor: 'heidelberg' },
  );
  assert.equal(far.status, 'needs_review');
  assert.equal(far.reason, 'conflicting_evidence');
  // A digit faded print does not confuse — a 4 for a 5 — is a question too.
  const notConfusable = resolveField(
    'ticket_date',
    { visible: '12/14/2025', proposed: null, clipped_edge: null, partial: false },
    UNKNOWN_FRAME,
    [{ field: 'ticket_date', candidate: '2025-12-15', source: 'vendor_rule', strength: 'strong', note: 'stamp' }],
    { vendor: 'heidelberg' },
  );
  assert.equal(notConfusable.status, 'needs_review');
  // And the run alone, from tickets already on file, is enough.
  const runOnly = resolveField(
    'ticket_date',
    { visible: '12/13/2025', proposed: null, clipped_edge: null, partial: false },
    UNKNOWN_FRAME,
    [{ field: 'ticket_date', candidate: '2025-12-15', source: 'verified_history', strength: 'strong', note: 'run' }],
    { vendor: 'heidelberg' },
  );
  assert.equal(runOnly.status, 'recovered');
  assert.equal(runOnly.value, '2025-12-15');
});

void test('a digit the reader could not make out is a gap, asked about unless the evidence fills it', () => {
  // "12/1?/2025": the digit is there and unreadable. With nothing on file it
  // is asked; with the plant's run or the scale's stamp naming the 15th, it
  // fits the 15th and is read as it — and does not fit the 25th.
  const asked = resolveField(
    'ticket_date',
    { visible: '12/1?/2025', proposed: null, clipped_edge: null, partial: true },
    UNKNOWN_FRAME,
    [],
    { vendor: 'heidelberg' },
  );
  assert.equal(asked.status, 'needs_review');
  assert.equal(asked.value, null);
  const settled = resolveField(
    'ticket_date',
    { visible: '12/1?/2025', proposed: null, clipped_edge: null, partial: true },
    UNKNOWN_FRAME,
    [{ field: 'ticket_date', candidate: '2025-12-15', source: 'verified_history', strength: 'strong', note: 'run' }],
    { vendor: 'heidelberg' },
  );
  assert.equal(settled.status, 'recovered');
  assert.equal(settled.value, '2025-12-15');
  const wrong = resolveField(
    'ticket_date',
    { visible: '12/1?/2025', proposed: null, clipped_edge: null, partial: true },
    UNKNOWN_FRAME,
    [{ field: 'ticket_date', candidate: '2025-12-25', source: 'verified_history', strength: 'strong', note: 'run' }],
    { vendor: 'heidelberg' },
  );
  assert.equal(wrong.status, 'needs_review', 'the 25th does not fit 12/1?');
  // A ticket number with a gap is asked, never guessed; a weight with a gap
  // is filled only by the ticket's own arithmetic when the digits fit.
  const bol = resolveField(
    'ticket_number',
    { visible: '17253313?4', proposed: '1725331394', clipped_edge: null, partial: true },
    UNKNOWN_FRAME,
    [],
    { vendor: 'heidelberg' },
  );
  assert.equal(bol.status, 'needs_review');
  assert.equal(bol.value, null);
  const tare = resolveField(
    'tare_lb',
    { visible: '277?0', proposed: null, clipped_edge: null, partial: true },
    UNKNOWN_FRAME,
    [{ field: 'tare_lb', candidate: '27720', source: 'same_ticket', strength: 'strong', note: 'gross − net' }],
    { vendor: 'heidelberg' },
  );
  assert.equal(tare.status, 'recovered');
  assert.equal(tare.value, 27720);
});

void test('a date off faded print is asked for unless the ticket or the run confirms it', () => {
  const faded = { visible: '12/18/2025', proposed: null, clipped_edge: null, partial: false, faded: true } as const;
  // Nothing to confirm it: asked, and the wrong day is not kept.
  const asked = resolveField('ticket_date', faded, UNKNOWN_FRAME, [], { vendor: 'heidelberg' });
  assert.equal(asked.status, 'needs_review');
  assert.equal(asked.value, null);
  assert.equal(asked.visible_text, '12/18/2025');
  // The run says the 15th: an 8 for a 5 on faded print is the misread, read as the 15th.
  const run = { field: 'ticket_date' as const, candidate: '2025-12-15', source: 'verified_history' as const, strength: 'strong' as const, note: 'run' };
  const fixed = resolveField('ticket_date', faded, UNKNOWN_FRAME, [run], { vendor: 'heidelberg' });
  assert.equal(fixed.status, 'recovered');
  assert.equal(fixed.value, '2025-12-15');
  // Read as the 11th — a 1 for a 5, no shape in common — faded print still allows it; clear print does not.
  const eleven = { ...faded, visible: '12/11/2025' };
  assert.equal(resolveField('ticket_date', eleven, UNKNOWN_FRAME, [run], { vendor: 'heidelberg' }).value, '2025-12-15');
  const clearEleven = { ...eleven, faded: false };
  assert.equal(resolveField('ticket_date', clearEleven, UNKNOWN_FRAME, [run], { vendor: 'heidelberg' }).status, 'needs_review');
  // The run confirming the read day: exact, nothing asked.
  const same = { ...faded, visible: '12/15/2025' };
  const confirmed = resolveField('ticket_date', same, UNKNOWN_FRAME, [run], { vendor: 'heidelberg' });
  assert.equal(confirmed.status, 'exact');
  // Clear print with nothing on file stands as read, as it always has.
  const clear = { ...same, faded: false };
  assert.equal(resolveField('ticket_date', clear, UNKNOWN_FRAME, [], { vendor: 'heidelberg' }).status, 'exact');
});
