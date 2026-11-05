import { test, expect } from '@playwright/test';

const pages = [
  '/', '/about', '/products', '/products/lfp-battery', '/products/hybrid-inverter',
  '/products/sodium-ion-battery', '/technology', '/blog', '/contact', '/privacy-policy', '/terms',
];

for (const path of pages) {
  test(`${path} renders without errors or sideways scroll`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const res = await page.goto(path, { waitUntil: 'networkidle' });
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('unknown page returns 404', async ({ page }) => {
  const res = await page.goto('/does-not-exist');
  expect(res?.status()).toBe(404);
});

test('enquiry form validates required fields', async ({ page }) => {
  await page.goto('/contact');
  const form = page.locator('form').first();
  await expect(form).toBeVisible();
  await expect(form.locator('input[name="fullName"]')).toHaveAttribute('required', '');
});
