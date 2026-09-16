import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatFuel,
  fuelAmount,
  invoiceFuel,
  lineBreakdown,
  lineTotal,
  rateAmount,
} from '../lib/load-desk/format.ts';
import { parseCustomer, parseTicket } from '../lib/load-desk/record-input.ts';
import { nextInvoiceNumber } from '../lib/load-desk/records.ts';
import { emptyTicket, fuelTypeOf, type Ticket } from '../lib/load-desk/types.ts';

const ticket = (patch: Partial<Ticket>): Ticket => ({ ...emptyTicket(), ...patch });

void test('flat fuel is added as dollars, percent fuel as a share of the rate amount', () => {
  assert.equal(lineTotal(ticket({ rate: 150, fuel_charge: 20 })), 170);
  assert.equal(lineTotal(ticket({ rate: 150, fuel_charge: 20, fuel_type: 'flat' })), 170);
  assert.equal(lineTotal(ticket({ rate: 150, fuel_charge: 10, fuel_type: 'percent' })), 165);
  // 22.91 t x $12.50 = $286.38; 15% of that is $42.957, rounded to $42.96.
  const perTon = ticket({ rate_type: 'per_ton', rate: 12.5, net_tons: 22.91, fuel_charge: 15, fuel_type: 'percent' });
  assert.equal(rateAmount(perTon), 286.38);
  assert.equal(fuelAmount(perTon), 42.96);
  assert.equal(lineTotal(perTon), 329.34);
  const hourly = ticket({ rate_type: 'hourly', rate: 95, hours: 4, fuel_charge: 12.5, fuel_type: 'percent' });
  assert.equal(fuelAmount(hourly), 47.5);
  assert.equal(lineTotal(hourly), 427.5);
});

void test('fuel waits for the rate amount when it is a percentage', () => {
  assert.equal(fuelAmount(ticket({ fuel_charge: 15, fuel_type: 'percent' })), null);
  assert.equal(fuelAmount(ticket({ fuel_charge: 20 })), 20);
  assert.equal(fuelAmount(ticket({})), 0);
  assert.equal(lineTotal(ticket({ fuel_charge: 15, fuel_type: 'percent' })), null);
  assert.equal(fuelTypeOf(ticket({ fuel_type: 'weird' })), 'flat');
});

void test('fuel shows its amount and percentage on the invoice and in review', () => {
  assert.equal(formatFuel(20, 'flat'), '$20.00');
  assert.equal(formatFuel(15, 'percent'), '15%');
  assert.equal(formatFuel(null, 'percent'), '');
  const perTon = ticket({ rate_type: 'per_ton', rate: 12.5, net_tons: 22.91, fuel_charge: 15, fuel_type: 'percent' });
  assert.equal(invoiceFuel(perTon), '$42.96 (15%)');
  assert.equal(invoiceFuel(ticket({ rate: 150, fuel_charge: 20 })), '$20.00');
  assert.equal(invoiceFuel(ticket({ fuel_charge: 15, fuel_type: 'percent' })), '15%');
  assert.equal(invoiceFuel(ticket({ rate: 150 })), '');
  assert.equal(lineBreakdown(perTon), '22.91 Tons × $12.50 + 15% fuel ($42.96) = $329.34');
  assert.equal(lineBreakdown(ticket({ rate: 150, fuel_charge: 20 })), '$150.00 per load + $20.00 fuel = $170.00');
});

void test('the server accepts only known fuel types', () => {
  assert.ok(parseTicket(ticket({ fuel_type: 'percent', fuel_charge: 15 })));
  assert.equal(parseTicket(ticket({ fuel_type: 'gallons' })), null);
  const customer = { name: 'Witech', ticket_customer_ids: [], ticket_names: [], flat_rate: 150, fuel_charge: 15, notes: '', created_at: '' };
  const percent = parseCustomer({ ...customer, fuel_type: 'percent' });
  assert.ok('value' in percent);
  assert.equal(percent.value.fuel_type, 'percent');
  const older = parseCustomer(customer);
  assert.ok('value' in older);
  assert.equal(older.value.fuel_type, 'flat');
  assert.ok('error' in parseCustomer({ ...customer, fuel_type: 'gallons' }));
});

void test('invoice numbers continue in order after the first one', () => {
  assert.equal(nextInvoiceNumber([]), null);
  assert.equal(nextInvoiceNumber(['DRAFT-5113819']), null);
  assert.equal(nextInvoiceNumber(['2']), '3');
  assert.equal(nextInvoiceNumber(['DRAFT-5113819', '2']), '3');
  assert.equal(nextInvoiceNumber(['1001', '1002', '1003']), '1004');
  assert.equal(nextInvoiceNumber(['INV-0099']), 'INV-0100');
  assert.equal(nextInvoiceNumber(['A&D-2026-009']), 'A&D-2026-010');
  // Never reuses a higher number that is already taken.
  assert.equal(nextInvoiceNumber(['10', '4']), '11');
  // Follows the latest prefix.
  assert.equal(nextInvoiceNumber(['7', 'INV-3']), 'INV-4');
  assert.equal(nextInvoiceNumber(['  12 ']), '13');
  assert.equal(nextInvoiceNumber(['Smith job']), null);
});
