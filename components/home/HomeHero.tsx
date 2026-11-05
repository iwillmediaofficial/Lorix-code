'use client';

import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { Scene3D } from '@/components/three/Scene3D';
import { Render } from '@/components/Render';
import { Chevron } from '@/components/icons';

gsap.registerPlugin(SplitText, useGSAP);

export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create('[data-hero-title]', { type: 'lines,words', mask: 'lines', wordsClass: 'split-word' });
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.from(split.words, { yPercent: 110, duration: 1.1, stagger: 0.04 })
          .from('[data-hero-fade]', { opacity: 0, y: 24, duration: 0.9, stagger: 0.1 }, '-=0.7')
          .from('[data-hero-visual]', { opacity: 0, scale: 0.94, duration: 1.4 }, 0.2);
        gsap.to('[data-hero-visual]', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="on-dark relative overflow-hidden bg-navy-900 text-white">
      <div className="pattern-x pattern-drift absolute inset-0" aria-hidden="true" />
      <div className="absolute -right-32 top-10 h-[40rem] w-[40rem] rounded-full bg-blue-500/30 blur-[140px]" aria-hidden="true" />
      <div className="absolute -left-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-green-400/15 blur-[120px]" aria-hidden="true" />
      <div className="container-x relative grid min-h-[100svh] items-center gap-6 pb-16 pt-28 lg:grid-cols-[1.05fr_1fr] lg:pb-10 lg:pt-24">
        <div className="relative z-10">
          <p className="eyebrow text-green-400" data-hero-fade>Residential energy storage · India</p>
          <h1 className="text-display mt-5 text-white" data-hero-title>
            The Future Is More <span className="gradient-text">Energy Intelligent.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/75 lg:text-xl" data-hero-fade>
            LFP battery storage and hybrid solar inverters that keep Indian homes powered, day and night, outage or not.
          </p>
          <div className="mt-9 flex flex-wrap gap-3" data-hero-fade>
            <Link href="/products" className="btn btn-gradient">Explore products <Chevron /></Link>
            <Link href="/contact?type=partner" className="btn btn-outline text-white">Become a partner</Link>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6" data-hero-fade>
            <div><dt className="text-xs text-white/60">Cycle life</dt><dd className="text-2xl font-extrabold">6000+</dd></div>
            <div><dt className="text-xs text-white/60">Warranty</dt><dd className="text-2xl font-extrabold">10 yrs</dd></div>
            <div><dt className="text-xs text-white/60">Service reply</dt><dd className="text-2xl font-extrabold">24 h</dd></div>
          </dl>
        </div>
        <div data-hero-visual className="relative -mx-4 aspect-square w-[calc(100%+2rem)] max-w-[44rem] justify-self-center sm:mx-0 sm:w-full">
          <Scene3D
            variant="battery"
            particles
            interactive
            label="LORIX LFP home battery with solar energy flowing into it"
            className="h-full w-full"
            fallback={<Render name="battery" alt="" priority />}
          />
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-xs font-semibold tracking-[0.2em] text-white/50 lg:block" aria-hidden="true">SCROLL</div>
    </section>
  );
}
