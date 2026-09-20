import { test } from 'node:test';
import assert from 'node:assert/strict';
import type {
  Evidence,
  ObservedField,
  ObservedTicket,
} from '../lib/load-desk/recovery/contract.ts';
import {
  detectVendor,
  GENERIC_REDUNDANT_SOURCES,
  genericEvidence,
  HEIDELBERG,
  ONTARIO_TRAP_ROCK,
  VENDORS,
  vendorEvidence,
} from '../lib/load-desk/recovery/vendors.ts';

/** A field the reader saw whole, unless the test says otherwise. */
const seen = (
  visible: string,
  extra: Partial<ObservedField> = {},
): ObservedField => ({
  visible,
  proposed: null,
  clipped_edge: null,
  partial: false,
  ...extra,
});

const observe = (parts: Partial<ObservedTicket> = {}): ObservedTicket => ({
  fields: {},
  timestamps: [],
  branding: null,
  paper_edges: null,
  ...parts,
});

const heidelbergTicket = (
  parts: Partial<ObservedTicket> = {},
): ObservedTicket => observe({ branding: 'Heidelberg Materials', ...parts });

const forField = (evidence: Evidence[], field: string) =>
  evidence.filter((item) => item.field === field);

void test('branding names the vendor', () => {
  const found = detectVendor(heidelbergTicket());
  assert.equal(found.vendor?.id, 'heidelberg');
  assert.equal(found.score, 0.95);
});

void test('the plant line names the vendor when the branding did not read', () => {
  const found = detectVendor(
    observe({
      fields: { plant_name: seen('Heidelberg Materials', { partial: true }) },
    }),
  );
  assert.equal(found.vendor?.id, 'heidelberg');
});

void test('layout tells alone do not make a vendor', () => {
  const found = detectVendor(
    observe({
      fields: { ticket_number: seen('1725172271'), plant_code: seen('U857') },
    }),
  );
  assert.equal(found.vendor, null);
  assert.equal(found.score, 0.3);
});

void test('tells add to a name but never past one', () => {
  const found = detectVendor(
    heidelbergTicket({
      fields: { ticket_number: seen('1725172271'), plant_code: seen('U857') },
    }),
  );
  assert.equal(found.vendor?.id, 'heidelberg');
  assert.equal(found.score, 1);
});

void test('Ontario Trap Rock is a profile like any other', () => {
  const found = detectVendor(observe({ branding: 'ONTARIO TRAP ROCK' }));
  assert.equal(found.vendor?.id, 'ontario-trap-rock');
  assert.deepEqual(
    found.vendor?.redundantEvidence(observe({ timestamps: ['26SEP14 12:02'] })),
    [],
  );
});

void test('an unrecognised issuer gets no vendor', () => {
  const found = detectVendor(observe({ branding: 'VULCAN MATERIALS' }));
  assert.equal(found.vendor, null);
  assert.equal(found.score, 0);
});

void test('an empty observation yields no vendor and no evidence', () => {
  const found = vendorEvidence(observe());
  assert.equal(found.vendor, null);
  assert.deepEqual(found.evidence, []);
});

void test('a Heidelberg machine timestamp is a strong date, year first', () => {
  const { vendor, evidence } = vendorEvidence(
    heidelbergTicket({ timestamps: ['26SEP14 12:02'] }),
  );
  assert.equal(vendor, 'heidelberg');
  const dates = forField(evidence, 'ticket_date').filter(
    (item) => item.source === 'vendor_rule',
  );
  assert.equal(dates.length, 1);
  assert.equal(dates[0].candidate, '2026-09-14');
  assert.equal(dates[0].strength, 'strong');
  assert.equal(dates[0].context?.vendor, 'heidelberg');
  assert.match(dates[0].note, /26SEP14 12:02/);
  assert.match(dates[0].note, /2026-09-14/);
});

void test('the month abbreviation may come back in any case, and the time may be missing', () => {
  for (const stamp of ['26SEP14', '26sep14 12:02', '26Sep14 12:02:11']) {
    const evidence = HEIDELBERG.redundantEvidence(
      heidelbergTicket({ timestamps: [stamp] }),
    );
    assert.deepEqual(
      evidence.map((item) => item.candidate),
      ['2026-09-14'],
      stamp,
    );
  }
});

void test('a slashed stamp with the minute on it is the scale, and strong', () => {
  const dates = forField(
    vendorEvidence(heidelbergTicket({ timestamps: ['09/14/26 12:02:11'] }))
      .evidence,
    'ticket_date',
  );
  assert.equal(dates.length, 1);
  assert.equal(dates[0].candidate, '2026-09-14');
  assert.equal(dates[0].strength, 'strong');
  assert.equal(dates[0].source, 'vendor_rule');
});

void test('a bare date among the timestamps is not the scale speaking', () => {
  const dates = forField(
    vendorEvidence(heidelbergTicket({ timestamps: ['9/14/26'] })).evidence,
    'ticket_date',
  );
  assert.equal(dates.length, 1);
  assert.equal(dates[0].candidate, '2026-09-14');
  assert.equal(dates[0].strength, 'moderate');
  assert.ok(!/machine timestamp/i.test(dates[0].note), dates[0].note);
});

void test('two stamps of one day are one piece of evidence, at its strongest', () => {
  const dates = forField(
    vendorEvidence(
      heidelbergTicket({ timestamps: ['26SEP14 12:02', '09/14/26 12:02'] }),
    ).evidence,
    'ticket_date',
  );
  assert.equal(dates.length, 1);
  assert.equal(dates[0].candidate, '2026-09-14');
  assert.equal(dates[0].strength, 'strong');
});

void test('an encoded stamp outranks a bare date of the same day', () => {
  const dates = forField(
    vendorEvidence(
      heidelbergTicket({ timestamps: ['9/14/26', '26SEP14 12:02'] }),
    ).evidence,
    'ticket_date',
  );
  assert.equal(dates.length, 1);
  assert.equal(dates[0].strength, 'strong');
  assert.match(dates[0].note, /encodes/);
});

void test('two stamps of two days are both emitted, for the resolver to fall out over', () => {
  const evidence = HEIDELBERG.redundantEvidence(
    heidelbergTicket({ timestamps: ['26SEP14 23:52', '26SEP15 00:07'] }),
  );
  assert.deepEqual(
    evidence.map((item) => item.candidate),
    ['2026-09-14', '2026-09-15'],
  );
  assert.ok(evidence.every((item) => item.strength === 'strong'));

  const dates = forField(
    vendorEvidence(
      heidelbergTicket({ timestamps: ['26SEP14 23:52', '26SEP15 00:07'] }),
    ).evidence,
    'ticket_date',
  );
  assert.deepEqual(
    dates.map((item) => item.candidate),
    ['2026-09-14', '2026-09-15'],
  );
});

void test('one stamp never reaches the resolver twice', () => {
  const { evidence } = vendorEvidence(
    heidelbergTicket({ timestamps: ['09/14/26 12:02'] }),
  );
  assert.deepEqual(
    evidence.map((item) => [item.field, item.candidate, item.source]),
    [['ticket_date', '2026-09-14', 'vendor_rule']],
  );
});

void test('one weight derived two ways is one piece of evidence, at its strongest', () => {
  const { evidence } = vendorEvidence(
    heidelbergTicket({
      fields: {
        gross_lb: seen('73220'),
        tare_lb: seen('27400'),
        net_tons: seen('22.91'),
      },
    }),
  );
  const net = forField(evidence, 'net_lb');
  assert.equal(net.length, 1);
  assert.equal(net[0].candidate, '45820');
  assert.equal(net[0].strength, 'strong');
});

void test('a stamp the calendar has not got is no date at all', () => {
  for (const stamp of [
    '26FEB30 12:02',
    '26XXX14 12:02',
    '13/44/26',
    'Time Out: 6:07',
    '',
  ]) {
    assert.deepEqual(
      HEIDELBERG.redundantEvidence(heidelbergTicket({ timestamps: [stamp] })),
      [],
      stamp,
    );
    assert.deepEqual(
      forField(
        genericEvidence(observe({ timestamps: [stamp] })),
        'ticket_date',
      ),
      [],
    );
  }
});

void test('the year-first rule is Heidelberg and only Heidelberg', () => {
  const { vendor, evidence } = vendorEvidence(
    observe({ branding: 'SOME OTHER QUARRY', timestamps: ['26SEP14 12:02'] }),
  );
  assert.equal(vendor, null);
  assert.deepEqual(forField(evidence, 'ticket_date'), []);
});

void test('an unlabelled timestamp is a moderate date, because it may be the printing', () => {
  const evidence = genericEvidence(
    observe({ timestamps: ['09/14/2026 12:02', '9/14/26'] }),
  );
  const dates = forField(evidence, 'ticket_date');
  assert.equal(dates.length, 1);
  assert.equal(dates[0].candidate, '2026-09-14');
  assert.equal(dates[0].strength, 'moderate');
  assert.equal(dates[0].source, 'same_ticket');
});

void test('gross and tare give the net, strongly, commas and all', () => {
  const evidence = genericEvidence(
    observe({ fields: { gross_lb: seen('73,220'), tare_lb: seen('27,400') } }),
  );
  const net = forField(evidence, 'net_lb');
  assert.equal(net.length, 1);
  assert.equal(net[0].candidate, '45820');
  assert.equal(net[0].strength, 'strong');
  assert.equal(net[0].source, 'same_ticket');
  assert.match(net[0].note, /73,220/);
  assert.match(net[0].note, /27,400/);
});

void test('the other two weights are derived the same way', () => {
  const fromTareAndNet = genericEvidence(
    observe({ fields: { tare_lb: seen('27400'), net_lb: seen('45820') } }),
  );
  const gross = forField(fromTareAndNet, 'gross_lb');
  assert.equal(gross.length, 1);
  assert.equal(gross[0].candidate, '73220');
  assert.equal(gross[0].strength, 'strong');

  const fromGrossAndNet = genericEvidence(
    observe({ fields: { gross_lb: seen('73220'), net_lb: seen('45820') } }),
  );
  const tare = forField(fromGrossAndNet, 'tare_lb');
  assert.equal(tare.length, 1);
  assert.equal(tare[0].candidate, '27400');
  assert.equal(tare[0].strength, 'strong');
});

void test('pounds give tons exactly; tons give pounds only roughly', () => {
  const fromPounds = forField(
    genericEvidence(observe({ fields: { net_lb: seen('45820') } })),
    'net_tons',
  );
  assert.equal(fromPounds.length, 1);
  assert.equal(fromPounds[0].candidate, '22.91');
  assert.equal(fromPounds[0].strength, 'strong');

  const fromTons = forField(
    genericEvidence(observe({ fields: { net_tons: seen('22.91') } })),
    'net_lb',
  );
  assert.equal(fromTons.length, 1);
  assert.equal(fromTons[0].candidate, '45820');
  assert.equal(fromTons[0].strength, 'moderate');
});

void test('pounds and tons that agree support each other, moderately', () => {
  const evidence = genericEvidence(
    observe({ fields: { net_lb: seen('45,820'), net_tons: seen('22.91') } }),
  );
  const support = evidence.filter((item) => /agree/.test(item.note));
  assert.deepEqual(
    support.map((item) => [item.field, item.candidate, item.strength]),
    [
      ['net_lb', '45820', 'moderate'],
      ['net_tons', '22.91', 'moderate'],
    ],
  );
});

void test('pounds and tons that disagree support nothing', () => {
  const evidence = genericEvidence(
    observe({ fields: { net_lb: seen('45820'), net_tons: seen('24.50') } }),
  );
  assert.deepEqual(
    evidence.filter((item) => /agree/.test(item.note)),
    [],
  );
  assert.deepEqual(
    forField(evidence, 'net_tons').map((item) => item.candidate),
    ['22.91'],
  );
});

void test('a partial source weight derives nothing', () => {
  for (const damage of [
    { partial: true },
    { clipped_edge: 'right' as const },
  ]) {
    const evidence = genericEvidence(
      observe({
        fields: { gross_lb: seen('7322', damage), tare_lb: seen('27400') },
      }),
    );
    assert.deepEqual(forField(evidence, 'net_lb'), []);
  }
});

void test('nonsense in a weight box derives nothing', () => {
  for (const printed of ['', '732ZO', '--']) {
    const evidence = genericEvidence(
      observe({ fields: { gross_lb: seen(printed), tare_lb: seen('27400') } }),
    );
    assert.deepEqual(forField(evidence, 'net_lb'), []);
  }
});

void test('a tare heavier than the gross is a misread, not a negative net', () => {
  const evidence = genericEvidence(
    observe({ fields: { gross_lb: seen('27400'), tare_lb: seen('73220') } }),
  );
  assert.deepEqual(forField(evidence, 'net_lb'), []);
});

void test('a half-read plant name is completed only under the branding', () => {
  const fields = {
    plant_code: seen('U857'),
    plant_name: seen('Heidelberg Mate', { partial: true }),
  };
  const withBranding = HEIDELBERG.redundantEvidence(
    heidelbergTicket({ fields }),
  );
  assert.equal(withBranding.length, 1);
  assert.equal(withBranding[0].field, 'plant_name');
  assert.equal(withBranding[0].candidate, 'Heidelberg Materials');
  assert.equal(withBranding[0].strength, 'moderate');
  assert.equal(withBranding[0].source, 'vendor_rule');

  assert.deepEqual(HEIDELBERG.redundantEvidence(observe({ fields })), []);
});

void test('a plant name read whole needs no completing', () => {
  const evidence = HEIDELBERG.redundantEvidence(
    heidelbergTicket({
      fields: {
        plant_code: seen('U857'),
        plant_name: seen('Heidelberg Materials'),
      },
    }),
  );
  assert.deepEqual(evidence, []);
});

void test('the customer name is never guessed from the customer number', () => {
  const { evidence } = vendorEvidence(
    heidelbergTicket({
      fields: {
        customer_id: seen('60311596'),
        customer_name: seen('WITECH COMP', { partial: true }),
      },
    }),
  );
  assert.deepEqual(forField(evidence, 'customer_name'), []);
});

void test('every note is one readable line', () => {
  const { evidence } = vendorEvidence(
    heidelbergTicket({
      timestamps: ['26SEP14 12:02'],
      fields: {
        plant_code: seen('U857'),
        plant_name: seen('Heidelberg Mate', { partial: true }),
        gross_lb: seen('73,220'),
        tare_lb: seen('27,400'),
        net_lb: seen('45,820'),
        net_tons: seen('22.91'),
      },
    }),
  );
  assert.ok(evidence.length > 0);
  for (const item of evidence) {
    assert.ok(item.note.trim().length > 20, item.note);
    assert.ok(!item.note.includes('\n'), item.note);
    assert.match(item.note, /\.$/);
    assert.ok(!item.note.includes('undefined'), item.note);
  }
});

void test('generic evidence is never tagged with a vendor', () => {
  const { evidence } = vendorEvidence(
    heidelbergTicket({
      fields: { gross_lb: seen('73220'), tare_lb: seen('27400') },
    }),
  );
  for (const item of evidence) {
    if (item.source === 'same_ticket') assert.equal(item.context, undefined);
    if (item.source === 'vendor_rule')
      assert.equal(item.context?.vendor, 'heidelberg');
  }
});

void test('the same ticket gives the same evidence, in the same order', () => {
  const ticket = () =>
    heidelbergTicket({
      timestamps: ['26SEP14 12:02', '26SEP15 00:07'],
      fields: {
        plant_code: seen('U857'),
        plant_name: seen('Heidelberg Mate', { partial: true }),
        gross_lb: seen('73,220'),
        tare_lb: seen('27,400'),
        net_tons: seen('22.91'),
      },
    });
  assert.deepEqual(vendorEvidence(ticket()), vendorEvidence(ticket()));
  assert.deepEqual(
    vendorEvidence(ticket()).evidence.map((item) => [
      item.field,
      item.source,
      item.strength,
    ]),
    [
      ['ticket_date', 'vendor_rule', 'strong'],
      ['ticket_date', 'vendor_rule', 'strong'],
      ['plant_name', 'vendor_rule', 'moderate'],
      ['net_lb', 'same_ticket', 'strong'],
    ],
  );
});

void test('the profiles are a list, and the review screen has wording for each', () => {
  assert.deepEqual(
    VENDORS.map((vendor) => vendor.id),
    ['heidelberg', 'ontario-trap-rock'],
  );
  for (const vendor of [
    ...VENDORS,
    { redundantSources: GENERIC_REDUNDANT_SOURCES },
  ]) {
    for (const wording of Object.values(vendor.redundantSources)) {
      assert.ok(wording.length >= 2);
    }
  }
  assert.deepEqual(HEIDELBERG.redundantSources.ticket_date, [
    'explicit date field',
    'machine timestamp',
  ]);
  assert.equal(ONTARIO_TRAP_ROCK.redundantSources.net_tons?.length, 2);
});
