import type { PageContext } from './types.ts';

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

/** The most a person can weigh at a glance before the list is a menu. */
const MOST = 6;

/**
 * The questions to offer on this page, in the order they are worth asking.
 * Never more than six, never the same question twice, and never one about
 * "this invoice" on a page that is not showing one.
 */
export function suggestionsFor(context: PageContext | null): string[] {
  const page = BY_PAGE[context?.page ?? ''];
  const offered = [
    ...(context?.entity ? (page?.entity ?? []) : []),
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
