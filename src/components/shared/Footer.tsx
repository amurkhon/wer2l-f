import Link from 'next/link';
import { siteConfig } from '@/lib/config';

const RESEARCH_AREAS = [
  'Hydraulics',
  'Flood Resilience',
  'Digital Twins',
  'Sustainable Materials',
];

export function Footer() {
  return (
    <footer className="bg-[#141537] px-6 pb-10 pt-[72px] text-[#c9ccec] sm:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-[11px]">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-lab-600 to-lab-800 font-serif text-base font-bold text-white">
              W²
            </span>
            <span className="font-serif text-[19px] font-bold text-white">WER²L</span>
          </div>
          <p className="mt-[18px] max-w-[280px] text-[14.5px] leading-[1.7] text-[#8e93c0]">
            {siteConfig.description}
          </p>
        </div>

        {/* Explore */}
        <div>
          <div className="mb-4 text-[13px] font-bold uppercase tracking-[0.1em] text-white">
            Explore
          </div>
          <nav className="flex flex-col gap-[11px]">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[14.5px] text-[#a4a8d2] transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Research */}
        <div>
          <div className="mb-4 text-[13px] font-bold uppercase tracking-[0.1em] text-white">
            Research
          </div>
          <div className="flex flex-col gap-[11px] text-[14.5px] text-[#a4a8d2]">
            {RESEARCH_AREAS.map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <div className="mb-4 text-[13px] font-bold uppercase tracking-[0.1em] text-white">
            Contact
          </div>
          <div className="flex flex-col gap-[11px] text-[14.5px] text-[#a4a8d2]">
            <a href={`mailto:${siteConfig.social.email}`} className="transition-colors hover:text-white">
              {siteConfig.social.email}
            </a>
            <span>Tel: 051-200-5738</span>
            <Link
              href="https://www.linkedin.com/company/w-e-r2-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1200px] flex-wrap justify-between gap-3 border-t border-white/[0.09] pt-[26px] text-[13.5px] text-[#7d82ad]">
        <span>© {new Date().getFullYear()} {siteConfig.shortName}. All rights reserved.</span>
        <span>Civil &amp; Environmental Engineering Laboratory</span>
      </div>
    </footer>
  );
}
