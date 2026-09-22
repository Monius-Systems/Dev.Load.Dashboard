import type { SupabaseClient } from '@supabase/supabase-js';
import type { EntityRef, ToolDefinition } from '@/lib/operator/types';
import { invoiceGroups, invoiceKey, type InvoiceGroup } from '@/lib/load-desk/records';
import {
  invoiceReadiness,
  jobKeyOf,
  periodLabel,
  remainingItems,
  type InvoiceReadiness,
  type MissingField,
} from '@/lib/load-desk/rates';
import { customerIdFor, normalizeName, type CustomerProfile } from '@/lib/load-desk/profiles';
import { ticketDay } from '@/lib/load-desk/ticket-date';
import { listProfiles, listRecordsBetween } from '@/lib/server/load-desk-store';
import { listLocks, listPeriods, listRequests } from '@/lib/server/rates-store';
import type { SavedRecord } from '@/lib/load-desk/types';
import { customerRef, invoiceRef, rateRequestRef } from './refs';
import {
  bounded,
  capped,
  choice,
  dateRange,
  deps,
  FREE_OUTPUT,
  invoiceView,
  isoDate,
  isoDay,
  nullableString,
  parser,
  positiveInt,
  rangeWords,
  readTool,
  requiredText,
  shiftDays,
  strictInput,
  ticketView,
} from './shared';

// Invoices: groups of tickets sharing an invoice number, and the three steps
// a person thinks in — are the tickets in, is the hauling rate agreed, is the
// fuel surcharge agreed. Readiness is never worked out here; `invoiceReadiness`
// answers it, from the same rate periods the Rates page reads.

const READ_LIMIT = 1000;
/** How far back a search looks when the caller gives no dates. */
const DEFAULT_DAYS = 60;
/** How far back a lookup by invoice number looks. */
const LOOKUP_DAYS = 120;
const MAX_TICKETS_SHOWN = 60;
const MAX_ENTITIES = 20;

const STATUSES = ['READY', 'WAITING_FOR_RATE', 'WAITING_FOR_FUEL', 'NEEDS_REVIEW', 'FINALIZED', 'ANY'] as const;
type StatusFilter = (typeof STATUSES)[number];

/** A request nobody has settled, for the invoice's customer. */
const OPEN_REQUEST = new Set([
  'DRAFT',
  'READY_TO_SEND',
  'SENT',
  'WAITING_FOR_REPLY',
  'RESPONSE_RECEIVED',
  'AI_PROCESSING',
  'NEEDS_CONFIRMATION',
  'FOLLOW_UP_DUE',
]);

const FIELD_WORDS: Record<MissingField, string> = {
  base: 'hauling rate',
  fuel: 'fuel surcharge',
};

/**
 * What an invoice is waiting for, said as sentences a person would say: which
 * job, which stretch of days, and which of the two figures is missing.
 */
function blockerSentences(group: InvoiceGroup, readiness: InvoiceReadiness): string[] {
  if (readiness.status === 'READY') return [];
  if (readiness.status === 'FINALIZED') return [];
  if (readiness.status === 'NEEDS_REVIEW') {
    return ['Some tickets on this invoice carry a field nobody has checked against the original yet.'];
  }
  return readiness.waiting_jobs.flatMap((job) => {
    const dates = group.records
      .filter((record) => jobKeyOf(record.ticket.project_address) === job.job_key)
      .map((record) => ticketDay(record.ticket.ticket_date))
      .filter((date): date is string => date !== null)
      .sort();
    const when = dates.length ? periodLabel(dates[0], dates[dates.length - 1]) : '';
    return job.missing.map(
      (field) => `${job.job_label} is missing the ${when ? `${when} ` : ''}${FIELD_WORDS[field]}.`,
    );
  });
}

type Loaded = {
  groups: InvoiceGroup[];
  readiness: Map<string, InvoiceReadiness>;
  lockedKeys: Set<string>;
  finalizedAt: Map<string, string>;
  customers: CustomerProfile[];
};

/** One bounded read of the tickets in a window, grouped and rated. */
async function loadInvoices(
  client: SupabaseClient,
  workspace: string,
  from: string,
  to: string,
): Promise<Loaded> {
  const records = await listRecordsBetween(client, workspace, from, to, READ_LIMIT);
  const profiles = await listProfiles(client, workspace);
  const periods = await listPeriods(client, workspace);
  const locks = await listLocks(client, workspace);
  const lockedKeys = new Set(
    locks.filter((lock) => lock.unlocked_at === null).map((lock) => lock.invoice_key),
  );
  const finalizedAt = new Map(locks.map((lock) => [lock.invoice_key, lock.finalized_at]));
  const groups = invoiceGroups(records);
  const readiness = new Map(
    groups.map((group) => [
      group.key,
      invoiceReadiness(group, profiles.customers, periods, lockedKeys.has(group.key)),
    ]),
  );
  return { groups, readiness, lockedKeys, finalizedAt, customers: profiles.customers };
}

const customerOfGroup = (group: InvoiceGroup, customers: Loaded['customers']) => {
  for (const record of group.records) {
    const id = customerIdFor(record, customers);
    const profile = customers.find((customer) => customer.id === id);
    if (profile) return profile;
  }
  return null;
};

// ------------------------------------------------------- search invoices

type SearchInput = {
  status: StatusFilter;
  from: string | null;
  to: string | null;
  customer: string | null;
  limit: number;
};

export const searchInvoices: ToolDefinition = readTool<SearchInput>({
  name: 'search_invoices',
  description:
    'Invoices over a window of ticket dates, with what each one is still waiting for. Defaults to the last 60 days.',
  input: strictInput({
    status: {
      type: 'string',
      description: 'Which invoices to return.',
      enum: [...STATUSES],
    },
    from: nullableString('First ticket date, as 2026-09-01.'),
    to: nullableString('Last ticket date, as 2026-09-30.'),
    customer: nullableString('All or part of the customer name.'),
    limit: { type: 'integer', description: 'How many invoices to return, 1 to 50.', minimum: 1, maximum: 50 },
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'invoices.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<SearchInput>((fields) => ({
    status: choice(fields, 'status', STATUSES, 'ANY'),
    from: isoDate(fields, 'from'),
    to: isoDate(fields, 'to'),
    customer: bounded(fields, 'customer', 120),
    limit: positiveInt(fields, 'limit', 1, 50, 20),
  })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const range = dateRange(input.from, input.to, ctx.now, DEFAULT_DAYS);
    const loaded = await loadInvoices(client, ctx.workspaceId, range.from, range.to);
    const wanted = input.customer ? normalizeName(input.customer) : null;

    const matched = loaded.groups.filter((group) => {
      const readiness = loaded.readiness.get(group.key);
      if (!readiness) return false;
      if (input.status !== 'ANY' && readiness.status !== input.status) return false;
      if (wanted) {
        const profile = customerOfGroup(group, loaded.customers);
        const names = [
          profile?.name ?? '',
          ...(profile?.ticket_names ?? []),
          ...group.records.map((record) => record.ticket.customer_name ?? ''),
          group.invoice.bill_to.name,
        ].map(normalizeName);
        if (!names.some((name) => name.includes(wanted))) return false;
      }
      return true;
    });

    const page = capped(matched, input.limit);
    const entities: EntityRef[] = page.items
      .slice(0, MAX_ENTITIES)
      .map((group) => invoiceRef(group.key, group.invoice.invoice_number));
    return {
      kind: 'read',
      data: {
        range: { from: range.from, to: range.to, clamped: range.clamped },
        found: page.total,
        shown: page.items.length,
        truncated: page.truncated,
        invoices: page.items.map((group) =>
          invoiceView(group, loaded.readiness.get(group.key) as InvoiceReadiness),
        ),
      },
      summary: `${page.total} invoices between ${rangeWords(range)}${input.status === 'ANY' ? '' : ` with status ${input.status}`}.`,
      entities,
    };
  },
});

// ---------------------------------------------------------- one invoice

type InvoiceInput = { invoice_number: string };

const invoiceInputSchema = strictInput({
  invoice_number: { type: 'string', description: 'The invoice number as it is printed.', maxLength: 60 },
});

const parseInvoiceInput = parser<InvoiceInput>((fields) => ({
  invoice_number: requiredText(fields, 'invoice_number', 60),
}));

/** The window an invoice lookup is bounded to, and what it found in it. */
async function findInvoice(
  client: SupabaseClient,
  workspace: string,
  now: Date,
  invoiceNumber: string,
) {
  const to = isoDay(now);
  const from = shiftDays(to, -(LOOKUP_DAYS - 1));
  const loaded = await loadInvoices(client, workspace, from, to);
  const key = invoiceKey(invoiceNumber);
  const group = loaded.groups.find((candidate) => candidate.key === key) ?? null;
  return { from, to, loaded, key, group };
}

const notFound = (invoiceNumber: string, from: string, to: string) =>
  ({
    kind: 'read' as const,
    data: { found: false, invoice_number: invoiceNumber, searched: { from, to } },
    summary: `No invoice #${invoiceNumber} on tickets dated ${from} to ${to}; older invoices were not read.`,
    entities: [],
  });

export const getInvoice: ToolDefinition = readTool<InvoiceInput>({
  name: 'get_invoice',
  description:
    'One invoice: its tickets, its totals, what it is waiting for, whether it has been finalized, and any open rate request for its customer.',
  input: invoiceInputSchema,
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'invoices.read',
  risk: 0,
  confirmation: 'never',
  parse: parseInvoiceInput,
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const { from, to, loaded, key, group } = await findInvoice(
      client,
      ctx.workspaceId,
      ctx.now,
      input.invoice_number,
    );
    if (!group) return notFound(input.invoice_number, from, to);
    const readiness = loaded.readiness.get(key) as InvoiceReadiness;
    const locked = loaded.lockedKeys.has(key);
    const customer = customerOfGroup(group, loaded.customers);

    const requests = customer
      ? (await listRequests(client, ctx.workspaceId)).filter(
          (request) =>
            request.customer_profile_id === customer.id && OPEN_REQUEST.has(request.status),
        )
      : [];

    const tickets: SavedRecord[] = group.records.slice(0, MAX_TICKETS_SHOWN);
    const entities: EntityRef[] = [invoiceRef(group.key, group.invoice.invoice_number)];
    if (customer) entities.push(customerRef(customer.id, customer.name));
    for (const request of requests.slice(0, 5)) {
      entities.push(rateRequestRef(request.id, `Rate request ${request.period_from} to ${request.period_to}`));
    }

    return {
      kind: 'read',
      data: {
        found: true,
        invoice: invoiceView(group, readiness),
        locked,
        finalized_at: locked ? loaded.finalizedAt.get(key) ?? null : null,
        blockers: blockerSentences(group, readiness),
        customer: customer ? { id: customer.id, name: customer.name } : null,
        tickets: tickets.map(ticketView),
        tickets_truncated: group.records.length > tickets.length,
        open_rate_requests: requests.map((request) => ({
          id: request.id,
          status: request.status,
          period_from: request.period_from,
          period_to: request.period_to,
          remaining_items: remainingItems(request),
          follow_up_due_at: request.follow_up_due_at,
        })),
        searched: { from, to },
      },
      summary: `Invoice #${group.invoice.invoice_number}: ${group.records.length} tickets, ${readiness.status}${locked ? ' and finalized' : ''}.`,
      entities,
    };
  },
});

export const getInvoiceReadiness: ToolDefinition = readTool<InvoiceInput>({
  name: 'get_invoice_readiness',
  description:
    'Whether one invoice can go out, and if not, exactly what is missing, said in plain sentences.',
  input: invoiceInputSchema,
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'invoices.read',
  risk: 0,
  confirmation: 'never',
  parse: parseInvoiceInput,
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const { from, to, loaded, key, group } = await findInvoice(
      client,
      ctx.workspaceId,
      ctx.now,
      input.invoice_number,
    );
    if (!group) return notFound(input.invoice_number, from, to);
    const readiness = loaded.readiness.get(key) as InvoiceReadiness;
    const blockers = blockerSentences(group, readiness);
    return {
      kind: 'read',
      data: {
        found: true,
        invoice_number: group.invoice.invoice_number,
        invoice_key: group.key,
        status: readiness.status,
        tickets: readiness.tickets,
        base: readiness.base,
        fuel: readiness.fuel,
        waiting_jobs: readiness.waiting_jobs,
        locked: loaded.lockedKeys.has(key),
        blockers,
        searched: { from, to },
      },
      summary: blockers.length
        ? `Invoice #${group.invoice.invoice_number} is ${readiness.status}: ${blockers.join(' ')}`
        : `Invoice #${group.invoice.invoice_number} is ${readiness.status}.`,
      entities: [invoiceRef(group.key, group.invoice.invoice_number)],
    };
  },
});

export const INVOICE_TOOLS: ToolDefinition[] = [searchInvoices, getInvoice, getInvoiceReadiness];
