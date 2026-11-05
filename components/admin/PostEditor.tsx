'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { savePost, deletePost, previewMarkdown, type PostState } from '@/app/admin/actions';
import { uploadImage } from './upload';
import { DeleteButton } from './DeleteButton';

export type EditablePost = {
  id: string; slug: string; title: string; excerpt: string; body_md: string; cover_url: string | null; cover_alt: string | null;
  tags: string[]; status: 'draft' | 'published'; published_at: string | null; seo_title: string | null; seo_description: string | null;
};

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80);

/** ISO string -> value for <input type="datetime-local"> in the browser's own time zone. */
const toLocalInput = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

function Counter({ value, max }: { value: string; max: number }) {
  return <span className={`text-xs ${value.length > max ? 'font-bold text-red-700' : 'text-slate-500'}`}>{value.length}/{max}</span>;
}

export function PostEditor({ post, isAdmin, justCreated }: { post?: EditablePost; isAdmin: boolean; justCreated?: boolean }) {
  const [state, action, pending] = useActionState<PostState, FormData>(savePost, {});
  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [body, setBody] = useState(post?.body_md ?? '');
  const [cover, setCover] = useState(post?.cover_url ?? '');
  const [coverAlt, setCoverAlt] = useState(post?.cover_alt ?? '');
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status ?? 'draft');
  const [when, setWhen] = useState(toLocalInput(post?.published_at ?? null));
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? '');
  const [seoDesc, setSeoDesc] = useState(post?.seo_description ?? '');
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewing, startPreview] = useTransition();
  const [uploading, setUploading] = useState<'' | 'cover' | 'body'>('');
  const [uploadError, setUploadError] = useState('');
  const [dirty, setDirty] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fe = state.fieldErrors ?? {};

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  useEffect(() => { if (state.ok) setDirty(false); }, [state]);

  const onTitle = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const wrap = (before: string, after = before, placeholder = 'text') => {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const sel = body.slice(s, e) || placeholder;
    const next = body.slice(0, s) + before + sel + after + body.slice(e);
    setBody(next);
    setDirty(true);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + before.length, s + before.length + sel.length); });
  };
  const linePrefix = (prefix: string) => {
    const el = bodyRef.current;
    if (!el) return;
    const s = body.lastIndexOf('\n', el.selectionStart - 1) + 1;
    setBody(body.slice(0, s) + prefix + body.slice(s));
    setDirty(true);
    requestAnimationFrame(() => el.focus());
  };
  const insertAtCursor = (text: string) => {
    const el = bodyRef.current;
    const at = el?.selectionStart ?? body.length;
    setBody(body.slice(0, at) + text + body.slice(at));
    setDirty(true);
  };

  const onUpload = async (file: File | undefined, target: 'cover' | 'body') => {
    if (!file) return;
    setUploadError('');
    setUploading(target);
    try {
      const url = await uploadImage(file);
      if (target === 'cover') setCover(url);
      else insertAtCursor(`\n\n![Describe the image](${url})\n\n`);
      setDirty(true);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setUploading('');
    }
  };

  const showPreview = () => {
    setTab('preview');
    startPreview(async () => setPreviewHtml(await previewMarkdown(body)));
  };

  const publishedIso = when ? new Date(when).toISOString() : '';
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  const isLive = post?.status === 'published' && post.published_at && new Date(post.published_at) <= new Date();

  return (
    <>
    <form action={action} onChange={() => setDirty(true)} className="grid gap-6 xl:grid-cols-[1fr_20rem]">
      <input type="hidden" name="id" value={post?.id ?? ''} />
      <input type="hidden" name="old_slug" value={post?.slug ?? ''} />
      <input type="hidden" name="published_at" value={publishedIso} />
      <input type="hidden" name="body_md" value={body} />
      <input type="hidden" name="cover_url" value={cover} />

      <div className="min-w-0 space-y-5">
        {(justCreated || state.ok) && !dirty && (
          <p role="status" className="rounded-lg bg-green-400/20 px-4 py-3 text-sm font-semibold text-green-700">
            Saved.{status === 'published' ? ' The blog updates within a few seconds.' : ' It stays hidden until you publish it.'}
          </p>
        )}
        {state.error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{state.error}</p>}

        <div className="card space-y-5 p-5 sm:p-6">
          <div>
            <div className="mb-1.5 flex justify-between"><label htmlFor="title" className="text-sm font-bold">Title</label><Counter value={title} max={140} /></div>
            <input id="title" name="title" value={title} onChange={(e) => onTitle(e.target.value)} required maxLength={140} className="field text-lg font-bold" aria-invalid={!!fe.title} />
            {fe.title && <p className="mt-1 text-sm text-red-700">{fe.title}</p>}
          </div>
          <div>
            <label htmlFor="slug" className="mb-1.5 block text-sm font-bold">Web address</label>
            <div className="flex items-center gap-1 rounded-[0.65rem] border-[1.5px] border-line bg-mist-50 pl-3 focus-within:border-blue-500">
              <span className="shrink-0 text-sm text-slate-500">/blog/</span>
              <input id="slug" name="slug" value={slug} onChange={(e) => { setSlug(slugify(e.target.value) || e.target.value.toLowerCase()); setSlugTouched(true); }} required className="min-h-[2.6rem] w-full bg-transparent pr-3 outline-none" aria-invalid={!!fe.slug} />
            </div>
            {fe.slug && <p className="mt-1 text-sm text-red-700">{fe.slug}</p>}
            {isLive && slug !== post?.slug && <p className="mt-1 text-sm text-amber-700">Changing the address of a live post breaks links people have shared.</p>}
          </div>
          <div>
            <div className="mb-1.5 flex justify-between"><label htmlFor="excerpt" className="text-sm font-bold">Summary</label><Counter value={excerpt} max={320} /></div>
            <textarea id="excerpt" name="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} maxLength={320} required className="field min-h-0" placeholder="One or two sentences shown on the blog list and in search results." aria-invalid={!!fe.excerpt} />
            {fe.excerpt && <p className="mt-1 text-sm text-red-700">{fe.excerpt}</p>}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center gap-1 border-b border-line bg-mist-50 px-2 py-2">
            <div role="tablist" className="mr-2 flex rounded-lg bg-white p-0.5 shadow-sm">
              <button type="button" role="tab" aria-selected={tab === 'write'} onClick={() => setTab('write')} className={`rounded-md px-3 py-1.5 text-sm font-bold ${tab === 'write' ? 'bg-navy-900 text-white' : ''}`}>Write</button>
              <button type="button" role="tab" aria-selected={tab === 'preview'} onClick={showPreview} className={`rounded-md px-3 py-1.5 text-sm font-bold ${tab === 'preview' ? 'bg-navy-900 text-white' : ''}`}>Preview</button>
            </div>
            {tab === 'write' && (
              <>
                {[
                  ['H2', () => linePrefix('## '), 'Section heading'],
                  ['H3', () => linePrefix('### '), 'Sub-heading'],
                  ['B', () => wrap('**'), 'Bold'],
                  ['I', () => wrap('_'), 'Italic'],
                  ['Link', () => wrap('[', '](https://)', 'link text'), 'Link'],
                  ['• List', () => linePrefix('- '), 'Bullet list'],
                  ['1. List', () => linePrefix('1. '), 'Numbered list'],
                  ['Quote', () => linePrefix('> '), 'Quote'],
                ].map(([label, fn, title]) => (
                  <button key={label as string} type="button" title={title as string} onClick={fn as () => void} className="rounded-md px-2.5 py-1.5 text-sm font-bold hover:bg-white">
                    {label as string}
                  </button>
                ))}
                <label className="cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-bold hover:bg-white">
                  {uploading === 'body' ? 'Uploading…' : 'Image'}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(e) => { onUpload(e.target.files?.[0], 'body'); e.target.value = ''; }} />
                </label>
              </>
            )}
            <span className="ml-auto px-2 text-xs text-slate-500">{words} words · {Math.max(1, Math.round(words / 200))} min read</span>
          </div>
          {tab === 'write' ? (
            <textarea
              ref={bodyRef}
              aria-label="Article (Markdown)"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={22}
              className="block min-h-[28rem] w-full resize-y p-5 font-mono text-[0.95rem] leading-relaxed outline-none"
              placeholder={'Write the article here.\n\n## A section heading\n\nParagraphs are separated by a blank line. Use the buttons above for headings, bold text, links, lists and images.'}
            />
          ) : (
            <div className="min-h-[28rem] p-5 sm:p-8">
              {previewing ? <p className="text-slate-500">Loading preview…</p> : <article className="prose-lorix" dangerouslySetInnerHTML={{ __html: previewHtml || '<p>Nothing to preview yet.</p>' }} />}
            </div>
          )}
          {fe.body_md && <p className="border-t border-line px-5 py-2 text-sm text-red-700">{fe.body_md}</p>}
        </div>
        {uploadError && <p role="alert" className="text-sm font-semibold text-red-700">{uploadError}</p>}
      </div>

      <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
        <div className="card space-y-4 p-5">
          <fieldset>
            <legend className="mb-2 text-sm font-bold">Visibility</legend>
            <div className="grid grid-cols-2 gap-2">
              {(['draft', 'published'] as const).map((s) => (
                <label key={s} className="cursor-pointer">
                  <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} className="peer sr-only" />
                  <span className="block rounded-lg border-[1.5px] border-line px-3 py-2 text-center text-sm font-bold peer-checked:border-navy-900 peer-checked:bg-navy-900 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-blue-500/30">
                    {s === 'draft' ? 'Draft' : 'Published'}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="when" className="mb-1.5 block text-sm font-bold">Publish date</label>
            <input id="when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="field" />
            <p className="mt-1 text-xs text-slate-500">Leave empty to publish now. A future date schedules the post.</p>
          </div>
          <button disabled={pending || uploading !== ''} className="btn btn-primary w-full disabled:opacity-60">
            {pending ? 'Saving…' : status === 'published' ? (isLive ? 'Update post' : 'Publish') : 'Save draft'}
          </button>
          {isLive && <a href={`/blog/${post!.slug}`} target="_blank" className="block text-center text-sm font-semibold text-blue-600 hover:underline">View on website ↗</a>}
        </div>

        <div className="card space-y-3 p-5">
          <p className="text-sm font-bold">Cover image</p>
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="aspect-[16/9] w-full rounded-lg bg-mist-100 object-cover" />
          ) : (
            <div className="grid aspect-[16/9] place-items-center rounded-lg bg-mist-100 text-sm text-slate-500">No image</div>
          )}
          <div className="flex gap-2">
            <label className="btn btn-outline flex-1 cursor-pointer">
              {uploading === 'cover' ? 'Uploading…' : cover ? 'Replace' : 'Upload'}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(e) => { onUpload(e.target.files?.[0], 'cover'); e.target.value = ''; }} />
            </label>
            {cover && <button type="button" onClick={() => { setCover(''); setDirty(true); }} className="btn text-red-700 hover:bg-red-50">Remove</button>}
          </div>
          {fe.cover_url && <p className="text-sm text-red-700">{fe.cover_url}</p>}
          <div>
            <label htmlFor="cover_alt" className="mb-1.5 block text-xs font-bold">Image description (for accessibility and SEO)</label>
            <input id="cover_alt" name="cover_alt" value={coverAlt} onChange={(e) => setCoverAlt(e.target.value)} maxLength={200} className="field" />
          </div>
        </div>

        <div className="card space-y-3 p-5">
          <div>
            <label htmlFor="tags" className="mb-1.5 block text-sm font-bold">Tags</label>
            <input id="tags" name="tags" defaultValue={post?.tags.join(', ') ?? ''} className="field" placeholder="Solar, Batteries, Guides" />
            <p className="mt-1 text-xs text-slate-500">Separate with commas. Up to 8.</p>
          </div>
        </div>

        <details className="card p-5" open={Boolean(post?.seo_title || post?.seo_description)}>
          <summary className="cursor-pointer text-sm font-bold">Search engine listing</summary>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-mist-50 p-3 text-sm">
              <p className="truncate text-[#1a0dab]">{seoTitle || title || 'Post title'} | LORIX Energy</p>
              <p className="truncate text-xs text-green-700">lorixenergy.com/blog/{slug || 'post'}</p>
              <p className="line-clamp-2 text-xs text-slate-500">{seoDesc || excerpt || 'Summary'}</p>
            </div>
            <div>
              <div className="mb-1.5 flex justify-between"><label htmlFor="seo_title" className="text-xs font-bold">SEO title</label><Counter value={seoTitle} max={70} /></div>
              <input id="seo_title" name="seo_title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={70} className="field" placeholder="Defaults to the title" />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between"><label htmlFor="seo_description" className="text-xs font-bold">SEO description</label><Counter value={seoDesc} max={170} /></div>
              <textarea id="seo_description" name="seo_description" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} maxLength={170} rows={3} className="field min-h-0" placeholder="Defaults to the summary" />
            </div>
          </div>
        </details>
      </aside>
    </form>
      {post && isAdmin && (
        <div className="mt-6">
          <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
            <p className="text-sm text-slate-500">Deleting removes the post from the website for good.</p>
            <div className="w-full sm:w-auto">
              <DeleteButton action={deletePost} id={post.id} extra={{ slug: post.slug }} label="Delete post" confirmText={`Delete "${post.title}"? This cannot be undone.`} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
