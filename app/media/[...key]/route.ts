import { mediaBucket, MEDIA_KEY } from '@/lib/media';

/** Serves uploaded blog images from R2 (used locally, and as a fallback if the media domain is not set). */
export async function GET(req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join('/');
  if (!MEDIA_KEY.test(key)) return new Response('Not found', { status: 404 });
  const bucket = await mediaBucket();
  const obj = await bucket?.get(key);
  if (!obj) return new Response('Not found', { status: 404 });
  if (req.headers.get('if-none-match') === obj.httpEtag) return new Response(null, { status: 304 });
  return new Response(obj.body, {
    headers: {
      'content-type': obj.httpMetadata?.contentType ?? 'application/octet-stream',
      'cache-control': 'public, max-age=31536000, immutable',
      etag: obj.httpEtag,
      'x-content-type-options': 'nosniff',
    },
  });
}
