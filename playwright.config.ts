import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.E2E_PORT ?? 3300);

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: { baseURL: `http://localhost:${port}` },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `pnpm start --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
  },
});
