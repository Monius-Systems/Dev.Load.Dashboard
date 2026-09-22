import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { CustomerProfile } from '../lib/load-desk/profiles.ts';
import { DEFAULT_RATE_PROFILE, jobKeyOf, type RateContact } from '../lib/load-desk/rates.ts';
import {
  aliasLabel,
  blankRateContact,
  isBlankRateContact,
  mainRateContact,
  rateBlockFromDraft,
  rateDraftFrom,
  type RateDraft,
} from '../lib/load-desk/rates-profile-form.ts';

const MARKHAM = '16222 Western Ave, Markham, IL';

const customer = (patch: Partial<CustomerProfile> = {}): CustomerProfile => ({
  id: 5,
  name: 'Five Construction',
  ticket_customer_ids: [],
  ticket_names: [],
  addresses: [MARKHAM],
  flat_rate: null,
  fuel_charge: null,
  notes: '',
  created_at: '2026-01-02T00:00:00.000Z',
  ...patch,
});

const contact = (patch: Partial<RateContact> = {}): RateContact => ({
  name: 'Dana Meyer',
  email: 'dana@five.example',
  title: 'Project manager',
  primary: true,
  cc: ['billing@five.example'],
  notes: 'Answers on Mondays',
  ...patch,
});

/** The draft as the dialog would hand it back after the fields were filled. */
const saved = (draft: RateDraft) => {
  const result = rateBlockFromDraft(draft);
  assert.ok('value' in result, 'error' in result ? result.error : '');
  return result.value;
};

void test('a customer with no rate settings opens on the defaults', () => {
  const draft = rateDraftFrom(customer());
  assert.equal(draft.billingCycle, DEFAULT_RATE_PROFILE.billing_cycle);
  assert.equal(draft.periodStartDay, String(DEFAULT_RATE_PROFILE.period_start_day));
  assert.equal(draft.typicalRateType, DEFAULT_RATE_PROFILE.typical_rate_type);
  assert.equal(draft.followUpDays, String(DEFAULT_RATE_PROFILE.follow_up_days));
  assert.deepEqual(draft.contacts, []);
  assert.equal(draft.had, false);
});

void test('opening a customer and saving it again adds no settings', () => {
  assert.deepEqual(saved(rateDraftFrom(customer())), {});
});

void test('one field changed saves the whole block', () => {
  const draft = { ...rateDraftFrom(customer()), billingCycle: 'monthly' };
  const block = saved(draft);
  assert.equal(block.rate_profile?.billing_cycle, 'monthly');
  assert.equal(block.rate_profile?.typical_rate_type, 'PER_TON');
  assert.deepEqual(block.rate_contacts, []);
});

void test('a customer that already has settings keeps them when nothing is changed', () => {
  const settings = { ...DEFAULT_RATE_PROFILE, billing_cycle: 'biweekly' as const };
  const draft = rateDraftFrom(customer({ rate_profile: settings }));
  assert.equal(draft.had, true);
  assert.deepEqual(saved(draft).rate_profile, settings);
});

void test('contacts survive the trip through the dialog', () => {
  const draft = rateDraftFrom(customer({ rate_contacts: [contact()] }));
  assert.equal(draft.contacts[0].cc, 'billing@five.example');
  assert.deepEqual(saved(draft).rate_contacts, [contact()]);
});

void test('copied-in addresses are split, trimmed and de-duplicated', () => {
  const draft = rateDraftFrom(customer());
  draft.contacts = [
    { ...blankRateContact(true), name: 'Dana', email: 'dana@five.example', cc: ' a@five.example , b@five.example, a@five.example ' },
  ];
  assert.deepEqual(saved(draft).rate_contacts?.[0].cc, ['a@five.example', 'b@five.example']);
});

void test('a contact row nobody typed into is ignored rather than refused', () => {
  const draft = rateDraftFrom(customer());
  draft.contacts = [blankRateContact(true)];
  assert.ok(isBlankRateContact(draft.contacts[0]));
  assert.deepEqual(saved(draft), {});
});

void test('the server’s own readers decide what is valid', () => {
  const draft = rateDraftFrom(customer());
  draft.contacts = [{ ...blankRateContact(true), name: 'Dana', email: 'dana' }];
  const result = rateBlockFromDraft(draft);
  assert.deepEqual(result, { error: 'The contact details are not valid.' });
});

void test('two main contacts are refused, as the server refuses them', () => {
  const draft = rateDraftFrom(
    customer({ rate_contacts: [contact(), contact({ email: 'sam@five.example' })] }),
  );
  const result = rateBlockFromDraft(draft);
  assert.deepEqual(result, { error: 'Only one contact can be the main one.' });
});

void test('a follow-up is between a day and a fortnight', () => {
  const draft = rateDraftFrom(customer());
  for (const days of ['0', '15', '', 'soon', '2.5']) {
    assert.deepEqual(rateBlockFromDraft({ ...draft, followUpDays: days }), {
      error: 'Follow up after 1 to 14 days.',
    });
  }
  assert.equal(saved({ ...draft, followUpDays: '14' }).rate_profile?.follow_up_days, 14);
});

void test('the names the agent learned are carried through a save', () => {
  const aliases = [
    { alias: 'Markham', job_key: jobKeyOf(MARKHAM), source: 'confirmed_match' as const, confirmed_at: '2026-09-18T12:00:00.000Z' },
  ];
  const draft = rateDraftFrom(customer({ rate_profile: { ...DEFAULT_RATE_PROFILE, aliases } }));
  assert.deepEqual(saved(draft).rate_profile?.aliases, aliases);
  assert.equal(aliasLabel(aliases[0], [MARKHAM]), `Markham → ${MARKHAM}`);
  assert.equal(aliasLabel(aliases[0], []), `Markham → ${jobKeyOf(MARKHAM)}`);
});

void test('the contact written to is the main one, else the first with an address', () => {
  assert.equal(mainRateContact(undefined), null);
  assert.equal(mainRateContact([]), null);
  const second = contact({ name: 'Sam', email: 'sam@five.example', primary: true });
  assert.equal(mainRateContact([contact({ primary: false }), second]), second);
  const first = contact({ primary: false });
  assert.equal(mainRateContact([first, contact({ email: 'sam@five.example', primary: false })]), first);
});
