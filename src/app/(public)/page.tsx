import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { MemberCard } from '@/components/public/MemberCard';
import { WorkCard } from '@/components/public/WorkCard';
import { HighlightCard } from '@/components/public/HighlightCard';
import { HomeHero } from '@/components/public/HomeHero';
import { Reveal } from '@/components/shared/Reveal';
import { Marquee } from '@/components/shared/Marquee';
import { NeonDivider } from '@/components/shared/NeonDivider';
import { WaveLines } from '@/components/shared/WaveLines';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { worksApi } from '@/lib/api/works';
import { membersApi } from '@/lib/api/members';
import { highlightsApi } from '@/lib/api/highlights';
import { roleSort, SITE_NAME, SITE_TAGLINE } from '@/lib/utils';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_TAGLINE,
};

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-12 text-center">
      <Reveal>
        <div className="type-overline mb-3 text-cg-hero">{eyebrow}</div>
      </Reveal>
      <Reveal delay="100ms">
        <h2 className="type-section text-cg-fg">{title}</h2>
      </Reveal>
    </div>
  );
}

function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Reveal className="mt-12 flex justify-center">
      <Link href={href} className="btn-cg btn-cg--secondary">
        {children} <ArrowRight data-arrow className="h-4 w-4" />
      </Link>
    </Reveal>
  );
}

export default async function HomePage() {
  const [allWorks, featuredWorks, allMembers, papers, highlightsResult] = await Promise.allSettled([
    worksApi.list({ status: 'published' }),
    worksApi.list({ featured: true, status: 'published' }),
    membersApi.list({ status: 'active' }),
    worksApi.list({ type: 'paper', status: 'published' }),
    highlightsApi.list({ status: 'published' }),
  ]);

  const featured = featuredWorks.status === 'fulfilled' ? featuredWorks.value.slice(0, 6) : [];

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
  const totalPapers = papers.status === 'fulfilled' ? papers.value.length : 0;
  const totalHighlights = highlightsResult.status === 'fulfilled' ? highlightsResult.value.length : 0;

  const recentHighlights =
    highlightsResult.status === 'fulfilled' ? highlightsResult.value.slice(0, 3) : [];

  const stats = [
    { value: totalMembers, label: 'Researchers' },
    { value: totalWorks, label: 'Publications & Projects' },
    { value: totalPapers, label: 'Published Papers' },
    { value: totalHighlights, label: 'Research Highlights' },
  ];

  return (
    <>
      {/* ============ HERO ============ */}
      <HomeHero tagline={SITE_TAGLINE} siteName={SITE_NAME} />

      {/* ============ MARQUEE ============ */}
      <Marquee />

      {/* ============ STATS ============ */}
      <section className="px-6 pb-12 pt-24 md:px-10">
        <div className="mx-auto grid max-w-[1080px] grid-cols-2 gap-y-12 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={`${i * 100}ms`}
              className="px-4 text-center md:border-l md:border-cg-hover md:first:border-l-0"
            >
              <div className="flex items-baseline justify-center font-display text-[clamp(56px,6.5vw,84px)] font-semibold leading-none tracking-[-0.02em] text-cg-fg">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="type-body-sm mt-3 text-cg-fg2">{stat.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <NeonDivider className="py-10" />

      {/* ============ RESEARCH HIGHLIGHTS ============ */}
      {recentHighlights.length > 0 && (
        <section className="px-6 py-20 md:px-10">
          <div className="mx-auto max-w-[1080px]">
            <SectionHeading eyebrow="From the Lab" title="Research Highlights" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentHighlights.map((h, i) => (
                <Reveal key={h._id} delay={`${(i % 3) * 120}ms`} className="h-full">
                  <HighlightCard highlight={h} />
                </Reveal>
              ))}
            </div>
            <SectionLink href="/highlights">View all</SectionLink>
          </div>
        </section>
      )}

      {/* ============ FEATURED WORKS ============ */}
      {featured.length > 0 && (
        <>
          <NeonDivider variant="zigzag" className="pt-6" />
          <section className="px-6 py-20 md:px-10">
            <div className="mx-auto max-w-[1080px]">
              <SectionHeading eyebrow="Selected Research" title="Featured Works" />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((work, i) => (
                  <Reveal key={work._id} delay={`${(i % 3) * 120}ms`} className="h-full">
                    <WorkCard work={work} />
                  </Reveal>
                ))}
              </div>
              <SectionLink href="/works">View all</SectionLink>
            </div>
          </section>
        </>
      )}

      {/* ============ TEAM PREVIEW ============ */}
      {members.length > 0 && (
        <section className="px-6 py-20 md:px-10">
          <div className="mx-auto max-w-[1080px]">
            <SectionHeading eyebrow="People" title="Meet the Team" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((member, i) => (
                <Reveal key={member._id} delay={`${(i % 4) * 100}ms`} className="h-full">
                  <MemberCard member={member} />
                </Reveal>
              ))}
            </div>
            <SectionLink href="/members">Full team</SectionLink>
          </div>
        </section>
      )}

      {/* ============ PUBLICATIONS ============ */}
      {recentPapers.length > 0 && (
        <section className="px-6 py-20 md:px-10">
          <div className="mx-auto max-w-[860px]">
            <SectionHeading eyebrow="Recent" title="Publications" />
            <div className="card-cg overflow-hidden p-2">
              {recentPapers.map((paper, i) => (
                <Reveal key={paper._id} delay={`${i * 80}ms`}>
                  <Link
                    href={`/works/${paper._id}`}
                    className="group flex items-center gap-5 rounded-2xl px-5 py-5 transition-colors duration-150 hover:bg-cg-raised"
                  >
                    <div className="w-10 shrink-0 font-display text-[26px] font-semibold leading-none text-cg-fg3 transition-colors group-hover:text-cg-hero">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[16.5px] font-semibold leading-[1.4] text-cg-fg">{paper.title}</h3>
                      {paper.completionDate && (
                        <div className="type-caption mt-1 text-cg-fg3">
                          {new Date(paper.completionDate).getFullYear()}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-[18px] w-[18px] shrink-0 text-cg-fg3 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-cg-hero" />
                  </Link>
                </Reveal>
              ))}
            </div>
            <SectionLink href="/works?type=paper">View all publications</SectionLink>
          </div>
        </section>
      )}

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden px-6 pb-52 pt-28 text-center md:px-10">
        <WaveLines startRatio={0.68} />
        <div className="relative z-10 mx-auto max-w-[640px]">
          <Reveal>
            <h2 className="type-section text-cg-fg">Interested in collaborating?</h2>
          </Reveal>
          <Reveal delay="100ms">
            <p className="type-body mx-auto mt-5 max-w-[540px] font-medium text-cg-fg2">
              We partner with industry, government and universities on water and infrastructure
              resilience.
            </p>
          </Reveal>
          <Reveal delay="200ms">
            <Link href="/about" className="btn-cg btn-cg--lg btn-cg--primary mt-10">
              Get in touch <ArrowRight data-arrow className="h-[18px] w-[18px]" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
