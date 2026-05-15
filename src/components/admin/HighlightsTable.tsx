'use client';

import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { SafeImage } from '@/components/shared/SafeImage';
import type { Highlight } from '@/types';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/DataTable';
import { AdminHighlightsActions } from '@/components/admin/AdminHighlightsActions';
import { HIGHLIGHT_TYPE_LABELS, formatDate } from '@/lib/utils';

interface HighlightsTableProps {
  highlights: Highlight[];
}

const columns = [
  {
    key: 'title',
    header: 'Highlight',
    cell: (h: Highlight) => (
      <Link href={`/admin/highlights/${h._id}`} className="flex items-center gap-3 hover:text-primary">
        <SafeImage
          src={h.coverImage}
          alt={h.title}
          width={48}
          height={32}
          className="h-8 w-12 rounded object-cover shrink-0"
          fallback={
            <div className="flex h-8 w-12 shrink-0 items-center justify-center rounded bg-muted">
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </div>
          }
        />
        <span className="font-medium line-clamp-1">{h.title}</span>
      </Link>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    cell: (h: Highlight) => (
      <Badge variant="outline">{HIGHLIGHT_TYPE_LABELS[h.type] ?? h.type}</Badge>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (h: Highlight) => (
      <Badge variant={h.status === 'published' ? 'default' : 'secondary'}>
        {h.status === 'published' ? 'Published' : 'Draft'}
      </Badge>
    ),
  },
  {
    key: 'date',
    header: 'Published',
    cell: (h: Highlight) => (h.publishedAt ? formatDate(h.publishedAt) : '—'),
  },
  {
    key: 'actions',
    header: '',
    width: 'w-24',
    cell: (h: Highlight) => <AdminHighlightsActions highlightId={h._id} />,
  },
];

export function HighlightsTable({ highlights }: HighlightsTableProps) {
  return (
    <DataTable
      data={highlights}
      columns={columns}
      searchPlaceholder="Search highlights..."
      searchKeys={['title', 'type', 'status']}
    />
  );
}
