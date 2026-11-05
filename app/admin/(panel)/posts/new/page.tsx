import Link from 'next/link';
import { requireStaff } from '@/lib/auth';
import { PageTitle } from '@/components/admin/ui';
import { PostEditor } from '@/components/admin/PostEditor';

export const metadata = { title: 'New post' };

export default async function NewPost() {
  const staff = await requireStaff();
  return (
    <>
      <Link href="/admin/posts" className="link mb-4 inline-block text-sm">← All posts</Link>
      <PageTitle title="New blog post" />
      <PostEditor isAdmin={staff.role === 'admin'} />
    </>
  );
}
