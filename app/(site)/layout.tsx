import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Motion } from '@/components/Motion';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { JsonLd, organizationLd } from '@/lib/seo';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-bold">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppButton />
      <Motion />
      <JsonLd data={organizationLd()} />
    </>
  );
}
