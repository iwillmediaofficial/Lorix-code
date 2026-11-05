import { leadStatuses } from '@/lib/admin-leads';

export function PageTitle({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = leadStatuses.find((x) => x.value === status);
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${s?.cls ?? ''}`}>{s?.label ?? status}</span>;
}

export function PostBadge({ status, publishedAt }: { status: string; publishedAt: string | null }) {
  const scheduled = status === 'published' && publishedAt && new Date(publishedAt) > new Date();
  const [label, cls] = scheduled
    ? ['Scheduled', 'bg-peri-200/40 text-navy-800']
    : status === 'published'
      ? ['Published', 'bg-green-400/20 text-green-700']
      : ['Draft', 'bg-slate-500/10 text-slate-500'];
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}>{label}</span>;
}

const ist = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' });
export const formatIst = (iso: string | null) => (iso ? ist.format(new Date(iso)) : '—');

export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="card px-6 py-14 text-center text-slate-500">{children}</div>;
}
