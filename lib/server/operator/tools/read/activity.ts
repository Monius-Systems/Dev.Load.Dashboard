import type { ToolDefinition } from '@/lib/operator/types';
import { listEvents } from '@/lib/server/rates-store';
import { listProfiles } from '@/lib/server/load-desk-store';
import { customerRef, invoiceRef } from './refs';
import type { EntityRef } from '@/lib/operator/types';
import {
  deps,
  FREE_OUTPUT,
  optionalIdentifier,
  parser,
  positiveInt,
  readTool,
  strictInput,
} from './shared';

// What has happened lately: the rate agent's trail, which is also where an
// invoice being finalized and an Operator run's own writes are recorded. The
// trail is appended and never edited, so it is the one honest account of who
// did what.

const MAX_ENTITIES = 20;

/**
 * Who did it. An event written by an Operator run says so in its actor; an
 * event with no actor at all was the app's own doing, on a schedule or in
 * response to something arriving; everything else was a person.
 */
function actorKind(actor: string | null): 'person' | 'operator' | 'system' {
  const value = (actor ?? '').trim().toLowerCase();
  if (!value) return 'system';
  if (value === 'operator' || value.startsWith('operator:')) return 'operator';
  if (value === 'system' || value === 'auto' || value === 'agent') return 'system';
  return 'person';
}

type Input = { limit: number; customer_id: number | null };

export const getRecentActivity: ToolDefinition = readTool<Input>({
  name: 'get_recent_activity',
  description:
    'The most recent entries in the workspace trail: rate requests and replies, rates applied, invoices finalized or unlocked, and anything the Operator itself did.',
  input: strictInput({
    limit: { type: 'integer', description: 'How many entries to return, 1 to 100.', minimum: 1, maximum: 100 },
    customer_id: { type: ['integer', 'null'], description: 'One customer, or null for the whole workspace.' },
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'system.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<Input>((fields) => ({
    limit: positiveInt(fields, 'limit', 1, 100, 25),
    customer_id: optionalIdentifier(fields, 'customer_id'),
  })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const events = await listEvents(client, ctx.workspaceId, {
      limit: input.limit,
      ...(input.customer_id === null ? {} : { customerId: input.customer_id }),
    });
    const { customers } = await listProfiles(client, ctx.workspaceId);
    const entities: EntityRef[] = [];
    const seen = new Set<string>();
    const shaped = events.map((event) => {
      const customer = customers.find(({ id }) => id === event.customer_profile_id);
      if (customer && !seen.has(`c${customer.id}`) && entities.length < MAX_ENTITIES) {
        seen.add(`c${customer.id}`);
        entities.push(customerRef(customer.id, customer.name));
      }
      if (event.invoice_key && !seen.has(`i${event.invoice_key}`) && entities.length < MAX_ENTITIES) {
        seen.add(`i${event.invoice_key}`);
        entities.push(invoiceRef(event.invoice_key, event.invoice_key));
      }
      return {
        at: event.at,
        kind: event.kind,
        detail: event.detail,
        actor: actorKind(event.actor),
        customer_name: customer?.name ?? null,
        invoice_key: event.invoice_key,
      };
    });
    return {
      kind: 'read',
      data: { count: shaped.length, events: shaped },
      summary: `${shaped.length} recent entries in the workspace trail.`,
      entities,
    };
  },
});

export const ACTIVITY_TOOLS: ToolDefinition[] = [getRecentActivity];
