import { chromium, type FullConfig } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const EMAIL = process.env.E2E_EMAIL ?? 'jhonnyjks@gmail.com';
const PASSWORD = process.env.E2E_PASSWORD ?? 'password';
const authFile = path.join('e2e', '.auth', 'user.json');

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL ?? 'http://localhost:5173';

  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseURL}/login`);
  await page.locator('#email').fill(EMAIL);
  await page.locator('#password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15_000 });
  await page.waitForFunction(() => sessionStorage.getItem('auth-session') !== null);

  await context.storageState({ path: authFile });
  await browser.close();
}
