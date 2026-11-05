import type { Metadata } from 'next';
import { ProductHero } from '@/components/products/ProductHero';
import { Scene3D } from '@/components/three/Scene3D';
import { Render } from '@/components/Render';
import { EnergyFlow, inverterModes } from '@/components/EnergyFlow';
import { Picture } from '@/components/Picture';
import { CtaBand, Faq, FeatureCard, SectionHead, SpecTable } from '@/components/ui';
import { IconBattery, IconBolt, IconGrid, IconLock, IconShield, IconSun } from '@/components/icons';
import { hybridInverter } from '@/content/products';
import { JsonLd, breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Hybrid Solar Inverter 3, 5, 10 kW',
  description: 'LORIX hybrid solar inverters in 3, 5 and 10 kW coordinate solar panels, LFP batteries and the grid, with monitoring data stored in India.',
  alternates: { canonical: '/products/hybrid-inverter' },
};

const pairing = [
  { kw: '3 kW', for: 'Apartments and small homes: lights, fans, TV, fridge', battery: '5 kWh to 10 kWh' },
  { kw: '5 kW', for: 'Independent homes with one AC or a water pump', battery: '10 kWh to 16 kWh' },
  { kw: '10 kW', for: 'Large homes and small businesses, multiple ACs', battery: '16 kWh and above (modular)' },
];

const faq = [
  { q: 'What is a hybrid inverter?', a: 'A hybrid inverter combines a solar inverter and a battery inverter in one unit. It decides when solar energy powers the home, when it charges the battery and when the grid is used.' },
  { q: 'Will it work during a power cut?', a: 'Yes. In backup operation the inverter isolates the home from the grid and supplies your selected loads from the battery and solar, according to the model’s capability.' },
  { q: 'Can I add a battery later?', a: 'Yes, if you choose a hybrid inverter now. Battery compatibility depends on voltage and communication protocol; LORIX LFP batteries are designed to pair with LORIX inverters.' },
];

export default function InverterPage() {
  return (
    <>
      <ProductHero
        name="Hybrid inverter"
        eyebrow="Hybrid solar inverters · 3 / 5 / 10 kW"
        title={<>Solar, battery and grid, <span className="gradient-text">managed as one.</span></>}
        intro="Hybrid inverters coordinate energy from compatible solar panels, batteries and the grid. They manage when solar is used, when batteries charge and how your loads receive power."
        badges={['Pure sine wave', '< 10 ms backup switch', 'Wi-Fi monitoring', 'Data stored in India']}
        visual={<Scene3D variant="inverter" interactive particles label="LORIX hybrid solar inverter" className="h-full w-full" fallback={<Render name="inverter" alt="" priority />} />}
      />

      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHead eyebrow="Operating modes" title="Choose how your energy flows." intro="Switch between modes to see how a LORIX hybrid inverter routes power between your panels, battery, home and the grid." />
          <div className="mt-12"><EnergyFlow modes={inverterModes} idPrefix="inv" /></div>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="overflow-hidden rounded-[1.75rem]" data-reveal><Picture name="inverter-wall" alt="LORIX hybrid inverter installed on an exterior wall" sizes="(min-width: 1024px) 50vw, 100vw" /></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FeatureCard icon={<IconSun />} title="Solar conversion" text="Efficient MPPT solar conversion and energy utilisation." />
            <FeatureCard icon={<IconBattery />} title="Battery control" text="Managed charging and discharging for long battery life." />
            <FeatureCard icon={<IconGrid />} title="Grid and backup" text="Grid and backup operation according to model capability." />
            <FeatureCard icon={<IconShield />} title="System protection" text="Power management and protection for your home's wiring and loads." />
          </div>
        </div>
      </section>

      <section className="bg-mist-50 py-20 lg:py-28">
        <div className="container-x">
          <SectionHead eyebrow="Pairing guide" title="Which inverter is right for your home?" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pairing.map((p) => (
              <div key={p.kw} className="card p-7" data-reveal>
                <p className="gradient-text text-5xl font-extrabold">{p.kw}</p>
                <p className="mt-4 font-semibold">{p.for}</p>
                <p className="mt-4 text-sm text-slate-500">Pairs with <strong className="text-navy-900">{p.battery}</strong> of LORIX LFP storage</p>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow="Specifications" title="Indicative specifications" />
          </div>
          <p className="mt-4 rounded-xl border border-cyan-400/40 bg-white px-4 py-3 text-sm text-slate-500" data-reveal>
            <strong className="text-navy-900">Indicative values.</strong> Final ratings will be published with the LORIX datasheet; contact us for the current specification.
          </p>
          <div className="mt-6" data-reveal><SpecTable models={hybridInverter.models!} specs={hybridInverter.specs!} caption="LORIX hybrid inverter indicative specifications" /></div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="on-dark rounded-[1.75rem] bg-navy-900 p-8 text-white sm:p-12" data-reveal>
            <IconLock className="h-10 w-10 text-green-400" />
            <h2 className="text-h3 mt-6 text-white">Monitoring you can trust, data stored in India</h2>
            <p className="mt-4 text-white/75">Track solar generation, battery performance, consumption and system status from your phone. Monitoring applications, control servers and system data are designed to be hosted securely within India.</p>
          </div>
          <div>
            <SectionHead eyebrow="FAQ" title="Hybrid inverter questions" />
            <div className="mt-8"><Faq items={faq} /></div>
          </div>
        </div>
      </section>

      <CtaBand />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }, { name: 'Hybrid inverter', path: '/products/hybrid-inverter' }])} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Product', name: 'LORIX Hybrid Solar Inverter', brand: { '@type': 'Brand', name: 'LORIX Energy' }, description: metadata.description, category: 'Hybrid solar inverter' }} />
    </>
  );
}
