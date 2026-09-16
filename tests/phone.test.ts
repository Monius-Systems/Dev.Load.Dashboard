import { test } from 'node:test';
import assert from 'node:assert/strict';
import { phoneDisplay, phoneEdit, phoneInput } from '../lib/phone.ts';

void test('typing a number fills in the dashes', () => {
  assert.equal(phoneInput('7'), '7');
  assert.equal(phoneInput('708'), '708');
  assert.equal(phoneInput('7085'), '708-5');
  assert.equal(phoneInput('708555'), '708-555');
  assert.equal(phoneInput('7085550'), '708-555-0');
  assert.equal(phoneInput('7085550100'), '708-555-0100');
});

void test('whatever it was pasted as, it comes out the same way', () => {
  assert.equal(phoneInput('(708) 555-0100'), '708-555-0100');
  assert.equal(phoneInput('708.555.0100'), '708-555-0100');
  assert.equal(phoneInput('708 555 0100'), '708-555-0100');
  assert.equal(phoneInput('7085550100'), '708-555-0100');
});

void test('a leading 1 is the country code, not the first digit', () => {
  assert.equal(phoneInput('17085550100'), '708-555-0100');
  assert.equal(phoneInput('1 (708) 555-0100'), '708-555-0100');
  // A real number starting with 1 in the area code is still ten digits.
  assert.equal(phoneInput('1085550100'), '108-555-0100');
});

void test('an eleventh digit is refused rather than shifting the number', () => {
  assert.equal(phoneInput('70855501001'), '708-555-0100');
});

void test('deleting backwards works', () => {
  // The field holds the formatted text, so a backspace re-formats what is left
  // instead of leaving a trailing dash the next keystroke has to step over.
  assert.equal(phoneInput('708-555-010'), '708-555-010');
  assert.equal(phoneInput('708-555-'), '708-555');
  assert.equal(phoneInput('708-'), '708');
});

void test('backspacing onto a dash deletes the digit, not just the dash', () => {
  // Without this the dash returns immediately and the field appears stuck.
  // Deleting the first dash of 708-555-0100 takes the 8 with it.
  assert.equal(phoneEdit('708-555-0100', '708555-0100'), '705-550-100');
  // Deleting the second dash takes the last 5.
  assert.equal(phoneEdit('708-555-0100', '708-5550100'), '708-550-100');
  assert.equal(phoneEdit('708-555', '708555'), '705-55');
});

void test('ordinary typing and deleting are unaffected', () => {
  assert.equal(phoneEdit('708-555-010', '708-555-0100'), '708-555-0100');
  assert.equal(phoneEdit('708-555-0100', '708-555-010'), '708-555-010');
  assert.equal(phoneEdit('', '7'), '7');
  assert.equal(phoneEdit('708-555-0100', ''), '');
});

void test('stored numbers display in the same shape', () => {
  assert.equal(phoneDisplay('7085550100'), '708-555-0100');
  assert.equal(phoneDisplay('(708) 555-0100'), '708-555-0100');
  assert.equal(phoneDisplay('1-708-555-0100'), '708-555-0100');
});

void test('anything that is not a plain ten-digit number is left alone', () => {
  // Better an extension or an overseas number shown as entered than one
  // silently reshaped into a number nobody can ring.
  assert.equal(phoneDisplay('708-555-0100 ext 12'), '708-555-0100 ext 12');
  assert.equal(phoneDisplay('+44 20 7946 0958'), '+44 20 7946 0958');
  assert.equal(phoneDisplay('call the yard'), 'call the yard');
  assert.equal(phoneDisplay(''), '');
  assert.equal(phoneDisplay(null), '');
  assert.equal(phoneDisplay(undefined), '');
});
