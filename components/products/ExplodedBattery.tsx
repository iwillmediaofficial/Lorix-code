'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Scene3D } from '@/components/three/Scene3D';
import { Picture } from '@/components/Picture';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const steps = [
  { t: 'Smart BMS', d: 'Monitors every cell’s voltage and temperature, balances cells and talks to compatible inverters over RS485.' },
  { t: 'Grade A prismatic LFP cells', d: 'Sourced from CORNEX, REPT, EVE Energy and Highstar, subject to model and availability. Rated for 6000 cycles at 95% depth of discharge.' },
  { t: 'Protected enclosure', d: 'Over-voltage, under-voltage, over-current, short-circuit and temperature protection, with a touch-screen LCD on the front.' },
];

/** Scroll-scrubbed exploded view: the cover opens, cells come forward and the BMS lifts out. */
export function ExplodedBattery() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top+=80',
        end: '+=180%',
        pin: true,
        scrub: true,
        onUpdate: (st) => {
          progress.current = st.progress;
          setStep(Math.min(2, Math.floor(st.progress * 3)));
        },
      });
    });
    mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
      // Small screens: open the battery once it is in view, no pinning.
      ScrollTrigger.create({ trigger: root.current, start: 'top 60%', onEnter: () => gsap.to(progress, { current: 0.9, duration: 2, ease: 'power2.inOut' }) });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <div ref={root} className="on-dark grid items-center gap-8 overflow-hidden rounded-[1.75rem] bg-navy-900 p-6 text-white sm:p-10 lg:h-[calc(100svh-7rem)] lg:grid-cols-2 lg:p-14">
      <div className="relative aspect-square w-full lg:h-full lg:aspect-auto">
        <Scene3D variant="battery" progress={progress} label="Exploded view of a LORIX LFP battery showing the BMS, cells and enclosure" className="h-full w-full" fallback={<Picture name="battery-16kwh" alt="" cover />} />
      </div>
      <div>
        <p className="eyebrow text-green-400">Inside the battery</p>
        <h2 className="text-h2 mt-3 text-white">Reliability begins at the cell level.</h2>
        <ol className="mt-8 space-y-4">
          {steps.map((s, k) => (
            <li key={s.t} className={`rounded-2xl border p-5 transition-all duration-500 ${k === step ? 'border-cyan-400/60 bg-white/[0.07]' : 'border-white/10 opacity-60'}`}>
              <h3 className="flex items-center gap-3 text-lg font-bold text-white"><span className="gradient-text text-sm">{String(k + 1).padStart(2, '0')}</span>{s.t}</h3>
              <p className="mt-2 text-white/70">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
