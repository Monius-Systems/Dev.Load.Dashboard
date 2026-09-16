import type { Ticket } from './types.ts';

// Tickets for one job share a customer, project and destination. When OCR
// misses one of those on a page, another ticket in the same upload with the
// same order number usually has it.

const SHARED_FIELDS: [keyof Ticket, string][] = [
  ['customer_id', 'customer number'],
  ['customer_name', 'customer name'],
  ['project_name', 'project'],
  ['project_address', 'destination address'],
  ['po_number', 'P.O. number'],
];

/**
 * Fills empty job fields from other tickets with the same order number.
 * Returns each ticket (a copy when changed) with the labels of what was filled.
 */
export function fillFromSameOrder(
  tickets: Ticket[],
): { ticket: Ticket; filled: string[] }[] {
  return tickets.map((ticket) => {
    const order = ticket.order_number?.trim();
    if (!order) return { ticket, filled: [] };
    const others = tickets.filter(
      (other) => other !== ticket && other.order_number?.trim() === order,
    );
    const next = { ...ticket };
    const filled: string[] = [];
    for (const [key, label] of SHARED_FIELDS) {
      if (next[key] !== null) continue;
      const source = others.find((other) => other[key] !== null);
      if (!source) continue;
      Object.assign(next, { [key]: source[key] });
      filled.push(label);
    }
    return { ticket: filled.length ? next : ticket, filled };
  });
}
