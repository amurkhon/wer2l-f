const TOPICS = [
  'Water Quality',
  'Digital Twins',
  'Water Resources',
  'Sustainability',
  'Machine Learning',
  'Environmental',
];

/**
 * Infinite horizontal marquee of research topics. The list is duplicated so
 * the -50% translate loop reads as a seamless scroll; spacing lives inside each
 * item (not as a flex gap) so the seam lines up exactly.
 */
export function Marquee() {
  const sequence = [...TOPICS, ...TOPICS];

  return (
    <div className="mask-fade-x overflow-hidden border-y border-cg-fg/[0.08] py-7">
      <div className="anim-marquee flex w-max whitespace-nowrap">
        {sequence.map((topic, i) => (
          <span
            key={i}
            aria-hidden={i >= TOPICS.length || undefined}
            className="flex items-center gap-12 pr-12 font-display text-[clamp(28px,3.4vw,40px)] font-semibold leading-none tracking-[-0.01em] text-cg-fg/35 transition-colors duration-300 hover:text-cg-fg"
          >
            {topic}
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cg-hero" />
          </span>
        ))}
      </div>
    </div>
  );
}
