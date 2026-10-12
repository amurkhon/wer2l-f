import Image from 'next/image';

interface PageHeroProps {
  image: string;
  imageAlt: string;
  eyebrow: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
}

/**
 * Photo-backed page header: the image slowly settles in under a canvas-coloured
 * fade with a purple/blue glow, and the copy blurs into focus.
 */
export function PageHero({ image, imageAlt, eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-24 text-center md:px-10 md:pb-28 md:pt-32">
      <Image src={image} alt={imageAlt} fill priority className="anim-hero-zoom object-cover opacity-60" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 50% 55%, rgb(var(--cg-canvas) / .55), transparent 75%), linear-gradient(to bottom, rgb(var(--cg-canvas) / .82) 0%, rgb(var(--cg-canvas) / .58) 40%, rgb(var(--cg-canvas) / .7) 72%, rgb(var(--cg-canvas)) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 60% 70% at 50% 0%, rgb(135 42 254 / calc(.35 * var(--cg-glow))), transparent 70%)',
            'radial-gradient(ellipse 40% 50% at 50% 60%, rgb(var(--cg-hero) / calc(.12 * var(--cg-glow))), transparent 70%)',
          ].join(','),
        }}
      />
      <div className="relative mx-auto max-w-[760px]">
        <div className="anim-blur-in type-overline text-cg-hero">{eyebrow}</div>
        <h1 className="anim-blur-in type-title mt-4 text-cg-fg" style={{ animationDelay: '0.08s' }}>
          {title}
        </h1>
        <p className="anim-blur-in type-body mx-auto mt-5 max-w-[620px] font-medium text-cg-fg/85" style={{ animationDelay: '0.18s' }}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}
