'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { HeroDrop, type DropAnnotation } from '@/components/public/HeroDrop';
import { LaserRing } from '@/components/shared/LaserRing';
import { RESEARCH_FOCUS } from '@/lib/research-focus';

const ANNOTATIONS: DropAnnotation[] = RESEARCH_FOCUS.map(({ title, stat }) => ({ title, stat }));

interface HomeHeroProps {
  tagline: string;
  siteName: string;
}

/**
 * Home hero. On wide screens the section is taller than the viewport and its
 * stage is sticky, so the first stretch of scrolling splashes the particle
 * water drop apart into falling rain while the headline blurs away.
 */
export function HomeHero({ tagline, siteName }: HomeHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const content = contentRef.current;
    if (!section || !stage || !content) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - stage.offsetHeight);
      // Non-sticky (narrow) layouts scatter as the hero scrolls out of view.
      const span = travel > 1 ? travel : section.offsetHeight;
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const p = Math.min(1, Math.max(0, (top - rect.top) / span));
      progressRef.current = p;
      const fade = Math.min(1, Math.max(0, (p - 0.08) / 0.4));
      content.style.opacity = String(1 - fade);
      content.style.transform = `translateY(${-fade * 60}px)`;
      content.style.filter = fade > 0.01 ? `blur(${fade * 10}px)` : '';
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollPast = () => {
    const section = sectionRef.current;
    if (!section) return;
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-nav-h')) || 0;
    window.scrollTo({ top: section.offsetTop + section.offsetHeight - nav, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative lg:h-[175vh]">
      <div
        ref={stageRef}
        className="relative flex h-[calc(100svh-var(--site-nav-h,76px))] min-h-[620px] flex-col overflow-hidden lg:sticky lg:top-[var(--site-nav-h,76px)]"
      >
        {/* Glow field behind the drop: deep-blue wash, teal-aqua core */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] [--ox:50%] [--oy:40%] lg:[--ox:66%] lg:[--oy:50%]"
          style={{
            background: [
              'radial-gradient(ellipse 90% 60% at var(--ox) 30%, rgb(14 90 200 / calc(0.32 * var(--cg-glow))), transparent 70%)',
              'radial-gradient(ellipse 60% 40% at var(--ox) var(--oy), rgb(20 190 170 / calc(0.1 * var(--cg-glow))), transparent 70%)',
            ].join(','),
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] [--ox:50%] [--oy:40%] lg:[--ox:66%] lg:[--oy:50%]"
          style={{
            background: [
              'radial-gradient(ellipse 20% 34% at var(--ox) var(--oy), rgb(110 225 255 / calc(0.2 * var(--cg-glow))) 0%, rgb(20 190 170 / calc(0.1 * var(--cg-glow))) 30%, rgb(14 90 200 / calc(0.12 * var(--cg-glow))) 60%, transparent 100%)',
              'radial-gradient(ellipse 50% 45% at var(--ox) var(--oy), rgb(14 90 200 / calc(0.18 * var(--cg-glow))), transparent 65%)',
            ].join(','),
          }}
        />

        <HeroDrop progressRef={progressRef} annotations={ANNOTATIONS} avoidRef={headlineRef} />

        <div className="relative z-20 mx-auto flex w-full max-w-[1080px] flex-1 items-center px-6 md:px-10">
          <div ref={contentRef} className="mx-auto max-w-[560px] text-center lg:mx-0 lg:text-left">
            <div ref={headlineRef} className="relative">
              {/* Canvas-coloured halo keeps the copy legible over the particles */}
              <div
                aria-hidden
                className="pointer-events-none absolute -z-10"
                style={{
                  inset: '-140px -180px',
                  background:
                    'radial-gradient(ellipse 60% 55% at 50% 48%, rgb(var(--cg-canvas) / 0.75) 0%, rgb(var(--cg-canvas) / 0.4) 45%, transparent 70%)',
                }}
              />
              <div className="anim-blur-in inline-flex items-center gap-2.5 text-cg-hero type-overline">
                <span className="relative h-[7px] w-[7px]">
                  <span className="absolute inset-0 rounded-full bg-cg-hero" />
                  <span className="anim-ring-pulse absolute inset-0 rounded-full bg-cg-hero" />
                </span>
                Civil &amp; Environmental Engineering
              </div>
              <h1 className="anim-blur-in type-display mt-5 text-cg-fg" style={{ animationDelay: '0.08s' }}>
                WER²L
              </h1>
              <p
                className="anim-blur-in type-body mt-6 font-medium text-cg-fg/90 lg:max-w-[460px]"
                style={{ animationDelay: '0.18s' }}
              >
                {tagline}
              </p>
            </div>
            <div
              className="anim-blur-in mt-9 flex flex-wrap justify-center gap-3 lg:justify-start"
              style={{ animationDelay: '0.28s' }}
            >
              <Link href="/works" className="btn-cg btn-cg--lg btn-cg--primary">
                Explore Our Works <ArrowRight data-arrow className="h-[18px] w-[18px]" />
              </Link>
              <Link href="/members" className="btn-cg btn-cg--lg btn-cg--ghost">
                Meet the Team
              </Link>
            </div>
            <div className="anim-blur-in type-caption mt-7 text-cg-fg3" style={{ animationDelay: '0.36s' }}>
              {siteName}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="relative z-20 flex flex-col items-center gap-2 pb-7">
          <LaserRing aria-label="Scroll to explore" onClick={scrollPast}>
            <ChevronDown className="h-5 w-5" />
          </LaserRing>
          <span className="type-overline text-cg-fg3">Scroll</span>
        </div>
      </div>
    </section>
  );
}
