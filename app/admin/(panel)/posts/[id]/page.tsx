import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireStaff, staffJson } from '@/lib/auth';
import { PageTitle, PostBadge } from '@/components/admin/ui';
import { PostEditor, type EditablePost } from '@/components/admin/PostEditor';

export const metadata = { title: 'Edit post' };

export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const staff = await requireStaff();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const rows = await staffJson<EditablePost[]>(
    `posts?select=id,slug,title,excerpt,body_md,cover_url,cover_alt,tags,status,published_at,seo_title,seo_description&id=eq.${id}`,
  ).catch(() => []);
  const post = rows[0];
  if (!post) notFound();
  const { saved } = await searchParams;
  return (
    <>
      <Link href="/admin/posts" className="link mb-4 inline-block text-sm">← All posts</Link>
      <PageTitle title="Edit post">
        <PostBadge status={post.status} publishedAt={post.published_at} />
      </PageTitle>
      <PostEditor post={post} isAdmin={staff.role === 'admin'} justCreated={saved === '1'} />
    </>
  );
}
