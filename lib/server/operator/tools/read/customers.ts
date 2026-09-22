import type { EntityRef, ToolDefinition } from '@/lib/operator/types';
import { normalizeKey, normalizeName } from '@/lib/load-desk/profiles';
import { recordTons } from '@/lib/load-desk/records';
import { jobKeyOf, jobsWorked, resolveRate } from '@/lib/load-desk/rates';
import { listProfiles, listRecordsBetween } from '@/lib/server/load-desk-store';
import { listPeriods } from '@/lib/server/rates-store';
import { customerRef, projectRef } from './refs';
import {
  bounded,
  capped,
  customerView,
  deps,
  FREE_OUTPUT,
  identifier,
  isoDay,
  nullableString,
  parser,
  positiveInt,
  readTool,
  shiftDays,
  strictInput,
} from './shared';

// Customers and the jobs their loads go to. A customer profile is the
// workspace's own record of who it hauls for: its numbers on the tickets, the
// sites it delivers to and what each of them is charged. Contacts are the one
// part held back — counted in a search, spelled out only when a person asked
// for that customer by name.

/** How far back a job's work is counted. */
const JOB_DAYS = 120;
const READ_LIMIT = 1000;
const MAX_ENTITIES = 20;

// ------------------------------------------------------- search customers

type SearchInput = { query: string | null; limit: number };

export const searchCustomers: ToolDefinition = readTool<SearchInput>({
  name: 'search_customers',
  description:
    'Customer profiles in this workspace, by name, ticket name or customer number. Omit the query for all of them.',
  input: strictInput({
    query: nullableString('All or part of a customer name, ticket name or customer number.'),
    limit: { type: 'integer', description: 'How many customers to return, 1 to 50.', minimum: 1, maximum: 50 },
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'customers.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<SearchInput>((fields) => ({
    query: bounded(fields, 'query', 120),
    limit: positiveInt(fields, 'limit', 1, 50, 20),
  })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const { customers } = await listProfiles(client, ctx.workspaceId);
    const wantedName = input.query ? normalizeName(input.query) : null;
    const wantedKey = input.query ? normalizeKey(input.query) : null;
    const matched = customers.filter((customer) => {
      if (!wantedName || !wantedKey) return true;
      const names = [customer.name, ...customer.ticket_names].map(normalizeName);
      if (names.some((name) => name.includes(wantedName))) return true;
      return customer.ticket_customer_ids.some((id) => normalizeKey(id).includes(wantedKey));
    });
    const page = capped(matched, input.limit);
    return {
      kind: 'read',
      data: {
        found: page.total,
        shown: page.items.length,
        truncated: page.truncated,
        customers: page.items.map(customerView),
      },
      summary: `${page.total} customers${input.query ? ` matching “${input.query}”` : ''}.`,
      entities: page.items
        .slice(0, MAX_ENTITIES)
        .map((customer) => customerRef(customer.id, customer.name)),
    };
  },
});

// ---------------------------------------------------------- one customer

type CustomerInput = { customer_id: number };

export const getCustomer: ToolDefinition = readTool<CustomerInput>({
  name: 'get_customer',
  description:
    'One customer profile in full: the names and numbers its tickets are printed with, the sites it delivers to, what each site is charged, how it is asked for rates and who is written to.',
  input: strictInput({
    customer_id: { type: 'integer', description: 'The customer profile id.', minimum: 1 },
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'customers.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<CustomerInput>((fields) => ({ customer_id: identifier(fields, 'customer_id') })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const { customers } = await listProfiles(client, ctx.workspaceId);
    const customer = customers.find((candidate) => candidate.id === input.customer_id);
    if (!customer) {
      return {
        kind: 'read',
        data: { found: false, customer_id: input.customer_id },
        summary: `No customer ${input.customer_id} in this workspace.`,
        entities: [],
      };
    }
    return {
      kind: 'read',
      data: {
        found: true,
        customer: customerView(customer),
        // The workspace's own address book, for a person who asked for this
        // customer by name. Never listed in a search.
        rate_contacts: (customer.rate_contacts ?? []).map((contact) => ({
          name: contact.name,
          email: contact.email,
          title: contact.title,
          primary: contact.primary,
        })),
        notes: customer.notes,
      },
      summary: `${customer.name}: ${(customer.addresses ?? []).length} sites, ${(customer.rate_contacts ?? []).length} rate contacts.`,
      entities: [customerRef(customer.id, customer.name)],
    };
  },
});

// ------------------------------------------------------------- one project

type ProjectInput = { job_key: string | null; project_address: string | null };

export const getProject: ToolDefinition = readTool<ProjectInput>({
  name: 'get_project',
  description:
    'What a job site has had hauled to it over the last 120 days, whose it is, and what its hauling rate and fuel surcharge resolve to today.',
  input: strictInput({
    job_key: nullableString('The job key, as other results give it.'),
    project_address: nullableString('The delivery address, if the key is not to hand.'),
  }),
  output: FREE_OUTPUT,
  type: 'read',
  permission: 'customers.read',
  risk: 0,
  confirmation: 'never',
  parse: parser<ProjectInput>((fields) => ({
    job_key: bounded(fields, 'job_key', 200),
    project_address: bounded(fields, 'project_address', 200),
  })),
  handler: async (input, ctx, given) => {
    const { client } = deps(given);
    const key = input.job_key ? jobKeyOf(input.job_key) : jobKeyOf(input.project_address);
    const to = isoDay(ctx.now);
    const from = shiftDays(to, -(JOB_DAYS - 1));
    if (!key) {
      return {
        kind: 'read',
        data: { found: false, searched: { from, to } },
        summary: 'A job needs either a job key or a delivery address.',
        entities: [],
      };
    }
    const records = await listRecordsBetween(client, ctx.workspaceId, from, to, READ_LIMIT);
    const { customers } = await listProfiles(client, ctx.workspaceId);
    const periods = await listPeriods(client, ctx.workspaceId);
    const jobs = jobsWorked(records, customers, from, to).filter((job) => job.job_key === key);
    if (!jobs.length) {
      return {
        kind: 'read',
        data: { found: false, job_key: key, searched: { from, to } },
        summary: `No loads to that job between ${from} and ${to}; older work was not read.`,
        entities: [],
      };
    }
    const tonsOf = (ids: number[]) => {
      const wanted = new Set(ids);
      return (
        Math.round(
          records
            .filter((record) => wanted.has(record.id))
            .reduce((sum, record) => sum + recordTons(record), 0) * 100,
        ) / 100
      );
    };
    const shaped = jobs.map((job) => {
      const customer = customers.find(({ id }) => id === job.customer_profile_id);
      const base = resolveRate(periods, job.customer_profile_id, key, 'base', to);
      const fuel = resolveRate(periods, job.customer_profile_id, key, 'fuel', to);
      return {
        job_key: job.job_key,
        job_label: job.job_label,
        customer: customer ? { id: customer.id, name: customer.name } : null,
        loads: job.ticket_count,
        tons: tonsOf(job.ticket_ids),
        first_date: job.first_date,
        last_date: job.last_date,
        base_rate_today: base
          ? { value: base.value, rate_type: base.rate_type, effective_from: base.effective_from, effective_to: base.effective_to }
          : null,
        fuel_rate_today: fuel
          ? { value: fuel.value, fuel_type: fuel.fuel_type, effective_from: fuel.effective_from, effective_to: fuel.effective_to }
          : null,
      };
    });
    const entities: EntityRef[] = [projectRef(key, shaped[0].job_label)];
    for (const job of shaped) {
      if (job.customer) entities.push(customerRef(job.customer.id, job.customer.name));
    }
    const loads = shaped.reduce((sum, job) => sum + job.loads, 0);
    return {
      kind: 'read',
      data: { found: true, job_key: key, searched: { from, to }, jobs: shaped },
      summary: `${shaped[0].job_label}: ${loads} loads between ${from} and ${to}.`,
      entities: entities.slice(0, MAX_ENTITIES),
    };
  },
});

export const CUSTOMER_TOOLS: ToolDefinition[] = [searchCustomers, getCustomer, getProject];
