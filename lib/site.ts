export const site = {
  name: 'LORIX Energy',
  legalName: 'LORIX Energy Private Limited',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lorixenergy.com',
  tagline: 'Empowering Energy Beyond the Grid.',
  description:
    "Explore LORIX Energy's residential energy storage solutions, LFP batteries and hybrid solar inverters. Discover smarter energy solutions and channel partnership opportunities across India.",
  email: 'lorixenergy@gmail.com',
  phone: '+91 96333 40051',
  phoneHref: 'tel:+919633340051',
  whatsapp: '919633340051',
  office: {
    label: 'Registered office',
    lines: ['21/152, Corrazone, Panadans, P.O. Kalamassery', 'Kochi University, Ernakulam 682022', 'Kerala, India'],
    locality: 'Kalamassery, Kochi',
    region: 'Kerala',
    postalCode: '682022',
  },
  factory: { label: 'Manufacturing factory', lines: ['Periyanaickenpalayam, Coimbatore', 'Tamil Nadu, India'] },
} as const;

export const nav = [
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/technology', label: 'Technology' },
  { href: '/blog', label: 'Blog' },
] as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
