import Link from 'next/link';
import type { Metadata } from 'next';
import { HomeHero } from '@/components/home/HomeHero';
import { EnergyFlow } from '@/components/EnergyFlow';
import { Picture } from '@/components/Picture';
import { CtaBand, FeatureCard, SectionHead } from '@/components/ui';
import { Chevron, IconBattery, IconBolt, IconClock, IconGauge, IconHeadset, IconLock, IconNetwork, IconShield, IconWhatsApp } from '@/components/icons';
import { products } from '@/content/products';
import { getPosts, formatDate } from '@/lib/blog';
import { whatsappLink } from '@/lib/site';
import { Render } from '@/components/Render';

export const metadata: Metadata = {
  title: { absolute: 'LORIX Energy | Solar Hybrid Inverters & LFP Batteries India' },
  alternates: { canonical: '/' },
};

const productVisual = {
  'lfp-battery': <Picture name="battery-room" alt="LORIX LFP wall-mounted home battery in a modern living space" sizes="(min-width: 1024px) 33vw, 100vw" cover />,
  'hybrid-inverter': <Picture name="inverter-wall" alt="LORIX hybrid solar inverter mounted on a wall" sizes="(min-width: 1024px) 33vw, 100vw" cover />,
  'sodium-ion-battery': <div className="h-full w-full bg-navy-900"><Render name="sodium" alt="LORIX sodium-ion battery modules, concept render" /></div>,
} as const;

export default async function HomePage() {
  const posts = await getPosts(3);
  return (
    <>
      <HomeHero />

      {/* Trust strip */}
      <section className="border-b border-line bg-white">
        <div className="container-x grid grid-cols-2 gap-y-8 py-12 lg:grid-cols-4">
          {[
            { n: 6000, s: '+', l: 'charge cycles at 95% depth', i: <IconBattery /> },
            { n: 16, s: ' kWh', l: 'storage, from 5 kWh up', i: <IconGauge /> },
            { n: 10, s: ' kW', l: 'hybrid inverters, from 3 kW', i: <IconBolt /> },
            { n: 24, s: ' h', l: 'service response commitment', i: <IconClock /> },
          ].map((x) => (
            <div key={x.l} className="flex items-center gap-3 px-1 sm:gap-4 sm:px-2" data-reveal>
              <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-xl bg-mist-50 text-blue-600 sm:grid">{x.i}</span>
              <div>
                <p className="whitespace-nowrap text-2xl font-extrabold tabular-nums sm:text-3xl"><span data-count={x.n}>{x.n}</span>{x.s}</p>
                <p className="text-sm text-slate-500">{x.l}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHead eyebrow="How it works" title="One system that follows the sun, and covers you when it sets." intro="Solar panels, a LORIX hybrid inverter and an LFP battery work as one. Scroll or tap through a day to see where your energy goes." />
          <div className="mt-12"><EnergyFlow pinned idPrefix="home" /></div>
        </div>
      </section>

      {/* Product range */}
      <section className="bg-mist-50 py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Our range" title="Storage and power conversion, designed together." />
            <Link href="/products" className="btn btn-outline text-navy-900" data-reveal>All products <Chevron /></Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {products.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group card flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_-35px_rgb(8_21_63/0.45)]" data-reveal>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">{productVisual[p.slug]}</div>
                  {p.status === 'interest' && <span className="absolute left-4 top-4 rounded-full bg-green-400 px-3 py-1 text-xs font-bold text-navy-900">Coming soon</span>}
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="text-sm font-semibold text-blue-600">{p.range}</p>
                  <h3 className="mt-2 text-2xl font-extrabold">{p.name}</h3>
                  <p className="mt-2 flex-1 text-slate-500">{p.tagline}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-bold text-navy-900">
                    {p.status === 'interest' ? 'Register interest' : 'Explore'} <Chevron />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why LORIX */}
      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div>
            <SectionHead eyebrow="Why LORIX Energy" title="Built around safety, smart management and the people who install it." />
            <div className="mt-10 overflow-hidden rounded-2xl" data-reveal>
              <Picture name="home-lifestyle" alt="A LORIX battery quietly powering a comfortable living room" sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FeatureCard icon={<IconShield />} title="Quality-focused approach" text="Dependable products backed by appropriate quality controls, product documentation and applicable certifications." />
            <FeatureCard icon={<IconGauge />} title="Smarter energy management" text="Solutions designed to help customers use and store solar energy more effectively." />
            <FeatureCard icon={<IconNetwork />} title="Partner-first business model" text="Long-term relationships with installers and distributors through product support and collaborative growth." />
            <FeatureCard icon={<IconBolt />} title="Pan-India ambition" text="Making LORIX Energy a recognised and trusted name in residential energy storage across India." />
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="pb-20 lg:pb-28">
        <div className="container-x">
          <div className="grid overflow-hidden rounded-[1.75rem] border border-line lg:grid-cols-2">
            <div className="relative min-h-72"><Picture name="storage-stack" alt="LORIX stacked and wall-mounted battery systems for installers" sizes="(min-width: 1024px) 50vw, 100vw" cover /></div>
            <div className="p-8 sm:p-12 lg:p-16">
              <p className="eyebrow text-blue-600" data-reveal>For installers, EPCs and distributors</p>
              <h2 className="text-h2 mt-3" data-reveal>Grow with a storage brand that grows with you.</h2>
              <p className="mt-5 text-lg text-slate-500" data-reveal>We are building a pan-India network of solar installers, distributors and energy professionals. Get product training, technical documentation and responsive support for every project.</p>
              <ul className="mt-6 space-y-3 text-navy-900" data-reveal>
                {['Wall-mounted and stackable LFP options', 'Compatibility guidance for hybrid inverters', 'Fast quotations and immediate delivery on stocked models'].map((t) => (
                  <li key={t} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-gradient" />{t}</li>
                ))}
              </ul>
              <Link href="/contact?type=partner" className="btn btn-primary mt-9" data-reveal>Become a channel partner <Chevron /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Data in India + WhatsApp */}
      <section className="on-dark relative overflow-hidden bg-navy-900 py-20 text-white lg:py-28">
        <div className="pattern-x absolute inset-0" aria-hidden="true" />
        <div className="container-x relative grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 sm:p-10" data-reveal>
            <IconLock className="h-10 w-10 text-green-400" />
            <h2 className="text-h3 mt-6 text-white">Secure hybrid inverter monitoring, data stored in India</h2>
            <p className="mt-4 text-white/75">Our monitoring platform tracks solar generation, battery performance, energy consumption and system status. Inverter monitoring applications, control servers and system data are designed to be hosted securely within India, in line with applicable Indian regulatory requirements.</p>
            <p className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
              {['India-based data storage', 'Secure cloud monitoring', 'Reliable remote access'].map((t) => <span key={t} className="rounded-full bg-white/10 px-3 py-1.5">{t}</span>)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 sm:p-10" data-reveal>
            <IconWhatsApp className="h-10 w-10 text-green-400" />
            <h2 className="text-h3 mt-6 text-white">We&apos;re live on WhatsApp</h2>
            <ul className="mt-4 space-y-3 text-white/75">
              <li><strong className="text-white">Product enquiries:</strong> residential storage systems, LFP batteries and hybrid inverters.</li>
              <li><strong className="text-white">Customer registration:</strong> register your details conveniently.</li>
              <li><strong className="text-white">Service and technical support:</strong> product assistance and service coordination.</li>
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href={whatsappLink('Hi LORIX Energy, I would like some help.')} target="_blank" rel="noopener noreferrer" className="btn bg-[#1fa855] text-white"><IconWhatsApp className="h-5 w-5" /> Message us</a>
              <span className="flex items-center gap-2 text-sm text-white/75"><IconHeadset className="h-5 w-5 text-cyan-400" /> 24-hour service response</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      {posts.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead eyebrow="From the blog" title="Guides for smarter solar storage." />
              <Link href="/blog" className="btn btn-outline text-navy-900" data-reveal>All articles <Chevron /></Link>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {posts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group card p-7 transition-shadow hover:shadow-[0_24px_60px_-30px_rgb(8_21_63/0.35)]" data-reveal>
                  <p className="text-sm text-slate-500">{formatDate(p.published_at)} · {p.reading_minutes ?? 4} min read</p>
                  <h3 className="mt-3 text-xl font-bold group-hover:text-blue-600">{p.title}</h3>
                  <p className="mt-3 line-clamp-3 text-slate-500">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
