'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { submitEnquiry, type EnquiryState } from '@/app/actions/enquiry';
import { enquiryTypes } from '@/lib/enquiry-schema';
import { whatsappLink } from '@/lib/site';
import { Chevron, IconCheck, IconWhatsApp } from './icons';

declare global {
  interface Window { turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id?: string) => void } }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function EnquiryForm({ defaultType, defaultMessage, compact }: { defaultType?: string; defaultMessage?: string; compact?: boolean }) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, { ok: false });
  const pathname = usePathname();
  const params = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const tsRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState(defaultMessage ?? '');
  const typeFromUrl = params.get('type');
  const initialType = enquiryTypes.some((t) => t.value === typeFromUrl) ? typeFromUrl! : defaultType ?? 'product';

  // Prefill from the sizing tool.
  useEffect(() => {
    try {
      const pre = sessionStorage.getItem('lorix-prefill');
      if (pre) { setMessage(pre); sessionStorage.removeItem('lorix-prefill'); }
    } catch {}
    const onPrefill = (e: Event) => setMessage((e as CustomEvent<string>).detail);
    window.addEventListener('lorix:prefill', onPrefill);
    return () => window.removeEventListener('lorix:prefill', onPrefill);
  }, []);

  // Load Turnstile only when the form comes into view.
  useEffect(() => {
    if (!SITE_KEY || !tsRef.current) return;
    const el = tsRef.current;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const render = () => window.turnstile?.render(el, { sitekey: SITE_KEY, theme: 'light', appearance: 'interaction-only' });
      if (window.turnstile) return void render();
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    }, { rootMargin: '300px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!state.ok && state.message) window.turnstile?.reset();
  }, [state]);

  if (state.ok) {
    return (
      <div className="card p-8 text-center sm:p-12" role="status" aria-live="polite">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-gradient text-white"><IconCheck className="h-8 w-8" /></span>
        <h3 className="text-h3 mt-6">Thank you. Your enquiry is with our team.</h3>
        <p className="mx-auto mt-3 max-w-md text-slate-500">We respond to every enquiry within 24 hours. For anything urgent, message us on WhatsApp.</p>
        <a href={whatsappLink('Hi LORIX Energy, I just sent an enquiry on your website.')} target="_blank" rel="noopener noreferrer" className="btn mt-8 bg-[#1fa855] text-white">
          <IconWhatsApp className="h-5 w-5" /> Chat on WhatsApp
        </a>
      </div>
    );
  }

  const err = state.errors ?? {};
  const fieldProps = (name: keyof typeof err) => ({
    name,
    id: `f-${name}`,
    'aria-invalid': err[name] ? true : undefined,
    'aria-describedby': err[name] ? `e-${name}` : undefined,
  });
  const Err = ({ name }: { name: keyof typeof err }) =>
    err[name] ? <p id={`e-${name}`} className="mt-2 text-sm font-semibold text-[#c2261b]">{err[name]}</p> : null;

  return (
    <form ref={formRef} action={action} noValidate className={`card ${compact ? 'p-6' : 'p-6 sm:p-10'}`}>
      <input type="hidden" name="sourcePage" value={pathname} />
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>Leave this field empty<input type="text" name="lx_check" tabIndex={-1} autoComplete="one-time-code" defaultValue="" /></label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="f-fullName" className="mb-2 block text-sm font-bold">Full name *</label>
          <input {...fieldProps('fullName')} className="field" autoComplete="name" required placeholder="Enter your full name" />
          <Err name="fullName" />
        </div>
        <div>
          <label htmlFor="f-email" className="mb-2 block text-sm font-bold">Email address *</label>
          <input {...fieldProps('email')} type="email" className="field" autoComplete="email" required placeholder="you@example.com" />
          <Err name="email" />
        </div>
        <div>
          <label htmlFor="f-phone" className="mb-2 block text-sm font-bold">Phone number *</label>
          <input {...fieldProps('phone')} type="tel" className="field" autoComplete="tel" inputMode="tel" required defaultValue="+91 " />
          <Err name="phone" />
        </div>
        <fieldset className="sm:col-span-2">
          <legend className="mb-3 text-sm font-bold">Enquiry type *</legend>
          <div className="flex flex-wrap gap-2">
            {enquiryTypes.map((t) => (
              <label key={t.value} className="cursor-pointer">
                <input type="radio" name="enquiryType" value={t.value} defaultChecked={t.value === initialType} className="peer sr-only" />
                <span className="inline-block rounded-full border-[1.5px] border-line px-4 py-2 text-sm font-semibold transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-blue-600">
                  {t.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="sm:col-span-2">
          <label htmlFor="f-cityState" className="mb-2 block text-sm font-bold">City / State</label>
          <input {...fieldProps('cityState')} className="field" autoComplete="address-level2" placeholder="e.g. Kochi, Kerala" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="f-message" className="mb-2 block text-sm font-bold">Your message *</label>
          <textarea {...fieldProps('message')} className="field" required placeholder="Tell us how we can help..." value={message} onChange={(e) => setMessage(e.target.value)} />
          <Err name="message" />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-slate-500">
            <input type="checkbox" name="consent" className="mt-1 h-5 w-5 shrink-0 accent-blue-500" aria-invalid={err.consent ? true : undefined} />
            <span>I agree that LORIX Energy may store these details and contact me about my enquiry, as described in the <a href="/privacy-policy" className="link">privacy policy</a>.</span>
          </label>
          <Err name="consent" />
        </div>
      </div>

      <div ref={tsRef} className="mt-4" />
      {state.message && <p role="alert" className="mt-4 rounded-xl bg-[#fdecea] px-4 py-3 text-sm font-semibold text-[#9b1c13]">{state.message}</p>}
      <button type="submit" className="btn btn-primary mt-6 w-full" disabled={pending}>
        {pending ? 'Sending…' : 'Send enquiry'} {!pending && <Chevron />}
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">We reply within 24 hours. Your details are never shared.</p>
    </form>
  );
}
