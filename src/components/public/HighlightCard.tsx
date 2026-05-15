import React from 'react';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import type { Highlight } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SafeImage } from '@/components/shared/SafeImage';
import { HIGHLIGHT_TYPE_LABELS, formatDate } from '@/lib/utils';

const TYPE_VARIANT: Record<string, React.ComponentProps<typeof Badge>['variant']> = {
  news: 'default',
  award: 'warning',
  publication: 'info',
  event: 'success',
};

interface HighlightCardProps {
  highlight: Highlight;
}

export function HighlightCard({ highlight }: HighlightCardProps) {
  return (
    <Link href={`/highlights/${highlight._id}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
        <div className="aspect-video overflow-hidden bg-muted">
          <SafeImage
            src={highlight.coverImage}
            alt={highlight.title}
            width={600}
            height={338}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <Newspaper className="h-12 w-12 text-muted-foreground/30" />
              </div>
            }
          />
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant={TYPE_VARIANT[highlight.type] ?? 'secondary'}>
              {HIGHLIGHT_TYPE_LABELS[highlight.type] ?? highlight.type}
            </Badge>
            {highlight.featured && (
              <Badge variant="outline" className="text-xs">
                Featured
              </Badge>
            )}
          </div>
          <h3 className="font-serif font-semibold leading-snug line-clamp-2">{highlight.title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{highlight.summary}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            {formatDate(highlight.publishedAt ?? highlight.createdAt)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
