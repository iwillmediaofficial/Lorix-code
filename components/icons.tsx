type P = { className?: string };
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

export const Chevron = ({ className = 'chev' }: P) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true"><path d="M3 2.5 8 8l-5 5.5M8.5 2.5 13.5 8l-5 5.5" fill="none" stroke="currentColor" strokeWidth="2.2" /></svg>
);
export const IconShield = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>);
export const IconBolt = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>);
export const IconBattery = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><rect x="3" y="7" width="16" height="10" rx="2" /><path d="M21 10v4M7 10v4M11 10v4" /></svg>);
export const IconSun = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>);
export const IconHome = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="m3 11 9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>);
export const IconGrid = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 2 7 22M12 2l5 20M8.5 8h7M7.3 14h9.4M5 22h14" /></svg>);
export const IconNetwork = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="5" r="2.5" /><circle cx="5" cy="19" r="2.5" /><circle cx="19" cy="19" r="2.5" /><path d="M12 7.5v4M12 11.5 6.5 17M12 11.5l5.5 5.5" /></svg>);
export const IconHeadset = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="4" height="6" rx="1.5" /><rect x="17" y="14" width="4" height="6" rx="1.5" /></svg>);
export const IconGauge = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 18a9 9 0 1 1 16 0" /><path d="m12 13 4-4" /><circle cx="12" cy="13" r="1.3" /></svg>);
export const IconLock = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>);
export const IconThermo = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M14 14.8V4a2 2 0 0 0-4 0v10.8a4 4 0 1 0 4 0Z" /></svg>);
export const IconChip = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></svg>);
export const IconLeaf = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15" /><path d="M5 19 13 11" /></svg>);
export const IconClock = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
export const IconMail = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>);
export const IconPhone = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>);
export const IconPin = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" /><circle cx="12" cy="9" r="2.5" /></svg>);
export const IconWhatsApp = ({ className = 'h-6 w-6' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" /></svg>
);
export const IconMenu = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const IconClose = ({ className = 'h-6 w-6' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const IconCheck = ({ className = 'h-5 w-5' }: P) => (<svg viewBox="0 0 24 24" className={className} {...base}><path d="m5 12 5 5 9-10" /></svg>);
