import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyKnownCarrier, knownCarrierIn } from '../lib/load-desk/recovery/known-carriers.ts';
import { recoverTicket } from '../lib/load-desk/recovery/queue.ts';
import { blocksSave, UNKNOWN_FRAME, type ObservedTicket } from '../lib/load-desk/recovery/index.ts';
import { validateTicket } from '../lib/load-desk/validate.ts';
import { emptyTicket, type Ticket } from '../lib/load-desk/types.ts';

// The client names their carriers outright (client.config.json). A carrier
// line that contains one of those names is that carrier, read whole, with
// nothing shown and nothing asked — however the rest of the line printed.

const noProfiles = { customers: [], trucks: [], clients: [] };
const observedOf = (carrier: ObservedTicket['fields']['carrier_name']): ObservedTicket => ({
  fields: { carrier_name: carrier },
  timestamps: [],
  branding: 'Heidelberg Materials',
  paper_edges: null,
});

void test('the client’s name for a carrier is found in whatever the line printed', () => {
  assert.equal(knownCarrierIn('Z FORCE TRANSPO'), 'Z Force Transportation');
  assert.equal(knownCarrierIn('Z FORCE'), 'Z Force Transportation');
  assert.equal(knownCarrierIn('ZFORCE TRANSPORT'), 'Z Force Transportation');
  assert.equal(knownCarrierIn('z-force transportation inc'), 'Z Force Transportation');
  assert.equal(knownCarrierIn('CARRIER: Z FORCE TRANSPORTATION'), 'Z Force Transportation');
  assert.equal(knownCarrierIn('ILLINOIS BULK CARRIER'), null);
  assert.equal(knownCarrierIn('Z'), null);
  assert.equal(knownCarrierIn(''), null);
  assert.equal(knownCarrierIn(null), null);
});

void test('a scanned carrier line naming Z Force passes green, whatever else the line lost', () => {
  const cases: [string, ObservedTicket['fields']['carrier_name']][] = [
    ['cut off on the right', { visible: 'Z FORCE TRANSPO', proposed: null, clipped_edge: 'right', partial: true }],
    ['read whole but short', { visible: 'Z FORCE TRANSPORT', proposed: null, clipped_edge: null, partial: false }],
    ['no spaces', { visible: 'ZFORCE', proposed: null, clipped_edge: null, partial: true }],
    ['only the reader’s guess', { visible: null, proposed: 'Z Force', clipped_edge: 'left', partial: true }],
  ];
  for (const [label, seen] of cases) {
    const { ticket, recovery } = recoverTicket({
      observed: observedOf(seen),
      // Even a photograph the detector says ran off the sheet: the client's
      // own rule outranks a retake.
      paper: { detected: true, left: 'cut', right: 'cut', top: 'inside', bottom: 'inside' },
      extracted: emptyTicket(),
      records: [],
      profiles: noProfiles,
      customer: null,
    });
    assert.equal(ticket.carrier_name, 'Z Force Transportation', label);
    assert.equal(recovery.fields.carrier_name?.status, 'exact', label);
    assert.equal(recovery.fields.carrier_name?.value, 'Z Force Transportation', label);
    assert.equal(recovery.fields.carrier_name?.confidence, 1, label);
    assert.equal(blocksSave(recovery), false, label);
    assert.ok(
      !validateTicket(ticket, recovery).some((issue) => /carrier/i.test(issue)),
      `${label}: nothing to confirm`,
    );
  }
});

void test('the print that was there stays on the record beside the client’s name', () => {
  const { recovery } = recoverTicket({
    observed: observedOf({ visible: 'Z FORCE TRANSPO', proposed: null, clipped_edge: 'right', partial: true }),
    paper: UNKNOWN_FRAME,
    extracted: emptyTicket(),
    records: [],
    profiles: noProfiles,
    customer: null,
  });
  assert.equal(recovery.fields.carrier_name?.visible_text, 'Z FORCE TRANSPO');
  assert.deepEqual(recovery.fields.carrier_name?.evidence, ['Known carrier for this client: Z Force Transportation.']);
});

void test('a carrier the client has not named is left to the evidence, as before', () => {
  const { ticket, recovery } = recoverTicket({
    observed: observedOf({ visible: 'ILLINOIS BULK CARR', proposed: null, clipped_edge: 'right', partial: true }),
    paper: UNKNOWN_FRAME,
    extracted: emptyTicket(),
    records: [],
    profiles: noProfiles,
    customer: null,
  });
  assert.equal(ticket.carrier_name, 'ILLINOIS BULK CARR');
  assert.equal(recovery.fields.carrier_name?.status, 'needs_review');
});

void test('applying the rule to a ticket already right changes nothing', () => {
  const ticket: Ticket = { ...emptyTicket(), carrier_name: 'Z Force Transportation' };
  const recovery = {
    version: 1 as const,
    vendor: null,
    paper: UNKNOWN_FRAME,
    fields: {
      carrier_name: {
        status: 'exact' as const, value: 'Z Force Transportation', visible_text: 'Z Force Transportation',
        source: 'visible' as const, source_clipped: false, clipped_edge: null, confidence: 1, evidence: [],
      },
    },
  };
  const same = applyKnownCarrier(ticket, recovery);
  assert.equal(same.ticket, ticket);
  assert.equal(same.recovery, recovery);
});
