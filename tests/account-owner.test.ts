import { test } from 'node:test';
import assert from 'node:assert/strict';
import { remembersSamePerson } from '../lib/account-owner.ts';

const ANNA = '9a1f3c52-0000-4000-8000-000000000001';
const BOREK = '9a1f3c52-0000-4000-8000-000000000002';

void test('the same person coming back keeps their remembered details', () => {
  assert.equal(remembersSamePerson(ANNA, ANNA), true);
});

void test('a new account signing in at the same browser is not the last person', () => {
  // The reported fault: an account was created, signed in at a browser that
  // had been signed in as somebody else, and showed that person's details.
  assert.equal(remembersSamePerson(ANNA, BOREK), false);
});

void test('remembered details with no session are not shown', () => {
  // The sign-in cookie expired or was cleared; whoever arrives next is not
  // assumed to be the person who left.
  assert.equal(remembersSamePerson(ANNA, null), false);
  assert.equal(remembersSamePerson(ANNA, undefined), false);
});

void test('details remembered without an id are never claimed by a session', () => {
  assert.equal(remembersSamePerson(null, ANNA), false);
  assert.equal(remembersSamePerson(undefined, ANNA), false);
});

void test('the local preview, which has no session, keeps its own details', () => {
  assert.equal(remembersSamePerson(null, null), true);
  assert.equal(remembersSamePerson(undefined, undefined), true);
});

void test('an empty id is not treated as a match', () => {
  assert.equal(remembersSamePerson('', ANNA), false);
  assert.equal(remembersSamePerson(ANNA, ''), false);
});
