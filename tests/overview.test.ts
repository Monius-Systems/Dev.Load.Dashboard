import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  customerTotals,
  monthlyLoads,
  periodComparison,
  ticketsNeedingReview,
  unmatchedCustomerCount,
  unmatchedTruckCount,
} from '../lib/load-desk/overview.ts';
import type { CustomerProfile, TruckProfile } from '../lib/load-desk/profiles.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';

let nextId = 0;
const record = (
  ticket: Partial<Ticket>,
  extra: Partial<SavedRecord> = {},
  truckNumber = '3211',
): SavedRecord => ({
  id: ++nextId,
  saved_at: '2026-09-16T15:00:00.000Z',
  ticket: {
    ...emptyTicket(),
    ticket_number: `T${nextId}`,
    customer_name: 'WITECH COMPANY INC',
    net_lb: 45820,
    net_tons: 22.91,
    ...ticket,
  },
  invoice: {
    invoice_number: `INV-${nextId}`,
    invoice_date: '2026-09-16',
    return_date: '',
    truck_number: truckNumber,
    bill_to: { name: 'X', address_lines: ['', ''], phone: '' },
  },
  source: { file_name: 'x.pdf', sha256: String(nextId), size: 1, type: 'application/pdf', kind: 'upload' },
  original_stored: true,
  ocr_text: '',
  ...extra,
});

// Wednesday 16 September 2026.
const now = new Date(2026, 8, 16, 9);

void test('week and month totals compare with the previous period', () => {
  const records = [
    record({ ticket_date: '2026-09-16', rate: 150, fuel_charge: 20 }),
    record({ ticket_date: '2026-09-14', rate: 175 }),
    record({ ticket_date: '2026-09-13' }),
    record({ ticket_date: '2026-09-07' }),
    record({ ticket_date: '2026-08-31', rate: 100 }),
  ];
  const result = periodComparison(records, now);
  assert.deepEqual(result.week, { loads: 2, tons: 45.82, billed: 345 });
  assert.equal(result.lastWeek.loads, 2, 'Sep 7 and Sep 13 are last week');
  assert.equal(result.month.loads, 4);
  assert.deepEqual(result.lastMonth, { loads: 1, tons: 22.91, billed: 100 });
});

void test('monthly loads cover the last 12 months ending this month', () => {
  const { buckets, shifted } = monthlyLoads(
    [record({ ticket_date: '2026-09-02' }), record({ ticket_date: '2025-10-30' })],
    now,
  );
  assert.equal(shifted, false);
  assert.equal(buckets.length, 12);
  assert.equal(buckets[0].key, '2025-10');
  assert.equal(buckets[11].key, '2026-09');
  assert.equal(buckets[0].loads, 1);
  assert.equal(buckets[11].loads, 1);
  assert.equal(buckets.slice(1, 11).every((bucket) => bucket.loads === 0), true);
});

void test('with only older loads the window ends at the latest load', () => {
  const { buckets, shifted } = monthlyLoads(
    [record({ ticket_date: '2025-01-07' }), record({ ticket_date: '2025-04-01' })],
    now,
  );
  assert.equal(shifted, true);
  assert.equal(buckets[11].key, '2025-04');
  assert.equal(buckets[0].key, '2024-05');
  assert.equal(buckets[8].loads, 1, 'January 2025');
});

void test('drafts are not counted as tickets to review', () => {
  const ready = record({ ticket_date: '2026-09-16' });
  const unbalanced = record({ ticket_date: '2026-09-16', gross_lb: 73100, tare_lb: 27400, net_lb: 45580 });
  assert.deepEqual(ticketsNeedingReview([ready, unbalanced]), [unbalanced]);
});

void test('customers and trucks without profiles are counted once each', () => {
  const customers: CustomerProfile[] = [
    { id: 1, name: 'Witech', ticket_customer_ids: ['60311596'], ticket_names: [], flat_rate: 150, fuel_charge: null, notes: '', created_at: '' },
  ];
  const trucks: TruckProfile[] = [
    { id: 1, truck_number: '3211', nickname: '', driver: '', license_plate: '', notes: '', active: true, created_at: '' },
  ];
  const records = [
    record({ customer_id: '60311596' }),
    record({ customer_id: '20654', customer_name: 'Ontario Trap Rock - US' }, {}, 'ZF0321'),
    record({ customer_id: '20654', customer_name: 'ONTARIO TRAP ROCK US' }, {}, 'zf-0321'),
    record({ customer_id: null, customer_name: 'PAN OCEANIC' }),
  ];
  assert.equal(unmatchedCustomerCount(records, customers), 2);
  assert.equal(unmatchedTruckCount(records, trucks), 1);
  // The same unprofiled customer printed two ways is one customer.
  assert.deepEqual(
    customerTotals(records, customers).map((entry) => [entry.name, entry.totals.loads]),
    [
      ['Ontario Trap Rock - US', 2],
      ['PAN OCEANIC', 1],
      ['Witech', 1],
    ],
  );
});
