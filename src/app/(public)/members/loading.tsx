import { Skeleton } from '@/components/ui/skeleton';

function MembersGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/5] w-full rounded-[20px]" />
      ))}
    </div>
  );
}

export default function MembersLoading() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 pb-28 pt-20 md:px-10">
      <div className="mb-12">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-4 h-14 w-80 max-w-full" />
        <Skeleton className="mt-5 h-5 w-96 max-w-full" />
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="shrink-0 md:w-52">
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
