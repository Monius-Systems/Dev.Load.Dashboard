import type { Ticket } from '../../types.ts';
import type { Evidence, ObservedTicket } from '../contract.ts';
import { anyText } from './generic.ts';

// Ontario Trap Rock, the second vendor.
//
// It knows nothing its tickets do not share with every other scale ticket, so
// its redundant evidence is empty and its weights are read by the generic
// rules like anyone else's. It is here anyway, and it is worth the file: it
// is the proof that a vendor is a profile — a name, a way of being recognised
// and whatever its layout happens to say twice — and not a second extractor
// with a second set of rules to keep in step. The next vendor is added the
// same way, and until somebody learns something about its paper, that is all
// there is to write.

export const ONTARIO_TRAP_ROCK = {
  id: 'ontario-trap-rock',
  name: 'Ontario Trap Rock',

  /** Only the name recognises it; no layout tell has been established. */
  detect(observed: ObservedTicket): number {
    const branding = (observed.branding ?? '').toLowerCase();
    const plantName = (anyText(observed, 'plant_name') ?? '').toLowerCase();
    return branding.includes('ontario trap rock') ||
      plantName.includes('ontario trap rock')
      ? 0.95
      : 0;
  },

  /** Nothing this layout says twice that every scale ticket does not. */
  redundantEvidence: (_observed: ObservedTicket): Evidence[] => [],

  redundantSources: {
    gross_lb: ['gross weight', 'tare + net'],
    tare_lb: ['tare weight', 'gross − net'],
    net_lb: ['net weight', 'gross − tare', 'net tons × 2000'],
    net_tons: ['net tons', 'net weight ÷ 2000'],
  } satisfies Partial<Record<keyof Ticket, string[]>>,
};
