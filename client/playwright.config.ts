import { defineConfig } from '@playwright/test';

const artifactRoot = process.env.PLAYWRIGHT_ARTIFACTS || 'test-results';
export default defineConfig({
  testDir: './e2e',
  outputDir: artifactRoot,
  fullyParallel: true,
  workers: 4,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'pnpm preview',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 60000,
  },
});
