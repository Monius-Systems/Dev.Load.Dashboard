import clientConfig from '../../../client.config.json' with { type: 'json' };
import { normalizeName } from '../customer-rates.ts';
import type { Ticket } from '../types.ts';
import type { ObservedTicket, TicketRecovery } from './contract.ts';

// The carriers this client works with, named outright.
//
// Everything else in this layer argues a value from evidence and asks a
// person when the evidence is thin. A carrier is different: the client knows
// who hauls for them, and a ticket that says "Z FORCE" anywhere in the
// carrier line is Z Force Transportation's ticket, however the rest of the
// line printed. So the client names them in client.config.json — this is the
// client's deployment, alongside their company name and colours — and a
// carrier line that contains one of those names is set to it, read whole,
// with nothing shown and nothing asked.
//
// This is a rule the client wrote, not a guess the app made, and the record
// says so: the print that was seen is kept beside the name it was set to.

type KnownCarrier = { match: string; name: string };

const KNOWN_CARRIERS: KnownCarrier[] = (
  (clientConfig as { knownCarriers?: KnownCarrier[] }).knownCarriers ?? []
).filter((carrier) => carrier.match?.trim() && carrier.name?.trim());

/** Letters and digits only, so "Z FORCE", "ZFORCE" and "Z-Force" are one thing. */
const letters = (value: string) => normalizeName(value).replace(/ /g, '');

/** The carrier a piece of carrier-line print names, or null. */
export function knownCarrierIn(printed: string | null | undefined): string | null {
  if (!printed) return null;
  const seen = letters(printed);
  if (!seen) return null;
  const found = KNOWN_CARRIERS.find((carrier) => seen.includes(letters(carrier.match)));
  return found ? found.name : null;
}

/**
 * The ticket and its record with the carrier set to the client's name for
 * it, where the carrier line names one. Whatever the resolver made of the
 * line — a fragment waiting on a person, a crop, a name read whole but
 * printed short — is replaced by the client's own word: the field is exact,
 * nothing is shown on it, and nothing blocks the save.
 */
export function applyKnownCarrier(
  ticket: Ticket,
  recovery: TicketRecovery,
  observed?: ObservedTicket,
): { ticket: Ticket; recovery: TicketRecovery } {
  const seen = observed?.fields.carrier_name;
  const printed =
    seen?.visible ?? seen?.proposed ?? recovery.fields.carrier_name?.visible_text ?? ticket.carrier_name;
  const name = knownCarrierIn(printed) ?? knownCarrierIn(ticket.carrier_name);
  if (!name) return { ticket, recovery };
  if (ticket.carrier_name === name && recovery.fields.carrier_name?.status === 'exact') {
    return { ticket, recovery };
  }
  const previous = recovery.fields.carrier_name;
  return {
    ticket: { ...ticket, carrier_name: name },
    recovery: {
      ...recovery,
      fields: {
        ...recovery.fields,
        carrier_name: {
          status: 'exact',
          value: name,
          visible_text: previous?.visible_text ?? (typeof printed === 'string' ? printed : null),
          source: 'verified_profile',
          source_clipped: previous?.source_clipped ?? false,
          clipped_edge: previous?.clipped_edge ?? null,
          confidence: 1,
          evidence: [`Known carrier for this client: ${name}.`],
        },
      },
    },
  };
}
