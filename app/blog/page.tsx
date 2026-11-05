import type { Metadata } from 'next';
import { PageHero, CtaBand } from '@/components/ui';
import { BlogList } from '@/components/blog/BlogList';
import { getPosts, formatDate } from '@/lib/blog';
import { JsonLd, breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Blog: Solar Storage Guides for India',
  description: 'Practical guides on home battery sizing, LFP batteries, hybrid inverters and solar storage in India from the LORIX Energy team.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero eyebrow="Blog" title="Guides for smarter solar storage." intro="Practical advice for homeowners, installers and distributors on batteries, inverters and energy independence in India." />
      <section className="py-16 lg:py-24">
        <div className="container-x">
          {posts.length ? (
            <BlogList posts={posts.map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, tags: p.tags, date: formatDate(p.published_at), minutes: p.reading_minutes ?? 4 }))} />
          ) : (
            <p className="text-lg text-slate-500">Our first articles are on the way. Check back soon.</p>
          )}
        </div>
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }])} />
    </>
  );
}
