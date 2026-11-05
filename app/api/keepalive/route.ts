import { NextResponse } from 'next/server';
import { rpc } from '@/lib/db';

export const dynamic = 'force-dynamic';

/** Daily Cron Trigger target: a tiny query so the free Supabase project never pauses. */
export async function GET(req: Request) {
  const cron = process.env.CRON_SECRET;
  if (!cron || req.headers.get('authorization') !== `Bearer ${cron}`) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const cleaned = await rpc<number>('keepalive', { p_token: process.env.SERVER_DB_TOKEN });
    return NextResponse.json({ ok: true, cleaned });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
