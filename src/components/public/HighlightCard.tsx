import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Highlight } from '@/types';
import { HIGHLIGHT_TYPE_LABELS, formatDate } from '@/lib/utils';

const TAG_STYLES: Record<string, string> = {
  news: 'bg-lab-50 text-lab-700',
  award: 'bg-amber-50 text-amber-700',
  publication: 'bg-sky-50 text-sky-700',
  event: 'bg-violet-50 text-violet-700',
};

interface HighlightCardProps {
  highlight: Highlight;
}

export function HighlightCard({ highlight }: HighlightCardProps) {
  const tagStyle = TAG_STYLES[highlight.type] ?? 'bg-lab-50 text-lab-700';

  return (
    <Link href={`/highlights/${highlight._id}`} className="group block h-full">
      <article className="flex h-full flex-col rounded-[20px] border border-[#ececf5] bg-white p-[30px] transition-[transform,box-shadow,border-color] duration-[400ms] ease-[cubic-bezier(.16,.84,.44,1)] group-hover:-translate-y-[7px] group-hover:border-[#dcdef5] group-hover:shadow-[0_28px_56px_-22px_rgba(40,36,120,.34)]">
        <span
          className={`w-fit rounded-lg px-3 py-[5px] text-[11.5px] font-bold uppercase tracking-[0.1em] ${tagStyle}`}
        >
          {HIGHLIGHT_TYPE_LABELS[highlight.type] ?? highlight.type}
        </span>
        <div className="mt-[18px] text-[13px] font-medium text-[#9094ad]">
          {formatDate(highlight.publishedAt ?? highlight.createdAt)}
        </div>
        <h3 className="mt-2 font-serif text-[21px] font-semibold leading-[1.28] text-[#191a36]">
          {highlight.title}
        </h3>
        <p className="mt-[13px] text-[14.5px] leading-[1.6] text-[#62677e]">{highlight.summary}</p>
        <div className="mt-auto inline-flex items-center gap-[7px] pt-5 text-sm font-semibold text-lab-600">
          Read more <ArrowRight className="h-4 w-4" />
        </div>
      </article>
    </Link>
  );
}
