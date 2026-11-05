import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireStaff, staffJson } from '@/lib/auth';
import { typeLabel } from '@/lib/admin-leads';
import { PageTitle, StatusBadge, formatIst } from '@/components/admin/ui';
import { LeadForm } from '@/components/admin/LeadForm';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { deleteLead } from '../../../actions';

export const metadata = { title: 'Lead' };

type Lead = {
  id: string; created_at: string; updated_at: string | null; full_name: string; email: string; phone: string; enquiry_type: string;
  city_state: string | null; message: string; source_page: string | null; status: string; email_status: string; notes: string | null;
};

const waNumber = (phone: string) => {
  const d = phone.replace(/\D/g, '');
  return d.length === 10 ? `91${d}` : d;
};

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff('admin');
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const rows = await staffJson<Lead[]>(`leads?select=*&id=eq.${id}`).catch(() => []);
  const lead = rows[0];
  if (!lead) notFound();
  const first = lead.full_name.split(' ')[0];
  const mail = `mailto:${lead.email}?subject=${encodeURIComponent('Your enquiry with LORIX Energy')}&body=${encodeURIComponent(`Hi ${first},\n\nThank you for contacting LORIX Energy.\n\n`)}`;
  const wa = `https://wa.me/${waNumber(lead.phone)}?text=${encodeURIComponent(`Hi ${first}, this is ${staff.display_name} from LORIX Energy, following up on your enquiry.`)}`;

  return (
    <>
      <Link href="/admin/leads" className="link mb-4 inline-block text-sm">← All leads</Link>
      <PageTitle title={lead.full_name} sub={`${typeLabel(lead.enquiry_type)} · received ${formatIst(lead.created_at)}`}>
        <StatusBadge status={lead.status} />
      </PageTitle>

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section className="card p-5 sm:p-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Message</h2>
            <p className="whitespace-pre-wrap leading-relaxed">{lead.message}</p>
          </section>
          <section className="card p-5 sm:p-6">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">Follow-up</h2>
            <LeadForm id={lead.id} status={lead.status} notes={lead.notes ?? ''} />
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card p-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Contact</h2>
            <dl className="space-y-3 text-sm">
              <div><dt className="text-slate-500">Phone</dt><dd className="font-semibold">{lead.phone}</dd></div>
              <div><dt className="text-slate-500">Email</dt><dd className="break-all font-semibold">{lead.email}</dd></div>
              {lead.city_state && <div><dt className="text-slate-500">City / State</dt><dd className="font-semibold">{lead.city_state}</dd></div>}
              <div><dt className="text-slate-500">Sent from page</dt><dd className="font-semibold">{lead.source_page ?? '—'}</dd></div>
              <div><dt className="text-slate-500">Auto emails</dt><dd className="font-semibold capitalize">{lead.email_status}</dd></div>
            </dl>
            <div className="mt-5 grid gap-2">
              <a href={`tel:${lead.phone.replace(/\s/g, '')}`} className="btn btn-primary">Call</a>
              <a href={wa} target="_blank" rel="noopener" className="btn btn-outline">WhatsApp</a>
              <a href={mail} className="btn btn-outline">Reply by email</a>
            </div>
          </section>
          <section className="card p-5">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Remove</h2>
            <p className="mb-3 text-sm text-slate-500">For spam, or when someone asks for their data to be deleted.</p>
            <DeleteButton action={deleteLead} id={lead.id} label="Delete lead" confirmText={`Delete the enquiry from ${lead.full_name}? This cannot be undone.`} />
          </section>
        </aside>
      </div>
    </>
  );
}
