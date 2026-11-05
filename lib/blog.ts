import 'server-only';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { select, dbConfigured } from './db';

export type Post = {
  slug: string; title: string; excerpt: string; body_md: string; cover_url: string | null; cover_alt: string | null;
  tags: string[]; published_at: string; seo_title: string | null; seo_description: string | null; reading_minutes: number | null; author_name: string; updated_at: string;
};

const LIST = 'slug,title,excerpt,cover_url,cover_alt,tags,published_at,reading_minutes,author_name,updated_at';

export async function getPosts(limit = 50): Promise<Omit<Post, 'body_md' | 'seo_title' | 'seo_description'>[]> {
  if (!dbConfigured) return [];
  try {
    return await select(`posts?select=${LIST}&order=published_at.desc&limit=${limit}`, ['posts']);
  } catch (e) {
    console.error('getPosts failed', e);
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!dbConfigured || !/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const rows = await select<Post[]>(`posts?select=*&slug=eq.${slug}&limit=1`, ['posts', `post:${slug}`]);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

/** Markdown to HTML with a strict allow-list, so pasted scripts can never run. */
export function renderMarkdown(md: string) {
  const html = marked.parse(md, { async: false }) as string;
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h2', 'h3', 'h4']),
    allowedAttributes: { a: ['href', 'title', 'rel', 'target'], img: ['src', 'alt', 'width', 'height', 'loading'] },
    allowedSchemes: ['https', 'mailto', 'tel'],
    transformTags: {
      a: (tag, attribs) => ({ tagName: 'a', attribs: attribs.href?.startsWith('http') ? { ...attribs, rel: 'noopener noreferrer', target: '_blank' } : attribs }),
      img: (tag, attribs) => ({ tagName: 'img', attribs: { ...attribs, loading: 'lazy' } }),
    },
  });
}

export function headingsOf(md: string) {
  return [...md.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim());
}

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
