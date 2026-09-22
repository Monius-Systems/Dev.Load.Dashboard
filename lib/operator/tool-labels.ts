import type { RiskLevel } from './types.ts';

// What a tool, a permission and a risk level are called in front of a person.
//
// A confirmation card is the moment somebody decides whether work happens, so
// it may not say `apply_group_ticket_correction`. The tool names are the
// engine's; these are the words, kept apart from the panel so that a tool
// added later is named in one place and so the wording can be tested without
// rendering anything. Everything here is an English key: the panel passes each
// one through t() before it is shown.

/** The write tools V1 registers, in the order their permissions are listed. */
const TOOL_LABELS: Record<string, string> = {
  reprocess_ticket: 'Reprocess ticket',
  apply_group_ticket_correction: 'Correct tickets',
  resolve_ticket_exception: 'Resolve exception',
  recalculate_mileage: 'Recalculate mileage',
  recalculate_invoice: 'Recalculate invoice',
  create_rate_request_draft: 'Draft rate request',
  create_rate_followup_draft: 'Draft follow-up',
};

/**
 * A tool's plain name. A tool with no entry yet is shown as its own name with
 * the underscores taken out, which reads poorly but never leaves the card
 * blank — and is the signal that a label is owed.
 */
export const toolLabel = (tool: string): string =>
  TOOL_LABELS[tool] ?? tool.replace(/_/g, ' ');

/** The permissions a person grants, in the words of the work they allow. */
const PERMISSION_LABELS: Record<string, string> = {
  'tickets.reprocess': 'Reprocess tickets',
  'tickets.correct': 'Correct ticket fields',
  'exceptions.resolve': 'Resolve safe exceptions',
  'mileage.recalculate': 'Recalculate mileage',
  'invoices.recalculate': 'Recalculate draft invoices',
  'rates.draft': 'Draft rate requests and follow-ups',
};

export const permissionLabel = (permission: string): string =>
  PERMISSION_LABELS[permission] ?? permission;

/** How much the action can cost if it is wrong, said as a chip on the card. */
export const riskLabel = (risk: RiskLevel): string =>
  risk === 3
    ? 'Level 3 · high impact'
    : risk === 2
      ? 'Level 2 · changes data'
      : risk === 1
        ? 'Level 1 · safe'
        : 'Level 0 · read only';

/** Warning for anything that changes data, neutral for the reversible kind. */
export const riskTone = (risk: RiskLevel): 'neutral' | 'warning' =>
  risk >= 2 ? 'warning' : 'neutral';

/** The three autonomy modes, in the words the settings view explains them with. */
export const AUTONOMY_LABELS: Record<string, string> = {
  assist: 'Assist',
  controlled: 'Controlled',
  autonomous: 'Autonomous',
};

export const AUTONOMY_NOTES: Record<string, string> = {
  assist: 'Investigate, explain and recommend. Every change is confirmed by you.',
  controlled: 'Safe, reversible work you have granted runs on its own. Anything that changes business data is confirmed.',
  autonomous: 'Granted work runs on its own within record limits. High-impact actions are still confirmed, always.',
};

export const autonomyLabel = (mode: string): string => AUTONOMY_LABELS[mode] ?? mode;
export const autonomyNote = (mode: string): string => AUTONOMY_NOTES[mode] ?? '';

/** Assist is the quiet mode; the further ones are worth seeing on the header chip. */
export const autonomyTone = (mode: string): 'neutral' | 'warning' | 'good' =>
  mode === 'autonomous' ? 'good' : mode === 'controlled' ? 'warning' : 'neutral';
