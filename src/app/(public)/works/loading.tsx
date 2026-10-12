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
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card-cg p-3">
          <Skeleton className="aspect-video w-full rounded-[16px]" />
          <div className="space-y-2 px-2.5 pb-2.5 pt-5">
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
    <div className="mx-auto max-w-[1080px] px-6 pb-28 pt-20 md:px-10">
      <div className="mb-12">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-4 h-14 w-80 max-w-full" />
        <Skeleton className="mt-5 h-5 w-96 max-w-full" />
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="shrink-0 md:w-52">
          <FilterSkeleton />
        </aside>
        <div className="flex-1">
          <WorksGridSkeleton />
        </div>
      </div>
    </div>
  );
}
