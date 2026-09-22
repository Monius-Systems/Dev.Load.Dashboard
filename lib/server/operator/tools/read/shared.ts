import type { SupabaseClient } from '@supabase/supabase-js';
import type { JsonSchema, ToolDefinition, ToolDeps } from '@/lib/operator/types';
import type { RoutingProvider } from '@/lib/server/routing-provider';
import { lineTotal } from '@/lib/load-desk/format';
import { needsReview, recordTons, ticketStatus, type InvoiceGroup } from '@/lib/load-desk/records';
import { ticketDay } from '@/lib/load-desk/ticket-date';
import { validateTicket } from '@/lib/load-desk/validate';
import { customerLocationRates } from '@/lib/load-desk/customer-rates';
import type { CustomerProfile } from '@/lib/load-desk/profiles';
import type { InvoiceReadiness } from '@/lib/load-desk/rates';
import type { MileageDay } from '@/lib/load-desk/mileage';
import type { SavedRecord } from '@/lib/load-desk/types';

// What every read tool shares: how it reaches the database, how it reads the
// model's arguments, and the shapes it answers in.
//
// A read tool is a narrow window onto services the dashboard already has. It
// never computes a figure of its own — miles, prices and totals come from the
// same deterministic code the pages use — and it never hands the model more
// than it asked for: no scan text, no recovery record, no other workspace.
// The bounds here are the ones that keep a run cheap: a default window of
// days, a cap on the list, and a truncation the answer admits to.

// ------------------------------------------------------------------- deps

/**
 * The dependencies a read tool actually uses, narrowed from the isomorphic
 * ToolDeps the engine builds. The Supabase client is the signed-in member's,
 * so row level security applies as them whatever this code asks for.
 */
export function deps(given: ToolDeps): {
  client: SupabaseClient;
  routing: RoutingProvider | null;
} {
  return {
    client: given.client as SupabaseClient,
    routing: (given.routing ?? null) as RoutingProvider | null,
  };
}

/**
 * A tool with its own argument type, as the flat registry list holds it.
 * READ_TOOLS is one array of tools whose inputs all differ, and the engine
 * only ever hands a handler what that tool's own `parse` returned — so the
 * widening is sound where the type system cannot say so.
 */
export const readTool = <Input>(tool: ToolDefinition<Input>): ToolDefinition =>
  tool as unknown as ToolDefinition;

// ----------------------------------------------------------------- parsing

/** Thrown inside a builder and turned into the parser's error string. */
class BadInput extends Error {}

const fail = (message: string): never => {
  throw new BadInput(message);
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Refuses the model's arguments with a sentence it can act on. */
export const refuse = (message: string): never => fail(message);

/**
 * Wraps a builder as a tool's `parse`.
 *
 * Unknown fields are accepted and never read: a model that invents an
 * argument gets the tool it asked for rather than a refusal it cannot learn
 * from, and nothing it invented can reach a query.
 */
export function parser<Input>(build: (fields: Record<string, unknown>) => Input) {
  return (args: unknown): { value: Input } | { error: string } => {
    try {
      const fields =
        args === null || args === undefined
          ? {}
          : isObject(args)
            ? args
            : fail('Arguments must be an object.');
      return { value: build(fields) };
    } catch (error) {
      if (error instanceof BadInput) return { error: error.message };
      return { error: 'Those arguments could not be read.' };
    }
  };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** An ISO date, or null. Anything that is not a day is refused by name. */
export function isoDate(fields: Record<string, unknown>, name: string): string | null {
  const value = fields[name];
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string' || !ISO_DATE.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    return fail(`${name} must be a date like 2026-09-22.`);
  }
  return value;
}

export function requiredDate(fields: Record<string, unknown>, name: string): string {
  return isoDate(fields, name) ?? fail(`${name} is required, as a date like 2026-09-22.`);
}

/** A whole number within bounds. Missing takes the fallback, when there is one. */
export function positiveInt(
  fields: Record<string, unknown>,
  name: string,
  min: number,
  max: number,
  fallback?: number,
): number {
  const value = fields[name];
  if (value === null || value === undefined || value === '') {
    return fallback ?? fail(`${name} is required.`);
  }
  const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(number) || !Number.isInteger(number)) {
    return fail(`${name} must be a whole number.`);
  }
  return Math.min(Math.max(number, min), max);
}

/** An id the model names. Out of range is an error, not a clamp. */
export function identifier(fields: Record<string, unknown>, name: string): number {
  const value = fields[name];
  const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isSafeInteger(number) || number <= 0) return fail(`${name} must be a record id.`);
  return number;
}

export function optionalIdentifier(fields: Record<string, unknown>, name: string): number | null {
  const value = fields[name];
  if (value === null || value === undefined || value === '') return null;
  return identifier(fields, name);
}

/** A short piece of text, trimmed and capped, or null. */
export function bounded(
  fields: Record<string, unknown>,
  name: string,
  max = 200,
): string | null {
  const value = fields[name];
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') return fail(`${name} must be text.`);
  const text = value.trim().slice(0, max);
  return text ? text : null;
}

export function requiredText(
  fields: Record<string, unknown>,
  name: string,
  max = 200,
): string {
  return bounded(fields, name, max) ?? fail(`${name} is required.`);
}

export function flag(fields: Record<string, unknown>, name: string): boolean {
  const value = fields[name];
  if (value === null || value === undefined) return false;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fail(`${name} must be true or false.`);
}

/** One of a fixed set of words, or the fallback when nothing was said. */
export function choice<T extends string>(
  fields: Record<string, unknown>,
  name: string,
  options: readonly T[],
  fallback: T,
): T {
  const value = fields[name];
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value !== 'string' || !(options as readonly string[]).includes(value)) {
    return fail(`${name} must be one of: ${options.join(', ')}.`);
  }
  return value as T;
}

// -------------------------------------------------------------- date ranges

/** The longest stretch of days one read tool may ask the database for. */
export const MAX_SPAN_DAYS = 120;
const DAY_MS = 86_400_000;

const two = (value: number) => String(value).padStart(2, '0');

/** A date as the ticket_date column holds it, in the reader's own timezone. */
export const isoDay = (date: Date): string =>
  `${date.getFullYear()}-${two(date.getMonth() + 1)}-${two(date.getDate())}`;

export const shiftDays = (day: string, days: number): string =>
  isoDay(new Date(Date.parse(`${day}T12:00:00Z`) + days * DAY_MS));

export type DateRange = { from: string; to: string; clamped: boolean };

/**
 * The days a tool will read, from what the model asked for.
 *
 * Nothing said means the default window ending today. Dates the wrong way
 * round are swapped rather than refused — the intent is plain. A span longer
 * than the cap is shortened to the cap and says so, because an unbounded read
 * of a workspace is the one thing a run cannot afford.
 */
export function dateRange(
  from: string | null,
  to: string | null,
  now: Date,
  defaultDays: number,
): DateRange {
  const today = isoDay(now);
  let start = from;
  let end = to;
  if (start && end && start > end) [start, end] = [end, start];
  if (!end) end = start ? shiftDays(start, defaultDays - 1) : today;
  if (end > today && !to) end = today;
  if (!start) start = shiftDays(end, -(defaultDays - 1));
  if (end < start) end = start;
  const span = Math.round((Date.parse(`${end}T12:00:00Z`) - Date.parse(`${start}T12:00:00Z`)) / DAY_MS) + 1;
  if (span > MAX_SPAN_DAYS) {
    return { from: shiftDays(end, -(MAX_SPAN_DAYS - 1)), to: end, clamped: true };
  }
  return { from: start, to: end, clamped: false };
}

/** A range said in the words a summary uses. */
export const rangeWords = (range: DateRange) =>
  `${range.from} to ${range.to}${range.clamped ? ` (shortened to ${MAX_SPAN_DAYS} days)` : ''}`;

// ----------------------------------------------------------------- limiting

export type Bounded<T> = { items: T[]; truncated: boolean; total: number };

/** The first `max` of a list, saying so when there were more. */
export function capped<T>(list: T[], max: number): Bounded<T> {
  return { items: list.slice(0, max), truncated: list.length > max, total: list.length };
}

// -------------------------------------------------------------------- views

/**
 * A saved ticket as the model is shown it.
 *
 * Deliberately not the record: no scan text, no recovery record, no stored
 * file. What is here is what a person reads off the ticket line, plus the two
 * judgements the app makes about it — whether it still wants checking, and
 * what is wrong with it.
 */
export function ticketView(record: SavedRecord) {
  return {
    id: record.id,
    ticket_number: record.ticket.ticket_number,
    date: ticketDay(record.ticket.ticket_date),
    printed_date: record.ticket.ticket_date,
    customer_name: record.ticket.customer_name,
    customer_profile_id: record.customer_profile_id ?? null,
    project_name: record.ticket.project_name,
    project_address: record.ticket.project_address,
    plant_name: record.ticket.plant_name,
    truck_number: record.invoice.truck_number,
    net_tons: recordTons(record),
    rate: record.ticket.rate,
    rate_type: record.ticket.rate_type,
    hours: record.ticket.hours,
    fuel_charge: record.ticket.fuel_charge,
    fuel_type: record.ticket.fuel_type,
    line_total: lineTotal(record.ticket),
    invoice_number: record.invoice.invoice_number,
    status: ticketStatus(record),
    needs_review: needsReview(record),
    reviewed_at: record.reviewed_at ?? null,
    auto_approved_at: record.auto_approved_at ?? null,
    issues: validateTicket(record.ticket, record.recovery),
  };
}

/** An invoice and what it is still waiting for. */
export function invoiceView(group: InvoiceGroup, readiness: InvoiceReadiness) {
  return {
    invoice_number: group.invoice.invoice_number,
    invoice_key: group.key,
    invoice_date: group.invoice.invoice_date,
    truck_number: group.invoice.truck_number,
    bill_to: group.invoice.bill_to.name,
    tickets: group.records.length,
    net_tons: group.tons,
    total: group.total,
    first_ticket_date: group.firstTicketDate,
    last_ticket_date: group.lastTicketDate,
    status: readiness.status,
    base: readiness.base,
    fuel: readiness.fuel,
    needs_confirmation: group.needsConfirmation,
    waiting_jobs: readiness.waiting_jobs,
  };
}

/**
 * A customer as the model is shown it. Contacts are counted, never listed:
 * only get_customer, which a person asked for by name, spells them out.
 */
export function customerView(customer: CustomerProfile) {
  const profile = customer.rate_profile;
  return {
    id: customer.id,
    name: customer.name,
    ticket_names: customer.ticket_names,
    ticket_customer_ids: customer.ticket_customer_ids,
    addresses: customer.addresses ?? [],
    site_rates: customerLocationRates(customer).map((site) => ({
      address: site.address,
      flat_rate: site.flat_rate,
      rate_type: site.rate_type ?? null,
      fuel_charge: site.fuel_charge,
      fuel_type: site.fuel_type ?? null,
    })),
    rate_profile: profile
      ? {
          billing_cycle: profile.billing_cycle,
          request_day: profile.request_day,
          typical_rate_type: profile.typical_rate_type,
          base_behavior: profile.base_behavior,
          fuel_behavior: profile.fuel_behavior,
          send_mode: profile.send_mode,
          follow_up_days: profile.follow_up_days,
          auto_create: profile.auto_create,
        }
      : null,
    contacts: (customer.rate_contacts ?? []).length,
  };
}

/** One stored truck-day, in figures. Legs and map lines are asked for apart. */
export function dayView(day: MileageDay) {
  return {
    truck_id: day.truck_id,
    truck_number: day.truck_number,
    date: day.service_date,
    status: day.status,
    miles: day.total_miles,
    est_gallons: day.est_gallons,
    mpg: day.mpg,
    loads: day.ticket_count,
    calculated_at: day.calculated_at,
    review_reasons: day.review_reasons.map((reason) => reason.code),
    warnings: day.warnings,
    error: day.error,
  };
}

// -------------------------------------------------------------- schema bits

/** Every input schema is strict: all properties required, nothing else allowed. */
export const strictInput = (properties: Record<string, JsonSchema>): JsonSchema => ({
  type: 'object',
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
});

export const NO_INPUT: JsonSchema = strictInput({});

/** The output schemas are for documentation; the engine does not check them. */
export const FREE_OUTPUT: JsonSchema = { type: 'object', description: 'A read result.' };

export const nullableString = (description: string): JsonSchema => ({
  type: ['string', 'null'],
  description,
});

export const dayCount = (description: string, max: number): JsonSchema => ({
  type: 'integer',
  description,
  minimum: 1,
  maximum: max,
});
