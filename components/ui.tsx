import Link from 'next/link';
import type { ReactNode } from 'react';
import { Chevron } from './icons';

export function SectionHead({ eyebrow, title, intro, center, dark }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; center?: boolean; dark?: boolean }) {
  return (
    <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`} data-reveal>
      {eyebrow && <p className={`eyebrow ${dark ? 'text-green-400' : 'text-blue-600'}`}>{eyebrow}</p>}
      <h2 className={`text-h2 mt-3 ${dark ? 'text-white' : 'text-navy-900'}`}>{title}</h2>
      {intro && <p className={`mt-5 text-lg ${dark ? 'text-white/75' : 'text-slate-500'}`}>{intro}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro, children, aside }: { eyebrow: string; title: ReactNode; intro?: ReactNode; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="on-dark relative overflow-hidden bg-navy-900 pb-20 pt-32 text-white lg:pb-28 lg:pt-44">
      <div className="pattern-x pattern-drift absolute inset-0" aria-hidden="true" />
      <div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-blue-500/25 blur-[120px]" aria-hidden="true" />
      <div className="absolute -bottom-48 left-10 h-[26rem] w-[26rem] rounded-full bg-green-400/15 blur-[120px]" aria-hidden="true" />
      <div className={`container-x relative grid items-center gap-12 ${aside ? 'lg:grid-cols-[1.1fr_1fr]' : ''}`}>
        <div>
          <p className="eyebrow text-green-400">{eyebrow}</p>
          <h1 className="text-h1 mt-4 max-w-3xl text-white">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-lg text-white/75 lg:text-xl">{intro}</p>}
          {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}

export function CtaBand({ title = "Let's Connect. Let's Power the Future.", text, partner }: { title?: string; text?: string; partner?: boolean }) {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-x">
        <div className="on-dark relative overflow-hidden rounded-[1.75rem] bg-navy-900 px-6 py-14 text-white sm:px-12 lg:px-16 lg:py-20" data-reveal>
          <div className="pattern-x absolute inset-0" aria-hidden="true" />
          <div className="absolute -right-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-cyan-400/25 blur-[100px]" aria-hidden="true" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="text-h2 text-white">{title}</h2>
              <p className="mt-4 max-w-2xl text-lg text-white/75">
                {text ?? 'Have questions about our energy storage solutions, hybrid solar inverters or business partnership opportunities? Our team is here to help you take the next step towards smarter energy.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/contact" className="btn btn-gradient">Get in touch <Chevron /></Link>
              {partner !== false && <Link href="/contact?type=partner" className="btn btn-outline text-white">Become a partner</Link>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      {items.map((f) => (
        <details key={f.q} className="group px-6 py-1" data-reveal>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-bold text-navy-900 [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mist-50 text-blue-600 transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
          </summary>
          <p className="pb-6 text-slate-500">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function FeatureCard({ icon, title, text, dark }: { icon: ReactNode; title: string; text: string; dark?: boolean }) {
  return (
    <div
      className={`group relative h-full overflow-hidden rounded-2xl p-7 transition-transform duration-500 hover:-translate-y-1 ${dark ? 'border border-white/10 bg-white/[0.04]' : 'card hover:shadow-[0_24px_60px_-30px_rgb(8_21_63/0.35)]'}`}
      data-reveal
    >
      <span className={`grid h-12 w-12 place-items-center rounded-xl ${dark ? 'bg-white/10 text-green-400' : 'bg-mist-50 text-blue-600'}`}>{icon}</span>
      <h3 className={`mt-6 text-xl font-bold ${dark ? 'text-white' : 'text-navy-900'}`}>{title}</h3>
      <p className={`mt-3 ${dark ? 'text-white/70' : 'text-slate-500'}`}>{text}</p>
      <span className="gradient-bar absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
    </div>
  );
}

export function SpecTable({ models, specs, caption }: { models: string[]; specs: { label: string; values: string[] }[]; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line" tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full min-w-[36rem] border-collapse text-left text-[0.95rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-navy-900 text-white">
            <th scope="col" className="sticky left-0 bg-navy-900 px-5 py-4 font-bold">Specification</th>
            {models.map((m) => <th key={m} scope="col" className="px-5 py-4 font-bold">{m}</th>)}
          </tr>
        </thead>
        <tbody>
          {specs.map((s, i) => (
            <tr key={s.label} className={i % 2 ? 'bg-mist-50' : 'bg-white'}>
              <th scope="row" className={`sticky left-0 px-5 py-3.5 font-semibold text-navy-900 ${i % 2 ? 'bg-mist-50' : 'bg-white'}`}>{s.label}</th>
              {s.values.map((v, k) => <td key={k} className="px-5 py-3.5 text-slate-500">{v}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/60">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={it.name} className="flex items-center gap-2">
            {it.href ? <Link href={it.href} className="inline-block py-2 hover:text-white">{it.name}</Link> : <span aria-current="page" className="text-white/90">{it.name}</span>}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
