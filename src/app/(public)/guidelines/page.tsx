import type { Metadata } from 'next';
import Image from 'next/image';
import {
  Clock,
  CalendarDays,
  TrendingUp,
  BookOpen,
  Users,
  Quote,
} from 'lucide-react';

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
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>
          Graduate students are expected to maintain regular working hours and actively participate
          in research activities.
        </p>
        <div className="rounded-lg border bg-muted/40 px-5 py-4">
          <ul className="space-y-1.5 text-sm">
            <li>
              <span className="font-medium text-foreground">Standard working hours:</span>{' '}
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
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>
          Regular meetings are essential for monitoring research progress and maintaining research
          quality.
        </p>
        <div className="rounded-lg border bg-muted/40 px-5 py-4">
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
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>The WER²L emphasizes continuous research progress and meaningful outcomes.</p>
        <p>
          Students are generally expected to produce tangible research output approximately every
          two weeks, such as:
        </p>
        <div className="rounded-lg border bg-muted/40 px-5 py-4">
          <ul className="space-y-1.5 text-sm">
            {[
              'Experimental results',
              'Data analysis',
              'Modeling or simulation results',
              'Literature review progress',
              'Manuscript draft sections',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
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
      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <p>
          Our laboratory aims to publish research in high-quality international journals. Expected
          research goals are as follows:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Master's */}
          <div className="rounded-xl border bg-background p-5">
            <h4 className="mb-3 font-serif font-semibold text-foreground">
              Master&apos;s Students
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                'One SCI journal paper as first author',
                'One co-authored international journal paper',
              ].map((goal) => (
                <li key={goal} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
          {/* PhD */}
          <div className="rounded-xl border bg-background p-5">
            <h4 className="mb-3 font-serif font-semibold text-foreground">PhD Students</h4>
            <ul className="space-y-2 text-sm">
              {[
                'One Top 5% journal paper',
                'Two Top 10% journal papers',
              ].map((goal) => (
                <li key={goal} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
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
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>
          The laboratory is a professional and international research environment. We respect
          cultural diversity, international collaboration, and religious practices.
        </p>
        <p>
          At the same time, all students must understand that{' '}
          <span className="font-medium text-foreground">
            research responsibility and professionalism come first.
          </span>
        </p>
        <p>Students are expected to maintain:</p>
        <div className="rounded-lg border bg-muted/40 px-5 py-4">
          <ul className="space-y-1.5 text-sm">
            {[
              'Integrity and honesty in research',
              'Responsibility for assigned work',
              'Respect for colleagues and collaborators',
              'Commitment to scientific excellence',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
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
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 text-white">
        <Image
          src="/images/Image 4.png"
          alt="WER²L laboratory"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-lab-900/75" />
        <div className="container relative mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-lab-300">
            WER<sup className="text-xs">2</sup>L
          </p>
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">Student Guidelines</h1>
          <p className="mt-4 text-lg text-lab-200">
            Standards and expectations for all graduate students in the Water Environment &amp;
            Resource Recovery Lab.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="px-4 py-14">
        <div className="container mx-auto max-w-3xl">
          <p className="text-muted-foreground leading-relaxed">
            The Water Environment &amp; Resource Recovery Lab (WER<sup>2</sup>L) conducts research
            aimed at solving real-world environmental problems through innovative engineering
            technologies. Our laboratory focuses on developing practical environmental technologies
            and publishing impactful research in high-quality international journals.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            To maintain a productive, professional, and collaborative research environment, the
            following guidelines apply to all graduate students in the laboratory.
          </p>
        </div>
      </section>

      <div className="border-t" />

      {/* Sections */}
      <section className="px-4 py-14">
        <div className="container mx-auto max-w-3xl space-y-14">
          {sections.map((s) => (
            <div key={s.number} className="flex gap-6">
              {/* Number + icon column */}
              <div className="flex shrink-0 flex-col items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 w-px bg-border" />
              </div>

              {/* Content */}
              <div className="pb-6 flex-1 min-w-0">
                <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
                  {s.number}
                </div>
                <h2 className="mb-4 font-serif text-2xl font-bold">{s.title}</h2>
                {s.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t" />

      {/* Closing / Professor note */}
      <section className="bg-lab-950 px-4 py-16 text-white">
        <div className="container mx-auto max-w-2xl text-center">
          <Quote className="mx-auto mb-6 h-8 w-8 text-lab-400" />
          <blockquote className="font-serif text-xl font-medium leading-relaxed text-lab-100">
            &ldquo;Our laboratory studies technologies that are used in practice and publishes the
            knowledge generated from those technologies.&rdquo;
          </blockquote>
          <div className="mt-8 space-y-1 text-sm text-lab-300">
            <p className="font-semibold text-white">Professor Sung Hyuk</p>
            <p>Water Environment &amp; Resource Recovery Lab (WER<sup>2</sup> Lab)</p>
            <p>Department of Civil Engineering, Dong-A University</p>
          </div>
        </div>
      </section>
    </>
  );
}
