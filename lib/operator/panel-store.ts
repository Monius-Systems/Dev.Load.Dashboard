import type { EntityRef, PageContext } from './types.ts';

// The Operator panel's own state, outside React, in the shape every other
// store in lib/load-desk uses: one snapshot, subscribers, and the calls that
// change it. Any page can open the panel with the thing it is looking at —
// "Ask Monius" on an invoice — without knowing anything about the panel.
//
// Nothing here fetches. The panel component owns the conversation and the
// calls to /api/operator; this is only whether it is open, on what, and with
// which question already typed.

export type PanelSnapshot = {
  open: boolean;
  context: PageContext | null;
  /** A question to start with, from a page's suggestion. Cleared once used. */
  prefill: string | null;
};

const SERVER_SNAPSHOT: PanelSnapshot = { open: false, context: null, prefill: null };

let snapshot: PanelSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function publish(next: PanelSnapshot) {
  snapshot = next;
  for (const listener of listeners) listener();
}

export function subscribePanel(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getPanelSnapshot = () => snapshot;
export const getServerPanelSnapshot = () => SERVER_SNAPSHOT;

/** Opens the panel, on this page, about this entity, with this question ready. */
export function openOperator(
  options: { page?: string; entity?: EntityRef | null; ask?: string } = {},
) {
  const page =
    options.page ?? (typeof window === 'undefined' ? '/' : window.location.pathname);
  publish({
    open: true,
    context: { page, entity: options.entity ?? null },
    prefill: options.ask ?? null,
  });
}

export function closeOperator() {
  publish({ ...snapshot, open: false });
}

/** The panel took the prefilled question into its input. */
export function consumePrefill() {
  if (snapshot.prefill !== null) publish({ ...snapshot, prefill: null });
}
