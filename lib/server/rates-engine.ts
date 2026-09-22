import type { SupabaseClient } from '@supabase/supabase-js';
import { lineTotal, money } from '@/lib/load-desk/format';
import { customerIdFor, type CustomerProfile } from '@/lib/load-desk/profiles';
import {
  DEFAULT_RATE_PROFILE,
  invoiceReadiness,
  jobKeyOf,
  jobsWorked,
  matchLines,
  messageHash,
  periodsFromMatches,
  remainingItems,
  resolveRate,
  toTicketPricing,
  type CustomerRateProfile,
  type InvoiceLock,
  type JobRef,
  type NewRatePeriod,
  type NormalizedMessage,
  type ParsedRateLine,
  type RateMatch,
  type RatePeriod,
  type RateEvent,
  type RateRequest,
  type RateResponse,
  type RateSource,
} from '@/lib/load-desk/rates';
import { invoiceGroups } from '@/lib/load-desk/records';
import { invoiceKeyOf, MAX_EDITS, type RecordEdit } from '@/lib/load-desk/record-input';
import { ticketDay } from '@/lib/load-desk/ticket-date';
import { fuelTypeOf, rateTypeOf, type SavedRecord, type Ticket } from '@/lib/load-desk/types';
import type { WorkspaceUser } from '@/lib/server/auth';
import { listProfiles, listRecords, updateRecords } from '@/lib/server/load-desk-store';
import { openaiKey } from '@/lib/server/openai-key';
import { rulesOnlyLines, understandReply } from '@/lib/server/rate-ai';
import {
  appendEvent,
  insertPeriods,
  insertResponse,
  listLocks,
  listPeriods,
  supersedePeriod,
  updateRequest,
  updateResponse,
} from '@/lib/server/rates-store';

// The server half of the Rate & Fuel Agent: what happens when a reply arrives,
// and what an agreed rate does to the tickets it covers.
//
// The order is the philosophy. A model may read a reply, but only
// `matchLines` decides what it meant; only matches it marks 'auto' are written
// without a person; everything else waits on the confirmation screen. Applying
// a rate to tickets is then plain bookkeeping — resolve the period that
// covered the day, write the figures the ticket can hold, stamp where they
// came from — with two things it will not do: it will not touch an invoice
// that has been finalized, and it will not overwrite a figure a person typed.
//
// All of it runs inside POST handlers. Nothing here is called while a page is
// rendered or from a GET: a worker has a CPU budget per request, and a screen
// that quietly re-prices five thousand tickets on every load is a screen that
// eventually stops loading.

/** The most tickets one call will look at. */
export const MAX_RECORDS_CONSIDERED = 5_000;

/** Saved in batches: one transaction per hundred, at most MAX_EDITS in a call. */
const EDIT_BATCH = 100;

/** Eight weeks, the window the desk works in when nobody says otherwise. */
export const RATE_WINDOW_DAYS = 56;

const DAY_MS = 86_400_000;
const pad2 = (value: number) => String(value).padStart(2, '0');
const localIso = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
const addDays = (date: string, days: number) => {
  const moved = new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS);
  return `${moved.getUTCFullYear()}-${pad2(moved.getUTCMonth() + 1)}-${pad2(moved.getUTCDate())}`;
};

/** The last eight weeks through today, which is what the Rates page opens on. */
export function defaultWindow(now: Date): { from: string; to: string } {
  const to = localIso(now);
  return { from: addDays(to, -(RATE_WINDOW_DAYS - 1)), to };
}

const actorOf = (member: WorkspaceUser) => member.email ?? member.id;

/**
 * A line of the trail whose kind this build's `RateEvent` union does not list.
 * The store reads such a kind back exactly as it was written, on purpose — the
 * trail is history, and a kind added later must not need a migration — and
 * this is the one place that writes one, so a typo cannot invent a kind
 * quietly.
 */
export const otherEventKind = (kind: string) => kind as RateEvent['kind'];

/** The rate settings a customer is treated by; the defaults until one is set. */
export const rateProfileOf = (customer: CustomerProfile | undefined): CustomerRateProfile =>
  customer?.rate_profile ?? DEFAULT_RATE_PROFILE;

/** The jobs one customer's loads went to over a window, for matching a reply. */
export function jobsForCustomer(
  records: SavedRecord[],
  customers: CustomerProfile[],
  customerId: number,
  from: string,
  to: string,
): JobRef[] {
  return jobsWorked(records, customers, from, to)
    .filter((job) => job.customer_profile_id === customerId)
    .map((job) => ({ job_key: job.job_key, job_label: job.job_label }));
}

// ------------------------------------------------------------- superseding

/**
 * Marks the periods a new one wholly replaces.
 *
 * Wholly is the word that matters. A new period supersedes an older one only
 * when it covers every day the older one did; a rate agreed for this week
 * leaves last week's alone, even though both are for the same job, because
 * last week's invoice was priced from it and must stay explicable. Nothing is
 * ever deleted — the old row keeps its figures and gains a pointer to the row
 * that replaced it.
 */
export async function supersedeCovered(
  client: SupabaseClient,
  workspace: string,
  existing: RatePeriod[],
  fresh: RatePeriod[],
): Promise<number> {
  let replaced = 0;
  for (const period of fresh) {
    for (const old of existing) {
      if (
        old.id === period.id ||
        old.superseded_by !== null ||
        old.customer_profile_id !== period.customer_profile_id ||
        old.job_key !== period.job_key ||
        old.kind !== period.kind
      ) {
        continue;
      }
      const startsEarlier = period.effective_from <= old.effective_from;
      const endsLater =
        period.effective_to === null ||
        (old.effective_to !== null && old.effective_to <= period.effective_to);
      if (!startsEarlier || !endsLater) continue;
      await supersedePeriod(client, workspace, old.id, period.id);
      old.superseded_by = period.id;
      replaced += 1;
    }
  }
  return replaced;
}

// --------------------------------------------------------- pricing tickets

/** A ticket an agreed rate would have changed on an invoice that has gone out. */
export type PricingConflict = {
  record_id: number;
  invoice_key: string;
  detail: string;
};

export type TicketEditPlan = {
  edits: RecordEdit[];
  conflicts: PricingConflict[];
  /** Tickets left exactly as they were because a person had priced them. */
  kept_manual: number;
};

/** Whether the ticket already carries the figures the mapping would write. */
const carriesPricing = (
  ticket: Ticket,
  pricing: { rate: number; rate_type: string; fuel_charge: number | null; fuel_type: string },
) =>
  ticket.rate === pricing.rate &&
  rateTypeOf(ticket) === pricing.rate_type &&
  ticket.fuel_charge === pricing.fuel_charge &&
  fuelTypeOf(ticket) === pricing.fuel_type;

/**
 * What applying the rates on file would do to the saved tickets: the changes
 * to make, the finalized invoices that stand in the way, and how many tickets
 * were left alone because somebody had already priced them by hand.
 *
 * Pure, and exported for the tests, because this is where the agent touches
 * money. Three rules run here and nowhere else:
 *
 * A ticket a person priced is not repriced. A rate typed in review is a
 * decision, and an agent that quietly replaced it would be the reason nobody
 * trusted the feature again; such a ticket is counted into `kept_manual` so
 * the Rates page can offer to apply the agreed rate explicitly. A ticket the
 * agent priced before (it carries a `pricing` stamp) is its own to update, and
 * one that carries no rate at all is nobody's.
 *
 * A finalized invoice is never changed. What it says is what the customer was
 * billed; the disagreement is reported as a conflict, with the figures, for a
 * person to decide about.
 *
 * Half an answer is still an answer. A customer who settles the fuel surcharge
 * and nothing else has settled the fuel surcharge: the ticket keeps the rate
 * it is already billed at — a site rate, or a figure typed in review — and the
 * stamp records only the side a period stands behind, with the other as null.
 *
 * And nothing is written twice: a ticket whose stamp already names these
 * periods, and whose fields already say what they would be set to, produces no
 * edit, so running this after every reply costs one read and no writes. Both
 * halves of that matter — the stamp alone would call a ticket done after
 * somebody had cleared the figure off it.
 */
export function ticketEdits(
  records: SavedRecord[],
  customers: CustomerProfile[],
  periods: RatePeriod[],
  locks: InvoiceLock[],
  now: string,
  scope: { customerId?: number; jobKey?: string } = {},
): TicketEditPlan {
  const locked = new Set(
    locks.filter((lock) => lock.unlocked_at === null).map((lock) => lock.invoice_key),
  );
  const edits: RecordEdit[] = [];
  const conflicts: PricingConflict[] = [];
  let keptManual = 0;
  for (const record of records.slice(0, MAX_RECORDS_CONSIDERED)) {
    if (edits.length >= MAX_EDITS) break;
    const customerId = customerIdFor(record, customers);
    if (customerId === null) continue;
    if (scope.customerId !== undefined && customerId !== scope.customerId) continue;
    const jobKey = jobKeyOf(record.ticket.project_address);
    if (!jobKey) continue;
    if (scope.jobKey !== undefined && jobKey !== scope.jobKey) continue;
    const date = ticketDay(record.ticket.ticket_date);
    if (!date) continue;
    const base = resolveRate(periods, customerId, jobKey, 'base', date);
    const fuel = resolveRate(periods, customerId, jobKey, 'fuel', date);
    if (!base && !fuel) continue;
    // A figure somebody typed, with nothing behind it: left alone, and said so.
    const priced = record.pricing !== undefined;
    if (!priced && record.ticket.rate !== null && record.ticket.fuel_charge !== null) {
      keptManual += 1;
      continue;
    }
    const mapped = toTicketPricing(base, fuel, record.ticket);
    const unsupported = 'unsupported' in mapped ? mapped.unsupported : null;
    const pricing = 'unsupported' in mapped ? null : mapped.pricing;
    const stamp = {
      base_period_id: base?.id ?? null,
      fuel_period_id: fuel?.id ?? null,
      applied_at: now,
      unsupported,
    };
    const already =
      record.pricing !== undefined &&
      record.pricing.base_period_id === stamp.base_period_id &&
      record.pricing.fuel_period_id === stamp.fuel_period_id &&
      (pricing === null
        ? record.pricing.unsupported === unsupported
        : carriesPricing(record.ticket, pricing));
    if (already) continue;
    // A rate the customer agreed to that a ticket cannot hold — per mile, per
    // day, custom — leaves the ticket as it is and says why on the stamp.
    const ticket = pricing === null ? record.ticket : { ...record.ticket, ...pricing };
    const invoiceKey = invoiceKeyOf(record.invoice.invoice_number);
    if (locked.has(invoiceKey)) {
      if (pricing !== null && !carriesPricing(record.ticket, pricing)) {
        conflicts.push({
          record_id: record.id,
          invoice_key: invoiceKey,
          detail: `Invoice ${record.invoice.invoice_number} is finalized; ticket ${
            record.ticket.ticket_number ?? record.id
          } would change from ${money(lineTotal(record.ticket)) || 'no total'} to ${
            money(lineTotal(ticket)) || 'no total'
          }.`,
        });
      }
      continue;
    }
    edits.push({
      id: record.id,
      ticket,
      invoice: record.invoice,
      ocr_text: record.ocr_text,
      customer_profile_id: record.customer_profile_id ?? null,
      truck_id: record.truck_id ?? null,
      // The app's own bookkeeping: pricing a ticket is not a person checking
      // it against the picture, and must not mark it reviewed.
      bookkeeping: true,
      pricing: stamp,
    });
  }
  return { edits, conflicts, kept_manual: keptManual };
}

export type ApplyResult = {
  updated_tickets: number;
  conflicts: PricingConflict[];
  kept_manual: number;
};

/**
 * Writes the agreed rates onto the tickets they cover, and says what it could
 * not do. Scoped to one customer, or one job, when only their rates changed.
 *
 * Afterwards it asks which invoices are now ready that were not before, and
 * notes those in the trail — the point of the whole agent, from the desk's
 * side, is that an invoice stops waiting.
 */
export async function applyPeriodsToTickets(
  client: SupabaseClient,
  workspace: string,
  member: WorkspaceUser,
  scope: { customerId?: number; jobKey?: string } = {},
): Promise<ApplyResult> {
  const [records, profiles, periods, locks] = await Promise.all([
    listRecords(client, workspace),
    listProfiles(client, workspace),
    listPeriods(client, workspace, scope.customerId === undefined ? {} : { customerId: scope.customerId }),
    listLocks(client, workspace),
  ]);
  const customers = profiles.customers;
  const now = new Date().toISOString();
  const plan = ticketEdits(records, customers, periods, locks, now, scope);
  for (const conflict of plan.conflicts) {
    await appendEvent(client, workspace, {
      kind: 'PRICING_CONFLICT',
      customer_profile_id: scope.customerId ?? null,
      request_id: null,
      response_id: null,
      period_id: null,
      invoice_key: conflict.invoice_key,
      detail: conflict.detail,
      actor: actorOf(member),
    });
  }
  if (!plan.edits.length) {
    return { updated_tickets: 0, conflicts: plan.conflicts, kept_manual: plan.kept_manual };
  }
  const saved: SavedRecord[] = [];
  for (let at = 0; at < plan.edits.length; at += EDIT_BATCH) {
    saved.push(...(await updateRecords(client, workspace, plan.edits.slice(at, at + EDIT_BATCH))));
  }
  await noteInvoicesNowReady(client, workspace, member, records, saved, customers, periods, locks);
  return {
    updated_tickets: saved.length,
    conflicts: plan.conflicts,
    kept_manual: plan.kept_manual,
  };
}

/** The invoices these tickets are on that have just stopped waiting for a rate. */
async function noteInvoicesNowReady(
  client: SupabaseClient,
  workspace: string,
  member: WorkspaceUser,
  before: SavedRecord[],
  saved: SavedRecord[],
  customers: CustomerProfile[],
  periods: RatePeriod[],
  locks: InvoiceLock[],
) {
  const changed = new Map(saved.map((record) => [record.id, record]));
  const after = before.map((record) => changed.get(record.id) ?? record);
  const touched = new Set(
    saved.map((record) => invoiceKeyOf(record.invoice.invoice_number)),
  );
  const locked = new Set(
    locks.filter((lock) => lock.unlocked_at === null).map((lock) => lock.invoice_key),
  );
  const wasReady = new Map(
    invoiceGroups(before)
      .filter((group) => touched.has(group.key))
      .map((group) => [
        group.key,
        invoiceReadiness(group, customers, periods, locked.has(group.key)).status,
      ]),
  );
  for (const group of invoiceGroups(after)) {
    if (!touched.has(group.key)) continue;
    const readiness = invoiceReadiness(group, customers, periods, locked.has(group.key));
    if (readiness.status !== 'READY' || wasReady.get(group.key) === 'READY') continue;
    await appendEvent(client, workspace, {
      kind: 'INVOICE_READY_AFTER_RATE',
      customer_profile_id: null,
      request_id: null,
      response_id: null,
      period_id: null,
      invoice_key: group.key,
      detail: `Invoice ${group.invoice.invoice_number} has every rate it needs.`,
      actor: actorOf(member),
    });
  }
}

// ------------------------------------------------------------ reading a reply

export type ReplyOutcome = {
  response: RateResponse;
  request: RateRequest | null;
  applied: RatePeriod[];
  pending: RateMatch[];
  updated_tickets: number;
  conflicts: PricingConflict[];
  kept_manual: number;
};

/** A reply as it arrived, whoever it came from. */
export type IncomingReply = {
  customerId: number;
  request: RateRequest | null;
  message: NormalizedMessage;
  source: 'simulated' | 'email';
};

const sourceOf = (source: 'simulated' | 'email'): RateSource =>
  source === 'email' ? 'customer_email' : 'simulated_response';

/**
 * Everything that happens to a reply, in the order it has to happen.
 *
 * The raw message is stored first and always, before a model is asked
 * anything: whatever goes wrong afterwards, what the customer actually wrote
 * is on file and the work can be finished by hand. The store refuses a message
 * it already holds, which is what stops a mailbox delivering the same reply
 * twice from applying a rate twice.
 *
 * Then the reading, the matching, and the narrow gate: only matches the rules
 * call 'auto' become rate periods without a person. Everything else is
 * returned as pending and waits for the confirmation screen — and if the model
 * could not be reached at all, nothing is applied unattended, because a
 * fallback that starts writing rates is a fallback nobody asked for.
 */
export async function processReply(
  client: SupabaseClient,
  workspace: string,
  member: WorkspaceUser,
  incoming: IncomingReply,
): Promise<ReplyOutcome> {
  const { customerId, request, message, source } = incoming;
  const now = new Date().toISOString();
  const span = request
    ? { from: request.period_from, to: request.period_to }
    : defaultWindow(new Date());
  const [records, profiles, history] = await Promise.all([
    listRecords(client, workspace),
    listProfiles(client, workspace),
    // One customer's rates: `matchLines` reads the customer of a job off this
    // history, so a workspace-wide list would compare one customer's figure
    // against another's.
    listPeriods(client, workspace, { customerId }),
  ]);
  const customers = profiles.customers;
  const customer = customers.find(({ id }) => id === customerId);
  const profile = rateProfileOf(customer);
  const jobs = jobsForCustomer(records, customers, customerId, span.from, span.to);

  const stored = await insertResponse(client, workspace, {
    request_id: request?.id ?? null,
    customer_profile_id: customerId,
    source,
    message,
    message_hash: messageHash(message),
    lines: [],
    matches: [],
    status: 'received',
    ai_model: null,
    processed_at: null,
  });
  await appendEvent(client, workspace, {
    kind: 'RATE_RESPONSE_RECEIVED',
    customer_profile_id: customerId,
    request_id: request?.id ?? null,
    response_id: stored.id,
    period_id: null,
    invoice_key: null,
    detail: `A reply from ${message.sender ?? 'the customer'} was received.`,
    actor: actorOf(member),
  });

  const apiKey = openaiKey();
  let lines: ParsedRateLine[] = [];
  let model: string | null = null;
  let readerFailed = false;
  if (apiKey) {
    try {
      const read = await understandReply(
        apiKey,
        message,
        {
          items: request ? remainingItems(request) : [],
          jobs,
          typical_rate_type: profile.typical_rate_type,
        },
        { userId: member.id, workspaceId: workspace },
      );
      lines = read.lines;
      model = read.model;
    } catch {
      // The message is already on file; the reading is what failed. Fall back
      // to the plain rules and let a person settle every figure — the model's
      // own error text carries request ids and account detail and is not shown.
      readerFailed = true;
      lines = rulesOnlyLines(message.body_text);
    }
  } else {
    lines = rulesOnlyLines(message.body_text);
  }

  const matches = matchLines(
    lines,
    request ? { items: remainingItems(request) } : null,
    jobs,
    profile,
    history,
  );
  const pending = matches.filter((match) => match.status === 'confirm');
  const autos = readerFailed ? [] : matches.filter((match) => match.status === 'auto');
  const fresh: NewRatePeriod[] = periodsFromMatches(
    autos,
    customerId,
    span,
    jobs,
    profile,
    sourceOf(source),
    { request_id: request?.id ?? null, response_id: stored.id },
    'auto',
    null,
    now,
  );
  const applied = await insertPeriods(client, workspace, fresh);
  await supersedeCovered(client, workspace, history, applied);

  for (const match of matches) {
    if (!match.anomaly) continue;
    await appendEvent(client, workspace, {
      kind: 'RATE_ANOMALY',
      customer_profile_id: customerId,
      request_id: request?.id ?? null,
      response_id: stored.id,
      period_id: null,
      invoice_key: null,
      detail: match.anomaly.detail,
      actor: actorOf(member),
    });
  }
  if (applied.length) {
    await appendEvent(client, workspace, {
      kind: 'RATE_PERIOD_APPLIED',
      customer_profile_id: customerId,
      request_id: request?.id ?? null,
      response_id: stored.id,
      period_id: applied[0].id,
      invoice_key: null,
      detail: `${applied.length} rate${applied.length === 1 ? '' : 's'} read from the reply and applied.`,
      actor: actorOf(member),
    });
  }
  // Nothing certain and nothing pending is not success: a reply the agent made
  // nothing of is a reply somebody should look at.
  const needsPerson = readerFailed || pending.length > 0 || applied.length === 0;
  if (needsPerson) {
    await appendEvent(client, workspace, {
      kind: 'RATE_RESPONSE_NEEDS_CONFIRMATION',
      customer_profile_id: customerId,
      request_id: request?.id ?? null,
      response_id: stored.id,
      period_id: null,
      invoice_key: null,
      detail: readerFailed
        ? 'The reply could not be read automatically; it is kept as it arrived for someone to settle.'
        : `${pending.length || 'No'} figure${pending.length === 1 ? '' : 's'} from this reply need confirming.`,
      actor: actorOf(member),
    });
  }

  const response = await updateResponse(client, workspace, stored.id, {
    lines,
    matches,
    status: needsPerson ? 'needs_confirmation' : 'applied',
    ai_model: model,
    processed_at: new Date().toISOString(),
  });

  let updatedRequest: RateRequest | null = request;
  if (request) {
    const answered = mergeAnswered(request, applied);
    const settled = remainingItems({ ...request, answered }).length === 0;
    updatedRequest = await updateRequest(client, workspace, request.id, {
      answered,
      reply_at: now,
      follow_up_due_at: null,
      status: needsPerson ? 'NEEDS_CONFIRMATION' : settled ? 'RESOLVED' : 'WAITING_FOR_REPLY',
    });
  }

  const priced = await applyPeriodsToTickets(client, workspace, member, { customerId });
  return {
    response,
    request: updatedRequest,
    applied,
    pending,
    updated_tickets: priced.updated_tickets,
    conflicts: priced.conflicts,
    kept_manual: priced.kept_manual,
  };
}

/** The job-and-field pairs a request has now had an answer to, without repeats. */
export function mergeAnswered(
  request: RateRequest,
  applied: Pick<RatePeriod, 'job_key' | 'kind'>[],
): RateRequest['answered'] {
  const answered = [...request.answered];
  const seen = new Set(answered.map((entry) => `${entry.job_key}|${entry.field}`));
  for (const period of applied) {
    const key = `${period.job_key}|${period.kind}`;
    if (seen.has(key)) continue;
    seen.add(key);
    answered.push({ job_key: period.job_key, field: period.kind });
  }
  return answered;
}
