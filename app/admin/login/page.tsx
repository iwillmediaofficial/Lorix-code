import { redirect } from 'next/navigation';
import { getStaff } from '@/lib/auth';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata = { title: 'Sign in' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getStaff()) redirect('/admin');
  const { next } = await searchParams;
  return (
    <div className="grid min-h-svh place-items-center bg-navy-900 px-5">
      <div className="pattern-x pointer-events-none fixed inset-0 opacity-60" aria-hidden="true" />
      <div className="relative w-full max-w-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-white.svg" alt="LORIX Energy" width={130} height={60} className="mx-auto mb-8 h-12 w-auto" />
        <div className="card p-7 shadow-2xl">
          <h1 className="text-xl font-extrabold">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Leads and blog management.</p>
          <LoginForm next={next ?? ''} />
        </div>
      </div>
    </div>
  );
}
