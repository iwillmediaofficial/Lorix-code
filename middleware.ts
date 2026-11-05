import { NextResponse, type NextRequest } from 'next/server';

const AT = 'lx_at';
const RT = 'lx_rt';
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function expiresSoon(token: string) {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(part.padEnd(part.length + ((4 - (part.length % 4)) % 4), '=')));
    return !exp || exp * 1000 < Date.now() + 60_000;
  } catch {
    return true;
  }
}

/** Keeps admin sessions fresh and sends signed-out visitors to the login page. */
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isLogin = pathname === '/admin/login';
  const at = req.cookies.get(AT)?.value;
  const rt = req.cookies.get(RT)?.value;

  if (at && !expiresSoon(at)) return NextResponse.next();

  if (rt && SB_URL && SB_KEY) {
    const res = await fetch(`${SB_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { apikey: SB_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({ refresh_token: rt }),
    }).catch(() => null);
    if (res?.ok) {
      const t = (await res.json()) as { access_token: string; refresh_token: string; expires_in: number };
      req.cookies.set(AT, t.access_token);
      req.cookies.set(RT, t.refresh_token);
      const out = NextResponse.next({ request: { headers: req.headers } });
      const base = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/admin' };
      out.cookies.set(AT, t.access_token, { ...base, maxAge: t.expires_in });
      out.cookies.set(RT, t.refresh_token, { ...base, maxAge: 60 * 60 * 24 * 7 });
      return out;
    }
  }

  if (isLogin) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.search = pathname === '/admin' ? '' : `?next=${encodeURIComponent(pathname + search)}`;
  const out = NextResponse.redirect(url);
  out.cookies.delete({ name: AT, path: '/admin' });
  out.cookies.delete({ name: RT, path: '/admin' });
  return out;
}

export const config = { matcher: ['/admin', '/admin/:path*'] };
