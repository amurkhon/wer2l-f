import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function WorkDetailLoading() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Skeleton className="mb-6 h-8 w-32" />

      {/* Cover image */}
      <Skeleton className="mb-8 h-72 w-full rounded-xl" />

      {/* Badges */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Title */}
      <Skeleton className="mt-4 h-10 w-full" />
      <Skeleton className="mt-2 h-10 w-3/4" />

      {/* Meta */}
      <div className="mt-4 flex gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>

      <Separator className="my-8" />

      {/* Authors */}
      <div className="mb-8">
        <Skeleton className="mb-4 h-7 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Abstract */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
}
