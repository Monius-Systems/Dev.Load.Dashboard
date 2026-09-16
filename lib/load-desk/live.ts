// Keeping every device on the same workspace in step.
//
// A ticket photographed on a phone is saved to the workspace database, and the
// laptop on the desk should show it without anyone reloading the page. What
// this does is ask again: the moment a page is looked at, the moment a browser
// comes back online, and on a slow beat while it is on screen. Nothing is asked
// for while the page is in a pocket or behind another tab, so a phone left in a
// cab is not calling the server all afternoon.
//
// It is deliberately not a subscription. This app's sessions live in httpOnly
// cookies that page scripts cannot read, which is what keeps a stolen script
// from being a stolen login — and a database subscription in the browser needs
// exactly that token. Asking again is what can be done without handing it over.

/** How often a page that is being looked at asks whether anything changed. */
export const LIVE_INTERVAL_MS = 10_000;

/**
 * Calls `reload` when this page should catch up. Returns the function that
 * stops it. Safe to call more than once; each caller gets its own.
 */
export function watchForChanges(reload: () => void): () => void {
  if (typeof document === 'undefined') return () => {};
  let timer: ReturnType<typeof setInterval> | undefined;

  const stopBeat = () => {
    clearInterval(timer);
    timer = undefined;
  };
  const startBeat = () => {
    if (timer === undefined) timer = setInterval(reload, LIVE_INTERVAL_MS);
  };
  /** Back in view: catch up at once, then keep the beat going. */
  const catchUp = () => {
    if (document.visibilityState !== 'visible') {
      stopBeat();
      return;
    }
    reload();
    startBeat();
  };

  document.addEventListener('visibilitychange', catchUp);
  window.addEventListener('focus', catchUp);
  window.addEventListener('online', catchUp);
  if (document.visibilityState === 'visible') startBeat();

  return () => {
    stopBeat();
    document.removeEventListener('visibilitychange', catchUp);
    window.removeEventListener('focus', catchUp);
    window.removeEventListener('online', catchUp);
  };
}
