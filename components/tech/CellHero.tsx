'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Scene3D } from '@/components/three/Scene3D';
import { Render } from '@/components/Render';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Camera pulls back from one LFP cell to the full pack as the visitor scrolls past the hero. */
export function CellHero() {
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  useGSAP(() => {
    ScrollTrigger.create({ trigger: root.current, start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => (progress.current = s.progress) });
  }, { scope: root });
  return (
    <div ref={root} className="absolute inset-0">
      <Scene3D variant="cells" progress={progress} label="LFP prismatic cells arranged into a battery pack" className="h-full w-full" fallback={<Render name="cells" alt="" priority className="object-cover" />} />
    </div>
  );
}
