import { test } from 'node:test';
import assert from 'node:assert/strict';
import { balanced, oneMisreadApart, weightFix } from '../lib/load-desk/recovery/weights.ts';
import { recoverTicket } from '../lib/load-desk/recovery/queue.ts';
import { knowledgeOf, ticketOutcome } from '../lib/load-desk/recovery/outcome.ts';
import { UNKNOWN_FRAME, type ObservedTicket } from '../lib/load-desk/recovery/index.ts';
import { validateTicket } from '../lib/load-desk/validate.ts';
import { ticketFromExtraction, observedToExtracted } from '../lib/load-desk/ticket-extraction.ts';
import { emptyTicket, type Ticket } from '../lib/load-desk/types.ts';

// The weights vouch for each other. One figure a faded digit off is put
// right from the other three; anything less certain is the ticket's own
// question, and never a guess.

const w = (gross: number | null, tare: number | null, net: number | null, tons: number | null) => ({
  gross_lb: gross, tare_lb: tare, net_lb: net, net_tons: tons,
});

void test('one faded digit, one lost digit, one imagined digit — and no more', () => {
  assert.equal(oneMisreadApart(27120, 27720), true, 'a 1 for a 7');
  assert.equal(oneMisreadApart(27520, 27320), true, 'a 5 for a 3');
  assert.equal(oneMisreadApart(4544, 45440), true, 'a trailing 0 that faded out');
  assert.equal(oneMisreadApart(454401, 45440), true, 'a speck read as a digit');
  assert.equal(oneMisreadApart(27420, 27720), false, 'a 4 is not a 7');
  assert.equal(oneMisreadApart(21120, 27720), false, 'two digits is another figure');
  assert.equal(oneMisreadApart(27720, 27720), false);
  assert.equal(oneMisreadApart(null, 27720), true, 'nothing read is nothing to disagree with');
});

void test('the one figure the other three prove wrong is put right', () => {
  // The real ticket: gross 73160, tare 27720, net 45440, 22.72 tons.
  assert.equal(balanced(w(73160, 27720, 45440, 22.72)), true);
  assert.deepEqual(weightFix(w(73160, 27120, 45440, 22.72)), { field: 'tare_lb', from: 27120, to: 27720 });
  assert.deepEqual(weightFix(w(73160, 27720, 45440, 22.12)), { field: 'net_tons', from: 22.12, to: 22.72 });
  assert.deepEqual(weightFix(w(73160, 27720, 43440, 22.72)), { field: 'net_lb', from: 43440, to: 45440 }, 'a 3 read where a 5 printed');
  assert.deepEqual(weightFix(w(73760, 27720, 45440, 22.72)), { field: 'gross_lb', from: 73760, to: 73160 }, 'a 7 read where a 1 printed');
  // Within the scale's own tolerance nothing is wrong, and nothing is touched.
  assert.equal(weightFix(w(73160, 27720, 45448, 22.72)), null);
});

void test('a ticket that cannot say which figure is wrong is left to a person', () => {
  assert.equal(weightFix(w(73160, 27720, 45440, 22.72)), null, 'nothing wrong');
  assert.equal(weightFix(w(73160, 21120, 45440, 22.12)), null, 'two figures wrong');
  assert.equal(weightFix(w(73160, 27420, 45440, 22.72)), null, 'a tare a non-faded digit off is another figure');
  assert.equal(weightFix(w(73160, 27720, 45000, 22.50)), null, 'net and tons agree with each other and not with gross − tare: nothing is one misread from balancing');
});

const observedWeights = (gross: string, tare: string, net: string, tons: string): ObservedTicket => ({
  fields: {
    ticket_number: { visible: '1725331394', proposed: null, clipped_edge: null, partial: false },
    gross_weight: { visible: gross, proposed: null, clipped_edge: null, partial: false },
    tare_weight: { visible: tare, proposed: null, clipped_edge: null, partial: false },
    net_weight: { visible: net, proposed: null, clipped_edge: null, partial: false },
    net_tons: { visible: tons, proposed: null, clipped_edge: null, partial: false },
  } as unknown as ObservedTicket['fields'],
  timestamps: [], branding: 'Heidelberg Materials', paper_edges: null,
});

void test('a misread tare on a scanned ticket is corrected from the ticket itself, and nothing is asked', () => {
  // The observation is keyed the way the reader answers; run it through the
  // same mapping the page uses.
  const observed: ObservedTicket = {
    fields: {
      ticket_number: { visible: '1725331394', proposed: null, clipped_edge: null, partial: false },
      gross_lb: { visible: '73160', proposed: null, clipped_edge: null, partial: false },
      tare_lb: { visible: '27120 *', proposed: null, clipped_edge: null, partial: false },
      net_lb: { visible: '45440', proposed: null, clipped_edge: null, partial: false },
      net_tons: { visible: '22.72', proposed: null, clipped_edge: null, partial: false },
    },
    timestamps: [], branding: 'Heidelberg Materials', paper_edges: null,
  };
  void observedWeights;
  const extracted: Ticket = { ...emptyTicket(), ticket_number: '1725331394', ticket_date: '2025-12-15', customer_name: 'ANGELO IAFRATE CONSTRUCTION', gross_lb: 73160, tare_lb: 27120, net_lb: 45440, net_tons: 22.72 };
  const { ticket, recovery } = recoverTicket({
    observed, paper: UNKNOWN_FRAME, extracted, records: [], profiles: { customers: [], trucks: [], clients: [] }, customer: null,
  });
  assert.equal(ticket.tare_lb, 27720);
  assert.equal(ticket.tare_tons, 13.86);
  assert.equal(recovery.fields.tare_lb?.status, 'recovered');
  assert.equal(recovery.fields.tare_lb?.visible_text, '27120 *', 'the print is kept');
  assert.ok(recovery.fields.tare_lb?.evidence.at(-1)?.includes('one faded digit'));
  assert.equal(validateTicket(ticket, recovery).some((issue) => /Weight arithmetic/.test(issue)), false);
  const report = ticketOutcome(ticket, recovery, knowledgeOf([], { customers: [], trucks: [], clients: [] }), validateTicket(ticket, recovery));
  assert.notEqual(report.outcome, 'individual_review');
  assert.equal(recovery.fields.gross_lb?.status, 'exact', 'the sound figures are not disputed by derivations built on the bad one');
  assert.equal(recovery.fields.net_lb?.status, 'exact');
});

void test('weights that do not agree and cannot be put right are this ticket’s own question', () => {
  const ticket: Ticket = { ...emptyTicket(), ticket_number: '1725331394', ticket_date: '2025-12-15', customer_name: 'X', gross_lb: 73160, tare_lb: 21120, net_lb: 45440, net_tons: 22.12 };
  const recovery = { version: 1 as const, vendor: null, paper: UNKNOWN_FRAME, fields: {} };
  const issues = validateTicket(ticket, recovery);
  assert.ok(issues.some((issue) => /Weight arithmetic/.test(issue)));
  const report = ticketOutcome(ticket, recovery, knowledgeOf([], { customers: [], trucks: [], clients: [] }), issues);
  assert.equal(report.outcome, 'individual_review');
  assert.ok(report.fields.includes('net_lb'));
  assert.ok(report.reasons.some((line) => /do not agree/.test(line)));
});

void test('the flat reading still carries the weights as printed, marks and all', () => {
  const flat = observedToExtracted({
    fields: {
      gross_lb: { visible: '73,160', proposed: null, clipped_edge: null, partial: false },
      tare_lb: { visible: '27720 * 13.86 *', proposed: null, clipped_edge: null, partial: false },
    },
    timestamps: [], branding: null, paper_edges: null,
  });
  const ticket = ticketFromExtraction(flat);
  assert.equal(ticket.gross_lb, 73160);
  assert.equal(ticket.tare_lb, 27720);
});
