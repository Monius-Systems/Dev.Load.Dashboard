'use client';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toast';
import AccountMenu, { AccountLink } from '@/components/shell/account-menu';
import DeskActivity from '@/components/shell/desk-activity';
import { adoptSessionAccount } from '@/lib/account';
import type { ShellAccount } from '@/lib/account-display';
import { CompanyMark } from '@/components/shell/user-avatar';
import { useCompanyLogo, useCompanyName } from '@/components/shell/use-company-name';
import { usePageSwipe } from '@/hooks/use-page-swipe';
import SectionPager from '@/components/shell/section-pager';
import { useT } from '@/lib/i18n/use-t';
import { shellConfig } from '@/lib/shell-config';

function ShellNavigation({
  initialAccount,
}: {
  initialAccount: ShellAccount | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { companyName } = useCompanyName();
  const companyLogo = useCompanyLogo();
  const { t } = useT();
  const go = (href: string) => {
    router.push(href);
    setOpenMobile(false);
  };
  return (
    <Sidebar variant="floating" className="workspace-sidebar">
      <SidebarHeader className="brand">
        <button aria-label={t('Go to home')} onClick={() => go('/')}>
          <Image
            unoptimized
            src="/monius-logo.png"
            width={188}
            height={63}
            alt="Monius Systems"
          />
        </button>
      </SidebarHeader>
      <SidebarContent>
        <div className="client-card">
          {/* The company's own logo when it has uploaded one, and its initials
              until then. Decorative: the name is on the line beside it. */}
          <span className="client-avatar">
            <CompanyMark name={companyName} src={companyLogo} />
          </span>
          <span className="client-card-copy">
            <strong title={companyName}>{companyName}</strong>
          </span>
        </div>
        <p className="nav-label">{t('WORKSPACE')}</p>
        <SidebarMenu>
          {shellConfig.navigation.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                className="nav-item"
                isActive={pathname === href}
                aria-current={pathname === href ? 'page' : undefined}
                onClick={() => go(href)}
              >
                <Icon />
                <span>{t(label)}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <AccountMenu initial={initialAccount} />
      </SidebarFooter>
    </Sidebar>
  );
}

/**
 * A read-out of what the phone is actually doing, for when a screenshot cannot
 * tell a browser tab from a home-screen app. Only ever rendered with ?diag=1 on
 * the address, so it costs nothing the rest of the time.
 */
function Diagnostics() {
  const panel = useRef<HTMLPreElement>(null);
  useEffect(() => {
    const node = panel.current;
    if (!node || !new URLSearchParams(window.location.search).has('diag'))
      return;
    // After a frame, so the colours reported are the settled ones rather than
    // whatever was on the element before the shell had finished its own work.
    const frame = requestAnimationFrame(() => {
      const probe = document.createElement('div');
      probe.style.cssText =
        'position:fixed;top:0;height:env(safe-area-inset-top)';
      document.body.appendChild(probe);
      const inset = Math.round(probe.getBoundingClientRect().height);
      probe.remove();
      node.textContent = [
        `standalone (display-mode): ${window.matchMedia('(display-mode: standalone)').matches}`,
        `standalone (navigator): ${String((navigator as { standalone?: boolean }).standalone)}`,
        `safe-area-inset-top: ${inset}px`,
        `theme-color: ${document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.content ?? 'none'}`,
        `html background: ${getComputedStyle(document.documentElement).backgroundColor}`,
        `viewport: ${window.innerWidth} x ${window.innerHeight}`,
      ].join('\n');
      node.hidden = false;
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return <pre ref={panel} className="shell-diagnostics" hidden />;
}

/**
 * The sections a phone has a tab for: the bar's own order, without the pages
 * marked `phone: false` — those are reached from the page they belong to, and
 * a tab each would crowd the bar past what a thumb can hit.
 */
const PHONE_NAV = shellConfig.navigation.filter(({ phone }) => phone !== false);

/**
 * The way around on a phone. The sidebar is a drawer there, which puts every
 * page two taps away behind an icon most people never press; a bar along the
 * bottom keeps the same five places one thumb-tap away and shows which one you
 * are on. Hidden on anything with room for the sidebar.
 */
function TabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useT();
  return (
    <nav className="tabbar" aria-label={t('Sections')}>
      {PHONE_NAV.map(({ href, label, icon: Icon, shortLabel }) => {
        const current = pathname === href;
        return (
          <button
            key={href}
            type="button"
            className="tabbar-item"
            data-current={current || undefined}
            aria-current={current ? 'page' : undefined}
            onClick={() => router.push(href)}
          >
            <Icon aria-hidden="true" />
            <span>{t(shortLabel ?? label)}</span>
          </button>
        );
      })}
    </nav>
  );
}

/** The sections a swipe moves between: the bar along the bottom, in its order. */
const SWIPE_PAGES = PHONE_NAV.map(({ href }) => href);

/** The dashboard frame: floating sidebar, top bar and page area. */
export default function AppShell({
  children,
  initialAccount = null,
}: {
  children: ReactNode;
  /** Name and photo from the session, so the sidebar has them at first paint. */
  initialAccount?: ShellAccount | null;
}) {
  // Before anything draws: if this browser remembers an account that is not the
  // one signed in now, forget it. Otherwise the person who signs in after
  // somebody else sees their name, email and photo until the server answers.
  adoptSessionAccount(initialAccount);
  const pathname = usePathname();
  // A swipe across a phone moves along the bar at the bottom, in its order.
  usePageSwipe(SWIPE_PAGES, pathname);
  const { t } = useT();
  const title = t(
    shellConfig.navigation.find(({ href }) => href === pathname)?.label ??
      shellConfig.pageTitles[pathname] ??
      'Workspace',
  );

  /**
   * A page opens at its top on a phone, every time.
   *
   * The band a page opens on is the top of it, and arriving halfway down one —
   * which is where the browser leaves you when the page before was scrolled, or
   * when the same address is opened again — puts you in the middle of a sheet
   * with no heading and nothing to say where you are. On a wider screen the
   * browser's own behaviour is left alone.
   */
  useEffect(() => {
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  /**
   * The colour behind the clock, the island and the battery.
   *
   * With no theme-color to go on (see app/layout.tsx), Safari lets the page
   * run to the top edge and lays its own scrim over it, so what is behind the
   * clock is the page itself. The root is still made a mirror of it — what is
   * painted at the top of the page is written to --strip — because that is the
   * colour of the canvas the page sits on, which is what shows when the page
   * is pulled past either end, and it is what tells the account in the corner
   * whether it is standing on the band or on the sheet.
   *
   * The colour is read off the page rather than worked out from the route, so
   * it needs no list of which page is what, and the scanner needs no special
   * case either: a modal dialog is in the top layer, so while the camera is up
   * the colour at the top of the screen is the scanner's own black, and when
   * it closes the page underneath answers again.
   */
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.page = pathname === '/' ? 'home' : 'inner';

    /* Only a colour that hides what is behind it answers the question. Anything
       with an alpha is a tint over something else — the 12% white pill of
       figures on the band, for one, which is not the colour of anything. */
    const opaque = (colour: string) => {
      const parts = colour.match(/[\d.]+/g);
      return !!parts && (parts.length < 4 || Number(parts[3]) === 1);
    };

    /** What is painted at the top of the page, down the middle. */
    const topColour = () => {
      let node = document.elementFromPoint(
        Math.round(window.innerWidth / 2),
        1,
      );
      while (node) {
        const colour = getComputedStyle(node).backgroundColor;
        if (opaque(colour)) return colour;
        node = node.parentElement;
      }
      return null;
    };

    /* The accent as the browser writes it, to compare the mirror's answer
       against: the account on the bar is dressed for the band or for the page,
       and which one it is on is exactly which colour won here. */
    const swatch = document.createElement('div');
    swatch.style.cssText =
      'position:absolute;width:0;height:0;opacity:0;pointer-events:none;background:var(--ui-accent)';
    document.body.appendChild(swatch);
    const accent = getComputedStyle(swatch).backgroundColor;
    swatch.remove();

    let frame = 0;
    let last = '';
    const mirror = () => {
      frame = 0;
      const colour = topColour();
      if (!colour || colour === last) return;
      last = colour;
      root.style.setProperty('--strip', colour);
      root.dataset.strip = colour === accent ? 'accent' : 'page';
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(mirror);
    };

    queue();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    // Records arrive after the first paint and the page grows; the band may not
    // have been there to read when this started.
    const grew = new ResizeObserver(queue);
    grew.observe(document.body);
    // The scanner opening or closing changes what is at the top of the screen
    // without scrolling or resizing anything: it is a dialog put into the top
    // layer and taken out again. Both the element arriving and its open
    // attribute being set are watched, since showModal comes an effect after
    // the dialog is in the document.
    //
    // Page edits are DOM changes too, and this would otherwise read the screen
    // after every one of them: what is watched is only whether a modal is up,
    // and the read is asked for when that answer changes.
    let layerUp = false;
    const layered = new MutationObserver(() => {
      const up = !!document.querySelector('dialog[open]');
      if (up === layerUp) return;
      layerUp = up;
      queue();
    });
    layered.observe(document.body, {
      childList: true,
      subtree: true,
      attributeFilter: ['open'],
    });
    // And neither the page growing nor a scroll covers the stylesheet landing
    // after the first frame, which is how the band came back the page grey and
    // stayed that way: read once more as the page settles. Cheap, and the write
    // is skipped when the answer has not moved.
    const settling = [150, 600].map((ms) => setTimeout(queue, ms));
    return () => {
      cancelAnimationFrame(frame);
      for (const timer of settling) clearTimeout(timer);
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      grew.disconnect();
      layered.disconnect();
      root.style.removeProperty('--strip');
      delete root.dataset.strip;
    };
  }, [pathname]);

  // Design tokens derive their accent tints from --primary on the root element.
  useEffect(() => {
    const root = document.documentElement;
    const previousPrimary = root.style.getPropertyValue('--primary');
    const previousRing = root.style.getPropertyValue('--ring');
    root.style.setProperty('--primary', shellConfig.accentColor);
    root.style.setProperty('--ring', shellConfig.accentColor);
    return () => {
      root.style.setProperty('--primary', previousPrimary);
      root.style.setProperty('--ring', previousRing);
    };
  }, []);

  // Hover border on blocks: one ring element follows the block under the
  // cursor and lights its edge near the pointer in blue. The pointer position
  // is set on that ring alone (it has no children), so moving the mouse never
  // restyles a block's contents. Mouse and trackpad only; one update per frame.
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches)
      return;
    const ring = document.createElement('div');
    ring.className = 'panel-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);
    let frame = 0;
    let latest: PointerEvent | null = null;
    let current: HTMLElement | null = null;
    let size = '';
    const hide = () => {
      current = null;
      ring.dataset.active = 'false';
    };
    const update = () => {
      frame = 0;
      const event = latest;
      const target = event?.target;
      const block =
        event && target instanceof Element
          ? target.closest<HTMLElement>('.ld-panel')
          : null;
      if (!event || !block) return hide();
      const box = block.getBoundingClientRect();
      if (block !== current) {
        current = block;
        ring.style.borderRadius = getComputedStyle(block).borderRadius;
      }
      const nextSize = `${box.width}x${box.height}`;
      if (nextSize !== size) {
        size = nextSize;
        ring.style.width = `${box.width}px`;
        ring.style.height = `${box.height}px`;
      }
      ring.style.transform = `translate(${box.left}px, ${box.top}px)`;
      ring.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
      ring.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
      ring.dataset.active = 'true';
    };
    const move = (event: PointerEvent) => {
      latest = event;
      frame ||= requestAnimationFrame(update);
    };
    const leave = () => {
      latest = null;
      hide();
    };
    document.addEventListener('pointermove', move, { passive: true });
    // Blocks move when the page scrolls; the ring comes back on the next move.
    window.addEventListener('scroll', hide, { passive: true, capture: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      document.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', hide, { capture: true });
      document.documentElement.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(frame);
      ring.remove();
    };
  }, []);

  return (
    <Toaster timeout={3500}>
      <SidebarProvider
        style={
          {
            '--primary': shellConfig.accentColor,
            '--ring': shellConfig.accentColor,
            '--sidebar-width': '15.5rem',
          } as CSSProperties
        }
      >
        <div className="workspace-backdrop" aria-hidden="true" />
        {/* The floor under the screen: what a phone's bounce pulls into at the
            foot of a page. See .page-floor. */}
        <div className="page-floor" aria-hidden="true" />
        {/* And the blue behind the clock, which stays while the page scrolls
            under it. See .page-strip. */}
        <div className="page-strip" aria-hidden="true" />
        <Diagnostics />
        <a className="skip-link" href="#workspace-content">
          {t('Skip to content')}
        </a>
        <ShellNavigation initialAccount={initialAccount} />
        <SidebarInset className="workspace-main">
          <header className="topbar">
            <div className="breadcrumb">
              <SidebarTrigger />
              <span>{t('Workspace')}</span>
              <span>/</span>
              <strong>{title}</strong>
            </div>
            <DeskActivity />
            {/* The way to the account on a phone. The sidebar holds it on a
                screen with room, but there the sidebar is a drawer and the
                bar along the bottom replaced its trigger — leaving nowhere to
                reach Account or sign out from. Pressing it opens that page —
                see AccountLink for why it is not the menu the sidebar has.
                Not on the account page itself: the way to a page you are
                already on, over a band that is your photo and your name. */}
            {pathname === '/account' ? null : (
              <div className="topbar-account">
                <AccountLink initial={initialAccount} />
              </div>
            )}
          </header>
          {/* The page area is three sections wide on a phone and one on a
              desk; the router's own render is what anything outside the bar —
              the account page — is shown with. See SectionPager. */}
          <SectionPager>{children}</SectionPager>
          <TabBar />
        </SidebarInset>
      </SidebarProvider>
    </Toaster>
  );
}
