import Link from 'next/link';
import { BookOpen, ArrowRight, Heart } from 'lucide-react';
import { MatteFrame } from '@/components/shared/MatteFrame';
import type { Work, AuthorshipWithMember } from '@/types';
import { Badge } from '@/components/ui/badge';
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
      <article className="flex h-full flex-col rounded-[20px] border border-[#ececf5] bg-white p-3.5 transition-[transform,box-shadow,border-color] duration-[400ms] ease-[cubic-bezier(.16,.84,.44,1)] group-hover:-translate-y-2 group-hover:border-[#d6d8f5] group-hover:shadow-[0_30px_60px_-24px_rgba(40,36,120,.4)]">
        {/* Cover — contained, never cropped: graphical abstracts carry text/diagrams edge to edge */}
        <MatteFrame
          src={work.coverImage}
          alt={work.title}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          windowClassName="aspect-video bg-white"
          imageClassName="object-contain"
          fallback={
            <div className="absolute inset-0 bg-gradient-to-br from-lab-500 to-lab-800">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.13)_1px,transparent_1px)] bg-[length:26px_26px] transition-transform duration-[600ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_0%,rgba(255,255,255,.25),transparent_55%)]" />
              <BookOpen className="absolute left-5 top-5 h-9 w-9 text-white/40" />
            </div>
          }
        />

        {/* Body */}
        <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="rounded-lg bg-[#f1f2fb] px-[11px] py-1 text-[11.5px] font-bold uppercase tracking-[0.06em] text-[#3a3d66]">
              {WORK_TYPE_LABELS[work.type] ?? work.type}
            </span>
            {year && <span className="font-serif text-[22px] font-bold text-[#c3c5dc]">{year}</span>}
          </div>
          {categoryName && (
            <Badge variant="outline" className="mb-2 w-fit text-[11px]">
              {categoryName}
            </Badge>
          )}
          <h3 className="font-serif text-[20px] font-semibold leading-[1.3] text-[#191a36]">
            {work.title}
          </h3>

          {authors.length > 0 && (
            <p className="mt-3 text-sm leading-relaxed text-[#62677e]">
              {displayedAuthors.map((a) => a.member.fullName).join(', ')}
              {remaining > 0 && ` and ${remaining} more`}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between pt-5">
            <span className="inline-flex items-center gap-[7px] text-sm font-semibold text-lab-600">
              View work <ArrowRight className="h-4 w-4" />
            </span>
            <span className="flex items-center gap-1 text-xs text-[#9094ad]">
              <Heart className="h-3.5 w-3.5" />
              {work.likeCount}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
