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
      <div className="type-body py-20 text-center text-cg-fg2">
        No members found matching your filters.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
      {sorted.map((member, i) => (
        <Reveal key={member._id} delay={`${(i % 3) * 120}ms`} className="h-full">
          <MemberCard member={member} />
        </Reveal>
      ))}
    </div>
  );
}

function MemberGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/5] w-full rounded-[20px]" />
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
    <div className="mx-auto max-w-[1080px] px-6 pb-28 pt-20 md:px-10">
      <Reveal className="mb-12">
        <div className="type-overline mb-4 text-cg-hero">People</div>
        <h1 className="type-title text-cg-fg">Our Researchers</h1>
        <p className="type-body mt-5 max-w-[580px] text-cg-fg2">
          Faculty, researchers and students advancing water and environmental engineering.
        </p>
      </Reveal>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="shrink-0 md:w-52">
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
