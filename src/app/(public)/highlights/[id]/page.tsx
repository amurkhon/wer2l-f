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
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-8">
        <Link href="/highlights" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Highlights
        </Link>
      </Button>

      {highlight.coverImage && (
        <div className="mb-8 overflow-hidden rounded-xl">
          <SafeImage
            src={highlight.coverImage}
            alt={highlight.title}
            width={900}
            height={450}
            className="h-64 w-full object-cover"
            fallback={null}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Badge>{HIGHLIGHT_TYPE_LABELS[highlight.type] ?? highlight.type}</Badge>
        {highlight.featured && <Badge variant="outline">Featured</Badge>}
      </div>

      <h1 className="mt-4 font-serif text-4xl font-bold leading-tight">{highlight.title}</h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {formatDate(highlight.publishedAt ?? highlight.createdAt)}
      </p>

      <p className="mt-6 text-lg font-medium text-muted-foreground">{highlight.summary}</p>

      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        {highlight.content.split('\n').map((para, i) =>
          para.trim() ? <p key={i}>{para}</p> : null,
        )}
      </div>
    </div>
  );
}
