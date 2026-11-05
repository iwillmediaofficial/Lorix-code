'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { z } from 'zod';
import {
  AT_COOKIE, clearSession, decodeJwt, passwordLogin, requireStaff, revoke, setSession, staffJson,
} from '@/lib/auth';
import { renderMarkdown } from '@/lib/blog';

/* ---------- Sign in / out ---------- */

export type LoginState = { error?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.' };
  const tokens = await passwordLogin(email, password);
  if (tokens === 'invalid') return { error: 'That email and password did not match.' };
  if (tokens === 'unreachable') return { error: 'Could not reach the sign-in service. Check your internet connection and try again.' };
  // A valid Supabase account is not enough: it needs a staff profile (admin or editor).
  const { sub } = decodeJwt(tokens.access_token);
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?select=id&id=eq.${sub}`, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, authorization: `Bearer ${tokens.access_token}` },
    cache: 'no-store',
  }).catch(() => null);
  const rows = res?.ok ? ((await res.json()) as unknown[]) : [];
  if (!rows.length) {
    await revoke(tokens.access_token);
    return { error: 'This account does not have admin access yet. Ask an admin to add you.' };
  }
  await setSession(tokens);
  const next = String(form.get('next') ?? '');
  redirect(next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin');
}

export async function logout() {
  const at = (await cookies()).get(AT_COOKIE)?.value;
  if (at) await revoke(at);
  await clearSession();
  redirect('/admin/login');
}

/* ---------- Leads ---------- */

const leadUpdate = z.object({
  id: z.string().uuid(),
  status: z.enum(['new', 'contacted', 'won', 'closed']),
  notes: z.string().max(4000).transform((v) => v.trim() || null),
});

export type SaveState = { ok?: boolean; error?: string; at?: number };

export async function updateLead(_prev: SaveState, form: FormData): Promise<SaveState> {
  await requireStaff('admin');
  const parsed = leadUpdate.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: 'Please check the fields.' };
  const { id, ...data } = parsed.data;
  try {
    await staffJson(`leads?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  } catch {
    return { error: 'Could not save. Please try again.' };
  }
  revalidatePath('/admin', 'layout');
  return { ok: true, at: Date.now() };
}

export async function setLeadStatus(id: string, status: string) {
  await requireStaff('admin');
  const p = leadUpdate.pick({ id: true, status: true }).safeParse({ id, status });
  if (!p.success) return;
  await staffJson(`leads?id=eq.${p.data.id}`, { method: 'PATCH', body: JSON.stringify({ status: p.data.status }) });
  revalidatePath('/admin', 'layout');
}

export async function deleteLead(form: FormData) {
  await requireStaff('admin');
  const id = z.string().uuid().parse(form.get('id'));
  await staffJson(`leads?id=eq.${id}`, { method: 'DELETE' });
  revalidatePath('/admin', 'layout');
  redirect('/admin/leads');
}

/* ---------- Blog posts ---------- */

const slugRe = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const optText = (max: number) => z.string().max(max).transform((v) => v.trim() || null);

const postSchema = z.object({
  id: z.string().uuid().optional().or(z.literal('').transform(() => undefined)),
  title: z.string().trim().min(5, 'Title needs at least 5 characters').max(140),
  slug: z.string().trim().toLowerCase().regex(slugRe, 'Use lowercase letters, numbers and hyphens'),
  excerpt: z.string().trim().min(20, 'Write a short summary (20+ characters)').max(320),
  body_md: z.string().min(20, 'The article is empty'),
  cover_url: optText(500),
  cover_alt: optText(200),
  tags: z.string().max(300).transform((v) => [...new Set(v.split(',').map((t) => t.trim()).filter(Boolean))].slice(0, 8)),
  status: z.enum(['draft', 'published']),
  published_at: z.string().transform((v) => (v ? new Date(v).toISOString() : null)),
  seo_title: optText(70),
  seo_description: optText(170),
  old_slug: z.string().optional(),
});

export type PostState = { error?: string; fieldErrors?: Record<string, string>; ok?: boolean; id?: string; at?: number };

function refreshBlog(...slugs: (string | undefined)[]) {
  revalidateTag('posts');
  for (const s of new Set(slugs)) if (s) revalidateTag(`post:${s}`);
  revalidatePath('/blog');
  revalidatePath('/sitemap.xml');
}

export async function savePost(_prev: PostState, form: FormData): Promise<PostState> {
  const staff = await requireStaff();
  const parsed = postSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { error: 'Please fix the highlighted fields.', fieldErrors };
  }
  const { id, old_slug, ...d } = parsed.data;
  if (d.cover_url && !/^(https:\/\/|\/media\/)/.test(d.cover_url)) return { error: 'Cover image must be an uploaded image or an https link.', fieldErrors: { cover_url: 'Invalid image link' } };
  const words = d.body_md.trim().split(/\s+/).length;
  const row = {
    ...d,
    published_at: d.status === 'published' ? d.published_at ?? new Date().toISOString() : d.published_at,
    reading_minutes: Math.max(1, Math.round(words / 200)),
  };

  let savedId = id;
  try {
    if (id) {
      await staffJson(`posts?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(row) });
    } else {
      const rows = await staffJson<{ id: string }[]>('posts?select=id', {
        method: 'POST',
        prefer: 'return=representation',
        body: JSON.stringify({ ...row, author_id: staff.id, author_name: staff.display_name }),
      });
      savedId = rows[0]?.id;
    }
  } catch (e) {
    const code = (e as { code?: string }).code;
    if (code === '23505') return { error: 'Another post already uses this URL slug.', fieldErrors: { slug: 'Already in use' } };
    if (code === '23514') return { error: 'One of the fields is too long or in the wrong format.' };
    console.error('savePost failed', e);
    return { error: 'Could not save the post. Please try again.' };
  }
  refreshBlog(d.slug, old_slug);
  revalidatePath('/admin/posts');
  if (!id && savedId) redirect(`/admin/posts/${savedId}?saved=1`);
  return { ok: true, id: savedId, at: Date.now() };
}

export async function deletePost(form: FormData) {
  await requireStaff('admin');
  const id = z.string().uuid().parse(form.get('id'));
  const slug = String(form.get('slug') ?? '');
  await staffJson(`posts?id=eq.${id}`, { method: 'DELETE' });
  refreshBlog(slug);
  redirect('/admin/posts');
}

export async function previewMarkdown(md: string) {
  await requireStaff();
  return renderMarkdown(String(md).slice(0, 100_000));
}
