import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Motion } from '@/components/Motion';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { JsonLd, organizationLd } from '@/lib/seo';
import { site } from '@/lib/site';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'LORIX Energy | Solar Hybrid Inverters & LFP Batteries India', template: '%s | LORIX Energy' },
  description: site.description,
  applicationName: site.name,
  keywords: ['LFP battery India', 'Hybrid solar inverter', 'Solar energy storage', 'Residential battery storage', 'Solar distributor India'],
  openGraph: { type: 'website', locale: 'en_IN', siteName: site.name, images: [{ url: '/og.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/brand/mark.svg' },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = { themeColor: '#08153f', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={montserrat.variable} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before paint so reveal animations never flash; no-JS visitors see everything. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-bold">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Motion />
        <JsonLd data={organizationLd()} />
      </body>
    </html>
  );
}
