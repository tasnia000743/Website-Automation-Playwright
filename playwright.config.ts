import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: './env-files/.env.user-login-data', quiet: true });
dotenv.config({ path: './env-files/.env.api-data', quiet: true });

export default defineConfig({
  testDir: './tests', // ✅ FIXED (relative path)

  timeout: 90_000,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 2 : 0,
  fullyParallel: true,

  globalSetup: './tests/ui-tests/global-setup.ts',

  use: {
    headless: false,
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 60_000,
    navigationTimeout: 60_000,
    ignoreHTTPSErrors: true,
    storageState: 'auth.json',
    viewport: null,
  },

  expect: {
    timeout: 60_000,
  },

  projects: [
    {
      name: 'chromium',
      testDir: './tests/ui-tests',
      use: {
        browserName: 'chromium',
      },
    },
    {
      name: 'firefox',
      testDir: './tests/ui-tests',
      use: {
        browserName: 'firefox',
      },
    },
    {
      name: 'apiTest',
      testDir: './tests/api-tests',
    },
  ],

  reporter: [
    ['html', { open: 'always' }],
    ['json', { outputFile: 'results.json' }],
    ['junit', { outputFile: 'results.xml' }],
  ],
});