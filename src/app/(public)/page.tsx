import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { MemberCard } from '@/components/public/MemberCard';
import { WorkCard } from '@/components/public/WorkCard';
import { worksApi } from '@/lib/api/works';
import { membersApi } from '@/lib/api/members';
import { highlightsApi } from '@/lib/api/highlights';
import { HighlightCard } from '@/components/public/HighlightCard';
import { roleSort, SITE_NAME, SITE_TAGLINE } from '@/lib/utils';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_TAGLINE,
};

export default async function HomePage() {
  const [allWorks, featuredWorks, allMembers, papers, highlightsResult] = await Promise.allSettled([
    worksApi.list({ status: 'published' }),
    worksApi.list({ featured: true, status: 'published' }),
    membersApi.list({ status: 'active' }),
    worksApi.list({ type: 'paper', status: 'published' }),
    highlightsApi.list({ status: 'published' }),
  ]);

  const featured =
    featuredWorks.status === 'fulfilled'
      ? featuredWorks.value.slice(0, 6)
      : [];

  const members =
    allMembers.status === 'fulfilled'
      ? [...allMembers.value]
          .sort((a, b) => roleSort(a.role) - roleSort(b.role) || a.fullName.localeCompare(b.fullName))
          .slice(0, 8)
      : [];

  const recentPapers =
    papers.status === 'fulfilled'
      ? [...papers.value]
          .sort((a, b) => {
            const da = a.completionDate ? new Date(a.completionDate).getTime() : 0;
            const db = b.completionDate ? new Date(b.completionDate).getTime() : 0;
            return db - da;
          })
          .slice(0, 5)
      : [];

  const totalWorks = allWorks.status === 'fulfilled' ? allWorks.value.length : 0;
  const totalMembers = allMembers.status === 'fulfilled' ? allMembers.value.length : 0;

  const recentHighlights =
    highlightsResult.status === 'fulfilled'
      ? highlightsResult.value.slice(0, 3)
      : [];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 text-white">
        <Image
          src="/images/Image 4.png"
          alt="WER²L laboratory"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-lab-900/70" />
        <div className="container relative mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            {SITE_NAME}
          </h1>
          <p className="mt-6 text-xl text-lab-200 sm:text-2xl">{SITE_TAGLINE}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-lab-900 hover:bg-lab-50">
              <Link href="/works">Explore Our Works</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="/members">Meet the Team</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-muted/30 px-4 py-10">
        <div className="container mx-auto grid max-w-2xl grid-cols-2 gap-6 text-center">
          <div>
            <div className="font-serif text-4xl font-bold text-primary">{totalMembers}+</div>
            <div className="mt-1 text-sm text-muted-foreground">Researchers</div>
          </div>
          <div>
            <div className="font-serif text-4xl font-bold text-primary">{totalWorks}+</div>
            <div className="mt-1 text-sm text-muted-foreground">Publications & Projects</div>
          </div>
        </div>
      </section>

      {/* Research Highlights */}
      {recentHighlights.length > 0 && (
        <section className="px-4 py-16">
          <div className="container mx-auto">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-serif text-3xl font-bold">Research Highlights</h2>
                <p className="mt-1 text-muted-foreground">News, awards, and events from the lab</p>
              </div>
              <Button asChild variant="ghost">
                <Link href="/highlights" className="flex items-center gap-2">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentHighlights.map((h) => (
                <HighlightCard key={h._id} highlight={h} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Works */}
      {featured.length > 0 && (
        <section className="px-4 py-16">
          <div className="container mx-auto">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-serif text-3xl font-bold">Featured Works</h2>
                <p className="mt-1 text-muted-foreground">Selected research and projects</p>
              </div>
              <Button asChild variant="ghost">
                <Link href="/works" className="flex items-center gap-2">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((work) => (
                <WorkCard key={work._id} work={work} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Preview */}
      {members.length > 0 && (
        <section className="bg-muted/20 px-4 py-16">
          <div className="container mx-auto">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-serif text-3xl font-bold">Meet the Team</h2>
                <p className="mt-1 text-muted-foreground">Our researchers and faculty</p>
              </div>
              <Button asChild variant="ghost">
                <Link href="/members" className="flex items-center gap-2">
                  Full team <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {members.map((member) => (
                <MemberCard key={member._id} member={member} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Papers */}
      {recentPapers.length > 0 && (
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-3xl">
            <div className="mb-8">
              <h2 className="font-serif text-3xl font-bold">Recent Publications</h2>
              <p className="mt-1 text-muted-foreground">Latest research papers from the lab</p>
            </div>
            <div className="divide-y">
              {recentPapers.map((paper) => (
                <Link
                  key={paper._id}
                  href={`/works/${paper._id}`}
                  className="group flex items-start gap-4 py-5"
                >
                  <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" />
                  <div>
                    <h3 className="font-medium group-hover:text-primary">{paper.title}</h3>
                    {paper.completionDate && (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {new Date(paper.completionDate).getFullYear()}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="ml-auto mt-1 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Button asChild variant="outline">
                <Link href="/works?type=paper">View all publications</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
