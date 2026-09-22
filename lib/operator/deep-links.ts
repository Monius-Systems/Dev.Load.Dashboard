// The other half of lib/operator/entities.ts: those files write the links, and
// this one reads them back.
//
// An Operator answer names an invoice, a ticket, a customer or a rate request,
// and the chip behind that name is a route into the dashboard — /records?
// invoice=…, /customers?customer=… — which only means something if the page it
// lands on looks at its own address and opens the thing. Every page that does
// so reads its parameters through here, so the parsing is written once and is
// the same strict parsing everywhere.
//
// Strict, because the address bar is the one input in the dashboard anybody can
// type into. An identifier is a positive, whole, safe integer and nothing else
// — not "1e3", not "-4", not "12.5", not " 12 " — and a key is a short line of
// printable text. Anything else is not a bad link to be guessed at; it is no
// link at all, and the page carries on as though the parameter were absent.
//
// Pure. Nothing here touches the DOM, the router or the network: it takes the
// query string a page already has and hands back what the page may act on.

/** What a page may be asked to open. Absent means the address did not say. */
export type DeepLink = {
  ticket?: number;
  invoice?: string;
  customer?: number;
  request?: number;
  job?: string;
};

/** The longest a key may be. An invoice number or a job address is far shorter. */
const MAX_KEY = 200;

/**
 * Only the digits, with no room for a sign, a point, an exponent or a space.
 * Number() would take all four and hand back something that looks like an id.
 */
const DIGITS = /^\d{1,15}$/;

/**
 * A control character anywhere at all. A real key has none, and a key carrying
 * one is on its way into a log line or an attribute rather than into a lookup.
 * Read by code point rather than by a regular expression, because a pattern
 * written with control characters in it is the harder thing to review.
 */
function hasControl(value: string): boolean {
  for (const character of value) {
    const code = character.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) return true;
  }
  return false;
}

/** A positive whole identifier, or null for anything that is not one. */
function readId(value: string | null): number | null {
  if (value === null || !DIGITS.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/** A key as a person would type it: printable, trimmed, and not a paragraph. */
function readKey(value: string | null): string | null {
  if (value === null) return null;
  const key = value.trim();
  if (!key || key.length > MAX_KEY || hasControl(key)) return null;
  return key;
}

/**
 * What this address asks the page to open. A parameter that is missing, empty
 * or malformed is left out entirely rather than reported, because a page has
 * nothing useful to say about a link somebody mistyped: it simply shows itself.
 */
export function readDeepLink(search: string): DeepLink {
  const params = new URLSearchParams(search);
  const link: DeepLink = {};
  const ticket = readId(params.get('ticket'));
  if (ticket !== null) link.ticket = ticket;
  const invoice = readKey(params.get('invoice'));
  if (invoice !== null) link.invoice = invoice;
  const customer = readId(params.get('customer'));
  if (customer !== null) link.customer = customer;
  const request = readId(params.get('request'));
  if (request !== null) link.request = request;
  const job = readKey(params.get('job'));
  if (job !== null) link.job = job;
  return link;
}

/**
 * The same address with one parameter taken out, for history.replaceState once
 * the page has acted on it. A deep link is an instruction, not a place: having
 * opened the invoice it named, a refresh should leave the page as the person
 * left it rather than opening the dialog over their work a second time.
 *
 * The path and anything else in the query are kept exactly as they were.
 */
export function clearDeepLink(param: string, href?: string): string {
  const from = href ?? (typeof window === 'undefined' ? '/' : window.location.href);
  // A base is needed for a relative address and ignored for an absolute one;
  // only the path, the query and the fragment are ever handed back.
  const url = new URL(from, 'https://dashboard.invalid');
  url.searchParams.delete(param);
  return `${url.pathname}${url.search}${url.hash}`;
}
