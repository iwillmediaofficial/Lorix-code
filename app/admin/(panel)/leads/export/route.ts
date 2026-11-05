import { getStaff, staffFetch } from '@/lib/auth';
import { leadFilterQuery } from '@/lib/admin-leads';

/** Downloads the filtered leads as a CSV file (admins only). */
export async function GET(req: Request) {
  const staff = await getStaff();
  if (staff?.role !== 'admin') return new Response('Forbidden', { status: 403 });
  const params = new URL(req.url).searchParams;
  const cols = 'created_at,full_name,email,phone,enquiry_type,city_state,status,message,notes,source_page';
  const res = await staffFetch(`leads?select=${cols}&order=created_at.desc&limit=5000${leadFilterQuery(params)}`, {
    headers: { accept: 'text/csv' },
  });
  if (!res.ok) return new Response('Export failed', { status: 502 });
  const day = new Date().toISOString().slice(0, 10);
  return new Response(await res.text(), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="lorix-leads-${day}.csv"`,
      'cache-control': 'no-store',
    },
  });
}
