// Crops the brand posters to text-free regions and writes AVIF + WebP at several widths.
// Usage: node scripts/optimise-images.mjs <source-folder>
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const srcDir = process.argv[2] ?? 'assets-src';
const outDir = 'public/images';
const widths = [480, 768, 1200, 1600];
const crops = JSON.parse(await fs.readFile('scripts/crops.json', 'utf8'));
await fs.mkdir(outDir, { recursive: true });
const manifest = {};

for (const { out, src, crop } of crops) {
  const input = sharp(path.join(srcDir, src));
  const { width: W, height: H } = await input.metadata();
  const [x0, y0, x1, y1] = crop;
  const region = { left: Math.round(x0 * W), top: Math.round(y0 * H), width: Math.round((x1 - x0) * W), height: Math.round((y1 - y0) * H) };
  const base = sharp(path.join(srcDir, src)).extract(region);
  const sizes = widths.filter((w) => w < region.width);
  if (!sizes.length || region.width - sizes.at(-1) > 120) sizes.push(region.width);
  for (const w of sizes) {
    const r = base.clone().resize({ width: w });
    await r.clone().avif({ quality: 52, effort: 6 }).toFile(`${outDir}/${out}-${w}.avif`);
    await r.clone().webp({ quality: 74 }).toFile(`${outDir}/${out}-${w}.webp`);
  }
  const blur = await base.clone().resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  manifest[out] = { width: region.width, height: region.height, sizes, blur: `data:image/webp;base64,${blur.toString('base64')}` };
  console.log(out, region.width, 'x', region.height, sizes.join(','));
}
await fs.writeFile('lib/image-manifest.json', JSON.stringify(manifest, null, 2));
