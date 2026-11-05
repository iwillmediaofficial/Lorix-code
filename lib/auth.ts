import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Admin sign-in with Supabase Auth, without the SDK: tokens live in httpOnly cookies scoped to /admin,
 * middleware.ts refreshes them, and every data call goes to Supabase with the signed-in user's token,
 * so Postgres row level security decides what each person can see or change.
 */
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const AT_COOKIE = 'lx_at';
export const RT_COOKIE = 'lx_rt';
export const cookieBase = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/admin' };

export type Staff = { id: string; email: string; display_name: string; role: 'admin' | 'editor' };
export type Tokens = { access_token: string; refresh_token: string; expires_in: number };

export function decodeJwt(token: string): { sub?: string; exp?: number; email?: string } {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(part.padEnd(part.length + ((4 - (part.length % 4)) % 4), '=')));
  } catch {
    return {};
  }
}

async function authCall(path: string, body: unknown, token?: string) {
  const res = await fetch(`${SB_URL}/auth/v1/${path}`, {
    method: 'POST',
    headers: { apikey: SB_KEY, 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  return res;
}

export async function passwordLogin(email: string, password: string): Promise<Tokens | 'invalid' | 'unreachable'> {
  try {
    const res = await authCall('token?grant_type=password', { email, password });
    if (res.ok) return (await res.json()) as Tokens;
    return res.status === 400 || res.status === 401 ? 'invalid' : 'unreachable';
  } catch {
    return 'unreachable';
  }
}

export async function refreshTokens(refresh_token: string): Promise<Tokens | null> {
  const res = await authCall('token?grant_type=refresh_token', { refresh_token }).catch(() => null);
  return res?.ok ? ((await res.json()) as Tokens) : null;
}

export async function revoke(access_token: string) {
  await authCall('logout', {}, access_token).catch(() => {});
}

export async function setSession(t: Tokens) {
  const jar = await cookies();
  jar.set(AT_COOKIE, t.access_token, { ...cookieBase, maxAge: t.expires_in });
  jar.set(RT_COOKIE, t.refresh_token, { ...cookieBase, maxAge: 60 * 60 * 24 * 7 });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete({ name: AT_COOKIE, path: '/admin' });
  jar.delete({ name: RT_COOKIE, path: '/admin' });
}

async function token() {
  return (await cookies()).get(AT_COOKIE)?.value ?? null;
}

/** Supabase REST call as the signed-in user. RLS applies. */
export async function staffFetch(path: string, init: RequestInit & { prefer?: string } = {}) {
  const t = await token();
  if (!t) throw new Error('Not signed in');
  const { prefer, headers, ...rest } = init;
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    ...rest,
    cache: 'no-store',
    headers: {
      apikey: SB_KEY,
      authorization: `Bearer ${t}`,
      'content-type': 'application/json',
      ...(prefer ? { prefer } : {}),
      ...headers,
    },
  });
}

export async function staffJson<T>(path: string, init: RequestInit & { prefer?: string } = {}): Promise<T> {
  const res = await staffFetch(path, init);
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    let code = '';
    try {
      const j = JSON.parse(text);
      msg = j.message ?? text;
      code = j.code ?? '';
    } catch {}
    throw Object.assign(new Error(msg), { code, status: res.status });
  }
  return (text ? JSON.parse(text) : null) as T;
}

/** The signed-in staff member, or null. The profile read doubles as token verification by Supabase. */
export const getStaff = cache(async (): Promise<Staff | null> => {
  const t = await token();
  if (!t) return null;
  const { sub, email } = decodeJwt(t);
  if (!sub || !/^[0-9a-f-]{36}$/.test(sub)) return null;
  try {
    const rows = await staffJson<Omit<Staff, 'email'>[]>(`profiles?select=id,display_name,role&id=eq.${sub}`);
    return rows[0] ? { ...rows[0], email: email ?? '' } : null;
  } catch {
    return null;
  }
});

export async function requireStaff(role: 'editor' | 'admin' = 'editor'): Promise<Staff> {
  const s = await getStaff();
  if (!s) redirect('/admin/login');
  if (role === 'admin' && s.role !== 'admin') redirect('/admin');
  return s;
}
