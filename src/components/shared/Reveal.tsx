'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Stagger delay, e.g. "100ms" */
  delay?: string;
  /** Which way the element travels in from; "none" fades in place. */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  as?: 'div' | 'article' | 'section' | 'li';
}

/**
 * Scroll-reveal wrapper. Renders hidden (via the `[data-reveal]` rule in
 * globals.css) and adds `.in` once it enters the viewport: a 700ms ease-out
 * fade with a 2rem slide. Honors prefers-reduced-motion through the same CSS rule.
 */
export function Reveal({
  children,
  className,
  delay,
  direction = 'up',
  as = 'div',
  style,
  ...rest
}: RevealProps) {
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
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      data-reveal={direction === 'up' ? '' : direction}
      className={cn(className)}
      style={{ transitionDelay: delay, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
