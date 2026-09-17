import { setDeskField } from '@/lib/load-desk/desk-session';

/**
 * "Scan ticket" on the home page is the camera, not the page the camera is on.
 *
 * It is said to the Load Desk session rather than carried in the URL or handed
 * over as the page is created: the page is already alive — the sections either
 * side of the one on screen are kept mounted so they can be swiped to — so
 * there is no "as it opens" to hook into, and no need for one. The camera is up
 * on the tap, over whatever is on the screen, while the section it belongs to
 * arrives underneath it.
 */
export function requestScanner() {
  setDeskField('scannerOpen', true);
}
