import type { OperatorResponse } from '@/lib/operator/types';
import { runOperator, type RunDeps } from './run.ts';

// The standing questions: the ones a dispatcher would ask every morning if
// there were time to ask them.
//
// An operator who only answers when spoken to is a search box with opinions.
// What makes it operational is that the same six questions get asked on the
// same rhythm — is anything stuck this morning, is last fortnight's billing
// ready, did every truck's tickets come in — and that the answers arrive
// before somebody notices the problem themselves.
//
// There is no scheduler on this worker. No cron, no queue, no timer: nothing
// in this deployment calls runInspection on its own, and the route at
// app/api/operator/inspections is the only thing that calls it at all, when a
// person presses "Run now". When a scheduler is added it calls runInspection
// with a service member's RunDeps on the cadence named here, and nothing else
// about this file has to change.
//
// Every question ends by saying not to change anything. That is wording, and
// wording is never a control: the engine's policy still decides every write,
// the workspace still comes from the member, and a granted write in autonomous
// mode would still be a write. The sentence is there because an inspection is
// a report — a person reads it and decides — and the model should be told what
// kind of work it has been given, not only what it is permitted to do.

export type Inspection = {
  name:
    | 'morning_operations'
    | 'billing_readiness'
    | 'end_of_day_tickets'
    | 'weekly_rates'
    | 'ifta_completeness'
    | 'invoice_exceptions';
  label: string;
  cadence: 'daily' | 'weekly' | 'quarterly';
  question: string;
};

/** The sentence every inspection ends on, so no inspection forgets it. */
const READ_ONLY = 'Do not change anything.';

export const INSPECTIONS: Inspection[] = [
  {
    name: 'morning_operations',
    label: 'Morning operations',
    cadence: 'daily',
    question:
      'What needs attention across tickets, invoices, rates and mileage right now, ' +
      'worst first, and who or what is each one waiting on? ' +
      READ_ONLY,
  },
  {
    name: 'billing_readiness',
    label: 'Billing readiness',
    cadence: 'daily',
    question:
      'Which invoices from the last two weeks are not ready, and what is blocking each one? ' +
      READ_ONLY,
  },
  {
    name: 'end_of_day_tickets',
    label: 'End-of-day tickets',
    cadence: 'daily',
    question:
      'For yesterday and today, which tickets were read with fields nobody has checked, ' +
      'which look like duplicates, and which trucks that usually run have no tickets at all? ' +
      READ_ONLY,
  },
  {
    name: 'weekly_rates',
    label: 'Weekly rates',
    cadence: 'weekly',
    question:
      'Which customers and jobs have no agreed rate for the last complete billing period, ' +
      'which rate requests are still waiting on a reply, and which replies have not been read yet? ' +
      READ_ONLY,
  },
  {
    name: 'ifta_completeness',
    label: 'IFTA completeness',
    cadence: 'quarterly',
    question:
      'For this quarter, which truck days have no mileage worked out, which are stale, ' +
      'and which trucks are missing a home yard or an average MPG? ' +
      READ_ONLY,
  },
  {
    name: 'invoice_exceptions',
    label: 'Invoice exceptions',
    cadence: 'weekly',
    question:
      'Which invoices have a ticket that does not belong on them, a missing ticket in the ' +
      'numbering, or a line priced differently from the rest of the job? ' +
      READ_ONLY,
  },
];

const BY_NAME = new Map(INSPECTIONS.map((inspection) => [inspection.name, inspection]));

/** The inspection by that name, or null for a name nobody registered. */
export const inspectionNamed = (name: string): Inspection | null =>
  BY_NAME.get(name as Inspection['name']) ?? null;

/**
 * Runs one inspection as an ordinary turn: the same engine, the same limits,
 * the same policy, the same audit trail. An inspection is not a privileged
 * kind of run — it is a question asked on a schedule instead of by hand — so
 * it deliberately has no way of its own to reach a tool.
 *
 * The page it reports itself on is '/inspections/<name>', which is not a route
 * in this dashboard and is not meant to be: it is what the run row records, so
 * that a run made by an inspection can be told from one a person typed.
 */
export async function runInspection(
  deps: RunDeps,
  name: Inspection['name'],
): Promise<OperatorResponse> {
  const inspection = BY_NAME.get(name);
  if (!inspection) throw new Error('Unknown inspection.');
  return runOperator(deps, {
    message: inspection.question,
    context: { page: `/inspections/${inspection.name}`, entity: null },
    history: [],
  });
}
