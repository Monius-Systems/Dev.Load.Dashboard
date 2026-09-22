import type { SupabaseClient } from '@supabase/supabase-js';
import { invoiceGroups, needsReview } from '@/lib/load-desk/records';
import { ticketsNeedingReview } from '@/lib/load-desk/overview';
import { invoiceReadiness } from '@/lib/load-desk/rates';
import { validateTicket } from '@/lib/load-desk/validate';
import { groupExceptions, membersOf } from '@/lib/load-desk/recovery/exceptions';
import { knowledgeOf } from '@/lib/load-desk/recovery/outcome';
import { CLAIM_TIMEOUT_MS, dayHeadline, truckDays } from '@/lib/load-desk/mileage';
import { listProfiles, listRecordsBetween } from '@/lib/server/load-desk-store';
import { listLocks, listPeriods, listRequests } from '@/lib/server/rates-store';
import { listDays } from '@/lib/server/mileage-store';
import { isoDay, shiftDays } from '@/lib/server/operator/tools/read/shared';

// The state of the business, in seven lines, handed to the model at the start
// of every run.
//
// A model that must call four tools before it knows whether anything is wrong
// spends a run finding out what a person could see from the dashboard in a
// glance. This is that glance: today's date, what came in this week, what the
// invoices are waiting on, what the rate agent is chasing, how the mileage is
// going, what the backlog is asking and how many trucks are running.
//
// Every figure comes from the same code the pages use — nothing here is
// counted twice or a second way — and every section stands on its own: a
// store that will not answer costs that line and nothing else. The whole
// thing is read once a minute per workspace, because a run that asks three
// questions should not read sixty days of tickets three times.

/** The window of tickets the invoice figures are drawn from. */
const INVOICE_DAYS = 60;
/** The window the week's figures are drawn from. */
const WEEK_DAYS = 7;
/** groupExceptions compares every member with every other; this bounds it. */
const MAX_EXCEPTION_RECORDS = 200;
/** The most tickets one snapshot reads. */
const MAX_RECORDS = 1000;
/** How long a snapshot stands before it is worked out again. */
const CACHE_MS = 60_000;

export type OverviewFigures = {
  today: string;
  /** Tickets saved with a date in the last seven days. */
  tickets: { total: number; needing_review: number } | null;
  invoices: {
    ready: number;
    waiting_for_rate: number;
    waiting_for_fuel: number;
    needs_review: number;
    finalized: number;
  } | null;
  rates: { open_requests: number; awaiting_reply: number; overdue_follow_ups: number } | null;
  mileage: { ready: number; needs_help: number; failed: number } | null;
  exceptions: { groups: number; tickets: number } | null;
  trucks: { active: number } | null;
};

/** A request that has been asked and not yet settled. */
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

const AWAITING_REPLY = new Set(['SENT', 'WAITING_FOR_REPLY', 'FOLLOW_UP_DUE']);

/**
 * A read that may fail without failing the snapshot. The caller is given the
 * fallback and a flag it can turn into "Unavailable" for that line alone.
 */
async function attempt<T>(read: () => Promise<T>, fallback: T): Promise<{ value: T; ok: boolean }> {
  try {
    return { value: await read(), ok: true };
  } catch {
    return { value: fallback, ok: false };
  }
}

/** A day whose calculation was claimed and never came back. */
const isStuck = (startedAt: string | null, now: Date) =>
  startedAt !== null && now.getTime() - Date.parse(startedAt) > CLAIM_TIMEOUT_MS;

/**
 * Everything the snapshot says, as figures rather than sentences — so the
 * business-overview tool and the snapshot itself are one computation and can
 * never disagree about how many invoices are waiting.
 */
export async function overviewFigures(
  client: SupabaseClient,
  workspace: string,
  now = new Date(),
): Promise<OverviewFigures> {
  const today = isoDay(now);
  const figures: OverviewFigures = {
    today,
    tickets: null,
    invoices: null,
    rates: null,
    mileage: null,
    exceptions: null,
    trucks: null,
  };

  const records = await attempt(
    () => listRecordsBetween(client, workspace, shiftDays(today, -(INVOICE_DAYS - 1)), today, MAX_RECORDS),
    [],
  );
  const profiles = await attempt(() => listProfiles(client, workspace), {
    customers: [],
    trucks: [],
    clients: [],
    company: null,
  });
  const periods = await attempt(() => listPeriods(client, workspace), []);
  const requests = await attempt(() => listRequests(client, workspace), []);
  const locks = await attempt(() => listLocks(client, workspace), []);
  const weekFrom = shiftDays(today, -(WEEK_DAYS - 1));
  const days = await attempt(() => listDays(client, workspace, weekFrom, today), []);

  if (records.ok) {
    const week = records.value.filter((record) => {
      const date = record.ticket.ticket_date;
      return typeof date === 'string' && date >= weekFrom && date <= today;
    });
    figures.tickets = {
      total: week.length,
      needing_review: ticketsNeedingReview(week).length,
    };
  }

  if (records.ok && profiles.ok && periods.ok && locks.ok) {
    const lockedKeys = new Set(
      locks.value.filter((lock) => lock.unlocked_at === null).map((lock) => lock.invoice_key),
    );
    const counts = { ready: 0, waiting_for_rate: 0, waiting_for_fuel: 0, needs_review: 0, finalized: 0 };
    for (const group of invoiceGroups(records.value)) {
      const readiness = invoiceReadiness(
        group,
        profiles.value.customers,
        periods.value,
        lockedKeys.has(group.key),
      );
      if (readiness.status === 'READY') counts.ready += 1;
      else if (readiness.status === 'WAITING_FOR_RATE') counts.waiting_for_rate += 1;
      else if (readiness.status === 'WAITING_FOR_FUEL') counts.waiting_for_fuel += 1;
      else if (readiness.status === 'NEEDS_REVIEW') counts.needs_review += 1;
      else counts.finalized += 1;
    }
    figures.invoices = counts;
  }

  if (requests.ok) {
    const open = requests.value.filter((request) => OPEN_REQUEST.has(request.status));
    figures.rates = {
      open_requests: open.length,
      awaiting_reply: open.filter((request) => AWAITING_REPLY.has(request.status)).length,
      overdue_follow_ups: open.filter(
        (request) =>
          request.follow_up_due_at !== null && Date.parse(request.follow_up_due_at) <= now.getTime(),
      ).length,
    };
  }

  if (records.ok && profiles.ok && days.ok) {
    const stored = new Map(days.value.map((day) => [`${day.truck_id}|${day.service_date}`, day]));
    const byTruck = new Map(profiles.value.trucks.map((truck) => [truck.id, truck]));
    const expected = truckDays(records.value, profiles.value.trucks, { from: weekFrom, to: today });
    const counts = { ready: 0, needs_help: 0, failed: 0 };
    for (const day of expected.days) {
      const truck = byTruck.get(day.truck_id);
      if (!truck) continue;
      const row = stored.get(day.key);
      const stuck = row?.status === 'calculating' && isStuck(row.calc_started_at, now);
      const headline = dayHeadline(row, day, truck, { stuck });
      if (headline === 'needs_help') counts.needs_help += 1;
      else if (headline === 'could_not_update') counts.failed += 1;
      else if (headline === 'ready') counts.ready += 1;
    }
    figures.mileage = counts;
  }

  if (records.ok && profiles.ok) {
    const waiting = records.value.filter(needsReview).slice(0, MAX_EXCEPTION_RECORDS);
    const knowledge = knowledgeOf(records.value, profiles.value);
    const members = membersOf(waiting, knowledge, (record) =>
      validateTicket(record.ticket, record.recovery),
    );
    figures.exceptions = {
      groups: groupExceptions(members).length,
      tickets: waiting.length,
    };
  }

  if (profiles.ok) {
    figures.trucks = { active: profiles.value.trucks.filter((truck) => truck.active).length };
  }

  return figures;
}

const UNAVAILABLE = 'Unavailable';

/** The snapshot's seven lines, from the figures. */
function snapshotText(figures: OverviewFigures): string {
  const { tickets, invoices, rates, mileage, exceptions, trucks } = figures;
  return [
    `Today: ${figures.today}.`,
    tickets
      ? `Tickets (7d): ${tickets.total} saved, ${tickets.needing_review} needing review.`
      : `Tickets (7d): ${UNAVAILABLE}.`,
    invoices
      ? `Invoices (60d): ${invoices.ready} ready, ${invoices.waiting_for_rate} waiting on rates, ${invoices.waiting_for_fuel} waiting on fuel, ${invoices.needs_review} needing review, ${invoices.finalized} finalized.`
      : `Invoices (60d): ${UNAVAILABLE}.`,
    rates
      ? `Rates: ${rates.open_requests} open requests, ${rates.awaiting_reply} awaiting reply, ${rates.overdue_follow_ups} overdue follow-ups.`
      : `Rates: ${UNAVAILABLE}.`,
    mileage
      ? `Mileage (7d): ${mileage.ready} ready, ${mileage.needs_help} needing help, ${mileage.failed} failed.`
      : `Mileage (7d): ${UNAVAILABLE}.`,
    exceptions
      ? `Exceptions: ${exceptions.groups} open questions over ${exceptions.tickets} tickets.`
      : `Exceptions: ${UNAVAILABLE}.`,
    trucks ? `Trucks: ${trucks.active} active.` : `Trucks: ${UNAVAILABLE}.`,
  ].join('\n');
}

type Cached = { at: number; figures: OverviewFigures; text: string };

/**
 * One snapshot per workspace, for a minute. Two runs a few seconds apart are
 * about the same business; reading sixty days of tickets again for the second
 * of them buys nothing and costs the run its time budget.
 */
const cache = new Map<string, Cached>();

async function cached(
  client: SupabaseClient,
  workspace: string,
  now: Date,
): Promise<Cached> {
  const held = cache.get(workspace);
  if (held && now.getTime() - held.at < CACHE_MS) return held;
  const figures = await overviewFigures(client, workspace, now);
  const entry: Cached = { at: now.getTime(), figures, text: snapshotText(figures) };
  cache.set(workspace, entry);
  return entry;
}

/** The figures, cached the same way the snapshot is. */
export async function cachedOverview(
  client: SupabaseClient,
  workspace: string,
  now = new Date(),
): Promise<OverviewFigures> {
  return (await cached(client, workspace, now)).figures;
}

/**
 * The business in seven plain lines, or null when nothing could be read at
 * all. A section that failed says so on its own line; the run goes on.
 */
export async function businessSnapshot(
  client: SupabaseClient,
  workspace: string,
  now = new Date(),
): Promise<string | null> {
  try {
    return (await cached(client, workspace, now)).text;
  } catch (error) {
    console.error(
      'Operator: business snapshot unavailable',
      error instanceof Error ? error.message : 'unknown',
    );
    return null;
  }
}
