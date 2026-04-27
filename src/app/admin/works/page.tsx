import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { worksApi } from '@/lib/api/works';
import { categoriesApi } from '@/lib/api/categories';
import { WorksTable } from '@/components/admin/WorksTable';

export const metadata: Metadata = {
  title: 'Works — Admin',
  robots: { index: false },
};

export default async function AdminWorksPage() {
  const [works, categories] = await Promise.all([
    worksApi.list({}),
    categoriesApi.list(),
  ]);

  const categoryMap = Object.fromEntries(categories.map((c) => [c._id, c]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Works</h1>
          <p className="mt-1 text-sm text-muted-foreground">{works.length} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/works/new">
            <Plus className="h-4 w-4" />
            Add Work
          </Link>
        </Button>
      </div>

      <WorksTable works={works} categoryMap={categoryMap} />
    </div>
  );
}
