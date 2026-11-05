'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const fns = [
  { t: 'Cell voltage and temperature monitoring', x: 120, y: 90 },
  { t: 'Overcharge and over-discharge protection', x: 380, y: 70 },
  { t: 'Overcurrent and short-circuit protection', x: 520, y: 200 },
  { t: 'Cell balancing and fault monitoring', x: 300, y: 260 },
  { t: 'Battery to inverter communication', x: 90, y: 230 },
];

/** Stylised circuit board: each BMS protection function lights up in turn as the visitor scrolls. */
export function BmsBoard() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useGSAP(() => {
    ScrollTrigger.create({ trigger: root.current, start: 'top 70%', end: 'bottom 30%', onUpdate: (s) => setActive(Math.min(fns.length - 1, Math.floor(s.progress * fns.length))) });
  }, { scope: root });
  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
      <svg viewBox="0 0 640 340" className="w-full rounded-[1.75rem] bg-navy-950" role="img" aria-label="Battery management system circuit board with protection functions highlighted">
        <defs><linearGradient id="bms-g" x1="0" x2="1"><stop offset="0" stopColor="#8dd818" /><stop offset=".5" stopColor="#01bec4" /><stop offset="1" stopColor="#0076fe" /></linearGradient></defs>
        <rect x="20" y="20" width="600" height="300" rx="22" fill="#0b1a4a" stroke="#1a2d6b" />
        {[...Array(9)].map((_, i) => <path key={i} d={`M40 ${50 + i * 30} H${200 + (i % 3) * 120} V${70 + ((i * 47) % 220)} H600`} stroke="#1f3a8a" strokeWidth="2" fill="none" />)}
        <rect x="250" y="120" width="140" height="100" rx="10" fill="#08153f" stroke="url(#bms-g)" strokeWidth="2.5" />
        <text x="320" y="178" textAnchor="middle" fill="#fff" fontWeight="800" fontSize="26">BMS</text>
        {fns.map((f, i) => (
          <g key={f.t} opacity={i <= active ? 1 : 0.25} style={{ transition: 'opacity .4s' }}>
            <path d={`M320 170 L${f.x} ${f.y}`} stroke={i === active ? 'url(#bms-g)' : '#2b4bb0'} strokeWidth={i === active ? 3 : 2} className={i === active ? 'energy-dash' : ''} strokeDasharray={i === active ? '6 10' : undefined} />
            <circle cx={f.x} cy={f.y} r={i === active ? 12 : 8} fill={i === active ? '#01bec4' : '#1a2d6b'} stroke="#a5b7f3" strokeOpacity=".5" />
          </g>
        ))}
      </svg>
      <ol className="space-y-3">
        {fns.map((f, i) => (
          <li key={f.t} className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 ${i === active ? 'bg-white text-navy-900 shadow-lg' : 'text-white/60'}`}>
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${i === active ? 'bg-brand-gradient text-navy-900' : 'bg-white/10'}`}>{i + 1}</span>
            <span className="font-semibold">{f.t}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
