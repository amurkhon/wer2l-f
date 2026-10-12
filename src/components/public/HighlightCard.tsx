import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Highlight } from '@/types';
import { HIGHLIGHT_TYPE_LABELS, formatDate } from '@/lib/utils';

// Dot colour per highlight type; the label itself stays neutral for contrast in both themes.
export const HIGHLIGHT_DOT: Record<string, string> = {
  news: 'bg-cg-accent',
  award: 'bg-cg-hero',
  publication: 'bg-cg-purple',
  event: 'bg-cg-green',
};

interface HighlightCardProps {
  highlight: Highlight;
}

export function HighlightCard({ highlight }: HighlightCardProps) {
  return (
    <Link href={`/highlights/${highlight._id}`} className="group block h-full">
      <article className="card-cg card-cg-lift card-cg-hover flex h-full flex-col p-7">
        <div className="flex items-center justify-between gap-3">
          <span className="tag-cg">
            <span className={`h-1.5 w-1.5 rounded-full ${HIGHLIGHT_DOT[highlight.type] ?? 'bg-cg-accent'}`} />
            {HIGHLIGHT_TYPE_LABELS[highlight.type] ?? highlight.type}
          </span>
          <span className="type-caption text-cg-fg3">
            {formatDate(highlight.publishedAt ?? highlight.createdAt)}
          </span>
        </div>
        <h3 className="mt-5 font-display text-[28px] font-semibold leading-[1.08] tracking-[-0.01em] text-cg-fg">
          {highlight.title}
        </h3>
        <p className="type-body-sm mt-3 text-cg-fg2">{highlight.summary}</p>
        <div className="mt-auto inline-flex items-center gap-[7px] pt-6 text-sm font-semibold text-cg-fg2 transition-colors group-hover:text-cg-hero">
          Read more <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </article>
    </Link>
  );
}
