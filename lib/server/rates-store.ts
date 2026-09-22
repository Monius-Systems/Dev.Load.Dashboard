import type { SupabaseClient } from '@supabase/supabase-js';
import {
  readRatePeriod,
  readRateRequest,
  readRateResponse,
  type InvoiceLock,
  type NewRatePeriod,
  type RateEvent,
  type RatePeriod,
  type RateRequest,
  type RateRequestStatus,
  type RateResponse,
} from '@/lib/load-desk/rates';
import { invoiceKeyOf } from '@/lib/load-desk/record-input';
import { StoreError } from '@/lib/server/load-desk-store';

// Supabase storage for the Rate & Fuel Agent: the rate periods, the emails
// that asked for them, the replies that answered, the trail of what was done
// and the invoices finalized against it. Every function is given the workspace
// of the person making the request — there is no default and no global to fall
// back to — and runs as the signed-in user, so row level security enforces the
// same boundary.
//
// Rates are never edited in place. A figure that changes is a new period, and
// the old one is marked superseded, so an invoice printed months ago can still
// be explained by the row that was current when it was printed.

const unavailable = (what: string) =>
  new StoreError(`Could not ${what}. Please try again.`, 503);

const PERIOD_COLUMNS =
  'id, customer_profile_id, job_key, job_label, kind, effective_from, effective_to, validity, rate_type, fuel_type, value, source, source_request_id, source_response_id, confidence, applied_by, confirmed_by, confirmed_at, superseded_by, note, created_at';

const REQUEST_COLUMNS =
  'id, customer_profile_id, period_from, period_to, status, mode, recipient, cc, subject, body, items, answered, sent_at, reply_at, follow_up_due_at, follow_up_count, thread_ref, created_at, updated_at';

const RESPONSE_COLUMNS =
  'id, request_id, customer_profile_id, source, message, message_hash, lines, matches, status, ai_model, processed_at, created_at';

const EVENT_COLUMNS =
  'id, kind, customer_profile_id, request_id, response_id, period_id, invoice_key, detail, actor, at';

const LOCK_COLUMNS =
  'invoice_key, finalized_at, finalized_by, snapshot, unlocked_at, unlock_reason';

/** The most events one listing will return, however many are asked for. */
const MAX_EVENTS = 200;

const refId = (value: unknown): number | null =>
  value === null || value === undefined ? null : Number(value);
const str = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;
const nullableStr = (value: unknown): string | null =>
  typeof value === 'string' ? value : null;

// --------------------------------------------------------------- periods

/**
 * The customer's rate periods, newest first, superseded ones included: which
 * one applies to a ticket is the domain's decision, not the database's.
 */
export async function listPeriods(
  client: SupabaseClient,
  workspace: string,
  options: { customerId?: number } = {},
): Promise<RatePeriod[]> {
  let query = client
    .from('load_desk_rate_periods')
    .select(PERIOD_COLUMNS)
    .eq('workspace_id', workspace);
  if (options.customerId !== undefined) {
    query = query.eq('customer_profile_id', options.customerId);
  }
  const { data, error } = await query
    .order('effective_from', { ascending: false })
    .order('id', { ascending: false });
  if (error) throw unavailable('load the rates');
  return data.map((row) => readRatePeriod(row as Record<string, unknown>));
}

/**
 * New periods, in one insert: a base rate and its fuel charge are one
 * decision, and half of it stored is worse than neither.
 */
export async function insertPeriods(
  client: SupabaseClient,
  workspace: string,
  periods: NewRatePeriod[],
): Promise<RatePeriod[]> {
  if (!periods.length) return [];
  const rows = periods.map((period) => ({
    ...period,
    workspace_id: workspace,
  }));
  const { data, error } = await client
    .from('load_desk_rate_periods')
    .insert(rows)
    .select(PERIOD_COLUMNS);
  if (error || !data) throw unavailable('save the rates');
  return data.map((row) => readRatePeriod(row as Record<string, unknown>));
}

/** Marks a period replaced by a later one. The figures on it never change. */
export async function supersedePeriod(
  client: SupabaseClient,
  workspace: string,
  periodId: number,
  byId: number,
): Promise<void> {
  const { error } = await client
    .from('load_desk_rate_periods')
    .update({ superseded_by: byId })
    .eq('workspace_id', workspace)
    .eq('id', periodId);
  if (error) throw unavailable('replace the rate');
}

// -------------------------------------------------------------- requests

/**
 * Rate requests, newest first. `from` and `to` are the window the request's
 * own period starts in, which is how the desk lists a quarter's asks.
 */
export async function listRequests(
  client: SupabaseClient,
  workspace: string,
  options: { from?: string; to?: string; status?: RateRequestStatus } = {},
): Promise<RateRequest[]> {
  let query = client
    .from('load_desk_rate_requests')
    .select(REQUEST_COLUMNS)
    .eq('workspace_id', workspace);
  if (options.from) query = query.gte('period_from', options.from);
  if (options.to) query = query.lte('period_from', options.to);
  if (options.status) query = query.eq('status', options.status);
  const { data, error } = await query.order('id', { ascending: false });
  if (error) throw unavailable('load the rate requests');
  return data.map((row) => readRateRequest(row as Record<string, unknown>));
}

export async function getRequest(
  client: SupabaseClient,
  workspace: string,
  requestId: number,
): Promise<RateRequest | null> {
  const { data, error } = await client
    .from('load_desk_rate_requests')
    .select(REQUEST_COLUMNS)
    .eq('workspace_id', workspace)
    .eq('id', requestId)
    .maybeSingle();
  if (error) throw unavailable('load that rate request');
  return data ? readRateRequest(data as Record<string, unknown>) : null;
}

export async function insertRequest(
  client: SupabaseClient,
  workspace: string,
  request: Omit<RateRequest, 'id' | 'created_at' | 'updated_at'>,
): Promise<RateRequest> {
  const { data, error } = await client
    .from('load_desk_rate_requests')
    .insert({
      ...request,
      workspace_id: workspace,
    })
    .select(REQUEST_COLUMNS)
    .single();
  if (error || !data) throw unavailable('save the rate request');
  return readRateRequest(data as Record<string, unknown>);
}

/** What a send, a reply or a chase changed about the request. */
export async function updateRequest(
  client: SupabaseClient,
  workspace: string,
  requestId: number,
  patch: Partial<Omit<RateRequest, 'id' | 'created_at' | 'updated_at'>>,
): Promise<RateRequest> {
  const { data, error } = await client
    .from('load_desk_rate_requests')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('workspace_id', workspace)
    .eq('id', requestId)
    .select(REQUEST_COLUMNS)
    .maybeSingle();
  if (error) throw unavailable('save the rate request');
  if (!data) throw new StoreError('That rate request no longer exists.', 404);
  return readRateRequest(data as Record<string, unknown>);
}

// ------------------------------------------------------------- responses

export async function listResponses(
  client: SupabaseClient,
  workspace: string,
  options: { requestId?: number; customerId?: number } = {},
): Promise<RateResponse[]> {
  let query = client
    .from('load_desk_rate_responses')
    .select(RESPONSE_COLUMNS)
    .eq('workspace_id', workspace);
  if (options.requestId !== undefined) query = query.eq('request_id', options.requestId);
  if (options.customerId !== undefined) {
    query = query.eq('customer_profile_id', options.customerId);
  }
  const { data, error } = await query.order('id', { ascending: false });
  if (error) throw unavailable('load the replies');
  return data.map((row) => readRateResponse(row as Record<string, unknown>));
}

export async function getResponse(
  client: SupabaseClient,
  workspace: string,
  responseId: number,
): Promise<RateResponse | null> {
  const { data, error } = await client
    .from('load_desk_rate_responses')
    .select(RESPONSE_COLUMNS)
    .eq('workspace_id', workspace)
    .eq('id', responseId)
    .maybeSingle();
  if (error) throw unavailable('load that reply');
  return data ? readRateResponse(data as Record<string, unknown>) : null;
}

/**
 * A reply, stored once. The message hash is unique within the workspace, so
 * the same reply delivered twice is refused here rather than applying its
 * rates a second time.
 */
export async function insertResponse(
  client: SupabaseClient,
  workspace: string,
  response: Omit<RateResponse, 'id' | 'created_at'>,
): Promise<RateResponse> {
  const { data, error } = await client
    .from('load_desk_rate_responses')
    .insert({
      ...response,
      workspace_id: workspace,
    })
    .select(RESPONSE_COLUMNS)
    .single();
  if (error?.code === '23505') {
    throw new StoreError('This reply was already processed.', 409);
  }
  if (error || !data) throw unavailable('save the reply');
  return readRateResponse(data as Record<string, unknown>);
}

export async function updateResponse(
  client: SupabaseClient,
  workspace: string,
  responseId: number,
  patch: Partial<Omit<RateResponse, 'id' | 'created_at'>>,
): Promise<RateResponse> {
  const { data, error } = await client
    .from('load_desk_rate_responses')
    .update(patch)
    .eq('workspace_id', workspace)
    .eq('id', responseId)
    .select(RESPONSE_COLUMNS)
    .maybeSingle();
  if (error) throw unavailable('save the reply');
  if (!data) throw new StoreError('That reply no longer exists.', 404);
  return readRateResponse(data as Record<string, unknown>);
}

// ---------------------------------------------------------------- events

/** Defensive: the trail is read back long after it was written. */
const readEvent = (row: Record<string, unknown>): RateEvent => ({
  id: Number(row.id),
  // Kept as it was written. A kind this build does not know is a line of
  // history from another one, and renaming it into a kind we do know would
  // make the trail say something that never happened.
  kind: str(row.kind) as RateEvent['kind'],
  customer_profile_id: refId(row.customer_profile_id),
  request_id: refId(row.request_id),
  response_id: refId(row.response_id),
  period_id: refId(row.period_id),
  invoice_key: nullableStr(row.invoice_key),
  detail: str(row.detail),
  actor: nullableStr(row.actor),
  at: str(row.at),
});

/** One line in the trail. Events are appended and never changed. */
export async function appendEvent(
  client: SupabaseClient,
  workspace: string,
  event: Omit<RateEvent, 'id' | 'at'>,
): Promise<RateEvent> {
  const { data, error } = await client
    .from('load_desk_rate_events')
    .insert({
      ...event,
      workspace_id: workspace,
    })
    .select(EVENT_COLUMNS)
    .single();
  if (error || !data) throw unavailable('record what happened');
  return readEvent(data as Record<string, unknown>);
}

export async function listEvents(
  client: SupabaseClient,
  workspace: string,
  options: { limit?: number; customerId?: number } = {},
): Promise<RateEvent[]> {
  const limit = Math.min(Math.max(Math.trunc(options.limit ?? MAX_EVENTS), 1), MAX_EVENTS);
  let query = client
    .from('load_desk_rate_events')
    .select(EVENT_COLUMNS)
    .eq('workspace_id', workspace);
  if (options.customerId !== undefined) {
    query = query.eq('customer_profile_id', options.customerId);
  }
  const { data, error } = await query
    .order('at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);
  if (error) throw unavailable('load what happened');
  return data.map((row) => readEvent(row as Record<string, unknown>));
}

// ----------------------------------------------------------------- locks
//
// A lock is keyed the way load_desk_invoices keys an invoice number, so the
// lock on an invoice and the tickets on it are the same invoice however the
// number was typed.

const readLock = (row: Record<string, unknown>): InvoiceLock => ({
  invoice_key: str(row.invoice_key),
  finalized_at: str(row.finalized_at),
  finalized_by: nullableStr(row.finalized_by),
  snapshot: (row.snapshot ?? {}) as InvoiceLock['snapshot'],
  unlocked_at: nullableStr(row.unlocked_at),
  unlock_reason: nullableStr(row.unlock_reason),
});

export async function listLocks(
  client: SupabaseClient,
  workspace: string,
): Promise<InvoiceLock[]> {
  const { data, error } = await client
    .from('load_desk_invoice_locks')
    .select(LOCK_COLUMNS)
    .eq('workspace_id', workspace)
    .order('finalized_at', { ascending: false });
  if (error) throw unavailable('load the finalized invoices');
  return data.map((row) => readLock(row as Record<string, unknown>));
}

export async function getLock(
  client: SupabaseClient,
  workspace: string,
  invoiceKey: string,
): Promise<InvoiceLock | null> {
  const { data, error } = await client
    .from('load_desk_invoice_locks')
    .select(LOCK_COLUMNS)
    .eq('workspace_id', workspace)
    .eq('invoice_key', invoiceKeyOf(invoiceKey))
    .maybeSingle();
  if (error) throw unavailable('load that invoice');
  return data ? readLock(data as Record<string, unknown>) : null;
}

/**
 * Finalizes an invoice against the figures of the day, which are kept in the
 * snapshot. Finalizing one that is already locked writes the snapshot again
 * and clears any earlier unlock, so the row always describes the lock that is
 * in force.
 */
export async function lockInvoice(
  client: SupabaseClient,
  workspace: string,
  lock: Omit<InvoiceLock, 'unlocked_at' | 'unlock_reason'>,
): Promise<InvoiceLock> {
  const { data, error } = await client
    .from('load_desk_invoice_locks')
    .upsert(
      {
        ...lock,
        invoice_key: invoiceKeyOf(lock.invoice_key),
        workspace_id: workspace,
        unlocked_at: null,
        unlock_reason: null,
      },
      { onConflict: 'workspace_id,invoice_key' },
    )
    .select(LOCK_COLUMNS)
    .single();
  if (error || !data) throw unavailable('finalize the invoice');
  return readLock(data as Record<string, unknown>);
}

/** Opens a finalized invoice again, with the reason on the row. */
export async function unlockInvoice(
  client: SupabaseClient,
  workspace: string,
  invoiceKey: string,
  reason: string,
): Promise<InvoiceLock> {
  const { data, error } = await client
    .from('load_desk_invoice_locks')
    .update({ unlocked_at: new Date().toISOString(), unlock_reason: reason })
    .eq('workspace_id', workspace)
    .eq('invoice_key', invoiceKeyOf(invoiceKey))
    .select(LOCK_COLUMNS)
    .maybeSingle();
  if (error) throw unavailable('unlock the invoice');
  if (!data) throw new StoreError('That invoice is not finalized.', 404);
  return readLock(data as Record<string, unknown>);
}
