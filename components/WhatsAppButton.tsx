'use client';
import { usePathname } from 'next/navigation';
import { whatsappLink } from '@/lib/site';
import { IconWhatsApp } from './icons';

export function WhatsAppButton() {
  const path = usePathname();
  const msg = `Hi LORIX Energy, I'm on your website (${path === '/' ? 'home page' : path}) and have a question.`;
  return (
    <a
      href={whatsappLink(msg)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with LORIX Energy on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#1fa855] text-white shadow-[0_12px_30px_-8px_rgb(31_168_85/0.7)] transition-transform duration-300 hover:scale-110 md:bottom-8 md:right-8"
    >
      <IconWhatsApp className="h-7 w-7" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#1fa855]/40 [animation-duration:2.6s]" aria-hidden="true" />
    </a>
  );
}
