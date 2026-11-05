import type { Metadata } from 'next';
import { Suspense } from 'react';
import { EnquiryForm } from '@/components/EnquiryForm';
import { PageHero } from '@/components/ui';
import { IconClock, IconMail, IconPhone, IconPin, IconWhatsApp } from '@/components/icons';
import { site, whatsappLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact LORIX Energy | Enquiries & Partnerships',
  description: 'Talk to LORIX Energy about LFP batteries, hybrid solar inverters, distribution and channel partnerships. We respond within 24 hours.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Get in touch" title="Let's Connect. Let's Power the Future." intro="Whether you are a homeowner exploring energy storage, a solar installer looking for reliable products, or a distributor interested in growing with LORIX Energy, we would love to hear from you." />
      <section className="py-16 lg:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <aside className="space-y-4">
            {[
              { i: <IconPhone />, t: 'Call us', v: site.phone, h: site.phoneHref, d: 'Speak with our team about products and partnership opportunities.' },
              { i: <IconMail />, t: 'Email us', v: site.email, h: `mailto:${site.email}`, d: 'For product enquiries, technical questions and business proposals.' },
              { i: <IconWhatsApp />, t: 'WhatsApp', v: 'Chat with us', h: whatsappLink('Hi LORIX Energy, I have a question.'), d: 'Product enquiries, registration and service support.' },
            ].map((c) => (
              <a key={c.t} href={c.h} className="card flex gap-4 p-6 transition-shadow hover:shadow-[0_20px_50px_-30px_rgb(8_21_63/0.4)]" {...(c.h.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-mist-50 text-blue-600">{c.i}</span>
                <span>
                  <span className="block font-bold">{c.t}</span>
                  <span className="block text-blue-600">{c.v}</span>
                  <span className="mt-1 block text-sm text-slate-500">{c.d}</span>
                </span>
              </a>
            ))}
            <div className="card flex gap-4 p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-mist-50 text-blue-600"><IconPin /></span>
              <address className="not-italic text-sm text-slate-500">
                <span className="block font-bold text-navy-900">{site.office.label}</span>{site.office.lines.join(', ')}
                <span className="mt-3 block font-bold text-navy-900">{site.factory.label}</span>{site.factory.lines.join(', ')}
              </address>
            </div>
            <div className="on-dark flex items-center gap-4 rounded-2xl bg-navy-900 p-6 text-white">
              <IconClock className="h-8 w-8 shrink-0 text-green-400" />
              <p><strong>Our commitment:</strong> a response to every service request within 24 hours.</p>
            </div>
          </aside>
          <div>
            <h2 className="text-h3 mb-2">Send us an enquiry</h2>
            <p className="mb-6 text-slate-500">Use this form to help us understand your requirements.</p>
            <Suspense fallback={<div className="card h-[40rem] animate-pulse bg-mist-50" />}>
              <EnquiryForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
