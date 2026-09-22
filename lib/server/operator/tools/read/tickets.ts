import type { EntityRef, ToolDefinition } from '@/lib/operator/types';
import {
  invoiceGroups,
  invoiceKey,
  needsReview,
  recordMatches,
  sameTicketOnFile,
} from '@/lib/load-desk/records';
import { ticketsNeedingReview, unmatchedCustomerCount, unmatchedTruckCount } from '@/lib/load-desk/overview';
import { invoiceReadiness } from '@/lib/load-desk/rates';
import { validateTicket } from '@/lib/load-desk/validate';
import { unresolvedMessage } from '@/lib/load-desk/recovery/queue';
import { groupExceptions, membersOf } from '@/lib/load-desk/recovery/exceptions';
import { knowledgeOf } from '@/lib/load-desk/recovery/outcome';
import { customerIdFor, normalizeKey, normalizeName } from '@/lib/load-desk/profiles';
import { ticketDay } from '@/lib/load-desk/ticket-date';
import { getRecord, listProfiles, listRecordsBetween } from '@/lib/server/load-desk-store';
import { getLock, listPeriods } from '@/lib/server/rates-store';
import { listDays } from '@/lib/server/mileage-store';
import type { SavedRecord } from '@/lib/load-desk/types';
import { invoiceRef, ticketRef } from './refs';
import {
  bounded,
  capped,
  dateRange,
  dayCount,
  deps,
  flag,
  FREE_OUTPUT,
  identifier,
  isoDate,
  isoDay,
  nullableString,
  parser,
  positiveInt,
  rangeWords,
  readTool,
  shiftDays,
  strictInput,
  ticketView,
} from './shared';

// Tickets: what came in, what is still wrong with it, and what one ticket's
// whole story is. Every read here is bounded by days — `listRecords` reads
// every ticket a company has ever saved, scan text and all, and a run that
// calls it twice has spent the workspace's afternoon.

/** The most tickets one bounded read asks the database for. */
const READ_LIMIT = 500;
/** groupExceptions compares every member with every other. */
const MAX_EXCEPTION_RECORDS = 200;
/** Days either side of a ticket searched for the rest of its invoice. */
const INVOICE_WINDOW_DAYS = 45;
/** The most entities one answer carries, so a result stays small. */
const MAX_ENTITIES = 20;

const refsOf = (records: SavedRecord[]): EntityRef[] =>
  records.slice(0, MAX_ENTITIES).map((record) => ticketRef(record));

// ------------------------------------------------------- processing status

type StatusInput = { days: number };

export const getProcessingStatus: ToolDefinition = readTool<StatusInput>({
  name: 'get_processing_status',
  description:
    'How the last few days of tickets are going: how many were saved, how many still want checking, how many were approved automatically, and how the mileage days for those dates stand.',
  input: strictInput({
    days: dayCount('How many days back to look, 1 to 30.', 30),
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'tickets.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<StatusInput>((fields) => ({ days: positiveInt(fields, 'days', 1, 30, 7) })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const to = isoDay(ctx.now);
    const from = shiftDays(to, -(input.days - 1));
    const records = await listRecordsBetween(client, ctx.workspaceId, from, to, READ_LIMIT);
    const profiles = await listProfiles(client, ctx.workspaceId);
    const days = await listDays(client, ctx.workspaceId, from, to);
    const mileage: Record<string, number> = {};
    for (const day of days) mileage[day.status] = (mileage[day.status] ?? 0) + 1;
    const data = {
      from,
      to,
      tickets: records.length,
      needing_review: ticketsNeedingReview(records).length,
      auto_approved: records.filter((record) => Boolean(record.auto_approved_at)).length,
      reviewed: records.filter((record) => Boolean(record.reviewed_at)).length,
      unmatched_customers: unmatchedCustomerCount(records, profiles.customers),
      unmatched_trucks: unmatchedTruckCount(records, profiles.trucks),
      mileage_days: {
        current: mileage.current ?? 0,
        calculating: mileage.calculating ?? 0,
        needs_review: mileage.needs_review ?? 0,
        failed: mileage.failed ?? 0,
      },
      truncated: records.length >= READ_LIMIT,
    };
    return {
      kind: 'read',
      data,
      summary: `${data.tickets} tickets from ${from} to ${to}; ${data.needing_review} needing review.`,
      entities: [],
    };
  },
});

// ---------------------------------------------------------- search tickets

type SearchInput = {
  query: string | null;
  from: string | null;
  to: string | null;
  truck_number: string | null;
  customer: string | null;
  invoice_number: string | null;
  needs_review_only: boolean;
  limit: number;
};

export const searchTickets: ToolDefinition = readTool<SearchInput>({
  name: 'search_tickets',
  description:
    'Find saved tickets by words, dates, truck number, customer or invoice number. Defaults to the last 30 days when no dates are given.',
  input: strictInput({
    query: nullableString('Words that must all appear on the ticket, its invoice or its bill-to.'),
    from: nullableString('First ticket date, as 2026-09-01.'),
    to: nullableString('Last ticket date, as 2026-09-30.'),
    truck_number: nullableString('The truck number printed on the invoice.'),
    customer: nullableString('All or part of the customer name.'),
    invoice_number: nullableString('An invoice number, matched the way the app keys one.'),
    needs_review_only: { type: 'boolean', description: 'Only tickets nobody has checked yet.' },
    limit: { type: 'integer', description: 'How many tickets to return, 1 to 50.', minimum: 1, maximum: 50 },
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'tickets.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<SearchInput>((fields) => ({
    query: bounded(fields, 'query', 200),
    from: isoDate(fields, 'from'),
    to: isoDate(fields, 'to'),
    truck_number: bounded(fields, 'truck_number', 40),
    customer: bounded(fields, 'customer', 120),
    invoice_number: bounded(fields, 'invoice_number', 60),
    needs_review_only: flag(fields, 'needs_review_only'),
    limit: positiveInt(fields, 'limit', 1, 50, 20),
  })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    // An invoice number can be months old, so a search for one looks as far
    // back as any single read is allowed to; everything else is this month.
    const range = dateRange(input.from, input.to, ctx.now, input.invoice_number ? 120 : 30);
    const records = await listRecordsBetween(client, ctx.workspaceId, range.from, range.to, READ_LIMIT);
    const profiles = await listProfiles(client, ctx.workspaceId);
    const wantedTruck = input.truck_number ? normalizeKey(input.truck_number) : null;
    const wantedCustomer = input.customer ? normalizeName(input.customer) : null;
    const wantedInvoice = input.invoice_number ? invoiceKey(input.invoice_number) : null;

    const matched = records.filter((record) => {
      if (input.query && !recordMatches(record, input.query)) return false;
      if (input.needs_review_only && !needsReview(record)) return false;
      if (wantedTruck && normalizeKey(record.invoice.truck_number) !== wantedTruck) return false;
      if (wantedInvoice && invoiceKey(record.invoice.invoice_number) !== wantedInvoice) return false;
      if (wantedCustomer) {
        const id = customerIdFor(record, profiles.customers);
        const profile = profiles.customers.find((customer) => customer.id === id);
        const names = [
          record.ticket.customer_name ?? '',
          profile?.name ?? '',
          ...(profile?.ticket_names ?? []),
        ].map(normalizeName);
        if (!names.some((name) => name.includes(wantedCustomer))) return false;
      }
      return true;
    });

    const page = capped(matched, input.limit);
    return {
      kind: 'read',
      data: {
        range: { from: range.from, to: range.to, clamped: range.clamped },
        found: page.total,
        shown: page.items.length,
        truncated: page.truncated || records.length >= READ_LIMIT,
        tickets: page.items.map(ticketView),
      },
      summary: `${page.total} tickets between ${rangeWords(range)}${page.truncated ? `; showing ${page.items.length}` : ''}.`,
      entities: refsOf(page.items),
    };
  },
});

// ------------------------------------------------------------- one ticket

type TicketInput = { ticket_id: number };

export const getTicket: ToolDefinition = readTool<TicketInput>({
  name: 'get_ticket',
  description:
    'One saved ticket in full: its figures, what is still wrong with it, whether it looks like a second photograph of one already on file, and what the invoice it sits on is waiting for.',
  input: strictInput({
    ticket_id: { type: 'integer', description: 'The saved ticket id.', minimum: 1 },
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'tickets.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<TicketInput>((fields) => ({ ticket_id: identifier(fields, 'ticket_id') })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const record = await getRecord(client, ctx.workspaceId, input.ticket_id);
    if (!record) {
      return {
        kind: 'read',
        data: { found: false, ticket_id: input.ticket_id },
        summary: `No saved ticket ${input.ticket_id} in this workspace.`,
        entities: [],
      };
    }
    const key = invoiceKey(record.invoice.invoice_number);
    const centre = ticketDay(record.ticket.ticket_date) ?? isoDay(ctx.now);
    const from = shiftDays(centre, -INVOICE_WINDOW_DAYS);
    const to = shiftDays(centre, INVOICE_WINDOW_DAYS);
    const nearby = await listRecordsBetween(client, ctx.workspaceId, from, to, READ_LIMIT);
    const profiles = await listProfiles(client, ctx.workspaceId);
    const periods = await listPeriods(client, ctx.workspaceId);
    const lock = await getLock(client, ctx.workspaceId, record.invoice.invoice_number);
    const locked = lock !== null && lock.unlocked_at === null;

    const onInvoice = nearby.filter((other) => invoiceKey(other.invoice.invoice_number) === key);
    const group = invoiceGroups(onInvoice.length ? onInvoice : [record])[0];
    const readiness = invoiceReadiness(group, profiles.customers, periods, locked);
    const duplicate = sameTicketOnFile(
      nearby.filter((other) => other.id !== record.id),
      record.ticket,
    );

    const data = {
      found: true,
      ticket: ticketView(record),
      issues: validateTicket(record.ticket, record.recovery),
      unresolved: record.recovery ? unresolvedMessage(record.recovery) : null,
      duplicate_of: duplicate
        ? { id: duplicate.id, ticket_number: duplicate.ticket.ticket_number, invoice_number: duplicate.invoice.invoice_number }
        : null,
      invoice: {
        invoice_number: group.invoice.invoice_number,
        invoice_key: group.key,
        tickets: group.records.length,
        total: group.total,
        status: readiness.status,
        base: readiness.base,
        fuel: readiness.fuel,
        waiting_jobs: readiness.waiting_jobs,
        searched: { from, to },
      },
      locked,
      finalized_at: locked ? lock?.finalized_at ?? null : null,
    };
    const entities: EntityRef[] = [ticketRef(record), invoiceRef(group.key, group.invoice.invoice_number)];
    if (duplicate) entities.push(ticketRef(duplicate));
    return {
      kind: 'read',
      data,
      summary:
        `Ticket ${record.ticket.ticket_number ?? record.id} on invoice #${group.invoice.invoice_number}: ` +
        `${readiness.status}${locked ? ', finalized' : ''}${data.issues.length ? `, ${data.issues.length} issues` : ''}.`,
      entities,
    };
  },
});

// -------------------------------------------------------------- exceptions

type ExceptionsInput = { days: number };

export const getTicketExceptions: ToolDefinition = readTool<ExceptionsInput>({
  name: 'get_ticket_exceptions',
  description:
    'The questions the ticket backlog is asking, grouped so that one answer settles every ticket that raised it.',
  input: strictInput({
    days: dayCount('How many days back to gather unsettled tickets from, 1 to 60.', 60),
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'tickets.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<ExceptionsInput>((fields) => ({ days: positiveInt(fields, 'days', 1, 60, 30) })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const to = isoDay(ctx.now);
    const from = shiftDays(to, -(input.days - 1));
    const records = await listRecordsBetween(client, ctx.workspaceId, from, to, READ_LIMIT);
    const profiles = await listProfiles(client, ctx.workspaceId);
    const waiting = records.filter(needsReview);
    const considered = waiting.slice(0, MAX_EXCEPTION_RECORDS);
    const knowledge = knowledgeOf(records, profiles);
    const members = membersOf(considered, knowledge, (record) =>
      validateTicket(record.ticket, record.recovery),
    );
    const groups = groupExceptions(members);

    const shaped = groups.map((group) => {
      // A field with exactly one candidate on file is an answer waiting to be
      // taken; more than one is a question, and none is a blank to fill in.
      const suggested: Record<string, string> = {};
      for (const ask of group.asks) {
        const candidates = group.candidates[ask];
        if (candidates && candidates.length === 1) suggested[ask] = candidates[0];
      }
      return {
        key: group.key,
        type: group.type,
        needs_date: group.needsDate,
        customer: group.customer,
        customer_profile_id: group.customerProfileId,
        asks: group.asks,
        detected: group.detected,
        suggested,
        confidence: group.confidence,
        reasons: group.reasons,
        count: group.ticketIds.length,
        ticket_ids: group.ticketIds.slice(0, MAX_ENTITIES),
      };
    });
    const individual = members.filter((member) => member.report.outcome === 'individual_review').length;

    return {
      kind: 'read',
      data: {
        from,
        to,
        waiting_tickets: waiting.length,
        considered: considered.length,
        truncated: waiting.length > considered.length,
        individual_review_tickets: individual,
        groups: shaped,
      },
      summary: `${shaped.length} open questions over ${considered.length} unsettled tickets since ${from}.`,
      entities: refsOf(considered),
    };
  },
});

export const TICKET_TOOLS: ToolDefinition[] = [
  getProcessingStatus,
  searchTickets,
  getTicket,
  getTicketExceptions,
];
