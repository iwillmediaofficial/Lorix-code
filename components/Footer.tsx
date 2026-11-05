import Link from 'next/link';
import { site, whatsappLink } from '@/lib/site';
import { products } from '@/content/products';
import { IconLock, IconMail, IconPhone, IconPin, IconWhatsApp } from './icons';

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-navy-950 text-white/80">
      <div className="pattern-x absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="gradient-bar h-1 w-full" aria-hidden="true" />
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-white.svg" alt="LORIX Energy" width={140} height={64} className="h-14 w-auto" loading="lazy" />
          <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed">
            Residential LFP battery storage and hybrid solar inverters, built for Indian homes and the installers who power them.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white">
            <IconLock className="h-4 w-4 text-green-400" /> Monitoring data stored in India
          </p>
        </div>

        <div>
          <h2 className="eyebrow mb-4 text-peri-200">Products</h2>
          <ul className="space-y-3 text-[0.95rem]">
            {products.map((p) => (
              <li key={p.slug}><Link className="hover:text-white" href={`/products/${p.slug}`}>{p.name}</Link></li>
            ))}
            <li><Link className="hover:text-white" href="/products#sizing">System sizing tool</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow mb-4 text-peri-200">Company</h2>
          <ul className="space-y-3 text-[0.95rem]">
            <li><Link className="hover:text-white" href="/about">About us</Link></li>
            <li><Link className="hover:text-white" href="/technology">Technology</Link></li>
            <li><Link className="hover:text-white" href="/blog">Blog</Link></li>
            <li><Link className="hover:text-white" href="/contact?type=partner">Become a partner</Link></li>
            <li><Link className="hover:text-white" href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="space-y-4 text-[0.95rem]">
          <h2 className="eyebrow mb-4 text-peri-200">Get in touch</h2>
          <a href={site.phoneHref} className="flex items-center gap-3 hover:text-white"><IconPhone className="h-5 w-5 text-cyan-400" />{site.phone}</a>
          <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-white"><IconMail className="h-5 w-5 text-cyan-400" />{site.email}</a>
          <a href={whatsappLink('Hi LORIX Energy, I would like to know more about your products.')} className="flex items-center gap-3 hover:text-white" target="_blank" rel="noopener noreferrer">
            <IconWhatsApp className="h-5 w-5 text-green-400" />Chat on WhatsApp
          </a>
          <div className="flex gap-3">
            <IconPin className="mt-1 h-5 w-5 shrink-0 text-cyan-400" />
            <address className="not-italic leading-relaxed">
              <span className="font-semibold text-white">{site.office.label}</span><br />
              {site.office.lines.join(', ')}
              <br /><span className="mt-2 inline-block font-semibold text-white">{site.factory.label}</span><br />
              {site.factory.lines.join(', ')}
            </address>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName}. {site.tagline}</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white">Privacy policy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
