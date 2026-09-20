// The Missing-Data Recovery layer, in one door.
//
// The review screen, the validator and the extractor all want different
// pieces of this and none of them should have to know which file a piece
// lives in, so everything the layer offers is re-exported here: the shapes
// from the contract, the policy that says what may be filled in, the resolver
// that does it, the vendor profiles that read a ticket's own redundancy, and
// the workspace memory the resolver weighs against it.

export type {
  ClippedEdge,
  EdgeState,
  Evidence,
  EvidenceSource,
  FieldResolution,
  FieldStatus,
  ObservedField,
  ObservedTicket,
  PaperFrame,
  ReviewReason,
  TicketRecovery,
} from './contract.ts';
export { UNKNOWN_FRAME } from './contract.ts';

export type { FieldClass } from './policy.ts';
export {
  ADVISORY_SOURCES,
  CRITICAL_FIELDS,
  DERIVATION_SOURCES,
  DERIVED_CONFIDENCE_CAP,
  EVIDENCE_WEIGHTS,
  FIELD_ORDER,
  INDEPENDENT_SOURCES_REQUIRED,
  MIN_SELECTING_FRAGMENT,
  RECOVERABLE_FROM_CONTEXT,
  RECOVER_THRESHOLD,
  UNVERIFIED_FRAME_CONFIDENCE_CAP,
  VERIFIED_SOURCES,
  combinedWeight,
  evidenceWeight,
  fieldClass,
  reachesThreshold,
  recoveredConfidence,
} from './policy.ts';

export type { RecoveryContext } from './resolve.ts';
export {
  applyRecovery,
  blocksSave,
  confirmField,
  emptyRecovery,
  mergeFrames,
  resolveField,
  resolveTicket,
  reviewIssues,
  unresolvedCritical,
} from './resolve.ts';

export type { VendorProfile } from './vendors.ts';
export { VENDORS, detectVendor, vendorEvidence } from './vendors.ts';

export type { WorkspaceMemory } from './memory.ts';
export { batchEvidence, buildMemory, memoryEvidence } from './memory.ts';

// queue.ts is deliberately not re-exported here. It is the layer's outermost
// piece and it reads this barrel itself (`import … from './index.ts'`), so a
// line for it here would close a loop — the door importing what walks through
// it. Callers that want `recoverTicket`, `confirmValue`, `noteSameOrderFill`,
// `unresolvedMessage` or `reviewState` import './queue.ts' directly, which is
// what the review screen and its tests already do.
