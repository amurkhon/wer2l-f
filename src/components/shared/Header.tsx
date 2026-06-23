'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { siteConfig } from '@/lib/config';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === '/';
  // Solid (light) chrome whenever we're off the hero: not on home, or scrolled.
  const solid = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[90] transition-[background,box-shadow,padding,border-color] duration-[400ms]',
        solid
          ? 'border-b border-[#ebecf5] bg-white/80 py-3 shadow-[0_6px_30px_-12px_rgba(30,31,75,.18)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent py-5',
      )}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 sm:px-10">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-[11px]">
          <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-gradient-to-br from-lab-600 to-lab-800 font-serif text-[17px] font-bold text-white shadow-[0_8px_20px_-6px_rgba(79,84,228,.7)]">
            W²
          </span>
          <span
            className={cn(
              'font-serif text-xl font-bold tracking-tight transition-colors duration-[400ms]',
              solid ? 'text-lab-950' : 'text-white',
            )}
          >
            WER²L
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative py-1.5 text-[15px] font-medium tracking-[0.005em] transition-colors duration-300 hover:text-lab-600',
                  active ? (solid ? 'text-lab-600' : 'text-white') : solid ? 'text-[#3b3e52]' : 'text-white/80',
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'absolute -bottom-[3px] left-0 h-[2px] rounded-sm bg-lab-600 transition-[width] duration-[400ms] ease-[cubic-bezier(.16,.84,.44,1)] group-hover:w-full',
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
          <Link
            href="/about"
            className="hidden rounded-[10px] bg-lab-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_22px_-8px_rgba(79,84,228,.7)] transition-transform duration-200 hover:-translate-y-0.5 sm:inline-block"
          >
            Contact
          </Link>
          <button
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors lg:hidden',
              solid ? 'text-[#3b3e52] hover:bg-black/5' : 'text-white hover:bg-white/10',
            )}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-[#ebecf5] bg-white/95 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-1 px-6 py-3">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-lab-50',
                  pathname === item.href ? 'bg-lab-50 text-lab-600' : 'text-[#3b3e52]',
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
