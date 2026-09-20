import type { Ticket } from '../types.ts';

// The shapes the Missing-Data Recovery layer speaks in. Types only: nothing
// here runs, so every module of the layer can import from it without pulling
// the others along, and the pieces — the reader's observation, the vendor
// rules, the workspace's memory, the resolver, the review screen — agree on
// one vocabulary before any of them is written.
//
// The one rule every shape here exists to enforce: what was SEEN on the paper
// is kept apart from what the app MAKES of it. A ticket printed "ARKHAM, IL"
// with its left edge off the page is observed as "ARKHAM, IL", clipped on the
// left; whether that becomes "MARKHAM, IL" is decided afterwards, from
// evidence, and the observation is never overwritten by the decision.

/** The side of a field's print that ran off the paper, or off the picture. */
export type ClippedEdge = 'left' | 'right' | 'top' | 'bottom';

/**
 * Where one edge of the physical sheet stands in the photograph.
 *
 * `inside`: the paper edge is in the picture, so print cut off at that side
 * was cut off by the printer — source clipping, which no retake will fix.
 * `cut`: the sheet runs off the picture there — a camera crop, which a retake
 * will fix, and which no amount of evidence should be used to paper over.
 * `unknown`: no sheet was found, so nothing can be said about that side.
 */
export type EdgeState = 'inside' | 'cut' | 'unknown';

export type PaperFrame = {
  /** Whether a sheet was found in the picture at all. */
  detected: boolean;
  left: EdgeState;
  right: EdgeState;
  top: EdgeState;
  bottom: EdgeState;
};

/**
 * A frame nothing could be said about: no sheet found, every side unknown.
 * Frozen, because it is handed back by reference from every reader that has
 * nothing to say, and one caller writing into it would poison every later read.
 */
export const UNKNOWN_FRAME: PaperFrame = Object.freeze({
  detected: false,
  left: 'unknown',
  right: 'unknown',
  top: 'unknown',
  bottom: 'unknown',
}) as PaperFrame;

/**
 * One field as the reader saw it (Pass 1). Everything is a string, as printed:
 * a weight is "45,440" here and becomes 45440 only once it is resolved, so a
 * partial "17254464_" can be kept exactly rather than becoming a number that
 * was never on the paper.
 *
 * `visible` is the ink, character for character, damage included. `proposed`
 * is the reader's own reading of it, which may complete or correct it; it is a
 * suggestion for the resolver and never a value in its own right. `partial`
 * says the reader believes characters are missing — because of `clipped_edge`,
 * or because print was torn, smudged out, or otherwise not there.
 */
export type ObservedField = {
  visible: string | null;
  proposed: string | null;
  clipped_edge: ClippedEdge | null;
  partial: boolean;
};

/** Pass 1: the whole ticket as observed, keyed by the app's own field names. */
export type ObservedTicket = {
  fields: Partial<Record<keyof Ticket, ObservedField>>;
  /**
   * Every timestamp printed anywhere on the ticket, as printed ("26SEP14
   * 12:02", "09/14/26 12:02:11"). Redundant evidence for the date, read by the
   * vendor rules; never a date in itself.
   */
  timestamps: string[];
  /** The issuer's branding as printed, for vendor detection. */
  branding: string | null;
  /**
   * The reader's own view of which paper edges are in the picture. Evidence
   * for `PaperFrame`, alongside the document detector's; neither alone is
   * trusted to say a clipped field is the printer's doing.
   */
  paper_edges: PaperFrame | null;
};

/**
 * Where a field's value stands.
 *
 * `exact`: read whole from the paper. `recovered`: partly missing from the
 * paper and completed from sufficient evidence — the visible text is kept
 * beside it. `needs_review`: not settled; a person decides. `missing`: nothing
 * of it was on the paper and nothing can be said. `confirmed`: a person
 * accepted or typed the value in review, which ends the question.
 */
export type FieldStatus = 'exact' | 'recovered' | 'needs_review' | 'missing' | 'confirmed';

/** Why a field is waiting for a person rather than being settled. */
export type ReviewReason =
  /** An identifier or weight with characters missing: never completed by guessing. */
  | 'partial_numeric'
  /** Some of the field is missing and nothing on file supports one completion. */
  | 'insufficient_evidence'
  /** More than one value on file fits what is visible. */
  | 'ambiguous_candidates'
  /** Two sources that should agree do not. */
  | 'conflicting_evidence'
  /** The sheet ran off the picture on the clipped side: retake, do not recover. */
  | 'camera_crop'
  /** The reader proposed a completion no evidence supports. */
  | 'unsupported_proposal'
  /** Nothing of the field could be read. */
  | 'not_read';

/** Where a piece of evidence came from, in rough order of how much it is trusted. */
export type EvidenceSource =
  /** The field's own print, whole. */
  | 'visible'
  /** The reader's proposed completion, on its own. */
  | 'model_proposed'
  /** Another field on the same ticket that carries the same fact. */
  | 'same_ticket'
  /** A rule of the vendor's layout (a machine timestamp encodes the date). */
  | 'vendor_rule'
  /** A value on a customer, truck or client profile in this workspace. */
  | 'verified_profile'
  /** A value on a ticket in this workspace that a person has reviewed. */
  | 'verified_history'
  /** A relationship on file: this customer hauls to this site, this carrier runs this truck. */
  | 'historical_relationship'
  /** Other tickets of the same upload or order. */
  | 'batch_context'
  /** A correction a person made on an earlier ticket in the same context. */
  | 'user_correction'
  /** The person reviewing this ticket accepted or typed it. */
  | 'user_confirmed';

/**
 * One reason to believe a field has a particular value. Gathered from every
 * source, then weighed together by the resolver; no single item decides.
 */
export type Evidence = {
  field: keyof Ticket;
  /** The value this evidence supports, in the form the ticket would store it. */
  candidate: string;
  source: EvidenceSource;
  strength: 'strong' | 'moderate' | 'weak';
  /** One line a person can read in review: what was compared with what. */
  note: string;
  /** What the evidence is tied to, so it is never applied outside it. */
  context?: {
    vendor?: string | null;
    customer?: string | null;
    project?: string | null;
  };
};

/**
 * What the resolver decided about one field, with everything needed to audit
 * the decision later: the print that was seen, the value that stands, where it
 * came from and why.
 */
export type FieldResolution = {
  status: FieldStatus;
  /** The value the ticket carries, or null when nothing stands yet. */
  value: string | number | null;
  /** The print as seen, kept whatever the value became. */
  visible_text: string | null;
  source: EvidenceSource | null;
  /** True when print was cut off by the printer (paper edge in the picture). */
  source_clipped: boolean;
  clipped_edge: ClippedEdge | null;
  /** From the evidence, never from the reader's own say-so. 0 to 1. */
  confidence: number;
  /** The notes of the evidence that was weighed, for the review screen. */
  evidence: string[];
  reason?: ReviewReason;
  /** Values that fit what is visible, when more than one does. */
  candidates?: string[];
  /** Set once a person accepts or types the value in review. */
  confirmed_by_user?: boolean;
};

/**
 * The recovery record of one ticket: carried on the queue item through review
 * and stored beside the ticket, so a value on an invoice can always be traced
 * back to the paper and the evidence.
 */
export type TicketRecovery = {
  version: 1;
  /** The vendor profile the ticket was read under, or null for the generic path. */
  vendor: string | null;
  paper: PaperFrame;
  fields: Partial<Record<keyof Ticket, FieldResolution>>;
};
