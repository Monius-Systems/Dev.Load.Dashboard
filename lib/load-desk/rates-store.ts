import { apiJson, dataMode, type DataMode } from './data-mode.ts';
import type {
  BaseRateType,
  FuelRateType,
  InvoiceLock,
  RateEvent,
  RateKind,
  RateMatch,
  RatePeriod,
  RateRequest,
  RateResponse,
  RateUnit,
  RateValidity,
} from './rates.ts';

// The rate agent's rows for the Rates page, in the shape of storage.ts: one
// snapshot, subscribers, and the calls that change it. Signed-in members read
// /api/rates for the week on screen and change nothing else on their own —
// every write here is a button somebody pressed. The unprotected local preview
// has no agent to ask and says so.
//
// Nothing on this page polls. A week of requests is read once when the range
// changes; anything that follows is an answer to an action.

/** What a deployment is allowed to do with the mail adapter (RateRequest.mode). */
export type MailMode = RateRequest['mode'];

export type RatesSnapshot = {
  /** Every rate period the range knows about, superseded ones included. */
  periods: RatePeriod[];
  requests: RateRequest[];
  responses: RateResponse[];
  locks: InvoiceLock[];
  /** What the agent did, newest first. */
  events: RateEvent[];
  /** What this deployment is allowed to do with the mail adapter. */
  mail_mode: MailMode;
  /** Whether a model is configured to read replies; rules only when not. */
  ai_configured: boolean;
  /** Whether the simulator and "mark as sent" are offered (DEV only). */
  dev_tools: boolean;
  /** The range loaded from the server, or null before the first load. */
  range: { from: string; to: string } | null;
  error: string | null;
  ready: boolean;
  mode: DataMode | null;
  /** The actions running right now, by the keys below. */
  busy: ReadonlySet<string>;
};

/** What a write can be waiting on, so one button can be disabled and not the page. */
export const busyKey = {
  generate: 'generate',
  request: (id: number) => `request:${id}`,
  response: (id: number) => `response:${id}`,
  simulate: 'simulate',
  period: 'period',
  apply: 'apply',
  invoice: (key: string) => `invoice:${key}`,
};

const SERVER_SNAPSHOT: RatesSnapshot = {
  periods: [],
  requests: [],
  responses: [],
  locks: [],
  events: [],
  mail_mode: 'DRAFT_ONLY',
  ai_configured: false,
  dev_tools: false,
  range: null,
  error: null,
  ready: false,
  mode: null,
  busy: new Set(),
};

let snapshot: RatesSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function publish(next: RatesSnapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

export function subscribeRates(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getRatesSnapshot = () => snapshot;
export const getServerRatesSnapshot = () => SERVER_SNAPSHOT;

/** Rows in, by id: what came back replaces what was there, the rest is kept. */
function mergeById<T extends { id: number }>(current: T[], incoming: readonly T[]): T[] {
  if (!incoming.length) return current;
  const byId = new Map(incoming.map((row) => [row.id, row]));
  const merged = current.map((row) => byId.get(row.id) ?? row);
  const seen = new Set(current.map((row) => row.id));
  return [...merged, ...incoming.filter((row) => !seen.has(row.id))];
}

/** Locks are keyed by the invoice, not by an id of their own. */
function mergeLocks(current: InvoiceLock[], incoming: readonly InvoiceLock[]): InvoiceLock[] {
  if (!incoming.length) return current;
  const byKey = new Map(incoming.map((lock) => [lock.invoice_key, lock]));
  const merged = current.map((lock) => byKey.get(lock.invoice_key) ?? lock);
  const seen = new Set(current.map((lock) => lock.invoice_key));
  return [...merged, ...incoming.filter((lock) => !seen.has(lock.invoice_key))];
}

const asList = <T>(value: readonly T[] | undefined): readonly T[] => value ?? [];

type Conflict = { invoice_key: string; detail: string };

/** What every write answers with, as far as this store reads it. */
type Wrote = {
  request?: RateRequest | null;
  requests?: RateRequest[];
  response?: RateResponse | null;
  responses?: RateResponse[];
  period?: RatePeriod | null;
  periods?: RatePeriod[];
  applied?: RatePeriod[];
  lock?: InvoiceLock | null;
  events?: RateEvent[];
  updated_tickets?: number;
  conflicts?: Conflict[];
};

/** Everything a write sent back, merged into the snapshot in one publish. */
function merge(wrote: Wrote) {
  const requests = [...asList(wrote.requests), ...(wrote.request ? [wrote.request] : [])];
  const responses = [...asList(wrote.responses), ...(wrote.response ? [wrote.response] : [])];
  const periods = [
    ...asList(wrote.periods),
    ...asList(wrote.applied),
    ...(wrote.period ? [wrote.period] : []),
  ];
  publish({
    ...snapshot,
    requests: mergeById(snapshot.requests, requests),
    responses: mergeById(snapshot.responses, responses),
    periods: mergeById(snapshot.periods, periods),
    locks: mergeLocks(snapshot.locks, wrote.lock ? [wrote.lock] : []),
    events: wrote.events?.length
      ? mergeById(snapshot.events, wrote.events).sort((a, b) => (a.at < b.at ? 1 : -1))
      : snapshot.events,
  });
}

/** Marks a key busy for as long as `work` runs, whichever way it ends. */
async function run<T>(key: string, work: () => Promise<T>): Promise<T> {
  publish({ ...snapshot, busy: new Set([...snapshot.busy, key]) });
  try {
    return await work();
  } finally {
    const busy = new Set(snapshot.busy);
    busy.delete(key);
    publish({ ...snapshot, busy });
  }
}

/** The one message every write gives back when there is no session to write with. */
const NO_SESSION = 'Your session has ended. Sign in again to save.';
const NO_AGENT = 'The rate agent runs on the server and is not available in the local preview.';

/** Whether a write can be sent at all, or the reason it cannot. */
function writable(): string | null {
  if (snapshot.mode === 'local') return NO_AGENT;
  if (snapshot.mode !== 'remote') return NO_SESSION;
  return null;
}

type Loaded = {
  periods: RatePeriod[];
  requests: RateRequest[];
  responses: RateResponse[];
  locks: InvoiceLock[];
  events: RateEvent[];
  mail_mode: MailMode;
  ai_configured: boolean;
  dev_tools: boolean;
};

/**
 * Everything the range needs, in one request. Called when the week on screen
 * changes and at no other time: this page is a desk, not a dashboard, and
 * nothing here is worked out until somebody asks for it.
 */
export async function loadRates(range: { from: string; to: string }): Promise<void> {
  const mode = snapshot.mode ?? (await dataMode());
  if (mode === 'local') {
    publish({ ...SERVER_SNAPSHOT, range, ready: true, mode, busy: snapshot.busy });
    return;
  }
  if (mode === 'unavailable') {
    publish({
      ...snapshot,
      range,
      error: 'Your session has ended. Sign in again to see rates.',
      ready: true,
      mode,
    });
    return;
  }
  const result = await apiJson<Loaded>(`/api/rates?from=${range.from}&to=${range.to}`);
  if (!result.ok) {
    publish({ ...snapshot, range, error: result.error, ready: true, mode });
    return;
  }
  publish({
    ...snapshot,
    periods: result.data.periods,
    requests: result.data.requests,
    responses: result.data.responses,
    locks: result.data.locks,
    events: result.data.events,
    mail_mode: result.data.mail_mode,
    ai_configured: result.data.ai_configured,
    dev_tools: result.data.dev_tools,
    range,
    error: null,
    ready: true,
    mode,
  });
}

/** What a write gives back: the rows, or the message to put on the screen. */
type Written<T> = { error: string | null; data: T | null };

/** A write: the answer merged in on success, the message given back on failure. */
async function post<T extends Wrote>(
  key: string,
  path: string,
  body: unknown,
): Promise<Written<T>> {
  const stopped = writable();
  if (stopped) return { error: stopped, data: null };
  return run(key, async () => {
    const result = await apiJson<T>(path, { method: 'POST', body: JSON.stringify(body) });
    if (!result.ok) return { error: result.error, data: null };
    merge(result.data);
    return { error: null, data: result.data };
  });
}

/** The same write where only "did it work" is worth reporting. */
const posted = async (key: string, path: string, body: unknown): Promise<string | null> =>
  (await post(key, path, body)).error;

export type GeneratedRequests = {
  requests: RateRequest[];
  created: number;
  skipped: { customer_profile_id: number; reason: string }[];
};

/**
 * Writes this week's requests: one per customer with a job whose rate or fuel
 * charge is not known. Customers already asked are skipped rather than asked
 * twice, and the server says which and why.
 */
export const generateRequests = (range: { from: string; to: string }) =>
  post<GeneratedRequests & Wrote>(busyKey.generate, '/api/rates/requests/generate', {
    from: range.from,
    to: range.to,
  });

/** Sends a request. Refused with the server's own wording where drafts are all. */
export const sendRequest = (id: number) =>
  posted(busyKey.request(id), `/api/rates/requests/${id}/send`, {});

/** DEV only: files a request as sent without a mail adapter behind it. */
export const markSent = (id: number) =>
  posted(busyKey.request(id), `/api/rates/requests/${id}/mark-sent`, { simulated: true });

export const closeRequest = (id: number) =>
  posted(busyKey.request(id), `/api/rates/requests/${id}/close`, {});

/** Writes the chase-up as a fresh draft on the request; nothing is sent. */
export const followUp = (id: number) =>
  posted(busyKey.request(id), `/api/rates/requests/${id}/follow-up`, {});

export type SimulatedReply = {
  response: RateResponse;
  request: RateRequest | null;
  applied: RatePeriod[];
  pending: RateMatch[];
  updated_tickets: number;
  conflicts: Conflict[];
};

/** DEV only: puts a reply through the reader as though it had arrived. */
export const simulateResponse = (input: {
  customer_profile_id: number;
  request_id?: number;
  subject?: string;
  body_text: string;
}) => post<SimulatedReply & Wrote>(busyKey.simulate, '/api/rates/responses/simulate', input);

export type ConfirmedMatch = {
  line_index: number;
  job_key: string;
  field: RateKind;
  value: number | null;
  unit: RateUnit;
  effective_from: string;
  effective_to: string | null;
  validity: RateValidity;
};

export type Confirmed = {
  response: RateResponse;
  periods: RatePeriod[];
  updated_tickets: number;
  conflicts: Conflict[];
};

/**
 * Confirms a reply in one go: every figure read out of it, for every ticket
 * the period covers. A rate is agreed for a job and a week, never for one
 * ticket, so there is no per-ticket confirmation to make.
 */
export async function confirmResponse(
  id: number,
  matches: ConfirmedMatch[],
  learnAliases: boolean,
): Promise<Written<Confirmed & Wrote>> {
  const written = await post<Confirmed & Wrote>(
    busyKey.response(id),
    `/api/rates/responses/${id}/confirm`,
    { matches, learn_aliases: learnAliases },
  );
  // A confirmed period puts out the one it replaced, which is a row this
  // answer does not carry. Read the range again so the history on the screen
  // is the server's and not this store's guess at it.
  if (!written.error && snapshot.range) await loadRates(snapshot.range);
  return written;
}

export const rejectResponse = (id: number, reason: string) =>
  posted(busyKey.response(id), `/api/rates/responses/${id}/reject`, { reason });

export type PeriodDraft = {
  customer_profile_id: number;
  job_key: string;
  job_label: string;
  kind: RateKind;
  value: number | null;
  rate_type?: BaseRateType;
  fuel_type?: FuelRateType;
  effective_from: string;
  effective_to: string | null;
  validity: RateValidity;
  reason: string;
};

/**
 * A rate entered by hand, or one corrected. The period it replaces is
 * superseded and kept, so an invoice printed against it can still be
 * explained; as with a confirmation, the range is read again afterwards.
 */
export async function addPeriod(
  body: PeriodDraft,
): Promise<Written<{ period: RatePeriod; updated_tickets: number; conflicts: Conflict[] }>> {
  const written = await post<{
    period: RatePeriod;
    updated_tickets: number;
    conflicts: Conflict[];
  }>(busyKey.period, '/api/rates/periods', body);
  if (!written.error && snapshot.range) await loadRates(snapshot.range);
  return written;
}

/** Prices tickets again from the periods on file, for one job or for all of them. */
export const applyRates = (filter: { customer_profile_id?: number; job_key?: string } = {}) =>
  post<{ updated_tickets: number; conflicts: Conflict[] }>(busyKey.apply, '/api/rates/apply', filter);

/** Closes an invoice against the rates of the day, with those figures kept. */
export const finalizeInvoice = (invoiceKey: string, reason?: string) =>
  posted(busyKey.invoice(invoiceKey), '/api/invoices/finalize', {
    invoice_key: invoiceKey,
    ...(reason ? { reason } : {}),
  });

/** Opens a finalized invoice again. The reason is kept on the lock. */
export const unlockInvoice = (invoiceKey: string, reason: string) =>
  posted(busyKey.invoice(invoiceKey), '/api/invoices/unlock', {
    invoice_key: invoiceKey,
    reason,
  });

// Saved tickets are not reloaded from here. storage.ts keeps no exported way
// to ask it again, and its own watch already brings a repriced ticket down
// within the beat it keeps while the page is being looked at (live.ts). If a
// reload is exported later, the calls above that answer with updated_tickets
// are where it belongs.
