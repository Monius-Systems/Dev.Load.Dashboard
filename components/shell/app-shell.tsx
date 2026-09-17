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
import AccountMenu from '@/components/shell/account-menu';
import DeskActivity from '@/components/shell/desk-activity';
import { adoptSessionAccount } from '@/lib/account';
import type { ShellAccount } from '@/lib/account-display';
import { useCompanyName } from '@/components/shell/use-company-name';
import { useT } from '@/lib/i18n/use-t';
import { companyInitials } from '@/lib/load-desk/business';
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
          <span className="client-avatar">{companyInitials(companyName)}</span>
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
      {shellConfig.navigation.map(({ href, label, icon: Icon, shortLabel }) => {
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
  const { t } = useT();
  const title = t(
    shellConfig.navigation.find(({ href }) => href === pathname)?.label ??
      shellConfig.pageTitles[pathname] ??
      'Workspace',
  );

  /**
   * The colour behind the clock, the island and the battery.
   *
   * Added to a home screen, the page does not paint up there: iOS keeps that
   * strip and fills it with the page's theme-color, which defaults to white —
   * the pale band above the header. Setting it to the header's own colour makes
   * the strip and the header read as one field. It follows the page, so the
   * pages with a light background keep a light strip.
   *
   * The colour is measured from the live tokens rather than written out here,
   * so a workspace with its own accent gets its own status bar. Measuring also
   * settles the serialisation: a browser writes color-mix() out as
   * color(srgb …), which the parser that reads theme-color predates, while a
   * measured background always comes back as plain rgb().
   */
  useEffect(() => {
    const root = document.documentElement;
    // The page is named on the root element. The strip behind the clock takes
    // its colour from the root's background, and keying that off the page
    // rather than off something the page renders means it is right on the
    // first paint — :has(.hm-stats) only became true once the records had
    // loaded, so the strip spent the first moment grey and Safari had already
    // decided by then.
    const home = pathname === '/';
    root.dataset.page = home ? 'home' : 'inner';

    let meta = document.head.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    const themeColour = meta;

    /** Blue while the header is showing, the sheet's grey once it is not. */
    const paint = (covered: boolean) => {
      if (covered) root.dataset.scrolled = 'past';
      else delete root.dataset.scrolled;
      const probe = document.createElement('div');
      probe.style.cssText =
        'position:absolute;width:0;height:0;opacity:0;pointer-events:none;background:' +
        (home && !covered ? 'var(--ui-accent)' : 'var(--ui-surface-2)');
      document.body.appendChild(probe);
      themeColour.content = getComputedStyle(probe).backgroundColor;
      probe.remove();
    };

    if (!home) {
      paint(false);
      return;
    }

    // On the home page the strip follows the scroll: the header is the floor
    // and the sheet travels up over it, so once the sheet has reached the top
    // of the screen there is no blue left up there to match and the strip
    // would be a band of it on its own.
    const phone = window.matchMedia('(max-width: 767px)');
    let frame = 0;
    let covered = false;
    const check = () => {
      frame = 0;
      const sheet = document.querySelector('.hm-sheet');
      // display:contents above phone width, where the sheet is not a box and
      // reports an empty rect that would read as covered.
      const now =
        phone.matches && !!sheet && sheet.getBoundingClientRect().top <= 0;
      if (now !== covered) paint((covered = now));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    paint(false);
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    phone.addEventListener('change', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      phone.removeEventListener('change', onScroll);
      delete root.dataset.scrolled;
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
                reach Account or sign out from. */}
            <div className="topbar-account">
              <AccountMenu initial={initialAccount} />
            </div>
          </header>
          <div className="page-content" id="workspace-content" tabIndex={-1}>
            {/* Keyed by page, so each page's entrance animation plays when it opens. */}
            <div key={pathname} className="page-enter">
              {children}
            </div>
          </div>
          <TabBar />
        </SidebarInset>
      </SidebarProvider>
    </Toaster>
  );
}
