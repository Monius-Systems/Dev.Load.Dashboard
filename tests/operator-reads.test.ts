import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { READ_PERMISSIONS, type ReadResult, type ToolContext, type ToolDefinition, type ToolDeps } from '../lib/operator/types.ts';
import { emptyTicket, type SavedRecord } from '../lib/load-desk/types.ts';

// The Operator's read tools: what the model may ask about the business, and
// the bounds every one of those questions is answered within.
//
// The tools live under lib/server, where modules import `cloudflare:workers`
// and talk to Supabase, so a resolver is registered for this file alone: the
// worker environment and the three stores are stubbed with in-memory fixtures,
// and everything actually under test — the schemas, the bounds, the readiness
// wording, the snapshot's cache — is the real module. The ticket store's
// unbounded `listRecords` throws in the stub, so a tool that reached for a
// whole workspace would fail here rather than in production.

const root = pathToFileURL(`${process.cwd()}/`).href;

const STUBS: Record<string, string> = {
  'cloudflare:workers': 'export const env = {};',
  '@/lib/server/openai-key': `
    export const OPENAI_KEY_NAME = 'OPENAI_API_KEY';
    export const openaiKey = () => null;
  `,
  '@/lib/server/routing-provider': `
    export const routingProvider = () => null;
    export class ProviderError extends Error {}
  `,
  '@/lib/server/load-desk-store': `
    const fakes = () => globalThis.__operatorFakes;
    export class StoreError extends Error {
      constructor(message, status) { super(message); this.status = status; }
    }
    export const ORIGINALS_BUCKET = 'load-desk-originals';
    export const listRecords = async () => {
      throw new Error('listRecords must never be called by a read tool');
    };
    export const getRecord = async (client, workspace, id) => {
      fakes().calls.getRecord += 1;
      return fakes().records.find((record) => record.id === id) ?? null;
    };
    export const listRecordsBetween = async (client, workspace, from, to, limit = 500) => {
      fakes().calls.listRecordsBetween += 1;
      fakes().lastRange = { from, to, limit };
      return fakes()
        .records.filter((record) => {
          const date = record.ticket.ticket_date;
          return typeof date === 'string' && date >= from && date <= to;
        })
        .slice(0, limit);
    };
    export const listProfiles = async () => {
      fakes().calls.listProfiles += 1;
      const { customers, trucks, clients, company } = fakes().profiles;
      return { customers, trucks, clients, company };
    };
  `,
  '@/lib/server/rates-store': `
    const fakes = () => globalThis.__operatorFakes;
    const key = (value) => String(value).trim().toLowerCase();
    export const listPeriods = async (client, workspace, options = {}) => {
      fakes().calls.listPeriods += 1;
      return fakes().periods.filter(
        (period) => options.customerId === undefined || period.customer_profile_id === options.customerId,
      );
    };
    export const listRequests = async (client, workspace, options = {}) => {
      fakes().calls.listRequests += 1;
      return fakes().requests.filter((request) => !options.status || request.status === options.status);
    };
    export const listResponses = async () => [];
    export const listEvents = async (client, workspace, options = {}) => {
      fakes().calls.listEvents += 1;
      return fakes().events.slice(0, options.limit ?? 200);
    };
    export const listLocks = async () => {
      fakes().calls.listLocks += 1;
      return fakes().locks;
    };
    export const getLock = async (client, workspace, invoiceKey) => {
      fakes().calls.getLock += 1;
      return fakes().locks.find((lock) => lock.invoice_key === key(invoiceKey)) ?? null;
    };
  `,
  '@/lib/server/mileage-store': `
    const fakes = () => globalThis.__operatorFakes;
    export const listTrucks = async () => {
      fakes().calls.listTrucks += 1;
      return fakes().profiles.trucks;
    };
    export const listDays = async (client, workspace, from, to) => {
      fakes().calls.listDays += 1;
      return fakes().days.filter((day) => day.service_date >= from && day.service_date <= to);
    };
    export const getDay = async (client, workspace, truckId, date) => {
      fakes().calls.getDay += 1;
      return fakes().days.find((day) => day.truck_id === truckId && day.service_date === date) ?? null;
    };
    export const recordsForDay = async (client, workspace, date) => {
      fakes().calls.recordsForDay += 1;
      return fakes().records.filter((record) => record.ticket.ticket_date === date);
    };
    export const getRouteModes = async () => ({});
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
      if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\\.[a-z]+$/.test(specifier)) {
        return next(specifier + '.ts', context);
      }
      return next(specifier, context);
    }
  `)}`,
);

// ---------------------------------------------------------------- fixtures

/** A Tuesday, so every default window below lands on the fixture dates. */
const NOW = new Date(2026, 8, 22, 12, 0, 0);

type Fixture = {
  records: SavedRecord[];
  profiles: {
    customers: Record<string, unknown>[];
    trucks: Record<string, unknown>[];
    clients: unknown[];
    company: null;
  };
  periods: Record<string, unknown>[];
  requests: Record<string, unknown>[];
  locks: Record<string, unknown>[];
  events: Record<string, unknown>[];
  days: Record<string, unknown>[];
  calls: Record<string, number>;
  lastRange: { from: string; to: string; limit: number } | null;
};

const ticketOf = (over: Partial<ReturnType<typeof emptyTicket>>) => ({ ...emptyTicket(), ...over });

const savedRecord = (
  id: number,
  invoiceNumber: string,
  over: Partial<ReturnType<typeof emptyTicket>>,
  extra: Partial<SavedRecord> = {},
): SavedRecord => ({
  id,
  saved_at: '2026-09-21T10:00:00.000Z',
  ticket: ticketOf({
    plant_name: 'Dufferin Aggregates',
    customer_id: '60311596',
    customer_name: 'Five Construction',
    net_lb: 40_000,
    net_tons: 20,
    ...over,
  }),
  invoice: {
    invoice_number: invoiceNumber,
    invoice_date: over.ticket_date ?? '2026-09-20',
    return_date: '',
    truck_number: '321',
    bill_to: { name: 'Five Construction', address_lines: ['', ''], phone: '' },
  },
  source: { file_name: 'scan.jpg', sha256: `sha${id}`, size: 1, type: 'image/jpeg', kind: 'upload' },
  original_stored: true,
  ocr_text: 'RAW SCAN TEXT THAT MUST NEVER REACH THE MODEL',
  customer_profile_id: 5,
  reviewed_at: '2026-09-21T11:00:00.000Z',
  ...extra,
});

const records: SavedRecord[] = [
  savedRecord(1, '1001', {
    ticket_number: '100001',
    ticket_date: '2026-09-15',
    project_name: 'Thornton Yard',
    project_address: '10 Thornton Rd',
    rate: 10,
    fuel_charge: 1,
  }),
  savedRecord(2, '1001', {
    ticket_number: '100002',
    ticket_date: '2026-09-16',
    project_name: 'Thornton Yard',
    project_address: '10 Thornton Rd',
    rate: 10,
    fuel_charge: 1,
  }),
  savedRecord(3, '1002', {
    ticket_number: '100003',
    ticket_date: '2026-09-15',
    project_name: 'Markham Road',
    project_address: '55 Markham Rd',
    rate: 10,
  }),
  savedRecord(4, '1002', {
    ticket_number: '100004',
    ticket_date: '2026-09-20',
    project_name: 'Markham Road',
    project_address: '55 Markham Rd',
    rate: 10,
  }),
  savedRecord(5, '1003', {
    ticket_number: '100005',
    ticket_date: '2026-09-19',
    project_name: 'Thornton Yard',
    project_address: '10 Thornton Rd',
    rate: 12,
    fuel_charge: 2,
  }),
  savedRecord(
    6,
    '1004',
    { ticket_number: '100006', ticket_date: '2026-09-17', customer_name: null, customer_id: null },
    { customer_profile_id: null, reviewed_at: null },
  ),
  savedRecord(
    7,
    '1004',
    { ticket_number: '100007', ticket_date: '2026-09-18', net_lb: null, net_tons: null },
    { reviewed_at: null },
  ),
];

const fixture: Fixture = {
  records,
  profiles: {
    customers: [
      {
        id: 5,
        name: 'Five Construction',
        ticket_customer_ids: ['60311596'],
        ticket_names: ['FIVE CONSTRUCTION'],
        addresses: ['10 Thornton Rd', '55 Markham Rd'],
        location_rates: [],
        flat_rate: null,
        fuel_charge: null,
        rate_contacts: [{ name: 'Dana Reid', email: 'dana@five.example', title: 'AP', primary: true, cc: [], notes: '' }],
        notes: '',
        created_at: '2026-01-01T00:00:00.000Z',
      },
    ],
    trucks: [
      {
        id: 1,
        truck_number: '321',
        nickname: 'Big red',
        driver: 'Sam',
        license_plate: '',
        notes: '',
        active: true,
        created_at: '2026-01-01T00:00:00.000Z',
        ifta: {
          yard_address: '1 Yard Rd',
          mpg: 6,
          height_ft: 13,
          width_ft: 8,
          length_ft: 40,
          gross_weight_lb: 80_000,
          axle_weight_lb: 20_000,
          axles: 5,
          commercial: true,
        },
      },
    ],
    clients: [],
    company: null,
  },
  periods: [
    {
      id: 11,
      customer_profile_id: 5,
      job_key: '55 MARKHAM RD',
      job_label: 'Markham Road',
      kind: 'base',
      effective_from: '2026-09-01',
      effective_to: null,
      validity: 'PERIOD',
      rate_type: 'PER_TON',
      fuel_type: null,
      value: 10,
      source: 'manual',
      source_request_id: null,
      source_response_id: null,
      confidence: null,
      applied_by: 'human',
      confirmed_by: null,
      confirmed_at: '2026-09-01T00:00:00.000Z',
      superseded_by: null,
      note: null,
      created_at: '2026-09-01T00:00:00.000Z',
    },
  ],
  requests: [
    {
      id: 9,
      customer_profile_id: 5,
      period_from: '2026-09-14',
      period_to: '2026-09-20',
      status: 'WAITING_FOR_REPLY',
      mode: 'DRAFT_ONLY',
      recipient: 'dana@five.example',
      cc: [],
      subject: 'Rates for Sep 14–20',
      body: 'Could you confirm the fuel surcharge?',
      items: [{ job_key: '55 MARKHAM RD', job_label: 'Markham Road', fields: ['fuel'], ticket_count: 2 }],
      answered: [],
      sent_at: '2026-09-15T09:00:00.000Z',
      reply_at: null,
      follow_up_due_at: '2026-09-18T09:00:00.000Z',
      follow_up_count: 0,
      thread_ref: null,
      created_at: '2026-09-15T09:00:00.000Z',
      updated_at: '2026-09-15T09:00:00.000Z',
    },
  ],
  locks: [
    {
      invoice_key: '1003',
      finalized_at: '2026-09-21T12:00:00.000Z',
      finalized_by: 'sam',
      snapshot: { total: 240, lines: [{ record_id: 5, total: 240 }] },
      unlocked_at: null,
      unlock_reason: null,
    },
  ],
  events: [
    {
      id: 1,
      kind: 'RATE_REQUEST_CREATED',
      customer_profile_id: 5,
      request_id: 9,
      response_id: null,
      period_id: null,
      invoice_key: null,
      detail: 'Asked Five Construction for the fuel surcharge.',
      actor: 'sam',
      at: '2026-09-15T09:00:00.000Z',
    },
    {
      id: 2,
      kind: 'INVOICE_FINALIZED',
      customer_profile_id: 5,
      request_id: null,
      response_id: null,
      period_id: null,
      invoice_key: '1003',
      detail: 'Invoice 1003 finalized.',
      actor: null,
      at: '2026-09-21T12:00:00.000Z',
    },
  ],
  days: [
    {
      id: 21,
      truck_id: 1,
      truck_number: '321',
      service_date: '2026-09-20',
      status: 'current',
      review_reasons: [],
      warnings: [],
      error: null,
      calc_started_at: null,
      last_attempt_at: '2026-09-20T20:00:00.000Z',
      input_hash: 'hash-a',
      result_input_hash: 'hash-a',
      ticket_ids: [4],
      ticket_count: 1,
      order_basis: 'time',
      stop_order: null,
      legs: [
        {
          seq: 1,
          kind: 'yard_to_pickup',
          ticket_id: 4,
          from: { label: 'Yard', place_key: 'YARD', lat: 43, lon: -79 },
          to: { label: 'Markham', place_key: 'MARKHAM', lat: 43.9, lon: -79.3 },
          miles: 30,
          seconds: 2_000,
          route_id: 7,
          cached: true,
        },
      ],
      total_miles: 120,
      total_seconds: 9_000,
      mpg: 6,
      est_gallons: 20,
      profile_snapshot: null,
      profile_hash: 'p1',
      calc_version: 1,
      calculated_at: '2026-09-20T20:05:00.000Z',
    },
    {
      id: 22,
      truck_id: 1,
      truck_number: '321',
      service_date: '2026-09-19',
      status: 'failed',
      review_reasons: [],
      warnings: [],
      error: 'The routing provider did not answer.',
      calc_started_at: null,
      last_attempt_at: '2026-09-19T20:00:00.000Z',
      input_hash: 'hash-b',
      result_input_hash: null,
      ticket_ids: [5],
      ticket_count: 1,
      order_basis: 'time',
      stop_order: null,
      legs: [],
      total_miles: null,
      total_seconds: null,
      mpg: 6,
      est_gallons: null,
      profile_snapshot: null,
      profile_hash: null,
      calc_version: 1,
      calculated_at: null,
    },
  ],
  calls: {
    getRecord: 0,
    listRecordsBetween: 0,
    listProfiles: 0,
    listPeriods: 0,
    listRequests: 0,
    listEvents: 0,
    listLocks: 0,
    getLock: 0,
    listTrucks: 0,
    listDays: 0,
    getDay: 0,
    recordsForDay: 0,
  },
  lastRange: null,
};

(globalThis as unknown as { __operatorFakes: Fixture }).__operatorFakes = fixture;

const resetCalls = () => {
  for (const name of Object.keys(fixture.calls)) fixture.calls[name] = 0;
};

const { READ_TOOLS } = await import(`${root}lib/server/operator/tools/read/index.ts`);
const { businessSnapshot } = await import(`${root}lib/server/operator/context.ts`);

const tools = READ_TOOLS as ToolDefinition[];
const byName = (name: string): ToolDefinition => {
  const tool = tools.find((candidate) => candidate.name === name);
  if (!tool) throw new Error(`no read tool named ${name}`);
  return tool;
};

const context = (workspace = 'workspace-1'): ToolContext => ({
  workspaceId: workspace,
  userId: 'user-1',
  runId: 'run-1',
  origin: 'operator',
  now: NOW,
});

const dependencies: ToolDeps = { client: {}, routing: null };

async function run(name: string, args: unknown, workspace?: string): Promise<ReadResult> {
  const tool = byName(name);
  const parsed = tool.parse(args);
  if (!('value' in parsed)) throw new Error(`parse refused ${name}: ${parsed.error}`);
  const result = await tool.handler(parsed.value, context(workspace), dependencies);
  assert.equal(result.kind, 'read');
  return result as ReadResult;
}

// ------------------------------------------------------------ the contract

void test('every read tool is risk zero, never confirmed and strictly typed', () => {
  assert.ok(tools.length >= 19, `expected the V1 read tools, found ${tools.length}`);
  const names = new Set<string>();
  for (const tool of tools) {
    assert.equal(tool.type, 'read', `${tool.name} is not a read`);
    assert.equal(tool.risk, 0, `${tool.name} is not risk 0`);
    assert.equal(tool.confirmation, 'never', `${tool.name} asks for confirmation`);
    assert.ok(
      (READ_PERMISSIONS as readonly string[]).includes(tool.permission),
      `${tool.name} wants ${tool.permission}, which is not a read permission`,
    );
    assert.equal(tool.dryRun, undefined, `${tool.name} has a dry run`);
    assert.equal(tool.input.type, 'object');
    assert.equal(tool.input.additionalProperties, false, `${tool.name} allows extra properties`);
    assert.deepEqual(
      tool.input.required,
      Object.keys(tool.input.properties ?? {}),
      `${tool.name} does not require every property`,
    );
    assert.ok(!names.has(tool.name), `${tool.name} is registered twice`);
    names.add(tool.name);
  }
  for (const expected of [
    'get_business_overview',
    'get_processing_status',
    'search_tickets',
    'get_ticket',
    'get_ticket_exceptions',
    'search_invoices',
    'get_invoice',
    'get_invoice_readiness',
    'search_customers',
    'get_customer',
    'get_project',
    'get_rate_status',
    'get_rate_requests',
    'get_rate_history',
    'get_mileage_day',
    'get_truck_mileage',
    'get_fuel_usage',
    'get_ifta_status',
    'get_recent_activity',
    'get_system_health',
  ]) {
    assert.ok(names.has(expected), `${expected} is missing from READ_TOOLS`);
  }
});

// ------------------------------------------------------------- what it says

void test('an invoice waiting on fuel says so in words a person would use', async () => {
  const result = await run('get_invoice_readiness', { invoice_number: '1002' });
  const data = result.data as { status: string; blockers: string[] };
  assert.equal(data.status, 'WAITING_FOR_FUEL');
  assert.equal(data.blockers.length, 1);
  assert.match(data.blockers[0], /Markham Road/);
  assert.match(data.blockers[0], /fuel surcharge/);
  assert.match(result.summary, /fuel surcharge/);
});

void test('an invoice number nobody has says which days were looked at', async () => {
  const result = await run('get_invoice', { invoice_number: '99999' });
  const data = result.data as { found: boolean; searched: { from: string; to: string } };
  assert.equal(data.found, false);
  assert.equal(data.searched.to, '2026-09-22');
  assert.match(result.summary, /older invoices were not read/);
});

// --------------------------------------------------------------- the bounds

void test('searching tickets reads the last thirty days and never the whole workspace', async () => {
  resetCalls();
  const result = await run('search_tickets', {
    query: null,
    from: null,
    to: null,
    truck_number: null,
    customer: null,
    invoice_number: null,
    needs_review_only: false,
    limit: 50,
  });
  assert.equal(fixture.lastRange?.from, '2026-08-24');
  assert.equal(fixture.lastRange?.to, '2026-09-22');
  assert.ok(fixture.calls.listRecordsBetween > 0);
  const data = result.data as { range: { from: string; to: string }; tickets: unknown[] };
  assert.equal(data.range.from, '2026-08-24');
  assert.equal(data.tickets.length, records.length);
});

void test('a range longer than the cap is shortened and says so', async () => {
  const result = await run('search_tickets', {
    query: null,
    from: '2024-01-01',
    to: '2026-09-22',
    truck_number: null,
    customer: null,
    invoice_number: null,
    needs_review_only: false,
    limit: 10,
  });
  const data = result.data as { range: { from: string; clamped: boolean } };
  assert.equal(data.range.clamped, true);
  assert.equal(data.range.from, '2026-05-26');
  assert.match(result.summary, /shortened to 120 days/);
});

void test('dates the wrong way round are swapped rather than refused', async () => {
  const result = await run('search_tickets', {
    query: null,
    from: '2026-09-20',
    to: '2026-09-15',
    truck_number: null,
    customer: null,
    invoice_number: null,
    needs_review_only: false,
    limit: 10,
  });
  const data = result.data as { range: { from: string; to: string } };
  assert.equal(data.range.from, '2026-09-15');
  assert.equal(data.range.to, '2026-09-20');
});

// ------------------------------------------------------------ one ticket

void test('a ticket on a finalized invoice reports the lock', async () => {
  const result = await run('get_ticket', { ticket_id: 5 });
  const data = result.data as { found: boolean; locked: boolean; invoice: { status: string } };
  assert.equal(data.found, true);
  assert.equal(data.locked, true);
  assert.equal(data.invoice.status, 'FINALIZED');
});

void test('a ticket nobody has is answered rather than thrown', async () => {
  const result = await run('get_ticket', { ticket_id: 4_242 });
  assert.equal((result.data as { found: boolean }).found, false);
});

void test('a truck number nobody has offers the numbers that exist', async () => {
  const result = await run('get_mileage_day', { truck_number: '999', date: '2026-09-20' });
  const data = result.data as { found: boolean; known_truck_numbers: string[] };
  assert.equal(data.found, false);
  assert.deepEqual(data.known_truck_numbers, ['321']);
});

void test('one mileage day reads its stored figures and its runs', async () => {
  const result = await run('get_mileage_day', { truck_number: '321', date: '2026-09-20' });
  const data = result.data as {
    found: boolean;
    day: { miles: number } | null;
    runs: { route_id: number; driven_as: string }[];
  };
  assert.equal(data.found, true);
  assert.equal(data.day?.miles, 120);
  assert.equal(data.runs[0].route_id, 7);
  assert.equal(data.runs[0].driven_as, 'truck');
});

// ---------------------------------------------------------- the exceptions

void test('the backlog is grouped and bounded', async () => {
  const result = await run('get_ticket_exceptions', { days: 60 });
  const data = result.data as {
    waiting_tickets: number;
    considered: number;
    individual_review_tickets: number;
    groups: { count: number; ticket_ids: number[] }[];
  };
  assert.equal(data.waiting_tickets, 2);
  assert.equal(data.considered, 2);
  assert.ok(data.groups.length + data.individual_review_tickets >= 1);
  for (const group of data.groups) assert.ok(group.ticket_ids.length <= 20);
});

// ------------------------------------------------------------- the snapshot

void test('the business snapshot is short, readable and cached for a minute', async () => {
  resetCalls();
  const first = await businessSnapshot({}, 'workspace-cache', NOW);
  assert.ok(typeof first === 'string');
  assert.ok(first.length < 900, `snapshot is ${first.length} characters`);
  assert.match(first, /Tickets/);
  assert.match(first, /Invoices/);
  assert.match(first, /Today: 2026-09-22/);
  const reads = Object.values(fixture.calls).reduce((sum, count) => sum + count, 0);
  assert.ok(reads > 0, 'the snapshot read nothing');

  resetCalls();
  const second = await businessSnapshot({}, 'workspace-cache', new Date(NOW.getTime() + 1_000));
  assert.equal(second, first);
  assert.equal(
    Object.values(fixture.calls).reduce((sum, count) => sum + count, 0),
    0,
    'the second snapshot went back to the stores',
  );
});

// --------------------------------------------------------- what never leaks

void test('no read tool hands the model the scan text', async () => {
  const results = [
    await run('search_tickets', {
      query: null,
      from: null,
      to: null,
      truck_number: null,
      customer: null,
      invoice_number: null,
      needs_review_only: false,
      limit: 50,
    }),
    await run('get_ticket', { ticket_id: 1 }),
    await run('get_invoice', { invoice_number: '1002' }),
    await run('get_ticket_exceptions', { days: 30 }),
    await run('get_processing_status', { days: 30 }),
    await run('get_customer', { customer_id: 5 }),
    await run('get_rate_requests', { status: null, customer_id: null, limit: 10 }),
    await run('get_recent_activity', { limit: 10, customer_id: null }),
    await run('get_system_health', {}),
    await run('get_ifta_status', { quarter: '2026-Q3' }),
    await run('get_fuel_usage', { from: null, to: null }),
    await run('get_truck_mileage', { truck_number: '321', from: null, to: null }),
    await run('get_rate_status', { customer_id: null, from: null, to: null }),
    await run('get_rate_history', { customer_id: 5, job_key: null }),
    await run('get_project', { job_key: null, project_address: '55 Markham Rd' }),
    await run('search_customers', { query: null, limit: 10 }),
    await run('search_invoices', { status: 'ANY', from: null, to: null, customer: null, limit: 10 }),
    await run('get_business_overview', {}),
  ];
  for (const result of results) {
    const text = JSON.stringify(result);
    assert.ok(!text.includes('ocr_text'), 'a read tool returned the scan text field');
    assert.ok(!text.includes('RAW SCAN TEXT'), 'a read tool returned the scan text');
  }
});

// -------------------------------------------------------------- the sources

void test('no read tool file can write', () => {
  const dir = new URL('../lib/server/operator/tools/read/', import.meta.url);
  const files = readdirSync(dir).filter((name) => name.endsWith('.ts'));
  assert.ok(files.length >= 10, `expected a file per area, found ${files.length}`);
  const forbidden = /\.(insert|update|delete|upsert|rpc)\(/;
  for (const name of [...files.map((file) => `lib/server/operator/tools/read/${file}`), 'lib/server/operator/context.ts']) {
    const source = readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
    assert.ok(!forbidden.test(source), `${name} contains a write`);
    assert.ok(!/listRecords\(/.test(source), `${name} reads the whole workspace`);
  }
});
