'use server';

import { headers } from 'next/headers';
import { enquirySchema, enquiryTypes, type FieldErrors } from '@/lib/enquiry-schema';
import { rpc, dbConfigured } from '@/lib/db';
import { sendLeadEmails } from '@/lib/email';

export type EnquiryState = { ok: boolean; message?: string; errors?: FieldErrors };

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifyTurnstile(token: string | null, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== 'production'; // dev without keys
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export async function submitEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  // Honeypot: real people never see or fill this field.
  if (form.get('company_website')) return { ok: true };

  const parsed = enquirySchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    const errors: FieldErrors = {};
    for (const issue of parsed.error.issues) errors[issue.path[0] as keyof FieldErrors] ??= issue.message;
    return { ok: false, errors, message: 'Please check the highlighted fields.' };
  }
  const d = parsed.data;

  const h = await headers();
  const ip = h.get('cf-connecting-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '0.0.0.0';
  if (!(await verifyTurnstile(form.get('cf-turnstile-response') as string | null, ip))) {
    return { ok: false, message: 'We could not verify the spam check. Please try again.' };
  }

  if (!dbConfigured || !process.env.SERVER_DB_TOKEN) {
    console.error('Enquiry received but the database is not configured');
    return { ok: false, message: 'Our form is temporarily unavailable. Please call or WhatsApp us.' };
  }

  const ipHash = await sha256(`${process.env.IP_HASH_SALT ?? 'lorix'}:${ip}`);
  let leadId: string;
  try {
    leadId = await rpc<string>('submit_lead', {
      p_token: process.env.SERVER_DB_TOKEN,
      p_full_name: d.fullName,
      p_email: d.email,
      p_phone: d.phone,
      p_enquiry_type: d.enquiryType,
      p_city_state: d.cityState,
      p_message: d.message,
      p_source_page: d.sourcePage,
      p_utm: null,
      p_ip_hash: ipHash,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    if (msg.includes('rate_limited')) return { ok: false, message: 'You have sent several enquiries already. Please wait a few minutes, or reach us on WhatsApp.' };
    console.error('submit_lead failed', msg);
    return { ok: false, message: 'Something went wrong on our side. Please try again or call us.' };
  }

  const typeLabel = enquiryTypes.find((t) => t.value === d.enquiryType)?.label ?? d.enquiryType;
  const status = await sendLeadEmails({ ...d, typeLabel }).catch((e) => {
    console.error('Resend failed', e);
    return 'failed' as const;
  });
  await rpc('mark_lead_email', { p_token: process.env.SERVER_DB_TOKEN, p_id: leadId, p_status: status }).catch(() => {});

  return { ok: true };
}
