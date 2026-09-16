import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRate,
  invoiceRate,
  ledgerCsv,
  lineBreakdown,
  lineTotal,
  rateQuantity,
} from '../lib/load-desk/format.ts';
import { summarize } from '../lib/load-desk/profiles.ts';
import { parseCustomer, parseTicket } from '../lib/load-desk/record-input.ts';
import { emptyTicket, rateTypeOf, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';
import {
  HOURS_MISSING_ISSUE,
  RATE_MISSING_ISSUE,
  RATING_ISSUES,
  validateTicket,
} from '../lib/load-desk/validate.ts';

const ticket = (patch: Partial<Ticket>): Ticket => ({ ...emptyTicket(), ...patch });

void test('flat, per ton and hourly lines work out their totals', () => {
  assert.equal(lineTotal(ticket({ rate: 150, fuel_charge: 20 })), 170);
  assert.equal(lineTotal(ticket({ rate_type: 'flat', rate: 150 })), 150);
  // 12.50 x 22.91 = 286.375, rounded to cents.
  assert.equal(lineTotal(ticket({ rate_type: 'per_ton', rate: 12.5, net_tons: 22.91 })), 286.38);
  // Net pounds give 22.91 tons when no net tons are printed.
  assert.equal(
    lineTotal(ticket({ rate_type: 'per_ton', rate: 12.5, net_lb: 45_820, fuel_charge: 10 })),
    296.38,
  );
  assert.equal(lineTotal(ticket({ rate_type: 'hourly', rate: 95, hours: 3.5 })), 332.5);
  assert.equal(lineTotal(ticket({ rate_type: 'hourly', rate: 95, hours: 3.5, fuel_charge: 15 })), 347.5);
});

void test('a line stays a draft until everything its rate needs is known', () => {
  assert.equal(lineTotal(ticket({ rate: null })), null);
  assert.equal(lineTotal(ticket({ rate_type: 'hourly', rate: 95 })), null);
  assert.equal(lineTotal(ticket({ rate_type: 'per_ton', rate: 12.5 })), null);
  assert.equal(rateQuantity(ticket({ rate_type: 'per_ton', net_tons: 22.906 })), 22.91);
  assert.equal(rateQuantity(ticket({ rate_type: 'flat' })), 1);
});

void test('tickets saved before rate types, or with an unknown type, are flat', () => {
  const legacy = { ...emptyTicket(), rate: 150 } as Partial<Ticket>;
  delete legacy.rate_type;
  assert.equal(rateTypeOf(legacy as Ticket), 'flat');
  assert.equal(rateTypeOf(ticket({ rate_type: 'weekly' })), 'flat');
  assert.equal(lineTotal(legacy as Ticket), 150);
});

void test('rates and their math read naturally', () => {
  assert.equal(formatRate(150, 'flat'), '$150.00');
  assert.equal(formatRate(12.5, 'per_ton'), '$12.50/ton');
  assert.equal(formatRate(95, 'hourly'), '$95.00/hr');
  assert.equal(formatRate(null, 'hourly'), '');
  assert.equal(invoiceRate(ticket({ rate_type: 'hourly', rate: 95, hours: 3.5 })), '$95.00/hr × 3.5 hrs');
  assert.equal(invoiceRate(ticket({ rate_type: 'hourly', rate: 95, hours: 1 })), '$95.00/hr × 1 hr');
  assert.equal(invoiceRate(ticket({ rate_type: 'per_ton', rate: 12.5, net_tons: 22.91 })), '$12.50/ton');
  assert.equal(
    lineBreakdown(ticket({ rate_type: 'per_ton', rate: 12.5, net_tons: 22.91, fuel_charge: 20 })),
    '22.91 Tons × $12.50 + $20.00 fuel = $306.38',
  );
  assert.equal(lineBreakdown(ticket({ rate_type: 'hourly', rate: 95, hours: 2 })), '2 hrs × $95.00 = $190.00');
  assert.equal(lineBreakdown(ticket({ rate: 150 })), '$150.00 per load = $150.00');
  assert.equal(lineBreakdown(ticket({ rate_type: 'hourly', rate: 95 })), 'Enter the hours to work out the total.');
  assert.equal(lineBreakdown(ticket({ rate_type: 'per_ton', rate: 12.5 })), 'Enter the net weight to work out the total.');
  assert.equal(lineBreakdown(ticket({})), 'Draft until a rate is added.');
});

void test('hourly tickets without hours are a draft, not a ticket to review', () => {
  const issues = validateTicket(ticket({ rate_type: 'hourly', rate: 95 }));
  assert.ok(issues.includes(HOURS_MISSING_ISSUE));
  assert.ok(!issues.includes(RATE_MISSING_ISSUE));
  assert.ok(RATING_ISSUES.has(HOURS_MISSING_ISSUE) && RATING_ISSUES.has(RATE_MISSING_ISSUE));
  assert.ok(!validateTicket(ticket({ rate_type: 'hourly', rate: 95, hours: 2 })).includes(HOURS_MISSING_ISSUE));
});

void test('the server accepts only known rate types and non-negative hours', () => {
  assert.ok(parseTicket(ticket({ rate_type: 'per_ton', rate: 12.5 })));
  assert.ok(parseTicket(ticket({ rate_type: 'hourly', hours: 4 })));
  assert.equal(parseTicket(ticket({ rate_type: 'weekly' })), null);
  assert.equal(parseTicket(ticket({ rate_type: 'hourly', hours: -1 })), null);
  const legacy: Record<string, unknown> = { ...emptyTicket() };
  delete legacy.rate_type;
  delete legacy.hours;
  const parsed = parseTicket(legacy);
  assert.ok(parsed);
  assert.equal(parsed.rate_type, null);
  assert.equal(parsed.hours, null);

  const customer = { name: 'Witech', ticket_customer_ids: [], ticket_names: [], flat_rate: 12.5, fuel_charge: null, notes: '', created_at: '' };
  const perTon = parseCustomer({ ...customer, rate_type: 'per_ton' });
  assert.ok('value' in perTon);
  assert.equal(perTon.value.rate_type, 'per_ton');
  const older = parseCustomer(customer);
  assert.ok('value' in older);
  assert.equal(older.value.rate_type, 'flat');
  assert.ok('error' in parseCustomer({ ...customer, rate_type: 'daily' }));
});

void test('billed totals and the ledger use the rate type', () => {
  const record = (patch: Partial<Ticket>, id: number): SavedRecord => ({
    id,
    saved_at: '2026-09-14T15:00:00.000Z',
    ticket: ticket({ ticket_date: '2026-09-14', ...patch }),
    invoice: { invoice_number: 'INV-1', invoice_date: '2026-09-14', return_date: '', truck_number: '', bill_to: { name: 'X', address_lines: ['', ''], phone: '' } },
    source: { file_name: 'a.pdf', sha256: 'a'.repeat(64), size: 1, type: 'application/pdf', kind: 'upload' },
    original_stored: true,
    ocr_text: '',
  });
  const records = [
    record({ rate_type: 'per_ton', rate: 12.5, net_tons: 22.91 }, 1),
    record({ rate_type: 'hourly', rate: 95, hours: 2 }, 2),
    record({ rate: 150, fuel_charge: 20 }, 3),
  ];
  assert.equal(summarize(records, new Date('2026-09-15T12:00:00')).billed, 286.38 + 190 + 170);
  const csv = ledgerCsv(records).split('\r\n');
  const header = csv[0].split(',');
  const rateType = header.indexOf('rate_type');
  const hours = header.indexOf('hours');
  const total = header.indexOf('line_total');
  assert.ok(rateType > 0 && hours > 0);
  assert.deepEqual(csv.slice(1).map((row) => [row.split(',')[rateType], row.split(',')[hours], row.split(',')[total]]), [
    ['per_ton', '', '286.38'],
    ['hourly', '2', '190'],
    ['flat', '', '170'],
  ]);
});
