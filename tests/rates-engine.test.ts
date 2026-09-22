import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import {
  jobKeyOf,
  type InvoiceLock,
  type ParsedRateLine,
  type RatePeriod,
} from '../lib/load-desk/rates.ts';
import type { CustomerProfile } from '../lib/load-desk/profiles.ts';
import type { RecordPricing } from '../lib/load-desk/rates.ts';
import { emptyTicket, type SavedRecord } from '../lib/load-desk/types.ts';

// The server half of the Rate & Fuel Agent: the decision that turns an agreed
// rate into a figure on a ticket, the reading that works without a model, and
// the guard that keeps the mail boundary shut.
//
// The engine lives under lib/server, where modules import `cloudflare:workers`
// and use TypeScript that strip-only mode cannot run, so a resolver is
// registered for this file alone: the worker environment and the ticket store
// are stubbed, and everything actually under test — the pricing decision, the
// rules-only reader, the mail boundary — is the real module. The stubs are
// deliberately minimal; if the engine grows an import that needs one, this
// fails loudly rather than testing a copy of the code.

const root = pathToFileURL(`${process.cwd()}/`).href;

const STUBS: Record<string, string> = {
  'cloudflare:workers': 'export const env = {};',
  '@/lib/server/load-desk-store': `
    export class StoreError extends Error {
      constructor(message, status) { super(message); this.status = status; }
    }
    export const listRecords = async () => [];
    export const listProfiles = async () => ({ customers: [], trucks: [], clients: [], company: null });
    export const updateRecords = async () => [];
    export const updateProfile = async () => {};
  `,
};

register(
  `data:text/javascript,${encodeURIComponent(`
    const root = ${JSON.stringify(root)};
    const stubs = ${JSON.stringify(STUBS)};
    export async function resolve(specifier, context, next) {
      if (stubs[specifier]) {
        return {
          url: 'data:text/javascript,' + encodeURIComponent(stubs[specifier]),
          shortCircuit: true,
          format: 'module',
        };
      }
      if (specifier.startsWith('@/')) return next(root + specifier.slice(2) + '.ts', context);
      return next(specifier, context);
    }
  `)}`,
);

const { ticketEdits } = await import(`${root}lib/server/rates-engine.ts`);
const { rulesOnlyLines, wordingIsFaithful } = await import(`${root}lib/server/rate-ai.ts`);
const { mailAdapter, mailMode, cappedMode } = await import(`${root}lib/server/rate-mail.ts`);

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

// ---------------------------------------------------------- reading a reply

void test('a reply reads without a model: a job, a figure and the unit it is in', () => {
  const lines = rulesOnlyLines(
    'Markham 8.75/ton\n159th 9.25/ton\nFuel surcharge for both is 11%',
  );
  assert.equal(lines.length, 3);
  assert.deepEqual(
    lines.map((line: ParsedRateLine) => [line.job_text, line.field, line.interpreted_value, line.unit]),
    [
      ['Markham', 'base', 8.75, 'PER_TON'],
      // "159th" is a job, not the figure: a number glued to letters is a word.
      ['159th', 'base', 9.25, 'PER_TON'],
      ['both', 'fuel', 11, 'PERCENTAGE'],
    ],
  );
  assert.equal(lines[0].raw_text, 'Markham 8.75/ton');
});

void test('a line that gives the rate and the fuel is read as both', () => {
  const lines = rulesOnlyLines('Markham fuel is 11%\n159th is $9.25/ton and 10% fuel');
  assert.deepEqual(
    lines.map((line: ParsedRateLine) => [line.job_text, line.field, line.interpreted_value, line.unit]),
    [
      ['Markham', 'fuel', 11, 'PERCENTAGE'],
      // The base figure is the line's own; the 10% is found by matchLines,
      // which reads the fuel out of the same sentence.
      ['159th', 'both', 9.25, 'PER_TON'],
    ],
  );
});

void test('a rewritten request body may not lose a job, a field or gain a digit', () => {
  const items = [{ job_key: 'markham', job_label: 'Markham', fields: ['base', 'fuel'], ticket_count: 4 }];
  const draft = 'Hi Dave,\n\nCould you please send the hauling rates and applicable fuel surcharge for:\n\n• Markham — hauling rate + fuel surcharge\n\nThank you.';
  assert.equal(
    wordingIsFaithful(draft, 'Hi Dave — could you send me the rate and fuel surcharge for Markham?', items),
    true,
  );
  assert.equal(wordingIsFaithful(draft, 'Hi Dave — could you send me the rate for the site?', items), false);
  assert.equal(
    wordingIsFaithful(draft, 'Hi Dave — is Markham still $8.75 a ton plus fuel?', items),
    false,
    'a figure the draft never mentioned may not appear',
  );
});

// --------------------------------------------------------- pricing tickets

const MARKHAM = '16222 Western Ave, Markham, IL';
const markhamKey = jobKeyOf(MARKHAM);
const NOW = '2026-09-21T12:00:00.000Z';

const customer: CustomerProfile = {
  id: 1,
  name: 'Five Construction',
  ticket_customer_ids: ['60311596'],
  ticket_names: [],
  flat_rate: null,
  fuel_charge: null,
  notes: '',
  created_at: '2026-01-01T00:00:00.000Z',
};

const record = (patch: Partial<SavedRecord> = {}): SavedRecord => ({
  id: 501,
  saved_at: '2026-09-20T10:00:00.000Z',
  ticket: {
    ...emptyTicket(),
    ticket_number: '90210',
    ticket_date: '2026-09-15',
    project_address: MARKHAM,
    net_tons: 22.4,
  },
  invoice: {
    invoice_number: '5001',
    invoice_date: '2026-09-21',
    return_date: '2026-09-21',
    truck_number: '12',
    bill_to: { name: 'Five Construction', address_lines: ['', ''], phone: '' },
  },
  source: { file_name: 'ticket.jpg', sha256: 'a'.repeat(64), size: 10, type: 'image/jpeg', kind: 'upload' },
  original_stored: false,
  ocr_text: '',
  customer_profile_id: 1,
  truck_id: null,
  ...patch,
});

const period = (patch: Partial<RatePeriod> = {}): RatePeriod => ({
  id: 10,
  customer_profile_id: 1,
  job_key: markhamKey,
  job_label: 'Markham',
  kind: 'base',
  effective_from: '2026-09-14',
  effective_to: null,
  validity: 'PROJECT_DURATION',
  rate_type: 'PER_TON',
  fuel_type: null,
  value: 8.75,
  source: 'customer_email',
  source_request_id: null,
  source_response_id: null,
  confidence: 1,
  applied_by: 'auto',
  confirmed_by: null,
  confirmed_at: null,
  superseded_by: null,
  note: null,
  created_at: '2026-09-21T00:00:00.000Z',
  ...patch,
});

const fuelPeriod = period({
  id: 11,
  kind: 'fuel',
  rate_type: null,
  fuel_type: 'PERCENTAGE',
  value: 11,
  effective_from: '2026-09-14',
  effective_to: '2026-09-20',
  validity: 'PERIOD',
});

const lock = (patch: Partial<InvoiceLock> = {}): InvoiceLock => ({
  invoice_key: '5001',
  finalized_at: '2026-09-20T18:00:00.000Z',
  finalized_by: 'office@example.com',
  snapshot: { total: 0, lines: [] },
  unlocked_at: null,
  unlock_reason: null,
  ...patch,
});

void test('a ticket with no rate is priced from the period and stamped with it', () => {
  const plan = ticketEdits([record()], [customer], [period(), fuelPeriod], [], NOW, {});
  assert.equal(plan.edits.length, 1);
  assert.equal(plan.kept_manual, 0);
  const [edit] = plan.edits;
  assert.equal(edit.ticket.rate, 8.75);
  assert.equal(edit.ticket.rate_type, 'per_ton');
  assert.equal(edit.ticket.fuel_charge, 11);
  assert.equal(edit.ticket.fuel_type, 'percent');
  assert.deepEqual(edit.pricing, {
    base_period_id: 10,
    fuel_period_id: 11,
    applied_at: NOW,
    unsupported: null,
  });
  // Pricing is the app's own bookkeeping; it is not a person checking the
  // ticket against the picture.
  assert.equal(edit.bookkeeping, true);
});

void test('a rate somebody typed is left alone and counted, not overwritten', () => {
  const byHand = record({ ticket: { ...record().ticket, rate: 9.5, fuel_charge: 0 } });
  const plan = ticketEdits([byHand], [customer], [period(), fuelPeriod], [], NOW, {});
  assert.deepEqual(plan.edits, []);
  assert.equal(plan.kept_manual, 1);
});

void test('a fuel surcharge lands on a ticket the site rate already priced', () => {
  // The rate is the customer's site rate, typed in Customers long before the
  // agent existed; only the fuel surcharge was agreed by email. Half an answer
  // is still an answer: the fuel goes on and the rate is left exactly as it is.
  const sitePriced = record({
    ticket: { ...record().ticket, rate: 8.75, rate_type: 'per_ton', fuel_charge: null },
  });
  const plan = ticketEdits([sitePriced], [customer], [fuelPeriod], [], NOW, {});
  assert.equal(plan.kept_manual, 0, 'a ticket still short its fuel is not "priced by hand"');
  assert.equal(plan.edits.length, 1);
  const [edit] = plan.edits;
  assert.equal(edit.ticket.rate, 8.75);
  assert.equal(edit.ticket.rate_type, 'per_ton');
  assert.equal(edit.ticket.fuel_charge, 11);
  assert.equal(edit.ticket.fuel_type, 'percent');
  assert.deepEqual(edit.pricing, {
    base_period_id: null,
    fuel_period_id: 11,
    applied_at: NOW,
    unsupported: null,
  });
  // And again changes nothing…
  const priced = record({ ticket: edit.ticket, pricing: edit.pricing as RecordPricing });
  assert.deepEqual(ticketEdits([priced], [customer], [fuelPeriod], [], NOW, {}).edits, []);
  // …unless the figures on the ticket stop matching what the periods say. The
  // stamp alone would call this done; the figures are what is checked.
  const cleared = record({
    ticket: { ...edit.ticket, fuel_charge: null },
    pricing: edit.pricing as RecordPricing,
  });
  const again = ticketEdits([cleared], [customer], [fuelPeriod], [], NOW, {});
  assert.equal(again.edits.length, 1);
  assert.equal(again.edits[0].ticket.rate, 8.75);
  assert.equal(again.edits[0].ticket.fuel_charge, 11);
});

void test('a finalized invoice is reported, never repriced', () => {
  const plan = ticketEdits([record()], [customer], [period(), fuelPeriod], [lock()], NOW, {});
  assert.deepEqual(plan.edits, []);
  assert.equal(plan.conflicts.length, 1);
  assert.equal(plan.conflicts[0].invoice_key, '5001');
  assert.match(plan.conflicts[0].detail, /Invoice 5001 is finalized/);
  assert.match(plan.conflicts[0].detail, /ticket 90210 would change from no total to \$217\.56\./);
  // An invoice that has been opened again is an ordinary invoice.
  const opened = ticketEdits(
    [record()],
    [customer],
    [period(), fuelPeriod],
    [lock({ unlocked_at: '2026-09-21T09:00:00.000Z', unlock_reason: 'wrong rate' })],
    NOW,
    {},
  );
  assert.equal(opened.edits.length, 1);
  assert.deepEqual(opened.conflicts, []);
});

void test('pricing the same tickets twice changes nothing the second time', () => {
  const first = ticketEdits([record()], [customer], [period(), fuelPeriod], [], NOW, {});
  const priced = record({
    ticket: first.edits[0].ticket,
    pricing: first.edits[0].pricing as RecordPricing,
  });
  const second = ticketEdits([priced], [customer], [period(), fuelPeriod], [], NOW, {});
  assert.deepEqual(second.edits, []);
  assert.equal(second.kept_manual, 0);
  assert.deepEqual(second.conflicts, []);
});

void test('a rate a ticket cannot hold stamps the reason and leaves the figures', () => {
  const perMile = period({ rate_type: 'PER_MILE', value: 4.25 });
  const plan = ticketEdits([record()], [customer], [perMile], [], NOW, {});
  assert.equal(plan.edits.length, 1);
  const [edit] = plan.edits;
  assert.equal(edit.ticket.rate, null);
  assert.equal(edit.ticket.fuel_charge, null);
  assert.equal(edit.pricing?.base_period_id, 10);
  assert.match(String(edit.pricing?.unsupported), /PER_MILE/);
});

void test('the scope decides which tickets are looked at', () => {
  const elsewhere = record({
    id: 502,
    ticket: { ...record().ticket, project_address: '4100 159th St, Oak Forest, IL' },
  });
  const plan = ticketEdits(
    [record(), elsewhere],
    [customer],
    [period(), fuelPeriod],
    [],
    NOW,
    { customerId: 1, jobKey: markhamKey },
  );
  assert.deepEqual(
    plan.edits.map((edit: { id: number }) => edit.id),
    [501],
  );
  assert.deepEqual(ticketEdits([record()], [customer], [period()], [], NOW, { customerId: 2 }).edits, []);
});

// ----------------------------------------------------------- the mail guard

void test('nothing in the agent can send an email', () => {
  const paths = ['lib/server/rate-mail.ts', ...routeFiles('app/api/rates'), ...routeFiles('app/api/invoices')];
  // Endpoints and mailer libraries, not the words: rate-mail.ts is allowed to
  // say in a comment where a Gmail or Outlook adapter would plug in.
  const hosts =
    /smtp[.:]|nodemailer|sendgrid|mailgun|postmark|resend\.com|googleapis\.com|graph\.microsoft\.com|outlook\.office|mailjet|@aws-sdk\/client-ses/i;
  for (const path of paths) {
    const source = read(path);
    assert.ok(!/\bfetch\s*\(/.test(source), `${path} makes a network call`);
    assert.ok(!hosts.test(source), `${path} names a mail service`);
  }
  // The one door, and it is shut: no adapter, so the send route can only
  // refuse. A deployment with nothing set is drafts only.
  assert.equal(mailAdapter(), null);
  assert.equal(mailMode(), 'DRAFT_ONLY');
  // A customer profile cannot ask for more than the deployment allows.
  assert.equal(cappedMode({ send_mode: 'AUTO_SEND' }), 'DRAFT_ONLY');
});

function routeFiles(directory: string): string[] {
  const base = new URL(`../${directory}/`, import.meta.url);
  const found: string[] = [];
  for (const entry of readdirSync(base, { withFileTypes: true })) {
    if (entry.isDirectory()) found.push(...routeFiles(`${directory}/${entry.name}`));
    else if (entry.name.endsWith('.ts')) found.push(`${directory}/${entry.name}`);
  }
  return found;
}
