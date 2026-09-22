import type { EntityRef } from '@/lib/operator/types';
import type { SavedRecord } from '@/lib/load-desk/types';

// Where the dashboard shows each thing the Operator talks about.
//
// The panel turns an EntityRef into a link, so a sentence about invoice #284
// is one tap from the invoice. The hrefs are the app's own query parameters,
// written here rather than imported from lib/operator/entities.ts because the
// read tools and the run engine are built at the same time; the conventions
// are the same on both sides, and the engine is free to re-label a ref it is
// given without changing where it points.

const query = (value: string | number) => encodeURIComponent(String(value));

/** A ticket, labelled by the number printed on it where it was read. */
export const ticketRef = (record: Pick<SavedRecord, 'id' | 'ticket'>): EntityRef => ({
  type: 'ticket',
  id: String(record.id),
  label: record.ticket.ticket_number?.trim()
    ? `Ticket ${record.ticket.ticket_number.trim()}`
    : `Ticket ${record.id}`,
  href: `/records?ticket=${query(record.id)}`,
});

/** An invoice, by the key its tickets are grouped under. */
export const invoiceRef = (key: string, invoiceNumber: string): EntityRef => ({
  type: 'invoice',
  id: key,
  label: `Invoice #${invoiceNumber || key}`,
  href: `/records?invoice=${query(key)}`,
});

export const customerRef = (id: number, name: string): EntityRef => ({
  type: 'customer',
  id: String(id),
  label: name || `Customer ${id}`,
  href: `/customers?customer=${query(id)}`,
});

export const truckRef = (id: number, truckNumber: string): EntityRef => ({
  type: 'truck',
  id: String(id),
  label: `Truck ${truckNumber || id}`,
  href: `/fleet?edit=${query(id)}`,
});

/** One truck's one day of mileage, keyed the way the mileage store keys it. */
export const mileageDayRef = (truckId: number, truckNumber: string, date: string): EntityRef => ({
  type: 'mileage_day',
  id: `${truckId}|${date}`,
  label: `Truck ${truckNumber || truckId} on ${date}`,
  href: `/mileage?truck=${query(truckId)}&date=${query(date)}`,
});

export const rateRequestRef = (id: number, label: string): EntityRef => ({
  type: 'rate_request',
  id: String(id),
  label,
  href: `/rates?request=${query(id)}`,
});

/** A job site, keyed by its delivery address the way rates.ts keys one. */
export const projectRef = (jobKey: string, label: string): EntityRef => ({
  type: 'project',
  id: jobKey,
  label: label || jobKey,
  href: `/customers?job=${query(jobKey)}`,
});

/**
 * A question the backlog raises. No page shows a group on its own — the
 * review screen shows its tickets — so the ref carries no href rather than
 * one that would land nowhere.
 */
export const exceptionRef = (key: string, label: string): EntityRef => ({
  type: 'exception',
  id: key,
  label,
  href: null,
});
