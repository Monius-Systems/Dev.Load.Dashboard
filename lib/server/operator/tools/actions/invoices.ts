import type { SupabaseClient } from '@supabase/supabase-js';
import { customerIdFor, type CustomerProfile } from '@/lib/load-desk/profiles';
import { invoiceGroups, invoiceKey, type InvoiceGroup } from '@/lib/load-desk/records';
import { invoiceReadiness, type RatePeriod } from '@/lib/load-desk/rates';
import type { SavedRecord } from '@/lib/load-desk/types';
import type { EntityRef, ToolContext, ToolImpact, ToolResult } from '@/lib/operator/types';
import { listProfiles, listRecordsBetween } from '@/lib/server/load-desk-store';
import { finalizedKeys } from '@/lib/server/operator/locks';
import { reReadRecords } from '@/lib/server/operator/verify';
import { applyPeriodsToTickets, ticketEdits, type TicketEditPlan } from '@/lib/server/rates-engine';
import { listLocks, listPeriods } from '@/lib/server/rates-store';
import { invoiceRef, ticketRef } from './refs';
import {
  addDays,
  defineAction,
  deps,
  isObject,
  isoOf,
  memberOf,
  nothingVerified,
  plural,
  recordAction,
  settle,
  shortText,
  stateHash,
  verifyAll,
  type ActionDeps,
  type Parsed,
} from './shared';

// Pricing a draft invoice from the rates on file.
//
// `applyPeriodsToTickets` is the only thing in this app that writes a price
// onto a ticket, and it stays that way here: this tool works out what it would
// do — with `ticketEdits`, the same pure function the writer itself uses — so a
// person can be shown the figure before anything happens, and then calls the
// writer. It does not compute a price of its own, and the model never supplies
// one.
//
// Two things the engine already guarantees and this tool relies on rather than
// repeating: a ticket somebody priced by hand is never repriced, and a
// finalized invoice is never touched. The lock is checked here as well, before
// anything is asked for, because a refusal a person can read is better than a
// conflict in the trail.

/** How far back an invoice is looked for by its number. */
const LOOKBACK_DAYS = 120;

/** The most lines one invoice may have for this tool to verify it. */
const MAX_LINES = 60;

/**
 * The most tickets one call may re-price, this invoice's and the rest of the
 * customer's scope together. The writer is scoped to a customer, not to an
 * invoice, so a customer with hundreds of unpriced tickets must be refused
 * here and priced from the Rates page, rather than repriced in passing by
 * somebody asking about one invoice.
 */
const MAX_PRICED = 100;

export type RecalculateInvoiceInput = { invoice_number: string };

type Loaded = {
  group: InvoiceGroup | null;
  locked: boolean;
  customers: CustomerProfile[];
  periods: RatePeriod[];
  plan: TicketEditPlan;
  /** What `applyPeriodsToTickets` will be scoped to, and what else that covers. */
  scope: { customerId?: number };
  wider: number;
};

/**
 * The invoice, the rates that apply to it and what pricing it would change.
 *
 * The scope matters. `applyPeriodsToTickets` takes a customer or a job, not an
 * invoice, so an invoice whose lines are all one customer's is priced as that
 * customer — which can also touch that customer's other unpriced tickets. The
 * dry run says so in as many words rather than promising an invoice and
 * writing a customer.
 */
async function load(
  client: SupabaseClient,
  workspace: string,
  invoiceNumber: string,
  now: Date,
): Promise<Loaded> {
  const key = invoiceKey(invoiceNumber);
  const to = isoOf(now);
  const records = await listRecordsBetween(client, workspace, addDays(to, -LOOKBACK_DAYS), to, 500);
  const group = invoiceGroups(records).find((candidate) => candidate.key === key) ?? null;
  if (!group) {
    return {
      group: null,
      locked: false,
      customers: [],
      periods: [],
      plan: { edits: [], conflicts: [], kept_manual: 0 },
      scope: {},
      wider: 0,
    };
  }
  const [profiles, locks] = await Promise.all([
    listProfiles(client, workspace),
    listLocks(client, workspace),
  ]);
  const customers = profiles.customers;
  const onInvoice = new Set(
    group.records.map((record) => customerIdFor(record, customers)).filter((id) => id !== null),
  );
  const scope: { customerId?: number } = onInvoice.size === 1 ? { customerId: [...onInvoice][0] } : {};
  const periods = await listPeriods(client, workspace, scope.customerId === undefined ? {} : { customerId: scope.customerId });
  const stamp = now.toISOString();
  const plan = ticketEdits(group.records, customers, periods, locks, stamp, scope);
  const scoped = ticketEdits(records, customers, periods, locks, stamp, scope);
  const onThisInvoice = new Set(plan.edits.map((edit) => edit.id));
  return {
    group,
    locked: (await finalizedKeys(client, workspace)).has(key),
    customers,
    periods,
    plan,
    scope,
    wider: scoped.edits.filter((edit) => !onThisInvoice.has(edit.id)).length,
  };
}

const fingerprint = (loaded: Loaded) =>
  stateHash([
    loaded.group?.records.map((record) => [record.id, record.edited_at ?? null, record.saved_at]) ?? null,
    loaded.periods.map((period) => period.id),
    loaded.locked,
  ]);

const parse = (args: unknown): Parsed<RecalculateInvoiceInput> => {
  if (!isObject(args)) return { error: 'Expected an invoice number.' };
  const invoiceNumber = shortText(args.invoice_number, 60);
  if (!invoiceNumber) return { error: 'invoice_number must be the number on the invoice.' };
  return { value: { invoice_number: invoiceNumber } };
};

async function dryRun(
  input: RecalculateInvoiceInput,
  ctx: ToolContext,
  given: ActionDeps,
): Promise<ToolImpact> {
  const loaded = await load(given.client, ctx.workspaceId, input.invoice_number, ctx.now);
  if (!loaded.group) {
    return {
      records: 0,
      touches_finalized: false,
      lines: [],
      affected: [],
      blockers: [`No invoice ${input.invoice_number} in the last ${LOOKBACK_DAYS} days`],
      state_hash: stateHash(['missing', invoiceKey(input.invoice_number)]),
    };
  }
  const { group } = loaded;
  const ref = invoiceRef(group.key, group.invoice.invoice_number);
  const blockers: string[] = [];
  if (loaded.locked) {
    blockers.push(`Invoice ${group.invoice.invoice_number} is finalized; its figures are what was billed.`);
  }
  if (group.records.length > MAX_LINES) {
    blockers.push(`That invoice has ${group.records.length} tickets; the Operator prices at most ${MAX_LINES}.`);
  }
  // Everything the writer would touch, not only this invoice's share of it.
  const priced = loaded.plan.edits.length + loaded.wider;
  if (priced > MAX_PRICED) {
    blockers.push(
      `Pricing this invoice would re-price ${priced} tickets for the customer; ask from the Rates page instead.`,
    );
  }
  const lines = [
    `${plural(loaded.plan.edits.length, 'ticket')} on this invoice would be re-priced`,
    `${plural(loaded.plan.kept_manual, 'hand-priced ticket')} kept`,
  ];
  if (loaded.wider) {
    lines.push(`${plural(loaded.wider, 'other ticket')} for the same customer would be priced too`);
  }
  if (loaded.plan.conflicts.length) {
    lines.push(`${plural(loaded.plan.conflicts.length, 'line')} on a finalized invoice, left alone`);
  }
  return {
    records: blockers.length ? 0 : priced,
    touches_finalized: loaded.locked || loaded.plan.conflicts.length > 0,
    lines,
    affected: [ref, ...loaded.plan.edits.map((edit) => ticketRef(edit.id))],
    blockers,
    state_hash: fingerprint(loaded),
  };
}

async function handler(
  input: RecalculateInvoiceInput,
  ctx: ToolContext,
  given: ActionDeps,
): Promise<ToolResult> {
  const workspace = ctx.workspaceId;
  const loaded = await load(given.client, workspace, input.invoice_number, ctx.now);
  if (!loaded.group) {
    const ref = invoiceRef(invoiceKey(input.invoice_number), input.invoice_number);
    return {
      kind: 'action',
      outcome: 'failed',
      succeeded: [],
      failed: [{ entity: ref, reason: `No invoice ${input.invoice_number} in the last ${LOOKBACK_DAYS} days` }],
      not_attempted: [],
      verification: nothingVerified(),
      summary: `There is no invoice ${input.invoice_number} in the last ${LOOKBACK_DAYS} days.`,
      entities: [ref],
    };
  }
  const { group } = loaded;
  const ref = invoiceRef(group.key, group.invoice.invoice_number);
  // Checked again at the moment of writing, not only in the preview.
  const priced = loaded.plan.edits.length + loaded.wider;
  if (loaded.locked || group.records.length > MAX_LINES || priced > MAX_PRICED) {
    return {
      kind: 'action',
      outcome: 'refused',
      succeeded: [],
      failed: [],
      not_attempted: [ref],
      verification: nothingVerified(),
      summary: loaded.locked
        ? `Invoice ${group.invoice.invoice_number} is finalized, so nothing was re-priced.`
        : priced > MAX_PRICED
          ? `Pricing invoice ${group.invoice.invoice_number} would re-price ${priced} of the customer's tickets, so nothing was re-priced.`
          : `Invoice ${group.invoice.invoice_number} has more than ${MAX_LINES} tickets, so nothing was re-priced.`,
      entities: [ref],
    };
  }
  if (!loaded.plan.edits.length) {
    return {
      kind: 'action',
      outcome: 'done',
      succeeded: [],
      failed: [],
      not_attempted: [],
      verification: nothingVerified(),
      summary: 'Already up to date',
      entities: [ref],
    };
  }

  const wanted = loaded.plan.edits.map((edit) => ({ id: edit.id, ticket: edit.ticket }));
  await applyPeriodsToTickets(given.client, workspace, memberOf(ctx), loaded.scope);

  const after = await reReadRecords(
    given.client,
    workspace,
    wanted.map((edit) => edit.id),
  );
  const succeeded: EntityRef[] = [];
  const failed: { entity: EntityRef; reason: string }[] = [];
  const checks: { label: string; ok: boolean }[] = [];
  for (const edit of wanted) {
    const saved = after.get(edit.id);
    const ok =
      saved !== undefined &&
      saved.ticket.rate === edit.ticket.rate &&
      saved.ticket.fuel_charge === edit.ticket.fuel_charge;
    checks.push({ label: `Ticket #${edit.id} does not carry the agreed figures.`, ok });
    if (ok) succeeded.push(ticketRef(edit.id));
    else failed.push({ entity: ticketRef(edit.id), reason: 'The agreed figures are not on the ticket.' });
  }
  const verification = verifyAll(checks);
  const rebuilt: SavedRecord[] = group.records.map((record) => after.get(record.id) ?? record);
  const readiness = invoiceReadiness(
    invoiceGroups(rebuilt).find((candidate) => candidate.key === group.key) ?? group,
    loaded.customers,
    loaded.periods,
    false,
  );
  const summary = `Invoice ${group.invoice.invoice_number}: ${plural(
    succeeded.length,
    'ticket',
  )} re-priced, ${plural(loaded.plan.kept_manual, 'hand-priced ticket')} kept. Now ${readiness.status.replace(/_/g, ' ').toLowerCase()}.`;
  await recordAction(given.client, workspace, ctx, {
    tool: 'recalculate_invoice',
    summary,
    affected: succeeded.map((entity) => entity.id),
    invoiceKey: group.key,
    customerId: loaded.scope.customerId ?? null,
  });
  return {
    kind: 'action',
    outcome: settle(succeeded, failed, []),
    succeeded,
    failed,
    not_attempted: [],
    verification,
    before: { status: 'before re-pricing', tickets: wanted.length },
    after: { status: readiness.status, waiting_jobs: readiness.waiting_jobs.length },
    summary,
    entities: [ref, ...succeeded],
  };
}

export const recalculateInvoice = defineAction<RecalculateInvoiceInput>({
  name: 'recalculate_invoice',
  description:
    'Price a draft invoice from the rates on file, through the app\'s own pricing engine. Pricing ' +
    'is scoped to the customer, so other unpriced tickets of theirs are priced with it, and the ' +
    'preview says how many. Tickets somebody priced by hand are kept as they are, and a finalized ' +
    'invoice is refused.',
  input: {
    type: 'object',
    properties: {
      invoice_number: { type: 'string', description: 'The invoice number as it is printed.' },
    },
    required: ['invoice_number'],
    additionalProperties: false,
  },
  output: {
    type: 'object',
    properties: { outcome: { type: 'string' }, summary: { type: 'string' } },
    required: ['outcome', 'summary'],
    additionalProperties: false,
  },
  type: 'write',
  permission: 'invoices.recalculate',
  risk: 1,
  confirmation: 'conditional',
  maxRecords: MAX_PRICED,
  parse,
  dryRun: (input, ctx, given) => dryRun(input, ctx, deps(given)),
  handler: (input, ctx, given) => handler(input, ctx, deps(given)),
});
