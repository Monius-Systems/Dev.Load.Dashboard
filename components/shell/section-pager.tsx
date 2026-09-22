'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { shellConfig } from '@/lib/shell-config';

/**
 * Each section's code, fetched the first time that section is rendered.
 *
 * Split apart rather than imported at the top, because whatever this file
 * imports is evaluated wherever this file is — and on the server that is every
 * request for every workspace page. Importing the five sections here meant a
 * request for Home evaluated Load Desk as well: the PDF reader, the ticket
 * extraction, the OCR, the scanner and its ten-megabyte OpenCV worker, none of
 * which the server would go on to render (`reach` is 0 there), all charged to
 * that request's CPU. On Cloudflare that is what "Exceeded CPU Limit" on GET /
 * was. Now the server evaluates the one section the route asked for and nothing
 * else.
 *
 * In the browser the split is also why the other panes come to be mounted
 * later rather than at once (see `reach` below): their code is fetched, parked
 * and ready before a swipe or a tap can reach them, warmed by `warmSections`.
 */
const SECTION_LOADERS = {
  '/': () => import('@/components/home/home-page'),
  '/load-desk': () => import('@/components/load-desk/load-desk'),
  '/records': () => import('@/components/records/records-page'),
  '/customers': () => import('@/components/profiles/customers-page'),
  '/fleet': () => import('@/components/profiles/fleet-page'),
  '/mileage': () => import('@/components/mileage/mileage-page'),
  '/rates': () => import('@/components/rates/rates-page'),
  '/ifta': () => import('@/components/ifta/ifta-page'),
} as const;

const HomePage = dynamic(SECTION_LOADERS['/']);
const LoadDesk = dynamic(SECTION_LOADERS['/load-desk']);
const RecordsPage = dynamic(SECTION_LOADERS['/records']);
const CustomersPage = dynamic(SECTION_LOADERS['/customers']);
const FleetPage = dynamic(SECTION_LOADERS['/fleet']);
const MileagePage = dynamic(SECTION_LOADERS['/mileage']);
const RatesPage = dynamic(SECTION_LOADERS['/rates']);
const IftaPage = dynamic(SECTION_LOADERS['/ifta']);

/**
 * Fetches the code of every section that is not on the screen, once the one
 * that is has been painted. A tap on the bar then opens a section whose code is
 * already here, as it was when everything came down in one piece; only the
 * server is spared, not the browser. Idle time when the browser offers it, and
 * simply a moment later when it does not.
 */
function warmSections(except: string) {
  const warm = () => {
    for (const [path, load] of Object.entries(SECTION_LOADERS)) {
      if (path !== except) void load().catch(() => {});
    }
  };
  if (typeof window.requestIdleCallback === 'function') {
    const handle = window.requestIdleCallback(warm, { timeout: 2000 });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(warm, 500);
  return () => window.clearTimeout(handle);
}

/**
 * The page area, as a window of three live sections rather than one.
 *
 * On a phone the section either side of the one you are looking at is really
 * mounted — the same components the router would mount, reading the same
 * stores, rendered at the same moment — and parked a screen away. Swiping moves
 * the two of them together (hooks/use-page-swipe.ts), so what arrives is the
 * section itself and not a picture of it: nothing is loaded on the way in,
 * nothing is stale, and there is no hand-off from a stand-in to a real page.
 *
 * ── Why the sections are rendered here and not by the route ──
 *
 * A route renders one page and replaces it when the route changes, which is
 * precisely the thing that cannot happen to a page the finger has just carried
 * into place. So the panes are keyed by section rather than by route: when the
 * route follows the swipe, React finds the same key and keeps the subtree — the
 * pane that arrived at the middle of the screen is the pane that stays, down to
 * the DOM node. All the route does afterwards is change which pane is called
 * the current one, and where the other two are parked.
 *
 * The router still owns the address, the title and the metadata; `children` is
 * what it rendered, and is used for anything that is not one of the sections in
 * the bar — the account page, or anything added later.
 */

/** The sections, by the address the bar gives them. */
const SECTIONS: Record<string, () => ReactNode> = {
  '/': () => <HomePage />,
  '/load-desk': () => <LoadDesk />,
  '/records': () => <RecordsPage />,
  '/customers': () => <CustomersPage />,
  '/fleet': () => <FleetPage />,
  '/mileage': () => <MileagePage />,
  '/rates': () => <RatesPage />,
  '/ifta': () => <IftaPage />,
};

/**
 * In the bar's order, which is the order a swipe moves through them. A page the
 * bar does not carry (`phone: false`) is left out: it has no place in the row,
 * so the router renders it as `children`, the way it renders the account page.
 */
const ORDER = shellConfig.navigation
  .filter(({ phone }) => phone !== false)
  .map(({ href }) => href)
  .filter((href) => href in SECTIONS);

export default function SectionPager({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pager = useRef<HTMLDivElement>(null);
  /**
   * How much of the row is alive, and when.
   *
   * 0 — the section asked for, and nothing else. What the server sends and
   *     what is hydrated, so the first paint costs exactly what it used to.
   * 1 — the two either side, a moment later: what a swipe moves.
   * 2 — the rest of the bar, a breath after that: what the bar itself jumps
   *     to. A tap on a section that was never mounted has to build it while
   *     you watch, and that is the flick the bar had; built in advance and
   *     parked, a tap is a page that is already there, the first time and
   *     every time.
   *
   * A wider screen stops at 0: there is no swipe and no bar to jump from.
   */
  const [reach, setReach] = useState(0);
  useEffect(() => warmSections(pathname), [pathname]);
  useEffect(() => {
    const phone = window.matchMedia('(max-width: 767px)');
    let slower = 0;
    const read = () => {
      window.clearTimeout(slower);
      if (!phone.matches) {
        setReach(0);
        return;
      }
      setReach(1);
      slower = window.setTimeout(() => setReach(2), 350);
    };
    read();
    phone.addEventListener('change', read);
    return () => {
      window.clearTimeout(slower);
      phone.removeEventListener('change', read);
    };
  }, []);

  const here = ORDER.indexOf(pathname);
  const known = here >= 0;
  const window_ = !known
    ? [pathname]
    : // Stage two is the whole bar, not two either side: the bar can jump from
      // one end of the row to the other, and everything it can reach has to be
      // standing there when it does.
      ORDER.filter((path, index) => reach > 1 || Math.abs(index - here) <= reach);

  /**
   * The moment the route catches up with the swipe: the panes change which one
   * they are, and the transforms the gesture wrote by hand come off in the same
   * breath — before the browser paints, so there is no frame where a pane is in
   * its new role and still carrying its old position.
   */
  useLayoutEffect(() => {
    const box = pager.current;
    if (!box) return;
    for (const pane of Array.from(box.children) as HTMLElement[]) {
      pane.style.transform = '';
      pane.style.opacity = '';
    }
    // The page area is one column and its scroll is the document's, so the
    // section arriving starts where a page starts. (The shell scrolls to the
    // top as well; this is the one that happens before anything is drawn.)
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="section-pager" ref={pager}>
      {window_.map((path) => {
        const current = path === pathname;
        const index = ORDER.indexOf(path);
        // Only the two next to this one are what a swipe moves; the rest of
        // the row waits off the side of the screen, laid out and unlit.
        const role = current
          ? 'current'
          : index === here - 1
            ? 'prev'
            : index === here + 1
              ? 'next'
              : 'far';
        return (
          <div
            key={path}
            className="section-pane"
            data-section={path}
            data-role={role}
            data-side={role === 'far' ? (index < here ? 'before' : 'after') : undefined}
            aria-hidden={current ? undefined : true}
            // A section nobody is looking at is not in the way of anything:
            // not the pointer, not the keyboard, not a screen reader.
            inert={!current}
          >
            <div
              className="page-content"
              id={current ? 'workspace-content' : undefined}
              tabIndex={current ? -1 : undefined}
            >
              <div className="page-enter">
                {known ? SECTIONS[path]!() : children}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
