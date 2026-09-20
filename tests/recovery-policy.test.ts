import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ADVISORY_SOURCES,
  CRITICAL_FIELDS,
  DERIVATION_SOURCES,
  EVIDENCE_WEIGHTS,
  FIELD_ORDER,
  RECOVERABLE_FROM_CONTEXT,
  RECOVER_THRESHOLD,
  combinedWeight,
  evidenceWeight,
  fieldClass,
  reachesThreshold,
  recoveredConfidence,
  type Evidence,
  type EvidenceSource,
} from '../lib/load-desk/recovery/index.ts';
import { NUMBER_FIELDS, TEXT_FIELDS, type Ticket } from '../lib/load-desk/types.ts';

type EvidenceSeed = Omit<Evidence, 'note' | 'field'> & { note?: string; field?: keyof Ticket };

const ev = ({ note, field, ...rest }: EvidenceSeed): Evidence => ({
  field: field ?? 'customer_name',
  ...rest,
  note: note ?? `${rest.source} offers "${rest.candidate}"`,
});

void test('fields are sorted into the risk class that decides what may be filled in', () => {
  assert.equal(fieldClass('customer_name'), 'text');
  assert.equal(fieldClass('project_address'), 'text');
  assert.equal(fieldClass('other_charge'), 'text');
  assert.equal(fieldClass('ticket_number'), 'identifier');
  assert.equal(fieldClass('customer_id'), 'identifier');
  assert.equal(fieldClass('plant_code'), 'identifier');
  assert.equal(fieldClass('net_lb'), 'weight');
  assert.equal(fieldClass('gross_tons'), 'weight');
  assert.equal(fieldClass('ticket_date'), 'date');
  assert.equal(fieldClass('time_in'), 'other');
  assert.equal(fieldClass('rate'), 'other');
  assert.equal(fieldClass('today_loads'), 'other');
});

void test('every field the ticket has falls into exactly one class', () => {
  for (const field of FIELD_ORDER) assert.ok(fieldClass(field));
  assert.equal(FIELD_ORDER.length, TEXT_FIELDS.length + NUMBER_FIELDS.length);
});

void test('only prose may be completed from what the workspace knows', () => {
  for (const field of FIELD_ORDER) {
    assert.equal(
      RECOVERABLE_FROM_CONTEXT.has(field),
      fieldClass(field) === 'text',
      `${field} is recoverable from context iff it is prose`,
    );
  }
});

void test('the critical fields are the ones an invoice is built from', () => {
  assert.deepEqual([...CRITICAL_FIELDS].sort(), [
    'customer_id',
    'customer_name',
    'gross_lb',
    'net_lb',
    'net_tons',
    'product_code',
    'tare_lb',
    'ticket_date',
    'ticket_number',
  ]);
});

void test('the print is not evidence about itself and the reader is barely evidence at all', () => {
  assert.equal(evidenceWeight({ source: 'visible', strength: 'strong' }), 0);
  assert.ok(EVIDENCE_WEIGHTS.model_proposed.strong < RECOVER_THRESHOLD);
  assert.ok(EVIDENCE_WEIGHTS.batch_context.strong < RECOVER_THRESHOLD);
  assert.ok(ADVISORY_SOURCES.has('model_proposed'));
  assert.ok(ADVISORY_SOURCES.has('visible'));
  for (const source of Object.keys(EVIDENCE_WEIGHTS) as EvidenceSource[]) {
    assert.ok(
      EVIDENCE_WEIGHTS[source].strong >= EVIDENCE_WEIGHTS[source].moderate &&
        EVIDENCE_WEIGHTS[source].moderate >= EVIDENCE_WEIGHTS[source].weak,
      `${source} is worth no less when it is stronger`,
    );
  }
});

void test('the reader has no weight of its own in a combined total', () => {
  const items = [
    ev({ candidate: 'Markham', source: 'model_proposed', strength: 'strong' }),
    ev({ candidate: 'Markham', source: 'verified_profile', strength: 'strong' }),
  ];
  assert.equal(combinedWeight(items), EVIDENCE_WEIGHTS.verified_profile.strong);
});

void test('a reader proposal never clears the threshold, however many of them there are', () => {
  const proposals = ['a', 'b', 'c', 'd', 'e', 'f'].map((tag) =>
    ev({ candidate: 'Markham', source: 'model_proposed', strength: 'strong', note: tag }),
  );
  assert.equal(reachesThreshold(proposals), false);
});

void test('the rest of the pile never clears the threshold on its own', () => {
  const batch = ['a', 'b', 'c', 'd'].map((tag) =>
    ev({ candidate: 'Markham', source: 'batch_context', strength: 'strong', note: tag }),
  );
  assert.ok(combinedWeight(batch) >= RECOVER_THRESHOLD, 'enough raw weight');
  assert.equal(reachesThreshold(batch), false, 'but only one kind of source behind it');
});

void test('two independent softer sources clear the threshold together', () => {
  const together = [
    ev({ candidate: 'Markham', source: 'batch_context', strength: 'strong' }),
    ev({ candidate: 'Markham', source: 'historical_relationship', strength: 'strong' }),
    ev({ candidate: 'Markham', source: 'verified_history', strength: 'weak' }),
  ];
  assert.ok(combinedWeight(together) >= RECOVER_THRESHOLD);
  assert.equal(reachesThreshold(together), true);
});

void test('one strong checked source clears it alone; one strong unchecked one does not', () => {
  assert.equal(
    reachesThreshold([
      ev({ candidate: 'Markham', source: 'verified_profile', strength: 'strong' }),
    ]),
    true,
  );
  assert.equal(
    reachesThreshold([
      ev({ candidate: 'Markham', source: 'historical_relationship', strength: 'strong' }),
    ]),
    false,
  );
});

void test('only the sources that derive a value may complete a number or a date', () => {
  assert.deepEqual([...DERIVATION_SOURCES].sort(), ['same_ticket', 'vendor_rule']);
});

void test('confidence climbs with the evidence and never reaches certainty', () => {
  assert.equal(recoveredConfidence(0), 0.5);
  assert.ok(Math.abs(recoveredConfidence(1) - 0.75) < 1e-9);
  assert.ok(recoveredConfidence(3) > recoveredConfidence(1));
  assert.ok(recoveredConfidence(1000) <= 0.99);
  assert.ok(recoveredConfidence(1e9) < 1);
});
