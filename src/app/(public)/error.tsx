'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function PublicError({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <AlertTriangle className="h-12 w-12 text-cg-hero" />
      <h2 className="type-section text-cg-fg">Something went wrong</h2>
      <p className="type-body max-w-md text-cg-fg2">
        We couldn&apos;t load this page. Please try again or return home.
      </p>
      <div className="mt-2 flex gap-3">
        <button type="button" onClick={reset} className="btn-cg btn-cg--primary">
          Try again
        </button>
        <Link href="/" className="btn-cg btn-cg--ghost">
          Return Home
        </Link>
      </div>
    </div>
  );
}
