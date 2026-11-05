'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Item = { slug: string; title: string; excerpt: string; tags: string[]; date: string; minutes: number };

/** Filters already-loaded posts in the browser: no database calls. */
export function BlogList({ posts }: { posts: Item[] }) {
  const tags = useMemo(() => ['All', ...Array.from(new Set(posts.flatMap((p) => p.tags)))], [posts]);
  const [tag, setTag] = useState('All');
  const [q, setQ] = useState('');
  const shown = posts.filter((p) => (tag === 'All' || p.tags.includes(tag)) && (q === '' || (p.title + p.excerpt).toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {tags.map((t) => (
            <button key={t} onClick={() => setTag(t)} aria-pressed={tag === t} className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${tag === t ? 'bg-navy-900 text-white' : 'bg-mist-50 text-navy-900 hover:bg-mist-100'}`}>{t}</button>
          ))}
        </div>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" aria-label="Search articles" className="field md:max-w-xs" />
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group card flex flex-col p-7 transition-shadow hover:shadow-[0_24px_60px_-30px_rgb(8_21_63/0.35)]">
            <div className="flex flex-wrap gap-2">{p.tags.map((t) => <span key={t} className="rounded-full bg-mist-50 px-3 py-1 text-xs font-bold text-blue-600">{t}</span>)}</div>
            <h2 className="mt-4 text-xl font-bold group-hover:text-blue-600">{p.title}</h2>
            <p className="mt-3 flex-1 text-slate-500">{p.excerpt}</p>
            <p className="mt-6 text-sm text-slate-500">{p.date} · {p.minutes} min read</p>
          </Link>
        ))}
      </div>
      {shown.length === 0 && <p className="mt-10 text-slate-500">No articles match yet. Try another topic.</p>}
    </div>
  );
}
