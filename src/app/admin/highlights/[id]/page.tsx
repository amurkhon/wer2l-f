'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HighlightForm } from '@/components/admin/HighlightForm';
import type { Highlight } from '@/types';

export default function EditHighlightPage() {
  const { id } = useParams<{ id: string }>();
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/proxy/highlights/${id}`)
      .then((r) => r.json())
      .then(setHighlight)
      .catch(() => setHighlight(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="py-16 text-center text-muted-foreground">Loading…</div>;
  }
  if (!highlight) return notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/highlights">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold">Edit Highlight</h1>
      </div>
      <HighlightForm
        highlight={highlight}
        onSubmit={async (values) => {
          const res = await fetch(`/api/proxy/highlights/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message ?? 'Failed to update highlight');
          }
        }}
      />
    </div>
  );
}
