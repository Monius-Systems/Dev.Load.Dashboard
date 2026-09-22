import type { EntityRef, EntityType } from './types.ts';

// The things the Operator names, and where the dashboard shows each of them.
//
// Every tool that mentions a ticket, an invoice or a truck builds its reference
// through one of these, so that a link is written once rather than in each tool
// that happens to return that kind of thing. The href is a query on a page the
// dashboard already has: the panel hands it to the router, the page reads its
// own parameter and opens the thing. A kind of entity with no page yet gets a
// null href, which the panel renders as plain text rather than a dead link.
//
// Nothing here reads the database. A reference is a label and a route, and the
// figures behind it always come from the service the tool called.

/** Every entity type, as a value, so a request body can be checked against it. */
export const ENTITY_TYPES: readonly EntityType[] = [
  'ticket',
  'invoice',
  'customer',
  'client',
  'project',
  'truck',
  'mileage_day',
  'rate_request',
  'rate_period',
  'exception',
];

export const isEntityType = (value: unknown): value is EntityType =>
  typeof value === 'string' && (ENTITY_TYPES as readonly string[]).includes(value);

/** A query value, escaped, so an invoice key with a slash in it still links. */
const q = (value: string): string => encodeURIComponent(value);

export const ticketRef = (id: string, label: string): EntityRef => ({
  type: 'ticket',
  id,
  label,
  href: `/records?ticket=${q(id)}`,
});

export const invoiceRef = (key: string, number: string): EntityRef => ({
  type: 'invoice',
  id: key,
  label: number,
  href: `/records?invoice=${q(key)}`,
});

export const customerRef = (id: string, name: string): EntityRef => ({
  type: 'customer',
  id,
  label: name,
  href: `/customers?customer=${q(id)}`,
});

export const truckRef = (id: string, number: string): EntityRef => ({
  type: 'truck',
  id,
  label: number,
  href: `/fleet?edit=${q(id)}`,
});

/**
 * One truck's one day. The identifier joins the two halves with a bar, because
 * a day is not a row anybody can point at: it is what the mileage calculation
 * worked out for that truck on that date.
 */
export const mileageDayRef = (
  truckId: string,
  date: string,
  truckNumber: string,
): EntityRef => ({
  type: 'mileage_day',
  id: `${truckId}|${date}`,
  label: `Truck ${truckNumber}, ${date}`,
  href: `/mileage?truck=${q(truckId)}&date=${q(date)}`,
});

export const rateRequestRef = (id: string, customerName: string): EntityRef => ({
  type: 'rate_request',
  id,
  label: `Rate request for ${customerName}`,
  href: `/rates?request=${q(id)}`,
});

export const projectRef = (jobKey: string, label: string): EntityRef => ({
  type: 'project',
  id: jobKey,
  label,
  href: `/customers?job=${q(jobKey)}`,
});

/**
 * An exception is a grouping the Load Desk works out as it reads, rather than
 * a stored row, so the link goes to the desk itself and the person sees the
 * group in place.
 */
export const exceptionRef = (id: string, label: string): EntityRef => ({
  type: 'exception',
  id,
  label,
  href: '/load-desk',
});

/**
 * The same list with each thing named once. Tools are free to return the same
 * customer from three different reads; a person should see it once, in the
 * order it was first mentioned, with the label the first tool gave it.
 */
export function dedupeEntities(refs: EntityRef[]): EntityRef[] {
  const seen = new Set<string>();
  const out: EntityRef[] = [];
  for (const ref of refs) {
    const key = `${ref.type}:${ref.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(ref);
  }
  return out;
}
