import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Heart } from 'lucide-react';
import type { Work, AuthorshipWithMember } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
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

  return (
    <Link href={`/works/${work._id}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="aspect-video overflow-hidden bg-muted">
          {work.coverImage ? (
            <Image
              src={work.coverImage}
              alt={work.title}
              width={600}
              height={338}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <Badge variant="default" className="text-xs">
              {WORK_TYPE_LABELS[work.type] ?? work.type}
            </Badge>
            {categoryName && (
              <Badge variant="outline" className="text-xs">
                {categoryName}
              </Badge>
            )}
          </div>

          <h3 className="font-serif font-semibold leading-snug line-clamp-2">{work.title}</h3>

          {authors.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {displayedAuthors.map((a) => a.member.fullName).join(', ')}
              {remaining > 0 && ` and ${remaining} more`}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            {work.completionDate ? (
              <span>{formatDate(work.completionDate, 'yyyy')}</span>
            ) : (
              <span className="capitalize">{work.status.replace('_', ' ')}</span>
            )}
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {work.likeCount}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
