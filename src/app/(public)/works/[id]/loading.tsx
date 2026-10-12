import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function WorkDetailLoading() {
  return (
    <div className="mx-auto max-w-[860px] px-6 pb-28 pt-12 md:px-10">
      <Skeleton className="mb-8 h-8 w-36 rounded-full" />

      {/* Cover image */}
      <Skeleton className="mb-10 aspect-video w-full rounded-[16px]" />

      {/* Badges */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Title */}
      <Skeleton className="mt-6 h-12 w-full" />
      <Skeleton className="mt-2 h-12 w-3/4" />

      {/* Meta */}
      <div className="mt-4 flex gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>

      <Separator className="my-10 bg-cg-hover" />

      {/* Authors */}
      <div className="mb-8">
        <Skeleton className="mb-4 h-7 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
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
