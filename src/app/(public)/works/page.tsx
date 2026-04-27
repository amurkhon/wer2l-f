import type { Metadata } from 'next';
import { Suspense } from 'react';
import { WorkCard } from '@/components/public/WorkCard';
import { WorkFilters } from '@/components/public/WorkFilters';
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
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold">Works</h1>
        <p className="mt-2 text-muted-foreground">
          {allWorks.length} publication{allWorks.length !== 1 ? 's' : ''} and projects
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="md:w-56 shrink-0">
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
            <div className="py-20 text-center text-muted-foreground">
              No works found matching your filters.
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedWorks.map((work) => (
                  <WorkCard
                    key={work._id}
                    work={work}
                    categoryName={categoryMap[work.categoryId]?.name}
                  />
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
                        className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                          p === page
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent'
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
