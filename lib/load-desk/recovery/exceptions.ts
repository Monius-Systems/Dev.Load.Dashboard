import { normalizeName, rateFor } from '../customer-rates.ts';
import type { CustomerProfile } from '../profiles.ts';
import type { RecordEdit } from '../record-input.ts';
import type { SavedRecord, Ticket } from '../types.ts';
import type { TicketRecovery } from './contract.ts';
import { businessContext, ticketOutcome, type Knowledge, type OutcomeReport } from './outcome.ts';
import { invoicePlacement, recordBatch } from '../records.ts';
import { ticketDay } from '../ticket-date.ts';
import { confirmField } from './resolve.ts';

// The questions a scan leaves behind, asked once each.
//
// Ten tickets from a job site nobody has saved are one question, not ten:
// "where is this?" Asking it ten times over, once per ticket, is what the
// review screen did. So after every ticket has been read and recovered, the
// ones that are not settled are sorted by what is unsettled about them, and
// the ones with the same unsettled thing — the same customer at the same
// place, as far as the paper says — are put together. One answer settles all
// of them. A ticket whose trouble is its own — a number half printed — is a
// group of one, and is the only kind that ever needs the full review screen.
//
// Groups are worked out from the saved records rather than from the page,
// so the questions are the same whichever device asks, and still there
// after a reload.

export type ExceptionType =
  | 'NEW_CUSTOMER'
  | 'NEW_LOCATION'
  | 'NEW_PROJECT'
  | 'NEW_CUSTOMER_PROJECT_COMBINATION'
  | 'AMBIGUOUS_LOCATION'
  | 'AMBIGUOUS_CUSTOMER'
  | 'CLIPPED_TEXT_RECOVERABLE'
  | 'CONFLICTING_GROUP_DATA'
  | 'INDIVIDUAL_CRITICAL_FIELD';

/** What the group screen asks for, by type. */
export type Ask = 'customer_name' | 'project_name' | 'project_address' | keyof Ticket;

export type ExceptionGroup = {
  key: string;
  type: ExceptionType;
  /**
   * The ticket has no date anyone could read. Asked before anything else and
   * inline — a date box and one button — because a ticket with no date is on
   * no invoice at all, and the date is what puts it on one; once it has one,
   * whatever else is unsettled about it joins its job's question.
   */
  needsDate: boolean;
  /** The customer as the tickets name it, or as the profile names it. */
  customer: string | null;
  customerProfileId: number | null;
  /** The values as they came off the paper, for the screen to show. */
  detected: Partial<Record<keyof Ticket, string>>;
  /** Where more than one value on file fits, all of them. */
  candidates: Partial<Record<keyof Ticket, string[]>>;
  /** The fields one answer settles for every ticket in the group. */
  asks: (keyof Ticket)[];
  ticketIds: number[];
  /** The evidence behind the group, 0..1: how many of its tickets agree with each other. */
  confidence: number;
  reasons: string[];
};

export type Member = {
  id: number;
  ticket: Ticket;
  recovery?: TicketRecovery;
  report: OutcomeReport;
};

const key = (value: string | null | undefined) => normalizeName(value ?? '');

/**
 * The job site a ticket is for, as far as the paper and its siblings say: the
 * value on the ticket, or, for a ticket whose site was cut off, the one value
 * on file that fits it AND that a sibling of the same scan carries whole.
 * That is what puts a clipped ticket in the same group as the nine beside
 * it, so one answer settles all ten.
 */
function effectiveLocation(member: Member, siblings: Member[]): string | null {
  const value = member.ticket.project_address?.trim() || null;
  const resolution = member.recovery?.fields.project_address;
  if (resolution?.status !== 'needs_review' || !resolution.candidates?.length) return value;
  const whole = new Set(
    siblings
      .filter((other) => other.id !== member.id)
      .filter((other) => other.recovery?.fields.project_address?.status !== 'needs_review')
      .map((other) => key(other.ticket.project_address))
      .filter(Boolean),
  );
  const agreed = resolution.candidates.filter((candidate) => whole.has(key(candidate)));
  return agreed.length === 1 ? agreed[0] : value;
}

function typeOf(member: Member): ExceptionType {
  const { report } = member;
  if (report.outcome === 'individual_review') return 'INDIVIDUAL_CRITICAL_FIELD';
  const location = member.recovery?.fields.project_address;
  const customer = member.recovery?.fields.customer_name;
  if (customer?.reason === 'ambiguous_candidates') return 'AMBIGUOUS_CUSTOMER';
  if (location?.reason === 'ambiguous_candidates') return 'AMBIGUOUS_LOCATION';
  if (location?.reason === 'conflicting_evidence' || customer?.reason === 'conflicting_evidence') {
    return 'CONFLICTING_GROUP_DATA';
  }
  if (!report.context.customerKnown) return 'NEW_CUSTOMER';
  // The job and the site never raise a question of their own (SILENT_FIELDS);
  // the location types remain for the record's sake and are not produced.
  return 'CLIPPED_TEXT_RECOVERABLE';
}

/**
 * The tickets of a scan (or of a workspace's backlog) that are not settled,
 * as the questions they raise. Settled tickets are left out.
 */
export function groupExceptions(members: Member[]): ExceptionGroup[] {
  const open = members.filter((member) => member.report.outcome !== 'auto_approved');
  const groups = new Map<string, ExceptionGroup & { agree: number }>();
  for (const member of open) {
    const type = typeOf(member);
    const customerName = member.report.context.customer?.name ?? member.ticket.customer_name ?? null;
    const location = effectiveLocation(member, open);
    const groupKey =
      type === 'INDIVIDUAL_CRITICAL_FIELD'
        ? `individual|${member.id}`
        : `${type}|${key(customerName)}|${key(location)}`;
    const detected: ExceptionGroup['detected'] = {};
    const candidates: ExceptionGroup['candidates'] = {};
    for (const field of member.report.fields) {
      const resolution = member.recovery?.fields[field];
      const printed = resolution?.visible_text ?? member.ticket[field];
      if (printed !== null && printed !== undefined && printed !== '') detected[field] = String(printed);
      if (resolution?.candidates?.length) candidates[field] = resolution.candidates;
    }
    if (location && !detected.project_address && type !== 'INDIVIDUAL_CRITICAL_FIELD') {
      detected.project_address = location;
    }
    const asks: (keyof Ticket)[] =
      type === 'INDIVIDUAL_CRITICAL_FIELD'
        ? member.report.fields
        : [...new Set<keyof Ticket>([
            ...member.report.fields,
            ...(type === 'NEW_CUSTOMER' ? (['customer_name'] as (keyof Ticket)[]) : []),
          ])];
    const found = groups.get(groupKey);
    if (found) {
      found.ticketIds.push(member.id);
      for (const [field, value] of Object.entries(detected)) {
        found.detected[field as keyof Ticket] ??= value;
      }
      for (const [field, list] of Object.entries(candidates)) {
        found.candidates[field as keyof Ticket] = [
          ...new Set([...(found.candidates[field as keyof Ticket] ?? []), ...list]),
        ];
      }
      for (const ask of asks) if (!found.asks.includes(ask)) found.asks.push(ask);
      // A ticket that carries the value whole agrees with the group; a
      // clipped one was put here by the others and does not count for it.
      if (member.recovery?.fields.project_address?.status !== 'needs_review') found.agree += 1;
      continue;
    }
    groups.set(groupKey, {
      key: groupKey,
      type,
      needsDate: type === 'INDIVIDUAL_CRITICAL_FIELD' && asks.includes('ticket_date'),
      customer: customerName,
      customerProfileId: member.report.context.customer?.id ?? null,
      detected,
      candidates,
      asks,
      ticketIds: [member.id],
      confidence: 0,
      reasons: [...member.report.reasons],
      agree: member.recovery?.fields.project_address?.status !== 'needs_review' ? 1 : 0,
    });
  }
  return [...groups.values()]
    .map(({ agree, ...group }) => ({
      ...group,
      confidence: group.ticketIds.length ? Math.round((agree / group.ticketIds.length) * 100) / 100 : 0,
    }))
    .sort(
      (a, b) =>
        // Dates first: a ticket with no date is on no invoice yet.
        Number(b.needsDate) - Number(a.needsDate) ||
        // Then the questions that settle the most tickets.
        b.ticketIds.length - a.ticketIds.length ||
        a.key.localeCompare(b.key),
    );
}

/** The members of a workspace's backlog: every filed ticket nobody or nothing has settled. */
export function membersOf(
  records: SavedRecord[],
  knowledge: Knowledge,
  issuesOf: (record: SavedRecord) => string[],
): Member[] {
  return records.map((record) => ({
    id: record.id,
    ticket: record.ticket,
    recovery: record.recovery,
    report: ticketOutcome(record.ticket, record.recovery, knowledge, issuesOf(record)),
  }));
}

/** What a person answered for a group. */
export type GroupAnswer = {
  values: Partial<Record<keyof Ticket, string | null>>;
  /** The profile the group's tickets are put under, once it exists. */
  customerProfileId: number | null;
  /**
   * That profile, for the rate: a ticket that matched no customer when it was
   * filed carries no rate, and the invoice it is on is a draft until it has
   * one. Settled under a customer, it is charged as that customer is charged
   * where this load went — the same rule a ticket gets when it is read.
   */
  customer?: CustomerProfile | null;
};

/**
 * One answer, written onto every ticket of the group.
 *
 * Each ticket keeps everything of its own and takes only the fields the group
 * asked about. The record says the value was confirmed, for how many tickets
 * and under which question, and keeps the print that was there — so the ten
 * tickets settled by one answer can each be traced back to it. These are
 * edits a person made: saving them marks the tickets checked.
 */
export function applyGroupAnswer(
  records: SavedRecord[],
  group: ExceptionGroup,
  answer: GroupAnswer,
  at: string,
): RecordEdit[] {
  const edits: RecordEdit[] = [];
  const members = records.filter((record) => group.ticketIds.includes(record.id));
  for (const record of members) {
    const ticket: Ticket = { ...record.ticket };
    let recovery = record.recovery;
    for (const [name, value] of Object.entries(answer.values)) {
      const field = name as keyof Ticket;
      if (value === undefined) continue;
      const text = value === null ? null : value.trim() || null;
      (ticket as Record<string, string | number | null>)[field] = text;
      if (recovery) {
        recovery = confirmField(recovery, field, text, 'edited');
        const resolution = recovery.fields[field]!;
        recovery = {
          ...recovery,
          fields: {
            ...recovery.fields,
            [field]: {
              ...resolution,
              evidence: [
                ...resolution.evidence.slice(0, -1),
                `Confirmed once for ${group.ticketIds.length} ticket${group.ticketIds.length === 1 ? '' : 's'} (${group.type.toLowerCase().replace(/_/g, ' ')}) on ${at}.`,
              ],
            },
          },
        };
      }
    }
    if (answer.customer && ticket.rate === null && ticket.fuel_charge === null) {
      const rated = rateFor(answer.customer, ticket.project_address);
      if (rated.flat_rate !== null) {
        ticket.rate = rated.flat_rate;
        ticket.rate_type = rated.rate_type;
      }
      if (rated.fuel_charge !== null) {
        ticket.fuel_charge = rated.fuel_charge;
        ticket.fuel_type = rated.fuel_type;
      }
    }
    // A date given here puts the ticket on that date's invoice, as the date
    // box does: the answer used to set the date and leave the ticket on the
    // undated batch, checked and unbillable.
    const day = ticketDay(ticket.ticket_date);
    const placed =
      day !== null && day !== ticketDay(record.ticket.ticket_date)
        ? invoicePlacement(record, day, records)
        : null;
    edits.push({
      id: record.id,
      ticket,
      invoice: placed?.invoice ?? record.invoice,
      ocr_text: record.ocr_text,
      customer_profile_id: answer.customerProfileId ?? record.customer_profile_id ?? null,
      truck_id: record.truck_id ?? null,
      ...(recovery ? { recovery } : {}),
      ...(placed?.batchId ? { invoice_batch_id: placed.batchId } : {}),
    });
  }
  return edits;
}

/** Whether the ticket's job is one the workspace now knows, for the confirmation's learning step. */
export const contextOf = businessContext;

/**
 * A saved ticket given its date from the panel, as the edit that saves it.
 *
 * A ticket belongs on the invoice of its date, so dating it can move it:
 * onto the invoice its date's other tickets are on, or onto one of its own
 * with the next number — the same move the review screen makes. It is the
 * app's own bookkeeping, not a review: `reviewed_at` stays as it was, the
 * date is marked confirmed on the record, and the ticket goes back through
 * classification with a date, to pass or to join its job's question.
 */
export function dateEdit(record: SavedRecord, date: string, records: SavedRecord[]): RecordEdit {
  const placed = invoicePlacement(record, date, records);
  const ticket: Ticket = { ...record.ticket, ticket_date: date };
  const recovery = record.recovery
    ? confirmField(record.recovery, 'ticket_date', date, 'edited')
    : undefined;
  return {
    id: record.id,
    ticket,
    invoice: placed.invoice,
    ocr_text: record.ocr_text,
    customer_profile_id: record.customer_profile_id ?? null,
    truck_id: record.truck_id ?? null,
    ...(recovery ? { recovery } : {}),
    ...(placed.batchId ? { invoice_batch_id: placed.batchId } : {}),
    bookkeeping: true,
  };
}
