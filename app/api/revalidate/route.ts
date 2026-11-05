import { revalidateTag, revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

/** Called by a Supabase database webhook whenever a post is inserted, updated or deleted. */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get('x-revalidate-secret') !== secret) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { record?: { slug?: string }; old_record?: { slug?: string } };
  revalidateTag('posts');
  for (const slug of [body.record?.slug, body.old_record?.slug]) if (slug) revalidateTag(`post:${slug}`);
  revalidatePath('/');
  revalidatePath('/blog');
  return NextResponse.json({ ok: true });
}
