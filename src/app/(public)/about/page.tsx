import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { RESEARCH_FOCUS } from '@/lib/research-focus';
import { Reveal } from '@/components/shared/Reveal';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about the ${siteConfig.name}.`,
};

// Glyph tint cycles through the brand accents.
const GLYPH_TINTS = ['text-cg-hero', 'text-cg-accent', 'text-cg-purple'];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 pb-28 pt-20 md:px-10">
      <div className="max-w-[860px]">
        <Reveal>
          <div className="type-overline mb-4 text-cg-hero">About the Lab</div>
        </Reveal>
        <Reveal delay="100ms">
          <h1 className="type-title text-cg-fg">Resilient water &amp; infrastructure, by design.</h1>
        </Reveal>
        <Reveal delay="200ms">
          <p className="type-body mt-7 text-[19px] text-cg-fg/90">
            The {siteConfig.name} is dedicated to advancing the frontiers of civil engineering through
            rigorous research, innovative problem-solving, and collaboration with industry and
            government partners.
          </p>
          <p className="type-body mt-4 text-cg-fg2">
            Our team comprises professors, researchers, graduate students, and industry collaborators
            working across six major domains: structural, geotechnical, transportation, hydraulic,
            materials, and environmental engineering. We are committed to producing high-impact
            publications, developing novel engineering solutions, and training the next generation of
            civil engineers.
          </p>
        </Reveal>
      </div>

      {/* Focus areas */}
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {RESEARCH_FOCUS.map((f, i) => (
          <Reveal key={f.title} delay={`${(i % 3) * 120}ms`} className="h-full">
            <div className="card-cg card-cg-lift card-cg-hover h-full p-7">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-cg-raised text-[22px] ${GLYPH_TINTS[i % GLYPH_TINTS.length]}`}
              >
                {f.icon}
              </div>
              <h3 className="type-subheadline mt-5 text-cg-fg">{f.title}</h3>
              <p className="type-body-sm mt-2.5 text-cg-fg2">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Work with us */}
      <Reveal className="relative mt-16 overflow-hidden rounded-[2rem] bg-cg-base p-10 md:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse 55% 90% at 0% 0%, rgb(135 42 254 / calc(.35 * var(--cg-glow))), transparent 70%)',
              'radial-gradient(ellipse 45% 80% at 100% 100%, rgb(var(--cg-hero) / calc(.22 * var(--cg-glow))), transparent 70%)',
            ].join(','),
          }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-8">
          <div>
            <h2 className="type-section text-cg-fg">Work with us</h2>
            <p className="type-body mt-2 text-cg-fg2">
              {siteConfig.social.email} · Tel: 051-200-5738
            </p>
          </div>
          <Link href="/works" className="btn-cg btn-cg--lg btn-cg--primary">
            See our research <ArrowRight data-arrow className="h-[18px] w-[18px]" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
