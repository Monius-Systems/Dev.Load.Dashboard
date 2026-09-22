// Rate & Fuel Agent: what a customer charges, for which job, over which days.
//
// A hauling rate is not a property of a ticket. It is agreed with a customer
// for a job, it holds for a stretch of days, and it changes — usually the fuel
// surcharge weekly and the hauling rate once per project. So the truth lives
// in rate periods, and a ticket is priced by asking which period covered the
// day it was hauled.
//
// The order of work here is deliberate. The AI reads a reply and says what it
// saw (`ParsedRateLine`); this module decides what that means against the jobs
// actually worked, the customer's habits and the rates already on file, and
// the arithmetic is plain multiplication with the same rounding the invoice
// has always used. Nothing in here talks to a model, a database or a mailbox:
// the same functions run in the browser, on the server and under the tests,
// and any figure that reaches an invoice can be traced back through them.
//
// The philosophy, in one line: the AI understands, these rules validate, the
// software calculates, and anything left doubtful goes to a person.

import { locationRateFor, normalizeAddress, normalizeName } from './customer-rates.ts';
import { money, ticketTons } from './format.ts';
import { fnv1a } from './mileage.ts';
import { customerIdFor, type CustomerProfile } from './profiles.ts';
import type { InvoiceGroup } from './records.ts';
import { ticketDay } from './ticket-date.ts';
import {
  fuelTypeOf,
  rateTypeOf,
  type FuelType,
  type RateType,
  type SavedRecord,
  type Ticket,
} from './types.ts';

/** The date range parser of the mileage module, which reads dates the same way. */
export { parseDateRange } from './mileage.ts';

// ----------------------------------------------------------------- vocabulary

/**
 * How a hauling rate is charged, in the customer's own words rather than the
 * three shapes a ticket line can carry. A customer may quote per mile or per
 * day long before the invoice engine can bill it; the rate is still recorded
 * as agreed, and `toTicketPricing` says plainly when it cannot be carried onto
 * a ticket yet.
 */
export const BASE_RATE_TYPES = [
  'PER_TON',
  'PER_LOAD',
  'PER_HOUR',
  'PER_MILE',
  'PER_DAY',
  'FLAT_RATE',
  'CUSTOM',
] as const;
export type BaseRateType = (typeof BASE_RATE_TYPES)[number];

export const isBaseRateType = (value: unknown): value is BaseRateType =>
  (BASE_RATE_TYPES as readonly unknown[]).includes(value);

/**
 * How a fuel surcharge is charged. INCLUDED and NONE are answers, not gaps:
 * a customer who says "fuel is in the rate" has answered the question, and is
 * never asked it again for that period.
 */
export const FUEL_RATE_TYPES = [
  'PERCENTAGE',
  'PER_TON',
  'PER_LOAD',
  'PER_MILE',
  'FIXED_AMOUNT',
  'INCLUDED',
  'NONE',
  'CUSTOM',
] as const;
export type FuelRateType = (typeof FUEL_RATE_TYPES)[number];

export const isFuelRateType = (value: unknown): value is FuelRateType =>
  (FUEL_RATE_TYPES as readonly unknown[]).includes(value);

/** The two things asked of a customer: the hauling rate and the fuel surcharge. */
export type RateKind = 'base' | 'fuel';
export const RATE_KINDS = ['base', 'fuel'] as const;
export const isRateKind = (value: unknown): value is RateKind =>
  value === 'base' || value === 'fuel';

/** A unit as it may arrive: either list, or nothing the reply made clear. */
export type RateUnit = BaseRateType | FuelRateType | 'UNKNOWN';

/**
 * How long a figure holds: the billing period it was given for, or the whole
 * job. A hauling rate agreed for a project is usually the second, which is why
 * it is asked for once and a fuel surcharge every week.
 */
export type RateValidity = 'PERIOD' | 'PROJECT_DURATION';
export const isRateValidity = (value: unknown): value is RateValidity =>
  value === 'PERIOD' || value === 'PROJECT_DURATION';

/** Where a period came from, kept so a figure on an invoice can be traced. */
export type RateSource = 'customer_email' | 'simulated_response' | 'manual' | 'site_rate';
export const RATE_SOURCES = [
  'customer_email',
  'simulated_response',
  'manual',
  'site_rate',
] as const;
export const isRateSource = (value: unknown): value is RateSource =>
  (RATE_SOURCES as readonly unknown[]).includes(value);

/**
 * One agreed figure, for one customer, one job and one stretch of days.
 *
 * Periods are never edited in place. A rate that changes is a new period, and
 * a period entered in error is marked `superseded_by` — so what an old invoice
 * was priced with is still on file, and re-pricing last month cannot silently
 * become this month's number.
 */
export type RatePeriod = {
  id: number;
  customer_profile_id: number;
  job_key: string;
  job_label: string;
  kind: RateKind;
  effective_from: string;
  /** Null is open-ended: the rate holds until something supersedes it. */
  effective_to: string | null;
  validity: RateValidity;
  rate_type: BaseRateType | null;
  fuel_type: FuelRateType | null;
  value: number | null;
  source: RateSource;
  source_request_id: number | null;
  source_response_id: number | null;
  confidence: number | null;
  applied_by: 'auto' | 'human';
  confirmed_by: string | null;
  confirmed_at: string | null;
  superseded_by: number | null;
  note: string | null;
  created_at: string;
};

/** A period as it is written: the store gives it an id, a time and its fate. */
export type NewRatePeriod = Omit<RatePeriod, 'id' | 'created_at' | 'superseded_by'>;

// ---------------------------------------------------------------------- jobs

/**
 * The key a job is tracked under: its delivery address, compared the way every
 * address in the app is compared, so a comma or a capital out of place is the
 * same job. Empty for a ticket with no delivery address — such a ticket cannot
 * be placed on a job and is never counted into one.
 */
export const jobKeyOf = (projectAddress: string | null | undefined): string =>
  normalizeName(normalizeAddress(projectAddress ?? ''));

/** What a person calls the job: its name, else its address, else neither. */
export const jobLabelOf = (ticket: Ticket): string =>
  (ticket.project_name ?? '').trim() ||
  normalizeAddress(ticket.project_address ?? '') ||
  'Unnamed job';

/** A job as the rest of this module needs it: something to match, something to read. */
export type JobRef = { job_key: string; job_label: string };

// ------------------------------------------------------------------ rounding

/**
 * Rounds to cents. The toFixed step keeps 286.375 from landing on 286.37 —
 * the same arithmetic as format.ts, deliberately, so a figure worked out here
 * and the same figure worked out on the invoice can never disagree by a cent.
 */
const round2 = (value: number) => Math.round(Number((value * 100).toFixed(6))) / 100;
const round1 = (value: number) => Math.round(value * 10) / 10;

// ---------------------------------------------------------------------- dates

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const pad2 = (value: number) => String(value).padStart(2, '0');
const DAY_MS = 86_400_000;

const isIsoDate = (value: unknown): value is string =>
  typeof value === 'string' && ISO_DATE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

/** The ISO date a local Date falls on, by the calendar the person is reading. */
const localIso = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const utcIso = (time: number) => {
  const date = new Date(time);
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
};

const dayTime = (date: string) => Date.parse(`${date}T00:00:00Z`);

/** Dates are added in UTC, so a clock going back an hour cannot shorten a week. */
const addDays = (date: string, days: number) => utcIso(dayTime(date) + days * DAY_MS);

const daysBetween = (from: string, to: string) => Math.round((dayTime(to) - dayTime(from)) / DAY_MS);

/** 0 Sunday … 6 Saturday, for an ISO date. */
const weekdayOf = (date: string) => new Date(dayTime(date)).getUTCDay();

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/**
 * A billing period as it is written to a person: "Sep 14–20" within a month,
 * "Sep 28 – Oct 4" across two, and with the years spelled out when the period
 * crosses New Year, where "Dec 29 – Jan 4" would be genuinely ambiguous.
 */
export const periodLabel = (from: string, to: string): string => {
  if (!isIsoDate(from) || !isIsoDate(to)) return '';
  const [fromYear, fromMonth, fromDay] = from.split('-').map(Number);
  const [toYear, toMonth, toDay] = to.split('-').map(Number);
  const month = (value: number) => MONTHS[Math.min(Math.max(value, 1), 12) - 1];
  if (fromYear !== toYear) {
    return `${month(fromMonth)} ${fromDay}, ${fromYear} – ${month(toMonth)} ${toDay}, ${toYear}`;
  }
  if (fromMonth === toMonth) return `${month(fromMonth)} ${fromDay}–${toDay}`;
  return `${month(fromMonth)} ${fromDay} – ${month(toMonth)} ${toDay}`;
};

// ------------------------------------------------------------ resolving rates

const appliedAt = (period: RatePeriod) => period.confirmed_at ?? period.created_at;

/** Latest first: what a person confirmed, else what was written, else the newer row. */
const byLatest = (a: RatePeriod, b: RatePeriod) =>
  appliedAt(b).localeCompare(appliedAt(a)) || b.id - a.id;

/**
 * The rate that covered one job on one day.
 *
 * Every filter here is on the period itself, never on "the newest period we
 * have": a rate agreed today for this week cannot change what last month's
 * invoice was priced at, because last month's date is not inside it. Where two
 * periods genuinely overlap — a correction agreed after the fact — the one
 * settled last wins, and the one it replaced is still on file.
 */
export function resolveRate(
  periods: RatePeriod[],
  customerId: number,
  jobKey: string,
  kind: RateKind,
  date: string,
): RatePeriod | null {
  if (!isIsoDate(date)) return null;
  const covering = periods.filter(
    (period) =>
      period.customer_profile_id === customerId &&
      period.job_key === jobKey &&
      period.kind === kind &&
      period.superseded_by === null &&
      period.effective_from <= date &&
      (period.effective_to === null || date <= period.effective_to),
  );
  return covering.length ? [...covering].sort(byLatest)[0] : null;
}

/** The last rate agreed for a job, whatever days it covered. For comparisons only. */
function latestPeriod(
  periods: RatePeriod[],
  customerId: number,
  jobKey: string,
  kind: RateKind,
): RatePeriod | null {
  const known = periods.filter(
    (period) =>
      period.customer_profile_id === customerId &&
      period.job_key === jobKey &&
      period.kind === kind &&
      period.superseded_by === null &&
      period.value !== null,
  );
  return known.length ? [...known].sort(byLatest)[0] : null;
}

// ------------------------------------------------------------- jobs worked

/** A job a customer's loads went to over a period, and how much of it there was. */
export type JobWork = {
  customer_profile_id: number;
  job_key: string;
  job_label: string;
  ticket_ids: number[];
  ticket_count: number;
  first_date: string;
  last_date: string;
};

/** Why a saved ticket could not be counted into a job. */
export type ExcludedJobRecord = {
  record: SavedRecord;
  reason: 'no_date' | 'no_customer' | 'no_job';
};

function placeRecords(
  records: SavedRecord[],
  customers: CustomerProfile[],
  from: string,
  to: string,
): { jobs: JobWork[]; excluded: ExcludedJobRecord[] } {
  const groups = new Map<string, JobWork>();
  const excluded: ExcludedJobRecord[] = [];
  for (const record of records) {
    const date = ticketDay(record.ticket.ticket_date);
    if (!date) {
      excluded.push({ record, reason: 'no_date' });
      continue;
    }
    if (date < from || date > to) continue;
    const customerId = customerIdFor(record, customers);
    if (customerId === null) {
      excluded.push({ record, reason: 'no_customer' });
      continue;
    }
    const jobKey = jobKeyOf(record.ticket.project_address);
    if (!jobKey) {
      excluded.push({ record, reason: 'no_job' });
      continue;
    }
    const key = `${customerId}|${jobKey}`;
    const job = groups.get(key);
    if (!job) {
      groups.set(key, {
        customer_profile_id: customerId,
        job_key: jobKey,
        job_label: jobLabelOf(record.ticket),
        ticket_ids: [record.id],
        ticket_count: 1,
        first_date: date,
        last_date: date,
      });
      continue;
    }
    job.ticket_ids.push(record.id);
    job.ticket_count += 1;
    if (date < job.first_date) job.first_date = date;
    if (date > job.last_date) job.last_date = date;
  }
  const jobs = [...groups.values()]
    .map((job) => ({ ...job, ticket_ids: [...job.ticket_ids].sort((a, b) => a - b) }))
    .sort(
      (a, b) =>
        a.customer_profile_id - b.customer_profile_id ||
        b.ticket_count - a.ticket_count ||
        a.job_label.localeCompare(b.job_label),
    );
  return { jobs, excluded };
}

/**
 * The jobs a customer's tickets went to over a period, busiest first.
 *
 * The job's label is taken from the first ticket that named it, and the key
 * from the delivery address, so a project renamed halfway through is still one
 * job. A ticket with no customer, no readable date or no delivery address is
 * not counted here — see `excludedFromJobs`, which says which and why rather
 * than letting the work quietly go unbilled.
 */
export function jobsWorked(
  records: SavedRecord[],
  customers: CustomerProfile[],
  from: string,
  to: string,
): JobWork[] {
  return placeRecords(records, customers, from, to).jobs;
}

/** The tickets `jobsWorked` could not place, so a screen can say so. */
export function excludedFromJobs(
  records: SavedRecord[],
  customers: CustomerProfile[],
  from: string,
  to: string,
): ExcludedJobRecord[] {
  return placeRecords(records, customers, from, to).excluded;
}

// --------------------------------------------------------- what is missing

/** A field that may be missing for a job: the hauling rate or the fuel surcharge. */
export type MissingField = RateKind;

export type JobNeeds = JobWork & {
  base: RatePeriod | null;
  fuel: RatePeriod | null;
  missing: MissingField[];
  /** Fields the customer profile already answers through its site rates. */
  known_from_site: MissingField[];
};

/**
 * Which jobs are short a rate, and which of the two they are short.
 *
 * A field is known three ways: a rate period covering the last day worked, a
 * fuel answer of INCLUDED or NONE (an answer, not a gap), or a figure already
 * on the customer's site rate in Customers. The third matters — that data was
 * entered by hand, it is what the tickets are being billed at today, and
 * emailing a customer to ask for a rate the office already typed in is exactly
 * the kind of thing that stops people trusting an agent.
 */
export function missingRates(
  records: SavedRecord[],
  customers: CustomerProfile[],
  periods: RatePeriod[],
  from: string,
  to: string,
): JobNeeds[] {
  return jobsWorked(records, customers, from, to).map((job) => {
    const customer = customers.find(({ id }) => id === job.customer_profile_id);
    const site = locationRateFor(customer, job.job_key);
    const base = resolveRate(periods, job.customer_profile_id, job.job_key, 'base', job.last_date);
    const fuel = resolveRate(periods, job.customer_profile_id, job.job_key, 'fuel', job.last_date);
    const missing: MissingField[] = [];
    const knownFromSite: MissingField[] = [];
    if (!base) {
      if (site && site.flat_rate !== null) knownFromSite.push('base');
      else missing.push('base');
    }
    if (!fuel) {
      if (site && site.fuel_charge !== null) knownFromSite.push('fuel');
      else missing.push('fuel');
    }
    return { ...job, base, fuel, missing, known_from_site: knownFromSite };
  });
}

// ------------------------------------------------------------------ requests

export type RequestItem = {
  job_key: string;
  job_label: string;
  fields: MissingField[];
  ticket_count: number;
};

export type RequestPlan = {
  customer_profile_id: number;
  period_from: string;
  period_to: string;
  items: RequestItem[];
};

/** Fields in a fixed order, so two plans for the same gap read the same. */
const orderFields = (fields: MissingField[]): MissingField[] =>
  RATE_KINDS.filter((kind) => fields.includes(kind));

/**
 * One request per customer with something outstanding, busiest job first.
 *
 * A customer with nothing missing gets no request at all: the week's silence
 * is the point — an agent that mails everybody every Monday is a mailing list,
 * not an assistant.
 */
export function planRequests(needs: JobNeeds[], from: string, to: string): RequestPlan[] {
  const plans = new Map<number, RequestPlan>();
  for (const need of needs) {
    if (!need.missing.length) continue;
    const plan = plans.get(need.customer_profile_id) ?? {
      customer_profile_id: need.customer_profile_id,
      period_from: from,
      period_to: to,
      items: [],
    };
    plan.items.push({
      job_key: need.job_key,
      job_label: need.job_label,
      fields: orderFields(need.missing),
      ticket_count: need.ticket_count,
    });
    plans.set(need.customer_profile_id, plan);
  }
  return [...plans.values()]
    .map((plan) => ({
      ...plan,
      items: [...plan.items].sort(
        (a, b) => b.ticket_count - a.ticket_count || a.job_label.localeCompare(b.job_label),
      ),
    }))
    .sort((a, b) => a.customer_profile_id - b.customer_profile_id);
}

// ------------------------------------------------------- the customer's habits

/**
 * An alias a customer has been seen to use for one of its jobs — "Markham" for
 * MARKHAM ROAD PROJECT. Learned only from a match that was certain or that a
 * person confirmed, so a guess can never teach itself.
 */
export type JobAlias = {
  alias: string;
  job_key: string;
  source: 'confirmed_match' | 'manual';
  confirmed_at: string;
};

/**
 * How one customer is asked, and what its answers usually look like.
 *
 * These are habits, not rules: they set what is asked for and when, and they
 * are used to read a bare number ("11") as the thing this customer usually
 * means. Every one of them can be overridden by what a reply actually says.
 */
export type CustomerRateProfile = {
  billing_cycle: 'weekly' | 'biweekly' | 'monthly';
  /** 0 Sunday … 6 Saturday: the day a billing period begins. */
  period_start_day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** The day of the week the request goes out. */
  request_day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  typical_rate_type: BaseRateType;
  base_behavior: 'fixed_per_project' | 'varies';
  fuel_behavior: 'weekly' | 'fixed' | 'none';
  request_base: 'when_missing' | 'always';
  request_fuel: 'weekly' | 'when_missing';
  auto_create: boolean;
  send_mode: 'DRAFT_ONLY' | 'APPROVAL_REQUIRED' | 'AUTO_SEND';
  follow_up_days: number;
  aliases: JobAlias[];
};

/** Who is asked. A customer may have several; one of them is the one to write to. */
export type RateContact = {
  name: string;
  email: string;
  title: string;
  primary: boolean;
  cc: string[];
  notes: string;
};

/**
 * What a customer is assumed to want before anybody says otherwise: a Monday
 * week asked for on Monday, per-ton hauling, a rate fixed for the project and
 * a fuel surcharge that moves weekly — and a draft, never a sent email, until
 * somebody chooses otherwise.
 */
export const DEFAULT_RATE_PROFILE: CustomerRateProfile = {
  billing_cycle: 'weekly',
  period_start_day: 1,
  request_day: 1,
  typical_rate_type: 'PER_TON',
  base_behavior: 'fixed_per_project',
  fuel_behavior: 'weekly',
  request_base: 'when_missing',
  request_fuel: 'weekly',
  auto_create: true,
  send_mode: 'DRAFT_ONLY',
  follow_up_days: 2,
  aliases: [],
};

/** The Monday of ISO week 1: the week that contains 4 January. */
function isoWeekOneMonday(year: number): string {
  const fourth = `${String(year).padStart(4, '0')}-01-04`;
  return addDays(fourth, -((weekdayOf(fourth) + 6) % 7));
}

/**
 * The billing period to ask about: the most recent complete one before `now`.
 *
 * Complete is the point. A week is asked about once it is over, so the answer
 * covers days that are done and the invoice for them can be finished. Weekly
 * periods run from the customer's own start day; biweekly ones sit on a
 * fortnight grid anchored to the Monday of ISO week 1, so the fortnights of a
 * year never drift; monthly is the previous calendar month.
 */
export function billingPeriodFor(
  profile: CustomerRateProfile | undefined,
  now: Date,
): { from: string; to: string } {
  const settings = profile ?? DEFAULT_RATE_PROFILE;
  const today = localIso(now);
  if (settings.billing_cycle === 'monthly') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const first = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0);
    return { from: localIso(first), to: localIso(last) };
  }
  if (settings.billing_cycle === 'biweekly') {
    const year = Number(today.slice(0, 4));
    let anchor = isoWeekOneMonday(year);
    if (today < anchor) anchor = isoWeekOneMonday(year - 1);
    const current = addDays(anchor, Math.floor(daysBetween(anchor, today) / 14) * 14);
    const from = addDays(current, -14);
    return { from, to: addDays(from, 13) };
  }
  const back = (weekdayOf(today) - settings.period_start_day + 7) % 7;
  const from = addDays(today, -back - 7);
  return { from, to: addDays(from, 6) };
}

/** When a request that has gone unanswered is due to be chased. */
export function followUpDueAt(sentAt: string, days: number): string {
  const sent = Date.parse(sentAt);
  if (Number.isNaN(sent)) return sentAt;
  return new Date(sent + Math.max(0, Math.round(days)) * DAY_MS).toISOString();
}

// ------------------------------------------------------------------- wording

const firstNameOf = (name: string) => name.trim().split(/\s+/)[0] ?? '';

const itemWords = (fields: MissingField[]) => {
  const base = fields.includes('base');
  const fuel = fields.includes('fuel');
  if (base && fuel) return 'hauling rate + fuel surcharge';
  if (fuel) return 'fuel surcharge only';
  return 'hauling rate only';
};

/**
 * The email that asks for the week's rates.
 *
 * Plain, fixed wording, worked out from the plan alone — no model is asked to
 * write to a customer. The same gap produces the same words every week, which
 * is what makes the reply easy to read back and the whole exchange easy to
 * trust. A person may edit any of it before it goes.
 */
export function requestWording(
  plan: RequestPlan,
  customer: CustomerProfile,
  contact: RateContact | null,
  periodLabel: string,
): { subject: string; body: string } {
  const name = firstNameOf(contact?.name ?? '') || customer.name.trim() || 'there';
  const subject = `Rates & Fuel Surcharge — ${periodLabel}`;
  if (!plan.items.length) {
    return {
      subject,
      body: `Hi ${name},\n\nCould you please confirm the hauling rates and applicable fuel surcharge for ${periodLabel}?\n\nThank you.`,
    };
  }
  const lines = plan.items
    .map((item) => `• ${item.job_label} — ${itemWords(item.fields)}`)
    .join('\n');
  return {
    subject,
    body: `Hi ${name},\n\nCould you please send the hauling rates and applicable fuel surcharge for:\n\n${lines}\n\nThank you.`,
  };
}

// ------------------------------------------------------------------- pricing

/** The quantities a line can be charged on. Null is "not known yet", not zero. */
export type PricingInput = {
  tons: number | null;
  loads: number;
  hours: number | null;
  miles: number | null;
  days: number;
};

export type PricedLine = {
  base_amount: number | null;
  fuel_amount: number | null;
  total: number | null;
  /** Why this line has no total, in words for a person; null when it has one. */
  unpriced: string | null;
};

const CUSTOM_BY_HAND = 'custom pricing is entered by hand';

/** How many units of a base rate the quantities come to, or why they do not. */
function baseQuantity(type: BaseRateType, input: PricingInput): number | string {
  switch (type) {
    case 'PER_TON':
      return input.tons ?? 'the net tons are not known';
    case 'PER_LOAD':
      return input.loads;
    case 'PER_HOUR':
      return input.hours ?? 'the hours are not known';
    case 'PER_MILE':
      return input.miles ?? 'the miles are not known';
    case 'PER_DAY':
      return input.days;
    case 'FLAT_RATE':
      return 1;
    case 'CUSTOM':
      return CUSTOM_BY_HAND;
  }
}

/**
 * What a line comes to: rate times quantity, then fuel on top, rounded to
 * cents at each step exactly as the invoice does it (22.4 tons at $8.75 is
 * $196.00; 11% fuel is $21.56; the line is $217.56).
 *
 * A quantity that is not known does not become zero — the line is returned
 * unpriced with the reason, and stays a draft until the weight or the hours
 * are entered. No fuel rate at all is charged as no fuel; whether a fuel rate
 * is still owed is a question for `missingRates`, not for the arithmetic.
 */
export function priceLine(
  base: { rate_type: BaseRateType; value: number } | null,
  fuel: { fuel_type: FuelRateType; value: number | null } | null,
  input: PricingInput,
): PricedLine {
  if (!base) return { base_amount: null, fuel_amount: null, total: null, unpriced: 'no base rate' };
  const quantity = baseQuantity(base.rate_type, input);
  if (typeof quantity === 'string') {
    return { base_amount: null, fuel_amount: null, total: null, unpriced: quantity };
  }
  const baseAmount = round2(base.value * quantity);
  const unpriced = (reason: string): PricedLine => ({
    base_amount: baseAmount,
    fuel_amount: null,
    total: null,
    unpriced: reason,
  });
  let fuelAmount = 0;
  if (fuel) {
    if (fuel.fuel_type === 'CUSTOM') return unpriced(CUSTOM_BY_HAND);
    if (fuel.fuel_type !== 'INCLUDED' && fuel.fuel_type !== 'NONE') {
      if (fuel.value === null) return unpriced('the fuel rate has no amount');
      switch (fuel.fuel_type) {
        case 'PERCENTAGE':
          fuelAmount = round2((baseAmount * fuel.value) / 100);
          break;
        case 'PER_TON':
          if (input.tons === null) return unpriced('the net tons are not known');
          fuelAmount = round2(input.tons * fuel.value);
          break;
        case 'PER_LOAD':
          fuelAmount = round2(input.loads * fuel.value);
          break;
        case 'PER_MILE':
          if (input.miles === null) return unpriced('the miles are not known');
          fuelAmount = round2(input.miles * fuel.value);
          break;
        case 'FIXED_AMOUNT':
          fuelAmount = round2(fuel.value);
          break;
      }
    }
  }
  return {
    base_amount: baseAmount,
    fuel_amount: fuelAmount,
    total: round2(baseAmount + fuelAmount),
    unpriced: null,
  };
}

// ------------------------------------------------------- onto a ticket line

/** The rate fields of a ticket, as types.ts carries them. */
export type TicketPricing = {
  rate: number;
  rate_type: RateType;
  fuel_charge: number | null;
  fuel_type: FuelType;
};

/** Where a ticket's pricing came from, kept on the saved record. */
export type RecordPricing = {
  base_period_id: number | null;
  fuel_period_id: number | null;
  applied_at: string;
  /** Set when the agreed rate could not be carried onto the ticket. */
  unsupported: string | null;
};

const BASE_TO_TICKET: Partial<Record<BaseRateType, RateType>> = {
  PER_TON: 'per_ton',
  PER_LOAD: 'flat',
  FLAT_RATE: 'flat',
  PER_HOUR: 'hourly',
};

/**
 * The agreed rate written onto a ticket's own fields, so the invoice engine,
 * the ledger export and the printed sheet all keep working off one set of
 * figures rather than a second pricing path nobody can see.
 *
 * A ticket can carry three rate shapes and two fuel shapes; a customer can
 * agree to more than that. Where the two do not meet — a per-mile rate, a
 * per-day rate, custom pricing — the rate is still on file and this says
 * plainly that the ticket cannot hold it, rather than quietly rounding a
 * per-mile rate into a flat one.
 *
 * The two sides are settled apart from each other, because they arrive apart.
 * A job whose hauling rate came from the customer's site rate — already on the
 * ticket — is asked only for its fuel surcharge, and the week's 11% has to be
 * able to land on a ticket that has a rate but no period behind it. So each
 * side takes the period when one covers the day and the ticket's own figure
 * when none does; only a ticket with neither a base period nor a rate of its
 * own has nothing to be billed at.
 */
export function toTicketPricing(
  base: RatePeriod | null,
  fuel: RatePeriod | null,
  ticket: Ticket,
): { pricing: TicketPricing } | { unsupported: string } {
  let pricing: TicketPricing;
  if (base) {
    if (base.rate_type === null || base.value === null) {
      return { unsupported: 'the base rate has no amount' };
    }
    const rateType = BASE_TO_TICKET[base.rate_type];
    if (!rateType) {
      return {
        unsupported:
          base.rate_type === 'CUSTOM'
            ? CUSTOM_BY_HAND
            : `a ${base.rate_type} rate cannot be billed on a ticket yet`,
      };
    }
    pricing = { rate: base.value, rate_type: rateType, fuel_charge: null, fuel_type: 'flat' };
  } else if (ticket.rate !== null) {
    // No period covers this job: the rate the ticket is already billed at
    // stands, and only the fuel side is being settled.
    pricing = { rate: ticket.rate, rate_type: rateTypeOf(ticket), fuel_charge: null, fuel_type: 'flat' };
  } else {
    return { unsupported: 'no base rate' };
  }
  if (!fuel) {
    // Likewise the other way: a fuel figure entered by hand or taken from the
    // customer's site rate is not wiped out by a base rate arriving.
    return {
      pricing: { ...pricing, fuel_charge: ticket.fuel_charge, fuel_type: fuelTypeOf(ticket) },
    };
  }
  if (fuel.fuel_type === null || fuel.fuel_type === 'INCLUDED' || fuel.fuel_type === 'NONE') {
    // "Fuel is in the rate" is an answer, and it overrides what was there.
    return { pricing };
  }
  if (fuel.fuel_type === 'CUSTOM' || fuel.fuel_type === 'PER_MILE') {
    return {
      unsupported:
        fuel.fuel_type === 'CUSTOM'
          ? CUSTOM_BY_HAND
          : 'a PER_MILE fuel surcharge cannot be billed on a ticket yet',
    };
  }
  if (fuel.value === null) return { unsupported: 'the fuel rate has no amount' };
  if (fuel.fuel_type === 'PERCENTAGE') {
    return { pricing: { ...pricing, fuel_charge: fuel.value, fuel_type: 'percent' } };
  }
  if (fuel.fuel_type === 'FIXED_AMOUNT' || fuel.fuel_type === 'PER_LOAD') {
    // One ticket is one load, so a per-load surcharge is the amount itself.
    return { pricing: { ...pricing, fuel_charge: round2(fuel.value), fuel_type: 'flat' } };
  }
  const tons = ticketTons(ticket);
  if (tons === null) return { unsupported: 'the net tons are not known' };
  return { pricing: { ...pricing, fuel_charge: round2(tons * fuel.value), fuel_type: 'flat' } };
}

// --------------------------------------------------------- invoice readiness

export type ReadinessStep = 'ok' | 'waiting' | 'n/a';

export type InvoiceReadiness = {
  tickets: ReadinessStep;
  base: ReadinessStep;
  fuel: ReadinessStep;
  status: 'READY' | 'WAITING_FOR_RATE' | 'WAITING_FOR_FUEL' | 'NEEDS_REVIEW' | 'FINALIZED';
  waiting_jobs: { job_key: string; job_label: string; missing: MissingField[] }[];
};

/**
 * What an invoice is still waiting for, in the three steps a person thinks in:
 * are the tickets in, is the hauling rate agreed, is the fuel surcharge agreed.
 *
 * A line counts as rated when it already carries a figure, when a rate period
 * covers the day it was hauled, or when the customer's site rate answers it —
 * the three places a price legitimately comes from. A finalized invoice is
 * never recalculated: it says FINALIZED and nothing else is asked of it.
 */
export function invoiceReadiness(
  group: InvoiceGroup,
  customers: CustomerProfile[],
  periods: RatePeriod[],
  locked: boolean,
): InvoiceReadiness {
  if (locked) {
    return { tickets: 'ok', base: 'ok', fuel: 'ok', status: 'FINALIZED', waiting_jobs: [] };
  }
  if (!group.records.length) {
    return { tickets: 'waiting', base: 'n/a', fuel: 'n/a', status: 'WAITING_FOR_RATE', waiting_jobs: [] };
  }
  const waiting = new Map<string, { job_key: string; job_label: string; missing: MissingField[] }>();
  const note = (record: SavedRecord, field: MissingField) => {
    const key = jobKeyOf(record.ticket.project_address);
    const entry = waiting.get(key) ?? {
      job_key: key,
      job_label: jobLabelOf(record.ticket),
      missing: [] as MissingField[],
    };
    if (!entry.missing.includes(field)) entry.missing.push(field);
    waiting.set(key, entry);
  };
  let baseWaiting = false;
  let fuelWaiting = false;
  let fuelCharged = false;
  for (const record of group.records) {
    const customerId = customerIdFor(record, customers);
    const customer = customers.find(({ id }) => id === customerId);
    const jobKey = jobKeyOf(record.ticket.project_address);
    const date = ticketDay(record.ticket.ticket_date) ?? group.lastTicketDate ?? '';
    const site = locationRateFor(customer, jobKey);
    const base =
      customerId === null ? null : resolveRate(periods, customerId, jobKey, 'base', date);
    const fuel =
      customerId === null ? null : resolveRate(periods, customerId, jobKey, 'fuel', date);
    if (record.ticket.rate === null && !base && !(site && site.flat_rate !== null)) {
      baseWaiting = true;
      note(record, 'base');
    }
    const fuelAnswered =
      fuel !== null && (fuel.fuel_type === 'NONE' || fuel.fuel_type === 'INCLUDED');
    if (record.ticket.fuel_charge === null && !fuel && !(site && site.fuel_charge !== null)) {
      fuelWaiting = true;
      note(record, 'fuel');
    } else if (!fuelAnswered) {
      fuelCharged = true;
    }
  }
  const status = group.needsConfirmation
    ? 'NEEDS_REVIEW'
    : baseWaiting
      ? 'WAITING_FOR_RATE'
      : fuelWaiting
        ? 'WAITING_FOR_FUEL'
        : 'READY';
  return {
    tickets: 'ok',
    base: baseWaiting ? 'waiting' : 'ok',
    // Nothing is waiting and nothing is charged: this invoice has no fuel on it.
    fuel: fuelWaiting ? 'waiting' : fuelCharged ? 'ok' : 'n/a',
    status,
    waiting_jobs: [...waiting.values()].map((entry) => ({
      ...entry,
      missing: orderFields(entry.missing),
    })),
  };
}

// ------------------------------------------------------------ reading a reply

/**
 * One figure as the AI read it out of a reply: the words it came from, what it
 * took them to mean, and nothing decided. The raw text is kept beside the
 * interpretation on purpose — everything downstream is checked against it, and
 * a person confirming a match is shown the sentence, not the model's summary
 * of the sentence.
 */
export type ParsedRateLine = {
  raw_text: string;
  job_text: string | null;
  field: 'base' | 'fuel' | 'both' | 'unknown';
  extracted_value: string | null;
  interpreted_value: number | null;
  unit: RateUnit;
  validity_hint: 'period' | 'project_duration' | null;
  note: string | null;
};

/** What a read line was found to be, and whether it may be applied unattended. */
export type RateMatch = {
  line_index: number;
  job_key: string | null;
  job_label: string | null;
  field: RateKind;
  value: number | null;
  unit: RateUnit;
  confidence: number;
  evidence: string[];
  anomaly: Anomaly | null;
  status: 'auto' | 'confirm' | 'reject';
  reason: string | null;
  /** Carried from the line, so `periodsFromMatches` can honour "for the project". */
  validity_hint?: 'period' | 'project_duration' | null;
};

export type Anomaly = {
  kind: 'base_change' | 'fuel_out_of_range' | 'unit_mismatch';
  detail: string;
  previous: number | null;
  received: number;
};

export type AnomalyThresholds = {
  base_change_ratio: number;
  fuel_percent_min: number;
  fuel_percent_max: number;
  fuel_change_ratio: number;
};

/**
 * What counts as too big a change to apply unattended: a hauling rate three
 * times what was agreed (a dropped decimal point — $87.50 where $8.75 was
 * meant), or a fuel surcharge outside the nought-to-twenty-five per cent that
 * real surcharges live in.
 */
export const DEFAULT_THRESHOLDS: AnomalyThresholds = {
  base_change_ratio: 3,
  fuel_percent_min: 0,
  fuel_percent_max: 25,
  fuel_change_ratio: 3,
};

/** At or above `auto` a match may be applied unattended; below `confirm` it is a guess. */
export const CONFIDENCE = { auto: 0.9, confirm: 0.5 } as const;

/**
 * Whether a figure is far enough from what is on file to be worth a person's
 * eye. This is the deterministic half of the agent: the model may be as
 * confident as it likes about $87.50 a ton, and this still stops it.
 */
export function detectAnomaly(
  match: Pick<RateMatch, 'field' | 'value' | 'unit' | 'job_key'>,
  customerId: number,
  history: RatePeriod[],
  thresholds: AnomalyThresholds = DEFAULT_THRESHOLDS,
): Anomaly | null {
  const received = match.value;
  if (received === null || match.job_key === null) return null;
  const prior = latestPeriod(history, customerId, match.job_key, match.field);
  const previous = prior?.value ?? null;
  if (match.field === 'base') {
    if (previous === null || previous <= 0 || received <= 0) return null;
    const ratio = received / previous;
    if (ratio < thresholds.base_change_ratio && ratio > 1 / thresholds.base_change_ratio) {
      return null;
    }
    return {
      kind: 'base_change',
      detail:
        ratio >= 1
          ? `${money(received)} is ${round1(ratio)}× the ${money(previous)} last agreed for this job.`
          : `${money(received)} is well below the ${money(previous)} last agreed for this job.`,
      previous,
      received,
    };
  }
  if (match.unit === 'PERCENTAGE') {
    if (received < thresholds.fuel_percent_min || received > thresholds.fuel_percent_max) {
      return {
        kind: 'fuel_out_of_range',
        detail: `${received}% is outside the ${thresholds.fuel_percent_min}–${thresholds.fuel_percent_max}% a fuel surcharge normally falls in.`,
        previous,
        received,
      };
    }
  } else if (prior && prior.fuel_type !== null && prior.fuel_type !== match.unit) {
    return {
      kind: 'unit_mismatch',
      detail: `The reply gives fuel as ${match.unit}; the surcharge on file for this job is ${prior.fuel_type}.`,
      previous,
      received,
    };
  }
  if (previous === null || previous <= 0 || received <= 0) return null;
  if (prior && prior.fuel_type !== match.unit) return null;
  const ratio = received / previous;
  if (ratio < thresholds.fuel_change_ratio && ratio > 1 / thresholds.fuel_change_ratio) return null;
  return {
    kind: 'fuel_out_of_range',
    detail: `${received} is a long way from the ${previous} last agreed for this job.`,
    previous,
    received,
  };
}

// ------------------------------------------------------------- matching lines

const tokensOf = (value: string) => normalizeName(value).split(' ').filter(Boolean);

type JobHit = { job_key: string | null; job_label: string | null; confidence: number; evidence: string[] };

/**
 * Which job a line is about. Four ways, tried in order of how much they prove:
 * the customer wrote the job's name, the customer wrote a name we have already
 * confirmed means that job, the reply is a bare list in the order we asked, or
 * a word of the name picks out exactly one job. Anything else is a question.
 */
function matchJob(
  line: ParsedRateLine,
  plan: { items: RequestItem[] } | null,
  jobs: JobRef[],
  profile: CustomerRateProfile,
): JobHit {
  const text = (line.job_text ?? '').trim();
  const wanted = normalizeName(text);
  if (!wanted) {
    return { job_key: null, job_label: null, confidence: 0.4, evidence: ['the reply did not name a job'] };
  }
  const exact = jobs.find((job) => normalizeName(job.job_label) === wanted || job.job_key === wanted);
  if (exact) {
    return {
      job_key: exact.job_key,
      job_label: exact.job_label,
      confidence: 0.98,
      evidence: [`"${text}" is the job's name`],
    };
  }
  const alias = profile.aliases.find((known) => normalizeName(known.alias) === wanted);
  if (alias) {
    const job = jobs.find((known) => known.job_key === alias.job_key);
    return {
      job_key: alias.job_key,
      job_label: job?.job_label ?? null,
      confidence: 0.95,
      evidence: [`"${text}" is a confirmed name for this job`],
    };
  }
  const needle = tokensOf(text);
  const contained = jobs.filter((job) => {
    const label = tokensOf(job.job_label);
    return needle.length > 0 && needle.every((token) => label.includes(token));
  });
  if (contained.length === 1) {
    const job = contained[0];
    const asked = plan?.items.some((item) => item.job_key === job.job_key) ?? false;
    return {
      job_key: job.job_key,
      job_label: job.job_label,
      confidence: asked ? 0.95 : 0.85,
      evidence: [
        `"${text}" appears in "${job.job_label}"`,
        ...(asked ? ['this job was one of the jobs asked about'] : []),
      ],
    };
  }
  if (contained.length > 1) {
    return {
      job_key: null,
      job_label: null,
      confidence: 0.4,
      evidence: [`"${text}" fits ${contained.map((job) => `"${job.job_label}"`).join(' and ')}`],
    };
  }
  return {
    job_key: null,
    job_label: null,
    confidence: 0.4,
    evidence: [`"${text}" does not name a job worked in this period`],
  };
}

const PERCENT_IN_TEXT = /(\d+(?:\.\d+)?)\s*%/g;
const DOLLARS_IN_TEXT = /\$\s*(\d+(?:\.\d+)?)/g;

type UnitChoice = { unit: RateUnit; confidence: number; evidence: string[] };
type Reading = UnitChoice & { value: number | null };

/**
 * The fuel figure inside a line that gave both — "159th is $9.25/ton and 10%
 * fuel". Read off the raw text rather than the model's single value, since the
 * sentence is what the customer actually wrote.
 */
function secondFuelReading(line: ParsedRateLine, baseValue: number | null): Reading {
  const mentionsFuel = /fuel/i.test(line.raw_text);
  const percents = [...line.raw_text.matchAll(PERCENT_IN_TEXT)].map((match) => Number(match[1]));
  const percent = percents.find((value) => value !== baseValue);
  if (percent !== undefined) {
    return {
      value: percent,
      unit: 'PERCENTAGE',
      confidence: mentionsFuel ? 0.9 : 0.8,
      evidence: [`"${percent}%" read from the line as the fuel surcharge`],
    };
  }
  const amounts = [...line.raw_text.matchAll(DOLLARS_IN_TEXT)].map((match) => Number(match[1]));
  const amount = amounts.find((value) => value !== baseValue);
  if (amount !== undefined && mentionsFuel) {
    return {
      value: amount,
      unit: 'FIXED_AMOUNT',
      confidence: 0.8,
      evidence: [`"${money(amount)}" read from the line as the fuel surcharge`],
    };
  }
  return {
    value: null,
    unit: 'UNKNOWN',
    confidence: 0.3,
    evidence: ['the line mentions fuel but gives no figure for it'],
  };
}

/** The unit a figure is in: what the reply said, else what this customer usually means. */
function resolveUnit(field: RateKind, stated: RateUnit, profile: CustomerRateProfile): UnitChoice {
  if (field === 'base') {
    if (isBaseRateType(stated)) return { unit: stated, confidence: 1, evidence: [] };
    const fallback = profile.typical_rate_type;
    return {
      unit: fallback,
      confidence: stated === 'UNKNOWN' ? 0.8 : 0.5,
      evidence: [
        stated === 'UNKNOWN'
          ? `the reply did not give a unit; read as this customer's usual ${fallback}`
          : `${stated} is not a hauling-rate unit; read as this customer's usual ${fallback}`,
      ],
    };
  }
  if (isFuelRateType(stated)) return { unit: stated, confidence: 1, evidence: [] };
  if (stated === 'UNKNOWN' && profile.fuel_behavior === 'weekly') {
    return {
      unit: 'PERCENTAGE',
      confidence: 0.85,
      evidence: ['the reply gave a bare number; this customer quotes fuel weekly as a percentage'],
    };
  }
  return {
    unit: 'UNKNOWN',
    confidence: 0.4,
    evidence: [
      stated === 'UNKNOWN'
        ? 'the reply did not say what the fuel figure is in'
        : `${stated} is not a fuel-surcharge unit`,
    ],
  };
}

/** Which of the two things a line is about; a line that says both is two matches. */
function fieldsOf(line: ParsedRateLine): RateKind[] {
  if (line.field === 'both') return ['base', 'fuel'];
  if (line.field === 'base' || line.field === 'fuel') return [line.field];
  const fuelOnly: RateUnit[] = ['PERCENTAGE', 'FIXED_AMOUNT', 'INCLUDED', 'NONE'];
  return [fuelOnly.includes(line.unit) ? 'fuel' : 'base'];
}

/**
 * What the read lines mean, against the jobs actually worked and the rates
 * already on file.
 *
 * Deterministic from end to end: the same lines, jobs and history always give
 * the same matches with the same confidence. Confidence is the weakest link of
 * the three things a match needs — which job, which unit, which figure — so a
 * certain number read for an uncertain job is an uncertain match. Only a match
 * that is certain of all three, and that no rule finds strange, is marked
 * 'auto'; everything else is a question for a person, which is the whole
 * bargain of letting an agent read the post.
 */
export function matchLines(
  lines: ParsedRateLine[],
  plan: { items: RequestItem[] } | null,
  jobs: JobRef[],
  profile: CustomerRateProfile,
  history: RatePeriod[],
  thresholds: AnomalyThresholds = DEFAULT_THRESHOLDS,
): RateMatch[] {
  const named = lines.some((line) => (line.job_text ?? '').trim());
  // "8.75 / 9.25 / fuel 11": as many figures as jobs asked about, in that
  // order, and not one of them named. It is almost certainly the answer in
  // order — but almost is not enough to apply it unattended.
  const inOrder =
    !named && plan !== null && plan.items.length > 0 && plan.items.length === lines.length;
  const orderedItems = inOrder && plan ? plan.items : null;
  // The history is one customer's, so the customer of a job is whoever the
  // rates on file for it belong to; a job with no history has nothing to be
  // out of line with.
  const customerOf = (jobKey: string | null) =>
    history.find((period) => period.job_key === jobKey)?.customer_profile_id ?? 0;
  const matches: RateMatch[] = [];
  lines.forEach((line, index) => {
    const item = orderedItems?.[index];
    const job: JobHit = item
      ? {
          job_key: item.job_key,
          job_label: jobs.find((known) => known.job_key === item.job_key)?.job_label ?? item.job_label,
          confidence: 0.6,
          evidence: ['no job was named; read in the order the jobs were asked about'],
        }
      : matchJob(line, plan, jobs, profile);
    const fields = fieldsOf(line);
    for (const field of fields) {
      const reading: Reading =
        field === 'fuel' && line.field === 'both'
          ? secondFuelReading(line, line.interpreted_value)
          : {
              value: line.interpreted_value,
              unit: line.unit,
              confidence: line.field === 'unknown' ? 0.6 : 1,
              evidence:
                line.field === 'unknown'
                  ? ['the reply did not say whether this is the rate or the fuel surcharge']
                  : [],
            };
      const unit = resolveUnit(field, reading.unit, profile);
      const confidence = round2(
        Math.min(job.confidence, reading.confidence, unit.confidence),
      );
      const partial: Pick<RateMatch, 'field' | 'value' | 'unit' | 'job_key'> = {
        field,
        value: reading.value,
        unit: unit.unit,
        job_key: job.job_key,
      };
      const anomaly = detectAnomaly(partial, customerOf(job.job_key), history, thresholds);
      const status: RateMatch['status'] =
        reading.value === null
          ? 'reject'
          : anomaly
            ? 'confirm'
            : confidence >= CONFIDENCE.auto && job.job_key !== null && unit.unit !== 'UNKNOWN'
              ? 'auto'
              : 'confirm';
      const reason =
        status === 'auto'
          ? null
          : reading.value === null
            ? 'no figure was read from this line'
            : anomaly
              ? anomaly.detail
              : job.job_key === null
                ? 'the job this belongs to is not certain'
                : unit.unit === 'UNKNOWN'
                  ? 'what the figure is charged in is not certain'
                  : confidence < CONFIDENCE.confirm
                    ? 'read with low confidence'
                    : 'read with less confidence than applying it unattended asks for';
      matches.push({
        line_index: index,
        job_key: job.job_key,
        job_label: job.job_label,
        field,
        value: reading.value,
        unit: unit.unit,
        confidence,
        evidence: [...job.evidence, ...reading.evidence, ...unit.evidence],
        anomaly,
        status,
        reason,
        validity_hint: line.validity_hint,
      });
    }
  });
  return matches;
}

// ---------------------------------------------------------- applying matches

/**
 * The periods a set of matches would write.
 *
 * How long each one holds is the whole question. A hauling rate agreed for a
 * project is open-ended, because that is how it was agreed — the customer will
 * not be asked for it again next week, and every later ticket on that job
 * prices from it. A fuel surcharge holds for the period it was given for and
 * no longer, so last week's 11% can never quietly price next week's loads.
 *
 * Matches that are not ready — no figure, no job, no unit, or rejected — are
 * left out. Which statuses to pass is the caller's decision: the unattended
 * path passes only 'auto' matches, and the confirmation screen passes the ones
 * a person has just settled, with `applied_by` 'human'.
 */
export function periodsFromMatches(
  matches: RateMatch[],
  customerId: number,
  period: { from: string; to: string },
  jobs: JobRef[],
  profile: CustomerRateProfile,
  source: RateSource,
  refs: { request_id: number | null; response_id: number | null },
  applied_by: 'auto' | 'human',
  confirmed_by: string | null,
  now: string,
): NewRatePeriod[] {
  const periods: NewRatePeriod[] = [];
  for (const match of matches) {
    if (match.status === 'reject') continue;
    if (match.job_key === null || match.value === null || match.unit === 'UNKNOWN') continue;
    const isBase = match.field === 'base';
    if (isBase ? !isBaseRateType(match.unit) : !isFuelRateType(match.unit)) continue;
    const forProject =
      match.validity_hint === 'project_duration' ||
      (isBase && match.validity_hint !== 'period' && profile.base_behavior === 'fixed_per_project');
    periods.push({
      customer_profile_id: customerId,
      job_key: match.job_key,
      job_label:
        jobs.find((job) => job.job_key === match.job_key)?.job_label ??
        match.job_label ??
        match.job_key,
      kind: match.field,
      effective_from: period.from,
      effective_to: forProject ? null : period.to,
      validity: forProject ? 'PROJECT_DURATION' : 'PERIOD',
      rate_type: isBase && isBaseRateType(match.unit) ? match.unit : null,
      fuel_type: !isBase && isFuelRateType(match.unit) ? match.unit : null,
      value: match.value,
      source,
      source_request_id: refs.request_id,
      source_response_id: refs.response_id,
      confidence: match.confidence,
      applied_by,
      confirmed_by,
      confirmed_at: applied_by === 'human' ? now : null,
      note: match.anomaly?.detail ?? null,
    });
  }
  return periods;
}

/**
 * The names worth remembering — "Markham" for MARKHAM ROAD PROJECT — so the
 * next reply reads at once.
 *
 * Only from matches that were certain or that a person confirmed. A name
 * learned from a guess would make the same guess look certain the next time,
 * which is how a small misreading becomes a rate on the wrong job.
 */
export function aliasesToLearn(
  matches: RateMatch[],
  lines: ParsedRateLine[],
  existing: JobAlias[],
  now: string,
): JobAlias[] {
  const known = new Set(existing.map((alias) => `${normalizeName(alias.alias)}|${alias.job_key}`));
  const learned: JobAlias[] = [];
  for (const match of matches) {
    if (match.job_key === null) continue;
    if (match.status !== 'auto' && match.confidence < 1) continue;
    const alias = (lines[match.line_index]?.job_text ?? '').trim();
    if (!alias) continue;
    const key = `${normalizeName(alias)}|${match.job_key}`;
    if (!normalizeName(alias) || known.has(key)) continue;
    // The job's own name is not an alias for itself.
    if (normalizeName(alias) === normalizeName(match.job_label ?? '')) continue;
    if (normalizeName(alias) === match.job_key) continue;
    known.add(key);
    learned.push({ alias, job_key: match.job_key, source: 'confirmed_match', confirmed_at: now });
  }
  return learned;
}

// ------------------------------------------------------------------ requests

export type RateRequestStatus =
  | 'DRAFT'
  | 'READY_TO_SEND'
  | 'SENT'
  | 'WAITING_FOR_REPLY'
  | 'RESPONSE_RECEIVED'
  | 'AI_PROCESSING'
  | 'NEEDS_CONFIRMATION'
  | 'RESOLVED'
  | 'FOLLOW_UP_DUE'
  | 'CLOSED'
  | 'FAILED';

export const RATE_REQUEST_STATUSES = [
  'DRAFT',
  'READY_TO_SEND',
  'SENT',
  'WAITING_FOR_REPLY',
  'RESPONSE_RECEIVED',
  'AI_PROCESSING',
  'NEEDS_CONFIRMATION',
  'RESOLVED',
  'FOLLOW_UP_DUE',
  'CLOSED',
  'FAILED',
] as const;

export type RateRequest = {
  id: number;
  customer_profile_id: number;
  period_from: string;
  period_to: string;
  status: RateRequestStatus;
  mode: 'DRAFT_ONLY' | 'APPROVAL_REQUIRED' | 'AUTO_SEND';
  recipient: string | null;
  cc: string[];
  subject: string;
  body: string;
  items: RequestItem[];
  /** The job-and-field pairs a reply has already settled. */
  answered: { job_key: string; field: RateKind }[];
  sent_at: string | null;
  reply_at: string | null;
  follow_up_due_at: string | null;
  follow_up_count: number;
  thread_ref: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * What a request is still short of. A customer who answers two of three jobs
 * has answered two of three jobs: the follow-up asks about the third, and
 * never re-asks what was already given.
 */
export function remainingItems(request: RateRequest): RequestItem[] {
  const answered = new Set(request.answered.map((entry) => `${entry.job_key}|${entry.field}`));
  return request.items
    .map((item) => ({
      ...item,
      fields: orderFields(item.fields.filter((field) => !answered.has(`${item.job_key}|${field}`))),
    }))
    .filter((item) => item.fields.length > 0);
}

// ----------------------------------------------------------------- responses

/** A reply as the app holds it, whether it arrived by email or was simulated. */
export type NormalizedMessage = {
  sender: string | null;
  recipients: string[];
  subject: string | null;
  body_text: string;
  body_html: string | null;
  attachments: { name: string; type: string; size: number }[];
  received_at: string;
  external_thread_id: string | null;
};

export type RateResponseStatus =
  | 'received'
  | 'processing'
  | 'needs_confirmation'
  | 'applied'
  | 'rejected'
  | 'duplicate';

export type RateResponse = {
  id: number;
  request_id: number | null;
  customer_profile_id: number;
  source: 'simulated' | 'email';
  message: NormalizedMessage;
  message_hash: string;
  lines: ParsedRateLine[];
  matches: RateMatch[];
  status: RateResponseStatus;
  ai_model: string | null;
  processed_at: string | null;
  created_at: string;
};

/**
 * The fingerprint of a reply, over who sent it, what it was about and what it
 * said. A mailbox that delivers the same message twice must not apply a rate
 * twice, and a person clicking Simulate again must not either.
 */
export const messageHash = (message: NormalizedMessage): string =>
  fnv1a(
    [
      (message.sender ?? '').trim().toLowerCase(),
      (message.subject ?? '').trim().toLowerCase(),
      message.body_text.replace(/\s+/g, ' ').trim(),
    ].join('\u0000'),
  );

// -------------------------------------------------------------------- events

/** Everything the agent did, in the order it did it. Written, never edited. */
export type RateEvent = {
  id: number;
  kind:
    | 'RATE_REQUEST_CREATED'
    | 'RATE_REQUEST_SENT'
    | 'RATE_RESPONSE_RECEIVED'
    | 'RATE_RESPONSE_NEEDS_CONFIRMATION'
    | 'RATE_ANOMALY'
    | 'RATE_PERIOD_APPLIED'
    | 'RATE_PERIOD_CONFIRMED'
    | 'RATE_OVERRIDDEN'
    | 'RATE_FOLLOWUP_DUE'
    | 'INVOICE_READY_AFTER_RATE'
    | 'INVOICE_FINALIZED'
    | 'INVOICE_UNLOCKED'
    | 'PRICING_CONFLICT';
  customer_profile_id: number | null;
  request_id: number | null;
  response_id: number | null;
  period_id: number | null;
  invoice_key: string | null;
  detail: string;
  actor: string | null;
  at: string;
};

/**
 * An invoice that has gone out, with what it said when it did. A rate agreed
 * afterwards changes what is billed next, never what was billed then; the
 * snapshot is what makes that provable rather than merely intended.
 */
export type InvoiceLock = {
  invoice_key: string;
  finalized_at: string;
  finalized_by: string | null;
  snapshot: { total: number; lines: { record_id: number; total: number | null }[] };
  unlocked_at: string | null;
  unlock_reason: string | null;
};

// ------------------------------------------------------------------- readers

const num = (value: unknown): number | null => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};
const str = (value: unknown): string | null => (typeof value === 'string' ? value : null);
const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

/**
 * A database row as a rate period. Numeric columns come over the wire as
 * strings and JSON columns as whatever was stored, so every field is read
 * rather than cast — the same defensiveness as readMileageDay, for the same
 * reason: a rate read wrongly is money.
 */
export function readRatePeriod(row: Record<string, unknown>): RatePeriod {
  return {
    id: num(row.id) ?? 0,
    customer_profile_id: num(row.customer_profile_id) ?? 0,
    job_key: str(row.job_key) ?? '',
    job_label: str(row.job_label) ?? '',
    kind: isRateKind(row.kind) ? row.kind : 'base',
    effective_from: str(row.effective_from) ?? '',
    effective_to: str(row.effective_to),
    validity: isRateValidity(row.validity) ? row.validity : 'PERIOD',
    rate_type: isBaseRateType(row.rate_type) ? row.rate_type : null,
    fuel_type: isFuelRateType(row.fuel_type) ? row.fuel_type : null,
    value: num(row.value),
    source: isRateSource(row.source) ? row.source : 'manual',
    source_request_id: num(row.source_request_id),
    source_response_id: num(row.source_response_id),
    confidence: num(row.confidence),
    applied_by: row.applied_by === 'human' ? 'human' : 'auto',
    confirmed_by: str(row.confirmed_by),
    confirmed_at: str(row.confirmed_at),
    superseded_by: num(row.superseded_by),
    note: str(row.note),
    created_at: str(row.created_at) ?? '',
  };
}

const readRequestItems = (value: unknown): RequestItem[] =>
  (Array.isArray(value) ? value : [])
    .filter(isObject)
    .map((item) => ({
      job_key: str(item.job_key) ?? '',
      job_label: str(item.job_label) ?? '',
      fields: orderFields((Array.isArray(item.fields) ? item.fields : []).filter(isRateKind)),
      ticket_count: num(item.ticket_count) ?? 0,
    }));

export function readRateRequest(row: Record<string, unknown>): RateRequest {
  const status = (RATE_REQUEST_STATUSES as readonly unknown[]).includes(row.status)
    ? (row.status as RateRequestStatus)
    : 'DRAFT';
  const mode =
    row.mode === 'AUTO_SEND' || row.mode === 'APPROVAL_REQUIRED' ? row.mode : 'DRAFT_ONLY';
  return {
    id: num(row.id) ?? 0,
    customer_profile_id: num(row.customer_profile_id) ?? 0,
    period_from: str(row.period_from) ?? '',
    period_to: str(row.period_to) ?? '',
    status,
    mode,
    recipient: str(row.recipient),
    cc: strings(row.cc),
    subject: str(row.subject) ?? '',
    body: str(row.body) ?? '',
    items: readRequestItems(row.items),
    answered: (Array.isArray(row.answered) ? row.answered : [])
      .filter(isObject)
      .filter((entry) => typeof entry.job_key === 'string' && isRateKind(entry.field))
      .map((entry) => ({ job_key: entry.job_key as string, field: entry.field as RateKind })),
    sent_at: str(row.sent_at),
    reply_at: str(row.reply_at),
    follow_up_due_at: str(row.follow_up_due_at),
    follow_up_count: num(row.follow_up_count) ?? 0,
    thread_ref: str(row.thread_ref),
    created_at: str(row.created_at) ?? '',
    updated_at: str(row.updated_at) ?? '',
  };
}

function readMessage(value: unknown): NormalizedMessage {
  const row = isObject(value) ? value : {};
  return {
    sender: str(row.sender),
    recipients: strings(row.recipients),
    subject: str(row.subject),
    body_text: str(row.body_text) ?? '',
    body_html: str(row.body_html),
    attachments: (Array.isArray(row.attachments) ? row.attachments : [])
      .filter(isObject)
      .map((file) => ({
        name: str(file.name) ?? '',
        type: str(file.type) ?? '',
        size: num(file.size) ?? 0,
      })),
    received_at: str(row.received_at) ?? '',
    external_thread_id: str(row.external_thread_id),
  };
}

export function readRateResponse(row: Record<string, unknown>): RateResponse {
  const statuses: RateResponseStatus[] = [
    'received',
    'processing',
    'needs_confirmation',
    'applied',
    'rejected',
    'duplicate',
  ];
  return {
    id: num(row.id) ?? 0,
    request_id: num(row.request_id),
    customer_profile_id: num(row.customer_profile_id) ?? 0,
    source: row.source === 'email' ? 'email' : 'simulated',
    message: readMessage(row.message),
    message_hash: str(row.message_hash) ?? '',
    lines: (Array.isArray(row.lines) ? row.lines : [])
      .filter(isObject)
      .map((line) => ({
        raw_text: str(line.raw_text) ?? '',
        job_text: str(line.job_text),
        field:
          line.field === 'base' || line.field === 'fuel' || line.field === 'both'
            ? line.field
            : 'unknown',
        extracted_value: str(line.extracted_value),
        interpreted_value: num(line.interpreted_value),
        unit: isBaseRateType(line.unit) || isFuelRateType(line.unit) ? line.unit : 'UNKNOWN',
        validity_hint:
          line.validity_hint === 'period' || line.validity_hint === 'project_duration'
            ? line.validity_hint
            : null,
        note: str(line.note),
      })),
    matches: (Array.isArray(row.matches) ? row.matches : []).filter(
      (match): match is RateMatch => isObject(match) && isRateKind(match.field),
    ),
    status: statuses.includes(row.status as RateResponseStatus)
      ? (row.status as RateResponseStatus)
      : 'received',
    ai_model: str(row.ai_model),
    processed_at: str(row.processed_at),
    created_at: str(row.created_at) ?? '',
  };
}

// ------------------------------------------------------------------- parsers

type Parsed<T> = { value: T } | { error: string };

export const MAX_CONTACTS = 20;
export const MAX_CC = 10;
export const MAX_ALIASES = 200;
export const MAX_BODY_TEXT = 20_000;
export const MAX_CONFIRM_MATCHES = 60;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const text = (value: unknown, max: number) => typeof value === 'string' && value.length <= max;
const day = (value: unknown): value is 0 | 1 | 2 | 3 | 4 | 5 | 6 =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 6;
const oneOf = <T extends string>(value: unknown, allowed: readonly T[]): value is T =>
  (allowed as readonly unknown[]).includes(value);

function parseAliases(value: unknown): JobAlias[] | null {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > MAX_ALIASES) return null;
  const aliases: JobAlias[] = [];
  for (const item of value) {
    if (
      !isObject(item) ||
      !text(item.alias, 200) ||
      !(item.alias as string).trim() ||
      !text(item.job_key, 300) ||
      !oneOf(item.source, ['confirmed_match', 'manual'] as const) ||
      !text(item.confirmed_at, 40)
    ) {
      return null;
    }
    aliases.push({
      alias: (item.alias as string).trim(),
      job_key: item.job_key as string,
      source: item.source,
      confirmed_at: item.confirmed_at as string,
    });
  }
  return aliases;
}

/**
 * A customer's rate habits. Absent means the customer was saved before the
 * agent existed and is asked the default way; anything else must be the whole
 * block, so a half-written profile cannot decide when a customer is emailed.
 */
export function parseRateProfile(value: unknown): Parsed<CustomerRateProfile | undefined> {
  if (value === undefined || value === null) return { value: undefined };
  const aliases = isObject(value) ? parseAliases(value.aliases) : null;
  if (
    !isObject(value) ||
    !oneOf(value.billing_cycle, ['weekly', 'biweekly', 'monthly'] as const) ||
    !day(value.period_start_day) ||
    !day(value.request_day) ||
    !isBaseRateType(value.typical_rate_type) ||
    !oneOf(value.base_behavior, ['fixed_per_project', 'varies'] as const) ||
    !oneOf(value.fuel_behavior, ['weekly', 'fixed', 'none'] as const) ||
    !oneOf(value.request_base, ['when_missing', 'always'] as const) ||
    !oneOf(value.request_fuel, ['weekly', 'when_missing'] as const) ||
    typeof value.auto_create !== 'boolean' ||
    !oneOf(value.send_mode, ['DRAFT_ONLY', 'APPROVAL_REQUIRED', 'AUTO_SEND'] as const) ||
    typeof value.follow_up_days !== 'number' ||
    !Number.isInteger(value.follow_up_days) ||
    value.follow_up_days < 0 ||
    value.follow_up_days > 30 ||
    aliases === null
  ) {
    return { error: 'The rate settings are not valid.' };
  }
  return {
    value: {
      billing_cycle: value.billing_cycle,
      period_start_day: value.period_start_day,
      request_day: value.request_day,
      typical_rate_type: value.typical_rate_type,
      base_behavior: value.base_behavior,
      fuel_behavior: value.fuel_behavior,
      request_base: value.request_base,
      request_fuel: value.request_fuel,
      auto_create: value.auto_create,
      send_mode: value.send_mode,
      follow_up_days: value.follow_up_days,
      aliases,
    },
  };
}

/** Who a customer's rate requests go to. Absent means nobody has said yet. */
export function parseRateContacts(value: unknown): Parsed<RateContact[] | undefined> {
  if (value === undefined || value === null) return { value: undefined };
  if (!Array.isArray(value) || value.length > MAX_CONTACTS) {
    return { error: `Save at most ${MAX_CONTACTS} contacts.` };
  }
  const contacts: RateContact[] = [];
  let primaries = 0;
  for (const item of value) {
    if (
      !isObject(item) ||
      !text(item.name, 120) ||
      !text(item.email, 200) ||
      !EMAIL.test((item.email as string).trim()) ||
      !text(item.title, 120) ||
      typeof item.primary !== 'boolean' ||
      !text(item.notes, 2000) ||
      !Array.isArray(item.cc) ||
      item.cc.length > MAX_CC ||
      !item.cc.every((address) => text(address, 200) && EMAIL.test((address as string).trim()))
    ) {
      return { error: 'The contact details are not valid.' };
    }
    if (item.primary) primaries += 1;
    contacts.push({
      name: (item.name as string).trim(),
      email: (item.email as string).trim(),
      title: (item.title as string).trim(),
      primary: item.primary,
      cc: (item.cc as string[]).map((address) => address.trim()),
      notes: item.notes as string,
    });
  }
  if (primaries > 1) return { error: 'Only one contact can be the main one.' };
  return { value: contacts };
}

export type GenerateRequest = {
  /** Null asks for every customer that is due. */
  customer_profile_id: number | null;
  from: string | null;
  to: string | null;
};

const positiveId = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0;

/** { customer_profile_id?, from?, to? } — what to draft requests for. */
export function parseGenerateBody(body: unknown): Parsed<GenerateRequest> {
  if (!isObject(body)) return { error: 'The request is not valid.' };
  const { customer_profile_id: customerId, from, to } = body;
  if (customerId !== undefined && customerId !== null && !positiveId(customerId)) {
    return { error: 'The customer is not valid.' };
  }
  if ((from !== undefined && !isIsoDate(from)) || (to !== undefined && !isIsoDate(to))) {
    return { error: 'Dates must be YYYY-MM-DD.' };
  }
  if (isIsoDate(from) && isIsoDate(to) && to < from) {
    return { error: 'The end date is before the start date.' };
  }
  return {
    value: {
      customer_profile_id: positiveId(customerId) ? customerId : null,
      from: isIsoDate(from) ? from : null,
      to: isIsoDate(to) ? to : null,
    },
  };
}

export type SimulateRequest = {
  customer_profile_id: number;
  request_id: number | null;
  body_text: string;
  subject: string | null;
};

/** { customer_profile_id, request_id?, body_text, subject? } — a reply typed by hand. */
export function parseSimulateBody(body: unknown): Parsed<SimulateRequest> {
  if (!isObject(body)) return { error: 'The request is not valid.' };
  const { customer_profile_id: customerId, request_id: requestId, body_text: bodyText, subject } = body;
  if (!positiveId(customerId)) return { error: 'The customer is not valid.' };
  if (requestId !== undefined && requestId !== null && !positiveId(requestId)) {
    return { error: 'The request is not valid.' };
  }
  if (!text(bodyText, MAX_BODY_TEXT) || !(bodyText as string).trim()) {
    return { error: `Enter the reply, up to ${MAX_BODY_TEXT} characters.` };
  }
  if (subject !== undefined && subject !== null && !text(subject, 300)) {
    return { error: 'The subject is not valid.' };
  }
  return {
    value: {
      customer_profile_id: customerId,
      request_id: positiveId(requestId) ? requestId : null,
      body_text: bodyText as string,
      subject: typeof subject === 'string' ? subject : null,
    },
  };
}

export type ConfirmedMatch = {
  line_index: number;
  job_key: string;
  field: RateKind;
  value: number;
  unit: BaseRateType | FuelRateType;
  effective_from: string;
  effective_to: string | null;
  validity: RateValidity;
};

export type ConfirmRequest = {
  response_id: number;
  matches: ConfirmedMatch[];
  learn_aliases: boolean;
};

/** What a person settled on the confirmation screen, field by field. */
export function parseConfirmBody(body: unknown): Parsed<ConfirmRequest> {
  if (!isObject(body)) return { error: 'The request is not valid.' };
  const { response_id: responseId, matches, learn_aliases: learn } = body;
  if (!positiveId(responseId)) return { error: 'The reply is not valid.' };
  if (typeof learn !== 'boolean') return { error: 'The request is not valid.' };
  if (!Array.isArray(matches) || !matches.length || matches.length > MAX_CONFIRM_MATCHES) {
    return { error: `Confirm between 1 and ${MAX_CONFIRM_MATCHES} figures at a time.` };
  }
  const confirmed: ConfirmedMatch[] = [];
  for (const item of matches) {
    if (
      !isObject(item) ||
      typeof item.line_index !== 'number' ||
      !Number.isInteger(item.line_index) ||
      item.line_index < 0 ||
      !text(item.job_key, 300) ||
      !(item.job_key as string).trim() ||
      !isRateKind(item.field) ||
      typeof item.value !== 'number' ||
      !Number.isFinite(item.value) ||
      item.value < 0 ||
      !isIsoDate(item.effective_from) ||
      !(item.effective_to === null || isIsoDate(item.effective_to)) ||
      !isRateValidity(item.validity) ||
      (item.field === 'base' ? !isBaseRateType(item.unit) : !isFuelRateType(item.unit))
    ) {
      return { error: 'The confirmed rates are not valid.' };
    }
    if (typeof item.effective_to === 'string' && item.effective_to < item.effective_from) {
      return { error: 'The end date is before the start date.' };
    }
    confirmed.push({
      line_index: item.line_index,
      job_key: item.job_key as string,
      field: item.field,
      value: item.value,
      unit: item.unit as BaseRateType | FuelRateType,
      effective_from: item.effective_from,
      effective_to: typeof item.effective_to === 'string' ? item.effective_to : null,
      validity: item.validity,
    });
  }
  return { value: { response_id: responseId, matches: confirmed, learn_aliases: learn } };
}

export type ManualPeriodRequest = {
  customer_profile_id: number;
  job_key: string;
  job_label: string;
  kind: RateKind;
  value: number;
  rate_type: BaseRateType | null;
  fuel_type: FuelRateType | null;
  effective_from: string;
  effective_to: string | null;
  validity: RateValidity;
  reason: string;
};

/**
 * A rate entered or overridden by hand. The reason is required: a figure that
 * overrides what a customer wrote must say why, or the history stops being an
 * account of what happened.
 */
export function parseManualPeriodBody(body: unknown): Parsed<ManualPeriodRequest> {
  if (!isObject(body)) return { error: 'The request is not valid.' };
  const kind = body.kind;
  if (!positiveId(body.customer_profile_id)) return { error: 'The customer is not valid.' };
  if (!isRateKind(kind)) return { error: 'Say whether this is the rate or the fuel surcharge.' };
  if (!text(body.job_key, 300) || !(body.job_key as string).trim()) {
    return { error: 'The job is not valid.' };
  }
  if (!text(body.job_label, 200)) return { error: 'The job name is not valid.' };
  if (typeof body.value !== 'number' || !Number.isFinite(body.value) || body.value < 0) {
    return { error: 'Enter the amount.' };
  }
  if (kind === 'base' ? !isBaseRateType(body.rate_type) : !isFuelRateType(body.fuel_type)) {
    return { error: 'The unit is not valid.' };
  }
  if (!isIsoDate(body.effective_from)) return { error: 'Dates must be YYYY-MM-DD.' };
  if (!(body.effective_to === null || body.effective_to === undefined || isIsoDate(body.effective_to))) {
    return { error: 'Dates must be YYYY-MM-DD.' };
  }
  if (typeof body.effective_to === 'string' && body.effective_to < body.effective_from) {
    return { error: 'The end date is before the start date.' };
  }
  if (!isRateValidity(body.validity)) return { error: 'Say how long the rate holds.' };
  if (!text(body.reason, 500) || (body.reason as string).trim().length < 3) {
    return { error: 'Say why this rate is being entered by hand.' };
  }
  return {
    value: {
      customer_profile_id: body.customer_profile_id,
      job_key: (body.job_key as string).trim(),
      job_label: (body.job_label as string).trim(),
      kind,
      value: body.value,
      rate_type: kind === 'base' && isBaseRateType(body.rate_type) ? body.rate_type : null,
      fuel_type: kind === 'fuel' && isFuelRateType(body.fuel_type) ? body.fuel_type : null,
      effective_from: body.effective_from,
      effective_to: typeof body.effective_to === 'string' ? body.effective_to : null,
      validity: body.validity,
      reason: (body.reason as string).trim(),
    },
  };
}

/** { invoice_key, reason? } — the invoice being finalized, and why if it is reopened. */
export function parseFinalizeBody(body: unknown): Parsed<{ invoice_key: string; reason: string | null }> {
  if (!isObject(body)) return { error: 'The request is not valid.' };
  if (!text(body.invoice_key, 120) || !(body.invoice_key as string).trim()) {
    return { error: 'The invoice is not valid.' };
  }
  if (body.reason !== undefined && body.reason !== null && !text(body.reason, 500)) {
    return { error: 'The reason is not valid.' };
  }
  return {
    value: {
      invoice_key: (body.invoice_key as string).trim(),
      reason: typeof body.reason === 'string' && body.reason.trim() ? body.reason.trim() : null,
    },
  };
}
