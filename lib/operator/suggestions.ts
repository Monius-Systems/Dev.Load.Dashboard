import type { EntityType, PageContext } from './types.ts';

// What the Operator offers to look at before anybody has typed anything.
//
// An empty box is a question in itself, and the answer a person wants is
// nearly always about the page they are standing on: on Rates it is which
// rates are missing, on Mileage it is why a day came out long. So the panel
// opens with a handful of operational questions chosen from the page, and the
// ones that name "this invoice" or "this route" are only offered when the
// page actually set an entity to mean.
//
// Pure, and deliberately separate from the panel, so a page added later can
// extend the map without touching the panel, and so the wording can be read
// in one place. The strings are English keys; the panel translates them.

/** Offered on any page, after whatever the page itself suggests. */
const GENERAL = [
  'What’s wrong today?',
  'Get everything possible ready for invoicing',
  'What needs attention today?',
  'Which tickets need attention?',
];

/**
 * Per page, in two parts: what is worth asking about the thing on screen, and
 * what is worth asking about the page whether or not one is open.
 */
const BY_PAGE: Record<string, { entity?: string[]; always: string[] }> = {
  '/': {
    always: [
      'What needs attention today?',
      'Check last week’s billing',
      'Find missing tickets',
    ],
  },
  '/records': {
    entity: ['Why isn’t this invoice ready?'],
    always: ['How many invoices are waiting on rates?', 'Which tickets need attention?'],
  },
  '/mileage': {
    entity: ['Check this route'],
    always: ['Why is this mileage high?', 'Recalculate yesterday’s mileage'],
  },
  '/rates': {
    always: ['What rates are missing?', 'Prepare the missing rate requests', 'Check for replies'],
  },
  '/customers': {
    always: ['Which customers are waiting on rates?'],
  },
  '/load-desk': {
    always: ['Check extraction', 'Find duplicates'],
  },
};

/**
 * What is worth asking about a particular thing, whichever page it was opened
 * from. A page says what kind of work is being done; the thing in front of the
 * person says what the work is about, and that is the sharper of the two — so
 * these come first when a page has set an entity.
 *
 * Every one of them says "this invoice", "this ticket", "this day". That is
 * not vagueness: the engine puts the entity into the instructions, so "this
 * invoice" names exactly the invoice the page opened the panel on, and the
 * Operator has its identifier without the person typing a number out.
 */
const BY_ENTITY: Partial<Record<EntityType, string[]>> = {
  invoice: [
    'Why isn’t this invoice ready?',
    'Check the rates on this invoice',
    'Check the tickets on this invoice',
    'Recalculate this invoice',
  ],
  ticket: [
    'Check this ticket’s extraction',
    'Is this ticket a duplicate?',
    'Which invoice is this on?',
  ],
  customer: [
    'What rates are missing for this customer?',
    'Prepare a rate request for this customer',
    'Show this customer’s recent activity',
  ],
  mileage_day: ['Check this route', 'Why is this mileage high?', 'Recalculate this day'],
  rate_request: ['Has the customer replied?', 'Draft a follow-up'],
  truck: ['Check this truck’s mileage this week'],
};

/** The most a person can weigh at a glance before the list is a menu. */
const MOST = 6;

/**
 * The questions to offer on this page, in the order they are worth asking.
 * Never more than six, never the same question twice, and never one about
 * "this invoice" on a page that is not showing one.
 *
 * The thing in front of the person leads, the page follows it, and the general
 * questions fill what is left — so a person who opened the panel on an invoice
 * is offered that invoice's questions, and a person who pressed the trigger in
 * the bar is offered the page's.
 */
export function suggestionsFor(context: PageContext | null): string[] {
  const page = BY_PAGE[context?.page ?? ''];
  const entity = context?.entity ?? null;
  const offered = [
    ...(entity ? (BY_ENTITY[entity.type] ?? []) : []),
    ...(entity ? (page?.entity ?? []) : []),
    ...(page?.always ?? []),
    ...GENERAL,
  ];
  const seen = new Set<string>();
  const chosen: string[] = [];
  for (const question of offered) {
    if (seen.has(question)) continue;
    seen.add(question);
    chosen.push(question);
    if (chosen.length === MOST) break;
  }
  return chosen;
}
