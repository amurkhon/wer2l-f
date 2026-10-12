'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';
import { siteConfig } from '@/lib/config';

const RESEARCH_AREAS = [
  'Hydraulics',
  'Flood Resilience',
  'Digital Twins',
  'Sustainable Materials',
];

/** Minimum viewport room left above a pinned footer before the curtain reveal is used */
const REVEAL_HEADROOM = 180;

export function Footer() {
  const ref = useRef<HTMLElement | null>(null);

  // Curtain reveal: when the footer fits comfortably on screen, pin it behind
  // <main> (see .site-main-reveal / .site-footer-reveal in globals.css).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const sync = () => {
      const h = el.offsetHeight;
      root.style.setProperty('--site-footer-h', `${h}px`);
      root.toggleAttribute(
        'data-footer-reveal',
        window.innerWidth >= 768 && h + REVEAL_HEADROOM <= window.innerHeight,
      );
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
      root.style.removeProperty('--site-footer-h');
      root.removeAttribute('data-footer-reveal');
    };
  }, []);

  return (
    <footer ref={ref} className="site-footer-reveal bg-cg-base px-6 md:px-10">
      <div className="mx-auto max-w-[1080px] pb-6 pt-10 md:pb-8 md:pt-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[1.6fr_1fr_1fr_1fr] md:gap-12">
          {/* Brand */}
          <div className="col-span-2 max-w-sm md:col-span-1">
            <div className="flex items-center gap-[11px]">
              <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-cg-fg font-display text-[19px] font-bold leading-none text-cg-canvas">
                W²
              </span>
              <span className="font-display text-[26px] font-bold leading-none text-cg-fg">WER²L</span>
            </div>
            <p className="type-body-sm mt-5 text-cg-fg2">{siteConfig.description}</p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="type-overline mb-4 text-cg-fg3">Explore</h4>
            <nav className="flex flex-col gap-3">
              {siteConfig.nav.map((item) => (
                <Link key={item.href} href={item.href} className="link-cg type-body-sm">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Research */}
          <div>
            <h4 className="type-overline mb-4 text-cg-fg3">Research</h4>
            <div className="type-body-sm flex flex-col gap-3 text-cg-fg2">
              {RESEARCH_AREAS.map((area) => (
                <span key={area}>{area}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="type-overline mb-4 text-cg-fg3">Contact</h4>
            <div className="type-body-sm flex flex-col gap-3 text-cg-fg2">
              <a href={`mailto:${siteConfig.social.email}`} className="link-cg underline underline-offset-4">
                {siteConfig.social.email}
              </a>
              <span>Tel: 051-200-5738</span>
              <Link
                href="https://www.linkedin.com/company/w-e-r2-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="link-cg"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>

        <div className="type-caption mt-12 flex flex-wrap justify-between gap-3 border-t border-cg-hover pt-6 text-cg-fg3">
          <span>
            © {new Date().getFullYear()} {siteConfig.shortName}. All rights reserved.
          </span>
          <span>Civil &amp; Environmental Engineering Laboratory</span>
        </div>
      </div>
    </footer>
  );
}
