import type { EntityRef, ToolDefinition } from '@/lib/operator/types';
import {
  jobKeyOf,
  missingRates,
  RATE_REQUEST_STATUSES,
  remainingItems,
  resolveRate,
} from '@/lib/load-desk/rates';
import { listProfiles, listRecordsBetween } from '@/lib/server/load-desk-store';
import { listPeriods, listRequests } from '@/lib/server/rates-store';
import { customerRef, projectRef, rateRequestRef } from './refs';
import {
  bounded,
  capped,
  dateRange,
  deps,
  FREE_OUTPUT,
  identifier,
  isoDate,
  isoDay,
  nullableString,
  optionalIdentifier,
  parser,
  positiveInt,
  rangeWords,
  readTool,
  refuse,
  strictInput,
} from './shared';

// Rates: which jobs are short a figure, what has been asked of whom, and what
// was agreed when. Nothing here decides a price — `resolveRate` answers which
// period covered a day, and `missingRates` answers what is not covered at all,
// exactly as the Rates page asks them.

const READ_LIMIT = 1000;
const DEFAULT_DAYS = 60;
const MAX_ENTITIES = 20;

// --------------------------------------------------------- rate status

type StatusInput = { customer_id: number | null; from: string | null; to: string | null };

export const getRateStatus: ToolDefinition = readTool<StatusInput>({
  name: 'get_rate_status',
  description:
    'Which jobs worked in a window are short a hauling rate or a fuel surcharge, and which of those the customer profile already answers through its site rates.',
  input: strictInput({
    customer_id: { type: ['integer', 'null'], description: 'One customer, or null for all of them.' },
    from: nullableString('First ticket date, as 2026-09-01.'),
    to: nullableString('Last ticket date, as 2026-09-30.'),
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'rates.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<StatusInput>((fields) => ({
    customer_id: optionalIdentifier(fields, 'customer_id'),
    from: isoDate(fields, 'from'),
    to: isoDate(fields, 'to'),
  })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const range = dateRange(input.from, input.to, ctx.now, DEFAULT_DAYS);
    const records = await listRecordsBetween(client, ctx.workspaceId, range.from, range.to, READ_LIMIT);
    const { customers } = await listProfiles(client, ctx.workspaceId);
    const periods = await listPeriods(client, ctx.workspaceId);
    const needs = missingRates(records, customers, periods, range.from, range.to).filter(
      (job) => input.customer_id === null || job.customer_profile_id === input.customer_id,
    );
    const shaped = needs.map((job) => {
      const customer = customers.find(({ id }) => id === job.customer_profile_id);
      return {
        customer_profile_id: job.customer_profile_id,
        customer_name: customer?.name ?? null,
        job_key: job.job_key,
        job_label: job.job_label,
        loads: job.ticket_count,
        first_date: job.first_date,
        last_date: job.last_date,
        missing: job.missing,
        known_from_site: job.known_from_site,
        base_rate: job.base ? { value: job.base.value, rate_type: job.base.rate_type } : null,
        fuel_rate: job.fuel ? { value: job.fuel.value, fuel_type: job.fuel.fuel_type } : null,
      };
    });
    const short = shaped.filter((job) => job.missing.length > 0);
    const entities: EntityRef[] = short
      .slice(0, MAX_ENTITIES)
      .map((job) => projectRef(job.job_key, job.job_label));
    return {
      kind: 'read',
      data: {
        range: { from: range.from, to: range.to, clamped: range.clamped },
        jobs: shaped,
        jobs_short: short.length,
      },
      summary: `${short.length} of ${shaped.length} jobs are short a rate between ${rangeWords(range)}.`,
      entities,
    };
  },
});

// ------------------------------------------------------- rate requests

type RequestsInput = { status: string | null; customer_id: number | null; limit: number };

export const getRateRequests: ToolDefinition = readTool<RequestsInput>({
  name: 'get_rate_requests',
  description:
    'Rate requests: what was asked, what is still outstanding on each, when a chase falls due and which are overdue.',
  input: strictInput({
    status: nullableString(`One of: ${RATE_REQUEST_STATUSES.join(', ')}; null for all.`),
    customer_id: { type: ['integer', 'null'], description: 'One customer, or null for all of them.' },
    limit: { type: 'integer', description: 'How many requests to return, 1 to 50.', minimum: 1, maximum: 50 },
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'rates.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<RequestsInput>((fields) => {
    const status = bounded(fields, 'status', 40);
    if (status !== null && !(RATE_REQUEST_STATUSES as readonly string[]).includes(status)) {
      refuse(`status must be one of: ${RATE_REQUEST_STATUSES.join(', ')}.`);
    }
    return {
      status,
      customer_id: optionalIdentifier(fields, 'customer_id'),
      limit: positiveInt(fields, 'limit', 1, 50, 20),
    };
  }),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const all = await listRequests(client, ctx.workspaceId);
    const { customers } = await listProfiles(client, ctx.workspaceId);
    const now = ctx.now.getTime();
    const matched = all.filter(
      (request) =>
        (input.status === null || request.status === input.status) &&
        (input.customer_id === null || request.customer_profile_id === input.customer_id),
    );
    const page = capped(matched, input.limit);
    const shaped = page.items.map((request) => {
      const customer = customers.find(({ id }) => id === request.customer_profile_id);
      const overdue =
        request.follow_up_due_at !== null && Date.parse(request.follow_up_due_at) <= now;
      return {
        id: request.id,
        customer_profile_id: request.customer_profile_id,
        customer_name: customer?.name ?? null,
        period_from: request.period_from,
        period_to: request.period_to,
        status: request.status,
        mode: request.mode,
        items: request.items,
        remaining_items: remainingItems(request),
        sent_at: request.sent_at,
        reply_at: request.reply_at,
        follow_up_due_at: request.follow_up_due_at,
        follow_up_count: request.follow_up_count,
        overdue,
      };
    });
    return {
      kind: 'read',
      data: {
        found: page.total,
        shown: shaped.length,
        truncated: page.truncated,
        overdue: shaped.filter((request) => request.overdue).length,
        requests: shaped,
      },
      summary: `${page.total} rate requests${input.status ? ` with status ${input.status}` : ''}; ${shaped.filter((r) => r.overdue).length} overdue for a chase.`,
      entities: shaped
        .slice(0, MAX_ENTITIES)
        .map((request) =>
          rateRequestRef(
            request.id,
            `${request.customer_name ?? 'Customer'} ${request.period_from} to ${request.period_to}`,
          ),
        ),
    };
  },
});

// -------------------------------------------------------- rate history

type HistoryInput = { customer_id: number; job_key: string | null };

export const getRateHistory: ToolDefinition = readTool<HistoryInput>({
  name: 'get_rate_history',
  description:
    'Every rate period on file for a customer, superseded ones marked, and what resolves for each job today.',
  input: strictInput({
    customer_id: { type: 'integer', description: 'The customer profile id.', minimum: 1 },
    job_key: nullableString('One job key, or null for every job of this customer.'),
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'rates.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<HistoryInput>((fields) => ({
    customer_id: identifier(fields, 'customer_id'),
    job_key: bounded(fields, 'job_key', 200),
  })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const periods = await listPeriods(client, ctx.workspaceId, { customerId: input.customer_id });
    const { customers } = await listProfiles(client, ctx.workspaceId);
    const customer = customers.find(({ id }) => id === input.customer_id);
    const wanted = input.job_key ? jobKeyOf(input.job_key) : null;
    const rows = periods.filter((period) => wanted === null || period.job_key === wanted);
    const today = isoDay(ctx.now);
    const jobKeys = wanted ? [wanted] : [...new Set(rows.map((period) => period.job_key))];
    const resolvedToday = jobKeys.map((key) => {
      const base = resolveRate(periods, input.customer_id, key, 'base', today);
      const fuel = resolveRate(periods, input.customer_id, key, 'fuel', today);
      return {
        job_key: key,
        job_label: rows.find((period) => period.job_key === key)?.job_label ?? key,
        base: base ? { id: base.id, value: base.value, rate_type: base.rate_type } : null,
        fuel: fuel ? { id: fuel.id, value: fuel.value, fuel_type: fuel.fuel_type } : null,
      };
    });
    return {
      kind: 'read',
      data: {
        customer: customer ? { id: customer.id, name: customer.name } : null,
        today,
        periods: rows.map((period) => ({
          id: period.id,
          job_key: period.job_key,
          job_label: period.job_label,
          kind: period.kind,
          effective_from: period.effective_from,
          effective_to: period.effective_to,
          validity: period.validity,
          rate_type: period.rate_type,
          fuel_type: period.fuel_type,
          value: period.value,
          source: period.source,
          applied_by: period.applied_by,
          confirmed_at: period.confirmed_at,
          superseded: period.superseded_by !== null,
          note: period.note,
        })),
        resolved_today: resolvedToday,
      },
      summary: `${rows.length} rate periods on file for ${customer?.name ?? `customer ${input.customer_id}`}.`,
      entities: customer ? [customerRef(customer.id, customer.name)] : [],
    };
  },
});

export const RATE_TOOLS: ToolDefinition[] = [getRateStatus, getRateRequests, getRateHistory];
