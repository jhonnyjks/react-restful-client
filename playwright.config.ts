import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';
const playwrightOutputRoot = path.join('.playwright');

export default defineConfig({
  testDir: './src/app/e2e',
  outputDir: path.join(playwrightOutputRoot, 'test-results'),
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: path.join(playwrightOutputRoot, 'e2e-report') }],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
