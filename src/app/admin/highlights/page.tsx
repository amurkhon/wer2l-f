import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { highlightsApi } from '@/lib/api/highlights';
import { HighlightsTable } from '@/components/admin/HighlightsTable';

export const metadata: Metadata = {
  title: 'Highlights — Admin',
  robots: { index: false },
};

export default async function AdminHighlightsPage() {
  const highlights = await highlightsApi.list({}).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Highlights</h1>
          <p className="mt-1 text-sm text-muted-foreground">{highlights.length} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/highlights/new">
            <Plus className="h-4 w-4" />
            Add Highlight
          </Link>
        </Button>
      </div>

      <HighlightsTable highlights={highlights} />
    </div>
  );
}
