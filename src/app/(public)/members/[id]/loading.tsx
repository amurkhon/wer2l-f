import { Skeleton } from '@/components/ui/skeleton';

export default function MemberDetailLoading() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Profile header */}
      <div className="flex flex-col gap-8 md:flex-row">
        <Skeleton className="h-48 w-48 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-4">
          <div>
            <Skeleton className="h-9 w-64" />
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
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        </div>
      </div>

      {/* Works skeleton */}
      <div className="mt-16 space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border">
              <Skeleton className="aspect-video w-full" />
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
