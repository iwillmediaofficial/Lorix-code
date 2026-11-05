import Link from 'next/link';
import { requireStaff, staffJson } from '@/lib/auth';
import { PageTitle, PostBadge, formatIst, Empty } from '@/components/admin/ui';

export const metadata = { title: 'Blog posts' };

type Row = { id: string; slug: string; title: string; status: string; published_at: string | null; updated_at: string; author_name: string; tags: string[] };

export default async function PostsPage() {
  await requireStaff();
  const rows = await staffJson<Row[]>('posts?select=id,slug,title,status,published_at,updated_at,author_name,tags&order=updated_at.desc&limit=200').catch(() => []);
  return (
    <>
      <PageTitle title="Blog posts" sub={`${rows.length} ${rows.length === 1 ? 'post' : 'posts'}`}>
        <Link href="/admin/posts/new" className="btn btn-primary">New post</Link>
      </PageTitle>
      {rows.length === 0 ? (
        <Empty>No posts yet. <Link href="/admin/posts/new" className="link">Write the first one</Link>.</Empty>
      ) : (
        <ul className="card divide-y divide-line">
          {rows.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/posts/${p.id}`} className="block truncate font-bold hover:text-blue-600">{p.title}</Link>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  /blog/{p.slug} · {p.author_name} · edited {formatIst(p.updated_at)}
                  {p.tags.length ? ` · ${p.tags.join(', ')}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <PostBadge status={p.status} publishedAt={p.published_at} />
                {p.status === 'published' && (
                  <a href={`/blog/${p.slug}`} target="_blank" className="text-sm font-semibold text-blue-600 hover:underline">View ↗</a>
                )}
                <Link href={`/admin/posts/${p.id}`} className="text-sm font-semibold text-blue-600 hover:underline">Edit</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
