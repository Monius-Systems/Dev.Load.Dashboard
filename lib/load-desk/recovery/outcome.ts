import { normalizeName } from '../customer-rates.ts';
import type { CustomerProfile } from '../profiles.ts';
import type { SavedRecord, Ticket } from '../types.ts';
import type { FieldResolution, TicketRecovery } from './contract.ts';
import { buildMemory, type WorkspaceMemory } from './memory.ts';
import { unresolvedCritical } from './resolve.ts';

// Where a ticket goes once it has been read and recovered: through, to a
// group, or to a person.
//
// The review screen used to be the way every ticket went. Most tickets are
// read whole from a customer the workspace hauls for, to a job site it has
// on file, and there is nothing on them for a person to decide; putting each
// one in front of somebody was the app asking to be told what it already
// knew. So a ticket the evidence settles is approved on the evidence and
// goes straight onto its invoice. What is left is sorted by what kind of
// question it is. A question about the business — a customer nobody has
// hauled for, a job site nobody has saved — is the same question for every
// ticket of that job, and is asked once for all of them. A question about
// this one sheet of paper — a ticket number half printed, a weight that does
// not balance — cannot be answered for it by any other sheet, and is asked
// about it alone. That is rare, and it never holds the rest of the scan.

export type Outcome = 'auto_approved' | 'group_confirmation' | 'individual_review';

/**
 * The bar a ticket has to clear to go through untouched. Kept together and
 * exported so the thresholds are one place to read and one place to change.
 */
export const OUTCOME_POLICY = {
  /** How many sibling tickets have to agree before their reading is strong evidence. */
  consensusMinTickets: 3,
} as const;

/**
 * The fields that belong to one sheet of paper and no other. A group cannot
 * settle them, because the group has nothing to say about them: every ticket
 * has its own number and was weighed on its own.
 */
export const TICKET_OWN_FIELDS: ReadonlySet<keyof Ticket> = new Set<keyof Ticket>([
  'ticket_number',
  'ticket_date',
  'gross_lb',
  'tare_lb',
  'net_lb',
  'gross_tons',
  'tare_tons',
  'net_tons',
  'time_in',
  'time_out',
]);

/** The fields that describe the job, and so are shared by every ticket of it. */
export const BUSINESS_FIELDS: ReadonlySet<keyof Ticket> = new Set<keyof Ticket>([
  'customer_name',
  'customer_id',
  'project_name',
  'project_address',
  'plant_name',
  'plant_address',
  'product_code',
  'product_description',
  'carrier_name',
  'vehicle_id',
  'order_number',
  'po_number',
]);

/**
 * Everything the workspace has verified, in the shape the outcome and the
 * exception groups ask questions of. Built once per pass over the records
 * and profiles the page already holds — never fetched here.
 */
export type Knowledge = {
  memory: WorkspaceMemory;
  customers: CustomerProfile[];
};

export const knowledgeOf = (
  records: SavedRecord[],
  profiles: { customers: CustomerProfile[]; trucks: Parameters<typeof buildMemory>[1]['trucks']; clients: Parameters<typeof buildMemory>[1]['clients'] },
): Knowledge => ({ memory: buildMemory(records, profiles), customers: profiles.customers });

const key = (value: string | null | undefined) => normalizeName(value ?? '');

/** The customer profile a ticket names, by number first and then by name or alias. */
export function customerOf(ticket: Ticket, knowledge: Knowledge): CustomerProfile | null {
  const id = key(ticket.customer_id).replace(/ /g, '');
  if (id) {
    const byId = knowledge.customers.find((customer) =>
      customer.ticket_customer_ids.some((value) => key(value).replace(/ /g, '') === id),
    );
    if (byId) return byId;
  }
  const name = key(ticket.customer_name);
  if (!name) return null;
  return (
    knowledge.customers.find((customer) =>
      [customer.name, ...customer.ticket_names].some((alias) => key(alias) === name),
    ) ?? null
  );
}

/**
 * What the workspace knows of the job on a ticket: whether the customer is
 * one it hauls for, and whether the job site is one it has on file for
 * them — on the profile, or on a ticket a person reviewed.
 */
export function businessContext(
  ticket: Ticket,
  knowledge: Knowledge,
): {
  customer: CustomerProfile | null;
  customerKnown: boolean;
  location: string | null;
  locationKnown: boolean;
} {
  const customer = customerOf(ticket, knowledge);
  const location = ticket.project_address?.trim() || null;
  const locationKey = key(location);
  let locationKnown = false;
  if (locationKey) {
    if (customer?.addresses?.some((address) => key(address) === locationKey)) locationKnown = true;
    const name = key(customer?.name ?? ticket.customer_name);
    if (!locationKnown && name) {
      locationKnown = knowledge.memory.relationships.some(
        (link) =>
          link.kind === 'customer_address' &&
          key(link.from) === name &&
          key(link.to) === locationKey,
      );
    }
  }
  return { customer, customerKnown: customer !== null, location, locationKnown };
}

const unsettled = (resolution: FieldResolution | undefined) =>
  resolution !== undefined &&
  (resolution.status === 'needs_review' ||
    (resolution.status === 'missing' && resolution.source_clipped));

// A field the resolver recovered is settled. There used to be a second bar
// here, on the confidence figure, and a job site matched to the customer's
// own profile fell just under it — so an address the workspace had on file,
// cut off on the left and found, still came up as something to check, which
// was the one thing this layer was built to stop. The resolver's threshold is
// the bar; nothing is recovered that did not clear it.

export type OutcomeReport = {
  outcome: Outcome;
  /** The fields a person, or the group, has to settle. */
  fields: (keyof Ticket)[];
  /** Why, in words the exception screen can show. */
  reasons: string[];
  context: ReturnType<typeof businessContext>;
};

/**
 * Where one ticket goes.
 *
 * A ticket with no record of how it was read — one filed before any of this
 * existed — is a ticket nothing has checked, and goes to a person as before.
 */
export function ticketOutcome(
  ticket: Ticket,
  recovery: TicketRecovery | undefined,
  knowledge: Knowledge,
  structuralIssues: string[] = [],
): OutcomeReport {
  const context = businessContext(ticket, knowledge);
  if (!recovery) {
    return {
      outcome: 'individual_review',
      fields: [],
      reasons: ['This ticket was filed before automatic checking and has not been looked at.'],
      context,
    };
  }
  const own: (keyof Ticket)[] = [];
  const business: (keyof Ticket)[] = [];
  const reasons: string[] = [];
  for (const field of unresolvedCritical(recovery)) {
    (TICKET_OWN_FIELDS.has(field) ? own : business).push(field);
  }
  for (const name of Object.keys(recovery.fields) as (keyof Ticket)[]) {
    const resolution = recovery.fields[name];
    if (own.includes(name) || business.includes(name)) continue;
    if (unsettled(resolution)) {
      (TICKET_OWN_FIELDS.has(name) ? own : business).push(name);
    }
  }
  // What the ticket is missing outright — a number, a weight — that the
  // validator already says. Those are this sheet's own.
  const missingOwn = structuralIssues.some((issue) =>
    /Missing required field: (ticket number|ticket date|net weight)/.test(issue),
  );
  if (missingOwn && !own.length) own.push('ticket_number');

  if (own.length) {
    reasons.push('Something on this ticket alone could not be settled.');
    return { outcome: 'individual_review', fields: own, reasons, context };
  }
  if (!context.customerKnown) {
    reasons.push('This customer is not on file.');
    if (!business.includes('customer_name')) business.push('customer_name');
  } else if (context.location && !context.locationKnown) {
    reasons.push('This job site is not on file for this customer.');
    if (!business.includes('project_address')) business.push('project_address');
  }
  if (business.length) {
    return { outcome: 'group_confirmation', fields: business, reasons, context };
  }
  return { outcome: 'auto_approved', fields: [], reasons: [], context };
}
