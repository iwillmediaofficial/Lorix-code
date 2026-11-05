'use client';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';

const ProductCanvas = dynamic(() => import('@/components/three/ProductCanvas'), { ssr: false });

/** Dev-only stage used by scripts/render-products.mjs to capture product stills. */
export function RenderLab() {
  const params = useSearchParams();
  const v = (params.get('v') ?? 'battery') as 'battery' | 'inverter' | 'sodium' | 'cells';
  const p = useRef(Number(params.get('p') ?? 0));
  return (
    <div style={{ width: 1200, height: 1200, background: v === 'cells' ? '#08153f' : 'transparent' }}>
      <ProductCanvas variant={v} progress={p} active particles={false} />
    </div>
  );
}
