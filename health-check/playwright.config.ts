import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 15_000,
  retries: 0,
  reporter: [['html', { outputFolder: 'report', open: 'never' }], ['list']],
  use: {
    headless: true,
  },
  projects: [
    {
      name: 'node',
      testMatch: '**/*.spec.ts',
    },
  ],
});
