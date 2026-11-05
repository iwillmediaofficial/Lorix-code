import type { ReactNode } from 'react';

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <section className="on-dark bg-navy-900 pb-14 pt-32 text-white lg:pt-40">
        <div className="container-x max-w-4xl">
          <h1 className="text-h1 text-white">{title}</h1>
          <p className="mt-4 text-white/60">Last updated {updated}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container-x max-w-4xl"><div className="prose-lorix text-lg">{children}</div></div>
      </section>
    </>
  );
}
