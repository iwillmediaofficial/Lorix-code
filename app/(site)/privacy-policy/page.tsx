import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'How LORIX Energy collects, uses and protects personal data.', alternates: { canonical: '/privacy-policy' } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="5 November 2026">
      <p>{site.legalName} (“LORIX Energy”, “we”) respects your privacy. This policy explains what personal data we collect through this website, why, and the choices you have, in line with India’s Digital Personal Data Protection Act, 2023.</p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Enquiry details you give us:</strong> name, email, phone number, enquiry type, city or state and your message.</li>
        <li><strong>Technical data:</strong> a one-way hashed form of your IP address, used only to prevent spam and abuse. We do not store your raw IP address.</li>
        <li><strong>Analytics:</strong> we use cookie-free, aggregated analytics. We do not use advertising cookies or track you across other websites.</li>
      </ul>
      <h2>Why we use it</h2>
      <ul>
        <li>To respond to your enquiry, recommend products and arrange service or partnership discussions.</li>
        <li>To send you a confirmation email for your enquiry.</li>
        <li>To keep the website secure and free from spam.</li>
      </ul>
      <p>We process enquiry data on the basis of the consent you give when submitting the form. You can withdraw consent at any time by emailing us.</p>
      <h2>Where it is stored</h2>
      <p>Enquiry data is stored in a database hosted in Mumbai, India. Emails are delivered through a transactional email provider. We share your details only with our own team and, where you ask us to, with an authorised LORIX installer or distributor near you.</p>
      <h2>How long we keep it</h2>
      <p>We keep enquiry records for up to 24 months, unless you become a customer or partner, in which case we keep the records needed for warranty, service and legal obligations.</p>
      <h2>Your rights</h2>
      <p>You may ask to access, correct or erase your personal data, or raise a grievance, by writing to <a href={`mailto:${site.email}`}>{site.email}</a>. We will respond within the time limits set by applicable law.</p>
      <h2>Contact</h2>
      <p>{site.legalName}, {site.office.lines.join(', ')}. Phone {site.phone}.</p>
    </LegalPage>
  );
}
