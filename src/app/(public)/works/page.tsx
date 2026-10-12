import type { Metadata } from 'next';
import { Suspense } from 'react';
import { WorkCard } from '@/components/public/WorkCard';
import { WorkFilters } from '@/components/public/WorkFilters';
import { Reveal } from '@/components/shared/Reveal';
import { worksApi } from '@/lib/api/works';
import { categoriesApi } from '@/lib/api/categories';
import type { WorkType, WorkStatus } from '@/types';

export const metadata: Metadata = {
  title: 'Works',
  description: 'Browse all research papers, projects, patents, and theses from our lab.',
};

export const revalidate = 60;

const PAGE_SIZE = 24;

interface WorksPageProps {
  searchParams: Promise<{
    type?: string;
    category?: string;
    status?: string;
    search?: string;
    page?: string;
    sort?: string;
  }>;
}

export default async function WorksPage({ searchParams }: WorksPageProps) {
  const params = await searchParams;
  const type = params.type as WorkType | undefined;
  const category = params.category;
  const status = (params.status as WorkStatus) || 'published';
  const search = params.search;
  const page = parseInt(params.page ?? '1', 10);

  const [worksResult, categoriesResult] = await Promise.allSettled([
    worksApi.list({ type, category, status, search }),
    categoriesApi.list(),
  ]);

  const allWorks = worksResult.status === 'fulfilled' ? worksResult.value : [];
  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : [];

  const categoryMap = Object.fromEntries(categories.map((c) => [c._id, c]));

  const start = (page - 1) * PAGE_SIZE;
  const paginatedWorks = allWorks.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(allWorks.length / PAGE_SIZE);

  return (
    <div className="mx-auto max-w-[1080px] px-6 pb-28 pt-20 md:px-10">
      <Reveal className="mb-12">
        <div className="type-overline mb-4 text-cg-hero">Research Output</div>
        <h1 className="type-title text-cg-fg">Works &amp; Publications</h1>
        <p className="type-body mt-5 max-w-[580px] text-cg-fg2">
          {allWorks.length} project{allWorks.length !== 1 ? 's' : ''} and peer-reviewed papers
          spanning hydraulics, climate adaptation and resilient infrastructure.
        </p>
      </Reveal>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="shrink-0 md:w-52">
          <Suspense>
            <WorkFilters
              categories={categories}
              type={type}
              category={category}
              status={status}
              search={search}
            />
          </Suspense>
        </aside>

        <div className="flex-1">
          {paginatedWorks.length === 0 ? (
            <div className="type-body py-20 text-center text-cg-fg2">
              No works found matching your filters.
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedWorks.map((work, i) => (
                  <Reveal key={work._id} delay={`${(i % 3) * 120}ms`} className="h-full">
                    <WorkCard
                      work={work}
                      categoryName={work.categoryId ? categoryMap[work.categoryId]?.name : undefined}
                    />
                  </Reveal>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const pageParams = new URLSearchParams(params as Record<string, string>);
                    pageParams.set('page', String(p));
                    return (
                      <a
                        key={p}
                        href={`/works?${pageParams.toString()}`}
                        aria-current={p === page ? 'page' : undefined}
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                          p === page
                            ? 'bg-cg-primary text-white'
                            : 'bg-cg-raised text-cg-fg2 hover:bg-cg-hover hover:text-cg-fg'
                        }`}
                      >
                        {p}
                      </a>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
