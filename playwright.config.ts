import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

if (!process.env.CI) {
    dotenv.config({ path: './env-files/.env.user-login-data', quiet: true });
    dotenv.config({ path: './env-files/.env.api-data', quiet: true });
}

export default defineConfig({
    testDir: './tests',

    timeout: 90_000,
    workers: process.env.CI ? 1 : undefined,
    retries: process.env.CI ? 2 : 0,
    fullyParallel: true,

    globalSetup: './tests/ui-tests/global-setup.ts',

    use: {
        headless: process.env.CI ? true : false,  // ✅ headless in Jenkins, headed locally
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
        ['html', { open: process.env.CI ? 'never' : 'always' }],  // ✅ don't auto-open in Jenkins
        ['json', { outputFile: 'results.json' }],
        ['junit', { outputFile: 'results.xml' }],
    ],
});