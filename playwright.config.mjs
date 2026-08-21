import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';
const headed = process.env.HEADED === '1' || process.env.HEADED === 'true';

export default defineConfig({
  testDir: './e2e',
  outputDir: '/tmp/playwright-test-results',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL,
    headless: !headed,
    screenshot: 'only-on-failure',
    video: headed ? 'on' : 'off',
    launchOptions: headed
      ? {
          slowMo: Number(process.env.E2E_SLOWMO ?? 350),
          args: ['--start-maximized'],
        }
      : undefined,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: headed ? null : devices['Desktop Chrome'].viewport,
      },
    },
  ],
});
