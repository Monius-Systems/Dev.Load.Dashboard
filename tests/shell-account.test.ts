import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shellAccountFrom } from '../lib/account-display.ts';

void test('the sidebar name and photo come from the session claims', () => {
  assert.deepEqual(
    shellAccountFrom({
      id: 'user-1',
      email: 'someone@example.com',
      user_metadata: { full_name: 'Matthew Moniuszko', avatar_version: 'v7' },
    }),
    {
      id: 'user-1',
      name: 'Matthew Moniuszko',
      email: 'someone@example.com',
      avatarUrl: '/api/account/avatar?v=v7',
    },
  );
});

void test('a session is identified even when it carries nothing to display', () => {
  // The id is what tells the browser whether details it remembered are this
  // person's; a session must never come back unidentified while it exists.
  assert.deepEqual(shellAccountFrom({ id: 'user-1', user_metadata: {} }), {
    id: 'user-1',
    name: null,
    email: null,
    avatarUrl: null,
  });
});

void test('without a stored photo the sidebar shows initials', () => {
  const account = shellAccountFrom({
    email: 'someone@example.com',
    user_metadata: { full_name: 'Matthew Moniuszko' },
  });
  assert.equal(account?.avatarUrl, null);
  assert.equal(account?.name, 'Matthew Moniuszko');
});

void test('a photo version is escaped into the address', () => {
  const account = shellAccountFrom({ user_metadata: { avatar_version: 'a b&c' } });
  assert.equal(account?.avatarUrl, '/api/account/avatar?v=a%20b%26c');
});

void test('no session, or an empty one, means nothing to show', () => {
  assert.equal(shellAccountFrom(null), null);
  assert.equal(shellAccountFrom(undefined), null);
  assert.equal(shellAccountFrom({ email: null, user_metadata: {} }), null);
  assert.equal(shellAccountFrom({ user_metadata: { full_name: '   ' } }), null);
});
