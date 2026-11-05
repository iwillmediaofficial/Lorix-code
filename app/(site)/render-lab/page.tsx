import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { RenderLab } from '@/components/dev/RenderLab';

export const metadata = { robots: { index: false } };

export default function Page() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <Suspense><RenderLab /></Suspense>;
}
