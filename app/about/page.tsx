import type { Metadata } from 'next';
import { Picture } from '@/components/Picture';
import { CtaBand, FeatureCard, PageHero, SectionHead } from '@/components/ui';
import { IconBattery, IconBolt, IconGauge, IconLeaf, IconNetwork, IconShield } from '@/components/icons';
import { JsonLd, breadcrumbLd } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About LORIX Energy | Indian Energy Storage Brand',
  description: 'LORIX Energy Private Limited is an Indian battery energy storage brand making reliable, intelligent energy storage accessible to homes and businesses across India.',
  alternates: { canonical: '/about' },
};

const mission = [
  { t: 'Make energy storage accessible', d: 'Deliver practical battery and inverter solutions for modern energy needs.' },
  { t: 'Build dependable products', d: 'Prioritise safety, performance, quality and long-term value.' },
  { t: 'Empower our partners', d: 'Enable solar installers and distributors to grow through reliable products and responsive support.' },
  { t: 'Expand across India', d: 'Develop a nationwide network that brings advanced energy solutions closer to customers.' },
  { t: 'Support a sustainable future', d: 'Help accelerate the adoption of solar energy and smarter energy management.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About LORIX Energy" title="Powering a Smarter Energy Future" intro="An Indian battery energy storage brand built around a simple vision: making reliable, intelligent energy storage accessible to homes and businesses across India." />

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6 text-lg text-slate-500">
            <SectionHead eyebrow="Our story" title="Bridging solar generation and dependable storage." />
            <p data-reveal>As solar adoption grows, the need for dependable energy storage and efficient power management is becoming increasingly important. We aim to bridge this gap with thoughtfully designed energy solutions that help people make better use of solar power, improve energy reliability and move towards greater energy independence.</p>
            <p data-reveal>Our focus is on residential energy storage, Lithium Iron Phosphate (LFP) battery systems and hybrid inverters: solutions designed to bring together solar generation, battery storage and intelligent power conversion in one integrated energy ecosystem.</p>
            <p data-reveal>Through a partner-driven business model, we aim to build a strong nationwide network of solar installers, distributors and energy professionals who share our commitment to quality, service and sustainable growth.</p>
            <p data-reveal className="font-semibold text-navy-900">We are building towards that future, one home, one partner and one energy solution at a time.</p>
          </div>
          <div className="lg:sticky lg:top-28" data-reveal>
            <div className="overflow-hidden rounded-[1.75rem]">
              <Picture name="home-night" alt="A LORIX battery powering a family home in the evening" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="on-dark relative overflow-hidden bg-navy-900 py-20 text-white lg:py-28">
        <div className="pattern-x absolute inset-0" aria-hidden="true" />
        <div className="container-x relative">
          <p className="eyebrow text-green-400" data-reveal>Our vision</p>
          <blockquote className="text-h2 mt-4 max-w-4xl text-white" data-reveal>
            “To become a trusted Indian energy storage brand, empowering homes and businesses with intelligent, reliable and sustainable energy solutions.”
          </blockquote>
          <p className="eyebrow mt-20 text-green-400" data-reveal>Our mission</p>
          <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {mission.map((m, i) => (
              <li key={m.t} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6" data-reveal>
                <span className="gradient-text text-4xl font-extrabold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-lg font-bold text-white">{m.t}</h3>
                <p className="mt-2 text-sm text-white/70">{m.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHead eyebrow="What we do" title="From the cell to the channel partner." center />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={<IconBattery />} title="LFP battery energy storage" text="Store available solar energy for later use, support backup requirements and improve household energy management." />
            <FeatureCard icon={<IconBolt />} title="Hybrid solar inverters" text="Intelligent power conversion that coordinates solar generation, battery storage and compatible electrical loads." />
            <FeatureCard icon={<IconGauge />} title="Integrated energy solutions" text="Flexible solar-plus-storage systems, subject to product compatibility and site requirements." />
            <FeatureCard icon={<IconNetwork />} title="Partner and distribution network" text="A pan-India ecosystem of channel partners, installers and distributors for access, technical coordination and service." />
          </div>
        </div>
      </section>

      <section className="bg-mist-50 py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead eyebrow="Where we are" title="Rooted in South India, building for the whole country." />
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <div className="card p-6" data-reveal>
                <p className="eyebrow text-blue-600">{site.office.label}</p>
                <p className="mt-3 font-semibold">{site.office.lines.map((l) => <span key={l} className="block">{l}</span>)}</p>
              </div>
              <div className="card p-6" data-reveal>
                <p className="eyebrow text-blue-600">{site.factory.label}</p>
                <p className="mt-3 font-semibold">{site.factory.lines.map((l) => <span key={l} className="block">{l}</span>)}</p>
              </div>
            </div>
          </div>
          <svg viewBox="0 0 400 420" className="mx-auto w-full max-w-md" role="img" aria-label="Map of South India showing the Kochi office and Coimbatore factory" data-reveal>
            <path d="M120 20 L230 10 L300 60 L330 140 L300 210 L260 260 L230 330 L200 400 L170 360 L150 290 L120 230 L100 160 L95 90 Z" fill="#e9eef8" stroke="#a5b7f3" strokeWidth="2" />
            <path d="M150 300 L190 290" stroke="#a5b7f3" strokeDasharray="4 6" strokeWidth="2" />
            <g transform="translate(160 330)"><circle r="16" fill="#01bec4" opacity=".25"><animate attributeName="r" values="8;22;8" dur="2.4s" repeatCount="indefinite" /></circle><circle r="7" fill="#0076fe" /><text x="-14" y="5" textAnchor="end" fontSize="14" fontWeight="700" fill="#08153f">Kochi</text></g>
            <g transform="translate(205 290)"><circle r="16" fill="#8dd818" opacity=".25"><animate attributeName="r" values="8;22;8" dur="2.4s" begin=".8s" repeatCount="indefinite" /></circle><circle r="7" fill="#3f6f0a" /><text x="14" y="5" fontSize="14" fontWeight="700" fill="#08153f">Coimbatore</text></g>
          </svg>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHead eyebrow="Why LORIX Energy" title="What we stand for." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={<IconShield />} title="Quality-focused" text="Dependable products backed by quality controls, documentation and applicable certifications." />
            <FeatureCard icon={<IconGauge />} title="Smarter energy" text="Use and store solar energy more effectively." />
            <FeatureCard icon={<IconNetwork />} title="Partner-first" text="Long-term relationships with installers and distributors." />
            <FeatureCard icon={<IconLeaf />} title="Pan-India ambition" text="A recognised, trusted name in residential storage across India." />
          </div>
        </div>
      </section>

      <CtaBand title="Join the LORIX Energy Network" text="Whether you are a solar distributor, installer, EPC company or business exploring energy storage opportunities, we welcome you to connect with us and explore a potential partnership." />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])} />
    </>
  );
}
