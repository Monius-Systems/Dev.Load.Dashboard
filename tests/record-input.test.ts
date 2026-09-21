import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  invoiceKeyOf,
  MAX_RECOVERY_FIELDS,
  parseCustomer,
  parseNewRecord,
  parseRecordEdits,
  parseRecovery,
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

// The recovery record is stored word for word inside the record's jsonb, so
// what the parser lets through is what the app will read back as an audit
// trail. Everything it does not name is dropped, and anything malformed takes
// the whole record down with it rather than being half-kept.

const validRecovery = () => ({
  version: 1,
  vendor: 'heidelberg',
  paper: { detected: true, left: 'inside', right: 'cut', top: 'unknown', bottom: 'inside' },
  fields: {
    project_address: {
      status: 'recovered',
      value: 'MARKHAM, IL',
      visible_text: 'ARKHAM, IL',
      source: 'verified_profile',
      source_clipped: true,
      clipped_edge: 'left',
      confidence: 0.82,
      evidence: ['Known verified location: MARKHAM, IL (seen on 7 reviewed tickets)'],
      candidates: ['MARKHAM, IL', 'OLD MARKHAM, IL'],
      confirmed_by_user: true,
    },
    net_lb: {
      status: 'needs_review',
      value: null,
      visible_text: '45,4',
      source: null,
      source_clipped: false,
      clipped_edge: 'right',
      confidence: 0,
      evidence: [],
      reason: 'partial_numeric',
    },
  },
});

void test('a recovery record is accepted whole and rebuilt field by field', () => {
  const recovery = parseRecovery(validRecovery());
  assert.ok(recovery);
  assert.equal(recovery.version, 1);
  assert.equal(recovery.vendor, 'heidelberg');
  assert.deepEqual(recovery.paper, {
    detected: true,
    left: 'inside',
    right: 'cut',
    top: 'unknown',
    bottom: 'inside',
  });
  assert.equal(recovery.fields.project_address?.visible_text, 'ARKHAM, IL');
  assert.equal(recovery.fields.project_address?.confirmed_by_user, true);
  assert.equal(recovery.fields.net_lb?.reason, 'partial_numeric');
  // Absent stays absent rather than becoming a false.
  assert.equal('confirmed_by_user' in recovery.fields.net_lb!, false);
  assert.equal('candidates' in recovery.fields.net_lb!, false);
  // A weight resolves to a figure, and a generic path has no vendor.
  const numeric = parseRecovery({
    ...validRecovery(),
    vendor: null,
    fields: { net_lb: { ...validRecovery().fields.net_lb, status: 'exact', value: 45_440 } },
  });
  assert.equal(numeric?.vendor, null);
  assert.equal(numeric?.fields.net_lb?.value, 45_440);
  // Nothing the shape does not name survives the trip.
  const extra = parseRecovery({ ...validRecovery(), note: 'hello', fields: {} });
  assert.deepEqual(extra, { version: 1, vendor: 'heidelberg', paper: validRecovery().paper, fields: {} });
});

void test('a recovery record that is not what it claims to be is refused', () => {
  type Recovery = ReturnType<typeof validRecovery>;
  const field = () => validRecovery().fields.project_address;
  const cases: [string, (recovery: Recovery) => void][] = [
    ['another version', (r) => { r.version = 2; }],
    ['vendor as a number', (r) => { (r as Record<string, unknown>).vendor = 7; }],
    ['vendor too long', (r) => { r.vendor = 'x'.repeat(61); }],
    ['no paper frame', (r) => { (r as Record<string, unknown>).paper = null; }],
    ['paper edge invented', (r) => { r.paper.left = 'torn'; }],
    ['paper not detected as a boolean', (r) => { (r.paper as Record<string, unknown>).detected = 'yes'; }],
    ['fields as a list', (r) => { (r as Record<string, unknown>).fields = []; }],
    ['a field the app does not have', (r) => { (r.fields as Record<string, unknown>).hauler_mood = field(); }],
    ['status invented', (r) => { r.fields.project_address.status = 'probably'; }],
    ['value as an object', (r) => { (r.fields.project_address as Record<string, unknown>).value = { a: 1 }; }],
    ['value too long', (r) => { r.fields.project_address.value = 'x'.repeat(501); }],
    ['value not finite', (r) => { (r.fields.project_address as Record<string, unknown>).value = Number.POSITIVE_INFINITY; }],
    ['visible text too long', (r) => { r.fields.project_address.visible_text = 'x'.repeat(501); }],
    ['source invented', (r) => { r.fields.project_address.source = 'a hunch'; }],
    ['source clipped missing', (r) => { (r.fields.project_address as Record<string, unknown>).source_clipped = undefined; }],
    ['clipped edge invented', (r) => { r.fields.project_address.clipped_edge = 'middle'; }],
    ['confidence over one', (r) => { r.fields.project_address.confidence = 1.5; }],
    ['confidence below zero', (r) => { r.fields.project_address.confidence = -0.1; }],
    ['confidence not a number', (r) => { (r.fields.project_address as Record<string, unknown>).confidence = '1'; }],
    ['evidence not a list', (r) => { (r.fields.project_address as Record<string, unknown>).evidence = 'lots'; }],
    ['too much evidence', (r) => { r.fields.project_address.evidence = Array(21).fill('why'); }],
    ['an evidence line too long', (r) => { r.fields.project_address.evidence = ['x'.repeat(301)]; }],
    ['reason invented', (r) => { (r.fields.project_address as Record<string, unknown>).reason = 'tired'; }],
    ['too many candidates', (r) => { r.fields.project_address.candidates = Array(11).fill('x'); }],
    ['a candidate too long', (r) => { r.fields.project_address.candidates = ['x'.repeat(201)]; }],
    ['confirmed as a string', (r) => { (r.fields.project_address as Record<string, unknown>).confirmed_by_user = 'yes'; }],
    ['a field that is not an object', (r) => { (r.fields as Record<string, unknown>).net_lb = 'fine'; }],
  ];
  for (const [label, mutate] of cases) {
    const recovery = validRecovery();
    mutate(recovery as never);
    assert.equal(parseRecovery(recovery), null, label);
  }
  assert.equal(parseRecovery(null), null);
  assert.equal(parseRecovery('recovered'), null);
  // A ticket has fewer fields than this, so a bigger map is junk.
  const huge = validRecovery();
  huge.fields = Object.fromEntries(
    Array.from({ length: MAX_RECOVERY_FIELDS + 1 }, (_, index) => [`field_${index}`, field()]),
  ) as never;
  assert.equal(parseRecovery(huge), null);
});

void test('a saved ticket carries its recovery record, or says nothing at all', () => {
  const plain = parseNewRecord(validRecord());
  assert.ok('value' in plain);
  assert.equal('recovery' in plain.value, false, 'tickets saved before recovery existed');

  const withRecovery = parseNewRecord({ ...validRecord(), recovery: validRecovery() });
  assert.ok('value' in withRecovery);
  assert.equal(withRecovery.value.recovery?.fields.project_address?.value, 'MARKHAM, IL');

  // A round trip through JSON can leave it null; that is not a failure.
  const nulled = parseNewRecord({ ...validRecord(), recovery: null });
  assert.ok('value' in nulled);
  assert.equal('recovery' in nulled.value, false);

  const broken = parseNewRecord({ ...validRecord(), recovery: { version: 1 } });
  assert.ok('error' in broken);
  assert.equal(broken.error, 'The ticket recovery details are not valid.');
});

void test('an edit may carry a recovery record, and is refused a bad one', () => {
  const change = {
    id: 1,
    ticket: emptyTicket(),
    invoice: validRecord().invoice,
    ocr_text: '',
    customer_profile_id: null,
    truck_id: null,
  };
  const plain = parseRecordEdits([change]);
  assert.ok('value' in plain);
  assert.equal('recovery' in plain.value[0], false);

  const carried = parseRecordEdits([{ ...change, recovery: validRecovery() }]);
  assert.ok('value' in carried);
  assert.equal(carried.value[0].recovery?.fields.project_address?.confirmed_by_user, true);

  const broken = parseRecordEdits([{ ...change, recovery: { version: 1, vendor: null, paper: 3, fields: {} } }]);
  assert.ok('error' in broken);
  assert.equal(broken.error, 'The ticket recovery details are not valid.');
});
