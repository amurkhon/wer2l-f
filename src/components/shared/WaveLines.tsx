'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const SPRING = 0.1;
const FRICTION = 0.9;
const RESISTANCE = 0.5;
const THICKNESS = 1.5;
const GAP = 30;
const POINT_STEP = 10;
/** After this long without pointer movement the idle sweep takes over */
const IDLE_MS = 1500;

interface Point {
  x: number;
  y: number;
  vy: number;
}

class Line {
  points: Point[] = [];
  heat = 0;

  constructor(
    public baseY: number,
    width: number,
  ) {
    for (let x = -POINT_STEP; x <= width + POINT_STEP; x += POINT_STEP) {
      this.points.push({ x, y: baseY, vy: 0 });
    }
  }

  update(cx: number, cy: number) {
    const near = Math.abs(cy - this.baseY) < GAP / 2;
    this.heat = near ? Math.min(this.heat + 0.2, 1) : Math.max(this.heat - 0.05, 0);
    const lift = GAP * 0.8;
    for (const p of this.points) {
      const target = near && Math.abs(p.x - cx) < 50 ? this.baseY - lift : this.baseY;
      p.vy += (target - p.y) * SPRING;
      p.vy *= FRICTION * (1 - RESISTANCE) + RESISTANCE * FRICTION;
      p.y += p.vy;
    }
  }

  draw(ctx: CanvasRenderingContext2D, rest: string, glow: string) {
    const pts = this.points;
    ctx.beginPath();
    ctx.lineWidth = THICKNESS;
    ctx.strokeStyle = this.heat > 0 ? `rgb(${glow} / ${0.35 + this.heat * 0.65})` : rest;
    const first = pts[0];
    if (!first) return;
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < pts.length - 1; i++) {
      const cur = pts[i]!;
      const next = pts[i + 1]!;
      ctx.quadraticCurveTo(cur.x, cur.y, (cur.x + next.x) / 2, (cur.y + next.y) / 2);
    }
    ctx.stroke();
  }
}

interface WaveLinesProps {
  /** Fraction of the height where the first line sits */
  startRatio?: number;
  className?: string;
}

/**
 * Horizontal spring-lines that bulge and glow blue where the cursor crosses
 * them. With no pointer activity a virtual cursor sweeps side to side.
 */
export function WaveLines({ startRatio = 0.5, className }: WaveLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lines: Line[] = [];
    let raf = 0;
    let visible = false;
    let idleT = 0;
    const cursor = { x: -1e5, y: -1e5, lastMove: 0 };

    const colors = () => {
      const style = getComputedStyle(document.documentElement);
      const fg = style.getPropertyValue('--cg-fg').trim() || '255 255 255';
      const glow = style.getPropertyValue('--cg-hero').trim() || '59 130 246';
      return { rest: `rgb(${fg} / 0.16)`, glow };
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lines = [];
      for (let y = h * startRatio; y <= h + GAP; y += GAP) lines.push(new Line(y, w));
    };

    const frame = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      let { x, y } = cursor;
      if (performance.now() - cursor.lastMove > IDLE_MS) {
        idleT += 0.01;
        const cssW = parseFloat(canvas.style.width) || 0;
        const first = lines[0]?.baseY ?? 0;
        x = cssW / 2 + Math.sin(idleT) * (cssW / 4);
        y = first + GAP * 2;
      }
      const { rest, glow } = colors();
      for (const line of lines) {
        line.update(x, y);
        line.draw(ctx, rest, glow);
      }
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      cursor.x = e.clientX - rect.left;
      cursor.y = e.clientY - rect.top;
      cursor.lastMove = performance.now();
    };

    resize();

    if (reduce) {
      const { rest, glow } = colors();
      for (const line of lines) line.draw(ctx, rest, glow);
      return;
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [startRatio]);

  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
