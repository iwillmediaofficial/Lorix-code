import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/ui';
import { Chevron } from '@/components/icons';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { getPost, getPosts, renderMarkdown, headingsOf, formatDate } from '@/lib/blog';
import { JsonLd, breadcrumbLd } from '@/lib/seo';
import { site } from '@/lib/site';

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  const posts = await getPosts(100);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: 'Article not found' };
  return {
    title: post.seo_title ?? post.title,
    description: post.seo_description ?? post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: 'article', publishedTime: post.published_at, modifiedTime: post.updated_at, images: post.cover_url ? [post.cover_url] : undefined },
  };
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const html = renderMarkdown(post.body_md).replace(/<h2>(.*?)<\/h2>/g, (_, t: string) => `<h2 id="${slugify(t.replace(/<[^>]+>/g, ''))}">${t}</h2>`);
  const toc = headingsOf(post.body_md);
  const related = (await getPosts(4)).filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <ReadingProgress />
      <article>
        <header className="on-dark bg-navy-900 pb-16 pt-32 text-white lg:pt-40">
          <div className="container-x max-w-4xl">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/60"><Link href="/blog" className="hover:text-white">Blog</Link> / <span className="text-white/90">{post.tags[0] ?? 'Article'}</span></nav>
            <h1 className="text-h1 text-white">{post.title}</h1>
            <p className="mt-6 text-lg text-white/75">{post.excerpt}</p>
            <p className="mt-8 text-sm text-white/60">{post.author_name} · {formatDate(post.published_at)} · {post.reading_minutes ?? 4} min read</p>
          </div>
        </header>
        <div className="container-x grid gap-12 py-16 lg:grid-cols-[1fr_16rem] lg:py-20">
          <div className="prose-lorix text-lg text-navy-900" dangerouslySetInnerHTML={{ __html: html }} />
          {toc.length > 1 && (
            <aside className="hidden lg:block">
              <nav aria-label="On this page" className="sticky top-28 rounded-2xl border border-line p-6 text-sm">
                <p className="eyebrow mb-4 text-blue-600">On this page</p>
                <ul className="space-y-3">{toc.map((h) => <li key={h}><a href={`#${slugify(h)}`} className="text-slate-500 hover:text-blue-600">{h}</a></li>)}</ul>
                <Link href="/products#sizing" className="btn btn-primary mt-6 w-full !text-sm">Size your system</Link>
              </nav>
            </aside>
          )}
        </div>
      </article>
      {related.length > 0 && (
        <section className="bg-mist-50 py-16">
          <div className="container-x">
            <h2 className="text-h3">Keep reading</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group card p-7">
                  <h3 className="text-xl font-bold group-hover:text-blue-600">{p.title}</h3>
                  <p className="mt-3 text-slate-500">{p.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-bold">Read <Chevron /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
      <JsonLd data={breadcrumbLd([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }])} />
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt, datePublished: post.published_at, dateModified: post.updated_at, author: { '@type': 'Organization', name: post.author_name }, publisher: { '@id': `${site.url}/#org` }, mainEntityOfPage: `${site.url}/blog/${post.slug}`, image: post.cover_url ?? `${site.url}/og.jpg` }} />
    </>
  );
}
