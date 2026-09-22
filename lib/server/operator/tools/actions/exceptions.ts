import type { SupabaseClient } from '@supabase/supabase-js';
import {
  applyGroupAnswer,
  EXCEPTION_TYPES,
  groupExceptions,
  membersOf,
  type ExceptionGroup,
  type ExceptionType,
  type GroupAnswer,
} from '@/lib/load-desk/recovery/exceptions';
import { knowledgeOf } from '@/lib/load-desk/recovery/outcome';
import { parseRecordEdits } from '@/lib/load-desk/record-input';
import { invoiceKey, needsReview, ticketDay } from '@/lib/load-desk/records';
import type { SavedRecord, Ticket } from '@/lib/load-desk/types';
import { validateTicket } from '@/lib/load-desk/validate';
import type {
  ActionResult,
  EntityRef,
  ToolContext,
  ToolImpact,
  ToolResult,
} from '@/lib/operator/types';
import {
  getRecord,
  listProfiles,
  listRecordsBetween,
  updateRecords,
} from '@/lib/server/load-desk-store';
import { finalizedKeys } from '@/lib/server/operator/locks';
import { reReadRecords } from '@/lib/server/operator/verify';
import { exceptionRef, ticketRef } from './refs';
import {
  defineAction,
  deps,
  isObject,
  nothingVerified,
  plural,
  recordAction,
  rowId,
  settle,
  shortText,
  stateHash,
  verifyAll,
  windowAround,
  type Parsed,
} from './shared';

// The review screen's own question, answered from the Operator.
//
// Ten tickets from a job site nobody has saved are one question, not ten, and
// `groupExceptions` is what makes them one. Both tools here rebuild that
// grouping from the saved records — over the whole open backlog around those
// days, exactly as the desk builds it, so the group the Operator answers is
// the group a person would see — and then hand the answer to
// `applyGroupAnswer`, which is the only thing that decides what an answer does
// to a ticket.
//
// Three rules of this folder, in this file:
//
// The group has to be the group that was asked about. If the named tickets are
// not all members of one open question of that type, the tool refuses: a
// correction applied to the tickets the model happened to name, rather than to
// the ones the question is about, is a correction to the wrong tickets.
//
// A ticket on a finalized invoice is never written. It is reported as not
// attempted, with the invoice named, and it never reaches `updateRecords`.
//
// And nothing here marks a ticket checked. `applyGroupAnswer` builds edits as
// a person's, which would set `reviewed_at`; every edit leaving this file
// carries `bookkeeping`, so the human marks stay a human's. The Operator can
// settle what a ticket says; it cannot say that somebody looked at it.

/** The most tickets one answer may settle. */
const MAX_TICKETS = 25;

/**
 * A question whose answer is already on the record: the recovery layer read
 * the value and stood behind it, and the group exists only because a person
 * has not said yes. Anything ambiguous, conflicting, new or individual is a
 * question for a person and is refused by `resolve_ticket_exception`.
 */
const EVIDENT_TYPES = new Set<ExceptionType>(['CLIPPED_TEXT_RECOVERABLE']);

type Loaded = {
  records: SavedRecord[];
  group: ExceptionGroup | null;
  lockedIds: number[];
  missingIds: number[];
  invoiceOf: Map<number, { key: string; number: string }>;
};

/**
 * The named tickets, the open question they belong to, and which of them sit
 * on a finalized invoice. Read identically by the dry run and by the handler.
 */
async function load(
  client: SupabaseClient,
  workspace: string,
  ids: number[],
  type: ExceptionType,
  now: Date,
): Promise<Loaded> {
  const records: SavedRecord[] = [];
  const missingIds: number[] = [];
  for (const id of ids) {
    const record = await getRecord(client, workspace, id);
    if (record) records.push(record);
    else missingIds.push(id);
  }
  const invoiceOf = new Map(
    records.map((record) => [
      record.id,
      { key: invoiceKey(record.invoice.invoice_number), number: record.invoice.invoice_number },
    ]),
  );
  if (!records.length) {
    return { records, group: null, lockedIds: [], missingIds, invoiceOf };
  }
  const span = windowAround(
    records.map((record) => ticketDay(record.ticket.ticket_date)),
    now,
  );
  const [neighbours, profiles, locked] = await Promise.all([
    listRecordsBetween(client, workspace, span.from, span.to, 500),
    listProfiles(client, workspace),
    finalizedKeys(client, workspace),
  ]);
  // The named tickets as they stand now win over the listing's copy of them.
  const pool = new Map(neighbours.map((record) => [record.id, record]));
  for (const record of records) pool.set(record.id, record);
  const knowledge = knowledgeOf([...pool.values()], profiles);
  const members = membersOf([...pool.values()].filter(needsReview), knowledge, (record) =>
    validateTicket(record.ticket, record.recovery),
  );
  const group =
    groupExceptions(members).find(
      (candidate) =>
        candidate.type === type && ids.every((id) => candidate.ticketIds.includes(id)),
    ) ?? null;
  return {
    records,
    group,
    lockedIds: records
      .filter((record) => locked.has(invoiceKey(record.invoice.invoice_number)))
      .map((record) => record.id),
    missingIds,
    invoiceOf,
  };
}

/**
 * What the preview was taken from.
 *
 * The marks a record carries are not enough. These edits are the app's own
 * bookkeeping, so `applyRecordEdit` leaves `edited_at` exactly as it was, and
 * a confirmation card written before the Operator settled a group would still
 * match its fingerprint afterwards — and would write the old answer over the
 * newer one. So the current value of every field the answer targets is folded
 * in, for every record, with the links a correction can move.
 */
const fingerprint = (loaded: Loaded, values: Partial<Record<keyof Ticket, string>>) => {
  const targeted = Object.keys(values) as (keyof Ticket)[];
  return stateHash([
    loaded.records.map((record) => [
      record.id,
      record.edited_at ?? null,
      record.saved_at,
      record.reviewed_at ?? null,
      record.invoice.invoice_number,
      record.customer_profile_id ?? null,
      record.truck_id ?? null,
      targeted.map((field) => record.ticket[field] ?? null),
    ]),
    loaded.group?.key ?? null,
    values,
  ]);
};

/** The values a group carries its own answer to, or null when it has none. */
function evidentValues(group: ExceptionGroup): Partial<Record<keyof Ticket, string>> | null {
  if (!EVIDENT_TYPES.has(group.type)) return null;
  const values: Partial<Record<keyof Ticket, string>> = {};
  for (const ask of group.asks) {
    // A ticket's date moves it between invoices, which is a person's decision
    // and is made on the review screen.
    if (ask === 'ticket_date') return null;
    const candidates = group.candidates[ask] ?? [];
    if (candidates.length > 1) return null;
    const value = (candidates[0] ?? group.detected[ask] ?? '').trim();
    if (!value) return null;
    values[ask] = value;
  }
  return Object.keys(values).length ? values : null;
}

const groupLabel = (group: ExceptionGroup) =>
  `${group.type.toLowerCase().replace(/_/g, ' ')}${group.customer ? ` · ${group.customer}` : ''}`;

const describe = (values: Partial<Record<keyof Ticket, string>>) =>
  Object.entries(values)
    .map(([field, value]) => `${field.replace(/_/g, ' ')} ${value}`)
    .join(', ');

/** The blockers that stop either tool before anything is read further. */
function blockersFor(
  loaded: Loaded,
  type: ExceptionType,
  values: Partial<Record<keyof Ticket, string>> | null,
): string[] {
  const blockers: string[] = [];
  for (const id of loaded.missingIds) blockers.push(`No ticket #${id}`);
  if (!loaded.group) {
    blockers.push(`Those tickets are not one open ${type.toLowerCase().replace(/_/g, ' ')} question.`);
    return blockers;
  }
  if (values === null) return blockers;
  for (const field of Object.keys(values)) {
    if (!loaded.group.asks.includes(field as keyof Ticket)) {
      blockers.push(`That question does not ask about ${field.replace(/_/g, ' ')}.`);
    }
  }
  return blockers;
}

/** The dry run both tools share, once their answer is known. */
function impactOf(
  loaded: Loaded,
  type: ExceptionType,
  values: Partial<Record<keyof Ticket, string>> | null,
  extraBlockers: string[],
): ToolImpact {
  const blockers = [...blockersFor(loaded, type, values), ...extraBlockers];
  const locked = new Set(loaded.lockedIds);
  const writable = loaded.records.filter((record) => !locked.has(record.id));
  const affected: EntityRef[] = loaded.records.map((record) => ticketRef(record.id));
  if (loaded.group) affected.push(exceptionRef(loaded.group.key, groupLabel(loaded.group)));
  // A locked ticket is left out of the write, not a reason to refuse the rest:
  // the answer still settles its siblings. Only a question every one of whose
  // tickets is billed has nothing left to do.
  if (loaded.records.length && locked.size === loaded.records.length) {
    blockers.push(
      `Every one of those tickets is on a finalized invoice (${[
        ...new Set(loaded.lockedIds.map((id) => loaded.invoiceOf.get(id)?.number ?? '')),
      ]
        .filter(Boolean)
        .join(', ')}).`,
    );
  }
  const lines =
    values && writable.length
      ? [`${plural(writable.length, 'ticket')} → ${describe(values)}`]
      : ['Nothing to correct'];
  if (loaded.lockedIds.length) {
    lines.push(`${plural(loaded.lockedIds.length, 'ticket')} on a finalized invoice, left alone`);
  }
  return {
    records: values && !blockers.length ? writable.length : 0,
    touches_finalized: loaded.lockedIds.length > 0,
    lines,
    affected,
    blockers,
    state_hash: fingerprint(loaded, values ?? {}),
  };
}

/** The write both tools share, once their answer is known. */
async function applyAnswer(
  tool: string,
  loaded: Loaded,
  values: Partial<Record<keyof Ticket, string>>,
  ctx: ToolContext,
  client: SupabaseClient,
): Promise<ActionResult> {
  const workspace = ctx.workspaceId;
  const group = loaded.group;
  const locked = new Set(loaded.lockedIds);
  const notAttempted = loaded.lockedIds.map((id) => ticketRef(id));
  const writable = loaded.records.filter((record) => !locked.has(record.id));
  const entities: EntityRef[] = loaded.records.map((record) => ticketRef(record.id));
  if (group) entities.push(exceptionRef(group.key, groupLabel(group)));
  if (!group || !writable.length) {
    return {
      kind: 'action',
      outcome: 'refused',
      succeeded: [],
      failed: [],
      not_attempted: notAttempted.length
        ? notAttempted
        : loaded.records.map((record) => ticketRef(record.id)),
      verification: nothingVerified(),
      summary: group
        ? 'Every ticket in that question is on a finalized invoice, so none was changed.'
        : 'Those tickets are no longer one open question, so nothing was changed.',
      entities,
    };
  }

  // The answer is applied to the tickets that may be written, and the group is
  // narrowed to them so the evidence line on each record says how many tickets
  // this answer actually settled.
  const scoped: ExceptionGroup = { ...group, ticketIds: writable.map((record) => record.id) };
  const answer: GroupAnswer = { values, customerProfileId: group.customerProfileId };
  const edits = applyGroupAnswer(writable, scoped, answer, ctx.now.toISOString()).map((edit) => ({
    ...edit,
    // See the note at the top of this file: the Operator settles the value, it
    // does not say a person checked the ticket.
    bookkeeping: true as const,
  }));
  const checked = parseRecordEdits(edits);
  if ('error' in checked) {
    return {
      kind: 'action',
      outcome: 'failed',
      succeeded: [],
      failed: writable.map((record) => ({ entity: ticketRef(record.id), reason: checked.error })),
      not_attempted: notAttempted,
      verification: nothingVerified(),
      summary: `The correction was refused: ${checked.error}`,
      entities,
    };
  }
  await updateRecords(client, workspace, checked.value);

  const after = await reReadRecords(
    client,
    workspace,
    writable.map((record) => record.id),
  );
  const succeeded: EntityRef[] = [];
  const failed: { entity: EntityRef; reason: string }[] = [];
  const checks: { label: string; ok: boolean }[] = [];
  for (const record of writable) {
    const saved = after.get(record.id);
    const wrong = Object.entries(values).filter(([field, value]) => {
      const wanted = value.trim() || null;
      return !saved || saved.ticket[field as keyof Ticket] !== wanted;
    });
    const label = `Ticket #${record.id} does not read back with ${describe(values)}.`;
    checks.push({ label, ok: wrong.length === 0 });
    if (wrong.length === 0) succeeded.push(ticketRef(record.id));
    else failed.push({ entity: ticketRef(record.id), reason: label });
  }
  const verification = verifyAll(checks);
  const summary = `${plural(succeeded.length, 'ticket')} settled: ${describe(values)}.${
    notAttempted.length ? ` ${plural(notAttempted.length, 'ticket')} on a finalized invoice left alone.` : ''
  }`;
  await recordAction(client, workspace, ctx, {
    tool,
    summary,
    affected: succeeded.map((entity) => entity.id),
    customerId: group.customerProfileId,
  });
  return {
    kind: 'action',
    outcome: settle(succeeded, failed, notAttempted),
    succeeded,
    failed,
    not_attempted: notAttempted,
    verification,
    before: writable.map((record) => ({
      id: record.id,
      ...Object.fromEntries(
        Object.keys(values).map((field) => [field, record.ticket[field as keyof Ticket]]),
      ),
    })),
    after: writable.map((record) => ({ id: record.id, ...values })),
    summary,
    entities,
  };
}

// ------------------------------------------- apply_group_ticket_correction

export type GroupCorrectionInput = {
  exception_type: ExceptionType;
  ticket_ids: number[];
  answer: { field: string; value: string };
};

const parseIds = (value: unknown): number[] | null => {
  if (!Array.isArray(value) || !value.length || value.length > MAX_TICKETS) return null;
  const ids: number[] = [];
  for (const item of value) {
    const id = rowId(item);
    if (id === null || ids.includes(id)) return null;
    ids.push(id);
  }
  return ids;
};

const parseType = (value: unknown): ExceptionType | null =>
  typeof value === 'string' && (EXCEPTION_TYPES as readonly string[]).includes(value)
    ? (value as ExceptionType)
    : null;

const parseCorrection = (args: unknown): Parsed<GroupCorrectionInput> => {
  if (!isObject(args)) return { error: 'Expected an exception type, ticket ids and an answer.' };
  const type = parseType(args.exception_type);
  if (!type) return { error: `exception_type must be one of ${EXCEPTION_TYPES.join(', ')}.` };
  const ids = parseIds(args.ticket_ids);
  if (!ids) return { error: `ticket_ids must be 1 to ${MAX_TICKETS} different saved ticket ids.` };
  if (!isObject(args.answer)) return { error: 'answer must name a field and a value.' };
  const field = shortText(args.answer.field, 60);
  const value = shortText(args.answer.value, 200);
  if (!field) return { error: 'answer.field must name the field to settle.' };
  if (!value) return { error: 'answer.value must be the value to write.' };
  if (field === 'ticket_date') {
    return { error: "A ticket's date is set on the review screen, because it moves the ticket between invoices." };
  }
  return { value: { exception_type: type, ticket_ids: ids, answer: { field, value } } };
};

const correctionValues = (input: GroupCorrectionInput): Partial<Record<keyof Ticket, string>> => ({
  [input.answer.field as keyof Ticket]: input.answer.value,
});

export const applyGroupTicketCorrection = defineAction<GroupCorrectionInput>({
  name: 'apply_group_ticket_correction',
  description:
    'Answer one open review question for the tickets it covers — the job site, the project, the ' +
    'customer name as a person would type it — and write that answer onto every one of them. The ' +
    'named tickets must all belong to one open question of the given type. Tickets on a finalized ' +
    'invoice are never changed, and no ticket is marked as checked by a person.',
  input: {
    type: 'object',
    properties: {
      exception_type: {
        type: 'string',
        enum: [...EXCEPTION_TYPES],
        description: 'The kind of open question these tickets raise.',
      },
      ticket_ids: {
        type: 'array',
        items: { type: 'integer' },
        maxItems: MAX_TICKETS,
        description: 'The saved tickets the one answer settles.',
      },
      answer: {
        type: 'object',
        properties: {
          field: { type: 'string', description: 'The ticket field to settle, such as project_address.' },
          value: { type: 'string', description: 'The value a person would type.' },
        },
        required: ['field', 'value'],
        additionalProperties: false,
      },
    },
    required: ['exception_type', 'ticket_ids', 'answer'],
    additionalProperties: false,
  },
  output: {
    type: 'object',
    properties: { outcome: { type: 'string' }, summary: { type: 'string' } },
    required: ['outcome', 'summary'],
    additionalProperties: false,
  },
  type: 'write',
  permission: 'tickets.correct',
  risk: 2,
  confirmation: 'conditional',
  maxRecords: MAX_TICKETS,
  parse: parseCorrection,
  dryRun: async (input, ctx, given): Promise<ToolImpact> => {
    const { client } = deps(given);
    const loaded = await load(client, ctx.workspaceId, input.ticket_ids, input.exception_type, ctx.now);
    return impactOf(loaded, input.exception_type, correctionValues(input), []);
  },
  handler: async (input, ctx, given): Promise<ToolResult> => {
    const { client } = deps(given);
    const loaded = await load(client, ctx.workspaceId, input.ticket_ids, input.exception_type, ctx.now);
    const values = correctionValues(input);
    const blockers = blockersFor(loaded, input.exception_type, values);
    if (blockers.length) {
      return {
        kind: 'action',
        outcome: 'refused',
        succeeded: [],
        failed: [],
        not_attempted: input.ticket_ids.map((id) => ticketRef(id)),
        verification: nothingVerified(),
        summary: blockers.join(' '),
        entities: input.ticket_ids.map((id) => ticketRef(id)),
      };
    }
    return applyAnswer('apply_group_ticket_correction', loaded, values, ctx, client);
  },
});

// ------------------------------------------------- resolve_ticket_exception

export type ResolveExceptionInput = {
  exception_type: ExceptionType;
  ticket_ids: number[];
  accept_suggested: true;
};

const parseResolve = (args: unknown): Parsed<ResolveExceptionInput> => {
  if (!isObject(args)) return { error: 'Expected an exception type and ticket ids.' };
  const type = parseType(args.exception_type);
  if (!type) return { error: `exception_type must be one of ${EXCEPTION_TYPES.join(', ')}.` };
  const ids = parseIds(args.ticket_ids);
  if (!ids) return { error: `ticket_ids must be 1 to ${MAX_TICKETS} different saved ticket ids.` };
  if (args.accept_suggested !== true) {
    return { error: 'accept_suggested must be true: this tool only accepts the answer already on the record.' };
  }
  return { value: { exception_type: type, ticket_ids: ids, accept_suggested: true } };
};

const NEEDS_A_PERSON = "This exception needs a person's answer";

export const resolveTicketException = defineAction<ResolveExceptionInput>({
  name: 'resolve_ticket_exception',
  description:
    "Accept the answer the recovery layer already stands behind for an open review question, for " +
    'the tickets it covers. Only for questions whose value is evident from the record — anything ' +
    "ambiguous, conflicting or new needs a person's answer and is refused.",
  input: {
    type: 'object',
    properties: {
      exception_type: {
        type: 'string',
        enum: [...EXCEPTION_TYPES],
        description: 'The kind of open question these tickets raise.',
      },
      ticket_ids: {
        type: 'array',
        items: { type: 'integer' },
        maxItems: MAX_TICKETS,
        description: 'The saved tickets the question covers.',
      },
      accept_suggested: {
        type: 'boolean',
        description: 'Always true: the value comes from the record, never from the model.',
      },
    },
    required: ['exception_type', 'ticket_ids', 'accept_suggested'],
    additionalProperties: false,
  },
  output: {
    type: 'object',
    properties: { outcome: { type: 'string' }, summary: { type: 'string' } },
    required: ['outcome', 'summary'],
    additionalProperties: false,
  },
  type: 'write',
  permission: 'exceptions.resolve',
  risk: 1,
  confirmation: 'conditional',
  maxRecords: MAX_TICKETS,
  parse: parseResolve,
  dryRun: async (input, ctx, given): Promise<ToolImpact> => {
    const { client } = deps(given);
    const loaded = await load(client, ctx.workspaceId, input.ticket_ids, input.exception_type, ctx.now);
    const values = loaded.group ? evidentValues(loaded.group) : null;
    return impactOf(
      loaded,
      input.exception_type,
      values,
      loaded.group && !values ? [NEEDS_A_PERSON] : [],
    );
  },
  handler: async (input, ctx, given): Promise<ToolResult> => {
    const { client } = deps(given);
    const loaded = await load(client, ctx.workspaceId, input.ticket_ids, input.exception_type, ctx.now);
    const values = loaded.group ? evidentValues(loaded.group) : null;
    const blockers = [
      ...blockersFor(loaded, input.exception_type, values),
      ...(loaded.group && !values ? [NEEDS_A_PERSON] : []),
    ];
    if (blockers.length || !values) {
      return {
        kind: 'action',
        outcome: 'refused',
        succeeded: [],
        failed: [],
        not_attempted: input.ticket_ids.map((id) => ticketRef(id)),
        verification: nothingVerified(),
        summary: (blockers.length ? blockers : [NEEDS_A_PERSON]).join(' '),
        entities: input.ticket_ids.map((id) => ticketRef(id)),
      };
    }
    return applyAnswer('resolve_ticket_exception', loaded, values, ctx, client);
  },
});
