'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Scene3D } from '@/components/three/Scene3D';
import { Render } from '@/components/Render';

const caps = [
  { id: '5', label: '5 kWh', size: 0.82, model: '51.2V 100Ah', energy: '5.12 kWh', mount: 'Wall mount', homes: 'Lights, fans, TV, Wi-Fi and a fridge for an evening' },
  { id: '10', label: '10 kWh', size: 0.94, model: '51.2V 200Ah', energy: '10.24 kWh', mount: 'Wall or floor', homes: 'Essential loads overnight, or a small AC for a few hours' },
  { id: '16', label: '16 kWh', size: 1.06, model: '51.2V 314Ah', energy: '16.08 kWh', mount: 'Ground mount', homes: 'Whole-home backup including an AC through long outages' },
];

/** Hero visual plus capacity selector: switching size scales the 3D model and swaps the key facts. */
export function BatteryExplorer() {
  const [i, setI] = useState(2);
  const root = useRef<HTMLDivElement>(null);
  const c = caps[i];
  useGSAP(() => { gsap.fromTo('[data-cap-facts] > *', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.4 }); }, { scope: root, dependencies: [i] });
  return (
    <div ref={root} className="relative h-full w-full">
      <Scene3D variant="battery" size={c.size} interactive particles label={`LORIX ${c.label} LFP battery`} className="h-full w-full" fallback={<Render name="battery" alt="" priority />} />
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-navy-950/70 p-4 backdrop-blur-md">
        <div role="tablist" aria-label="Battery capacity" className="grid grid-cols-3 gap-1 rounded-full bg-white/10 p-1">
          {caps.map((x, k) => (
            <button key={x.id} role="tab" aria-selected={k === i} onClick={() => setI(k)} className={`rounded-full py-2 text-sm font-bold transition-colors ${k === i ? 'bg-white text-navy-900' : 'text-white hover:bg-white/10'}`}>{x.label}</button>
          ))}
        </div>
        <dl data-cap-facts className="mt-4 grid grid-cols-3 gap-2 text-center text-xs" aria-live="polite">
          <div><dt className="text-white/55">Model</dt><dd className="mt-1 font-bold text-white">{c.model}</dd></div>
          <div><dt className="text-white/55">Energy</dt><dd className="mt-1 font-bold text-white">{c.energy}</dd></div>
          <div><dt className="text-white/55">Install</dt><dd className="mt-1 font-bold text-white">{c.mount}</dd></div>
          <p className="col-span-3 mt-1 text-white/70">{c.homes}</p>
        </dl>
      </div>
    </div>
  );
}
