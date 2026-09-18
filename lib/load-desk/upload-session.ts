// One upload, from the first file chosen to the last invoice number given out.
//
// A ticket is filed the moment it has been read, because a photograph taken
// beside a truck must survive the app being closed. What it cannot be given
// then is its invoice number: the numbers of an upload run in ticket-date
// order, and the dates are not all known until every page has been read. A
// page that came out of the reader first would otherwise take the first number
// whatever day it was printed, and the books would climb in numbers while
// jumping about in dates.
//
// So the session holds the upload open. Every page in it reports where it has
// got to, and only when none of them is still working does the numbering run —
// once, over all of them together. Kept apart from the screen so the barrier
// can be checked without a browser.

/**
 * Where one page of an upload has got to.
 *
 * `extracted` means read and filed, not numbered: a page can sit there for as
 * long as its siblings take. That distinction is the whole point of this file.
 */
export const WORKING = ['queued', 'uploading', 'extracting'] as const;
/** Nothing more will happen to these, so they no longer hold the session up. */
export const TERMINAL = ['extracted', 'failed', 'skipped'] as const;

export type TicketStatus = (typeof WORKING)[number] | (typeof TERMINAL)[number];

export const isTerminal = (status: TicketStatus): boolean =>
  (TERMINAL as readonly string[]).includes(status);

/**
 * `open` while pages are still arriving, `finalizing` while the numbers are
 * being worked out and written, `complete` once they are on file.
 */
export type SessionStatus = 'open' | 'finalizing' | 'complete';

export type UploadSession = {
  id: string;
  status: SessionStatus;
  /** Every page of this upload, by the id it was given when it was queued. */
  tickets: Map<string, TicketStatus>;
};

export const openSession = (id: string): UploadSession => ({
  id,
  status: 'open',
  tickets: new Map(),
});

/** Records where a page has got to. A page not seen before joins the session. */
export function noteTicket(
  session: UploadSession,
  ticketId: string,
  status: TicketStatus,
): void {
  session.tickets.set(ticketId, status);
}

/** The pages still being worked on. The session waits for exactly these. */
export const unfinished = (session: UploadSession): string[] =>
  [...session.tickets]
    .filter(([, status]) => !isTerminal(status))
    .map(([ticketId]) => ticketId);

/**
 * The pages that came through, in the order they were queued. A page that
 * failed or was dropped is terminal — it stops holding the session up — but
 * there is nothing of it to invoice.
 */
export const extracted = (session: UploadSession): string[] =>
  [...session.tickets]
    .filter(([, status]) => status === 'extracted')
    .map(([ticketId]) => ticketId);

/**
 * Whether the numbering may run now: the upload is still open and nothing in
 * it is working. An upload of nothing is not ready — there is no page to wait
 * for and none to number.
 */
export const readyToFinalize = (session: UploadSession): boolean =>
  session.status === 'open' &&
  session.tickets.size > 0 &&
  unfinished(session).length === 0;

/**
 * Takes the right to number this upload, for the one caller that gets there
 * first. Everything after it is told no.
 *
 * Every page finishing asks, because any of them might be the last; without
 * this the last two to finish within a moment of each other would both find
 * nothing working and both hand out the same numbers. The check and the claim
 * happen together, with no await between them, so there is no gap for a second
 * caller to slip through.
 */
export function claimFinalize(session: UploadSession): boolean {
  if (!readyToFinalize(session)) return false;
  session.status = 'finalizing';
  return true;
}

/** The numbers are written; this upload is done with. */
export function completeSession(session: UploadSession): void {
  session.status = 'complete';
}

/**
 * Hands the session back if the numbering could not be written, so the upload
 * can be finalized again rather than being stranded half-numbered.
 */
export function releaseFinalize(session: UploadSession): void {
  if (session.status === 'finalizing') session.status = 'open';
}
