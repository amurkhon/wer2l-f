import type { Metadata } from 'next';
import { Target, Compass, Droplets, Recycle, FlaskConical, Leaf } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { PageHero } from '@/components/public/PageHero';
import { NeonDivider } from '@/components/shared/NeonDivider';
import { Reveal } from '@/components/shared/Reveal';

export const metadata: Metadata = {
  title: 'Lab Goal & Directions',
  description: `The mission, goals, and research directions of the ${siteConfig.name}.`,
};

// Icon tint cycles through the brand accents.
const ICON_TINTS = ['text-cg-hero', 'text-cg-accent', 'text-cg-purple'];

const directions = [
  {
    icon: Droplets,
    title: 'Water Quality & Treatment',
    description:
      'Developing advanced technologies for monitoring, treating, and restoring water quality in natural and engineered systems.',
  },
  {
    icon: Recycle,
    title: 'Resource Recovery',
    description:
      'Extracting value from wastewater and solid waste streams — energy, nutrients, and reusable materials — to close the resource loop.',
  },
  {
    icon: FlaskConical,
    title: 'Environmental Sensing',
    description:
      'Designing and deploying low-cost sensor networks and analytical tools for real-time environmental monitoring.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Infrastructure',
    description:
      'Integrating green engineering principles into water and wastewater infrastructure to reduce energy use and environmental footprint.',
  },
  {
    icon: Compass,
    title: 'Policy & Decision Support',
    description:
      'Translating research outcomes into practical frameworks and tools that inform environmental policy and engineering decisions.',
  },
  {
    icon: Target,
    title: 'Capacity Building',
    description:
      'Training the next generation of engineers and scientists through rigorous interdisciplinary research and mentorship.',
  },
];

export default function LabGoalPage() {
  return (
    <>
      <PageHero
        image="/images/Image 3.png"
        imageAlt="Laboratory"
        eyebrow={
          <>
            WER<sup className="text-[0.7em]">2</sup>L
          </>
        }
        title="Lab Goal & Directions"
        subtitle="Advancing sustainable solutions at the intersection of water, environment, and resource recovery."
      />

      {/* Mission */}
      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-[760px]">
          <Reveal>
            <h2 className="type-section text-cg-fg">Our Mission</h2>
          </Reveal>
          <Reveal delay="100ms" className="type-body mt-6 space-y-5 text-cg-fg2">
            <p>
              The {siteConfig.name} (WER<sup>2</sup>L) is committed to conducting transformative
              research that addresses the global challenges of water scarcity, environmental
              contamination, and sustainable resource use.
            </p>
            <p>
              We bridge fundamental science and applied engineering to develop innovative processes,
              technologies, and strategies that protect water environments and recover valuable
              resources from waste streams. Our work spans laboratory discovery, pilot-scale
              validation, and real-world implementation.
            </p>
            <p>
              Through close collaboration with industry, municipal utilities, and government agencies,
              we ensure our findings translate into tangible impact on communities and ecosystems.
            </p>
          </Reveal>
        </div>
      </section>

      <NeonDivider />

      {/* Research Directions */}
      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-12 max-w-2xl">
            <Reveal>
              <h2 className="type-section text-cg-fg">Research Directions</h2>
            </Reveal>
            <Reveal delay="100ms">
              <p className="type-body mt-3 text-cg-fg2">
                Six interconnected focus areas that define our scientific and engineering agenda.
              </p>
            </Reveal>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {directions.map((dir, i) => (
              <Reveal key={dir.title} delay={`${(i % 3) * 120}ms`} className="h-full">
                <div className="card-cg card-cg-lift card-cg-hover h-full p-7">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cg-raised">
                    <dir.icon className={`h-5 w-5 ${ICON_TINTS[i % ICON_TINTS.length]}`} />
                  </div>
                  <h3 className="type-subheadline text-cg-fg">{dir.title}</h3>
                  <p className="type-body-sm mt-2 text-cg-fg2">{dir.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-6 pb-28 pt-12 md:px-10">
        <div className="mx-auto max-w-[760px]">
          <Reveal>
            <h2 className="type-section text-cg-fg">Core Values</h2>
          </Reveal>
          <dl className="mt-10 space-y-8">
            {[
              {
                term: 'Scientific Rigor',
                definition:
                  'We uphold the highest standards of experimental design, data integrity, and peer-reviewed dissemination.',
              },
              {
                term: 'Interdisciplinary Collaboration',
                definition:
                  'Complex environmental problems require diverse expertise — we actively partner across disciplines, institutions, and sectors.',
              },
              {
                term: 'Real-World Impact',
                definition:
                  'Our research is driven by practical problems and measured by tangible improvements to environmental quality and human well-being.',
              },
              {
                term: 'Inclusive Training',
                definition:
                  'We cultivate a diverse, equitable, and supportive research environment where every member can thrive and contribute.',
              },
            ].map((item, i) => (
              <Reveal
                key={item.term}
                delay={`${i * 100}ms`}
                direction="right"
                className="border-l-2 border-cg-hero pl-6"
              >
                <dt className="type-subheadline text-cg-fg">{item.term}</dt>
                <dd className="type-body-sm mt-1.5 text-cg-fg2">{item.definition}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
