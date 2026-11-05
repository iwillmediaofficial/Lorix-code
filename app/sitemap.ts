import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
import { getPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['', '/about', '/products', '/products/lfp-battery', '/products/hybrid-inverter', '/products/sodium-ion-battery', '/technology', '/blog', '/contact', '/privacy-policy', '/terms'];
  const posts = await getPosts(500);
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: 'monthly' as const, priority: p === '' ? 1 : p.startsWith('/products') ? 0.9 : 0.7 })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.updated_at, changeFrequency: 'yearly' as const, priority: 0.6 })),
  ];
}
