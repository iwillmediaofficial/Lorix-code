'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { appliances, sizeSystem } from '@/lib/sizing';
import { Chevron } from './icons';

export function SizingTool() {
  const [qty, setQty] = useState<Record<string, number>>(() => Object.fromEntries(appliances.map((a) => [a.id, a.defaultQty])));
  const [hours, setHours] = useState(4);
  const r = useMemo(() => sizeSystem(qty, hours), [qty, hours]);

  const set = (id: string, d: number) => setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(20, (q[id] ?? 0) + d)) }));

  const summary = () => {
    const items = appliances.filter((a) => qty[a.id] > 0).map((a) => `${qty[a.id]} × ${a.label}`).join(', ');
    return `System sizing request.\nAppliances: ${items}.\nBackup needed: ${hours} hours.\nEstimate: ${r.runningW} W load, ${r.energyKWh} kWh energy, suggested ${r.inverterKw ? r.inverterKw + ' kW inverter' : 'custom inverter'} and ${r.battery ? `${r.battery.count > 1 ? r.battery.count + ' × ' : ''}${r.battery.label} battery` : '—'}.`;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
      <div className="card p-6 sm:p-8">
        <h3 className="text-xl font-bold">1. What do you want to run during a power cut?</h3>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {appliances.map((a) => (
            <li key={a.id} className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors ${qty[a.id] ? 'border-blue-500/40 bg-mist-50' : 'border-line'}`}>
              <span className="min-w-0">
                <span className="block font-semibold leading-tight">{a.label}</span>
                <span className="text-xs text-slate-500">~{a.watts} W each</span>
              </span>
              <span className="flex shrink-0 items-center gap-1" role="group" aria-label={`${a.label} quantity`}>
                <button type="button" onClick={() => set(a.id, -1)} className="grid h-9 w-9 place-items-center rounded-full border border-line text-lg font-bold hover:border-blue-500" aria-label={`Remove one ${a.label}`}>−</button>
                <output className="w-7 text-center font-bold tabular-nums" aria-live="polite">{qty[a.id]}</output>
                <button type="button" onClick={() => set(a.id, 1)} className="grid h-9 w-9 place-items-center rounded-full border border-line text-lg font-bold hover:border-blue-500" aria-label={`Add one ${a.label}`}>+</button>
              </span>
            </li>
          ))}
        </ul>
        <h3 className="mt-10 text-xl font-bold">2. How many hours of backup do you need?</h3>
        <div className="mt-5 flex items-center gap-5">
          <input type="range" min={1} max={12} step={1} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="h-10 w-full cursor-pointer accent-blue-500" aria-label="Backup hours" />
          <span className="w-20 shrink-0 text-right text-2xl font-extrabold tabular-nums">{hours} h</span>
        </div>
      </div>

      <div className="on-dark sticky top-24 h-fit overflow-hidden rounded-2xl bg-navy-900 p-6 text-white sm:p-8" aria-live="polite">
        <p className="eyebrow text-green-400">Suggested system</p>
        <dl className="mt-6 grid grid-cols-2 gap-5">
          <div><dt className="text-sm text-white/60">Running load</dt><dd className="text-3xl font-extrabold tabular-nums">{r.runningW.toLocaleString('en-IN')} W</dd></div>
          <div><dt className="text-sm text-white/60">Energy needed</dt><dd className="text-3xl font-extrabold tabular-nums">{r.energyKWh} kWh</dd></div>
        </dl>
        <div className="my-6 h-px bg-white/10" />
        <dl className="space-y-5">
          <div>
            <dt className="text-sm text-white/60">Hybrid inverter</dt>
            <dd className="text-2xl font-extrabold">{r.runningW === 0 ? 'Add an appliance' : r.inverterKw ? <span className="gradient-text">{r.inverterKw} kW</span> : 'Above 10 kW: custom design'}</dd>
          </div>
          <div>
            <dt className="text-sm text-white/60">LFP battery</dt>
            <dd className="text-2xl font-extrabold">
              {r.battery ? <span className="gradient-text">{r.battery.count > 1 ? `${r.battery.count} × ` : ''}{r.battery.label}</span> : '—'}
            </dd>
          </div>
        </dl>
        <Link
          href="/contact?type=product"
          onClick={() => { try { sessionStorage.setItem('lorix-prefill', summary()); } catch {} }}
          className="btn btn-gradient mt-8 w-full"
        >
          Send this to our team <Chevron />
        </Link>
        <p className="mt-4 text-xs leading-relaxed text-white/55">
          An estimate only, based on typical appliance ratings, {90}% usable battery capacity and conversion losses. Our team confirms the final configuration after reviewing your loads and site.
        </p>
      </div>
    </div>
  );
}
