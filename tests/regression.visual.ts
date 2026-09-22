import { test, expect } from '@playwright/test';
import { demos } from './lib';

// Every demo in every build it shows, in both schemes, compared against a stored
// screenshot, so an unintended change in any component shows up as a diff.
// Stored screenshots only match on the platform that made them: run this project
// inside Playwright's Docker image (tests/README.md), and refresh the baselines
// there with `pnpm test:update` after an intended change.

const TAB = { classes: 'classes', classless: 'classless', 'kobalte-markup': 'kobalte' } as const;

for (const demo of demos()) {
  for (const variant of Object.keys(TAB) as (keyof typeof TAB)[]) {
    if (!demo.markup[variant]) continue;
    for (const scheme of ['light', 'dark'] as const) {
      test(`${demo.page}/${demo.name} ${variant} ${scheme}`, async ({ page }) => {
        await page.addInitScript(s => sessionStorage.setItem('color-scheme', s), scheme);
        await page.goto(`/${demo.page}.html`);
        const el = page.locator('[data-demo]').filter({ has: page.locator(`code[id^="${demo.name}-"]`) }).first();
        const tab = el.locator(`.variant-tab[data-variant="${TAB[variant]}"]`);
        await tab.click();
        await expect(tab).toHaveAttribute('aria-selected', 'true');
        await page.waitForTimeout(400);
        await expect(el.locator('[data-demo-frame]')).toHaveScreenshot(`${demo.page}-${demo.name}-${variant}-${scheme}.png`);
      });
    }
  }
}
