'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stagger delay, e.g. "90ms" */
  delay?: string;
  as?: 'div' | 'article' | 'section' | 'li';
}

/**
 * Scroll-reveal wrapper. Renders hidden (via the `[data-reveal]` rule in
 * globals.css) and adds `.in` once it enters the viewport. Honors
 * prefers-reduced-motion through the same CSS rule.
 */
export function Reveal({ children, className, delay, as = 'div', style, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      el.classList.add('in');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={cn(className)}
      style={{ transitionDelay: delay, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
