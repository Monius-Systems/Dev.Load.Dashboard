import { test } from 'node:test';
import assert from 'node:assert/strict';
import { billToFit } from '../lib/load-desk/format.ts';

// The client's name on a printed invoice stays on one line. These steps were
// measured in a browser against the real sheet width: at each one, the longest
// name that reaches it still clears the word INVOICE beside it and stays on the
// page. Changing a number here changes what prints, so it is pinned.

void test('ordinary client names print at full size', () => {
  assert.equal(billToFit('ACME STONE'), undefined);
  assert.equal(billToFit('LAKESHORE READY MIX'), undefined);
  assert.equal(billToFit('MIDWAY AGGREGATE SUP'), undefined);
});

void test('longer names step down a size rather than wrap', () => {
  assert.equal(billToFit('MIDWAY AGGREGATE SUPPLY'), 'medium');
  assert.equal(billToFit('PRAIRIE STATE MATERIALS & CO'), 'medium');
  assert.equal(billToFit('PRAIRIE STATE MATERIALS & SUPPLY'), 'small');
  assert.equal(billToFit('PRAIRIE STATE MATERIALS & SUPPLY CO'), 'small');
});

void test('the steps are taken at the measured lengths', () => {
  assert.equal(billToFit('X'.repeat(22)), undefined);
  assert.equal(billToFit('X'.repeat(23)), 'medium');
  assert.equal(billToFit('X'.repeat(30)), 'medium');
  assert.equal(billToFit('X'.repeat(31)), 'small');
  assert.equal(billToFit('X'.repeat(60)), 'small');
});

void test('the smallest step is never smaller than the address under it', () => {
  // There are only two steps, and the smaller one is the size of the address
  // lines. A name set smaller than its own street address reads as a mistake.
  assert.equal(billToFit('X'.repeat(200)), 'small');
});

void test('surrounding spaces do not push a name to a smaller size', () => {
  assert.equal(billToFit('   ACME STONE   '), undefined);
  assert.equal(billToFit(`  ${'X'.repeat(22)}  `), undefined);
});

void test('an empty name is left at full size', () => {
  assert.equal(billToFit(''), undefined);
  assert.equal(billToFit('   '), undefined);
});
