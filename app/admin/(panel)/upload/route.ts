import { getStaff } from '@/lib/auth';
import { ALLOWED_TYPES, MEDIA_BASE, mediaBucket } from '@/lib/media';

const MAX_BYTES = 5 * 1024 * 1024;

/** Image upload for the blog editor. The browser has already resized the image to WebP. */
export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== req.headers.get('host')) return Response.json({ error: 'Bad origin' }, { status: 403 });
  if (!(await getStaff())) return Response.json({ error: 'Please sign in again.' }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'No file received.' }, { status: 400 });
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) return Response.json({ error: 'Use a JPG, PNG, WebP or AVIF image.' }, { status: 415 });
  if (file.size > MAX_BYTES) return Response.json({ error: 'Images must be under 5 MB.' }, { status: 413 });

  const bucket = await mediaBucket();
  if (!bucket) return Response.json({ error: 'Image storage is not connected.' }, { status: 503 });

  const now = new Date();
  const base = String(form?.get('name') ?? 'image').toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 50) || 'image';
  const key = `blog/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${base}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' },
  });
  return Response.json({ url: `${MEDIA_BASE}/${key}` });
}
