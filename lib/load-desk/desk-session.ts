// The Load Desk working session: files waiting to be extracted, the tickets
// queued for review, and how far an extraction has got.
//
// It lives outside React so that opening another page and coming back does not
// throw the work away. An extraction started on the page keeps running while
// another page is open, because it writes here rather than into component
// state. The session is held in memory only: a reload starts fresh.

import type { QueueItem } from './types.ts';

/** A message under the upload or save button. */
export type DeskStatus = { message: string; tone: 'info' | 'error' } | null;

/** Extraction in progress: file `index` (0-based) of `total`, whole batch `percent`. */
export type DeskExtraction = {
  index: number;
  total: number;
  file: string;
  percent: number;
  label: string;
  /**
   * Read off to the side, for "Review later": a line above the bar along the
   * bottom rather than the screen a phone otherwise gives this. Kept here with
   * the rest of the extraction so it survives leaving the page and coming back.
   */
  quiet: boolean;
} | null;

export type DeskSession = {
  queue: QueueItem[];
  /** The ticket being reviewed, or -1 when the queue is empty. */
  activeIndex: number;
  pending: File[];
  busy: boolean;
  uploadStatus: DeskStatus;
  extraction: DeskExtraction;
  saveStatus: DeskStatus;
  /** The truck chosen for the next upload. */
  truckChoice: string;
  /** The upload whose invoice tickets are being added to, while they extract. */
  addingTo: string | null;
};

const EMPTY: DeskSession = {
  queue: [],
  activeIndex: -1,
  pending: [],
  busy: false,
  uploadStatus: null,
  extraction: null,
  saveStatus: null,
  truckChoice: '',
  addingTo: null,
};

let session: DeskSession = EMPTY;
const listeners = new Set<() => void>();

const announce = () => {
  for (const listener of listeners) listener();
};

export function subscribeDesk(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const deskSnapshot = () => session;
export const serverDeskSnapshot = () => EMPTY;

/**
 * Replaces one part of the session. `value` is the next value, or a function
 * of the current one, so callers read like React's own setters.
 */
export function setDeskField<K extends keyof DeskSession>(
  key: K,
  value: DeskSession[K] | ((current: DeskSession[K]) => DeskSession[K]),
): void {
  const next =
    typeof value === 'function'
      ? (value as (current: DeskSession[K]) => DeskSession[K])(session[key])
      : value;
  if (Object.is(next, session[key])) return;
  session = { ...session, [key]: next };
  announce();
}

/** Ends the session: the queue is gone and the page starts empty. */
export function clearDesk(): void {
  session = EMPTY;
  announce();
}
