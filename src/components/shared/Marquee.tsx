const TOPICS = [
  'Flood Resilience',
  'Hydraulics',
  'Digital Twins',
  'Coastal Systems',
  'Sustainable Concrete',
  'Climate Adaptation',
  'Smart Water Networks',
  'Sediment Transport',
];

/**
 * Infinite horizontal marquee of research topics. The list is duplicated so
 * the -50% translate loop reads as a seamless scroll.
 */
export function Marquee() {
  const sequence = [...TOPICS, ...TOPICS];

  return (
    <div className="overflow-hidden border-y border-white/[0.06] bg-[#141537] py-[18px]">
      <div className="anim-marquee flex w-max gap-[18px] whitespace-nowrap text-[13.5px] font-semibold uppercase tracking-[0.18em] text-lab-200/50">
        {sequence.map((topic, i) => (
          <span key={i} className="flex items-center gap-[18px]">
            {topic}
            <span aria-hidden>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
