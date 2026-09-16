import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  invoiceKeyOf,
  parseCustomer,
  parseNewRecord,
  parseTruck,
  routeId,
  ticketDateColumn,
} from '../lib/load-desk/record-input.ts';
import { emptyTicket } from '../lib/load-desk/types.ts';

const validRecord = () => ({
  saved_at: '2026-09-15T12:00:00.000Z',
  ticket: {
    ...emptyTicket(),
    ticket_number: '1725172271',
    ticket_date: '2025-01-07',
    customer_name: 'WITECH COMPANY INC',
    net_lb: 45820,
    net_tons: 22.91,
    rate: 150,
  },
  invoice: {
    invoice_number: ' DRAFT-5113819 ',
    invoice_date: '2026-09-15',
    return_date: '',
    truck_number: '3211',
    bill_to: {
      name: 'ILLINOIS BULK CARRIER',
      address_lines: ['700 E. Joe Orr Rd.', 'Chicago Hights, IL 60411'],
      phone: '708-758-5800',
    },
  },
  source: {
    file_name: 'Trucking Loads.pdf',
    sha256: 'a520a81506a8f43c7a97d0242b260b7b0286ceac17dee18d2a0fd715843466fb',
    page: 2,
    size: 1141426,
    type: 'application/pdf',
    kind: 'upload',
  },
  original_stored: true,
  ocr_text: 'Plant: U857',
  customer_profile_id: 1,
  truck_id: null,
  invoice_batch_id: 'batch-1',
});

void test('a complete ticket record is accepted and normalized', () => {
  const parsed = parseNewRecord(validRecord());
  assert.ok('value' in parsed);
  assert.equal(parsed.value.invoice.invoice_number, 'DRAFT-5113819');
  assert.equal(parsed.value.source.page, 2);
  assert.equal(parsed.value.truck_id, null);
});

void test('tampered or oversized records are rejected', () => {
  const cases: [string, (record: ReturnType<typeof validRecord>) => void][] = [
    ['bad fingerprint', (r) => { r.source.sha256 = '../etc/passwd'; }],
    ['number as text', (r) => { (r.ticket as Record<string, unknown>).net_lb = '45820'; }],
    ['unknown kind', (r) => { (r.source as Record<string, unknown>).kind = 'server'; }],
    ['blank invoice number', (r) => { r.invoice.invoice_number = '   '; }],
    ['bad invoice date', (r) => { r.invoice.invoice_date = '09/15/2026'; }],
    ['three address lines', (r) => { (r.invoice.bill_to as Record<string, unknown>).address_lines = ['a', 'b', 'c']; }],
    ['huge OCR text', (r) => { r.ocr_text = 'x'.repeat(200_001); }],
    ['missing batch', (r) => { r.invoice_batch_id = ''; }],
    ['file over 20 MB', (r) => { r.source.size = 21 * 1024 * 1024; }],
    ['negative profile id', (r) => { r.customer_profile_id = -1; }],
  ];
  for (const [label, mutate] of cases) {
    const record = validRecord();
    mutate(record);
    assert.ok('error' in parseNewRecord(record), label);
  }
  assert.ok('error' in parseNewRecord(null));
  assert.ok('error' in parseNewRecord([]));
});

void test('customer and truck profiles are validated', () => {
  const customer = {
    name: ' Witech Company ',
    ticket_customer_ids: ['60311596'],
    ticket_names: [],
    flat_rate: 150,
    fuel_charge: null,
    notes: '',
    created_at: '2026-09-15T12:00:00.000Z',
  };
  const parsedCustomer = parseCustomer(customer);
  assert.ok('value' in parsedCustomer);
  assert.equal(parsedCustomer.value.name, 'Witech Company');
  assert.ok('error' in parseCustomer({ ...customer, flat_rate: -5 }));
  assert.ok('error' in parseCustomer({ ...customer, name: '' }));
  assert.ok('error' in parseCustomer({ ...customer, ticket_names: Array(21).fill('x') }));

  const truck = {
    truck_number: '3211',
    nickname: 'Blue Peterbilt',
    driver: 'Mike Rivera',
    license_plate: '',
    notes: '',
    active: true,
    created_at: '2026-09-15T12:00:00.000Z',
  };
  assert.ok('value' in parseTruck(truck));
  assert.ok('error' in parseTruck({ ...truck, active: 'yes' }));
  assert.ok('error' in parseTruck({ ...truck, truck_number: '  ' }));
});

void test('helpers for keys, dates and route ids', () => {
  assert.equal(invoiceKeyOf(' DRAFT-5113819 '), 'draft-5113819');
  assert.equal(ticketDateColumn({ ...emptyTicket(), ticket_date: '2025-01-07' }), '2025-01-07');
  assert.equal(ticketDateColumn({ ...emptyTicket(), ticket_date: '2025-13-40' }), null);
  assert.equal(ticketDateColumn({ ...emptyTicket(), ticket_date: null }), null);
  assert.equal(routeId('42'), 42);
  assert.equal(routeId('0'), null);
  assert.equal(routeId('4e2'), null);
  assert.equal(routeId('1; drop table'), null);
});
