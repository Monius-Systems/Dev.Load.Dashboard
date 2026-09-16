import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPhoneEnvironment, type ScreenEnvironment } from '../lib/scanner/environment.ts';

const phone = (patch: Partial<ScreenEnvironment> = {}): ScreenEnvironment => ({
  coarsePointer: true,
  canHover: false,
  width: 390,
  height: 844,
  hasCamera: true,
  ...patch,
});

void test('a phone with a camera gets the scanner, held either way up', () => {
  assert.equal(isPhoneEnvironment(phone()), true);
  assert.equal(isPhoneEnvironment(phone({ width: 844, height: 390 })), true, 'landscape');
  // The largest phones still qualify.
  assert.equal(isPhoneEnvironment(phone({ width: 430, height: 932 })), true);
});

void test('a desk computer keeps the file upload', () => {
  assert.equal(
    isPhoneEnvironment(phone({ coarsePointer: false, canHover: true, width: 1440, height: 900 })),
    false,
  );
  // A touch screen on a desk is still not a phone.
  assert.equal(isPhoneEnvironment(phone({ canHover: true })), false, 'can hover');
  assert.equal(isPhoneEnvironment(phone({ width: 1280, height: 800 })), false, 'too large');
});

void test('a tablet is not a phone', () => {
  assert.equal(isPhoneEnvironment(phone({ width: 744, height: 1133 })), false, 'small tablet');
  assert.equal(isPhoneEnvironment(phone({ width: 1024, height: 1366 })), false, 'large tablet');
});

void test('without a camera there is nothing to offer', () => {
  assert.equal(isPhoneEnvironment(phone({ hasCamera: false })), false);
});

void test('a narrow window on a desk computer is not a phone', () => {
  // Resizing a browser makes the viewport phone-sized, but the pointer stays fine.
  assert.equal(
    isPhoneEnvironment(phone({ coarsePointer: false, canHover: true, width: 380, height: 700 })),
    false,
  );
});
