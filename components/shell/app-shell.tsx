'use client';
import { useEffect, type CSSProperties, type ReactNode } from 'react';
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


function ShellNavigation({ initialAccount }: { initialAccount: ShellAccount | null }) {
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
          <span className="client-avatar">
            {companyInitials(companyName)}
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
   * the pale band above the header. Setting it to the colour the header starts
   * with makes the strip and the header read as one field. It follows the page,
   * so the pages with a light background keep a light strip.
   *
   * The colour is measured from the live tokens rather than written out here,
   * so a workspace with its own accent gets its own status bar.
   */
  useEffect(() => {
    const probe = document.createElement('div');
    probe.style.cssText =
      'position:absolute;width:0;height:0;opacity:0;pointer-events:none;background:' +
      (pathname === '/' ? 'var(--ui-accent)' : 'var(--ui-surface-2)');
    document.body.appendChild(probe);
    const measured = getComputedStyle(probe).backgroundColor;
    probe.remove();
    // The mix is done here rather than in the stylesheet: a browser serialises
    // color-mix() as color(srgb …), and theme-color is read by a parser that
    // predates it. Plain rgb() is understood everywhere.
    const [red = 0, green = 0, blue = 0] = (measured.match(/[\d.]+/g) ?? []).map(Number);
    const onWhite = (channel: number) => Math.round(channel * 0.52 + 255 * 0.48);
    const colour =
      pathname === '/'
        ? `rgb(${onWhite(red)}, ${onWhite(green)}, ${onWhite(blue)})`
        : measured;
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = colour;
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
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
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
        event && target instanceof Element ? target.closest<HTMLElement>('.ld-panel') : null;
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
