import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  clearDesk,
  deskSnapshot,
  serverDeskSnapshot,
  setDeskField,
  subscribeDesk,
} from '../lib/load-desk/desk-session.ts';

test.afterEach(() => clearDesk());

void test('the session starts empty and the server sees the same thing', () => {
  assert.deepEqual(deskSnapshot(), serverDeskSnapshot());
  assert.equal(deskSnapshot().queue.length, 0);
  assert.equal(deskSnapshot().activeIndex, -1);
});

void test('a field is set outright or from the value it had', () => {
  setDeskField('activeIndex', 2);
  assert.equal(deskSnapshot().activeIndex, 2);
  setDeskField('activeIndex', (current) => current + 1);
  assert.equal(deskSnapshot().activeIndex, 3);
  setDeskField('truckChoice', '7');
  assert.equal(deskSnapshot().truckChoice, '7');
  // Other fields are left alone.
  assert.equal(deskSnapshot().activeIndex, 3);
});

void test('watchers hear about real changes only', () => {
  let heard = 0;
  const stop = subscribeDesk(() => {
    heard += 1;
  });
  setDeskField('busy', true);
  assert.equal(heard, 1);
  // The same value again is not a change.
  setDeskField('busy', true);
  assert.equal(heard, 1);
  setDeskField('busy', false);
  assert.equal(heard, 2);
  stop();
  setDeskField('busy', true);
  assert.equal(heard, 2, 'nothing is heard after unsubscribing');
});

void test('the snapshot is a new object per change, so React re-renders', () => {
  const before = deskSnapshot();
  setDeskField('activeIndex', 5);
  assert.notEqual(deskSnapshot(), before);
  assert.equal(before.activeIndex, -1, 'the old snapshot is left untouched');
});

void test('clearing ends the session', () => {
  setDeskField('activeIndex', 4);
  setDeskField('saveStatus', { message: 'Saved', tone: 'info' });
  clearDesk();
  assert.equal(deskSnapshot().activeIndex, -1);
  assert.equal(deskSnapshot().saveStatus, null);
});
