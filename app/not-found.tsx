import Link from 'next/link';
import { Chevron } from '@/components/icons';

export default function NotFound() {
  return (
    <section className="on-dark relative grid min-h-[80svh] place-items-center overflow-hidden bg-navy-900 px-5 pt-20 text-center text-white">
      <div className="pattern-x absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <p className="gradient-text text-[7rem] font-extrabold leading-none">404</p>
        <h1 className="text-h2 mt-4 text-white">This page has gone off-grid.</h1>
        <p className="mx-auto mt-4 max-w-md text-white/70">The page you are looking for does not exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-gradient">Back to home <Chevron /></Link>
          <Link href="/products" className="btn btn-outline text-white">View products</Link>
        </div>
      </div>
    </section>
  );
}
