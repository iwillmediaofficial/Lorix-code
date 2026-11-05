import Link from 'next/link';
import { requireStaff, staffJson } from '@/lib/auth';
import { leadStatuses, typeLabel } from '@/lib/admin-leads';
import { PageTitle, StatusBadge, PostBadge, formatIst, Empty } from '@/components/admin/ui';

export const metadata = { title: 'Dashboard' };

type LeadRow = { id: string; created_at: string; full_name: string; enquiry_type: string; status: string };
type PostRow = { id: string; title: string; status: string; published_at: string | null; updated_at: string };

export default async function Dashboard() {
  const staff = await requireStaff();
  const isAdmin = staff.role === 'admin';
  const [counts, leads, posts] = await Promise.all([
    isAdmin ? staffJson<{ status: string; n: number }[]>('rpc/lead_counts', { method: 'POST', body: '{}' }).catch(() => []) : [],
    isAdmin ? staffJson<LeadRow[]>('leads?select=id,created_at,full_name,enquiry_type,status&order=created_at.desc&limit=6').catch(() => []) : [],
    staffJson<PostRow[]>('posts?select=id,title,status,published_at,updated_at&order=updated_at.desc&limit=5').catch(() => []),
  ]);
  const total = counts.reduce((a, c) => a + Number(c.n), 0);

  return (
    <>
      <PageTitle title={`Hello, ${staff.display_name.split(' ')[0]}`} sub="Here is what is happening on lorixenergy.com.">
        <Link href="/admin/posts/new" className="btn btn-primary">New blog post</Link>
      </PageTitle>

      {isAdmin && (
        <section aria-label="Lead summary" className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Link href="/admin/leads" className="card p-4 transition-shadow hover:shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">All leads</p>
            <p className="mt-1 text-3xl font-extrabold">{total}</p>
          </Link>
          {leadStatuses.map((s) => (
            <Link key={s.value} href={`/admin/leads?status=${s.value}`} className="card p-4 transition-shadow hover:shadow-lg">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
              <p className="mt-1 text-3xl font-extrabold">{Number(counts.find((c) => c.status === s.value)?.n ?? 0)}</p>
            </Link>
          ))}
        </section>
      )}

      <div className={`mt-8 grid gap-6 ${isAdmin ? 'xl:grid-cols-2' : ''}`}>
        {isAdmin && (
          <section className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">Latest leads</h2>
              <Link href="/admin/leads" className="link text-sm">See all</Link>
            </div>
            {leads.length === 0 ? (
              <Empty>No enquiries yet.</Empty>
            ) : (
              <ul className="card divide-y divide-line">
                {leads.map((l) => (
                  <li key={l.id}>
                    <Link href={`/admin/leads/${l.id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-mist-50">
                      <span className="min-w-0">
                        <span className="block truncate font-bold">{l.full_name}</span>
                        <span className="block text-xs text-slate-500">{typeLabel(l.enquiry_type)} · {formatIst(l.created_at)}</span>
                      </span>
                      <StatusBadge status={l.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Recent posts</h2>
            <Link href="/admin/posts" className="link text-sm">See all</Link>
          </div>
          {posts.length === 0 ? (
            <Empty>No posts yet. <Link href="/admin/posts/new" className="link">Write the first one</Link>.</Empty>
          ) : (
            <ul className="card divide-y divide-line">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/posts/${p.id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-mist-50">
                    <span className="min-w-0">
                      <span className="block truncate font-bold">{p.title}</span>
                      <span className="block text-xs text-slate-500">Edited {formatIst(p.updated_at)}</span>
                    </span>
                    <PostBadge status={p.status} publishedAt={p.published_at} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
