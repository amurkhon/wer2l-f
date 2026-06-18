'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { SafeImage } from '@/components/shared/SafeImage';
import type { Work, Category } from '@/types';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/DataTable';
import { AdminWorksActions } from '@/components/admin/AdminWorksActions';
import { WORK_TYPE_LABELS, WORK_STATUS_LABELS, formatDate } from '@/lib/utils';

interface WorksTableProps {
  works: Work[];
  categoryMap: Record<string, Category>;
}

export function WorksTable({ works, categoryMap }: WorksTableProps) {
  const columns = [
    {
      key: 'title',
      header: 'Work',
      cell: (w: Work) => (
        <Link href={`/admin/works/${w._id}`} className="flex items-center gap-3 hover:text-primary">
          <SafeImage
            src={w.coverImage}
            alt={w.title}
            width={48}
            height={32}
            className="h-8 w-12 rounded object-cover shrink-0"
            fallback={
              <div className="flex h-8 w-12 shrink-0 items-center justify-center rounded bg-muted">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            }
          />
          <span className="font-medium line-clamp-1">{w.title}</span>
        </Link>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (w: Work) => (
        <Badge variant="outline">{WORK_TYPE_LABELS[w.type] ?? w.type}</Badge>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      cell: (w: Work) => (w.categoryId ? categoryMap[w.categoryId]?.name : undefined) ?? '—',
    },
    {
      key: 'status',
      header: 'Status',
      cell: (w: Work) => (
        <Badge
          variant={
            w.status === 'published'
              ? 'default'
              : w.status === 'in_progress'
                ? 'secondary'
                : 'outline'
          }
        >
          {WORK_STATUS_LABELS[w.status]}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      cell: (w: Work) => (w.completionDate ? formatDate(w.completionDate) : '—'),
    },
    {
      key: 'actions',
      header: '',
      width: 'w-24',
      cell: (w: Work) => <AdminWorksActions workId={w._id} />,
    },
  ];

  return (
    <DataTable
      data={works}
      columns={columns}
      searchPlaceholder="Search works..."
      searchKeys={['title', 'type', 'status']}
    />
  );
}
