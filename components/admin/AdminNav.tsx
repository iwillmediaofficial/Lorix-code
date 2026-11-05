'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AdminNav({ isAdmin, newLeads }: { isAdmin: boolean; newLeads: number }) {
  const path = usePathname();
  const items = [
    { href: '/admin', label: 'Dashboard', exact: true },
    ...(isAdmin ? [{ href: '/admin/leads', label: 'Leads', badge: newLeads }] : []),
    { href: '/admin/posts', label: 'Blog' },
  ];
  return (
    <nav aria-label="Admin" className="order-last -mx-1 flex w-full gap-1 overflow-x-auto lg:order-none lg:mx-0 lg:w-auto lg:flex-col">
      {items.map((i) => {
        const active = i.exact ? path === i.href : path.startsWith(i.href);
        return (
          <Link
            key={i.href}
            href={i.href}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center justify-between gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              active ? 'bg-white text-navy-900' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            {i.label}
            {'badge' in i && i.badge ? (
              <span className="rounded-full bg-green-400 px-2 py-0.5 text-xs font-bold text-navy-900">{i.badge}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
