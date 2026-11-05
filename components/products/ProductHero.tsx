import Link from 'next/link';
import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/ui';
import { Chevron } from '@/components/icons';

export function ProductHero({ name, eyebrow, title, intro, visual, cta = 'Get a quotation', ctaHref = '/contact?type=product', badges }: { name: string; eyebrow: string; title: ReactNode; intro: string; visual: ReactNode; cta?: string; ctaHref?: string; badges?: string[] }) {
  return (
    <section className="on-dark relative overflow-hidden bg-navy-900 text-white">
      <div className="pattern-x pattern-drift absolute inset-0" aria-hidden="true" />
      <div className="absolute -right-40 top-0 h-[36rem] w-[36rem] rounded-full bg-blue-500/25 blur-[130px]" aria-hidden="true" />
      <div className="container-x relative grid items-center gap-8 pb-16 pt-28 lg:min-h-[88svh] lg:grid-cols-2 lg:pb-12 lg:pt-28">
        <div>
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }, { name }]} />
          <p className="eyebrow text-green-400">{eyebrow}</p>
          <h1 className="text-h1 mt-4 text-white">{title}</h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">{intro}</p>
          {badges && (
            <ul className="mt-7 flex flex-wrap gap-2 text-sm font-semibold">
              {badges.map((b) => <li key={b} className="rounded-full bg-white/10 px-3 py-1.5">{b}</li>)}
            </ul>
          )}
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={ctaHref} className="btn btn-gradient">{cta} <Chevron /></Link>
            <Link href="/products#sizing" className="btn btn-outline text-white">Size your system</Link>
          </div>
        </div>
        <div className="relative aspect-square w-full max-w-[40rem] justify-self-center">{visual}</div>
      </div>
    </section>
  );
}
