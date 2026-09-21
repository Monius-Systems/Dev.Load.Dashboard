import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fragmentFits } from '../lib/load-desk/recovery/fit.ts';
import { recoverTicket } from '../lib/load-desk/recovery/queue.ts';
import { blocksSave, UNKNOWN_FRAME, type ObservedTicket } from '../lib/load-desk/recovery/index.ts';
import { validateTicket } from '../lib/load-desk/validate.ts';
import type { CustomerProfile } from '../lib/load-desk/profiles.ts';
import { emptyTicket, type Ticket } from '../lib/load-desk/types.ts';

// A ticket that lost its left edge, against the customer's saved job sites.
// The print is compared word by word, lined up from the uncut end, so every
// line having lost its first letter or two still reads as the address it is.

void test('print cut off on the left lines up from the right, word by word', () => {
  const saved = '222 WESTERN AVE MARKHAM IL 60428';
  assert.equal(fragmentFits('ARKHAM IL 60428 US', saved, 'left'), true, 'the country the ticket prints is not on file');
  assert.equal(fragmentFits('22 WESTERN AVE ARKHAM IL 60428 US', saved, 'left'), true, 'every line lost its start');
  assert.equal(fragmentFits('RKHAM IL 60428', saved, 'left'), true);
  assert.equal(fragmentFits('IL 60428', saved, 'left'), true);
  assert.equal(fragmentFits('ARKHAM IL 60428', 'GRAHAM IL 60428', 'left'), false, 'ARKHAM is not the end of GRAHAM');
  assert.equal(fragmentFits('ARKHAM IL 60428', '222 WESTERN AVE MARKHAM IL 60429', 'left'), false, 'the ZIP was not cut');
  assert.equal(fragmentFits('MARKHAM IL', saved, 'left'), false, 'the print ends before the value does');
});

void test('print cut off on the right lines up from the left, the mirror', () => {
  const saved = 'STRAWBERRY RD AND IN 2';
  assert.equal(fragmentFits('STRAWBERRY RD AND I', saved, 'right'), true);
  assert.equal(fragmentFits('STRAWBERRY RD', saved, 'right'), true);
  assert.equal(fragmentFits('TRAWBERRY RD', saved, 'right'), false, 'the start was not cut');
});

void test('print with no edge named only has to appear inside, ends allowed partial', () => {
  assert.equal(fragmentFits('ESTERN AVE MARKH', '222 WESTERN AVE MARKHAM IL 60428', null), true);
  assert.equal(fragmentFits('WESTERN AVE', '222 WESTERN AVE MARKHAM IL 60428', 'top'), true);
  assert.equal(fragmentFits('WESTERN BLVD', '222 WESTERN AVE MARKHAM IL 60428', null), false);
});

const kFive = (addresses: string[]): CustomerProfile => ({
  id: 7,
  name: 'K FIVE CONST CORP',
  ticket_customer_ids: ['60311111'],
  ticket_names: [],
  addresses,
  flat_rate: null,
  fuel_charge: null,
  notes: '',
  created_at: '2026-01-01T00:00:00.000Z',
});

const seen = (project_address: string): ObservedTicket => ({
  fields: {
    customer_id: { visible: '60311111', proposed: null, clipped_edge: null, partial: false },
    customer_name: { visible: 'K FIVE CONST CORP', proposed: null, clipped_edge: null, partial: false },
    project_address: { visible: project_address, proposed: null, clipped_edge: 'left', partial: true },
  },
  timestamps: ['26SEP14 12:02'],
  branding: 'Heidelberg Materials',
  paper_edges: null,
});

const extracted = (): Ticket => ({ ...emptyTicket(), customer_id: '60311111', customer_name: 'K FIVE CONST CORP' });

void test('the one saved job site that lines up with the cut-off print is chosen, with nothing to confirm', () => {
  const customer = kFive(['222 Western Ave, Markham, IL 60428']);
  for (const printed of ['ARKHAM, IL 60428 US', '22 Western Ave, ARKHAM, IL 60428 US', 'RKHAM, IL 60428']) {
    const { ticket, recovery } = recoverTicket({
      observed: seen(printed),
      paper: UNKNOWN_FRAME,
      extracted: extracted(),
      records: [],
      profiles: { customers: [customer], trucks: [], clients: [] },
      customer,
    });
    assert.equal(ticket.project_address, '222 Western Ave, Markham, IL 60428', printed);
    assert.equal(recovery.fields.project_address?.status, 'recovered', printed);
    assert.equal(recovery.fields.project_address?.visible_text, printed);
    assert.equal(blocksSave(recovery), false, printed);
    assert.ok(
      !validateTicket(ticket, recovery).some((issue) => /destination|project address/i.test(issue)),
      `${printed}: nothing to confirm`,
    );
  }
});

void test('two saved job sites that both line up are a question, not a pick', () => {
  const customer = kFive(['222 Western Ave, Markham, IL 60428', '5 Main St, Markham, IL 60428']);
  const { ticket, recovery } = recoverTicket({
    observed: seen('ARKHAM, IL 60428 US'),
    paper: UNKNOWN_FRAME,
    extracted: extracted(),
    records: [],
    profiles: { customers: [customer], trucks: [], clients: [] },
    customer,
  });
  assert.equal(recovery.fields.project_address?.source, 'visible');
  assert.equal(recovery.fields.project_address?.reason, 'ambiguous_candidates');
  assert.equal(ticket.project_address, 'ARKHAM, IL 60428 US', 'the print stands until a person picks');
  assert.deepEqual(recovery.fields.project_address?.candidates?.length, 2);
});

void test('a saved job site that does not line up is not forced onto the ticket', () => {
  const customer = kFive(['100 Graham Rd, Graham, IL 60428']);
  const { ticket, recovery } = recoverTicket({
    observed: seen('ARKHAM, IL 60428 US'),
    paper: UNKNOWN_FRAME,
    extracted: extracted(),
    records: [],
    profiles: { customers: [customer], trucks: [], clients: [] },
    customer,
  });
  assert.equal(recovery.fields.project_address?.source, 'visible');
  assert.equal(ticket.project_address, 'ARKHAM, IL 60428 US');
});

void test('a city line read whole is the customer’s saved site that contains it', () => {
  // The ticket prints the street and the city on two lines; the reader
  // took the city line and called it the whole address. The customer has
  // one saved site that contains it, word for word: that site stands.
  const customer = {
    ...kFive(['STRAWBERRY RD AND IN-2, NEW CARLISLE, IN 46552 US']),
    name: 'ANGELO IAFRATE CONSTRUCTION',
    ticket_customer_ids: ['60350616'],
  };
  const observed: ObservedTicket = {
    fields: {
      customer_id: { visible: '60350616', proposed: null, clipped_edge: null, partial: false },
      customer_name: { visible: 'ANGELO IAFRATE CONSTRUCTION', proposed: null, clipped_edge: null, partial: false },
      project_address: { visible: 'NEW CARLISLE,IN 46552 US', proposed: null, clipped_edge: null, partial: false },
    },
    timestamps: [], branding: 'Heidelberg Materials', paper_edges: null,
  };
  const extracted: Ticket = { ...emptyTicket(), customer_id: '60350616', customer_name: customer.name, project_address: 'NEW CARLISLE,IN 46552 US' };
  const { ticket, recovery } = recoverTicket({
    observed, paper: UNKNOWN_FRAME, extracted, records: [], profiles: { customers: [customer], trucks: [], clients: [] }, customer,
  });
  assert.equal(ticket.project_address, 'STRAWBERRY RD AND IN-2, NEW CARLISLE, IN 46552 US');
  assert.equal(recovery.fields.project_address?.status, 'recovered');
  assert.equal(recovery.fields.project_address?.visible_text, 'NEW CARLISLE,IN 46552 US');
  assert.equal(blocksSave(recovery), false);
  // Two saved sites in the same town both contain the city line: the print stands.
  const two = { ...customer, addresses: [...customer.addresses!, '9 ELM ST, NEW CARLISLE, IN 46552'] };
  const ambiguous = recoverTicket({
    observed, paper: UNKNOWN_FRAME, extracted, records: [], profiles: { customers: [two], trucks: [], clients: [] }, customer: two,
  });
  assert.equal(ambiguous.ticket.project_address, 'NEW CARLISLE,IN 46552 US');
  // Another customer's saved site says nothing about this one's ticket.
  const other = { ...customer, id: 99, name: 'SOMEONE ELSE', ticket_customer_ids: ['1'] };
  const stranger = recoverTicket({
    observed, paper: UNKNOWN_FRAME, extracted, records: [], profiles: { customers: [other], trucks: [], clients: [] }, customer: null,
  });
  assert.equal(stranger.ticket.project_address, 'NEW CARLISLE,IN 46552 US');
});
