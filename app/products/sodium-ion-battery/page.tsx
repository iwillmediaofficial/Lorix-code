import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductHero } from '@/components/products/ProductHero';
import { Scene3D } from '@/components/three/Scene3D';
import { Render } from '@/components/Render';
import { EnquiryForm } from '@/components/EnquiryForm';
import { ChemistryCompare } from '@/components/products/ChemistryCompare';
import { CtaBand, FeatureCard, SectionHead } from '@/components/ui';
import { IconLeaf, IconShield, IconThermo } from '@/components/icons';
import { JsonLd, breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Sodium-ion Battery for Home Storage',
  description: 'LORIX Energy is preparing sodium-ion home batteries: abundant materials, strong low-temperature performance and safe transport. Register your interest.',
  alternates: { canonical: '/products/sodium-ion-battery' },
};

export default function SodiumPage() {
  return (
    <>
      <ProductHero
        name="Sodium-ion batteries"
        eyebrow="Coming soon · Register interest"
        title={<>Sodium-ion: the <span className="gradient-text">next chemistry</span> for home storage.</>}
        intro="Sodium-ion batteries use one of the most abundant elements on earth. LORIX Energy is preparing a sodium-ion range to sit alongside our LFP systems. Register your interest to hear first."
        cta="Register interest"
        ctaHref="#register"
        badges={['Abundant raw materials', 'Cold-weather performance', 'No cobalt or nickel']}
        visual={<Scene3D variant="sodium" interactive label="Concept render of LORIX sodium-ion battery modules" className="h-full w-full" fallback={<Render name="sodium" alt="" priority />} />}
      />

      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHead eyebrow="Why sodium-ion" title="A chemistry built on what India has plenty of." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <FeatureCard icon={<IconLeaf />} title="Abundant materials" text="Sodium is widely available and does not depend on lithium, cobalt or nickel supply chains." />
            <FeatureCard icon={<IconThermo />} title="Wide temperature range" text="Sodium-ion cells typically keep more of their capacity in the cold than lithium-based cells." />
            <FeatureCard icon={<IconShield />} title="Safety in transport" text="Cells can typically be shipped at very low charge, simplifying storage and logistics." />
          </div>
        </div>
      </section>

      <section className="bg-mist-50 py-20 lg:py-28">
        <div className="container-x">
          <SectionHead eyebrow="Compare" title="LFP or sodium-ion?" intro="Both are safe, stationary-storage chemistries. Tap a factor to see how they typically compare. Final LORIX figures will be published at launch." />
          <div className="mt-12"><ChemistryCompare /></div>
        </div>
      </section>

      <section id="register" className="scroll-mt-24 py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHead eyebrow="Register interest" title="Be first to know when sodium-ion launches." intro="Installers, distributors and homeowners can register now. We will share specifications, pricing and availability as soon as they are confirmed." />
          <Suspense fallback={<div className="card h-[36rem] animate-pulse bg-mist-50" />}>
            <EnquiryForm defaultType="sodium_ion" defaultMessage="I'd like to hear about LORIX sodium-ion batteries when they launch." compact />
          </Suspense>
        </div>
      </section>

      <CtaBand title="Need storage today?" text="Our LFP batteries are available now in 5, 10 and 16 kWh. Talk to us about a system for your home or project." partner={false} />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }, { name: 'Sodium-ion batteries', path: '/products/sodium-ion-battery' }])} />
    </>
  );
}
