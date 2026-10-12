import Link from 'next/link';
import { BookOpen, ArrowRight, Heart } from 'lucide-react';
import { MatteFrame } from '@/components/shared/MatteFrame';
import type { Work, AuthorshipWithMember } from '@/types';
import { WORK_TYPE_LABELS, formatDate } from '@/lib/utils';

interface WorkCardProps {
  work: Work;
  authors?: AuthorshipWithMember[];
  categoryName?: string;
}

export function WorkCard({ work, authors = [], categoryName }: WorkCardProps) {
  const displayedAuthors = authors.slice(0, 3);
  const remaining = authors.length - 3;
  const year = work.completionDate ? formatDate(work.completionDate, 'yyyy') : undefined;

  return (
    <Link href={`/works/${work._id}`} className="group block h-full">
      <article className="card-cg card-cg-lift card-cg-hover flex h-full flex-col p-3">
        {/* Cover — contained, never cropped: graphical abstracts carry text/diagrams edge to edge */}
        <MatteFrame
          src={work.coverImage}
          alt={work.title}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="press-tile"
          windowClassName="aspect-video bg-white"
          imageClassName="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          fallback={
            <div className="absolute inset-0 bg-cg-raised bg-[radial-gradient(110%_90%_at_85%_0%,rgb(135_42_254/.55),transparent_60%),radial-gradient(90%_80%_at_0%_100%,rgb(255_81_1/.4),transparent_60%)]">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[length:26px_26px] transition-transform duration-[600ms] group-hover:scale-110" />
              <BookOpen className="absolute left-5 top-5 h-9 w-9 text-white/50" />
            </div>
          }
        />

        {/* Body */}
        <div className="flex flex-1 flex-col px-2.5 pb-2 pt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="type-overline text-cg-hero">{WORK_TYPE_LABELS[work.type] ?? work.type}</span>
            {year && (
              <span className="font-display text-[26px] font-semibold leading-none text-cg-fg3">{year}</span>
            )}
          </div>
          {categoryName && <span className="tag-cg mb-3 w-fit">{categoryName}</span>}
          <h3 className="text-[18px] font-semibold leading-[1.35] text-cg-fg">{work.title}</h3>

          {authors.length > 0 && (
            <p className="mt-3 text-sm leading-relaxed text-cg-fg2">
              {displayedAuthors.map((a) => a.member.fullName).join(', ')}
              {remaining > 0 && ` and ${remaining} more`}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between pt-5">
            <span className="inline-flex items-center gap-[7px] text-sm font-semibold text-cg-fg2 transition-colors group-hover:text-cg-hero">
              View work{' '}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <span className="flex items-center gap-1 text-xs text-cg-fg3">
              <Heart className="h-3.5 w-3.5" />
              {work.likeCount}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
