import { requireStaff, staffJson } from '@/lib/auth';
import { AdminNav } from '@/components/admin/AdminNav';
import { logout } from '../actions';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();
  let newLeads = 0;
  if (staff.role === 'admin') {
    const counts = await staffJson<{ status: string; n: number }[]>('rpc/lead_counts', { method: 'POST', body: '{}' }).catch(() => []);
    newLeads = Number(counts.find((c) => c.status === 'new')?.n ?? 0);
  }
  return (
    <div className="lg:grid lg:min-h-svh lg:grid-cols-[15rem_1fr]">
      <aside className="sticky top-0 z-30 flex flex-wrap items-center gap-x-3 gap-y-2 bg-navy-900 px-4 py-3 text-white lg:flex-nowrap lg:h-svh lg:flex-col lg:items-stretch lg:gap-6 lg:px-4 lg:py-6">
        <a href="/admin" className="shrink-0 lg:px-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-white.svg" alt="LORIX Energy admin" width={96} height={44} className="h-8 w-auto lg:h-10" />
        </a>
        <AdminNav isAdmin={staff.role === 'admin'} newLeads={newLeads} />
        <div className="ml-auto flex items-center gap-2 lg:mt-auto lg:ml-0 lg:flex-col lg:items-stretch">
          <div className="hidden px-2 text-sm lg:block">
            <p className="font-bold">{staff.display_name}</p>
            <p className="truncate text-white/60">{staff.email}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-cyan-400">{staff.role}</p>
          </div>
          <a href="/" target="_blank" className="hidden rounded-lg px-2 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white lg:block">View website ↗</a>
          <form action={logout}>
            <button className="whitespace-nowrap rounded-lg px-2 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white lg:w-full lg:text-left">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
