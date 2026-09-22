import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { MileageLeg, MileagePlace } from '../lib/load-desk/mileage.ts';
import {
  decodePolyline,
  fitBounds,
  fitTiles,
  googleMapsDirectionsUrl,
  legsWithStops,
  sequenceLabels,
  stopsFromLegs,
  visitLabel,
  visitTag,
  type RouteStop,
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

void test('stopsFromLegs carries the name and the address where a place has them', () => {
  const named = { ...PICKUP, name: 'Thornton Quarry', address: '2001 Ridge Rd, Thornton IL' };
  const stops = stopsFromLegs([leg(1, 'yard_to_pickup', 1, YARD, named)]);
  assert.equal(stops[1].name, 'Thornton Quarry');
  assert.equal(stops[1].address, '2001 Ridge Rd, Thornton IL');
  // A place without them is left clean rather than given empty strings.
  assert.equal('name' in stops[0], false);
  assert.equal('address' in stops[0], false);
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

// --------------------------------------------------------- marker sequence

void test('sequenceLabels reads the demo day as Start, 1·3, 2·4 and Finish', () => {
  const stops = stopsFromLegs(DAY);
  assert.deepEqual(sequenceLabels(stops), [
    // The yard is where the day began and where it ended, one disc, both words.
    { index: 0, primary: 'Start', secondary: 'Finish' },
    { index: 1, primary: '1', secondary: '3' },
    { index: 2, primary: '2', secondary: '4' },
  ]);
});

void test('sequenceLabels numbers a one-way day and names both ends', () => {
  const oneWay = stopsFromLegs([
    leg(1, 'yard_to_pickup', 1, YARD, PICKUP),
    leg(2, 'pickup_to_delivery', 1, PICKUP, DELIVERY),
  ]);
  assert.deepEqual(sequenceLabels(oneWay), [
    { index: 0, primary: 'Start', secondary: null },
    { index: 1, primary: '1', secondary: null },
    { index: 2, primary: 'Finish', secondary: null },
  ]);
});

void test('sequenceLabels says Start/Finish where the day is one visit', () => {
  const alone: RouteStop = {
    index: 0,
    kind: 'yard',
    label: 'Yard',
    short: 'Y',
    lat: 41.6,
    lon: -87.6,
    ticket_id: null,
    place_key: 'yard',
    seqs: [1],
  };
  assert.deepEqual(sequenceLabels([alone]), [
    { index: 0, primary: 'Start/Finish', secondary: null },
  ]);
  assert.deepEqual(sequenceLabels([]), []);
});

void test('visitLabel names only the two visits a leg connects', () => {
  const stops = stopsFromLegs(DAY);
  // A leg leaves visit n and arrives at visit n + 1; a place visited nine
  // times never recites all nine on one row.
  assert.deepEqual(
    DAY.map((entry) => `${visitLabel(stops, entry.seq)} → ${visitLabel(stops, entry.seq + 1)}`),
    ['Start → 1', '1 → 2', '2 → 3', '3 → 4', '4 → Finish'],
  );
  assert.equal(visitLabel(stops, 99), '');
  assert.equal(visitLabel([], 1), '');
});

// A shuttle: out to the plant once, then round and round between the plant
// and one site, home at the end. The two middle places pile up visits.
const shuttle = (loads: number): MileageLeg[] => {
  const legs: MileageLeg[] = [leg(1, 'yard_to_pickup', 1, YARD, PICKUP)];
  for (let load = 1; load <= loads; load += 1) {
    legs.push(leg(legs.length + 1, 'pickup_to_delivery', load, PICKUP, DELIVERY));
    if (load < loads) legs.push(leg(legs.length + 1, 'delivery_to_pickup', load + 1, DELIVERY, PICKUP));
  }
  legs.push(leg(legs.length + 1, 'delivery_to_yard', loads, DELIVERY, YARD));
  return legs;
};

void test('visitTag names a second visit and counts anything longer', () => {
  const stops = stopsFromLegs(DAY);
  // Twice at one plant: the tag is the other visit, in full.
  assert.equal(visitTag(stops, stops[1]), '3');
  // Twice at the yard: the other visit is the end of the day.
  assert.equal(visitTag(stops, stops[0]), 'Finish');
  // Stood at once: nothing to add.
  assert.equal(visitTag(stops, stopsFromLegs([leg(1, 'yard_to_pickup', 1, YARD, PICKUP)])[1]), null);

  // Twelve loads through one plant: a count, not eleven numbers.
  const busy = stopsFromLegs(shuttle(12));
  assert.equal(busy[1].seqs.length, 12);
  assert.equal(visitTag(busy, busy[1]), '×12');
  assert.equal(visitTag(busy, busy[2]), '×12');
  // The disc itself still reads the first visit.
  assert.deepEqual(
    sequenceLabels(busy).map((mark) => mark.primary),
    ['Start', '1', '2'],
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

void test('fitTiles fills the canvas with the day, north up', () => {
  const view = fitTiles([YARD, PICKUP, DELIVERY], 640, 400, 32);
  assert.ok(view);
  assert.ok(Number.isInteger(view.zoom), 'pictures come at whole-number zooms');
  assert.ok(view.zoom > 0 && view.zoom <= 17);
  // Inside the padding, give or take the pixel the picture sizes are snapped
  // to — which is what keeps every picture on a pixel boundary.
  for (const point of [YARD, PICKUP, DELIVERY]) {
    const { x, y } = view.project(point);
    assert.ok(x >= 31 && x <= 640 - 31, `x ${x} inside`);
    assert.ok(y >= 31 && y <= 400 - 31, `y ${y} inside`);
  }
  // Fitted, not merely contained: the day fills the canvas on one axis.
  const wide = Math.max(...[YARD, PICKUP, DELIVERY].map((p) => view.project(p).x)) -
    Math.min(...[YARD, PICKUP, DELIVERY].map((p) => view.project(p).x));
  const tall = Math.max(...[YARD, PICKUP, DELIVERY].map((p) => view.project(p).y)) -
    Math.min(...[YARD, PICKUP, DELIVERY].map((p) => view.project(p).y));
  assert.ok(
    Math.abs(wide - (640 - 64)) < 2 || Math.abs(tall - (400 - 64)) < 2,
    `day ${wide.toFixed(1)}x${tall.toFixed(1)} in 576x336`,
  );
  assert.ok(view.project({ lat: 42.1, lon: -87.2 }).y < view.project({ lat: 41.5, lon: -87.2 }).y);
  assert.ok(view.project({ lat: 41.8, lon: -87.2 }).x > view.project({ lat: 41.8, lon: -87.9 }).x);
});

void test('fitTiles covers the canvas with tiles of that zoom', () => {
  const view = fitTiles([YARD, PICKUP, DELIVERY], 640, 400, 32);
  assert.ok(view);
  const across = 2 ** view.zoom;
  assert.ok(view.tiles.length >= 6, `${view.tiles.length} tiles for 640x400`);
  assert.equal(new Set(view.tiles.map((tile) => tile.key)).size, view.tiles.length);
  // Every tile is one the source can serve, and together they leave no gap.
  const size = view.tiles[0].size;
  // Near their own size, never stretched to twice it: the nearest zoom is
  // taken, so a picture is shrunk at worst by a little and blown up at worst
  // by a little, which is what keeps the lettering readable.
  assert.ok(size > 256 / Math.SQRT2 && size < 256 * Math.SQRT2 + 2, `tiles drawn at ${size}px`);
  // Whole pixels, and on whole-pixel boundaries, so nothing is resampled.
  assert.ok(Number.isInteger(size), `tiles drawn at ${size}px`);
  for (const tile of view.tiles) {
    assert.ok(Number.isInteger(tile.left) && Number.isInteger(tile.top), 'a tile sits off-pixel');
  }
  const left = Math.min(...view.tiles.map((tile) => tile.left));
  const top = Math.min(...view.tiles.map((tile) => tile.top));
  const right = Math.max(...view.tiles.map((tile) => tile.left)) + size;
  const bottom = Math.max(...view.tiles.map((tile) => tile.top)) + size;
  assert.ok(left <= 0 && top <= 0 && right >= 640 && bottom >= 400);
  for (const tile of view.tiles) {
    assert.equal(tile.z, view.zoom);
    assert.ok(tile.x >= 0 && tile.x < across, `column ${tile.x} of ${across}`);
    assert.ok(tile.y >= 0 && tile.y < across, `row ${tile.y} of ${across}`);
  }
});

void test('fitTiles fetches a zoom deeper for a screen with two dots to the pixel', () => {
  const plain = fitTiles([YARD, PICKUP, DELIVERY], 640, 400, 32);
  const sharp = fitTiles([YARD, PICKUP, DELIVERY], 640, 400, 32, 17, 2);
  assert.ok(plain && sharp);
  assert.equal(sharp.zoom, plain.zoom + 1, 'one zoom deeper');
  // Drawn at half the size, so each page pixel carries two dots of map.
  assert.ok(Math.abs(sharp.tiles[0].size - plain.tiles[0].size / 2) <= 2);
  // The day itself is framed as before, give or take the pixel the picture
  // sizes are snapped to: finer pictures, the same map.
  for (const point of [YARD, PICKUP, DELIVERY]) {
    const here = plain.project(point);
    const there = sharp.project(point);
    assert.ok(Math.abs(here.x - there.x) < 4 && Math.abs(here.y - there.y) < 4, 'the framing moved');
  }
  // A display that says something unhelpful is treated as an ordinary one,
  // and no screen is worth fetching more than twice the fineness for.
  const day = [YARD, PICKUP, DELIVERY];
  assert.equal(fitTiles(day, 640, 400, 32, 17, 0)?.zoom, plain.zoom);
  assert.equal(fitTiles(day, 640, 400, 32, 17, 9)?.zoom, sharp.zoom);
});

void test('fitTiles centres a single point and refuses an empty day', () => {
  const view = fitTiles([{ lat: 41.6, lon: -87.6 }], 600, 300, 20);
  assert.ok(view);
  assert.equal(view.zoom, 17);
  assert.equal(fitTiles([{ lat: 41.6, lon: -87.6 }], 600, 300, 20, 17, 2)?.zoom, 18);
  const { x, y } = view.project({ lat: 41.6, lon: -87.6 });
  assert.ok(Math.abs(x - 300) <= 1 && Math.abs(y - 150) <= 1, `${x},${y} is not the middle`);
  assert.equal(fitTiles([], 600, 300, 20), null);
  assert.equal(fitTiles([{ lat: Number.NaN, lon: 0 }], 600, 300, 20), null);
  assert.equal(fitTiles([YARD], 0, 300, 20), null);
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
