/**
 * "Scan ticket" on the home page is the camera, not the page the camera is on:
 * it asks for the scanner here, and Load Desk opens it as it arrives.
 *
 * A note in memory rather than only the ?scan=1 in the URL, because the URL is
 * not the new one yet when the page it belongs to first renders: the router
 * writes it to history after the render is committed, so Load Desk reading
 * window.location on the way in would have read the home page's address and
 * found nothing. The parameter is still there, and still answered — it is what
 * a cold load or a reload of that address has to go on.
 *
 * Read while rendering rather than in an effect, so the camera is up in the
 * first paint instead of a frame of Load Desk first. So the read does not
 * consume the request: a render has to be able to run twice and say the same
 * thing. What ends it is the scanner closing, which is an event.
 */
let requested = false;

/** Called on the way out of the home page, before the navigation. */
export function requestScanner() {
  requested = true;
}

/** Whether Load Desk should open the camera as it comes up. */
export function scannerRequested() {
  return (
    requested ||
    (typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).has('scan'))
  );
}

/** Called when the scanner closes, so coming back here does not reopen it. */
export function clearScannerRequest() {
  requested = false;
}
