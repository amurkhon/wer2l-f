import { Skeleton } from '@/components/ui/skeleton';

export default function AdminWorksLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <Skeleton className="h-10 w-full max-w-sm rounded-md" />

      <div className="rounded-lg border">
        <div className="border-b p-4">
          <div className="grid grid-cols-6 gap-4">
            {['Work', 'Type', 'Category', 'Status', 'Date', ''].map((h) => (
              <Skeleton key={h} className="h-4 w-full" />
            ))}
          </div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-b p-4 last:border-0">
            <div className="grid grid-cols-6 items-center gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-12 shrink-0 rounded" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
