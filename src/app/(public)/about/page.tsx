import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { Reveal } from '@/components/shared/Reveal';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn about the ${siteConfig.name}.`,
};

const FOCUS = [
  {
    icon: '◇',
    title: 'Hydraulics & Hydrology',
    body: 'Physics-based and data-driven modelling of water flow, floods and sediment.',
    iconStyle: 'bg-lab-50 text-lab-700',
  },
  {
    icon: '○',
    title: 'Climate Resilience',
    body: 'Adaptation strategies and risk metrics for infrastructure under uncertainty.',
    iconStyle: 'bg-emerald-50 text-emerald-700',
  },
  {
    icon: '□',
    title: 'Sustainable Materials',
    body: 'Low-carbon concrete and durable design for long-lived structures.',
    iconStyle: 'bg-violet-50 text-violet-700',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 pb-24 pt-16 sm:px-10">
      <Reveal>
        <div className="mb-3 text-[13px] font-bold uppercase tracking-[0.16em] text-lab-600">
          About the Lab
        </div>
        <h1 className="font-serif text-[clamp(40px,5.5vw,64px)] font-bold leading-[1.05] tracking-[-0.025em] text-[#13142e]">
          Resilient water &amp; infrastructure, by design.
        </h1>
        <p className="mt-[22px] text-[19px] leading-[1.7] text-[#52566e]">
          The {siteConfig.name} is dedicated to advancing the frontiers of civil engineering through
          rigorous research, innovative problem-solving, and collaboration with industry and
          government partners.
        </p>
        <p className="mt-4 text-[17px] leading-[1.7] text-[#62677e]">
          Our team comprises professors, researchers, graduate students, and industry collaborators
          working across six major domains: structural, geotechnical, transportation, hydraulic,
          materials, and environmental engineering. We are committed to producing high-impact
          publications, developing novel engineering solutions, and training the next generation of
          civil engineers.
        </p>
      </Reveal>

      {/* Focus areas */}
      <div className="mt-[54px] grid gap-[22px] md:grid-cols-3">
        {FOCUS.map((f, i) => (
          <Reveal
            key={f.title}
            delay={`${i * 90}ms`}
            className="rounded-[20px] border border-[#ececf5] bg-white p-[30px] transition-[transform,box-shadow] duration-[400ms] hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(40,36,120,.3)]"
          >
            <div
              className={`flex h-[46px] w-[46px] items-center justify-center rounded-xl text-[22px] ${f.iconStyle}`}
            >
              {f.icon}
            </div>
            <h3 className="mt-[18px] font-serif text-[20px] font-semibold text-[#191a36]">
              {f.title}
            </h3>
            <p className="mt-2.5 text-[14.5px] leading-[1.6] text-[#62677e]">{f.body}</p>
          </Reveal>
        ))}
      </div>

      {/* Work with us */}
      <Reveal className="mt-[54px] flex flex-wrap items-center justify-between gap-[30px] rounded-[24px] bg-[radial-gradient(120%_130%_at_0%_0%,#2c2e6c,#1e1f4b_60%,#16173a)] p-12 text-white">
        <div>
          <h2 className="font-serif text-[28px] font-bold">Work with us</h2>
          <p className="mt-2.5 text-base leading-[1.6] text-[#c4cbf0]">
            {siteConfig.social.email} · Tel: 051-200-5738
          </p>
        </div>
        <Link
          href="/works"
          className="inline-flex items-center gap-2 rounded-[13px] bg-white px-7 py-[15px] text-base font-semibold text-lab-950 shadow-[0_12px_34px_-10px_rgba(0,0,0,.4)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          See our research <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
      </Reveal>
    </div>
  );
}
