import { defineConfig } from '@playwright/test';

// Both projects drive the built docs, so run `pnpm build` first (the test
// scripts do). `unit` compares the three builds against each other and needs no
// stored images. `visual` compares against stored screenshots, which are only
// stable inside one environment: run it in Playwright's Docker image (see
// tests/README.md), and create the baselines there with `pnpm test:update`.
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { browserName: 'chromium', baseURL: 'http://localhost:8778', viewport: { width: 1100, height: 900 } },
  webServer: { command: 'node tests/serve.mjs', url: 'http://localhost:8778/index.html', reuseExistingServer: true },
  expect: { toHaveScreenshot: { animations: 'disabled', caret: 'hide', maxDiffPixelRatio: 0.001 } },
  projects: [
    { name: 'unit', testMatch: /\.spec\.ts$/ },
    { name: 'visual', testMatch: /\.visual\.ts$/ },
  ],
});
