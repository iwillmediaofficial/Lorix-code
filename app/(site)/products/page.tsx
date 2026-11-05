import type { Metadata } from 'next';
import Link from 'next/link';
import { Picture } from '@/components/Picture';
import { Render } from '@/components/Render';
import { SizingTool } from '@/components/SizingTool';
import { CtaBand, Faq, FeatureCard, PageHero, SectionHead } from '@/components/ui';
import { Chevron, IconGauge, IconHeadset, IconHome, IconNetwork, IconShield, IconSun, IconBattery } from '@/components/icons';
import { productFaq, products } from '@/content/products';
import { JsonLd, breadcrumbLd, faqLd } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Solar Batteries & Hybrid Inverters',
  description: 'LORIX Energy LFP batteries (5, 10, 16 kWh), hybrid solar inverters (3, 5, 10 kW) and upcoming sodium-ion storage for Indian homes. Size your system in seconds.',
  alternates: { canonical: '/products' },
};

const visual = {
  'lfp-battery': <Picture name="battery-16kwh" alt="LORIX 16 kWh LFP battery, closed and open" sizes="(min-width: 1024px) 40vw, 100vw" cover />,
  'hybrid-inverter': <Picture name="inverter-wall" alt="LORIX hybrid inverter on a wall" sizes="(min-width: 1024px) 40vw, 100vw" cover />,
  'sodium-ion-battery': <div className="h-full w-full bg-navy-900"><Render name="sodium" alt="LORIX sodium-ion battery modules, concept render" /></div>,
} as const;

export default function ProductsPage() {
  return (
    <>
      <PageHero eyebrow="Products" title="Store solar energy. Power what matters." intro="LFP battery storage, hybrid solar inverters and the next generation of sodium-ion storage, designed to work together in Indian homes.">
        <Link href="#sizing" className="btn btn-gradient">Size your system <Chevron /></Link>
        <Link href="/contact?type=product" className="btn btn-outline text-white">Talk to our team</Link>
      </PageHero>

      <section className="py-20 lg:py-28">
        <div className="container-x space-y-6">
          {products.map((p, i) => (
            <Link key={p.slug} href={`/products/${p.slug}`} className="group card grid overflow-hidden transition-shadow hover:shadow-[0_30px_70px_-35px_rgb(8_21_63/0.45)] md:grid-cols-2" data-reveal>
              <div className={`relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[22rem] ${i % 2 ? 'md:order-2' : ''}`}>
                <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">{visual[p.slug]}</div>
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <p className="eyebrow text-blue-600">{p.range}</p>
                <h2 className="text-h2 mt-3">{p.name}</h2>
                <p className="mt-4 text-lg text-slate-500">{p.tagline}</p>
                <span className="btn btn-primary mt-8 w-fit">{p.status === 'interest' ? 'Register interest' : 'View details'} <Chevron /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="sizing" className="scroll-mt-24 bg-mist-50 py-20 lg:py-28">
        <div className="container-x">
          <SectionHead eyebrow="Find the right energy solution" title="Size your system in under a minute." intro="Pick the appliances you want running during a power cut and how long you need backup. We'll suggest an inverter and battery to start the conversation." />
          <div className="mt-12"><SizingTool /></div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-x">
          <SectionHead eyebrow="Use cases" title="Solutions for every kind of solar project." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <FeatureCard icon={<IconSun />} title="Residential solar storage" text="Store available solar energy for use when solar generation is low." />
            <FeatureCard icon={<IconHome />} title="Home backup power" text="Select an inverter and battery combination based on essential loads and required backup duration." />
            <FeatureCard icon={<IconBattery />} title="Solar installer and EPC solutions" text="Explore products and configurations for residential solar projects through our partner network." />
          </div>
          <h2 className="text-h2 mt-24" data-reveal>Why choose LORIX Energy products?</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={<IconShield />} title="Safety-focused design" text="Product selection centred on suitable battery protection and operating limits." />
            <FeatureCard icon={<IconGauge />} title="Capacity choices" text="Options designed to serve different household power and storage requirements." />
            <FeatureCard icon={<IconNetwork />} title="Partner-led distribution" text="A business model focused on serving customers through solar installers and channel partners." />
            <FeatureCard icon={<IconHeadset />} title="Product support" text="Access to product documentation and technical assistance according to the support arrangements offered." />
          </div>
        </div>
      </section>

      <section className="bg-mist-50 py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
          <Faq items={productFaq} />
        </div>
      </section>

      <CtaBand title="Your Energy. Your Control." text="Explore smarter solar energy storage with LORIX Energy. Connect with our team to discuss product selection, technical specifications and partnership opportunities." />
      <JsonLd data={faqLd(productFaq)} />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }])} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/products/${p.slug}`, name: p.name })) }} />
    </>
  );
}
