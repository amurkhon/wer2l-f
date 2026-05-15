import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { highlightsApi } from '@/lib/api/highlights';
import { HighlightCard } from '@/components/public/HighlightCard';
import { Badge } from '@/components/ui/badge';
import { HIGHLIGHT_TYPE_LABELS } from '@/lib/utils';
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
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">Research Highlights</h1>
          <p className="mt-4 text-lg text-lab-200">
            News, awards, publications, and events from our laboratory.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="border-b bg-muted/20 px-4 py-4">
        <div className="container mx-auto flex flex-wrap gap-2">
          <Link href="/highlights">
            <Badge variant={!type ? 'default' : 'outline'} className="cursor-pointer px-3 py-1 text-sm">
              All
            </Badge>
          </Link>
          {TYPES.map((t) => (
            <Link key={t} href={`/highlights?type=${t}`}>
              <Badge
                variant={type === t ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1 text-sm"
              >
                {HIGHLIGHT_TYPE_LABELS[t]}
              </Badge>
            </Link>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 py-12">
        <div className="container mx-auto">
          {highlights.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">No highlights found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map((h) => (
                <HighlightCard key={h._id} highlight={h} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
