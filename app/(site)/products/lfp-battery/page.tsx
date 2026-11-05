import type { Metadata } from 'next';
import { ProductHero } from '@/components/products/ProductHero';
import { BatteryExplorer } from '@/components/products/BatteryExplorer';
import { ExplodedBattery } from '@/components/products/ExplodedBattery';
import { InstallToggle } from '@/components/products/InstallToggle';
import { Picture } from '@/components/Picture';
import { CtaBand, Faq, SectionHead, SpecTable } from '@/components/ui';
import { IconBolt, IconShield, IconThermo, IconBattery, IconGauge } from '@/components/icons';
import { lfpBattery, productFaq } from '@/content/products';
import { JsonLd, breadcrumbLd } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'LFP Solar Battery 5, 10, 16 kWh',
  description: 'LORIX LFP (LiFePO4) home batteries in 5, 10 and 16 kWh with smart BMS, 6000 cycles at 95% DOD and a 10-year warranty. Wall or ground mount for Indian homes.',
  alternates: { canonical: '/products/lfp-battery' },
};

const protections = [
  { i: <IconBattery />, t: 'Cell under-voltage' },
  { i: <IconGauge />, t: 'Cell over-voltage' },
  { i: <IconBolt />, t: 'Over-current' },
  { i: <IconShield />, t: 'Short-circuit' },
  { i: <IconThermo />, t: 'Temperature' },
];

export default function LfpPage() {
  return (
    <>
      <ProductHero
        name="Solar LFP battery"
        eyebrow="LFP battery energy storage · 5 / 10 / 16 kWh"
        title={<>Store solar energy. <span className="gradient-text">Power what matters.</span></>}
        intro="LORIX LFP battery systems are built for residential storage and backup. Lithium Iron Phosphate chemistry is widely used in stationary storage for its thermal stability and long cycle life."
        badges={['6000 cycles', '10-year warranty', 'Smart BMS', 'Touch-screen LCD']}
        visual={<BatteryExplorer />}
      />

      <section className="py-20 lg:py-28">
        <div className="container-x"><ExplodedBattery /></div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <SectionHead eyebrow="One price, two ways to use" title="Wall-mounted or stacked. You decide." intro="Mount a slim unit on the wall where space is tight, or stack modules on the floor and add more as your needs grow. LORIX batteries and inverters are designed to work together." />
          <InstallToggle
            wall={<Picture name="battery-room" alt="LORIX wall-mounted LFP battery in a home" sizes="(min-width: 1024px) 55vw, 100vw" />}
            stacked={<Picture name="modular-system" alt="Multiple stacked LORIX battery modules connected in parallel" sizes="(min-width: 1024px) 55vw, 100vw" />}
          />
        </div>
      </section>

      <section className="bg-mist-50 py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Specifications" title="Technical specifications" intro="The 10 kWh model specification is being finalised; ask our team for its datasheet." />
          </div>
          <div className="mt-10" data-reveal><SpecTable models={lfpBattery.models!} specs={lfpBattery.specs!} caption="LORIX LFP battery specifications" /></div>
          <h3 className="text-h3 mt-16" data-reveal>Built-in protection</h3>
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {protections.map((p) => (
              <li key={p.t} className="card flex flex-col items-center gap-3 p-6 text-center" data-reveal>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-gradient text-white">{p.i}</span>
                <span className="font-bold">{p.t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-slate-500">Protection functions vary by battery model and its final specification. Compatibility with third-party inverters depends on voltage, BMS protocol and firmware; confirm before purchase.</p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead eyebrow="FAQ" title="Questions about LORIX batteries" />
          <Faq items={productFaq.slice(1)} />
        </div>
      </section>

      <CtaBand title="Ready to store your sunshine?" text="Tell us about your home or project and we will recommend the right capacity, with a response within 24 hours." />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }, { name: 'Solar LFP battery', path: '/products/lfp-battery' }])} />
      <JsonLd
        data={{
          '@context': 'https://schema.org', '@type': 'Product', name: 'LORIX LFP Battery Energy Storage', brand: { '@type': 'Brand', name: 'LORIX Energy' },
          description: metadata.description, image: `${site.url}/images/battery-room-1094.webp`, category: 'Home battery storage',
          additionalProperty: [
            { '@type': 'PropertyValue', name: 'Nominal voltage', value: '51.2 V' },
            { '@type': 'PropertyValue', name: 'Capacity options', value: '5 kWh, 10 kWh, 16 kWh' },
            { '@type': 'PropertyValue', name: 'Cycle life', value: '6000 cycles at 95% DOD' },
            { '@type': 'PropertyValue', name: 'Warranty', value: '10 years' },
          ],
        }}
      />
    </>
  );
}
