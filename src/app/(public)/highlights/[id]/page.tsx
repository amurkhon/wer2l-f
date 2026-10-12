import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { highlightsApi } from '@/lib/api/highlights';
import { SafeImage } from '@/components/shared/SafeImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HIGHLIGHT_TYPE_LABELS, formatDate } from '@/lib/utils';
import { ApiError } from '@/lib/api/client';

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const h = await highlightsApi.get(id);
    return { title: h.title, description: h.summary };
  } catch {
    return { title: 'Highlight' };
  }
}

export default async function HighlightDetailPage({ params }: Props) {
  const { id } = await params;

  let highlight;
  try {
    highlight = await highlightsApi.get(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <div className="mx-auto max-w-[760px] px-6 pb-28 pt-12 md:px-10">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-3 mb-8 rounded-full text-cg-fg2 hover:bg-cg-raised hover:text-cg-fg"
      >
        <Link href="/highlights" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Highlights
        </Link>
      </Button>

      {highlight.coverImage && (
        <div className="press-tile anim-blur-in mb-10 overflow-hidden rounded-[1.5rem]">
          <SafeImage
            src={highlight.coverImage}
            alt={highlight.title}
            width={900}
            height={450}
            className="h-72 w-full object-cover"
            fallback={null}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Badge>{HIGHLIGHT_TYPE_LABELS[highlight.type] ?? highlight.type}</Badge>
        {highlight.featured && <Badge variant="outline">Featured</Badge>}
      </div>

      <h1 className="mt-6 font-display text-[clamp(2.5rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-cg-fg">
        {highlight.title}
      </h1>

      <p className="type-caption mt-3 text-cg-fg3">
        {formatDate(highlight.publishedAt ?? highlight.createdAt)}
      </p>

      <p className="type-body mt-6 font-medium text-cg-fg/90">{highlight.summary}</p>

      <div className="type-body mt-8 space-y-5 text-cg-fg2">
        {highlight.content.split('\n').map((para, i) =>
          para.trim() ? <p key={i}>{para}</p> : null,
        )}
      </div>
    </div>
  );
}
