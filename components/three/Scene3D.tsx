'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import type { Variant } from './ProductCanvas';

const ProductCanvas = dynamic(() => import('./ProductCanvas'), { ssr: false });

/** True when the device can comfortably run WebGL scenes. Low-end phones keep the still image. */
function canRun3D() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if ((nav.deviceMemory ?? 8) <= 2) return false;
  if ((nav.hardwareConcurrency ?? 8) <= 2) return false;
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch {
    return false;
  }
}

type Props = {
  variant: Variant;
  /** Shown first (and kept on low-end devices). The canvas fades in over it once ready. */
  fallback: ReactNode;
  progress?: MutableRefObject<number>;
  size?: number;
  particles?: boolean;
  interactive?: boolean;
  className?: string;
  label: string;
};

export function Scene3D({ variant, fallback, progress, size, particles, interactive, className = '', label }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canRun3D()) return;
    // Start loading three.js only after the page has painted and the browser is idle.
    const start = () => setEnabled(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 2000 });
    else setTimeout(start, 600);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    const onVis = () => document.hidden && setVisible(false);
    document.addEventListener('visibilitychange', onVis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  useEffect(() => {
    if (enabled && visible && !ready) {
      const t = setTimeout(() => setReady(true), 350);
      return () => clearTimeout(t);
    }
  }, [enabled, visible, ready]);

  return (
    <div ref={box} className={`relative ${className}`} role="img" aria-label={label}>
      <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-0' : 'opacity-100'}`}>{fallback}</div>
      {enabled && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <ProductCanvas variant={variant} progress={progress} size={size} particles={particles} interactive={interactive} active={visible} />
        </div>
      )}
    </div>
  );
}
