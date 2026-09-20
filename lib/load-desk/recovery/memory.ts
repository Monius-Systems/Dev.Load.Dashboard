import { normalizeName } from '../customer-rates.ts';
import type { CustomerProfile, ClientProfile, TruckProfile } from '../profiles.ts';
import type { SavedRecord, Ticket } from '../types.ts';
import type {
  ClippedEdge,
  Evidence,
  FieldResolution,
  ObservedField,
  ObservedTicket,
} from './contract.ts';

// What this workspace has already verified, turned into evidence the resolver
// can weigh: values a person put on a profile, values a person reviewed on a
// ticket, the pairs those tickets keep making — this customer hauls to this
// site, this carrier runs this truck — and the corrections a person typed over
// a bad reading.
//
// THE CALLER OWNS THE DATA. Every function here is pure and takes the records
// and profiles it is to remember. The caller passes
// `getRecordsSnapshot().records` and `getProfilesSnapshot()` of the SIGNED-IN
// workspace and nothing else: both snapshots come from routes that scope every
// query to the member's workspace_id, with RLS underneath. This module reads no
// snapshot of its own, keeps nothing between calls, and imports nothing that
// could reach storage, the data mode or the network — normalizeName comes from
// customer-rates.ts for that reason, and the profile shapes are `import type`,
// erased before anything runs. One workspace cannot see another's memory, not
// because a check forbids it but because there is nothing here to look through.
//
// ONLY WHAT A PERSON STANDS BEHIND IS LEARNED. A ticket nobody has reviewed
// teaches nothing; a field the app recovered by itself teaches nothing until
// somebody confirms it; a field still waiting for review teaches nothing at
// all. The reader's own `proposed` reading never arrives here — buildMemory
// takes saved records, not observations. Memory that learned the app's guesses
// would hand them back as proof of themselves, and the second ticket would be
// wrong with more confidence than the first.

/** A value this workspace has verified, and how often it has been seen. */
export type VerifiedValue = {
  value: string;
  source: 'verified_profile' | 'verified_history';
  /** how many verified sightings */
  count: number;
  /** the customers/projects it was seen with, normalised */
  customers: Set<string>;
  projects: Set<string>;
  /**
   * Whether a person ever typed or accepted this value in review. A value
   * somebody settled by hand is a fact about the workspace however many
   * times it has been seen — one is enough — where a value the reader merely
   * read whole has to be seen a few times before it stands on its own.
   */
  confirmed: boolean;
};

/**
 * A pair two verified tickets keep making. `from` is the thing that explains
 * the other, `field` the ticket field `to` would fill.
 */
export type Relationship = {
  kind:
    | 'customer_project'
    | 'customer_address'
    | 'customer_id'
    | 'project_address'
    | 'plant_product'
    | 'carrier_truck'
    | 'product_code_description';
  from: string;
  to: string;
  field: keyof Ticket;
  count: number;
};

/**
 * A reading a person typed over. What makes it reusable is the whole tuple —
 * the field, the vendor's layout, the edge that was cut and the exact print
 * that was visible — and what makes it safe is the customer and project it
 * happened under, so it is never spent on somebody else's ticket.
 */
export type Correction = {
  field: keyof Ticket;
  vendor: string | null;
  clipped_edge: ClippedEdge | null;
  visible_text: string;
  confirmed_value: string;
  customer: string | null;
  project: string | null;
  at: string;
};

export type WorkspaceMemory = {
  values: Map<keyof Ticket, VerifiedValue[]>;
  relationships: Relationship[];
  corrections: Correction[];
};

/**
 * The fields a reviewed ticket teaches. Names, places and descriptions: things
 * that repeat across a workspace's work. Ticket numbers, weights, times and
 * dates are each ticket's own, so no amount of history says anything about the
 * next one, and they are left out rather than learned and then refused later.
 */
const LEARNED_FIELDS: (keyof Ticket)[] = [
  'plant_name',
  'plant_address',
  'customer_name',
  'project_name',
  'project_address',
  'product_code',
  'product_description',
  'carrier_name',
  'vehicle_id',
  'customer_id',
];

/**
 * The fields a value on file may be offered for. customer_id is learned above
 * — a profile records the customer numbers as printed — but it is an
 * identifier, and a half-read number must not be completed because a number
 * like it exists somewhere in the workspace. It is offered only through the
 * customer→customer_id relationship, where a named customer vouches for it.
 */
const EVIDENCE_VALUE_FIELDS = new Set<keyof Ticket>(
  LEARNED_FIELDS.filter((field) => field !== 'customer_id'),
);

/**
 * The fields whose values are facts about a customer rather than about the
 * workspace. A job site saved on Witech's profile is where Witech's loads go;
 * offered untied, it completed a clipped address on a ticket for a customer
 * the workspace had never hauled for, with a place that customer has never
 * been. So these are offered once per customer they were seen with and tied
 * to that customer, and the resolver — which refuses evidence tied to a
 * customer the ticket does not match — never sees them anywhere else. A
 * customer's name, a plant, a product or a truck is the same fact whoever the
 * ticket is for, and stays untied.
 */
const CUSTOMER_BOUND_FIELDS = new Set<keyof Ticket>(['project_address', 'project_name']);

/**
 * The fields one ticket of an upload may lend another: what the tickets of a
 * job have in common. A ticket number, a time or a weight belongs to its own
 * load, whatever the ticket beside it says.
 */
const BATCH_FIELDS: (keyof Ticket)[] = [
  'plant_code',
  'plant_name',
  'plant_address',
  'customer_id',
  'customer_name',
  'order_number',
  'project_name',
  'project_address',
  'po_number',
  'product_code',
  'product_description',
  'carrier_id',
  'carrier_name',
  'vehicle_id',
];

const FIELD_LABELS: Partial<Record<keyof Ticket, string>> = {
  plant_code: 'plant code',
  plant_name: 'plant',
  plant_address: 'plant address',
  customer_id: 'customer number',
  customer_name: 'customer',
  order_number: 'order number',
  project_name: 'project',
  project_address: 'location',
  po_number: 'P.O. number',
  product_code: 'product code',
  product_description: 'product',
  carrier_id: 'carrier number',
  carrier_name: 'carrier',
  vehicle_id: 'truck',
  weighmaster: 'weighmaster',
};

const labelOf = (field: keyof Ticket) => FIELD_LABELS[field] ?? field.replace(/_/g, ' ');

/**
 * A count of sightings said out loud. Unreviewed readings count half, so the
 * figure can be a fraction; it is shown to the nearest whole ticket, and a
 * count made up of readings alone says so.
 */
const tickets = (count: number) => {
  const whole = Math.max(1, Math.round(count));
  const noun = whole === 1 ? 'ticket' : 'tickets';
  return Number.isInteger(count) ? `${whole} reviewed ${noun}` : `about ${whole} ${noun}, some unreviewed`;
};

/** The fragment's characters, without the spacing normalizeName leaves behind. */
const squash = (value: string) => value.replace(/ /g, '');

/** A field with print missing: that is the only kind memory speaks about. */
const isGap = (seen: ObservedField) => seen.partial || seen.clipped_edge !== null;

/**
 * Whether a value on file could be what the paper shows. The edge that ran off
 * says which end of the print is gone: clipped on the left, the field kept its
 * tail, so the value must END with what is visible; clipped on the right, it
 * must begin with it. Anything else — torn, smudged, a hole punched through —
 * only says the visible run is somewhere inside.
 */
function fits(candidate: string, fragment: string, edge: ClippedEdge | null): boolean {
  const value = normalizeName(candidate);
  if (!value || !fragment) return false;
  if (edge === 'left') return value.endsWith(fragment);
  if (edge === 'right') return value.startsWith(fragment);
  return value.includes(fragment);
}

/**
 * Whether a reviewed ticket's field may be learned from. A field the resolver
 * left for a person is not yet a fact about the workspace, and one the app
 * recovered on its own is only the app's own reasoning until somebody confirms
 * it. A field with no resolution at all was read whole, or saved before any of
 * this existed, and a person reviewed it either way.
 */
function settled(resolution: FieldResolution | undefined): boolean {
  if (!resolution) return true;
  if (resolution.status === 'needs_review' || resolution.status === 'missing') return false;
  return resolution.status !== 'recovered' || resolution.confirmed_by_user === true;
}

function addValue(
  values: Map<keyof Ticket, VerifiedValue[]>,
  field: keyof Ticket,
  value: string,
  source: VerifiedValue['source'],
  customer: string | null,
  project: string | null,
  weight = 1,
  confirmed = false,
) {
  const text = value.trim();
  const key = normalizeName(text);
  if (!key) return;
  let list = values.get(field);
  if (!list) {
    list = [];
    values.set(field, list);
  }
  let entry = list.find((known) => normalizeName(known.value) === key);
  if (!entry) {
    entry = { value: text, source, count: 0, customers: new Set(), projects: new Set(), confirmed };
    list.push(entry);
  } else if (source === 'verified_profile' && entry.source !== 'verified_profile') {
    // A spelling somebody saved on a profile is the one they chose to keep, so
    // it outranks a spelling that only ever came off a scanner.
    entry.value = text;
    entry.source = 'verified_profile';
  }
  if (confirmed) {
    entry.confirmed = true;
    // And the spelling a person typed is the one kept.
    if (entry.source !== 'verified_profile') entry.value = text;
  }
  entry.count += weight;
  if (customer) entry.customers.add(normalizeName(customer));
  if (project) entry.projects.add(normalizeName(project));
}

function addRelationship(
  index: Map<string, Relationship>,
  kind: Relationship['kind'],
  field: keyof Ticket,
  from: string,
  to: string,
  weight = 1,
) {
  const key = `${kind}\u0000${normalizeName(from)}\u0000${normalizeName(to)}`;
  const found = index.get(key);
  if (found) {
    found.count += weight;
    return;
  }
  index.set(key, { kind, from: from.trim(), to: to.trim(), field, count: weight });
}

/**
 * How much one saved ticket's word is worth.
 *
 * A ticket a person saved from the review screen is a fact they checked:
 * one whole sighting. A ticket saved before `reviewed_at` existed has no
 * mark at all, and is the same thing — the review screen was the only way to
 * save then — so an absent mark is a person's, and only an explicit null,
 * which is what filing a ticket unreviewed writes, means nobody has looked.
 *
 * An unreviewed ticket is not nothing, though. What the reader saw WHOLE on
 * it — a carrier's name printed end to end and marked exact — is a reading,
 * not a guess, and the brief allows an exact extraction to be learned under
 * a safe rule. The rule is: only fields read whole, at half a sighting, so
 * six readings say as much as three checks and one reading says next to
 * nothing. Nothing recovered, proposed or unsettled is ever learned from a
 * ticket nobody reviewed.
 */
const sightingOf = (record: SavedRecord): { checked: boolean } => ({
  checked: record.reviewed_at !== null,
});

const UNREVIEWED_SIGHTING = 0.5;

/**
 * Everything this workspace has verified, from the records and profiles it is
 * handed. `records` is the workspace's saved tickets; only those a person
 * reviewed are read, and only the fields of those that were settled.
 */
export function buildMemory(
  records: SavedRecord[],
  profiles: {
    customers: CustomerProfile[];
    trucks: TruckProfile[];
    clients: ClientProfile[];
  },
): WorkspaceMemory {
  const values = new Map<keyof Ticket, VerifiedValue[]>();

  for (const customer of profiles.customers) {
    const name = customer.name?.trim() ?? '';
    for (const alias of [customer.name, ...(customer.ticket_names ?? [])]) {
      if (alias) addValue(values, 'customer_name', alias, 'verified_profile', name, null);
    }
    for (const id of customer.ticket_customer_ids ?? []) {
      if (id) addValue(values, 'customer_id', id, 'verified_profile', name, null);
    }
    // Job sites somebody saved on the customer: the addresses this customer's
    // loads actually go to, which is exactly what a clipped left edge eats.
    for (const address of customer.addresses ?? []) {
      if (address) addValue(values, 'project_address', address, 'verified_profile', name, null);
    }
  }
  for (const truck of profiles.trucks) {
    if (truck.truck_number) {
      addValue(values, 'vehicle_id', truck.truck_number, 'verified_profile', null, null);
    }
  }
  // Nothing is taken from `profiles.clients`: a client is who the invoice is
  // billed to, not anything printed on a plant ticket. Nor is there a profile
  // anywhere that records a carrier or a weighmaster, so those two are learned
  // from reviewed tickets or not at all. Memory that stretched to fill its own
  // gaps would be guessing under a better name.

  const index = new Map<string, Relationship>();
  const corrections: Correction[] = [];

  for (const record of records) {
    const { ticket, recovery } = record;
    const sighting = sightingOf(record);
    const weight = sighting.checked ? 1 : UNREVIEWED_SIGHTING;
    const verified = (field: keyof Ticket): string | null => {
      const value = ticket[field];
      if (typeof value !== 'string' || !value.trim()) return null;
      const resolution = recovery?.fields[field];
      // Unreviewed: only what the reader saw whole. A ticket with no record
      // of how it was read, and nobody's mark on it, says nothing.
      if (!sighting.checked) return resolution?.status === 'exact' ? value.trim() : null;
      return settled(resolution) ? value.trim() : null;
    };

    const customer = verified('customer_name');
    const project = verified('project_name');
    for (const field of LEARNED_FIELDS) {
      const value = verified(field);
      if (!value) continue;
      const confirmed = sighting.checked && recovery?.fields[field]?.confirmed_by_user === true;
      addValue(values, field, value, 'verified_history', customer, project, weight, confirmed);
    }

    const address = verified('project_address');
    const customerId = verified('customer_id');
    const plant = verified('plant_name');
    const productCode = verified('product_code');
    const productDescription = verified('product_description');
    const carrier = verified('carrier_name');
    const vehicle = verified('vehicle_id');
    if (customer && project) addRelationship(index, 'customer_project', 'project_name', customer, project, weight);
    if (customer && address) addRelationship(index, 'customer_address', 'project_address', customer, address, weight);
    if (customer && customerId) addRelationship(index, 'customer_id', 'customer_id', customer, customerId, weight);
    if (project && address) addRelationship(index, 'project_address', 'project_address', project, address, weight);
    if (plant && productCode) addRelationship(index, 'plant_product', 'product_code', plant, productCode, weight);
    if (carrier && vehicle) addRelationship(index, 'carrier_truck', 'vehicle_id', carrier, vehicle, weight);
    if (productCode && productDescription) {
      addRelationship(index, 'product_code_description', 'product_description', productCode, productDescription, weight);
    }

    // A correction is a person's; a ticket nobody reviewed has none.
    if (!sighting.checked) continue;
    const resolved = recovery?.fields ?? {};
    for (const name of Object.keys(resolved) as (keyof Ticket)[]) {
      const resolution = resolved[name];
      // A correction is the one place the app is told it read something wrong,
      // so it is kept whole: the print that was there, and what a person made
      // of it. Where the two agree nothing was corrected.
      if (!resolution || resolution.confirmed_by_user !== true) continue;
      const confirmed = typeof resolution.value === 'string' ? resolution.value.trim() : '';
      const visible = resolution.visible_text?.trim() ?? '';
      if (!confirmed || !visible || normalizeName(visible) === normalizeName(confirmed)) continue;
      corrections.push({
        field: name,
        vendor: recovery?.vendor ?? null,
        clipped_edge: resolution.clipped_edge,
        visible_text: visible,
        confirmed_value: confirmed,
        customer,
        project,
        at: record.reviewed_at ?? record.edited_at ?? record.saved_at,
      });
    }
  }

  return { values, relationships: [...index.values()], corrections };
}

const RANK = { strong: 3, moderate: 2, weak: 1 } as const;

/** Gathers evidence, keeping the strongest of any candidate said twice. */
function collector() {
  const found = new Map<string, Evidence>();
  return {
    add(item: Evidence) {
      // The customer an item is tied to is part of what it is: the same site
      // offered for two customers is two claims, and the resolver keeps only
      // the one whose customer this ticket matches.
      const key = `${item.field}\u0000${item.source}\u0000${normalizeName(item.candidate)}\u0000${normalizeName(item.context?.customer ?? '')}`;
      const seen = found.get(key);
      if (seen && RANK[seen.strength] >= RANK[item.strength]) return;
      found.set(key, item);
    },
    list: () => [...found.values()],
  };
}

/**
 * A field the reader saw end to end, or null. Whole print is the one thing
 * memory may stand on: it says which customer's history counts here, and it is
 * never a candidate for itself.
 */
function wholeValue(observed: ObservedTicket, field: keyof Ticket): string | null {
  const seen = observed.fields[field];
  if (!seen || isGap(seen)) return null;
  return seen.visible?.trim() || null;
}

/**
 * The customer a whole customer number belongs to, when the workspace knows of
 * exactly one. Two customers sharing a number is a tangle for a person, not
 * something to pick a side in.
 */
function customerOfId(memory: WorkspaceMemory, customerId: string | null): string | null {
  if (!customerId) return null;
  const key = normalizeName(customerId);
  const names = new Set<string>();
  let spelling: string | null = null;
  for (const link of memory.relationships) {
    if (link.kind !== 'customer_id' || normalizeName(link.to) !== key) continue;
    names.add(normalizeName(link.from));
    spelling ??= link.from;
  }
  return names.size === 1 ? spelling : null;
}

function relationshipNote(link: Relationship): string {
  const seen = `on ${tickets(link.count)}`;
  switch (link.kind) {
    case 'customer_project':
      return `${link.from} worked on ${link.to} ${seen}`;
    case 'customer_address':
      return `${link.from} hauled to ${link.to} ${seen}`;
    case 'customer_id':
      return `${link.from} is customer ${link.to} ${seen}`;
    case 'project_address':
      return `${link.from} is at ${link.to} ${seen}`;
    case 'plant_product':
      return `${link.from} loaded ${link.to} ${seen}`;
    case 'carrier_truck':
      return `${link.from} ran truck ${link.to} ${seen}`;
    default:
      return `${link.from} is ${link.to} ${seen}`;
  }
}

/**
 * What the workspace's memory has to say about the fields this ticket is
 * missing part of. Only fields the reader marked partial or clipped are spoken
 * about: a field read whole needs no help, and memory that argued with print
 * would be rewriting the paper.
 *
 * Nothing here decides anything. Every candidate is a reason, weighed against
 * the others by the resolver, which is also the one that refuses a completed
 * identifier however much history likes it.
 */
export function memoryEvidence(
  memory: WorkspaceMemory,
  observed: ObservedTicket,
  context: { vendor: string | null; customer: string | null; project: string | null },
): Evidence[] {
  const out = collector();
  const customer =
    context.customer?.trim() ||
    wholeValue(observed, 'customer_name') ||
    customerOfId(memory, wholeValue(observed, 'customer_id'));
  const project = context.project?.trim() || wholeValue(observed, 'project_name');

  // What on this ticket is solid enough to look a relationship up by.
  const anchors: { kind: Relationship['kind']; from: string | null }[] = [
    { kind: 'customer_project', from: customer },
    { kind: 'customer_address', from: customer },
    { kind: 'customer_id', from: customer },
    { kind: 'project_address', from: project },
    { kind: 'plant_product', from: wholeValue(observed, 'plant_name') },
    { kind: 'carrier_truck', from: wholeValue(observed, 'carrier_name') },
    { kind: 'product_code_description', from: wholeValue(observed, 'product_code') },
  ];

  for (const name of Object.keys(observed.fields)) {
    const field = name as keyof Ticket;
    const seen = observed.fields[field];
    if (!seen || !isGap(seen)) continue;
    const fragment = normalizeName(seen.visible?.trim() ?? '');
    // Two characters fit half the workspace. Below three there is nothing to
    // compare, and a candidate offered on that much is a guess with a citation.
    if (squash(fragment).length < 3) continue;

    if (EVIDENCE_VALUE_FIELDS.has(field)) {
      for (const known of memory.values.get(field) ?? []) {
        if (!fits(known.value, fragment, seen.clipped_edge)) continue;
        // The fragment itself is on file wherever a ticket was saved with the
        // print as it stood. Offered back, it read as "on file: Z FORCE
        // TRANSPO" under a field showing exactly that — a completion that
        // completes nothing.
        if (normalizeName(known.value) === fragment) continue;
        // A value a person typed or accepted once is settled: it stands as a
        // profile does, whatever the count. A value the reader only ever
        // read whole has to be seen a few times before it stands on its
        // own — three reviewed sightings is a fact checked three times. The
        // resolver still asks that nothing else on file fit the print, so
        // this is never a choice between two names.
        const strength =
          known.source === 'verified_profile' || known.confirmed || known.count >= 3
            ? 'strong'
            : known.count >= 2
              ? 'moderate'
              : 'weak';
        const where =
          known.source === 'verified_profile'
            ? 'saved on a profile'
            : `seen on ${tickets(known.count)}`;
        if (!CUSTOMER_BOUND_FIELDS.has(field)) {
          out.add({
            field,
            candidate: known.value,
            source: known.source,
            strength,
            note: `Known verified ${labelOf(field)}: ${known.value} (${where})`,
          });
          continue;
        }
        // A job site is somebody's. Seen with nobody — an old record with no
        // customer on it — it is offered untied but weak: it corroborates, it
        // does not decide. Seen with customers, it is offered to each of them
        // and to nobody else.
        if (known.customers.size === 0) {
          out.add({
            field,
            candidate: known.value,
            source: known.source,
            strength: 'weak',
            note: `Known verified ${labelOf(field)}: ${known.value} (${where}, with no customer named)`,
          });
          continue;
        }
        for (const owner of [...known.customers].sort()) {
          out.add({
            field,
            candidate: known.value,
            source: known.source,
            strength,
            note: `Known verified ${labelOf(field)}: ${known.value} (${where} for ${owner})`,
            context: { customer: owner },
          });
        }
      }
    }

    for (const anchor of anchors) {
      if (!anchor.from) continue;
      const from = normalizeName(anchor.from);
      const related = memory.relationships.filter(
        (link) => link.kind === anchor.kind && link.field === field && normalizeName(link.from) === from,
      );
      // One value on file and nothing else is what makes a relationship worth
      // leaning on; a customer with two job sites has told us only that it has
      // two, and which one this load went to is still an open question.
      const only = related.length === 1;
      for (const link of related) {
        if (!fits(link.to, fragment, seen.clipped_edge)) continue;
        // The one identifier history may speak about, and only when a named
        // customer owns exactly one of them.
        if (field === 'customer_id' && !only) continue;
        out.add({
          field,
          candidate: link.to,
          source: 'historical_relationship',
          strength: link.count >= 2 && only ? 'strong' : 'moderate',
          note: relationshipNote(link),
          context:
            anchor.kind === 'project_address'
              ? { project: anchor.from }
              : anchor.kind.startsWith('customer')
                ? { customer: anchor.from }
                : {},
        });
      }
    }

    for (const correction of memory.corrections) {
      if (correction.field !== field) continue;
      // The vendor's layout is part of what was corrected: the same print at
      // the same edge means something else on another supplier's ticket.
      if (correction.vendor !== null && correction.vendor !== context.vendor) continue;
      // The same edge, where both readings say which; a reading that names
      // no edge is not held to one.
      if (
        correction.clipped_edge !== null &&
        seen.clipped_edge !== null &&
        correction.clipped_edge !== seen.clipped_edge
      ) {
        continue;
      }
      // Matched by what the print could be, not by the exact print: a
      // person who typed "Z FORCE TRANSPORTATION" over "Z FORCE TRANSPO"
      // has said what a ticket reading "Z FORCE TRAN" is too. The fragment
      // has to fit the confirmed value the way it fits any candidate, and
      // a correction that merely restates the fragment is no correction.
      if (!fits(correction.confirmed_value, fragment, seen.clipped_edge)) continue;
      if (normalizeName(correction.confirmed_value) === fragment) continue;
      const customerSame = matches(correction.customer, customer);
      const projectSame = matches(correction.project, project);
      // A job site corrected for one customer is not evidence about
      // another's ticket, however alike the two readings look. A carrier,
      // a plant or a product is the same fact whoever the ticket is for.
      const bound = CUSTOMER_BOUND_FIELDS.has(field);
      if (bound && (customerSame === 'different' || projectSame === 'different')) continue;
      const inContext = customerSame === 'same' || projectSame === 'same';
      out.add({
        field,
        candidate: correction.confirmed_value,
        source: 'user_correction',
        strength: inContext || !bound ? 'strong' : 'moderate',
        note: `You corrected “${correction.visible_text}” to “${correction.confirmed_value}” before${
          customerSame === 'same' ? ' for this customer' : projectSame === 'same' ? ' on this job' : ''
        }`,
        context: {
          vendor: correction.vendor,
          customer: correction.customer,
          project: correction.project,
        },
      });
    }
  }

  return out.list();
}

/** How a correction's context stands against this ticket's. */
function matches(stored: string | null, here: string | null): 'same' | 'different' | 'unknown' {
  if (!stored || !here) return 'unknown';
  return normalizeName(stored) === normalizeName(here) ? 'same' : 'different';
}

/** A ticket of the same upload, as a person would name it in review. */
const otherLabel = (ticket: Ticket) => {
  const number = ticket.ticket_number?.trim();
  return number ? `Ticket ${number}` : 'Another ticket';
};

/**
 * Whether another ticket of the upload carries this field end to end. A ticket
 * that is itself missing part of the field has nothing to lend.
 */
function otherWhole(
  other: { ticket: Ticket; observed?: ObservedTicket },
  field: keyof Ticket,
): string | null {
  const value = other.ticket[field];
  if (typeof value !== 'string' || !value.trim()) return null;
  const seen = other.observed?.fields[field];
  if (seen && isGap(seen)) return null;
  return value.trim();
}

/**
 * What the rest of the upload says about this ticket's gaps. Tickets for one
 * job share a customer, a project and a destination, and a page that lost its
 * left edge usually has a sister page that did not — this is
 * `fillFromSameOrder` said as evidence instead of as a fill, so a person can
 * see which ticket the reading came from and the resolver can weigh it against
 * everything else rather than quietly winning.
 *
 * `others` are the upload's other tickets; the ticket being resolved is
 * excluded by identity, so passing the whole upload is fine.
 */
export function batchEvidence(
  others: { ticket: Ticket; observed?: ObservedTicket }[],
  observed: ObservedTicket,
): Evidence[] {
  const out = collector();
  const order = wholeValue(observed, 'order_number');
  const customerId = wholeValue(observed, 'customer_id');
  const customerName = wholeValue(observed, 'customer_name');

  for (const field of BATCH_FIELDS) {
    const seen = observed.fields[field];
    // Never for a field this ticket shows whole: the paper in hand outranks
    // the paper beside it.
    if (seen && !isGap(seen) && seen.visible?.trim()) continue;
    const fragment = seen ? normalizeName(seen.visible?.trim() ?? '') : '';
    const blank = !fragment;
    if (!blank && squash(fragment).length < 3) continue;

    for (const other of others) {
      if (other.observed === observed) continue;
      const value = otherWhole(other, field);
      if (!value) continue;
      const sharedOrder = order ? otherWhole(other, 'order_number') : null;
      const sameOrder = Boolean(sharedOrder && order && normalizeName(sharedOrder) === normalizeName(order));
      const sharedId = customerId ? otherWhole(other, 'customer_id') : null;
      const sameCustomer = Boolean(sharedId && customerId && normalizeName(sharedId) === normalizeName(customerId));
      const from = otherLabel(other.ticket);
      const named = sameOrder ? `${from} with order ${order}` : `${from} in this upload`;
      if (blank) {
        // A blank field is only spoken for by a ticket of the same order —
        // that is the one thing that says the two pages are the same job. The
        // resolver decides whether a blank may be filled from the batch at
        // all; this only reports that the reading is there.
        if (!sameOrder) continue;
        out.add({
          field,
          candidate: value,
          source: 'batch_context',
          strength: 'strong',
          note: `${named} reads “${value}”`,
          ...(sameCustomer
            ? { context: { customer: other.ticket.customer_name?.trim() || customerName } }
            : {}),
        });
        continue;
      }
      if (!fits(value, fragment, seen?.clipped_edge ?? null)) continue;
      out.add({
        field,
        candidate: value,
        source: 'batch_context',
        strength: sameOrder || sameCustomer ? 'moderate' : 'weak',
        note: `${named} reads “${value}”`,
        ...(sameCustomer
          ? { context: { customer: other.ticket.customer_name?.trim() || customerName } }
          : {}),
      });
    }
  }

  return out.list();
}
