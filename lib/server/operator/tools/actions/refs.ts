import type { EntityRef } from '@/lib/operator/types';

// Where the dashboard shows each thing the Operator names, so the panel can
// make every mention a link a person can follow. The conventions are the read
// tools' as well; both sides must produce the same href for the same thing, or
// the same ticket would be two different links in one answer.

const q = (value: string | number) => encodeURIComponent(String(value));

export const ticketRef = (id: number, label?: string): EntityRef => ({
  type: 'ticket',
  id: String(id),
  label: label ?? `Ticket #${id}`,
  href: `/records?ticket=${q(id)}`,
});

export const invoiceRef = (key: string, invoiceNumber?: string): EntityRef => ({
  type: 'invoice',
  id: key,
  label: `Invoice ${invoiceNumber ?? key}`,
  href: `/records?invoice=${q(key)}`,
});

export const customerRef = (id: number, name: string): EntityRef => ({
  type: 'customer',
  id: String(id),
  label: name,
  href: `/customers?customer=${q(id)}`,
});

export const truckRef = (id: number, truckNumber: string): EntityRef => ({
  type: 'truck',
  id: String(id),
  label: `Truck ${truckNumber}`,
  href: `/fleet?edit=${q(id)}`,
});

/** A truck-day is keyed the way the mileage page keys one: "truck|date". */
export const mileageDayRef = (
  truckId: number,
  truckNumber: string,
  date: string,
): EntityRef => ({
  type: 'mileage_day',
  id: `${truckId}|${date}`,
  label: `Truck ${truckNumber} on ${date}`,
  href: `/mileage?truck=${q(truckId)}&date=${q(date)}`,
});

export const rateRequestRef = (id: number, label: string): EntityRef => ({
  type: 'rate_request',
  id: String(id),
  label,
  href: `/rates?request=${q(id)}`,
});

/** An open question on the review screen, which has no page of its own yet. */
export const exceptionRef = (key: string, label: string): EntityRef => ({
  type: 'exception',
  id: key,
  label,
  href: null,
});
