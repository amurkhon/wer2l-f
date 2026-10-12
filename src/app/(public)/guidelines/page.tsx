import type { Metadata } from 'next';
import {
  Clock,
  CalendarDays,
  TrendingUp,
  BookOpen,
  Users,
  Quote,
} from 'lucide-react';
import { PageHero } from '@/components/public/PageHero';
import { NeonDivider } from '@/components/shared/NeonDivider';
import { Reveal } from '@/components/shared/Reveal';

export const metadata: Metadata = {
  title: 'Student Guidelines',
  description:
    'WER²L graduate student guidelines covering working hours, meetings, research productivity, publication goals, and professional culture.',
};

const sections = [
  {
    number: '01',
    icon: Clock,
    title: 'Working Hours',
    content: (
      <div className="type-body-sm space-y-4 text-cg-fg2">
        <p>
          Graduate students are expected to maintain regular working hours and actively participate
          in research activities.
        </p>
        <div className="rounded-2xl bg-cg-base px-5 py-4">
          <ul className="space-y-1.5 text-sm">
            <li>
              <span className="font-medium text-cg-fg">Standard working hours:</span>{' '}
              09:00 – 18:00 (Monday – Friday)
            </li>
            <li>
              Additional research time may be required depending on experiments, deadlines, or
              project schedules.
            </li>
          </ul>
        </div>
        <p>
          Personal matters such as medical appointments or religious activities are respected.
          However, such activities must not interfere with research responsibilities, experiments,
          or scheduled meetings.
        </p>
        <p>
          If you need to leave the laboratory during working hours, please inform the professor in
          advance.
        </p>
      </div>
    ),
  },
  {
    number: '02',
    icon: CalendarDays,
    title: 'Meeting Policy',
    content: (
      <div className="type-body-sm space-y-4 text-cg-fg2">
        <p>
          Regular meetings are essential for monitoring research progress and maintaining research
          quality.
        </p>
        <div className="rounded-2xl bg-cg-base px-5 py-4">
          <ul className="space-y-1.5 text-sm">
            <li>Lab meetings and individual meetings follow a fixed schedule.</li>
            <li>Frequent changes to meeting times should be avoided.</li>
            <li>If schedule adjustments are necessary, they should be discussed in advance.</li>
          </ul>
        </div>
        <p>
          Students are expected to prepare meeting materials and clearly present their research
          progress.
        </p>
      </div>
    ),
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Research Productivity',
    content: (
      <div className="type-body-sm space-y-4 text-cg-fg2">
        <p>The WER²L emphasizes continuous research progress and meaningful outcomes.</p>
        <p>
          Students are generally expected to produce tangible research output approximately every
          two weeks, such as:
        </p>
        <div className="rounded-2xl bg-cg-base px-5 py-4">
          <ul className="space-y-1.5 text-sm">
            {[
              'Experimental results',
              'Data analysis',
              'Modeling or simulation results',
              'Literature review progress',
              'Manuscript draft sections',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cg-hero" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p>
          However, research progress does not always occur at a uniform pace. In some cases, deep
          thinking, mechanistic interpretation, or methodological development may require additional
          time. During such periods, students are expected to demonstrate clear intellectual
          progress, such as refined hypotheses, improved research design, or deeper interpretation
          of results.
        </p>
      </div>
    ),
  },
  {
    number: '04',
    icon: BookOpen,
    title: 'Publication Goals',
    content: (
      <div className="type-body-sm space-y-6 text-cg-fg2">
        <p>
          Our laboratory aims to publish research in high-quality international journals. Expected
          research goals are as follows:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Master's */}
          <div className="rounded-2xl bg-cg-base p-5">
            <h4 className="mb-3 font-semibold text-cg-fg">
              Master&apos;s Students
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                'One SCI journal paper as first author',
                'One co-authored international journal paper',
              ].map((goal) => (
                <li key={goal} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cg-hero" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
          {/* PhD */}
          <div className="rounded-2xl bg-cg-base p-5">
            <h4 className="mb-3 font-semibold text-cg-fg">PhD Students</h4>
            <ul className="space-y-2 text-sm">
              {[
                'One Top 5% journal paper',
                'Two Top 10% journal papers',
              ].map((goal) => (
                <li key={goal} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cg-hero" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm">
          These targets represent the research standards of our laboratory. Formal graduation
          requirements follow the regulations of Dong-A University.
        </p>
      </div>
    ),
  },
  {
    number: '05',
    icon: Users,
    title: 'Professional Research Culture',
    content: (
      <div className="type-body-sm space-y-4 text-cg-fg2">
        <p>
          The laboratory is a professional and international research environment. We respect
          cultural diversity, international collaboration, and religious practices.
        </p>
        <p>
          At the same time, all students must understand that{' '}
          <span className="font-medium text-cg-fg">
            research responsibility and professionalism come first.
          </span>
        </p>
        <p>Students are expected to maintain:</p>
        <div className="rounded-2xl bg-cg-base px-5 py-4">
          <ul className="space-y-1.5 text-sm">
            {[
              'Integrity and honesty in research',
              'Responsibility for assigned work',
              'Respect for colleagues and collaborators',
              'Commitment to scientific excellence',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cg-hero" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p>
          Through these principles, the WER<sup>2</sup> Lab aims to become a research group that
          consistently produces impactful research and contributes to solving global environmental
          challenges.
        </p>
      </div>
    ),
  },
];

export default function GuidelinesPage() {
  return (
    <>
      <PageHero
        image="/images/Image 4.png"
        imageAlt="WER²L laboratory"
        eyebrow={
          <>
            WER<sup className="text-[0.7em]">2</sup>L
          </>
        }
        title="Student Guidelines"
        subtitle={
          <>
            Standards and expectations for all graduate students in the Water Environment &amp;
            Resource Recovery Lab.
          </>
        }
      />

      {/* Intro */}
      <section className="px-6 py-16 md:px-10">
        <Reveal className="type-body mx-auto max-w-[760px] text-cg-fg2">
          <p>
            The Water Environment &amp; Resource Recovery Lab (WER<sup>2</sup>L) conducts research
            aimed at solving real-world environmental problems through innovative engineering
            technologies. Our laboratory focuses on developing practical environmental technologies
            and publishing impactful research in high-quality international journals.
          </p>
          <p className="mt-5">
            To maintain a productive, professional, and collaborative research environment, the
            following guidelines apply to all graduate students in the laboratory.
          </p>
        </Reveal>
      </section>

      <NeonDivider />

      {/* Sections */}
      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-[760px] space-y-14">
          {sections.map((s) => (
            <Reveal key={s.number} className="flex gap-6">
              {/* Number + icon column */}
              <div className="flex shrink-0 flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cg-raised">
                  <s.icon className="h-5 w-5 text-cg-hero" />
                </div>
                <div className="w-px flex-1 bg-gradient-to-b from-cg-hover to-transparent" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pb-6">
                <div className="type-overline mb-1 text-cg-hero">{s.number}</div>
                <h2 className="mb-5 font-display text-[clamp(30px,3.6vw,38px)] font-semibold leading-[1.05] tracking-[-0.01em] text-cg-fg">
                  {s.title}
                </h2>
                {s.content}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing / Professor note */}
      <section className="px-6 pb-28 pt-8 md:px-10">
        <Reveal className="relative mx-auto max-w-[860px] overflow-hidden rounded-[2rem] bg-cg-base px-8 pb-16 pt-14 text-center md:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 0%, rgb(135 42 254 / calc(.28 * var(--cg-glow))), transparent 70%)',
            }}
          />
          <Quote className="relative mx-auto mb-8 h-10 w-10 text-cg-hero" />
          <blockquote className="relative font-display text-[clamp(28px,3.8vw,42px)] font-semibold leading-[1.12] tracking-[-0.01em] text-cg-fg">
            &ldquo;Our laboratory studies technologies that are used in practice and publishes the
            knowledge generated from those technologies.&rdquo;
          </blockquote>
          <div className="type-body-sm relative mt-10 space-y-1 text-cg-fg2">
            <p className="font-semibold text-cg-fg">Professor Sung Hyuk</p>
            <p>Water Environment &amp; Resource Recovery Lab (WER<sup>2</sup> Lab)</p>
            <p>Department of Civil Engineering, Dong-A University</p>
          </div>
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cg-purple via-cg-accent to-cg-purple"
          />
        </Reveal>
      </section>
    </>
  );
}
