import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { NUMBER_FIELDS, TEXT_FIELDS } from '../lib/load-desk/types.ts';

// supabase/demo-data.sql writes tickets straight into the database, skipping
// the app's own validation on the way in. A field misspelled there would read
// back as a blank box on a ticket nobody can explain, so the file is checked
// against the field list it is supposed to match.

const sql = readFileSync(new URL('../supabase/demo-data.sql', import.meta.url), 'utf8');

/** The keys of the `blank_ticket` object the file builds. */
function blankTicketKeys(): string[] {
  const start = sql.indexOf('blank_ticket constant jsonb := jsonb_build_object(');
  assert.notEqual(start, -1, 'blank_ticket not found in demo-data.sql');
  const body = sql.slice(start, sql.indexOf('\n  );', start));
  return [...body.matchAll(/'([a-z_]+)',\s*null/g)].map((match) => match[1]);
}

void test('the demo ticket carries every field a real ticket has, and no others', () => {
  const expected = [...TEXT_FIELDS, ...NUMBER_FIELDS].slice().sort();
  const actual = blankTicketKeys().slice().sort();
  assert.deepEqual(actual, expected);
});

void test('every field the demo tickets fill in is a real field', () => {
  const known = new Set<string>([...TEXT_FIELDS, ...NUMBER_FIELDS]);
  // The keys used in the per-ticket override object.
  const start = sql.indexOf('ticket_json := blank_ticket ||');
  assert.notEqual(start, -1, 'per-ticket overrides not found');
  const body = sql.slice(start, sql.indexOf('\n    ));', start));
  const used = [...body.matchAll(/'([a-z_]+)',/g)].map((match) => match[1]);
  assert.ok(used.length > 10, 'expected the demo tickets to fill in real fields');
  for (const field of used) {
    assert.ok(known.has(field), `${field} is not a ticket field`);
  }
});

void test('the saved record has the keys the app reads off it', () => {
  // SavedRecord, minus `id`, which the database column supplies.
  for (const key of [
    'saved_at',
    'ticket',
    'invoice',
    'source',
    'original_stored',
    'ocr_text',
    'customer_profile_id',
    'truck_id',
    'invoice_batch_id',
  ]) {
    assert.ok(sql.includes(`'${key}',`), `the demo record is missing ${key}`);
  }
});

void test('the demo invoice and source carry their required fields', () => {
  for (const key of ['invoice_number', 'invoice_date', 'return_date', 'truck_number', 'bill_to']) {
    assert.ok(sql.includes(`'${key}',`), `the demo invoice is missing ${key}`);
  }
  for (const key of ['file_name', 'sha256', 'page', 'size', 'type', 'kind']) {
    assert.ok(sql.includes(`'${key}',`), `the demo source is missing ${key}`);
  }
});

void test('every variable the script uses is one it declared', () => {
  // The loop variable was renamed in the declaration but not in the loop, which
  // would have failed on the first run. Cheap to check, invisible by eye.
  const declared = new Set(
    [...sql.matchAll(/^\s{2}([a-z_][a-z0-9_]*)\s+(?:constant\s+)?(?:text|jsonb|bigint|date|numeric|record)\b/gim)].map(
      (match) => match[1],
    ),
  );
  assert.ok(declared.size > 5, 'expected to find the declaration block');

  const loopVar = /for\s+([a-z_][a-z0-9_]*)\s+in\b/i.exec(sql)?.[1];
  assert.ok(loopVar, 'no loop found');
  assert.ok(declared.has(loopVar), `the loop uses ${loopVar}, which is never declared`);

  // Everything read as <var>.<field> must be that loop variable.
  for (const [, name] of sql.matchAll(/\b([a-z_][a-z0-9_]*)\.(?:days_ago|ticket_number|customer_key|truck_key|net_tons|hours|invoice_number|batch_id|project_name|project_address)\b/g)) {
    assert.equal(name, loopVar, `${name}.… does not match the loop variable ${loopVar}`);
  }
});

void test('it refuses to run before the workspace is set', () => {
  // Left as-is it would create a workspace called demo-workspace that nobody
  // is a member of, and the rows would be invisible and easy to forget.
  assert.match(sql, /if ws = 'demo-workspace' then\s*\n\s*raise exception/);
  assert.match(sql, /already has tickets; not adding demo data on top/);
});

void test('no real company details are used as demo data', () => {
  assert.ok(!/A & D|SEMMLER|TINLEY PARK|ILLINOIS BULK/i.test(sql));
});
