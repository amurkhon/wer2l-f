'use client';

import { useEffect, useRef } from 'react';

/**
 * Fixed gradient bar pinned to the top of the viewport that fills as the
 * page scrolls — mirrors the WER²L animated design's reading-progress bar.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const update = () => {
      rafRef.current = 0;
      const bar = barRef.current;
      if (!bar) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? Math.min(100, (doc.scrollTop || window.scrollY) / max * 100) : 0;
      bar.style.width = `${pct}%`;
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden
      className="fixed left-0 top-0 z-[120] h-[3px] w-0 bg-gradient-to-r from-lab-600 to-lab-400"
      style={{ boxShadow: '0 0 12px rgba(99,113,241,.6)' }}
    />
  );
}
