import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { MileageLeg, MileagePlace } from '../lib/load-desk/mileage.ts';
import {
  decodePolyline,
  fitBounds,
  googleMapsDirectionsUrl,
  legsWithStops,
  stopsFromLegs,
} from '../lib/load-desk/route-geometry.ts';

// Google's documented example, the one every decoder is checked against.
const EXAMPLE = '_p~iF~ps|U_ulLnnqC_mqNvxq`@';

void test('decodePolyline reads the documented example at precision 5', () => {
  assert.deepEqual(decodePolyline(EXAMPLE, 5), [
    { lat: 38.5, lon: -120.2 },
    { lat: 40.7, lon: -120.95 },
    { lat: 43.252, lon: -126.453 },
  ]);
});

void test('decodePolyline scales the same values at precision 7', () => {
  assert.deepEqual(decodePolyline(EXAMPLE, 7), [
    { lat: 0.385, lon: -1.202 },
    { lat: 0.407, lon: -1.2095 },
    { lat: 0.43252, lon: -1.26453 },
  ]);
});

void test('decodePolyline keeps what it could read and never throws', () => {
  assert.deepEqual(decodePolyline('', 5), []);
  // A whole point, then a chunk that never ends.
  const partial = decodePolyline('_p~iF~ps|U_ulL', 5);
  assert.deepEqual(partial, [{ lat: 38.5, lon: -120.2 }]);
  // Characters outside the alphabet stop the read rather than blow up.
  assert.deepEqual(decodePolyline('_p~iF~ps|U' + String.fromCharCode(1, 2), 5), [{ lat: 38.5, lon: -120.2 }]);
});

// ------------------------------------------------------------------- stops

const place = (name: string, lat: number, lon: number): MileagePlace => ({
  label: name,
  place_key: name.toLowerCase(),
  lat,
  lon,
});

const YARD = place('Yard', 41.6, -87.6);
const PICKUP = place('Thornton', 41.57, -87.62);
const DELIVERY = place('Markham', 41.59, -87.69);

const leg = (
  seq: number,
  kind: MileageLeg['kind'],
  ticketId: number | null,
  from: MileagePlace,
  to: MileagePlace,
): MileageLeg => ({
  seq,
  kind,
  ticket_id: ticketId,
  from,
  to,
  miles: 10,
  seconds: 900,
  route_id: seq,
  cached: true,
});

// Yard → P → D → P → D → Yard, both tickets loading and tipping at one place.
const DAY: MileageLeg[] = [
  leg(1, 'yard_to_pickup', 1, YARD, PICKUP),
  leg(2, 'pickup_to_delivery', 1, PICKUP, DELIVERY),
  leg(3, 'delivery_to_pickup', 2, DELIVERY, PICKUP),
  leg(4, 'pickup_to_delivery', 2, PICKUP, DELIVERY),
  leg(5, 'delivery_to_yard', 2, DELIVERY, YARD),
];

void test('stopsFromLegs keeps one stop per place and stacks the labels', () => {
  const stops = stopsFromLegs(DAY);
  assert.equal(stops.length, 3);
  assert.deepEqual(
    stops.map((stop) => stop.short),
    ['Y', '1P·2P', '1D·2D'],
  );
  assert.deepEqual(
    stops.map((stop) => stop.seqs),
    [[1, 6], [2, 4], [3, 5]],
  );
  assert.deepEqual(
    stops.map((stop) => stop.kind),
    ['yard', 'pickup', 'delivery'],
  );
  assert.deepEqual(
    stops.map((stop) => stop.index),
    [0, 1, 2],
  );
  assert.equal(stops[1].label, 'Thornton');
});

void test('stopsFromLegs leaves out stops with no coordinates', () => {
  const unplaced = { label: 'Nowhere', place_key: 'nowhere', lat: Number.NaN, lon: Number.NaN };
  const stops = stopsFromLegs([leg(1, 'yard_to_pickup', 1, YARD, unplaced)]);
  assert.deepEqual(stops, []);
});

void test('legsWithStops pairs every leg with its two stops', () => {
  const stops = stopsFromLegs(DAY);
  const paired = legsWithStops(DAY, stops);
  assert.equal(paired.length, 5);
  assert.deepEqual(
    paired.map((entry) => [entry.from.short, entry.to.short]),
    [
      ['Y', '1P·2P'],
      ['1P·2P', '1D·2D'],
      ['1D·2D', '1P·2P'],
      ['1P·2P', '1D·2D'],
      ['1D·2D', 'Y'],
    ],
  );
  assert.deepEqual(
    paired.map((entry) => entry.leg.seq),
    [1, 2, 3, 4, 5],
  );
});

// -------------------------------------------------------------- projection

void test('fitBounds places the bounding corners inside the padding', () => {
  const points = [
    { lat: 41.5, lon: -87.9 },
    { lat: 42.1, lon: -87.2 },
    { lat: 41.8, lon: -87.5 },
  ];
  const fit = fitBounds(points, 640, 400, 32);
  assert.ok(fit);
  for (const point of points) {
    const { x, y } = fit.project(point);
    assert.ok(x >= 32 - 1e-6 && x <= 640 - 32 + 1e-6, `x ${x} inside`);
    assert.ok(y >= 32 - 1e-6 && y <= 400 - 32 + 1e-6, `y ${y} inside`);
  }
  // North is up and east is right.
  assert.ok(fit.project({ lat: 42.1, lon: -87.2 }).y < fit.project({ lat: 41.5, lon: -87.2 }).y);
  assert.ok(fit.project({ lat: 41.8, lon: -87.2 }).x > fit.project({ lat: 41.8, lon: -87.9 }).x);
});

void test('fitBounds centres a single point and refuses an empty day', () => {
  const fit = fitBounds([{ lat: 41.6, lon: -87.6 }], 600, 300, 20);
  assert.ok(fit);
  assert.deepEqual(fit.project({ lat: 41.6, lon: -87.6 }), { x: 300, y: 150 });
  assert.equal(fitBounds([], 600, 300, 20), null);
  assert.equal(fitBounds([{ lat: Number.NaN, lon: 0 }], 600, 300, 20), null);
});

// ----------------------------------------------------------------- hand-off

void test('googleMapsDirectionsUrl follows the visiting order', () => {
  const stops = stopsFromLegs(DAY);
  assert.equal(
    googleMapsDirectionsUrl(stops),
    'https://www.google.com/maps/dir/41.600000,-87.600000/41.570000,-87.620000/41.590000,-87.690000',
  );
  assert.equal(googleMapsDirectionsUrl([]), null);
  assert.equal(googleMapsDirectionsUrl(stops.slice(0, 1)), null);
});

void test('googleMapsDirectionsUrl caps at ten stops and keeps the last one', () => {
  const many = Array.from({ length: 14 }, (_, at) =>
    stopsFromLegs([leg(1, 'yard_to_pickup', at, place(`Stop ${at}`, 40 + at, -80 - at), YARD)])[0],
  );
  const url = googleMapsDirectionsUrl(many);
  assert.ok(url);
  const points = url.slice('https://www.google.com/maps/dir/'.length).split('/');
  assert.equal(points.length, 10);
  assert.equal(points[0], '40.000000,-80.000000');
  assert.equal(points[8], '48.000000,-88.000000');
  assert.equal(points[9], '53.000000,-93.000000');
});
