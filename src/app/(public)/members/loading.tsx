import { Skeleton } from '@/components/ui/skeleton';

function MembersGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MembersLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="mt-2 h-5 w-64" />
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="shrink-0 md:w-56">
          <div className="space-y-4">
            <Skeleton className="h-9 w-full" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-3/4" />
            ))}
          </div>
        </aside>
        <div className="flex-1">
          <MembersGridSkeleton />
        </div>
      </div>
    </div>
  );
}
