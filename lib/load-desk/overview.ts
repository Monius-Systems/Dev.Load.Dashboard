import { lineTotal } from './format.ts';
import {
  customerIdFor,
  loadDate,
  localIso,
  normalizeKey,
  normalizeName,
  truckIdFor,
  type CustomerProfile,
  type TruckProfile,
} from './profiles.ts';
import { recordTons } from './records.ts';
import { RATING_ISSUES, validateTicket } from './validate.ts';
import type { SavedRecord } from './types.ts';

// Figures for the home page. Loads count on their ticket date (like the
// Customers and Company pages); weeks start on Monday, in local time.

export type Totals = { loads: number; tons: number; billed: number };

const emptyTotals = (): Totals => ({ loads: 0, tons: 0, billed: 0 });

function addLoad(totals: Totals, record: SavedRecord) {
  totals.loads += 1;
  totals.tons += recordTons(record);
  totals.billed += lineTotal(record.ticket) ?? 0;
}

const rounded = (totals: Totals): Totals => ({
  loads: totals.loads,
  tons: Math.round(totals.tons * 100) / 100,
  billed: Math.round(totals.billed * 100) / 100,
});

/** This and last week, this and last month. */
export function periodComparison(records: SavedRecord[], now: Date) {
  const monday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - ((now.getDay() + 6) % 7),
  );
  const shift = (days: number) =>
    localIso(
      new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + days),
    );
  const [lastWeekStart, weekStart, nextWeekStart] = [shift(-7), shift(0), shift(7)];
  const month = localIso(now).slice(0, 7);
  const lastMonth = localIso(new Date(now.getFullYear(), now.getMonth() - 1, 1)).slice(0, 7);

  const week = emptyTotals();
  const lastWeek = emptyTotals();
  const thisMonth = emptyTotals();
  const previousMonth = emptyTotals();
  for (const record of records) {
    const date = loadDate(record);
    if (date >= weekStart && date < nextWeekStart) addLoad(week, record);
    if (date >= lastWeekStart && date < weekStart) addLoad(lastWeek, record);
    if (date.slice(0, 7) === month) addLoad(thisMonth, record);
    if (date.slice(0, 7) === lastMonth) addLoad(previousMonth, record);
  }
  return {
    week: rounded(week),
    lastWeek: rounded(lastWeek),
    month: rounded(thisMonth),
    lastMonth: rounded(previousMonth),
  };
}

export type MonthBucket = Totals & {
  key: string;
  year: number;
  /** 0-11 */
  month: number;
};

/**
 * Loads per month for the `count` months ending this month. When nothing
 * falls in that window but older loads exist, the window ends at the month of
 * the latest load instead (`shifted`), so the chart is never empty for them.
 */
export function monthlyLoads(
  records: SavedRecord[],
  now: Date,
  count = 12,
): { buckets: MonthBucket[]; shifted: boolean } {
  const monthAt = (end: Date, back: number) => {
    const date = new Date(end.getFullYear(), end.getMonth() - back, 1);
    return {
      key: localIso(date).slice(0, 7),
      year: date.getFullYear(),
      month: date.getMonth(),
    };
  };
  let end = new Date(now.getFullYear(), now.getMonth(), 1);
  const startKey = monthAt(end, count - 1).key;
  const endKey = monthAt(end, 0).key;
  const keys = records
    .map((record) => loadDate(record).slice(0, 7))
    .filter((key) => /^\d{4}-\d{2}$/.test(key));
  let shifted = false;
  if (keys.length && !keys.some((key) => key >= startKey && key <= endKey)) {
    const latest = keys.reduce((a, b) => (b > a ? b : a));
    if (latest < startKey) {
      end = new Date(Number(latest.slice(0, 4)), Number(latest.slice(5, 7)) - 1, 1);
      shifted = true;
    }
  }
  const buckets: MonthBucket[] = Array.from({ length: count }, (_, index) => ({
    ...monthAt(end, count - 1 - index),
    ...emptyTotals(),
  }));
  const position = new Map(buckets.map((bucket, index) => [bucket.key, index]));
  for (const record of records) {
    const index = position.get(loadDate(record).slice(0, 7));
    if (index !== undefined) addLoad(buckets[index], record);
  }
  return {
    buckets: buckets.map((bucket) => ({ ...bucket, ...rounded(bucket) })),
    shifted,
  };
}

/**
 * Tickets with a problem other than an incomplete rate (a missing rate, or
 * missing hours on an hourly rate); drafts are counted apart.
 */
export const ticketsNeedingReview = (records: SavedRecord[]) =>
  records.filter((record) =>
    // With the recovery record: a field still waiting to be checked against
    // the original is a problem with the ticket, not with its rate, so it
    // belongs in this count rather than among the drafts.
    validateTicket(record.ticket, record.recovery).some(
      (issue) => !RATING_ISSUES.has(issue),
    ),
  );

/** Distinct customers on saved tickets that match no customer profile. */
export function unmatchedCustomerCount(
  records: SavedRecord[],
  customers: CustomerProfile[],
): number {
  const keys = new Set<string>();
  for (const record of records) {
    if (customerIdFor(record, customers) !== null) continue;
    const id = record.ticket.customer_id?.trim();
    const name = record.ticket.customer_name?.trim();
    if (id) keys.add(`id:${normalizeKey(id)}`);
    else if (name) keys.add(`name:${normalizeName(name)}`);
  }
  return keys.size;
}

/** Distinct invoice truck numbers that match no truck profile. */
export function unmatchedTruckCount(
  records: SavedRecord[],
  trucks: TruckProfile[],
): number {
  const keys = new Set<string>();
  for (const record of records) {
    const number = record.invoice.truck_number.trim();
    if (number && truckIdFor(record, trucks) === null) {
      keys.add(normalizeKey(number));
    }
  }
  return keys.size;
}

/** A saved ticket's customer: its profile when matched, else the name printed on it. */
export function customerKey(
  record: SavedRecord,
  customers: CustomerProfile[],
): { key: string; name: string } {
  const id = customerIdFor(record, customers);
  const profile = customers.find((customer) => customer.id === id);
  const name = profile?.name ?? record.ticket.customer_name?.trim() ?? 'No customer';
  return { key: profile ? `profile:${profile.id}` : `name:${normalizeName(name)}`, name };
}

/** Loads per customer (profile name when matched), most loads first. */
export function customerTotals(
  records: SavedRecord[],
  customers: CustomerProfile[],
): { key: string; name: string; totals: Totals }[] {
  const grouped = new Map<string, { key: string; name: string; totals: Totals }>();
  for (const record of records) {
    const { key, name } = customerKey(record, customers);
    const entry = grouped.get(key) ?? { key, name, totals: emptyTotals() };
    addLoad(entry.totals, record);
    grouped.set(key, entry);
  }
  return [...grouped.values()]
    .map((entry) => ({ ...entry, totals: rounded(entry.totals) }))
    .sort(
      (a, b) =>
        b.totals.loads - a.totals.loads ||
        b.totals.billed - a.totals.billed ||
        a.name.localeCompare(b.name),
    );
}
