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

/**
 * The person moved to another page while the panel was open.
 *
 * The page is part of what the Operator is told, so it follows the router
 * rather than being fixed at the moment the panel opened. The thing being
 * looked at does not follow: an invoice is the page's own, so leaving that
 * page leaves the invoice behind, and only a page that says so again — by
 * opening the panel on something — puts one back.
 */
export function setPage(page: string) {
  // Nothing to keep current until the panel has been opened once: a context is
  // made by opening it, and the shell moving between pages is not that.
  if (snapshot.context === null || snapshot.context.page === page) return;
  publish({ ...snapshot, context: { page, entity: null } });
}
