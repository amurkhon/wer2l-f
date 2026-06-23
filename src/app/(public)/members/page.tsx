import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MemberCard } from '@/components/public/MemberCard';
import { membersApi } from '@/lib/api/members';
import { MemberFilters } from '@/components/public/MemberFilters';
import { Reveal } from '@/components/shared/Reveal';
import { roleSort } from '@/lib/utils';
import type { MemberRole, MemberStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Team',
  description: 'Meet the researchers and faculty of our civil engineering lab.',
};

export const revalidate = 60;

interface MembersPageProps {
  searchParams: Promise<{
    role?: string;
    status?: string;
    search?: string;
  }>;
}

async function MemberGrid({
  role,
  status,
  search,
}: {
  role?: MemberRole;
  status?: MemberStatus;
  search?: string;
}) {
  const members = await membersApi.list({ role, status, search });
  const sorted = [...members].sort(
    (a, b) =>
      roleSort(a.role) - roleSort(b.role) ||
      a.fullName.localeCompare(b.fullName),
  );

  if (sorted.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        No members found matching your filters.
      </div>
    );
  }

  return (
    <div className="grid gap-[22px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {sorted.map((member, i) => (
        <Reveal key={member._id} delay={`${(i % 4) * 70}ms`} className="h-full">
          <MemberCard member={member} />
        </Reveal>
      ))}
    </div>
  );
}

function MemberGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const params = await searchParams;
  const role = params.role as MemberRole | undefined;
  const status = params.status as MemberStatus | undefined;
  const search = params.search;

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-16 sm:px-10">
      <Reveal className="mb-10">
        <div className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-lab-600">
          People
        </div>
        <h1 className="font-serif text-[clamp(40px,5.5vw,64px)] font-bold tracking-[-0.025em] text-[#13142e]">
          Our Researchers
        </h1>
        <p className="mt-3.5 max-w-[560px] text-[18px] leading-[1.6] text-[#62677e]">
          Faculty, researchers and students advancing water and environmental engineering.
        </p>
      </Reveal>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="md:w-56 shrink-0">
          <MemberFilters role={role} status={status} search={search} />
        </aside>
        <div className="flex-1">
          <Suspense fallback={<MemberGridSkeleton />}>
            <MemberGrid role={role} status={status} search={search} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
