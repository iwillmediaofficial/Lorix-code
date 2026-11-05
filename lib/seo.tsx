import { site } from './site';

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}/#org`,
        name: site.name,
        legalName: site.legalName,
        url: site.url,
        logo: `${site.url}/brand/logo.svg`,
        email: site.email,
        telephone: site.phone,
        slogan: site.tagline,
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${site.url}/#office`,
        name: site.name,
        parentOrganization: { '@id': `${site.url}/#org` },
        telephone: site.phone,
        email: site.email,
        url: site.url,
        image: `${site.url}/og.jpg`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '21/152, Corrazone, Panadans, P.O. Kalamassery',
          addressLocality: 'Kochi',
          addressRegion: site.office.region,
          postalCode: site.office.postalCode,
          addressCountry: 'IN',
        },
      },
      { '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url, name: site.name, inLanguage: 'en-IN', publisher: { '@id': `${site.url}/#org` } },
    ],
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
  };
}

export function faqLd(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}
