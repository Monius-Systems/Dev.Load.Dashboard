import type { Ticket } from '../types.ts';
import type { Evidence, ObservedTicket } from './contract.ts';
import { genericEvidence, strongestPerCandidate } from './vendors/generic.ts';
import { HEIDELBERG } from './vendors/heidelberg.ts';
import { ONTARIO_TRAP_ROCK } from './vendors/ontario-trap-rock.ts';

// Vendor knowledge for the model-based reader: who printed this ticket, and
// what that tells us about the boxes the camera lost.
//
// A vendor here is a profile, not a pipeline. It says how a ticket of its is
// recognised, what its layout prints twice, and how the review screen should
// word that — three small things — and nothing about extraction, prompts or
// where on the page anything sits. Adding a vendor is adding one file to the
// list below; it cannot change how any other vendor's ticket is read, which is
// the whole reason the knowledge is shaped this way rather than as a second
// parser per supplier.
//
// The legacy OCR parser (parser.ts) keeps its own layout detection for the
// text path. This is deliberately separate: the two are answering the same
// question about different inputs, and merging them would tie a working
// parser to a reader that is still being taught.

export type VendorProfile = {
  id: string;
  name: string;
  /** how sure the observation is this vendor, 0..1 */
  detect(observed: ObservedTicket): number;
  /** same-ticket redundancy: evidence derived only from this ticket's own observation */
  redundantEvidence(observed: ObservedTicket): Evidence[];
  /** which fields this vendor's layout is known to carry twice, for the review screen's wording */
  redundantSources: Partial<Record<keyof Ticket, string[]>>;
};

/**
 * The vendors whose paper this app knows. Generic is not among them: it is
 * what every ticket gets, recognised or not, and so it is not something a
 * ticket can be detected as.
 */
export const VENDORS: VendorProfile[] = [HEIDELBERG, ONTARIO_TRAP_ROCK];

/**
 * How sure the app has to be before it reads a ticket under a vendor's rules.
 *
 * Below this, no vendor is chosen. That is not a failure: an unrecognised
 * ticket still gets every generic rule, and the cost of guessing a vendor is
 * that its rules then run — a stamp read year-first because Heidelberg prints
 * them that way, on a ticket Heidelberg did not print.
 */
export const VENDOR_FLOOR = 0.6;

/**
 * The vendor this observation is, and how sure that is.
 *
 * The score comes back whether or not it cleared the floor, so a caller can
 * say "nearly Heidelberg" in a log without having to score again; the vendor
 * is null until the floor is cleared, and a null vendor means the generic
 * path, never a default one. Ties go to the earlier profile, so the answer is
 * the same every time for the same ticket.
 */
export function detectVendor(observed: ObservedTicket): {
  vendor: VendorProfile | null;
  score: number;
} {
  let best: VendorProfile | null = null;
  let score = 0;
  for (const vendor of VENDORS) {
    const candidate = vendor.detect(observed);
    if (candidate > score) {
      best = vendor;
      score = candidate;
    }
  }
  return score >= VENDOR_FLOOR
    ? { vendor: best, score }
    : { vendor: null, score };
}

/**
 * Everything this ticket says about itself: its vendor's rules where a vendor
 * was recognised, and the generic ones always.
 *
 * Vendor items are tagged with the vendor they came from, so that a rule can
 * be traced — and refused — outside the paper it was learned on. The order is
 * fixed, vendor first, because the review screen lists evidence in the order
 * it arrives and a list that reshuffles between two reads of the same ticket
 * is a list nobody trusts.
 */
export function vendorEvidence(observed: ObservedTicket): {
  vendor: string | null;
  evidence: Evidence[];
} {
  const { vendor } = detectVendor(observed);
  const fromVendor = vendor
    ? vendor
        .redundantEvidence(observed)
        .map((item) =>
          item.source === 'vendor_rule'
            ? { ...item, context: { ...item.context, vendor: vendor.id } }
            : item,
        )
    : [];
  // One stamp, one piece of evidence. A vendor rule and a generic rule reading
  // the same printing — or two derivations arriving at the same weight — would
  // otherwise put the same field and value in front of the resolver twice, and
  // the resolver counts sources that agree. Two entries for one fact are not
  // two sources; the strongest reading stands and the rest are dropped, vendor
  // first on a tie because the vendor rule saw the layout as well as the ink.
  const evidence = strongestPerCandidate([
    ...fromVendor,
    ...genericEvidence(observed),
  ]);
  return { vendor: vendor?.id ?? null, evidence };
}

export {
  GENERIC_REDUNDANT_SOURCES,
  genericEvidence,
  strongestPerCandidate,
} from './vendors/generic.ts';
export { HEIDELBERG } from './vendors/heidelberg.ts';
export { ONTARIO_TRAP_ROCK } from './vendors/ontario-trap-rock.ts';
