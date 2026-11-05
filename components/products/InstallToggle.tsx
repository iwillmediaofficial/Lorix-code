'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

export function InstallToggle({ wall, stacked }: { wall: ReactNode; stacked: ReactNode }) {
  const [mode, setMode] = useState<'wall' | 'stacked'>('wall');
  return (
    <div>
      <div role="tablist" aria-label="Installation type" className="inline-grid grid-cols-2 gap-1 rounded-full bg-mist-100 p-1">
        {(['wall', 'stacked'] as const).map((m) => (
          <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)} className={`rounded-full px-6 py-2.5 text-sm font-bold transition-colors ${mode === m ? 'bg-navy-900 text-white' : 'text-navy-900'}`}>
            {m === 'wall' ? 'Wall-mounted' : 'Stacked / modular'}
          </button>
        ))}
      </div>
      <div className="relative mt-8 grid overflow-hidden rounded-[1.75rem]">
        <div className={`col-start-1 row-start-1 transition-all duration-700 ${mode === 'wall' ? 'opacity-100' : 'pointer-events-none scale-[1.03] opacity-0'}`}>{wall}</div>
        <div className={`col-start-1 row-start-1 transition-all duration-700 ${mode === 'stacked' ? 'opacity-100' : 'pointer-events-none scale-[1.03] opacity-0'}`}>{stacked}</div>
      </div>
    </div>
  );
}
