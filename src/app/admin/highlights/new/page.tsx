'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HighlightForm } from '@/components/admin/HighlightForm';

export default function NewHighlightPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/highlights">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="font-serif text-3xl font-bold">Add Highlight</h1>
      </div>
      <HighlightForm
        onSubmit={async (values) => {
          const res = await fetch('/api/proxy/highlights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message ?? 'Failed to create highlight');
          }
        }}
      />
    </div>
  );
}
