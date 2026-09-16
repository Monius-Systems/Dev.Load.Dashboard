import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSeries } from '../lib/load-desk/load-series.ts';
import { emptyTicket, type SavedRecord } from '../lib/load-desk/types.ts';

// Tuesday, September 15, 2026, mid-morning local time.
const NOW = new Date(2026, 8, 15, 10, 30);

let nextId = 0;
const load = (date: string, tons: number, timeOut: string | null = null) =>
  ({
    id: ++nextId,
    saved_at: '2026-09-15T15:00:00.000Z',
    ticket: { ...emptyTicket(), ticket_date: date, net_tons: tons, time_out: timeOut },
  }) as unknown as SavedRecord;

const nonZero = (series: ReturnType<typeof loadSeries>) =>
  series.points.filter((item) => item.loads).map((item) => [item.label, item.loads, item.tons]);

void test('this month has a point for every day and skips other months', () => {
  const series = loadSeries(
    [load('2026-09-02', 22.98), load('2026-09-02', 22.63), load('2026-09-04', 22.93), load('2026-08-31', 20)],
    'month',
    NOW,
  );
  assert.equal(series.points.length, 30);
  assert.deepEqual(nonZero(series), [
    ['Sep 2', 2, 45.61],
    ['Sep 4', 1, 22.93],
  ]);
  assert.equal(series.loads, 3);
  assert.equal(series.tons, 68.54);
});

void test('today is charted by hour; a load without a time is only counted', () => {
  const series = loadSeries(
    [load('2026-09-15', 22, '13:20'), load('2026-09-15', 21), load('2026-09-14', 20, '09:00')],
    'today',
    NOW,
  );
  assert.equal(series.points.length, 24);
  assert.deepEqual(nonZero(series), [['1 PM', 1, 22]]);
  assert.equal(series.points[13].detail, '1 PM – 2 PM');
  assert.equal(series.loads, 2);
  assert.equal(series.untimed, 1);
});

void test('this week runs Monday to Sunday', () => {
  const series = loadSeries(
    [load('2026-09-13', 1), load('2026-09-14', 2), load('2026-09-20', 3), load('2026-09-21', 4)],
    'week',
    NOW,
  );
  assert.deepEqual(series.points.map((item) => item.label), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  assert.equal(series.points[0].detail, 'Mon, Sep 14');
  assert.deepEqual(nonZero(series), [
    ['Mon', 1, 2],
    ['Sun', 1, 3],
  ]);
});

void test('this year is twelve months', () => {
  const series = loadSeries([load('2026-01-07', 5), load('2025-12-30', 9)], 'year', NOW);
  assert.equal(series.points.length, 12);
  assert.deepEqual(nonZero(series), [['Jan', 1, 5]]);
  assert.equal(series.points[0].detail, 'January 2026');
});

void test('lifetime runs from the first load, at least six months, by year past three years', () => {
  const byMonth = loadSeries([load('2025-01-07', 22.91), load('2026-09-02', 23)], 'lifetime', NOW);
  assert.equal(byMonth.points.length, 21);
  assert.equal(byMonth.points[0].label, "Jan '25");
  assert.equal(byMonth.points.at(-1)?.detail, 'September 2026');

  const recent = loadSeries([load('2026-09-02', 23)], 'lifetime', NOW);
  assert.equal(recent.points.length, 6);
  assert.equal(recent.points[0].label, "Apr '26");

  const byYear = loadSeries([load('2021-03-01', 10), load('2026-09-02', 23)], 'lifetime', NOW);
  assert.deepEqual(byYear.points.map((item) => item.label), ['2021', '2022', '2023', '2024', '2025', '2026']);
  assert.equal(byYear.tons, 33);

  assert.equal(loadSeries([], 'lifetime', NOW).points.length, 6);
});

void test('loads split into groups per point and over the period', () => {
  const tagged = (date: string, customer: string, timeOut: string | null = null) => {
    const record = load(date, 20, timeOut);
    record.ticket.customer_name = customer;
    return record;
  };
  const series = loadSeries(
    [
      tagged('2026-09-02', 'K FIVE'),
      tagged('2026-09-02', 'WITECH'),
      tagged('2026-09-03', 'K FIVE'),
      tagged('2026-08-30', 'WITECH'),
    ],
    'month',
    NOW,
    (record) => record.ticket.customer_name ?? 'none',
  );
  assert.deepEqual(series.points[1].groups, { 'K FIVE': 1, WITECH: 1 });
  assert.deepEqual(series.points[2].groups, { 'K FIVE': 1 });
  assert.deepEqual(series.points[0].groups, {});
  assert.deepEqual(series.groupTotals, { 'K FIVE': 2, WITECH: 1 });

  const today = loadSeries([tagged('2026-09-15', 'K FIVE')], 'today', NOW, () => 'K FIVE');
  assert.equal(today.untimed, 1);
  assert.deepEqual(today.groupTotals, { 'K FIVE': 1 });
});
