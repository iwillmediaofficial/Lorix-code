// Screenshots the procedural 3D product scenes into still images (demo product renders + 3D fallbacks).
// Needs `pnpm dev --port 3100` running with the temporary /render-lab page.
import { chromium } from '@playwright/test';
import sharp from 'sharp';
const base = process.argv[2] ?? 'http://localhost:3100';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 1 });
for (const v of ['battery', 'inverter', 'sodium', 'cells']) {
  await page.goto(`${base}/render-lab?v=${v}&p=${v === 'cells' ? 0.55 : 0}`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: 'header, a[aria-label*=WhatsApp], nextjs-portal, footer { display: none !important } html, body { background: transparent !important }' });
  await page.waitForSelector('canvas');
  await page.waitForTimeout(4000);
  const png = await page.locator('canvas').screenshot({ omitBackground: true });
  for (const w of [800, 1200]) {
    await sharp(png).resize({ width: w }).webp({ quality: 82, alphaQuality: 90 }).toFile(`public/renders/${v}-${w}.webp`);
    await sharp(png).resize({ width: w }).avif({ quality: 55 }).toFile(`public/renders/${v}-${w}.avif`);
  }
  await sharp(png).png().toFile(`public/renders/${v}-source.png`);
  console.log('rendered', v);
}
await browser.close();
