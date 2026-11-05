import manifest from '@/lib/image-manifest.json';

type Name = keyof typeof manifest;

type Props = {
  name: Name;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** Fill the parent box (object-fit: cover) instead of keeping natural aspect. */
  cover?: boolean;
};

/** Responsive AVIF/WebP picture from images pre-built by scripts/optimise-images.mjs. */
export function Picture({ name, alt, sizes = '100vw', className = '', priority, cover }: Props) {
  const m = manifest[name];
  const set = (ext: string) => m.sizes.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(', ');
  const fallback = `/images/${name}-${m.sizes.at(-1)}.webp`;
  return (
    <picture className={cover ? 'block h-full w-full' : 'block'}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={fallback}
        alt={alt}
        width={m.width}
        height={m.height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={`${cover ? 'h-full w-full object-cover' : 'h-auto w-full'} ${className}`}
        style={{ backgroundImage: `url(${m.blur})`, backgroundSize: 'cover' }}
      />
    </picture>
  );
}
