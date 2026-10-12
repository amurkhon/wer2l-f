'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { siteConfig } from '@/lib/config';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  // Publish the bar height so sticky sections can sit right beneath it. Measure the
  // bar, not the whole header: the open mobile menu sizes itself from this value.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const root = document.documentElement;
    const sync = () => root.style.setProperty('--site-nav-h', `${el.offsetHeight}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty('--site-nav-h');
    };
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full px-6 transition-colors duration-300 md:px-10',
        scrolled || mobileOpen ? 'frosted-cg' : 'bg-cg-canvas',
      )}
    >
      <div ref={barRef} className="mx-auto flex max-w-[1080px] items-center justify-between py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-[11px]" aria-label={`${siteConfig.shortName} home`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-cg-fg font-display text-[19px] font-bold leading-none text-cg-canvas">
            W²
          </span>
          <span className="font-display text-[26px] font-bold leading-none tracking-[-0.01em] text-cg-fg">
            WER²L
          </span>
        </Link>

        <div className="flex items-center gap-5 md:gap-7">
          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative py-1 text-[17px] font-medium transition-colors duration-150',
                    active ? 'text-cg-fg' : 'text-cg-fg2 hover:text-cg-fg',
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute -bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-cg-hero transition-[width] duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:w-full',
                      active ? 'w-full' : 'w-0',
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/about" className="btn-cg btn-cg--primary hidden sm:inline-flex">
              Contact
            </Link>
            <button
              className="-mr-2 flex min-h-11 min-w-11 items-center justify-center text-cg-fg lg:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span className="relative block h-4 w-6">
                <span
                  className={cn(
                    'absolute left-0 top-0 block h-0.5 w-6 rounded bg-current transition-transform duration-300',
                    mobileOpen && 'translate-y-[7px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[7px] block h-0.5 w-6 rounded bg-current transition-opacity duration-200',
                    mobileOpen && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 top-[14px] block h-0.5 w-6 rounded bg-current transition-transform duration-300',
                    mobileOpen && '-translate-y-[7px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <nav
        className={cn(
          'overflow-y-auto border-t transition-all duration-300 ease-in-out lg:hidden',
          mobileOpen
            ? 'max-h-[calc(100dvh-var(--site-nav-h,76px))] border-cg-hover opacity-100'
            : 'pointer-events-none max-h-0 border-transparent opacity-0',
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="mx-auto flex max-w-[1080px] flex-col gap-2 pb-6 pt-4">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={mobileOpen ? undefined : -1}
              className={cn(
                'flex items-center justify-between rounded-2xl px-4 py-3.5 text-[18px] font-medium transition-colors active:bg-cg-hover',
                isActive(item.href) ? 'bg-cg-raised text-cg-fg' : 'bg-cg-base text-cg-fg2',
              )}
            >
              {item.label}
              <ChevronRight className="h-4 w-4 opacity-40" />
            </Link>
          ))}
          <Link
            href="/about"
            tabIndex={mobileOpen ? undefined : -1}
            className="btn-cg btn-cg--lg btn-cg--primary mt-2 w-full sm:hidden"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
