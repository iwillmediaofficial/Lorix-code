import 'server-only';
import { Resend } from 'resend';
import { site, whatsappLink } from './site';

type Lead = { fullName: string; email: string; phone: string; typeLabel: string; cityState?: string; message: string; sourcePage?: string };

const esc = (s = '') => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function shell(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f7fc;font-family:Montserrat,Arial,sans-serif;color:#08153f">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
  <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
  <tr><td style="background:#08153f;padding:24px 32px"><img src="${site.url}/brand/logo-white.png" alt="LORIX Energy" height="40" style="display:block"></td></tr>
  <tr><td style="height:4px;background:linear-gradient(90deg,#8dd818,#01bec4,#0076fe)"></td></tr>
  <tr><td style="padding:32px"><h1 style="font-size:22px;margin:0 0 16px">${title}</h1>${body}</td></tr>
  <tr><td style="padding:20px 32px;background:#f4f7fc;font-size:12px;color:#5b6478">${esc(site.legalName)} · ${esc(site.phone)} · ${esc(site.email)}</td></tr>
  </table></td></tr></table></body></html>`;
}

/** Sends the team alert and the customer auto-reply in one Resend batch call. */
export async function sendLeadEmails(lead: Lead): Promise<'sent' | 'skipped' | 'failed'> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return 'skipped';
  const resend = new Resend(key);
  const from = process.env.LEAD_FROM ?? 'LORIX Energy <enquiries@lorixenergy.com>';
  const to = process.env.LEAD_ALERT_TO ?? site.email;
  const phoneDigits = lead.phone.replace(/\D/g, '');
  const wa = `https://wa.me/${phoneDigits.length === 10 ? '91' + phoneDigits : phoneDigits}`;
  const rows = [
    ['Name', lead.fullName], ['Email', lead.email], ['Phone', lead.phone], ['Enquiry', lead.typeLabel],
    ['City / State', lead.cityState || '—'], ['Page', lead.sourcePage || '/'],
  ].map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#5b6478">${k}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`).join('');

  const { error } = await resend.batch.send([
    {
      from, to, replyTo: lead.email,
      subject: `New enquiry: ${lead.typeLabel} from ${lead.fullName}`,
      html: shell('New website enquiry', `<table>${rows}</table><p style="margin:20px 0 8px;color:#5b6478">Message</p><p style="white-space:pre-wrap;margin:0">${esc(lead.message)}</p>
        <p style="margin-top:24px"><a href="${wa}" style="background:#1fa855;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700">Reply on WhatsApp</a></p>`),
    },
    {
      from, to: lead.email, replyTo: to,
      subject: 'We have received your enquiry | LORIX Energy',
      html: shell(`Thank you, ${esc(lead.fullName.split(' ')[0])}`, `<p>We have received your ${esc(lead.typeLabel.toLowerCase())} and our team will respond within 24 hours.</p>
        <p>For anything urgent, message us on WhatsApp and we will pick it up right away.</p>
        <p style="margin-top:24px"><a href="${whatsappLink('Hi LORIX Energy, I just sent an enquiry on your website.')}" style="background:#0076fe;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:700">Chat on WhatsApp</a></p>
        <p style="margin-top:24px;color:#5b6478">${esc(site.tagline)}</p>`),
    },
  ]);
  return error ? 'failed' : 'sent';
}
