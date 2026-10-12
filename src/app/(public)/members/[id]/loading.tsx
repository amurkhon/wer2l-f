import { Skeleton } from '@/components/ui/skeleton';

export default function MemberDetailLoading() {
  return (
    <div className="mx-auto max-w-[960px] px-6 pb-28 pt-14 md:px-10">
      {/* Profile header */}
      <div className="flex flex-col gap-8 md:flex-row">
        <Skeleton className="aspect-[4/5] w-56 shrink-0 rounded-[14px]" />
        <div className="flex-1 space-y-4">
          <div>
            <Skeleton className="h-14 w-72 max-w-full" />
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>
      </div>

      {/* Works skeleton */}
      <div className="mt-16 space-y-4">
        <Skeleton className="h-12 w-56" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-cg overflow-hidden p-3">
              <Skeleton className="aspect-video w-full rounded-[16px]" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
