import 'server-only';
import { getCloudflareContext } from '@opennextjs/cloudflare';

/** Just the parts of the R2 bucket binding we use (keeps us free of the workers-types package). */
export type R2Object = { body: ReadableStream; httpEtag: string; size: number; httpMetadata?: { contentType?: string } };
type R2Bucket = {
  put(key: string, value: ArrayBuffer, opts?: { httpMetadata?: { contentType?: string; cacheControl?: string } }): Promise<unknown>;
  get(key: string): Promise<R2Object | null>;
};

export async function mediaBucket(): Promise<R2Bucket | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return ((env as unknown as { MEDIA?: R2Bucket }).MEDIA ?? null);
  } catch {
    return null;
  }
}

/** Public base URL for uploaded media: the R2 custom domain in production, or the /media route. */
export const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_URL || '/media').replace(/\/$/, '');

export const MEDIA_KEY = /^blog\/\d{4}\/\d{2}\/[a-z0-9-]{1,80}\.(webp|jpg|png|avif)$/;

export const ALLOWED_TYPES: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/avif': 'avif',
};
