import 'server-only';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const dbConfigured = Boolean(url && key);

/** Minimal Supabase REST client (no SDK in the server bundle). */
export async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  if (!url || !key) throw new Error('Supabase is not configured');
  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text).message ?? text; } catch {}
    throw new Error(msg);
  }
  return (text ? JSON.parse(text) : null) as T;
}

/** Cached read of a REST resource, tagged so the revalidate webhook can refresh it. */
export async function select<T>(path: string, tags: string[]): Promise<T> {
  if (!url || !key) throw new Error('Supabase is not configured');
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, authorization: `Bearer ${key}` },
    next: { tags, revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  return res.json() as Promise<T>;
}
