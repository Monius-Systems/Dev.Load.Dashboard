import type { SupabaseClient } from '@supabase/supabase-js';
import { matchCustomer, type CustomerProfile } from '@/lib/load-desk/profiles';
import { rerecoverSaved } from '@/lib/load-desk/recovery/queue';
import { parseRecordEdits, type RecordEdit } from '@/lib/load-desk/record-input';
import { invoiceKey, ticketDay } from '@/lib/load-desk/records';
import type { SavedRecord, Ticket } from '@/lib/load-desk/types';
import type { ToolContext, ToolImpact, ToolResult } from '@/lib/operator/types';
import {
  getRecord,
  listProfiles,
  listRecordsBetween,
  updateRecords,
} from '@/lib/server/load-desk-store';
import { isFinalized } from '@/lib/server/operator/locks';
import { reReadRecords } from '@/lib/server/operator/verify';
import { invoiceRef, ticketRef } from './refs';
import {
  defineAction,
  deps,
  isObject,
  nothingVerified,
  recordAction,
  rowId,
  stateHash,
  verifyAll,
  windowAround,
  type ActionDeps,
  type Parsed,
} from './shared';

// Looking at one saved ticket again under today's rules.
//
// A ticket is filed with the verdict of the day it was read, and a verdict can
// be wrong in a way that is later put right — the reader learns a misprint, the
// workspace learns a customer, a job site is saved. `rerecoverSaved` is the
// existing answer to that, and it is the only thing this tool does: the fields
// still waiting on a person are put back in front of the resolver, and where
// the answer has changed the ticket is saved with it.
//
// Two things it will not do. It will not touch a ticket on a finalized
// invoice. And it will not mark the ticket checked: reprocessing is the app's
// own bookkeeping, not a person holding the photograph beside the figures, so
// the edit carries `bookkeeping` and the human marks stay exactly as they were.

export type ReprocessInput = { ticket_id: number };

type Loaded = {
  record: SavedRecord;
  again: { ticket: Ticket; recovery: SavedRecord['recovery'] };
  changedFields: (keyof Ticket)[];
  locked: boolean;
  invoice: string;
};

/** The fields whose value the reconsideration would actually change. */
const differing = (before: Ticket, after: Ticket): (keyof Ticket)[] =>
  (Object.keys(after) as (keyof Ticket)[]).filter((field) => before[field] !== after[field]);

/**
 * Everything the dry run and the handler both need, read the same way in both
 * so that the second look cannot act on the first one's picture.
 */
async function load(
  client: SupabaseClient,
  workspace: string,
  id: number,
  now: Date,
): Promise<Loaded | null> {
  const record = await getRecord(client, workspace, id);
  if (!record) return null;
  const invoice = invoiceKey(record.invoice.invoice_number);
  const locked = await isFinalized(client, workspace, invoice);
  if (!record.recovery) {
    return { record, again: { ticket: record.ticket, recovery: undefined }, changedFields: [], locked, invoice };
  }
  const span = windowAround([ticketDay(record.ticket.ticket_date)], now);
  const [neighbours, profiles] = await Promise.all([
    listRecordsBetween(client, workspace, span.from, span.to, 500),
    listProfiles(client, workspace),
  ]);
  const customer: CustomerProfile | null =
    profiles.customers.find((known) => known.id === record.customer_profile_id) ??
    matchCustomer(profiles.customers, record.ticket);
  const again = rerecoverSaved({
    ticket: record.ticket,
    recovery: record.recovery,
    records: neighbours,
    profiles,
    customer,
  });
  const same =
    JSON.stringify([record.ticket, record.recovery]) ===
    JSON.stringify([again.ticket, again.recovery]);
  return {
    record,
    again,
    changedFields: same ? [] : differing(record.ticket, again.ticket),
    locked,
    invoice,
  };
}

/**
 * What the preview was taken from.
 *
 * A bookkeeping edit does not stamp `edited_at` — that is the point of it —
 * so the marks a record carries are not enough on their own: after the
 * Operator had written an answer, a pending confirmation from before it would
 * still match its fingerprint and could write the old answer over the new one.
 * The values themselves are therefore folded in, on both sides of the change,
 * along with the links a correction can move.
 */
const fingerprint = (loaded: Loaded) =>
  stateHash([
    loaded.record.id,
    loaded.record.edited_at ?? null,
    loaded.record.saved_at,
    loaded.record.invoice.invoice_number,
    loaded.record.customer_profile_id ?? null,
    loaded.record.truck_id ?? null,
    loaded.changedFields,
    loaded.changedFields.map((field) => [
      String(field),
      loaded.record.ticket[field] ?? null,
      loaded.again.ticket[field] ?? null,
    ]),
  ]);

const parse = (args: unknown): Parsed<ReprocessInput> => {
  if (!isObject(args)) return { error: 'Expected a ticket id.' };
  const id = rowId(args.ticket_id);
  if (id === null) return { error: 'ticket_id must be the number of a saved ticket.' };
  return { value: { ticket_id: id } };
};

async function dryRun(
  input: ReprocessInput,
  ctx: ToolContext,
  given: ActionDeps,
): Promise<ToolImpact> {
  const loaded = await load(given.client, ctx.workspaceId, input.ticket_id, ctx.now);
  if (!loaded) {
    return {
      records: 0,
      touches_finalized: false,
      lines: [],
      affected: [],
      blockers: [`No ticket #${input.ticket_id}`],
      state_hash: stateHash(['missing', input.ticket_id]),
    };
  }
  const ticket = ticketRef(loaded.record.id);
  const blockers = loaded.locked
    ? [`Invoice ${loaded.record.invoice.invoice_number} is finalized; its tickets cannot be changed.`]
    : [];
  const changed = loaded.changedFields.length > 0;
  return {
    records: changed && !loaded.locked ? 1 : 0,
    touches_finalized: loaded.locked,
    lines: changed
      ? [`Ticket #${loaded.record.id}: ${loaded.changedFields.join(', ')} would be settled.`]
      : ['Nothing to reprocess'],
    affected: [ticket, invoiceRef(loaded.invoice, loaded.record.invoice.invoice_number)],
    blockers,
    state_hash: fingerprint(loaded),
  };
}

async function handler(
  input: ReprocessInput,
  ctx: ToolContext,
  given: ActionDeps,
): Promise<ToolResult> {
  const { client } = given;
  const workspace = ctx.workspaceId;
  const loaded = await load(client, workspace, input.ticket_id, ctx.now);
  const ticket = ticketRef(input.ticket_id);
  if (!loaded) {
    return {
      kind: 'action',
      outcome: 'failed',
      succeeded: [],
      failed: [{ entity: ticket, reason: `No ticket #${input.ticket_id}` }],
      not_attempted: [],
      verification: nothingVerified(),
      summary: `There is no ticket #${input.ticket_id}.`,
      entities: [ticket],
    };
  }
  const invoice = invoiceRef(loaded.invoice, loaded.record.invoice.invoice_number);
  // The safety check again, at the moment of writing: the dry run's answer is
  // a moment old, and an invoice finalized in between is finalized.
  if (loaded.locked) {
    return {
      kind: 'action',
      outcome: 'refused',
      succeeded: [],
      failed: [],
      not_attempted: [ticketRef(loaded.record.id)],
      verification: nothingVerified(),
      summary: `Invoice ${loaded.record.invoice.invoice_number} is finalized, so ticket #${loaded.record.id} was left alone.`,
      entities: [ticketRef(loaded.record.id), invoice],
    };
  }
  if (!loaded.changedFields.length) {
    return {
      kind: 'action',
      outcome: 'done',
      succeeded: [],
      failed: [],
      not_attempted: [],
      verification: nothingVerified(),
      summary: `Ticket #${loaded.record.id} already reads as well as the evidence allows.`,
      entities: [ticketRef(loaded.record.id)],
    };
  }

  const { record, again } = loaded;
  const edit: RecordEdit = {
    id: record.id,
    ticket: again.ticket,
    invoice: record.invoice,
    ocr_text: record.ocr_text,
    customer_profile_id: record.customer_profile_id ?? null,
    truck_id: record.truck_id ?? null,
    ...(again.recovery ? { recovery: again.recovery } : {}),
    // Reprocessing is not a review. See the note at the top of this file.
    bookkeeping: true,
  };
  // Through the same parser the save route uses, so a change the Operator makes
  // is held to exactly the rules a change a person makes is held to.
  const checked = parseRecordEdits([edit]);
  if ('error' in checked) {
    return {
      kind: 'action',
      outcome: 'failed',
      succeeded: [],
      failed: [{ entity: ticketRef(record.id), reason: checked.error }],
      not_attempted: [],
      verification: nothingVerified(),
      summary: `Ticket #${record.id} could not be reprocessed: ${checked.error}`,
      entities: [ticketRef(record.id)],
    };
  }
  await updateRecords(client, workspace, checked.value);

  const after = (await reReadRecords(client, workspace, [record.id])).get(record.id);
  const verification = verifyAll(
    loaded.changedFields.map((field) => ({
      label: `Ticket #${record.id}: ${String(field)} did not take the new value.`,
      ok: after !== undefined && after.ticket[field] === again.ticket[field],
    })),
  );
  const passed = verification.passed === verification.checked;
  const before: Record<string, unknown> = {};
  const now: Record<string, unknown> = {};
  for (const field of loaded.changedFields) {
    before[String(field)] = record.ticket[field];
    now[String(field)] = again.ticket[field];
  }
  const summary = passed
    ? `Ticket #${record.id} reprocessed: ${loaded.changedFields.join(', ')} settled.`
    : `Ticket #${record.id} was saved but does not read back as expected.`;
  await recordAction(client, workspace, ctx, {
    tool: 'reprocess_ticket',
    summary,
    affected: [record.id],
    invoiceKey: loaded.invoice,
  });
  return {
    kind: 'action',
    outcome: passed ? 'done' : 'failed',
    succeeded: passed ? [ticketRef(record.id)] : [],
    failed: passed
      ? []
      : [{ entity: ticketRef(record.id), reason: verification.failures.join(' ') }],
    not_attempted: [],
    verification,
    before,
    after: now,
    summary,
    entities: [ticketRef(record.id), invoice],
  };
}

export const reprocessTicket = defineAction<ReprocessInput>({
  name: 'reprocess_ticket',
  description:
    'Look at one saved ticket again under the rules and the workspace memory as they stand now, ' +
    'and save any field the evidence now settles. Never marks the ticket checked, and never ' +
    'touches a ticket on a finalized invoice.',
  input: {
    type: 'object',
    properties: {
      ticket_id: { type: 'integer', description: 'The saved ticket to reconsider.' },
    },
    required: ['ticket_id'],
    additionalProperties: false,
  },
  output: {
    type: 'object',
    properties: {
      outcome: { type: 'string' },
      summary: { type: 'string' },
    },
    required: ['outcome', 'summary'],
    additionalProperties: false,
  },
  type: 'write',
  permission: 'tickets.reprocess',
  risk: 1,
  confirmation: 'conditional',
  maxRecords: 1,
  parse,
  dryRun: (input, ctx, given) => dryRun(input, ctx, deps(given)),
  handler: (input, ctx, given) => handler(input, ctx, deps(given)),
});
