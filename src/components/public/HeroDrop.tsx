'use client';

import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------
   Particle water drop for the home hero, after the drop in the lab logo.
   Droplets trace a slowly turning teardrop with a glassy rim and glint, air
   bubbles rise inside it, and every few seconds a small drop falls into the
   tip and sends a ripple down the surface. As `progressRef` goes 0 → 1
   (driven by scroll in HomeHero) the drop splashes apart into falling rain.
   The cursor swells nearby droplets, and on wide screens annotation cards pin
   themselves to individual droplets and ride along with the rotation.
   ------------------------------------------------------------------ */

const CAM_Z = 3.5;
const FOCAL = 1 / Math.tan((45 / 2) * (Math.PI / 180));
const SPRITE = 64;
/** Teardrop half-height and width scale, in units of the layout radius. */
const DROP_H = 1.12;
const DROP_W = 0.98;
/** Share of particles on the surface; the rest are bubbles inside. */
const SURFACE_SHARE = 0.86;
/** Bubbles rise between these polar angles (π is the bottom, 0 the tip). */
const BUBBLE_FROM = Math.PI * 0.92;
const BUBBLE_TO = Math.PI * 0.32;
/** Vertical band the scattered droplets fall through. */
const RAIN_TOP = 3.2;
const RAIN_SPAN = 6.4;
const FEED_EVERY = 4800;
const FEED_FALL = 750;
const RIPPLE_DUR = 1800;
// Half-vector between a light up-left-front and the camera: the specular glint.
const GLINT = [-0.316, 0.373, 0.873] as const;
// Light leaving through the back of the drop gathers low on the far side.
const CAUSTIC = [0.42, -0.62, -0.66] as const;
const TINTS_DARK = [
  [225, 246, 255],
  [40, 214, 196],
  [70, 190, 255],
  [56, 120, 255],
] as const;
// Light canvas: the logo's navy and teal, deep enough to read on white.
const TINTS_LIGHT = [
  [10, 48, 86],
  [0, 150, 136],
  [0, 132, 206],
  [28, 84, 214],
] as const;
const ANNOTATION_COLORS = ['20 184 166', '56 170 240', '72 118 255'];
const MAX_ANNOTATIONS = 3;
const ANNOTATION_LIFE = 7000;
const ANNOTATION_EVERY = 2400;
const CARD_W = 248;
const CARD_H = 84;

type Rgb = readonly [number, number, number];

export interface DropAnnotation {
  title: string;
  stat: string;
}

interface ActiveAnnotation {
  key: number;
  focus: number;
  particle: number;
  born: number;
}

interface HeroDropProps {
  progressRef: React.RefObject<number>;
  annotations: DropAnnotation[];
  /** Element the annotation cards must not cover (the headline block) */
  avoidRef?: React.RefObject<HTMLElement | null>;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/** Teardrop radius at polar angle u: a point at the top, a round bulb below. */
const profile = (u: number) => Math.sin(u) * Math.sin(u / 2);
const profileSlope = (u: number) => Math.cos(u) * Math.sin(u / 2) + 0.5 * Math.sin(u) * Math.cos(u / 2);
const rgba = ([r, g, b]: Rgb, a: number) => `rgba(${r}, ${g}, ${b}, ${a})`;

function dropPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const tip = cy - r * 2.25;
  ctx.beginPath();
  ctx.moveTo(cx, tip);
  ctx.bezierCurveTo(cx + r * 0.35, tip + r * 0.95, cx + r, cy - r * 0.75, cx + r, cy);
  ctx.arc(cx, cy, r, 0, Math.PI);
  ctx.bezierCurveTo(cx - r, cy - r * 0.75, cx - r * 0.35, tip + r * 0.95, cx, tip);
  ctx.closePath();
}

function sprite(paint: (ctx: CanvasRenderingContext2D) => void): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = SPRITE;
  paint(c.getContext('2d')!);
  return c;
}

function halo(ctx: CanvasRenderingContext2D, tint: Rgb, strength: number) {
  const m = SPRITE / 2;
  const grad = ctx.createRadialGradient(m, m, 0, m, m, m);
  grad.addColorStop(0, rgba(tint, strength));
  grad.addColorStop(0.45, rgba(tint, strength * 0.3));
  grad.addColorStop(1, rgba(tint, 0));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SPRITE, SPRITE);
}

function makeSprites(dark: boolean) {
  const tints: readonly Rgb[] = dark ? TINTS_DARK : TINTS_LIGHT;
  const m = SPRITE / 2;
  // Light canvas: no halo — a soft glow reads as a smudge on white.
  const drops = tints.map((tint) =>
    sprite((ctx) => {
      if (dark) halo(ctx, tint, 0.28);
      const cx = m;
      const cy = m + 7;
      const r = 9.5;
      const lift = dark ? 0.45 : 0.25;
      const light: Rgb = [
        tint[0] + (255 - tint[0]) * lift,
        tint[1] + (255 - tint[1]) * lift,
        tint[2] + (255 - tint[2]) * lift,
      ];
      const body = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.2, 0, cx, cy - r * 0.5, r * 2.4);
      body.addColorStop(0, rgba(light, 1));
      body.addColorStop(0.6, rgba(tint, 0.95));
      body.addColorStop(1, rgba(tint, 0.7));
      dropPath(ctx, cx, cy, r);
      ctx.fillStyle = body;
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.42, cy - r * 0.3, r * 0.22, r * 0.32, -0.35, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${dark ? 0.95 : 0.85})`;
      ctx.fill();
    }),
  );
  const bubbles = [tints[0]!, tints[2]!].map((tint) =>
    sprite((ctx) => {
      if (dark) halo(ctx, tint, 0.18);
      ctx.beginPath();
      ctx.arc(m, m, 10, 0, Math.PI * 2);
      ctx.fillStyle = rgba(tint, 0.1);
      ctx.fill();
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = rgba(tint, 0.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(m, m, 6, Math.PI * 1.05, Math.PI * 1.45);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.stroke();
    }),
  );
  return { drops, bubbles };
}

function buildParticles(n: number) {
  const surface = Math.round(n * SURFACE_SHARE);
  // Surface droplets: rest position and outward normal.
  const base = new Float32Array(n * 3);
  const normal = new Float32Array(n * 3);
  // Polar angle (bubbles: offset into the rise cycle) and azimuth.
  const polar = new Float32Array(n);
  const azimuth = new Float32Array(n);
  // Bubbles: distance out toward the wall (0–1) and rise rate in cycles/s.
  const reach = new Float32Array(n);
  const rise = new Float32Array(n);
  // Rain: x, offset into the fall cycle, z; fall rate in cycles/s.
  const rain = new Float32Array(n * 3);
  const fall = new Float32Array(n);
  const arc = new Float32Array(n);
  const size = new Float32Array(n);
  const phase = new Float32Array(n);
  const tint = new Uint8Array(n);

  // Cumulative surface area down the profile, so droplets spread evenly
  // instead of bunching up in the narrow tip.
  const STEPS = 400;
  const cdf = new Float32Array(STEPS + 1);
  for (let s = 1; s <= STEPS; s++) {
    const u = ((s - 0.5) / STEPS) * Math.PI;
    const ds = Math.hypot(DROP_W * profileSlope(u), DROP_H * Math.sin(u));
    cdf[s] = cdf[s - 1]! + DROP_W * profile(u) * ds;
  }
  const total = cdf[STEPS]!;
  const golden = Math.PI * (3 - Math.sqrt(5));

  let s = 0;
  for (let i = 0; i < n; i++) {
    const k = i * 3;
    if (i < surface) {
      const target = ((i + 0.5) / surface) * total;
      while (s < STEPS && cdf[s + 1]! < target) s++;
      const f = (target - cdf[s]!) / Math.max(1e-9, cdf[s + 1]! - cdf[s]!);
      const u = ((s + f) / STEPS) * Math.PI;
      const az = golden * i;
      const r = DROP_W * profile(u) * (1 + (Math.random() - 0.5) * 0.04);
      base[k] = Math.cos(az) * r;
      base[k + 1] = Math.cos(u) * DROP_H;
      base[k + 2] = Math.sin(az) * r;
      // Outward normal of the profile curve, swept around the vertical axis.
      const nr = DROP_H * Math.sin(u);
      const ny = DROP_W * profileSlope(u);
      const len = Math.hypot(nr, ny) || 1;
      normal[k] = (Math.cos(az) * nr) / len;
      normal[k + 1] = ny / len;
      normal[k + 2] = (Math.sin(az) * nr) / len;
      polar[i] = u;
      azimuth[i] = az;
    } else {
      polar[i] = Math.random();
      azimuth[i] = Math.random() * Math.PI * 2;
      reach[i] = Math.sqrt(Math.random()) * 0.8;
      rise[i] = 0.05 + Math.random() * 0.07;
    }

    const a = Math.random() * Math.PI * 2;
    const dist = 1.4 + Math.pow(Math.random(), 0.7) * 3.4;
    rain[k] = Math.cos(a) * dist * 1.6;
    rain[k + 1] = Math.random();
    rain[k + 2] = Math.sin(a) * dist;
    fall[i] = 0.04 + Math.random() * 0.06;
    arc[i] = 0.3 + Math.random() * 0.9;

    size[i] = i < surface ? 0.55 + Math.random() * 1.1 : 0.5 + Math.random() * 0.8;
    phase[i] = Math.random() * Math.PI * 2;
    const t = Math.random();
    tint[i] = t < 0.55 ? 0 : t < 0.73 ? 1 : t < 0.9 ? 2 : 3;
  }
  return { n, surface, base, normal, polar, azimuth, reach, rise, rain, fall, arc, size, phase, tint };
}

export function HeroDrop({ progressRef, annotations, avoidRef }: HeroDropProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const markerRefs = useRef(new Map<number, HTMLDivElement>());
  const cardRefs = useRef(new Map<number, HTMLDivElement>());
  const [active, setActive] = useState<ActiveAnnotation[]>([]);
  const activeRef = useRef<ActiveAnnotation[]>([]);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 1024px)');
    const root = document.documentElement;

    const P = buildParticles(wide.matches ? 1500 : 700);
    // Screen positions + depth of every particle from the last frame.
    const proj = new Float32Array(P.n * 3);
    let dark = root.classList.contains('dark');
    let sprites = makeSprites(dark);

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let yaw = 0;
    let tilt = 0.18;
    let morph = 0;
    // When the next small drop starts falling into the tip, and when the last one landed.
    let feedAt = last + 1500;
    let rippleAt = -1e9;
    const pointer = { x: -1e5, y: -1e5, nx: 0.5, ny: 0.5 };
    let keySeq = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };

    const layout = () => {
      const side = wide.matches;
      const cx0 = side ? 0.66 : 0.5;
      const cy0 = side ? 0.5 : 0.4;
      const cx = (cx0 + (0.5 - cx0) * morph) * w;
      const cy = (cy0 + (0.5 - cy0) * morph) * h;
      const radius = Math.min(w, h) * (side ? 0.28 : 0.32) * (1 + morph * 0.5);
      return { cx, cy, scale: (radius * CAM_Z) / FOCAL };
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      morph += (smooth(0, 0.85, progressRef.current) - morph) * 0.12;
      yaw += dt * 0.14 + (pointer.nx - 0.5) * dt * 0.25;
      tilt += (0.18 + (pointer.ny - 0.5) * 0.3 - tilt) * 0.04;

      const { cx, cy, scale } = layout();
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosX = Math.cos(tilt);
      const sinX = Math.sin(tilt);
      const t = now / 1000;
      const pr = 110 * dpr;
      const px = pointer.x * dpr;
      const py = pointer.y * dpr;
      const highlighted = new Set(
        activeRef.current.filter((a) => now - a.born < ANNOTATION_LIFE).map((a) => a.particle),
      );
      const dim = wide.matches ? 1 : 0.6;
      // `shape` fades the drop-only effects (shading, ripple) as it splashes apart.
      const shape = 1 - morph;
      const splash = 4 * morph * (1 - morph);
      const raining = smooth(0, 0.25, morph);
      const rippleAge = (now - rippleAt) / RIPPLE_DUR;
      const ripple = rippleAge >= 0 && rippleAge < 1 ? (1 - rippleAge) * shape : 0;
      const rippleFront = -0.3 + rippleAge * (Math.PI + 0.6);
      const glintSprite = dark ? 0 : 2;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';

      const { base, normal, polar, azimuth, rain } = P;
      for (let i = 0; i < P.n; i++) {
        const k = i * 3;
        const onSurface = i < P.surface;
        let bx: number;
        let by: number;
        let bz: number;
        let fade = 1;
        let grow = 1;
        let band = 0;
        // Indices are always in range; `!` satisfies noUncheckedIndexedAccess in this hot loop.
        if (onSurface) {
          const u = polar[i]!;
          // Slow wobble of the water surface, plus the ripple from the last drop to land.
          let disp =
            Math.sin(2 * azimuth[i]! + t * 1.1) * Math.sin(u) * 0.022 + Math.sin(4 * u - t * 1.7) * 0.012;
          if (ripple > 0) {
            const d = (u - rippleFront) / 0.22;
            band = Math.exp(-d * d) * ripple;
            disp += band * 0.09;
          }
          bx = base[k]! + normal[k]! * disp;
          by = base[k + 1]! + normal[k + 1]! * disp;
          bz = base[k + 2]! + normal[k + 2]! * disp;
        } else {
          // Bubbles rise from the bulb toward the tip, swaying, and fade at both ends.
          const v = (polar[i]! + t * P.rise[i]!) % 1;
          const u = BUBBLE_FROM + (BUBBLE_TO - BUBBLE_FROM) * v;
          const r = DROP_W * profile(u) * P.reach[i]!;
          const a = azimuth[i]! + Math.sin(t * 1.3 + P.phase[i]!) * 0.25;
          bx = Math.cos(a) * r;
          by = Math.cos(u) * DROP_H;
          bz = Math.sin(a) * r;
          fade = smooth(0, 0.15, v) * (1 - smooth(0.7, 1, v));
          grow = 0.7 + v * 0.6;
        }

        // Scattered: arc out in a splash, then fall as rain through a band
        // that wraps, fading in at the top and out at the bottom.
        const fp = (rain[k + 1]! + t * P.fall[i]!) % 1;
        const x = bx + (rain[k]! - bx) * morph;
        const y = by + (RAIN_TOP - fp * RAIN_SPAN - by) * morph + P.arc[i]! * splash;
        const z = bz + (rain[k + 2]! - bz) * morph;
        fade *= 1 - raining * (1 - smooth(0, 0.06, fp) * (1 - smooth(0.94, 1, fp)));
        if (fade < 0.01) {
          proj[k + 2] = -99;
          continue;
        }

        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const depth = CAM_Z - z2;
        if (depth < 0.2) {
          proj[k + 2] = -99;
          continue;
        }
        const sx = (cx + (x1 * FOCAL * scale) / depth) * dpr;
        const sy = (cy - (y2 * FOCAL * scale) / depth) * dpr;
        proj[k] = sx / dpr;
        proj[k + 1] = sy / dpr;
        proj[k + 2] = z2;

        const front = clamp01((z2 + 1.1) / 2.2);
        let alpha = (0.14 + 0.86 * Math.pow(front, 1.6)) * dim * fade;
        // Cap perspective growth so scattered points near the camera don't balloon.
        let size = P.size[i]! * grow * Math.min(CAM_Z / depth, 1.8) * (1 + morph * 0.4);
        let img = onSurface ? sprites.drops[P.tint[i]!]! : sprites.bubbles[P.tint[i]! >> 1]!;

        if (onSurface && shape > 0.05) {
          const nx = normal[k]!;
          const ny = normal[k + 1]!;
          const nz = normal[k + 2]!;
          const n1x = nx * cosY - nz * sinY;
          const n1z = nx * sinY + nz * cosY;
          const n2y = ny * cosX - n1z * sinX;
          const n2z = ny * sinX + n1z * cosX;
          // Glassy shading: a bright rim, a glint up-left, a caustic low on the far side.
          const rim = Math.pow(1 - Math.abs(n2z), 3);
          const glint = Math.pow(Math.max(0, n1x * GLINT[0] + n2y * GLINT[1] + n2z * GLINT[2]), 24);
          const caustic = Math.pow(
            Math.max(0, n1x * CAUSTIC[0] + n2y * CAUSTIC[1] + n2z * CAUSTIC[2]),
            6,
          );
          alpha = Math.min(1, alpha + (rim * 0.3 + glint + caustic * 0.6 + band * 0.7) * shape);
          size *= 1 + (glint * 0.7 + band * 0.5) * shape;
          if (glint * shape > 0.3) img = sprites.drops[glintSprite]!;
          else if (caustic * shape > 0.45) img = sprites.drops[2]!;
        }

        const dx = sx - px;
        const dy = sy - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < pr * pr) {
          const boost = Math.pow(1 - Math.sqrt(d2) / pr, 2);
          alpha = Math.min(1, alpha + boost * 0.9);
          size *= 1 + boost * 1.4;
        }
        if (highlighted.has(i)) {
          alpha = 1;
          size *= 2.2;
        }

        const d = size * 9 * dpr;
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, sx - d / 2, sy - d / 2, d, d);
      }

      // A small drop falls into the tip every few seconds; landing starts the ripple.
      if (!reduce) {
        const f = (now - feedAt) / FEED_FALL;
        if (f >= 1) {
          rippleAt = feedAt + FEED_FALL;
          feedAt = Math.max(feedAt + FEED_EVERY, now + 600);
        } else if (f > 0 && shape > 0.95) {
          const tipY = cy - (DROP_H * cosX * FOCAL * scale) / (CAM_Z - DROP_H * sinX);
          const d = 24 * dpr;
          // The sprite's body ends ~0.26d below its centre; land that on the tip.
          const landY = tipY - (0.26 * d) / dpr;
          const y = -30 + (landY + 30) * f * f;
          ctx.globalAlpha = dim;
          ctx.drawImage(sprites.drops[glintSprite]!, cx * dpr - d / 2, y * dpr - d / 2, d, d);
        }
      }
      ctx.globalAlpha = 1;

      // Pin annotation markers/cards to their particles.
      const fade = 1 - smooth(0.05, 0.35, progressRef.current);
      for (const a of activeRef.current) {
        const marker = markerRefs.current.get(a.key);
        const card = cardRefs.current.get(a.key);
        if (!marker || !card) continue;
        const k = a.particle * 3;
        const age = now - a.born;
        const env = Math.min(1, age / 600, (ANNOTATION_LIFE - age) / 900);
        const facing = clamp01((proj[k + 2]! - 0.05) / 0.35);
        const o = Math.max(0, env) * facing * fade;
        const mx = proj[k]!;
        const my = proj[k + 1]!;
        const right = mx >= cx;
        const lx = right ? mx + 28 : mx - 28 - CARD_W;
        marker.style.transform = `translate3d(${mx - 14}px, ${my - 14}px, 0)`;
        marker.style.opacity = String(o);
        card.style.transform = `translate3d(${lx}px, ${my - CARD_H / 2 + (1 - Math.min(1, age / 600)) * 10}px, 0)`;
        card.style.opacity = String(o);
      }

      raf = visible && !reduce ? requestAnimationFrame(draw) : 0;
    };

    const pickParticle = (taken: ActiveAnnotation[]): number | null => {
      const { cx } = layout();
      const avoid = avoidRef?.current?.getBoundingClientRect();
      const box = canvas.getBoundingClientRect();
      const avoidRight = avoid ? avoid.right - box.left + 24 : -1;
      for (let attempt = 0; attempt < 60; attempt++) {
        // Surface droplets only: bubbles drift and fade out.
        const i = Math.floor(Math.random() * P.surface);
        const k = i * 3;
        const sx = proj[k]!;
        const sy = proj[k + 1]!;
        if (proj[k + 2]! < 0.45) continue;
        const right = sx >= cx;
        const left = right ? sx + 28 : sx - 28 - CARD_W;
        if (left < 16 || left + CARD_W > w - 16) continue;
        if (sy - CARD_H / 2 < 24 || sy + CARD_H / 2 > h - 110) continue;
        if (left < avoidRight) continue;
        const clash = taken.some((o) => {
          const ok = o.particle * 3;
          return Math.abs(proj[ok]! - sx) < 60 && Math.abs(proj[ok + 1]! - sy) < CARD_H + 24;
        });
        if (clash) continue;
        return i;
      }
      return null;
    };

    const spawn = () => {
      const now = performance.now();
      const alive = activeRef.current.filter((a) => now - a.born < ANNOTATION_LIFE);
      const canAdd =
        wide.matches &&
        visible &&
        progressRef.current <= 0.15 &&
        alive.length < MAX_ANNOTATIONS &&
        annotations.length > 0;
      const particle = canAdd ? pickParticle(alive) : null;
      if (particle === null) {
        if (alive.length !== activeRef.current.length) setActive(alive);
        return;
      }
      const used = new Set(alive.map((a) => a.focus));
      const free = annotations.map((_, i) => i).filter((i) => !used.has(i));
      const focus = free[Math.floor(Math.random() * free.length)];
      if (focus === undefined) return;
      setActive([...alive, { key: keySeq++, focus, particle, born: now }]);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.nx = clamp01(pointer.x / Math.max(1, w));
      pointer.ny = clamp01(pointer.y / Math.max(1, h));
    };
    const onLeave = () => {
      pointer.x = pointer.y = -1e5;
      pointer.nx = pointer.ny = 0.5;
    };

    const themeWatch = new MutationObserver(() => {
      dark = root.classList.contains('dark');
      sprites = makeSprites(dark);
      if (reduce) requestAnimationFrame(draw);
    });
    themeWatch.observe(root, { attributes: true, attributeFilter: ['class'] });

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) requestAnimationFrame(draw);
    });
    ro.observe(canvas);

    if (reduce) {
      requestAnimationFrame(draw);
      return () => {
        ro.disconnect();
        themeWatch.disconnect();
      };
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(canvas);
    const timer = window.setInterval(spawn, ANNOTATION_EVERY);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      io.disconnect();
      ro.disconnect();
      themeWatch.disconnect();
      window.clearInterval(timer);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [annotations, avoidRef, progressRef]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {active.map((a) => {
        const color = ANNOTATION_COLORS[a.focus % ANNOTATION_COLORS.length];
        const item = annotations[a.focus];
        if (!item) return null;
        return (
          <div key={a.key}>
            <div
              ref={(el) => {
                if (el) markerRefs.current.set(a.key, el);
                else markerRefs.current.delete(a.key);
              }}
              className="absolute left-0 top-0 h-7 w-7 rounded-full border-[3px] border-cg-fg"
              style={{
                opacity: 0,
                backgroundColor: `rgb(${color} / 0.25)`,
                boxShadow: `0 0 18px 8px rgb(${color} / 0.18)`,
                willChange: 'transform, opacity',
              }}
            />
            <div
              ref={(el) => {
                if (el) cardRefs.current.set(a.key, el);
                else cardRefs.current.delete(a.key);
              }}
              className="absolute left-0 top-0 rounded-2xl bg-cg-canvas/85 px-4 py-3.5 backdrop-blur-md"
              style={{ width: CARD_W, opacity: 0, willChange: 'transform, opacity' }}
            >
              <div className="type-caption font-semibold" style={{ color: `rgb(${color})` }}>
                {item.title}
              </div>
              <p className="mt-0.5 text-[15px] leading-snug text-cg-fg">{item.stat}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
