import { Skeleton } from '@/components/ui/skeleton';

function FilterSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-full" />
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-5 w-3/4" />
      ))}
    </div>
  );
}

function WorksGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border">
          <Skeleton className="aspect-video w-full" />
          <div className="space-y-2 p-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WorksLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="mt-2 h-5 w-48" />
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="shrink-0 md:w-56">
          <FilterSkeleton />
        </aside>
        <div className="flex-1">
          <WorksGridSkeleton />
        </div>
      </div>
    </div>
  );
}
