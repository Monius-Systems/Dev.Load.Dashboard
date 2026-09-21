import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recoverTicket } from '../lib/load-desk/recovery/queue.ts';
import { vendorEvidence } from '../lib/load-desk/recovery/vendors.ts';
import {
  UNKNOWN_FRAME,
  type ObservedField,
  type ObservedTicket,
  type PaperFrame,
} from '../lib/load-desk/recovery/index.ts';
import type { ClientProfile, CustomerProfile, TruckProfile } from '../lib/load-desk/profiles.ts';
import { ticketDay } from '../lib/load-desk/ticket-date.ts';
import { printedNumber } from '../lib/load-desk/printed-number.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';

// Replays of what people typed over on the tickets on file, found by
// reading every saved record's trail: each case here was a question asked
// of a person that the paper, the pile or the profile could have answered.

const ticketOf = (fields: Partial<Ticket>): Ticket => ({ ...emptyTicket(), ...fields });
const whole = (visible: string, faded = false): ObservedField => ({
  visible,
  proposed: null,
  clipped_edge: null,
  partial: false,
  ...(faded ? { faded: true } : {}),
});
const cut = (visible: string, edge: ObservedField['clipped_edge'] = 'left'): ObservedField => ({
  visible,
  proposed: null,
  clipped_edge: edge,
  partial: true,
});
const observedOf = (fields: ObservedTicket['fields'], parts: Partial<ObservedTicket> = {}): ObservedTicket => ({
  fields,
  timestamps: [],
  branding: 'Heidelberg Materials',
  paper_edges: null,
  ...parts,
});
const inside: PaperFrame = { detected: true, left: 'inside', right: 'inside', top: 'inside', bottom: 'inside' };
const noProfiles = { customers: [] as CustomerProfile[], trucks: [] as TruckProfile[], clients: [] as ClientProfile[] };
const customer = (name: string, addresses: string[]): CustomerProfile => ({
  id: 1,
  name,
  ticket_customer_ids: [],
  ticket_names: [],
  addresses,
  flat_rate: null,
  fuel_charge: null,
  notes: '',
  created_at: '2026-01-01T00:00:00.000Z',
});
let ids = 0;
const checked = (fields: Partial<Ticket>): SavedRecord => ({
  id: ++ids,
  saved_at: '2026-09-14T15:00:00.000Z',
  ticket: ticketOf({ plant_name: 'Heidelberg Materials', ...fields }),
  invoice: { invoice_number: '2034', invoice_date: '2026-09-14', return_date: '', truck_number: '321', bill_to: { name: 'Z-FORCE', address_lines: ['', ''], phone: '' } },
  source: { file_name: 'scan.jpg', sha256: 'a'.repeat(64), size: 1, type: 'image/jpeg', kind: 'upload' },
  original_stored: true,
  ocr_text: '',
  reviewed_at: '2026-09-14T16:00:00.000Z',
});

void test('a date the printer writes out, and a figure with its unit, are read', () => {
  // Record 171: "September 17, 2026" was "not a value this field can hold",
  // and "24.12 tn" likewise. Both were typed over four times in one upload.
  assert.equal(ticketDay('September 17, 2026'), '2026-09-17');
  assert.equal(ticketDay('Sep 17 2026'), '2026-09-17');
  assert.equal(ticketDay('17 September 2026'), '2026-09-17');
  assert.equal(ticketDay('Sept. 17, 2026'), '2026-09-17');
  assert.equal(ticketDay('Septober 17, 2026'), null);
  assert.equal(printedNumber('24.12 tn'), 24.12);
  assert.equal(printedNumber('24.12 t'), 24.12);
  assert.equal(printedNumber('45,440 lb'), 45440);
  assert.equal(printedNumber('22.94 tons'), 22.94);
});

void test('a stamp read into a year no ticket has keeps its day, with the date box’s year', () => {
  // Record 197: "26SEP14" read as "29SEP14" encoded 2029-09-14, which
  // disputed the date box and sent a plainly dated ticket for review.
  const dates = vendorEvidence(
    observedOf({ ticket_date: whole('9/14/2026') }, { timestamps: ['29SEP14 10:32AM'] }),
  ).evidence.filter((item) => item.field === 'ticket_date');
  assert.equal(dates.length, 1);
  assert.equal(dates[0].candidate, '2026-09-14');
  assert.equal(dates[0].strength, 'strong');
  assert.match(dates[0].note, /year no ticket is dated/);
  // A plausible year is taken as it reads.
  const plain = vendorEvidence(observedOf({}, { timestamps: ['26SEP14 10:32AM'] })).evidence.find((i) => i.field === 'ticket_date');
  assert.equal(plain?.candidate, '2026-09-14');
});

void test('a whole date beside a cut margin is a whole date, not a retake', () => {
  // Record 197 again: "9/14/2026", every digit there, flagged clipped on the
  // left because the margin is; with the plant's run agreeing it was still
  // asked. And record 187, "15/2026" with the month gone, is completed by
  // the run — whoever cut the margin, the run is not about the margin.
  const run = [1725446200, 1725446380, 1725446465].map((n) =>
    checked({ ticket_number: String(n), ticket_date: '2026-09-14' }),
  );
  // Numbered below and above it: a number between two of a day's is that day's.
  const wholeDate = recoverTicket({
    observed: observedOf({ ticket_number: whole('1725446308'), ticket_date: cut('9/14/2026'), plant_name: whole('Heidelberg Materials') }),
    paper: { ...inside, left: 'unknown' },
    extracted: ticketOf({ ticket_number: '1725446308' }),
    records: run,
    profiles: noProfiles,
    customer: null,
  });
  assert.equal(wholeDate.ticket.ticket_date, '2026-09-14');
  assert.notEqual(wholeDate.recovery.fields.ticket_date?.status, 'needs_review');
  const monthGone = recoverTicket({
    observed: observedOf({ ticket_number: whole('1725446308'), ticket_date: cut('14/2026'), plant_name: whole('Heidelberg Materials') }),
    paper: { ...inside, left: 'cut' },
    extracted: ticketOf({ ticket_number: '1725446308' }),
    records: run,
    profiles: noProfiles,
    customer: null,
  });
  assert.equal(monthGone.ticket.ticket_date, '2026-09-14');
  assert.equal(monthGone.recovery.fields.ticket_date?.status, 'recovered');
});

void test('the pile a ticket was photographed with dates it, when its neighbours agree', () => {
  // Records 175–188: an upload of a day's tickets from one plant, numbered
  // in sequence, every date faint and none checked yet — so the plant's run
  // on file said nothing, and all of them were asked. The pile says it.
  const pile = [1725446530, 1725446599, 1725446729, 1725446786].map((n) => ({
    ticket: ticketOf({ ticket_number: String(n), ticket_date: '2026-09-15', plant_name: 'Heidelberg Materials' }),
    observed: observedOf({ ticket_number: whole(String(n)), ticket_date: whole('9/15/2026', true), plant_name: whole('Heidelberg Materials') }),
  }));
  const faint = recoverTicket({
    observed: observedOf({ ticket_number: whole('1725446662'), ticket_date: whole('9/15/2026', true), plant_name: whole('Heidelberg Materials') }),
    paper: UNKNOWN_FRAME,
    extracted: ticketOf({ ticket_number: '1725446662', ticket_date: '2026-09-15' }),
    records: [],
    profiles: noProfiles,
    customer: null,
    others: pile,
  });
  assert.equal(faint.ticket.ticket_date, '2026-09-15');
  assert.notEqual(faint.recovery.fields.ticket_date?.status, 'needs_review');
  assert.ok(faint.recovery.fields.ticket_date?.evidence.some((line) => /photographed with this one/.test(line)));
  // A digit misread among them is put right by them.
  const misread = recoverTicket({
    observed: observedOf({ ticket_number: whole('1725446662'), ticket_date: whole('9/13/2026', true), plant_name: whole('Heidelberg Materials') }),
    paper: UNKNOWN_FRAME,
    extracted: ticketOf({ ticket_number: '1725446662', ticket_date: '2026-09-13' }),
    records: [],
    profiles: noProfiles,
    customer: null,
    others: pile,
  });
  assert.equal(misread.ticket.ticket_date, '2026-09-15');
  // And the month the margin cut off is completed by them.
  const cutOff = recoverTicket({
    observed: observedOf({ ticket_number: whole('1725446662'), ticket_date: cut('15/2026'), plant_name: whole('Heidelberg Materials') }),
    paper: { ...inside, left: 'unknown' },
    extracted: ticketOf({ ticket_number: '1725446662' }),
    records: [],
    profiles: noProfiles,
    customer: null,
    others: pile,
  });
  assert.equal(cutOff.ticket.ticket_date, '2026-09-15');
  // Two days' tickets in one pile: the day whose numbers bracket this one
  // is its day, and the other day's, all numbered above, say nothing —
  // the 17th's ticket used to be dated the 18th by the 18th's tickets
  // numbered just after it.
  const twoDays = [...pile, ...[1725446800, 1725446850].map((n) => ({ ticket: ticketOf({ ticket_number: String(n), ticket_date: '2026-09-16', plant_name: 'Heidelberg Materials' }), observed: observedOf({ ticket_number: whole(String(n)), ticket_date: whole('9/16/2026'), plant_name: whole('Heidelberg Materials') }) }))];
  const bracketed = recoverTicket({
    observed: observedOf({ ticket_number: whole('1725446662'), ticket_date: whole('9/15/2026', true), plant_name: whole('Heidelberg Materials') }),
    paper: UNKNOWN_FRAME,
    extracted: ticketOf({ ticket_number: '1725446662', ticket_date: '2026-09-15' }),
    records: [],
    profiles: noProfiles,
    customer: null,
    others: twoDays,
  });
  assert.equal(bracketed.ticket.ticket_date, '2026-09-15');
  const dayBefore = recoverTicket({
    observed: observedOf({ ticket_number: whole('1725446790'), ticket_date: whole('9/15/2026', true), plant_name: whole('Heidelberg Materials') }),
    paper: UNKNOWN_FRAME,
    extracted: ticketOf({ ticket_number: '1725446790', ticket_date: '2026-09-15' }),
    records: [],
    profiles: noProfiles,
    customer: null,
    others: twoDays,
  });
  assert.notEqual(dayBefore.ticket.ticket_date, '2026-09-16', 'not dated by the tickets numbered above it alone');
  // A pile that disagrees with itself around the number says nothing.
  const mixed = [...pile, { ticket: ticketOf({ ticket_number: '1725446700', ticket_date: '2026-09-16', plant_name: 'Heidelberg Materials' }), observed: observedOf({ ticket_number: whole('1725446700'), ticket_date: whole('9/16/2026'), plant_name: whole('Heidelberg Materials') }) }, { ticket: ticketOf({ ticket_number: '1725446600', ticket_date: '2026-09-16', plant_name: 'Heidelberg Materials' }), observed: observedOf({ ticket_number: whole('1725446600'), ticket_date: whole('9/16/2026'), plant_name: whole('Heidelberg Materials') }) }];
  const unsure = recoverTicket({
    observed: observedOf({ ticket_number: whole('1725446662'), ticket_date: cut('15/2026'), plant_name: whole('Heidelberg Materials') }),
    paper: { ...inside, left: 'unknown' },
    extracted: ticketOf({ ticket_number: '1725446662' }),
    records: [],
    profiles: noProfiles,
    customer: null,
    others: mixed,
  });
  assert.equal(unsure.ticket.ticket_date, null);
});

void test('a job site is the customer’s saved one by its ZIP, by containing it, or by a letter or two', () => {
  // Records 182 and 188: "DGE ARYN 46406 US" and "UDGE GARY,IN 46406 US"
  // for the one site saved on the customer; 168: the job line and the site
  // line run together; 179: a street number with a digit gone.
  const earthwerks = customer('EARTHWERKS LAND IMPROVEMN', ['RIDGE GARY,IN 46406 US']);
  const site = (observed: ObservedField, who: CustomerProfile, paper: PaperFrame = { ...inside, left: 'unknown' }) =>
    recoverTicket({
      observed: observedOf({ customer_name: whole(who.name), project_address: observed }),
      paper,
      extracted: ticketOf({ customer_name: who.name, ...(observed.partial ? {} : { project_address: observed.visible }) }),
      records: [],
      profiles: { ...noProfiles, customers: [who] },
      customer: who,
    });
  assert.equal(site(cut('DGE ARYN 46406 US'), earthwerks).ticket.project_address, 'RIDGE GARY,IN 46406 US');
  assert.equal(site(whole('UDGE GARY,IN 46406 US'), earthwerks).ticket.project_address, 'RIDGE GARY,IN 46406 US');
  // The camera cut it, and the site is still never a question.
  assert.equal(site(cut('DGE ARYN 46406 US'), earthwerks, { ...inside, left: 'cut' }).ticket.project_address, 'RIDGE GARY,IN 46406 US');
  const bf = customer('B&F FOUNDATION REPAIR LLC', ['20430 BURNHAM, LYNWOOD, IL']);
  assert.equal(
    site(whole('20430 BURNHAM--LYNWOOD 20430 BURNHAM LYNWOOD,IL 60411 US'), bf).ticket.project_address,
    '20430 BURNHAM, LYNWOOD, IL',
  );
  const icc = customer('ICC GROUP INC', ['13640 S HALSTED ST RIVERDALE,IL 60827 US']);
  assert.equal(site(cut('1640 S HALSTED ST VERDALE,IL 60827 US'), icc).ticket.project_address, '13640 S HALSTED ST RIVERDALE,IL 60827 US');
  // Two saved sites sharing a ZIP are not told apart by it.
  const two = customer('K FIVE', ['16222 Western Ave, Markham, IL 60428 US', '5 Main St, Markham, IL 60428 US']);
  const unsure = site(cut('ARKHAM, IL 60428 US'), two);
  assert.equal(unsure.ticket.project_address, 'ARKHAM, IL 60428 US');
  assert.notEqual(unsure.recovery.fields.project_address?.status, 'needs_review');
});
