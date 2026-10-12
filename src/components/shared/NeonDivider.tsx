'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

const VARIANTS = {
  line: { viewH: 60, d: 'M0 30 H1000', className: 'max-w-[540px]' },
  zigzag: {
    viewH: 140,
    d: 'M0 70 H330 L380 24 L440 116 L500 24 L560 116 L620 24 L670 70 H1000',
    className: 'max-w-[560px]',
  },
} as const;

interface NeonDividerProps {
  variant?: keyof typeof VARIANTS;
  className?: string;
}

/**
 * Glowing neon rule between sections: a purple → light-blue → blue tube with a
 * blurred halo and a bright pulse travelling along it. Gradients and the blur
 * use user-space units because a straight line has a zero-height bounding box.
 */
export function NeonDivider({ variant = 'line', className }: NeonDividerProps) {
  const id = useId().replace(/:/g, '');
  const { viewH, d, className: sizeClass } = VARIANTS[variant];

  return (
    <div aria-hidden className={cn('pointer-events-none flex justify-center px-6', className)}>
      <svg viewBox={`0 0 1000 ${viewH}`} className={cn('h-auto w-full overflow-visible', sizeClass)}>
        <defs>
          <linearGradient id={`neon-${id}`} gradientUnits="userSpaceOnUse" x1="0" x2="1000" y1="0" y2="0">
            <stop offset="0" stopColor="#872AFE" stopOpacity="0" />
            <stop offset="0.28" stopColor="#872AFE" />
            <stop offset="0.55" stopColor="#76ACFF" />
            <stop offset="0.82" stopColor="#2563EB" />
            <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`pulse-${id}`} gradientUnits="userSpaceOnUse" x1="0" x2="1000" y1="0" y2="0">
            <stop offset="0.12" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.3" stopColor="#fff" />
            <stop offset="0.7" stopColor="#fff" />
            <stop offset="0.88" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter
            id={`glow-${id}`}
            filterUnits="userSpaceOnUse"
            x="-40"
            y="-40"
            width="1080"
            height={viewH + 80}
          >
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <path
          d={d}
          fill="none"
          stroke={`url(#neon-${id})`}
          strokeWidth="14"
          strokeLinejoin="round"
          filter={`url(#glow-${id})`}
          opacity="0.9"
        />
        <path d={d} fill="none" stroke={`url(#neon-${id})`} strokeWidth="3" strokeLinejoin="round" />
        <path
          d={d}
          fill="none"
          stroke={`url(#pulse-${id})`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={200}
          strokeDasharray="14 186"
          className="anim-neon-travel"
        />
      </svg>
    </div>
  );
}
