import Link from 'next/link';
import { requireStaff, staffFetch } from '@/lib/auth';
import { leadFilterQuery, leadStatuses, typeLabel } from '@/lib/admin-leads';
import { enquiryTypes } from '@/lib/enquiry-schema';
import { PageTitle, StatusBadge, formatIst, Empty } from '@/components/admin/ui';

export const metadata = { title: 'Leads' };

const PAGE = 25;
type Row = { id: string; created_at: string; full_name: string; email: string; phone: string; enquiry_type: string; city_state: string | null; status: string };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireStaff('admin');
  const sp = await searchParams;
  const params = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]);
  const page = Math.max(1, Number(sp.page) || 1);
  const filters = leadFilterQuery(params);
  const res = await staffFetch(
    `leads?select=id,created_at,full_name,email,phone,enquiry_type,city_state,status&order=created_at.desc&limit=${PAGE}&offset=${(page - 1) * PAGE}${filters}`,
    { prefer: 'count=exact' },
  );
  const rows: Row[] = res.ok ? await res.json() : [];
  const total = Number(res.headers.get('content-range')?.split('/')[1] ?? rows.length);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const qs = (patch: Record<string, string | null>) => {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) (v ? p.set(k, v) : p.delete(k));
    const s = p.toString();
    return s ? `?${s}` : '';
  };
  const exportQs = qs({ page: null });

  return (
    <>
      <PageTitle title="Leads" sub={`${total} ${total === 1 ? 'enquiry' : 'enquiries'}${filters ? ' match your filters' : ''}`}>
        <a href={`/admin/leads/export${exportQs}`} className="btn btn-outline">Download CSV</a>
      </PageTitle>

      <form className="card mb-4 grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto_auto]" role="search">
        <input name="q" defaultValue={sp.q ?? ''} placeholder="Search name, email, phone or city" aria-label="Search leads" className="field" />
        <select name="status" defaultValue={sp.status ?? ''} aria-label="Status" className="field">
          <option value="">All statuses</option>
          {leadStatuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select name="type" defaultValue={sp.type ?? ''} aria-label="Enquiry type" className="field">
          <option value="">All types</option>
          {enquiryTypes.map((t) => <option key={t.value} value={t.value}>{typeLabel(t.value)}</option>)}
        </select>
        <div className="flex gap-2">
          <button className="btn btn-primary flex-1">Filter</button>
          {filters && <Link href="/admin/leads" className="btn btn-outline">Clear</Link>}
        </div>
      </form>

      {rows.length === 0 ? (
        <Empty>{filters ? 'No leads match these filters.' : 'No enquiries yet. They will appear here as soon as someone uses a form on the website.'}</Empty>
      ) : (
        <>
          {/* Table on wide screens */}
          <div className="card hidden overflow-hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-mist-100 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.id} className="relative hover:bg-mist-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/leads/${r.id}`} className="font-bold after:absolute after:inset-0">{r.full_name}</Link>
                      {r.city_state && <span className="block text-xs text-slate-500">{r.city_state}</span>}
                    </td>
                    <td className="px-4 py-3"><span className="block">{r.email}</span><span className="block text-xs text-slate-500">{r.phone}</span></td>
                    <td className="px-4 py-3">{typeLabel(r.enquiry_type)}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatIst(r.created_at)}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Cards on phones */}
          <ul className="space-y-3 md:hidden">
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/leads/${r.id}`} className="card block p-4">
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-bold">{r.full_name}</span>
                    <StatusBadge status={r.status} />
                  </span>
                  <span className="mt-1 block text-sm text-slate-500">{typeLabel(r.enquiry_type)} · {formatIst(r.created_at)}</span>
                  <span className="mt-1 block truncate text-sm">{r.phone} · {r.email}</span>
                </Link>
              </li>
            ))}
          </ul>
          {pages > 1 && (
            <nav aria-label="Pages" className="mt-5 flex items-center justify-between text-sm">
              {page > 1 ? <Link href={qs({ page: String(page - 1) })} className="btn btn-outline">Previous</Link> : <span />}
              <span className="text-slate-500">Page {page} of {pages}</span>
              {page < pages ? <Link href={qs({ page: String(page + 1) })} className="btn btn-outline">Next</Link> : <span />}
            </nav>
          )}
        </>
      )}
    </>
  );
}
