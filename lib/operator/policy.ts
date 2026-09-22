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

export function decide(input: PolicyInput): PolicyDecision {
  const { tool, settings, impact, confirmed } = input;
  if (tool.type === 'read') return { action: 'run' };

  if (!settings.granted.includes(tool.permission as never)) {
    return {
      action: 'deny',
      reason: `The Operator is not allowed to ${describe(tool.permission)} in this workspace.`,
    };
  }
  if (impact?.touches_finalized) {
    return { action: 'deny', reason: 'This would change a finalized invoice.' };
  }
  if (impact?.blockers.length) {
    return { action: 'deny', reason: impact.blockers[0] };
  }
  if (confirmed) return { action: 'run' };

  if (tool.risk === 3 || tool.confirmation === 'always') {
    return { action: 'confirm', reason: 'This is a high-impact action and always needs your go-ahead.' };
  }
  if (settings.autonomy === 'assist') {
    return { action: 'confirm', reason: 'In assist mode the Operator asks before it changes anything.' };
  }
  const records = impact?.records ?? 0;
  if (records > (input.tool.maxRecords ?? Number.POSITIVE_INFINITY)) {
    return { action: 'deny', reason: `This would touch ${records} records, more than this action allows at once.` };
  }
  if (records > RUN_LIMITS.maxRecordsWithoutConfirmation) {
    return { action: 'confirm', reason: `This would touch ${records} records, so it needs your go-ahead.` };
  }
  if (settings.autonomy === 'controlled') {
    return tool.risk <= 1
      ? { action: 'run' }
      : { action: 'confirm', reason: 'This changes business data, so it needs your go-ahead.' };
  }
  // autonomous
  return { action: 'run' };
}

/** "correct tickets", from 'tickets.correct'. Used only in messages. */
export const describe = (permission: string): string => {
  const [area, verb] = permission.split('.');
  return verb && area ? `${verb} ${area}` : permission;
};
