import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  invoiceDestination,
  invoiceOrigin,
  invoiceTons,
} from '../lib/load-desk/format.ts';

void test('invoice origin comes from the ticket plant', () => {
  assert.equal(
    invoiceOrigin({
      plant_name: 'Heidelberg Materials',
      plant_address: '322 S. Williams St., THORNTON, IL 60476',
    }),
    'HEIDELBERG THORNTON IL',
  );
  assert.equal(
    invoiceOrigin({
      plant_name: 'Ontario Trap Rock',
      plant_address: 'Chicago Port Railroad, 11701 S Torrence Ave, Chicago, IL',
    }),
    'ONTARIO TRAP ROCK CHICAGO IL',
  );
  assert.equal(
    invoiceOrigin({ plant_name: 'Ontario Trap Rock', plant_address: null }),
    'ONTARIO TRAP ROCK',
  );
  assert.equal(invoiceOrigin({ plant_name: null, plant_address: null }), '');
});

void test('invoice weight is net tons to hundredths', () => {
  assert.equal(invoiceTons({ net_tons: 22.91, net_lb: 45820 }), '22.91');
  assert.equal(invoiceTons({ net_tons: 13.7, net_lb: 27400 }), '13.70');
  assert.equal(invoiceTons({ net_tons: null, net_lb: 44780 }), '22.39');
  assert.equal(invoiceTons({ net_tons: null, net_lb: null }), '');
});

void test('invoice destination keeps street, town and state only', () => {
  assert.equal(
    invoiceDestination('31480 EDISON RD, NEW CARLISLE, IN 46552 US'),
    '31480 EDISON RD, NEW CARLISLE, IN',
  );
  assert.equal(
    invoiceDestination('31480 EDISON RD, NEW CARLISLE,IN 46552 US'),
    '31480 EDISON RD, NEW CARLISLE, IN',
  );
  assert.equal(
    invoiceDestination('3300 171ST ST, LANSING, IL 60438-1234'),
    '3300 171ST ST, LANSING, IL',
  );
  assert.equal(
    invoiceDestination('175TH & RIDGLEND, TINLEY PARK IL'),
    '175TH & RIDGLEND, TINLEY PARK IL',
  );
  assert.equal(invoiceDestination('NS 74TH & GREENWOOD'), 'NS 74TH & GREENWOOD');
  assert.equal(invoiceDestination(null), '');
});
