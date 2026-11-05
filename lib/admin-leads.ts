import { enquiryTypes } from './enquiry-schema';

export const leadStatuses = [
  { value: 'new', label: 'New', cls: 'bg-blue-500/10 text-blue-600' },
  { value: 'contacted', label: 'Contacted', cls: 'bg-amber-500/15 text-amber-700' },
  { value: 'won', label: 'Won', cls: 'bg-green-400/20 text-green-700' },
  { value: 'closed', label: 'Closed', cls: 'bg-slate-500/10 text-slate-500' },
] as const;

export const typeLabel = (v: string) => enquiryTypes.find((t) => t.value === v)?.label.replace('Sodium-ion: register interest', 'Sodium-ion interest') ?? v;

/** Turns ?status=&type=&q= into PostgREST filters, allowing only known values and safe search text. */
export function leadFilterQuery(params: URLSearchParams) {
  let q = '';
  const status = params.get('status');
  if (status && leadStatuses.some((s) => s.value === status)) q += `&status=eq.${status}`;
  const type = params.get('type');
  if (type && enquiryTypes.some((t) => t.value === type)) q += `&enquiry_type=eq.${type}`;
  const search = (params.get('q') ?? '').replace(/[^\p{L}\p{N}@.+ _-]/gu, '').trim().slice(0, 60);
  if (search) {
    const s = encodeURIComponent(`*${search}*`);
    q += `&or=(full_name.ilike.${s},email.ilike.${s},phone.ilike.${s},city_state.ilike.${s})`;
  }
  return q;
}
