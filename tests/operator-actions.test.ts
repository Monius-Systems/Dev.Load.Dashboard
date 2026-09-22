import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { UNKNOWN_FRAME, type FieldResolution, type TicketRecovery } from '../lib/load-desk/recovery/index.ts';
import type { CustomerProfile } from '../lib/load-desk/profiles.ts';
import { jobKeyOf, type RatePeriod } from '../lib/load-desk/rates.ts';
import { emptyTicket, type SavedRecord, type Ticket } from '../lib/load-desk/types.ts';
import type { ActionResult, ToolContext, ToolDefinition } from '../lib/operator/types.ts';
import { WRITE_PERMISSIONS } from '../lib/operator/types.ts';

// The Operator's write tools: what they say they would do, what they do, and
// what they read back afterwards.
//
// Every store is a fake that records the calls made to it, so these can assert
// the thing that matters most about a write tool — that a ticket on a finalized
// invoice never reaches `updateRecords` at all, that no edit marks a ticket
// checked, and that a service answering without complaint is not reported as
// success when the row does not say so. The domain code in between — the
// recovery layer, the exception grouping, the pricing plan — is the real
// module, because a fake of it would be a fake of the answer.

const root = pathToFileURL(`${process.cwd()}/`).href;

type Fake = {
  records: Map<number, SavedRecord>;
  profiles: { customers: CustomerProfile[]; trucks: unknown[]; clients: unknown[]; company: null };
  locks: { invoice_key: string; unlocked_at: string | null }[];
  requests: Record<string, unknown>[];
  periods: unknown[];
  events: Record<string, unknown>[];
  days: Map<string, Record<string, unknown>>;
  trucks: Record<string, unknown>[];
  calls: unknown[][];
  nextRequestId: number;
  reflect: boolean;
  mileageResult: ((truckId: number, date: string) => Record<string, unknown> | null) | null;
};

const fake = (): Fake => ({
  records: new Map(),
  profiles: { customers: [], trucks: [], clients: [], company: null },
  locks: [],
  requests: [],
  periods: [],
  events: [],
  days: new Map(),
  trucks: [],
  calls: [],
  nextRequestId: 900,
  reflect: true,
  mileageResult: null,
});

const store = globalThis as unknown as { __op: Fake };
store.__op = fake();
const op = () => store.__op;
const reset = () => {
  store.__op = fake();
  return store.__op;
};
const named = (name: string) => op().calls.filter((call) => call[0] === name);

const STUBS: Record<string, string> = {
  'cloudflare:workers': 'export const env = {};',
  '@/lib/server/load-desk-store': `
    const op = () => globalThis.__op;
    const copy = (value) => JSON.parse(JSON.stringify(value));
    export class StoreError extends Error {
      constructor(message, status) { super(message); this.status = status; }
    }
    export const getRecord = async (client, workspace, id) => {
      op().calls.push(['getRecord', id]);
      const found = op().records.get(id);
      return found ? copy(found) : null;
    };
    export const listRecordsBetween = async (client, workspace, from, to) => {
      op().calls.push(['listRecordsBetween', from, to]);
      return [...op().records.values()]
        .filter((record) => {
          const day = record.ticket.ticket_date;
          return typeof day === 'string' && day >= from && day <= to;
        })
        .map(copy);
    };
    export const listRecords = async () => {
      op().calls.push(['listRecords']);
      return [...op().records.values()].map(copy);
    };
    export const listProfiles = async () => {
      op().calls.push(['listProfiles']);
      return copy(op().profiles);
    };
    export const updateRecords = async (client, workspace, edits) => {
      op().calls.push(['updateRecords', copy(edits)]);
      const saved = [];
      for (const edit of edits) {
        const before = op().records.get(edit.id) ?? { id: edit.id };
        const next = {
          ...before,
          id: edit.id,
          ticket: edit.ticket,
          invoice: edit.invoice,
          ocr_text: edit.ocr_text,
        };
        if (edit.recovery !== undefined) next.recovery = edit.recovery;
        if (!edit.bookkeeping) {
          next.edited_at = '2026-09-22T00:00:00.000Z';
          next.reviewed_at = '2026-09-22T00:00:00.000Z';
        }
        if (op().reflect) op().records.set(edit.id, next);
        saved.push(next);
      }
      return saved;
    };
    export const updateProfile = async () => {};
  `,
  '@/lib/server/rates-store': `
    const op = () => globalThis.__op;
    const key = (value) => String(value).trim().toLowerCase();
    export const listLocks = async () => {
      op().calls.push(['listLocks']);
      return op().locks.map((lock) => ({ ...lock }));
    };
    export const getLock = async (client, workspace, invoiceKey) => {
      op().calls.push(['getLock', key(invoiceKey)]);
      return op().locks.find((lock) => lock.invoice_key === key(invoiceKey)) ?? null;
    };
    export const listPeriods = async () => {
      op().calls.push(['listPeriods']);
      return op().periods;
    };
    export const insertPeriods = async () => [];
    export const supersedePeriod = async () => {};
    export const insertResponse = async () => ({});
    export const updateResponse = async () => ({});
    export const listRequests = async (client, workspace, options = {}) => {
      op().calls.push(['listRequests', options]);
      return op().requests.filter((request) => !options.status || request.status === options.status);
    };
    export const getRequest = async (client, workspace, id) => {
      op().calls.push(['getRequest', id]);
      return op().requests.find((request) => request.id === id) ?? null;
    };
    export const insertRequest = async (client, workspace, request) => {
      const saved = { ...request, id: op().nextRequestId++, created_at: '', updated_at: '' };
      op().calls.push(['insertRequest', saved]);
      op().requests.push(saved);
      return saved;
    };
    export const updateRequest = async (client, workspace, id, patch) => {
      op().calls.push(['updateRequest', id, patch]);
      const at = op().requests.findIndex((request) => request.id === id);
      if (at < 0) throw new Error('gone');
      op().requests[at] = { ...op().requests[at], ...patch };
      return op().requests[at];
    };
    export const appendEvent = async (client, workspace, event) => {
      op().calls.push(['appendEvent', event]);
      op().events.push(event);
      return { ...event, id: 1, at: '' };
    };
  `,
  '@/lib/server/mileage-store': `
    const op = () => globalThis.__op;
    export const listTrucks = async () => {
      op().calls.push(['listTrucks']);
      return op().trucks;
    };
    export const getDay = async (client, workspace, truckId, date) => {
      op().calls.push(['getDay', truckId, date]);
      return op().days.get(truckId + '|' + date) ?? null;
    };
    export const listDays = async () => [];
  `,
  '@/lib/server/mileage-calc': `
    const op = () => globalThis.__op;
    export const recalculateDay = async (client, workspace, provider, trucks, truck, date) => {
      op().calls.push(['recalculateDay', truck.id, date]);
      const made = op().mileageResult ? op().mileageResult(truck.id, date) : null;
      if (made) op().days.set(truck.id + '|' + date, made);
      return made;
    };
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
      if (/^\\.\\.?\\//.test(specifier) && !/\\.[a-z]+$/.test(specifier)) {
        return next(specifier + '.ts', context);
      }
      return next(specifier, context);
    }
  `)}`,
);

const { ACTION_TOOLS } = (await import(
  `${root}lib/server/operator/tools/actions/index.ts`
)) as { ACTION_TOOLS: ToolDefinition[] };
const { stateHash } = (await import(`${root}lib/server/operator/tools/actions/shared.ts`)) as {
  stateHash: (parts: unknown[]) => string;
};

const toolNamed = (name: string) => {
  const found = ACTION_TOOLS.find((tool) => tool.name === name);
  assert.ok(found, `${name} is not registered`);
  return found;
};

const ctx = (): ToolContext => ({
  workspaceId: 'workspace-1',
  userId: 'user-1',
  runId: 'run-1',
  origin: 'operator',
  now: new Date('2026-09-22T12:00:00.000Z'),
});
const given = { client: {}, routing: null };

const run = async (name: string, args: unknown) => {
  const tool = toolNamed(name);
  const parsed = tool.parse(args);
  assert.ok('value' in parsed, `${name} refused its arguments: ${JSON.stringify(parsed)}`);
  const impact = await tool.dryRun!(parsed.value, ctx(), given);
  const result = (await tool.handler(parsed.value, ctx(), given)) as ActionResult;
  return { impact, result };
};

// ---------------------------------------------------------------- fixtures

const exact = (value: string | number): FieldResolution => ({
  status: 'exact',
  value,
  visible_text: String(value),
  source: 'visible',
  source_clipped: false,
  clipped_edge: null,
  confidence: 1,
  evidence: [],
});

let nextId = 0;

/** A ticket read whole, filed and not yet looked at. */
const savedRecord = (
  fields: Partial<Ticket>,
  patch: Partial<SavedRecord> = {},
  over: Partial<Record<keyof Ticket, FieldResolution>> = {},
): SavedRecord => {
  const ticket: Ticket = {
    ...emptyTicket(),
    ticket_number: String(1725000000 + ++nextId),
    ticket_date: '2026-09-14',
    customer_id: '60311596',
    customer_name: 'NEW HAULER LLC',
    project_address: '222 WESTERN AVE, MARKHAM, IL 60428',
    gross_lb: 73160,
    tare_lb: 27280,
    net_lb: 45880,
    net_tons: 22.94,
    ...fields,
  };
  const fieldsRead: TicketRecovery['fields'] = {};
  for (const [name, value] of Object.entries(ticket)) {
    if (value !== null && value !== undefined) {
      fieldsRead[name as keyof Ticket] = exact(value as string | number);
    }
  }
  for (const [name, resolution] of Object.entries(over)) {
    fieldsRead[name as keyof Ticket] = resolution;
  }
  return {
    id: nextId,
    saved_at: '2026-09-14T15:00:00.000Z',
    ticket,
    recovery: { version: 1, vendor: 'heidelberg', paper: UNKNOWN_FRAME, fields: fieldsRead },
    invoice: {
      invoice_number: '1042',
      invoice_date: '2026-09-14',
      return_date: '',
      truck_number: '',
      bill_to: { name: 'ILLINOIS BULK CARRIER', address_lines: ['', ''], phone: '' },
    },
    source: { file_name: 'scan.jpg', sha256: 'a'.repeat(64), size: 1, type: 'image/jpeg', kind: 'upload' },
    original_stored: true,
    ocr_text: '',
    customer_profile_id: null,
    truck_id: null,
    invoice_batch_id: 'batch-2026-09-14',
    reviewed_at: null,
    ...patch,
  };
};

/** A weight refused for the mark printed beside it: the reader now reads it. */
const reopenable = (): SavedRecord => {
  const record = savedRecord({ tare_lb: null });
  record.recovery = {
    version: 1,
    vendor: 'heidelberg',
    paper: UNKNOWN_FRAME,
    fields: {
      ...record.recovery!.fields,
      tare_lb: {
        status: 'needs_review',
        value: null,
        visible_text: '27280 *',
        source: null,
        source_clipped: false,
        clipped_edge: null,
        confidence: 0,
        evidence: [],
        reason: 'not_read',
      },
    },
  };
  return record;
};

// ------------------------------------------------------ the registered list

void test('every action tool is a write, previews itself, and asks for a write permission', () => {
  assert.equal(ACTION_TOOLS.length, 7);
  for (const tool of ACTION_TOOLS) {
    assert.equal(tool.type, 'write', `${tool.name} is not a write tool`);
    assert.equal(typeof tool.dryRun, 'function', `${tool.name} has no dry run`);
    assert.ok(tool.risk === 1 || tool.risk === 2, `${tool.name} is risk ${tool.risk}; V1 ships 1 and 2`);
    assert.equal(tool.confirmation, 'conditional', `${tool.name} does not let policy decide`);
    assert.ok(
      (WRITE_PERMISSIONS as readonly string[]).includes(tool.permission),
      `${tool.name} asks for ${tool.permission}, which is not a write permission`,
    );
    assert.ok(
      typeof tool.maxRecords === 'number' && tool.maxRecords > 0,
      `${tool.name} has no record limit`,
    );
    assert.equal(tool.input.type, 'object');
    assert.equal(tool.input.additionalProperties, false, `${tool.name} accepts extra arguments`);
    assert.deepEqual(
      [...(tool.input.required ?? [])].sort(),
      Object.keys(tool.input.properties ?? {}).sort(),
      `${tool.name} does not require every property`,
    );
  }
  assert.deepEqual(
    ACTION_TOOLS.map((tool) => tool.name).sort(),
    [
      'apply_group_ticket_correction',
      'create_rate_followup_draft',
      'create_rate_request_draft',
      'recalculate_invoice',
      'recalculate_mileage',
      'reprocess_ticket',
      'resolve_ticket_exception',
    ],
  );
});

// --------------------------------------------------------- finalized invoices

void test('a ticket on a finalized invoice is never written, and is reported as not attempted', async () => {
  const state = reset();
  const billed = savedRecord({}, { invoice: { ...savedRecord({}).invoice, invoice_number: '2001' } });
  const open = savedRecord({}, { invoice: { ...savedRecord({}).invoice, invoice_number: '2002' } });
  state.records.set(billed.id, billed);
  state.records.set(open.id, open);
  state.locks.push({ invoice_key: '2001', unlocked_at: null });

  const { impact, result } = await run('apply_group_ticket_correction', {
    exception_type: 'NEW_CUSTOMER',
    ticket_ids: [billed.id, open.id],
    answer: { field: 'customer_name', value: 'New Hauler LLC' },
  });

  assert.equal(impact.touches_finalized, true, 'the preview does not say a billed ticket is involved');
  assert.equal(impact.records, 1, 'the preview counts the billed ticket as changeable');
  assert.deepEqual(
    result.not_attempted.map((entity) => entity.id),
    [String(billed.id)],
  );
  const writes = named('updateRecords');
  assert.equal(writes.length, 1, 'the correction was not saved in one transaction');
  assert.deepEqual((writes[0][1] as { id: number }[]).map((edit) => edit.id), [open.id]);
  assert.equal(result.succeeded.length, 1);
  assert.equal(op().records.get(open.id)?.ticket.customer_name, 'New Hauler LLC');
  assert.equal(op().records.get(billed.id)?.ticket.customer_name, 'NEW HAULER LLC');
});

void test('a finalized invoice is refused, and the pricing writer is never reached', async () => {
  const state = reset();
  const line = savedRecord({});
  state.records.set(line.id, line);
  state.locks.push({ invoice_key: '1042', unlocked_at: null });

  const { impact, result } = await run('recalculate_invoice', { invoice_number: '1042' });

  assert.equal(impact.touches_finalized, true);
  assert.ok(impact.blockers.length > 0, 'a finalized invoice is not blocked');
  assert.equal(result.outcome, 'refused');
  // `applyPeriodsToTickets` reads the workspace and writes through
  // `updateRecords`; neither happened, so it was never called.
  assert.equal(named('listRecords').length, 0);
  assert.equal(named('updateRecords').length, 0);
});

// ------------------------------------------------------------- human marks

void test('reprocessing never marks a ticket checked', async () => {
  const state = reset();
  const record = reopenable();
  state.records.set(record.id, record);

  const { impact, result } = await run('reprocess_ticket', { ticket_id: record.id });

  assert.equal(impact.records, 1);
  assert.equal(result.outcome, 'done');
  const writes = named('updateRecords');
  assert.equal(writes.length, 1);
  const edits = writes[0][1] as Record<string, unknown>[];
  assert.equal(edits.length, 1);
  assert.equal('reviewed_at' in edits[0], false, 'the edit carries a review mark');
  assert.equal(edits[0].bookkeeping, true, 'the edit is not marked as the app’s own bookkeeping');
  assert.equal(op().records.get(record.id)?.reviewed_at, null);
  assert.equal(op().records.get(record.id)?.ticket.tare_lb, 27280);
});

void test('a missing ticket is refused before anything is read', async () => {
  reset();
  const tool = toolNamed('reprocess_ticket');
  const parsed = tool.parse({ ticket_id: 404 });
  assert.ok('value' in parsed);
  const impact = await tool.dryRun!(parsed.value, ctx(), given);
  assert.deepEqual(impact.blockers, ['No ticket #404']);
  assert.equal(impact.records, 0);
});

// ----------------------------------------------------------- verification

void test('a write the store does not reflect is reported as failed, not as done', async () => {
  const state = reset();
  const record = reopenable();
  state.records.set(record.id, record);
  state.reflect = false;

  const { result } = await run('reprocess_ticket', { ticket_id: record.id });

  assert.equal(named('updateRecords').length, 1, 'the write was not attempted');
  assert.ok(result.verification.checked > 0);
  assert.ok(
    result.verification.passed < result.verification.checked,
    'a change that never landed verified anyway',
  );
  assert.ok(['failed', 'partial'].includes(result.outcome), `outcome was ${result.outcome}`);
  assert.equal(result.verification.failures.length > 0, true);
});

// ------------------------------------------------------------ rate drafts

void test('a rate request is created as a draft and nothing is sent', async () => {
  const state = reset();
  const record = savedRecord({});
  state.records.set(record.id, record);
  state.profiles.customers = [
    {
      id: 7,
      name: 'New Hauler LLC',
      ticket_customer_ids: ['60311596'],
      ticket_names: [],
      addresses: [],
      flat_rate: null,
      rate_type: 'flat',
      fuel_charge: null,
      notes: '',
      created_at: '2026-01-01T00:00:00.000Z',
    } as CustomerProfile,
  ];

  const { impact, result } = await run('create_rate_request_draft', {
    customer_id: 7,
    from: '2026-09-14',
    to: '2026-09-20',
  });

  assert.equal(impact.records, 1);
  assert.equal(result.outcome, 'done');
  const inserts = named('insertRequest');
  assert.equal(inserts.length, 1);
  const saved = inserts[0][1] as Record<string, unknown>;
  assert.equal(saved.status, 'DRAFT');
  assert.equal(saved.mode, 'DRAFT_ONLY');
  assert.equal(saved.sent_at, null);
  assert.equal(saved.thread_ref, null);
  // Nothing that could reach a customer was called, by any name.
  for (const call of op().calls) {
    assert.ok(
      !/send|sent|simulate|mark/i.test(String(call[0])),
      `a send-shaped call was made: ${String(call[0])}`,
    );
  }
  assert.equal(result.verification.passed, result.verification.checked);
});

void test('an exception with no answer of its own waits for a person', async () => {
  const state = reset();
  const record = savedRecord({});
  state.records.set(record.id, record);

  const tool = toolNamed('resolve_ticket_exception');
  const parsed = tool.parse({
    exception_type: 'NEW_CUSTOMER',
    ticket_ids: [record.id],
    accept_suggested: true,
  });
  assert.ok('value' in parsed);
  const impact = await tool.dryRun!(parsed.value, ctx(), given);
  assert.ok(
    impact.blockers.some((line) => /needs a person/i.test(line)),
    `blockers were ${JSON.stringify(impact.blockers)}`,
  );
  const result = (await tool.handler(parsed.value, ctx(), given)) as ActionResult;
  assert.equal(result.outcome, 'refused');
  assert.equal(named('updateRecords').length, 0);
});

void test('mileage without a routing provider is blocked rather than attempted', async () => {
  reset();
  const tool = toolNamed('recalculate_mileage');
  const parsed = tool.parse({ truck_number: null, date: '2026-09-14', from: null, to: null });
  assert.ok('value' in parsed);
  const impact = await tool.dryRun!(parsed.value, ctx(), given);
  assert.ok(impact.blockers.includes('Routing is not configured'));
  const result = (await tool.handler(parsed.value, ctx(), given)) as ActionResult;
  assert.equal(result.outcome, 'refused');
  assert.equal(named('recalculateDay').length, 0);
});

void test('one truck-day that fails among several is reported as partial', async () => {
  const state = reset();
  const first = savedRecord({ ticket_date: '2026-09-14' }, { truck_id: 3 });
  const second = savedRecord({ ticket_date: '2026-09-15' }, { truck_id: 3 });
  state.records.set(first.id, first);
  state.records.set(second.id, second);
  state.trucks = [
    {
      id: 3,
      truck_number: '321',
      nickname: '',
      driver: '',
      license_plate: '',
      notes: '',
      active: true,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ];
  const day = (date: string, status: string) => ({
    id: 1,
    truck_id: 3,
    truck_number: '321',
    service_date: date,
    status,
    review_reasons: [],
    warnings: [],
    error: status === 'failed' ? 'The route could not be worked out.' : null,
    calc_started_at: null,
    last_attempt_at: null,
    input_hash: 'hash',
    result_input_hash: 'hash',
    ticket_ids: [],
    ticket_count: 1,
    order_basis: null,
    stop_order: null,
    legs: [],
    total_miles: status === 'failed' ? null : 42,
    total_seconds: null,
    mpg: null,
    est_gallons: null,
    profile_snapshot: null,
    profile_hash: null,
    calc_version: 1,
    calculated_at: status === 'failed' ? null : '2026-09-22T12:00:00.000Z',
  });
  state.mileageResult = (truckId, date) =>
    date === '2026-09-15' ? day(date, 'failed') : day(date, 'current');

  const tool = toolNamed('recalculate_mileage');
  const parsed = tool.parse({ truck_number: '321', date: null, from: '2026-09-14', to: '2026-09-15' });
  assert.ok('value' in parsed);
  const routed = { client: {}, routing: { name: 'tomtom', version: '1' } };
  const impact = await tool.dryRun!(parsed.value, ctx(), routed);
  assert.equal(impact.records, 2);
  assert.deepEqual(impact.blockers, []);
  const result = (await tool.handler(parsed.value, ctx(), routed)) as ActionResult;
  assert.equal(named('recalculateDay').length, 2);
  assert.equal(result.outcome, 'partial');
  assert.equal(result.succeeded.length, 1);
  assert.equal(result.failed.length, 1);
  assert.equal(result.verification.checked, 2);
  assert.equal(result.verification.passed, 1);
});

// ------------------------------------------------------------- state hash

void test('the fingerprint moves when a record has been edited since the preview', async () => {
  const state = reset();
  const record = reopenable();
  state.records.set(record.id, record);
  const tool = toolNamed('reprocess_ticket');
  const parsed = tool.parse({ ticket_id: record.id });
  assert.ok('value' in parsed);
  const before = await tool.dryRun!(parsed.value, ctx(), given);
  state.records.set(record.id, { ...record, edited_at: '2026-09-21T09:00:00.000Z' });
  const after = await tool.dryRun!(parsed.value, ctx(), given);
  assert.notEqual(before.state_hash, after.state_hash);
  assert.equal(stateHash([1, 'a']), stateHash([1, 'a']));
  assert.notEqual(stateHash([1, 'a']), stateHash([1, 'b']));
});

void test('the fingerprint moves when the value a correction targets has changed', async () => {
  const state = reset();
  // A bookkeeping edit leaves `edited_at` alone, and these two readings of the
  // same name group identically — `normalizeName` upper-cases — so nothing but
  // the field's own value distinguishes them.
  const record = savedRecord({ customer_name: 'NEW HAULER LLC' });
  state.records.set(record.id, record);
  const tool = toolNamed('apply_group_ticket_correction');
  const parsed = tool.parse({
    exception_type: 'NEW_CUSTOMER',
    ticket_ids: [record.id],
    answer: { field: 'customer_name', value: 'New Hauler LLC' },
  });
  assert.ok('value' in parsed);

  const before = await tool.dryRun!(parsed.value, ctx(), given);
  assert.deepEqual(before.blockers, [], 'the question was not found');
  assert.equal(before.records, 1);

  const changed = { ...record, ticket: { ...record.ticket, customer_name: 'new hauler llc' } };
  state.records.set(record.id, changed);
  const after = await tool.dryRun!(parsed.value, ctx(), given);
  assert.equal(after.records, 1, 'the question is no longer the same question');
  assert.notEqual(
    before.state_hash,
    after.state_hash,
    'a preview taken before the value changed still matches afterwards',
  );
});

void test('the reprocess fingerprint moves when the value it would write has changed', async () => {
  const state = reset();
  const record = reopenable();
  state.records.set(record.id, record);
  const tool = toolNamed('reprocess_ticket');
  const parsed = tool.parse({ ticket_id: record.id });
  assert.ok('value' in parsed);

  const before = await tool.dryRun!(parsed.value, ctx(), given);
  assert.equal(before.records, 1);

  const fields = { ...record.recovery!.fields };
  fields.tare_lb = { ...fields.tare_lb!, visible_text: '27300 *' };
  state.records.set(record.id, { ...record, recovery: { ...record.recovery!, fields } });
  const after = await tool.dryRun!(parsed.value, ctx(), given);
  assert.equal(after.records, 1);
  assert.notEqual(before.state_hash, after.state_hash);
});

// ------------------------------------------------------- the pricing scope

void test('the invoice preview counts every ticket the customer scope would re-price', async () => {
  const state = reset();
  const address = '222 WESTERN AVE, MARKHAM, IL 60428';
  const onInvoice = savedRecord({ ticket_date: '2026-09-14' });
  const elsewhere = savedRecord(
    { ticket_date: '2026-09-15' },
    { invoice: { ...onInvoice.invoice, invoice_number: '1043' } },
  );
  state.records.set(onInvoice.id, onInvoice);
  state.records.set(elsewhere.id, elsewhere);
  state.profiles.customers = [
    {
      id: 7,
      name: 'New Hauler LLC',
      ticket_customer_ids: ['60311596'],
      ticket_names: [],
      addresses: [],
      flat_rate: null,
      rate_type: 'flat',
      fuel_charge: null,
      notes: '',
      created_at: '2026-01-01T00:00:00.000Z',
    } as CustomerProfile,
  ];
  state.periods = [
    {
      id: 11,
      customer_profile_id: 7,
      job_key: jobKeyOf(address),
      job_label: address,
      kind: 'base',
      effective_from: '2026-09-01',
      effective_to: null,
      validity: 'PERIOD',
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
      created_at: '2026-09-01T00:00:00.000Z',
    } as RatePeriod,
  ];

  const tool = toolNamed('recalculate_invoice');
  assert.equal(tool.maxRecords, 100, 'the pricing scope is not bounded at a hundred tickets');
  const parsed = tool.parse({ invoice_number: '1042' });
  assert.ok('value' in parsed);
  const impact = await tool.dryRun!(parsed.value, ctx(), given);

  assert.deepEqual(impact.blockers, []);
  assert.equal(impact.records, 2, 'the spill onto the customer is not counted');
  assert.ok(impact.lines.some((line) => /1 ticket on this invoice would be re-priced/.test(line)));
  assert.ok(
    impact.lines.some((line) => /1 other ticket for the same customer would be priced too/.test(line)),
  );
  // The entities stay this invoice's own: the spill is said in words, not linked.
  assert.deepEqual(
    impact.affected.map((entity) => entity.type),
    ['invoice', 'ticket'],
  );
  assert.deepEqual(
    impact.affected.filter((entity) => entity.type === 'ticket').map((entity) => entity.id),
    [String(onInvoice.id)],
  );
});

// ------------------------------------------------------------ source guard

void test('no action tool reaches a business table, a review mark or the mail path', () => {
  const folder = new URL('../lib/server/operator/tools/actions/', import.meta.url);
  const paths = [
    ...readdirSync(folder).map((name) => `lib/server/operator/tools/actions/${name}`),
    'lib/server/operator/locks.ts',
    'lib/server/operator/verify.ts',
  ];
  // `unlock` is not in this list as a bare word: reading `lock.unlocked_at` is
  // how a lock is known to be in force. What must not appear is the unlocking.
  const forbidden = [
    /\.insert\(/,
    /\.update\(/,
    /\.delete\(/,
    /\.upsert\(/,
    /\.rpc\(/,
    /\.from\(/,
    /reviewed_at:/,
    /sendRateRequest/,
    /markRequestSent/,
    /unlockInvoice/,
    /lockInvoice/,
    /\/send/,
    /mark-sent/,
    /simulate/,
  ];
  for (const path of paths) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
    for (const pattern of forbidden) {
      assert.ok(!pattern.test(source), `${path} contains ${pattern}`);
    }
  }
  assert.ok(paths.length >= 7, 'the action folder was not read');
});
