import type { Ticket } from '../types.ts';

/** How far gross − tare may be from net before the three disagree; the scale's own slack. */
export const WEIGHT_TOLERANCE_LB = 20;
/** How far net ÷ 2000 may be from the printed tons; rounding on the sheet. */
export const TON_TOLERANCE = 0.05;
import type { FieldResolution, TicketRecovery } from './contract.ts';
import { oneMisreadApart } from './misread.ts';
import { DERIVED_CONFIDENCE_CAP } from './policy.ts';

export { oneMisreadApart } from './misread.ts';

// The weights, checked against each other and put right from each other.
//
// A scale ticket prints its weights four times over: gross, tare and net in
// pounds, and the net again in tons, with gross minus tare equal to net and
// net over two thousand equal to the tons. That is the strongest evidence on
// the sheet, and it used to be spent only on saying "these do not balance".
// A faded digit in one figure — a 3 read as a 5 in the tare — leaves the
// other three agreeing with each other and disagreeing with it, and the
// arithmetic says exactly what the figure has to be. So it is put right,
// with the print kept beside it, when one figure alone is wrong and the
// value the others give is within one faded digit of what was read. Two
// figures wrong, or a figure the others cannot vouch for, is a ticket to
// look at, on its own — a weight is billed, and a guess at one is never made.

export const WEIGHT_FIELDS = ['gross_lb', 'tare_lb', 'net_lb', 'net_tons'] as const;
type WeightField = (typeof WEIGHT_FIELDS)[number];
type Weights = Record<WeightField, number | null>;

const round2 = (value: number) => Math.round(value * 100) / 100;

/** Whether the figures present agree with each other. */
export function balanced(w: Weights): boolean {
  const { gross_lb: g, tare_lb: t, net_lb: n, net_tons: nt } = w;
  if (g !== null && t !== null && n !== null && Math.abs(g - t - n) > WEIGHT_TOLERANCE_LB) return false;
  if (n !== null && nt !== null && Math.abs(n / 2000 - nt) > TON_TOLERANCE) return false;
  return true;
}

/** The value the other figures say a field must be, or null when they cannot say. */
function derived(field: WeightField, w: Weights): number | null {
  const { gross_lb: g, tare_lb: t, net_lb: n, net_tons: nt } = w;
  switch (field) {
    case 'gross_lb':
      return t !== null && n !== null ? t + n : null;
    case 'tare_lb':
      return g !== null && n !== null ? g - n : null;
    case 'net_lb':
      if (g !== null && t !== null) return g - t;
      return nt !== null ? Math.round(nt * 2000) : null;
    case 'net_tons':
      return n !== null ? round2(n / 2000) : null;
  }
}

export type WeightFix = { field: WeightField; from: number | null; to: number };
export type { WeightField, Weights };

/**
 * The one correction that makes the weights agree, or null.
 *
 * Every figure is tried as the wrong one: the others are asked what it has
 * to be, the ticket is re-checked with that value, and the read figure has
 * to be one misread from it. Exactly one figure fixing everything is the
 * misread; none, or more than one, is not settled here.
 */
export function weightFix(w: Weights): WeightFix | null {
  if (balanced(w)) return null;
  const fixes: WeightFix[] = [];
  for (const field of WEIGHT_FIELDS) {
    const to = derived(field, w);
    if (to === null || to <= 0) continue;
    if (!oneMisreadApart(w[field], to)) continue;
    if (!balanced({ ...w, [field]: to })) continue;
    fixes.push({ field, from: w[field], to });
  }
  return fixes.length === 1 ? fixes[0] : null;
}

/**
 * The ticket with its one misread weight put right, and the record saying
 * so; both untouched when the weights agree or when the ticket cannot say
 * which figure is wrong. The tons are re-derived from corrected pounds the
 * way they are read, so nothing else on the ticket disagrees with the fix.
 */
export function reconcileWeights(
  ticket: Ticket,
  recovery: TicketRecovery,
): { ticket: Ticket; recovery: TicketRecovery; fix: WeightFix | null } {
  const w: Weights = {
    gross_lb: ticket.gross_lb,
    tare_lb: ticket.tare_lb,
    net_lb: ticket.net_lb,
    net_tons: ticket.net_tons,
  };
  const fix = weightFix(w);
  if (!fix) return { ticket, recovery, fix: null };
  const next: Ticket = { ...ticket, [fix.field]: fix.to };
  if (fix.field === 'gross_lb') next.gross_tons = round2(fix.to / 2000);
  if (fix.field === 'tare_lb') next.tare_tons = round2(fix.to / 2000);
  const previous = recovery.fields[fix.field];
  const others = WEIGHT_FIELDS.filter((field) => field !== fix.field && w[field] !== null)
    .map((field) => `${field.replace('_lb', ' lb').replace('_tons', ' tons')} ${w[field]}`)
    .join(', ');
  const resolution: FieldResolution = {
    status: 'recovered',
    value: fix.to,
    visible_text: previous?.visible_text ?? (fix.from === null ? null : String(fix.from)),
    source: 'same_ticket',
    source_clipped: previous?.source_clipped ?? false,
    clipped_edge: previous?.clipped_edge ?? null,
    confidence: DERIVED_CONFIDENCE_CAP,
    evidence: [
      ...(previous?.evidence ?? []),
      `The ticket's own arithmetic (${others}) makes this ${fix.to}, one faded digit from the printed ${fix.from ?? 'blank'}; read as ${fix.to}.`,
    ],
  };
  return {
    ticket: next,
    recovery: { ...recovery, fields: { ...recovery.fields, [fix.field]: resolution } },
    fix,
  };
}
