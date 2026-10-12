import type { Metadata } from 'next';
import Link from 'next/link';
import { highlightsApi } from '@/lib/api/highlights';
import { HighlightCard } from '@/components/public/HighlightCard';
import { PageHero } from '@/components/public/PageHero';
import { Reveal } from '@/components/shared/Reveal';
import { HIGHLIGHT_TYPE_LABELS, cn } from '@/lib/utils';
import type { HighlightType } from '@/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Research Highlights',
  description: 'News, awards, publications, and events from the WER²L laboratory.',
};

const TYPES: HighlightType[] = ['news', 'award', 'publication', 'event'];

interface Props {
  searchParams: Promise<{ type?: string }>;
}

export default async function HighlightsPage({ searchParams }: Props) {
  const { type } = await searchParams;

  const highlights = await highlightsApi
    .list({ status: 'published', ...(type ? { type: type as HighlightType } : {}) })
    .catch(() => []);

  const tabs = [
    { href: '/highlights', label: 'All', active: !type },
    ...TYPES.map((t) => ({
      href: `/highlights?type=${t}`,
      label: HIGHLIGHT_TYPE_LABELS[t] ?? t,
      active: type === t,
    })),
  ];

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
        title="Research Highlights"
        subtitle="News, awards, publications, and events from our laboratory."
      />

      {/* Filter tabs */}
      <section className="px-6 md:px-10">
        <div className="mx-auto flex max-w-[1080px] flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={tab.active ? 'page' : undefined}
              className={cn('btn-cg btn-cg--sm', tab.active ? 'btn-cg--active' : 'btn-cg--secondary')}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-28 pt-12 md:px-10">
        <div className="mx-auto max-w-[1080px]">
          {highlights.length === 0 ? (
            <p className="type-body py-16 text-center text-cg-fg2">No highlights found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map((h, i) => (
                <Reveal key={h._id} delay={`${(i % 3) * 120}ms`} className="h-full">
                  <HighlightCard highlight={h} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
