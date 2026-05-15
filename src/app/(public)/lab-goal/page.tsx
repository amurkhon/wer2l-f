import type { Metadata } from 'next';
import Image from 'next/image';
import { Target, Compass, Droplets, Recycle, FlaskConical, Leaf } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Lab Goal & Directions',
  description: `The mission, goals, and research directions of the ${siteConfig.name}.`,
};

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
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 text-white">
        <Image
          src="/images/Image 3.png"
          alt="Laboratory"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-lab-900/75" />
        <div className="container relative mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-lab-300">
            WER<sup className="text-xs">2</sup>L
          </p>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">Lab Goal & Directions</h1>
          <p className="mt-4 text-lg text-lab-200">
            Advancing sustainable solutions at the intersection of water, environment, and resource recovery.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-bold">Our Mission</h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
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
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t" />

      {/* Research Directions */}
      <section className="bg-muted/20 px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-serif text-3xl font-bold">Research Directions</h2>
            <p className="mt-2 text-muted-foreground">
              Six interconnected focus areas that define our scientific and engineering agenda.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {directions.map((dir) => (
              <div
                key={dir.title}
                className="rounded-xl border bg-background p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                  <dir.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-serif font-semibold">{dir.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {dir.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-bold">Core Values</h2>
          <dl className="mt-8 space-y-6">
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
            ].map((item) => (
              <div key={item.term} className="border-l-4 border-primary pl-5">
                <dt className="font-serif font-semibold">{item.term}</dt>
                <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
