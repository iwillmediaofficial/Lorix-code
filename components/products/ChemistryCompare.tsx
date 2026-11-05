'use client';

import { useState } from 'react';

// General, typical characteristics of each chemistry (not LORIX product ratings).
const factors = [
  { id: 'materials', label: 'Raw materials', lfp: 'Lithium, iron, phosphate', na: 'Sodium, abundant and widely available', winner: 'na' },
  { id: 'cold', label: 'Cold performance', lfp: 'Good; charging is limited below 0 °C', na: 'Typically better capacity retention in the cold', winner: 'na' },
  { id: 'density', label: 'Energy density', lfp: 'Higher: more kWh in the same space', na: 'Lower: units are larger for the same kWh', winner: 'lfp' },
  { id: 'cycles', label: 'Cycle life', lfp: 'Proven 6000 cycles at 95% DOD (LORIX LFP)', na: 'Promising; varies by cell maker', winner: 'lfp' },
  { id: 'maturity', label: 'Market maturity', lfp: 'Mature, widely deployed in homes', na: 'Emerging, now scaling up', winner: 'lfp' },
] as const;

export function ChemistryCompare() {
  const [f, setF] = useState(0);
  const x = factors[f];
  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.6fr]">
      <div role="tablist" aria-label="Comparison factor" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
        {factors.map((k, i) => (
          <button key={k.id} role="tab" aria-selected={i === f} onClick={() => setF(i)} className={`shrink-0 rounded-xl px-5 py-4 text-left font-bold transition-colors ${i === f ? 'bg-navy-900 text-white' : 'bg-white text-navy-900 hover:bg-mist-100'}`}>
            {k.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2" aria-live="polite">
        {(['lfp', 'na'] as const).map((c) => (
          <div key={c} className={`card relative p-8 transition-all duration-500 ${x.winner === c ? 'ring-2 ring-cyan-400' : ''}`}>
            {x.winner === c && <span className="absolute right-5 top-5 rounded-full bg-green-400 px-3 py-1 text-xs font-bold text-navy-900">Advantage</span>}
            <p className="eyebrow text-blue-600">{c === 'lfp' ? 'LFP (LiFePO₄)' : 'Sodium-ion'}</p>
            <p className="mt-6 text-sm text-slate-500">{x.label}</p>
            <p className="mt-2 text-xl font-bold">{x[c]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
