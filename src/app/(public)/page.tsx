import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { MemberCard } from '@/components/public/MemberCard';
import { WorkCard } from '@/components/public/WorkCard';
import { HighlightCard } from '@/components/public/HighlightCard';
import { Reveal } from '@/components/shared/Reveal';
import { Marquee } from '@/components/shared/Marquee';
import { AnimatedCounter } from '@/components/shared/AnimatedCounter';
import { worksApi } from '@/lib/api/works';
import { membersApi } from '@/lib/api/members';
import { highlightsApi } from '@/lib/api/highlights';
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
      <section className="relative -mt-16 flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 pb-[90px] pt-[120px] text-center">
        {/* Animated aurora background */}
        <div className="absolute inset-x-[-6%] bottom-0 top-[-12%] z-0">
          <div className="absolute inset-0 bg-[radial-gradient(125%_120%_at_50%_0%,#2c2e6c_0%,#1e1f4b_46%,#141537_100%)]" />
          <div className="anim-aurora-a absolute left-[-7%] top-[6%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(99,113,241,.55),transparent_68%)] blur-[46px]" />
          <div className="anim-aurora-b absolute right-[-6%] top-[18%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(64,178,214,.42),transparent_70%)] blur-[50px]" />
          <div className="anim-aurora-c absolute bottom-[-22%] left-[34%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(140,110,240,.4),transparent_70%)] blur-[54px]" />
          <div className="anim-grid-shift absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] bg-[length:64px_64px] [mask-image:radial-gradient(120%_75%_at_50%_28%,#000,transparent_82%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,16,40,.25),rgba(15,16,40,0)_32%,rgba(15,16,40,.55))]" />
        </div>

        <div className="relative z-[2] w-full max-w-[1080px]">
          <div className="anim-hero-up inline-flex items-center gap-2.5 rounded-full border border-white/[0.18] bg-white/[0.06] px-[18px] py-2 text-[12.5px] font-medium uppercase tracking-[0.16em] text-[#c7d7fe] backdrop-blur-[10px]">
            <span className="relative h-[7px] w-[7px]">
              <span className="absolute inset-0 rounded-full bg-lab-400" />
              <span className="anim-ring-pulse absolute inset-0 rounded-full bg-lab-400" />
            </span>
            Civil &amp; Environmental Engineering
          </div>
          <h1
            className="anim-hero-up mt-[26px] bg-[linear-gradient(180deg,#ffffff_30%,#aab6ff)] bg-clip-text font-serif text-[clamp(64px,11vw,150px)] font-bold leading-[0.95] tracking-[-0.035em] text-transparent"
            style={{ animationDelay: '0.08s' }}
          >
            WER²L
          </h1>
          <p
            className="anim-hero-up mx-auto mt-[22px] max-w-[680px] font-serif text-[clamp(20px,2.5vw,30px)] leading-[1.32] text-[#e9ecff]"
            style={{ animationDelay: '0.18s' }}
          >
            {SITE_TAGLINE}
          </p>
          <div
            className="anim-hero-up mt-[42px] flex flex-wrap justify-center gap-4"
            style={{ animationDelay: '0.28s' }}
          >
            <Link
              href="/works"
              className="inline-flex items-center gap-2.5 rounded-[13px] bg-white px-[30px] py-4 text-base font-semibold text-lab-950 shadow-[0_12px_36px_-10px_rgba(0,0,0,.45)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Explore Our Works <ArrowRight className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="/members"
              className="inline-flex items-center rounded-[13px] border border-white/[0.28] bg-white/[0.07] px-[30px] py-4 text-base font-semibold text-white transition-colors duration-300 hover:border-white/50 hover:bg-white/[0.14]"
            >
              Meet the Team
            </Link>
          </div>
          <div
            className="anim-hero-up mt-[34px] text-[13.5px] tracking-[0.06em] text-[#98a1d8]"
            style={{ animationDelay: '0.36s' }}
          >
            {SITE_NAME}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="anim-float-y absolute bottom-[30px] left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-[9px] text-white/55">
          <span className="text-[10.5px] uppercase tracking-[0.28em]">Scroll</span>
          <div className="flex h-[34px] w-[22px] justify-center rounded-xl border-2 border-white/40 pt-[6px]">
            <span className="anim-wheel h-[7px] w-[3px] rounded-sm bg-white/80" />
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <Marquee />

      {/* ============ STATS ============ */}
      <section className="border-b border-[#edeef7] bg-[#fafbff] px-10 py-[66px]">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-7 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={`${i * 90}ms`} className="text-center">
              <div className="flex items-baseline justify-center font-serif text-[clamp(42px,5vw,66px)] font-bold leading-none text-lab-950">
                <AnimatedCounter value={stat.value} />
              </div>
              <div className="mt-[11px] text-[15px] font-medium text-[#6b7090]">{stat.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ RESEARCH HIGHLIGHTS ============ */}
      {recentHighlights.length > 0 && (
        <section className="px-10 py-24">
          <div className="mx-auto max-w-[1200px]">
            <Reveal className="mb-[42px] flex items-end justify-between gap-6">
              <div>
                <div className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-lab-600">
                  From the Lab
                </div>
                <h2 className="font-serif text-[clamp(32px,4vw,46px)] font-bold tracking-[-0.02em] text-[#13142e]">
                  Research Highlights
                </h2>
              </div>
              <Link
                href="/highlights"
                className="inline-flex shrink-0 items-center gap-[7px] text-[15px] font-semibold text-[#6b7090] transition-colors hover:text-lab-600"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <div className="grid gap-[26px] md:grid-cols-2 lg:grid-cols-3">
              {recentHighlights.map((h, i) => (
                <Reveal key={h._id} delay={`${(i % 3) * 80}ms`} className="h-full">
                  <HighlightCard highlight={h} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ FEATURED WORKS ============ */}
      {featured.length > 0 && (
        <section className="bg-[#f5f6fc] px-10 py-24">
          <div className="mx-auto max-w-[1200px]">
            <Reveal className="mb-[42px] flex items-end justify-between gap-6">
              <div>
                <div className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-lab-600">
                  Selected Research
                </div>
                <h2 className="font-serif text-[clamp(32px,4vw,46px)] font-bold tracking-[-0.02em] text-[#13142e]">
                  Featured Works
                </h2>
              </div>
              <Link
                href="/works"
                className="inline-flex shrink-0 items-center gap-[7px] text-[15px] font-semibold text-[#6b7090] transition-colors hover:text-lab-600"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <div className="grid gap-[26px] md:grid-cols-2 lg:grid-cols-3">
              {featured.map((work, i) => (
                <Reveal key={work._id} delay={`${(i % 6) * 70}ms`} className="h-full">
                  <WorkCard work={work} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ TEAM PREVIEW ============ */}
      {members.length > 0 && (
        <section className="px-10 py-24">
          <div className="mx-auto max-w-[1200px]">
            <Reveal className="mb-[42px] flex items-end justify-between gap-6">
              <div>
                <div className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-lab-600">
                  People
                </div>
                <h2 className="font-serif text-[clamp(32px,4vw,46px)] font-bold tracking-[-0.02em] text-[#13142e]">
                  Meet the Team
                </h2>
              </div>
              <Link
                href="/members"
                className="inline-flex shrink-0 items-center gap-[7px] text-[15px] font-semibold text-[#6b7090] transition-colors hover:text-lab-600"
              >
                Full team <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
              {members.map((member, i) => (
                <Reveal key={member._id} delay={`${(i % 4) * 70}ms`} className="h-full">
                  <MemberCard member={member} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ PUBLICATIONS ============ */}
      {recentPapers.length > 0 && (
        <section className="bg-[#fafbff] px-10 py-24">
          <div className="mx-auto max-w-[840px]">
            <Reveal className="mb-[38px]">
              <div className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-lab-600">
                Recent
              </div>
              <h2 className="font-serif text-[clamp(32px,4vw,46px)] font-bold tracking-[-0.02em] text-[#13142e]">
                Publications
              </h2>
            </Reveal>
            <div>
              {recentPapers.map((paper, i) => (
                <Reveal key={paper._id} delay={`${i * 60}ms`}>
                  <Link
                    href={`/works/${paper._id}`}
                    className="group flex items-center gap-[22px] rounded-[14px] border-b border-[#e8e9f3] px-[18px] py-[22px] transition-[background,transform] duration-300 hover:translate-x-1.5 hover:bg-white"
                  >
                    <div className="w-[34px] shrink-0 font-serif text-[20px] font-bold text-[#c4c7e0]">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[16.5px] font-semibold leading-[1.4] text-[#202243]">
                        {paper.title}
                      </h3>
                      {paper.completionDate && (
                        <div className="mt-[5px] text-[13.5px] text-[#9094ad]">
                          {new Date(paper.completionDate).getFullYear()}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-[18px] w-[18px] shrink-0 text-lab-600" />
                  </Link>
                </Reveal>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/works?type=paper"
                className="inline-flex items-center gap-2 rounded-[10px] border border-[#e4e5ef] bg-white px-5 py-2.5 text-sm font-semibold text-[#54586e] transition-colors hover:border-lab-300 hover:text-lab-600"
              >
                View all publications <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============ CTA BAND ============ */}
      <section className="px-10 py-24">
        <Reveal className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[28px] bg-[radial-gradient(120%_130%_at_0%_0%,#2c2e6c,#1e1f4b_55%,#16173a)] px-12 py-[72px] text-center">
          <div className="absolute left-[-8%] top-[-30%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(99,113,241,.5),transparent_70%)] blur-[50px]" />
          <div className="absolute bottom-[-40%] right-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(64,178,214,.4),transparent_70%)] blur-[54px]" />
          <div className="relative z-[1]">
            <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em] text-white">
              Interested in collaborating?
            </h2>
            <p className="mx-auto mt-4 max-w-[540px] text-[17px] leading-[1.6] text-[#c4cbf0]">
              We partner with industry, government and universities on water and infrastructure
              resilience.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 rounded-[13px] bg-white px-[30px] py-[15px] text-base font-semibold text-lab-950 shadow-[0_12px_34px_-10px_rgba(0,0,0,.4)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Get in touch <ArrowRight className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
