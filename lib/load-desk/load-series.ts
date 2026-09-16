import { loadDate, localIso, PERIODS, type Period } from './profiles.ts';
import { recordTons } from './records.ts';
import type { SavedRecord } from './types.ts';

// Loads and tons over a period, in chart buckets: the hours of today, the days
// of this week or month, the months of this year, and the months (or years,
// past three years) of all time. Loads can also be split into groups, such as
// one line per customer.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** "today", "this week"… for sentences such as "3 loads this week". */
export const PERIOD_PHRASE: Record<Period, string> = {
  today: 'today',
  week: 'this week',
  month: 'this month',
  year: 'this year',
  lifetime: 'in total',
};

export const isPeriod = (value: string): value is Period =>
  PERIODS.some(([key]) => key === value);

export type SeriesPoint = {
  key: string;
  /** Short axis label: "1 PM", "Mon", "Sep 4", "Sep" or "Sep '26". */
  label: string;
  /** Tooltip heading: "1 PM – 2 PM", "Mon, Sep 14", "September 2026". */
  detail: string;
  loads: number;
  tons: number;
  /** Loads per group key, when the series is grouped. */
  groups: Record<string, number>;
};

export type LoadSeries = {
  points: SeriesPoint[];
  loads: number;
  tons: number;
  /** Today only: loads without a time, counted in the totals but not charted. */
  untimed: number;
  /** Loads per group key over the whole period, untimed loads included. */
  groupTotals: Record<string, number>;
};

const round2 = (value: number) => Math.round(value * 100) / 100;
const hourLabel = (hour: number) => `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`;
const monthKey = (year: number, month: number) =>
  `${year}-${String(month + 1).padStart(2, '0')}`;
const point = (key: string, label: string, detail: string): SeriesPoint => ({
  key,
  label,
  detail,
  loads: 0,
  tons: 0,
  groups: {},
});

/** The hour a load left the plant (or came in), from "HH:MM"; null without a time. */
function loadHour(record: SavedRecord): number | null {
  const match = (record.ticket.time_out ?? record.ticket.time_in)?.match(/^(\d{2}):\d{2}$/);
  return match ? Number(match[1]) : null;
}

export function loadSeries(
  records: SavedRecord[],
  period: Period,
  now: Date,
  groupOf?: (record: SavedRecord) => string,
): LoadSeries {
  const today = localIso(now);
  const year = now.getFullYear();
  const month = now.getMonth();
  const points: SeriesPoint[] = [];
  // The bucket a load falls in, 'untimed' for today without a time, or null
  // when the load is outside the period.
  let bucketOf: (date: string, record: SavedRecord) => string | null;

  if (period === 'today') {
    for (let hour = 0; hour < 24; hour++) {
      points.push(point(String(hour), hourLabel(hour), `${hourLabel(hour)} – ${hourLabel((hour + 1) % 24)}`));
    }
    bucketOf = (date, record) =>
      date === today ? (loadHour(record)?.toString() ?? 'untimed') : null;
  } else if (period === 'week') {
    const monday = new Date(year, month, now.getDate() - ((now.getDay() + 6) % 7));
    for (let offset = 0; offset < 7; offset++) {
      const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + offset);
      points.push(
        point(localIso(day), DAYS[offset], `${DAYS[offset]}, ${MONTHS[day.getMonth()]} ${day.getDate()}`),
      );
    }
    bucketOf = (date) => date;
  } else if (period === 'month') {
    const days = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= days; day++) {
      points.push(
        point(localIso(new Date(year, month, day)), `${MONTHS[month]} ${day}`, `${MONTHS[month]} ${day}, ${year}`),
      );
    }
    bucketOf = (date) => date;
  } else if (period === 'year') {
    for (let index = 0; index < 12; index++) {
      points.push(point(monthKey(year, index), MONTHS[index], `${FULL_MONTHS[index]} ${year}`));
    }
    bucketOf = (date) => date.slice(0, 7);
  } else {
    const dates = records.map(loadDate).sort();
    const first = dates[0] ?? today;
    const latest = dates.at(-1);
    const last = latest && latest > today ? latest : today;
    const end = Number(last.slice(0, 4)) * 12 + Number(last.slice(5, 7)) - 1;
    // At least six months, so a first load still draws a line.
    const start = Math.min(Number(first.slice(0, 4)) * 12 + Number(first.slice(5, 7)) - 1, end - 5);
    if (end - start + 1 > 36) {
      for (let at = Math.floor(start / 12); at <= Math.floor(end / 12); at++) {
        points.push(point(String(at), String(at), String(at)));
      }
      bucketOf = (date) => date.slice(0, 4);
    } else {
      for (let at = start; at <= end; at++) {
        const y = Math.floor(at / 12);
        const m = at % 12;
        points.push(point(monthKey(y, m), `${MONTHS[m]} '${String(y).slice(2)}`, `${FULL_MONTHS[m]} ${y}`));
      }
      bucketOf = (date) => date.slice(0, 7);
    }
  }

  const byKey = new Map(points.map((item) => [item.key, item]));
  let loads = 0;
  let tons = 0;
  let untimed = 0;
  const groupTotals: Record<string, number> = {};
  for (const record of records) {
    const key = bucketOf(loadDate(record), record);
    const bucket = key === null ? undefined : byKey.get(key);
    if (!bucket && key !== 'untimed') continue;
    const recordWeight = recordTons(record);
    const group = groupOf?.(record);
    loads += 1;
    tons += recordWeight;
    if (group !== undefined) groupTotals[group] = (groupTotals[group] ?? 0) + 1;
    if (bucket) {
      bucket.loads += 1;
      bucket.tons += recordWeight;
      if (group !== undefined) bucket.groups[group] = (bucket.groups[group] ?? 0) + 1;
    } else {
      untimed += 1;
    }
  }
  for (const item of points) item.tons = round2(item.tons);
  return { points, loads, tons: round2(tons), untimed, groupTotals };
}
