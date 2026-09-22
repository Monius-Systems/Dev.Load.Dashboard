import { RUN_LIMITS } from './limits.ts';
import type { PolicyDecision, PolicyInput } from './types.ts';

// Whether a tool may run, in this workspace, right now.
//
// This is the one place authorisation is decided, and it is pure: a function
// of the tool's registered facts, the workspace's settings and the dry run's
// figures. Nothing the model said is an input. A model that is sure of itself
// is exactly as authorised as one that is not, which is to say: exactly as
// authorised as the person who set the workspace's permissions made it.
//
// The rules are in the design brief and pinned by tests/operator-policy.test.ts:
// - Reads run.
// - A write the workspace has not granted is denied, in every mode.
// - Level 3 is confirmed by a person in every mode, always.
// - assist: every write is confirmed. The confirmation is the explicit request.
// - controlled: granted level-1 writes run; level 2 is confirmed.
// - autonomous: granted level-1 and level-2 writes run while the impact stays
//   under the record limit; past it, or where the dry run found a blocker or
//   a finalized invoice, a person confirms.
// - A tool registered as 'always' is confirmed in every mode.
// - Once a person has confirmed, the action runs — unless something has made
//   it unsafe since, which the engine checks by re-running the dry run.
//
// The refusals are settled before the confirmation is honoured, and that order
// is deliberate: a person pressing a button cannot grant a permission the
// workspace withheld, cannot reopen a finalized invoice, cannot wave away what
// the dry run found in the way, and cannot ask a tool to touch more records
// than the tool says it can handle at once. A confirmation answers the question
// "should this happen?"; it is not an answer to "is this allowed?".

export function decide(input: PolicyInput): PolicyDecision {
  const { tool, settings, impact, confirmed } = input;
  if (tool.type === 'read') return { action: 'run' };

  const granted: readonly string[] = settings.granted;
  if (!granted.includes(tool.permission)) {
    return {
      action: 'deny',
      reason: `The Operator is not allowed to ${describe(tool.permission)} in this workspace.`,
    };
  }
  if (impact?.touches_finalized) {
    return { action: 'deny', reason: 'This would change a finalized invoice.' };
  }
  if (impact && impact.blockers.length > 0) {
    return {
      action: 'deny',
      reason: impact.blockers[0] ?? 'Something is in the way of this action.',
    };
  }
  const records = impact?.records ?? 0;
  if (records > (tool.maxRecords ?? Number.POSITIVE_INFINITY)) {
    return {
      action: 'deny',
      reason: `This would touch ${records} records, more than this action allows at once.`,
    };
  }

  if (confirmed) return { action: 'run' };

  if (tool.risk === 3 || tool.confirmation === 'always') {
    return {
      action: 'confirm',
      reason: 'This is a high-impact action and always needs your go-ahead.',
    };
  }
  if (settings.autonomy === 'assist') {
    return {
      action: 'confirm',
      reason: 'In assist mode the Operator asks before it changes anything.',
    };
  }
  if (records > RUN_LIMITS.maxRecordsWithoutConfirmation) {
    return {
      action: 'confirm',
      reason: `This would touch ${records} records, so it needs your go-ahead.`,
    };
  }
  if (settings.autonomy === 'controlled') {
    return tool.risk <= 1
      ? { action: 'run' }
      : { action: 'confirm', reason: 'This changes business data, so it needs your go-ahead.' };
  }
  // Autonomous, granted, level 1 or 2, inside every limit, nothing in the way.
  return { action: 'run' };
}

/** "correct tickets", from 'tickets.correct'. Used only in messages. */
export const describe = (permission: string): string => {
  const [area, verb] = permission.split('.');
  return verb && area ? `${verb} ${area}` : permission;
};
