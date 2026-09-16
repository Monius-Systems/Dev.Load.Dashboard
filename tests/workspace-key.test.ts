import { test } from 'node:test';
import assert from 'node:assert/strict';
import { workspaceKeyName } from '../lib/server/workspace-key.ts';

void test('each workspace reads its tickets on a variable of its own', () => {
  // The ids in CLIENT-LAUNCH.md: lowercase, with dashes.
  assert.equal(workspaceKeyName('ad-trucking-chicago'), 'OPENAI_API_KEY_AD_TRUCKING_CHICAGO');
  assert.equal(workspaceKeyName('smith-hauling'), 'OPENAI_API_KEY_SMITH_HAULING');
  // Two companies never share a variable, which is the whole point.
  assert.notEqual(
    workspaceKeyName('ad-trucking-chicago'),
    workspaceKeyName('smith-hauling'),
  );
});

void test('the demo workspace has a name of its own', () => {
  // supabase/demo-data.sql fills the workspace 'Monius Trucking'. Its id has a
  // space and capitals, unlike the lowercase-with-dashes ids in the launch
  // document, so it is worth pinning what it folds to.
  assert.equal(workspaceKeyName('Monius Trucking'), 'OPENAI_API_KEY_MONIUS_TRUCKING');
});

void test('ids that differ only in case or punctuation share a name', () => {
  // A property of folding, not a bug, but one that has to be known: workspace
  // ids must stay distinct in more than their punctuation.
  assert.equal(
    workspaceKeyName('Monius Trucking'),
    workspaceKeyName('monius-trucking'),
  );
});

void test('a workspace id is folded into a legal variable name', () => {
  assert.equal(workspaceKeyName('A&D Trucking'), 'OPENAI_API_KEY_A_D_TRUCKING');
  assert.equal(workspaceKeyName('  spaced  out  '), 'OPENAI_API_KEY_SPACED_OUT');
  assert.equal(workspaceKeyName('-leading-and-trailing-'), 'OPENAI_API_KEY_LEADING_AND_TRAILING');
  assert.equal(workspaceKeyName('acme.co/2026'), 'OPENAI_API_KEY_ACME_CO_2026');
});

void test('a workspace id with nothing usable in it has no variable', () => {
  // Better no name at all than every such workspace sharing one.
  assert.equal(workspaceKeyName(''), null);
  assert.equal(workspaceKeyName('---'), null);
});
