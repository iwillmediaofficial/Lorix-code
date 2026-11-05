'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { nav } from '@/lib/site';
import { products } from '@/content/products';
import { Chevron, IconClose, IconMenu } from './icons';

/** Pages whose first section is navy, so the header starts transparent with a white logo. */
const darkHeroRoutes = ['/', '/technology', '/about', '/products', '/products/lfp-battery', '/products/hybrid-inverter', '/products/sodium-ion-battery'];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const lastY = useRef(0);
  const darkHero = darkHeroRoutes.includes(pathname);
  const solid = scrolled || !darkHero || open;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      setHidden(y > 400 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y < 400) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMega(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const linkCls = (href: string) => {
    const active = pathname === href || (href !== '/' && pathname.startsWith(href));
    return `relative px-3 py-2 text-[0.95rem] font-semibold transition-colors ${
      solid ? (active ? 'text-blue-600' : 'text-navy-900 hover:text-blue-600') : active ? 'text-white' : 'text-white/80 hover:text-white'
    }`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ${
        hidden && !open ? '-translate-y-full' : 'translate-y-0'
      } ${solid ? 'bg-white/95 shadow-[0_8px_30px_-18px_rgb(8_21_63/0.35)] backdrop-blur-md' : 'bg-transparent'}`}
    >
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
        <Link href="/" aria-label="LORIX Energy home" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={solid ? '/brand/logo.svg' : '/brand/logo-white.svg'} alt="LORIX Energy" width={104} height={48} className="h-10 w-auto lg:h-12" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <Link href="/" className={linkCls('/') + (pathname === '/' ? '' : '')}>Home</Link>
          {nav.map((item) =>
            item.href === '/products' ? (
              <div key={item.href} className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
                <Link href={item.href} className={linkCls(item.href)} aria-haspopup="true" aria-expanded={mega} onFocus={() => setMega(true)}>
                  {item.label}
                </Link>
                <div
                  className={`absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-3 transition-all duration-300 ${
                    mega ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
                  }`}
                >
                  <div className="card grid grid-cols-3 gap-2 p-3 shadow-2xl" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setMega(false)}>
                    {products.map((p) => (
                      <Link key={p.slug} href={`/products/${p.slug}`} className="group rounded-xl p-4 transition-colors hover:bg-mist-50">
                        <span className="mb-3 block h-1 w-8 rounded-full gradient-bar transition-all group-hover:w-14" />
                        <span className="block font-bold text-navy-900">{p.name}</span>
                        <span className="mt-1 block text-sm text-slate-500">{p.range}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={linkCls(item.href)}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className={`btn hidden sm:inline-flex ${solid ? 'btn-primary' : 'btn-gradient'}`}>
            Contact us <Chevron />
          </Link>
          <button
            type="button"
            className={`grid h-12 w-12 place-items-center rounded-full lg:hidden ${solid ? 'text-navy-900' : 'text-white'}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto bg-white transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav aria-label="Mobile" className="container-x flex flex-col py-6">
          {[{ href: '/', label: 'Home' }, ...nav].map((item) => (
            <div key={item.href} className="border-b border-line">
              <Link href={item.href} className="flex items-center justify-between py-4 text-2xl font-extrabold text-navy-900">
                {item.label} <Chevron className="h-4 w-4 text-blue-500" />
              </Link>
              {item.href === '/products' && (
                <div className="mb-4 grid gap-1 pl-1">
                  {products.map((p) => (
                    <Link key={p.slug} href={`/products/${p.slug}`} className="py-2 text-base font-semibold text-slate-500">
                      {p.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/contact" className="btn btn-primary mt-8 w-full">
            Contact us <Chevron />
          </Link>
        </nav>
      </div>
    </header>
  );
}
