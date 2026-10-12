'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LaserRingProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Diameter in px */
  size?: number;
  strokeWidth?: number;
  /** Cursor distance (px) from the ring at which it starts to light up */
  reach?: number;
}

// Layered glow for the emitter: a white-hot core fading into a hero-blue halo.
function emitterShadow(u: number): string {
  const a = (k: number) => Math.max(0, k * u).toFixed(3);
  return [
    `0 0 2px 1px rgb(255 255 255 / ${a(0.9)})`,
    `0 0 4px 2px rgb(255 255 255 / ${a(0.7)})`,
    `0 0 8px 3px rgb(240 247 255 / ${a(0.5)})`,
    `0 0 14px 5px rgb(var(--cg-hero) / ${a(0.6)})`,
    `0 0 28px 8px rgb(var(--cg-hero) / ${a(0.4)})`,
    `0 0 50px 14px rgb(var(--cg-hero) / ${a(0.25)})`,
    `0 0 90px 25px rgb(var(--cg-hero) / ${a(0.15)})`,
  ].join(', ');
}

/**
 * Circular button whose outline acts like a laser: a glowing emitter sits on the
 * point of the ring closest to the cursor and the stroke brightens (cubic falloff)
 * as the cursor approaches. On touch screens the emitter slowly orbits instead.
 */
export function LaserRing({
  size = 64,
  strokeWidth = 2,
  reach = 220,
  className,
  style,
  children,
  ...rest
}: LaserRingProps) {
  const wrapRef = useRef<HTMLButtonElement | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!wrap || !ring || !dot) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(hover: none)').matches;
    const r = size / 2 - strokeWidth;
    let raf = 0;
    let mx = -1e5;
    let my = -1e5;

    const paint = (angle: number, u: number) => {
      const x = size / 2 + Math.cos(angle) * r;
      const y = size / 2 + Math.sin(angle) * r;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      dot.style.opacity = String(Math.max(0.05, u));
      dot.style.boxShadow = emitterShadow(u);
      ring.style.stroke = `rgb(var(--cg-fg) / ${(0.25 + u * 0.55).toFixed(3)})`;
      ring.style.filter =
        u > 0.05
          ? `drop-shadow(0 0 ${2 + u * 8}px rgb(var(--cg-hero) / ${(u * 0.7).toFixed(3)})) drop-shadow(0 0 ${6 + u * 20}px rgb(var(--cg-hero) / ${(u * 0.35).toFixed(3)}))`
          : 'none';
    };

    const track = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const dx = mx - (rect.left + rect.width / 2);
      const dy = my - (rect.top + rect.height / 2);
      const d = Math.hypot(dx, dy);
      const u = Math.pow(Math.max(0, 1 - Math.abs(d - r) / reach), 3);
      paint(Math.atan2(dy, dx), u);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(track);
    };
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      schedule();
    };

    if (touch) {
      if (reduce) {
        paint(-Math.PI / 2, 0.6);
        return;
      }
      const start = performance.now();
      const orbit = (now: number) => {
        paint(-Math.PI / 2 + ((now - start) / 2600) * Math.PI * 2, 0.6);
        raf = requestAnimationFrame(orbit);
      };
      raf = requestAnimationFrame(orbit);
      return () => cancelAnimationFrame(raf);
    }

    paint(-Math.PI / 2, 0);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [size, strokeWidth, reach]);

  return (
    <button
      ref={wrapRef}
      type="button"
      className={cn(
        'relative inline-flex items-center justify-center rounded-full text-cg-fg transition-transform duration-300 hover:scale-105',
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...rest}
    >
      {children}
      <svg
        aria-hidden
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="pointer-events-none absolute inset-0 overflow-visible"
      >
        <circle
          ref={ringRef}
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - strokeWidth}
          fill="none"
          strokeWidth={strokeWidth}
          style={{ stroke: 'rgb(var(--cg-fg) / 0.25)', willChange: 'filter' }}
        />
      </svg>
      <span
        ref={dotRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 -ml-px -mt-px h-0.5 w-0.5 rounded-full bg-white"
        style={{ opacity: 0.05, willChange: 'transform, box-shadow, opacity' }}
      />
    </button>
  );
}
