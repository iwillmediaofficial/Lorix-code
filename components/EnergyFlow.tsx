'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Edge = 'solar-inv' | 'inv-home' | 'inv-bat' | 'bat-inv' | 'grid-inv' | 'inv-grid';
export type FlowMode = { id: string; label: string; title: string; text: string; edges: Edge[]; gridDown?: boolean; sun?: boolean };

export const dayNightModes: FlowMode[] = [
  { id: 'day', label: 'Day', title: 'Sun powers the home and charges the battery', text: 'Your panels run the home first. Extra solar energy charges the LORIX battery, and any surplus can be exported to the grid.', edges: ['solar-inv', 'inv-home', 'inv-bat', 'inv-grid'], sun: true },
  { id: 'evening', label: 'Evening', title: 'Stored sunshine takes over', text: 'As generation drops, the battery discharges through the hybrid inverter so you keep using your own solar energy after sunset.', edges: ['bat-inv', 'inv-home'] },
  { id: 'night', label: 'Night', title: 'Grid tops up only when needed', text: 'When the battery reaches its set reserve, the inverter draws from the grid, keeping backup capacity ready for outages.', edges: ['grid-inv', 'inv-home'] },
  { id: 'outage', label: 'Power cut', title: 'Backup in under 10 ms', text: 'If the grid fails, the inverter isolates the home and the battery powers your selected essential loads without interruption.', edges: ['bat-inv', 'inv-home'], gridDown: true },
];

export const inverterModes: FlowMode[] = [
  { id: 'self', label: 'Self-use', title: 'Self-use mode', text: 'Solar first, battery second, grid last. Maximises the share of your own solar energy you actually use.', edges: ['solar-inv', 'inv-home', 'inv-bat'], sun: true },
  { id: 'backup', label: 'Backup', title: 'Backup priority mode', text: 'The battery is kept full for outages; solar and grid run the home day to day.', edges: ['solar-inv', 'grid-inv', 'inv-home', 'inv-bat'], sun: true },
  { id: 'grid', label: 'Grid-tied', title: 'Grid priority mode', text: 'Surplus solar is exported to the grid where net metering applies, while the home draws as needed.', edges: ['solar-inv', 'inv-home', 'inv-grid'], sun: true },
];

const P: Record<Edge, string> = {
  'solar-inv': 'M150 120 C150 190 230 230 300 230',
  'inv-home': 'M420 230 C500 230 560 270 560 340',
  'inv-bat': 'M330 290 C330 330 250 360 170 360',
  'bat-inv': 'M170 360 C250 360 330 330 330 290',
  'grid-inv': 'M560 120 C560 190 500 230 420 230',
  'inv-grid': 'M420 230 C500 230 560 190 560 120',
};

function Node({ x, y, label, sub, children, dim }: { x: number; y: number; label: string; sub?: string; children: React.ReactNode; dim?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={dim ? 0.35 : 1} style={{ transition: 'opacity .5s' }}>
      <circle r="44" fill="#0f2057" stroke="#a5b7f3" strokeOpacity="0.35" strokeWidth="1.5" />
      <g transform="translate(-14 -18)" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">{children}</g>
      <text y="22" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">{label}</text>
      {sub && <text y="72" textAnchor="middle" fill="#a5b7f3" fontSize="12">{sub}</text>}
    </g>
  );
}

export function EnergyFlow({ modes = dayNightModes, pinned = false, idPrefix = 'ef' }: { modes?: FlowMode[]; pinned?: boolean; idPrefix?: string }) {
  const [i, setI] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const mode = modes[i];

  useGSAP(
    () => {
      if (!pinned) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top+=80',
          end: `+=${modes.length * 70}%`,
          pin: true,
          onUpdate: (st) => setI(Math.min(modes.length - 1, Math.floor(st.progress * modes.length))),
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [pinned] },
  );

  useGSAP(
    () => {
      gsap.fromTo('[data-flow-copy]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    },
    { scope: root, dependencies: [i] },
  );

  return (
    <div ref={root} className="on-dark grid items-center gap-10 rounded-[1.75rem] bg-navy-900 p-6 text-white sm:p-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:p-14">
      <div className="relative">
        <svg viewBox="40 30 640 420" className="w-full" role="img" aria-label={`${mode.title}. ${mode.text}`}>
          <defs>
            <linearGradient id={`${idPrefix}-g`} x1="0" x2="1">
              <stop offset="0" stopColor="#8dd818" /><stop offset=".5" stopColor="#01bec4" /><stop offset="1" stopColor="#0076fe" />
            </linearGradient>
          </defs>
          {(Object.keys(P) as Edge[]).map((e) => (
            <path key={'base' + e} d={P[e]} fill="none" stroke="#a5b7f3" strokeOpacity="0.14" strokeWidth="3" />
          ))}
          {(Object.keys(P) as Edge[]).map((e) => {
            const on = mode.edges.includes(e);
            return (
              <path
                key={e}
                d={P[e]}
                fill="none"
                stroke={`url(#${idPrefix}-g)`}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="6 14"
                className="energy-dash"
                style={{ opacity: on ? 1 : 0, transition: 'opacity .45s' }}
              />
            );
          })}
          <Node x={150} y={86} label="Solar" sub="Rooftop panels" dim={!mode.sun}>
            <circle cx="14" cy="14" r="6" /><path d="M14 0v4M14 24v4M0 14h4M24 14h4M4 4l3 3M21 21l3 3M4 24l3-3M21 7l3-3" />
          </Node>
          <Node x={560} y={86} label="Grid" sub={mode.gridDown ? 'Outage' : 'Utility'} dim={mode.gridDown}>
            <path d="M14 0 8 28M14 0l6 28M9 9h10M7 18h14" />
          </Node>
          <g transform="translate(360 230)">
            <rect x="-62" y="-60" width="124" height="120" rx="18" fill="#08153f" stroke={`url(#${idPrefix}-g)`} strokeWidth="2.5" />
            <path d="M-20 -22l14 14-14 14M0 -22l14 14L0 6" stroke={`url(#${idPrefix}-g)`} strokeWidth="5" fill="none" />
            <text y="34" textAnchor="middle" fill="#fff" fontSize="12.5" fontWeight="700">Hybrid inverter</text>
          </g>
          <Node x={150} y={360} label="Battery" sub="LORIX LFP">
            <rect x="2" y="4" width="22" height="22" rx="3" /><path d="M9 0h8M8 13h10" />
          </Node>
          <Node x={560} y={360} label="Home" sub="Your loads">
            <path d="M0 12 14 1l14 11M4 10v16h20V10" />
          </Node>
          {mode.gridDown && <path d="M540 66l40 40M580 66l-40 40" stroke="#ff6b5e" strokeWidth="4" strokeLinecap="round" />}
        </svg>
      </div>
      <div>
        <div role="tablist" aria-label="Energy flow scenario" className="mb-8 flex flex-wrap gap-2">
          {modes.map((m, k) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={k === i}
              onClick={() => setI(k)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${k === i ? 'bg-white text-navy-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div data-flow-copy aria-live="polite">
          <p className="eyebrow text-green-400">{String(i + 1).padStart(2, '0')} / {String(modes.length).padStart(2, '0')}</p>
          <h3 className="text-h2 mt-3 text-white">{mode.title}</h3>
          <p className="mt-4 text-lg text-white/75">{mode.text}</p>
        </div>
        <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div className="gradient-bar h-full transition-[width] duration-500" style={{ width: `${((i + 1) / modes.length) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
