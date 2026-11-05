import type { Metadata } from 'next';
import { CellHero } from '@/components/tech/CellHero';
import { BmsBoard } from '@/components/tech/BmsBoard';
import { EnergyFlow } from '@/components/EnergyFlow';
import { Picture } from '@/components/Picture';
import { CtaBand, FeatureCard, SectionHead } from '@/components/ui';
import { IconBattery, IconBolt, IconGauge, IconHome, IconNetwork, IconShield, IconThermo, IconSun } from '@/components/icons';
import { JsonLd, breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: 'LFP Battery Technology & Trusted Cell Manufacturers | LORIX Energy' },
  description: 'Discover LORIX Energy residential LFP battery storage solutions featuring cells sourced from recognized manufacturers including CORNEX, REPT, EVE Energy and Highstar, subject to product availability.',
  alternates: { canonical: '/technology' },
};

const cellMakers = ['CORNEX', 'REPT', 'EVE Energy', 'Highstar'];

export default function TechnologyPage() {
  return (
    <>
      <section className="on-dark relative h-[100svh] min-h-[38rem] overflow-hidden bg-navy-900 text-white">
        <CellHero />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-900/50 to-transparent" aria-hidden="true" />
        <div className="container-x relative flex h-full flex-col justify-end pb-20 lg:justify-center lg:pb-0">
          <p className="eyebrow text-green-400">Intelligent Energy Storage · Advanced Battery Chemistry · Smarter Power Conversion</p>
          <h1 className="text-display mt-5 max-w-3xl text-white">Technology That Powers <span className="gradient-text">Tomorrow</span></h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">At LORIX Energy, technology is about more than storing electricity. It is about making energy more useful, reliable and intelligent.</p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead eyebrow="Engineering a smarter energy future" title="Chemistry, management and conversion, integrated." />
            <p className="mt-6 text-lg text-slate-500" data-reveal>Our technology approach brings together Lithium Iron Phosphate (LFP) battery chemistry, battery management systems, hybrid power conversion and integrated energy management to support modern residential solar and backup applications.</p>
            <p className="mt-4 text-lg text-slate-500" data-reveal>We focus on selecting and integrating the right technologies to create practical energy storage solutions for Indian homes and the growing solar ecosystem.</p>
          </div>
          <div className="on-dark rounded-[1.75rem] bg-navy-900 p-8 text-white sm:p-12" data-reveal>
            <p className="eyebrow text-green-400">Powered by trusted global LFP cell technology</p>
            <p className="mt-4 text-lg text-white/80">Reliability begins at the cell level. Our storage solutions use Grade A LFP cells sourced from globally recognised battery manufacturers, subject to product model and availability.</p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {cellMakers.map((m) => <li key={m} className="rounded-xl border border-white/15 px-4 py-5 text-center text-lg font-extrabold tracking-wide">{m}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-mist-50 py-20 lg:py-28">
        <div className="container-x">
          <SectionHead eyebrow="Advanced Lithium Iron Phosphate chemistry" title="Why LFP for home storage." intro="LFP, also known as LiFePO₄, is a lithium-ion chemistry widely used in stationary storage. It is valued for its thermal stability and potential for long cycle life when operated within specified conditions." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <FeatureCard icon={<IconThermo />} title="Thermal stability" text="A stable cathode chemistry, well suited to residential installations in warm Indian climates." />
            <FeatureCard icon={<IconBattery />} title="Long cycle life" text="Designed for repeated charging and discharging, rated at 6000 cycles at 95% depth of discharge." />
            <FeatureCard icon={<IconShield />} title="Safety-focused" text="Cell selection, BMS, thermal design and system protection all contribute to overall reliability." />
          </div>
        </div>
      </section>

      <section className="on-dark bg-navy-900 py-20 text-white lg:py-28">
        <div className="container-x">
          <SectionHead dark eyebrow="Intelligent battery management system" title="Smart monitoring. Controlled performance." intro="Depending on the product, the BMS monitors operating conditions, protects against electrical and temperature limits, balances cells and communicates with compatible inverters." />
          <div className="mt-14"><BmsBoard /></div>
          <p className="mt-8 text-sm text-white/55">Protection functions vary by battery model and its final specification.</p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHead eyebrow="Hybrid inverter technology" title="Intelligent solar power conversion." intro="Our planned hybrid inverter range covers 3 kW, 5 kW and 10 kW, managing solar conversion, battery charging, grid and backup operation, and system protection." />
          <div className="mt-12"><EnergyFlow idPrefix="tech" /></div>
        </div>
      </section>

      <section className="bg-mist-50 py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead eyebrow="Integrated energy management" title="Bringing solar, storage and power together." intro="A residential system works best when its parts are correctly matched. We help customers and installers choose solutions based on real requirements." />
            <ol className="mt-8 space-y-3">
              {['Solar generation capacity', 'Household load profile and peak demand', 'Required battery backup duration', 'Inverter and battery compatibility', 'Installation conditions and electrical requirements'].map((s, i) => (
                <li key={s} className="flex items-center gap-4" data-reveal>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white">{i + 1}</span>
                  <span className="font-semibold">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="overflow-hidden rounded-[1.75rem]" data-reveal><Picture name="solar-system" alt="Rooftop solar panels feeding a LORIX inverter and battery on a house wall" sizes="(min-width: 1024px) 50vw, 100vw" /></div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHead eyebrow="Designed around real-world requirements" title="Built for how India uses energy." center />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <FeatureCard icon={<IconHome />} title="Residential energy storage" text="Solutions for homes seeking to store available solar energy and improve energy management." />
            <FeatureCard icon={<IconBolt />} title="Backup power applications" text="Configurations based on essential loads, battery capacity and the backup capabilities of the inverter." />
            <FeatureCard icon={<IconNetwork />} title="Installer-friendly integration" text="Product selection, compatibility checks, technical documentation and installation support for partners." />
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <FeatureCard icon={<IconShield />} title="Safety first" text="Suitable battery protection, electrical safeguards and compliance with applicable standards." />
            <FeatureCard icon={<IconGauge />} title="Intelligent integration" text="Matching batteries, inverters and system requirements for reliable operation." />
            <FeatureCard icon={<IconSun />} title="Continuous improvement" text="Evolving our portfolio with changing storage technologies and customer needs." />
          </div>
        </div>
      </section>

      <CtaBand title="Smarter Energy Starts with Better Technology." text="LORIX Energy — Reliable Energy. Smarter Living. A Sustainable Future." />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Technology', path: '/technology' }])} />
    </>
  );
}
