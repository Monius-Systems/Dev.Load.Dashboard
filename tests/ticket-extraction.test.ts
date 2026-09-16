import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  EXTRACTION_FIELDS,
  EXTRACTION_SCHEMA,
  extractedDate,
  readExtracted,
  ticketFromExtraction,
  weightDisagreement,
  type ExtractedTicket,
} from '../lib/load-desk/ticket-extraction.ts';

/** The reading of the Angelo Iafrate ticket, as the model returns it. */
const answer = (patch: Partial<ExtractedTicket> = {}): ExtractedTicket => ({
  company: 'Heidelberg Materials',
  bol: '1725335778',
  date: '1/6/2026',
  location: 'THORNTON',
  customer_number: '60350616',
  customer: 'ANGELO IAFRATE CONSTRUCTION',
  project: 'AWS 210 New Carlisle',
  project_location: 'NEW CARLISLE, IN 46552 US',
  product_number: '56001204',
  product: 'IN #53',
  net_weight: 44620,
  net_tons: 22.31,
  carrier: 'Z FORCE TRANSPORT',
  ...patch,
});

void test('the schema demands every field, so unreadable and absent differ', () => {
  assert.equal(EXTRACTION_SCHEMA.additionalProperties, false);
  assert.deepEqual([...EXTRACTION_SCHEMA.required].sort(), [...EXTRACTION_FIELDS].sort());
  for (const field of EXTRACTION_FIELDS) {
    const property = EXTRACTION_SCHEMA.properties[field];
    assert.ok(property, `${field} is in the schema`);
    // Every field may come back null rather than being guessed at.
    assert.ok([...property.type].includes('null'), `${field} may be null`);
  }
});

void test('a reading becomes a ticket the rest of the app already understands', () => {
  const ticket = ticketFromExtraction(answer());
  assert.equal(ticket.plant_name, 'Heidelberg Materials');
  assert.equal(ticket.plant_address, 'THORNTON');
  assert.equal(ticket.ticket_number, '1725335778');
  assert.equal(ticket.ticket_date, '2026-01-06');
  assert.equal(ticket.customer_id, '60350616');
  assert.equal(ticket.customer_name, 'ANGELO IAFRATE CONSTRUCTION');
  assert.equal(ticket.project_name, 'AWS 210 New Carlisle');
  assert.equal(ticket.project_address, 'NEW CARLISLE, IN 46552 US');
  assert.equal(ticket.product_code, '56001204');
  assert.equal(ticket.product_description, 'IN #53');
  assert.equal(ticket.net_lb, 44620);
  assert.equal(ticket.net_tons, 22.31);
  assert.equal(ticket.carrier_name, 'Z FORCE TRANSPORT');
  // Nothing was asked for beyond the thirteen, so nothing else is invented.
  assert.equal(ticket.gross_lb, null);
  assert.equal(ticket.rate, null);
  assert.equal(ticket.order_number, null);
});

void test('tons are worked out from pounds only when the ticket gave none', () => {
  assert.equal(ticketFromExtraction(answer({ net_tons: null })).net_tons, 22.31);
  // A figure that came off the paper is never quietly replaced by a sum.
  assert.equal(ticketFromExtraction(answer({ net_tons: 22.29 })).net_tons, 22.29);
  assert.equal(
    ticketFromExtraction(answer({ net_weight: null, net_tons: null })).net_tons,
    null,
  );
});

void test('pounds and tons that cannot both be right are flagged, not corrected', () => {
  assert.equal(weightDisagreement(answer()), null);
  assert.equal(weightDisagreement(answer({ net_tons: 22.315 })), null, 'rounding is fine');
  const off = weightDisagreement(answer({ net_tons: 27.31 }));
  assert.ok(off && /do not agree/.test(off));
  assert.equal(weightDisagreement(answer({ net_tons: null })), null, 'one figure cannot disagree');
});

void test('dates are read as printed and stored as dates', () => {
  assert.equal(extractedDate('1/6/2026'), '2026-01-06');
  assert.equal(extractedDate('12/15/2025'), '2025-12-15');
  assert.equal(extractedDate('1/6/26'), '2026-01-06');
  assert.equal(extractedDate('2026-01-06'), '2026-01-06');
  assert.equal(extractedDate('13/45/2026'), null, 'not a date on any calendar');
  assert.equal(extractedDate('sometime Tuesday'), null);
  assert.equal(extractedDate(null), null);
});

void test('an answer is taken as it comes and tidied, never trusted blindly', () => {
  const read = readExtracted({
    company: '  Heidelberg   Materials ',
    bol: '1725335778',
    customer: 'null',
    net_weight: '45,440',
    net_tons: 'not readable',
    carrier: 42,
  });
  assert.equal(read.company, 'Heidelberg Materials', 'spacing is normalised');
  assert.equal(read.customer, null, 'the word "null" is not a customer');
  assert.equal(read.net_weight, 45440, 'commas are dropped from a number');
  assert.equal(read.net_tons, null, 'unreadable is null, not NaN');
  assert.equal(read.carrier, null, 'a number is not a carrier name');
  assert.equal(read.project, null, 'a field the model omitted is null');
  // Every field is present whatever came back, so callers never see undefined.
  for (const field of EXTRACTION_FIELDS) assert.ok(field in read);
});
