'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive opacity-80" />
      <h2 className="font-serif text-xl font-semibold">Failed to load</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={reset} variant="destructive" size="sm">
        Try again
      </Button>
    </div>
  );
}
