// The Customers dialog's half of the Rate & Fuel Agent: a customer's rate
// habits and the people it is asked, as they are typed and as they are saved.
//
// The form holds strings and the profile holds the vocabulary of rates.ts, so
// the mapping between the two lives here rather than in the dialog — it is the
// part worth testing, and the dialog is then only fields. What comes out is put
// through parseRateProfile and parseRateContacts, the same readers the server
// runs, so a customer can never be saved with settings the agent would later
// refuse to read.

import {
  DEFAULT_RATE_PROFILE,
  jobKeyOf,
  parseRateContacts,
  parseRateProfile,
  type BaseRateType,
  type CustomerRateProfile,
  type JobAlias,
  type RateContact,
} from './rates.ts';

// ---------------------------------------------------------------- vocabulary

/** How a rate is usually charged, in the words the dialog offers. */
export const BASE_RATE_TYPE_LABELS: Record<BaseRateType, string> = {
  PER_TON: 'Per ton',
  PER_LOAD: 'Per load',
  PER_HOUR: 'Per hour',
  PER_MILE: 'Per mile',
  PER_DAY: 'Per day',
  FLAT_RATE: 'Flat rate',
  CUSTOM: 'Custom',
};

/** 0 Sunday … 6 Saturday, the way CustomerRateProfile counts the week. */
export const WEEKDAY_LABELS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

export const BILLING_CYCLE_LABELS: [string, string][] = [
  ['weekly', 'Weekly'],
  ['biweekly', 'Every two weeks'],
  ['monthly', 'Monthly'],
];

export const BASE_BEHAVIOR_LABELS: [string, string][] = [
  ['fixed_per_project', 'Fixed per project'],
  ['varies', 'Varies'],
];

export const FUEL_BEHAVIOR_LABELS: [string, string][] = [
  ['weekly', 'Changes weekly'],
  ['fixed', 'Fixed'],
  ['none', 'None'],
];

export const REQUEST_BASE_LABELS: [string, string][] = [
  ['when_missing', 'Only when missing'],
  ['always', 'Always'],
];

export const REQUEST_FUEL_LABELS: [string, string][] = [
  ['weekly', 'Weekly'],
  ['when_missing', 'Only when missing'],
];

export const SEND_MODE_LABELS: [string, string][] = [
  ['DRAFT_ONLY', 'Draft only'],
  ['APPROVAL_REQUIRED', 'Needs approval'],
  ['AUTO_SEND', 'Send automatically'],
];

/** A chasing note is a day or two later, never a fortnight. */
export const MIN_FOLLOW_UP_DAYS = 1;
export const MAX_FOLLOW_UP_DAYS = 14;

// -------------------------------------------------------------------- drafts

/** One person to write to, as typed: the copied-in addresses are one string. */
export type RateContactDraft = {
  name: string;
  email: string;
  title: string;
  primary: boolean;
  /** Addresses copied in, separated by commas as they are typed. */
  cc: string;
  notes: string;
};

/**
 * A customer's rate settings as the dialog holds them. Every choice is a
 * string because that is what a select gives back; `aliases` are carried
 * unchanged, since they are the agent's own learning and are only ever shown
 * or removed here.
 */
export type RateDraft = {
  billingCycle: string;
  periodStartDay: string;
  requestDay: string;
  typicalRateType: string;
  baseBehavior: string;
  fuelBehavior: string;
  requestBase: string;
  requestFuel: string;
  autoCreate: boolean;
  sendMode: string;
  followUpDays: string;
  aliases: JobAlias[];
  contacts: RateContactDraft[];
  /** Whether this customer already had settings of its own before the edit. */
  had: boolean;
};

/** What a customer is saved with: both blocks, or neither. */
export type RateBlock = {
  rate_profile?: CustomerRateProfile;
  rate_contacts?: RateContact[];
};

export const blankRateContact = (primary = false): RateContactDraft => ({
  name: '',
  email: '',
  title: '',
  primary,
  cc: '',
  notes: '',
});

const contactDraft = (contact: RateContact): RateContactDraft => ({
  name: contact.name,
  email: contact.email,
  title: contact.title,
  primary: contact.primary,
  cc: contact.cc.join(', '),
  notes: contact.notes,
});

/** Addresses typed into one box, split the way the rest of the app splits lists. */
const ccList = (value: string) => [
  ...new Set(
    value
      .split(/[\n,;]/)
      .map((address) => address.trim())
      .filter(Boolean),
  ),
];

/** A row nobody typed anything into: added, thought better of, and ignored. */
export const isBlankRateContact = (contact: RateContactDraft) =>
  !contact.name.trim() && !contact.email.trim() && !contact.title.trim() &&
  !contact.cc.trim() && !contact.notes.trim();

/**
 * The settings of a customer, or the defaults for one the agent has never been
 * set up for. `had` remembers which of the two it was, so a customer nobody
 * has touched is not quietly given a block of settings by being opened.
 */
export function rateDraftFrom(
  customer?: { rate_profile?: CustomerRateProfile; rate_contacts?: RateContact[] },
): RateDraft {
  const profile = customer?.rate_profile ?? DEFAULT_RATE_PROFILE;
  return {
    billingCycle: profile.billing_cycle,
    periodStartDay: String(profile.period_start_day),
    requestDay: String(profile.request_day),
    typicalRateType: profile.typical_rate_type,
    baseBehavior: profile.base_behavior,
    fuelBehavior: profile.fuel_behavior,
    requestBase: profile.request_base,
    requestFuel: profile.request_fuel,
    autoCreate: profile.auto_create,
    sendMode: profile.send_mode,
    followUpDays: String(profile.follow_up_days),
    aliases: [...profile.aliases],
    contacts: (customer?.rate_contacts ?? []).map(contactDraft),
    had: Boolean(customer?.rate_profile) || Boolean(customer?.rate_contacts?.length),
  };
}

/** Whether the settings are still the ones every customer starts with. */
const isDefaultProfile = (profile: CustomerRateProfile) =>
  profile.billing_cycle === DEFAULT_RATE_PROFILE.billing_cycle &&
  profile.period_start_day === DEFAULT_RATE_PROFILE.period_start_day &&
  profile.request_day === DEFAULT_RATE_PROFILE.request_day &&
  profile.typical_rate_type === DEFAULT_RATE_PROFILE.typical_rate_type &&
  profile.base_behavior === DEFAULT_RATE_PROFILE.base_behavior &&
  profile.fuel_behavior === DEFAULT_RATE_PROFILE.fuel_behavior &&
  profile.request_base === DEFAULT_RATE_PROFILE.request_base &&
  profile.request_fuel === DEFAULT_RATE_PROFILE.request_fuel &&
  profile.auto_create === DEFAULT_RATE_PROFILE.auto_create &&
  profile.send_mode === DEFAULT_RATE_PROFILE.send_mode &&
  profile.follow_up_days === DEFAULT_RATE_PROFILE.follow_up_days &&
  profile.aliases.length === 0;

/**
 * The draft as it is saved on the customer, or the first thing wrong with it
 * in the words the server would use.
 *
 * A customer that had no settings and was left at the defaults is saved with
 * none at all: absent means "asked the default way", and writing the defaults
 * out would turn a customer nobody has considered into one somebody has.
 */
export function rateBlockFromDraft(draft: RateDraft): { value: RateBlock } | { error: string } {
  const typed = draft.contacts.filter((contact) => !isBlankRateContact(contact));
  const contacts = parseRateContacts(
    typed.map((contact) => ({
      name: contact.name.trim(),
      email: contact.email.trim(),
      title: contact.title.trim(),
      primary: contact.primary,
      cc: ccList(contact.cc),
      notes: contact.notes,
    })),
  );
  if ('error' in contacts) return { error: contacts.error };
  const days = Number(draft.followUpDays.trim());
  if (
    !Number.isInteger(days) ||
    days < MIN_FOLLOW_UP_DAYS ||
    days > MAX_FOLLOW_UP_DAYS
  ) {
    return { error: `Follow up after ${MIN_FOLLOW_UP_DAYS} to ${MAX_FOLLOW_UP_DAYS} days.` };
  }
  const parsed = parseRateProfile({
    billing_cycle: draft.billingCycle,
    period_start_day: Number(draft.periodStartDay),
    request_day: Number(draft.requestDay),
    typical_rate_type: draft.typicalRateType,
    base_behavior: draft.baseBehavior,
    fuel_behavior: draft.fuelBehavior,
    request_base: draft.requestBase,
    request_fuel: draft.requestFuel,
    auto_create: draft.autoCreate,
    send_mode: draft.sendMode,
    follow_up_days: days,
    aliases: draft.aliases,
  });
  if ('error' in parsed) return { error: parsed.error };
  const profile = parsed.value;
  if (!profile) return { error: 'The rate settings are not valid.' };
  const saved = contacts.value ?? [];
  if (!draft.had && !saved.length && isDefaultProfile(profile)) return { value: {} };
  return { value: { rate_profile: profile, rate_contacts: saved } };
}

/** Who a customer's requests go to: the main contact, else the first named. */
export const mainRateContact = (contacts: RateContact[] | undefined): RateContact | null =>
  contacts?.find((contact) => contact.primary) ??
  contacts?.find((contact) => contact.email.trim()) ??
  null;

/**
 * "Markham → Markham Road Project": a name this customer has been seen to use
 * for one of its jobs, and the job it means. The job is shown by the address
 * the customer has on file for it, since that is what the key is made from.
 */
export const aliasLabel = (alias: JobAlias, addresses: string[]): string => {
  const job = addresses.find((address) => jobKeyOf(address) === alias.job_key);
  return `${alias.alias} → ${job ?? alias.job_key}`;
};
