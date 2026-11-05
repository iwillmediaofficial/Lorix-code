import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Terms of Use', description: 'Terms for using the LORIX Energy website.', alternates: { canonical: '/terms' } };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="5 November 2026">
      <p>By using this website you agree to these terms. The website is operated by {site.legalName}.</p>
      <h2>Product information</h2>
      <p>Product descriptions, specifications and images are provided for general information. Specifications marked indicative, concept renders and the system sizing tool are estimates and may change. Final configurations, ratings and compatibility are confirmed in writing by our team or authorised partners before purchase.</p>
      <h2>No professional advice</h2>
      <p>Content on this website, including blog articles, does not replace a site assessment by a qualified electrician or solar installer. Installation must follow applicable electrical codes and the product manual.</p>
      <h2>Warranty</h2>
      <p>Product warranties are governed by the warranty card supplied with each product, not by this website.</p>
      <h2>Intellectual property</h2>
      <p>The LORIX Energy name, logo, images and content are owned by {site.legalName}. Please do not reuse them without written permission.</p>
      <h2>Liability</h2>
      <p>To the extent permitted by law, LORIX Energy is not liable for losses arising from the use of this website or reliance on its content.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India, with courts at Ernakulam, Kerala having jurisdiction.</p>
      <h2>Contact</h2>
      <p>Questions about these terms: <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
    </LegalPage>
  );
}
