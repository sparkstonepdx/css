import { test, expect } from '@playwright/test';

// A full-width header's contents line up with the page's side margins: the
// title over the content's left edge, the last item over its right edge, at
// every width (build-docs DECISIONS 2026-11-18).
const widths = [360, 390, 600, 800, 1100, 1300, 1600];

for (const sheet of ['index.css', 'classless.css']) {
  for (const width of widths) {
    test(`full-width header lines up with the page: ${sheet} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.goto('/index.html');
      await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="/${sheet}"></head><body>
        <header class="navbar navbar-flush"><strong id="first">Nook</strong><span class="navbar-end"><button id="last">Sign out</button></span></header>
        <main class="container"><h1 id="title">Apps</h1><p id="body">Every app on this server.</p></main>
      </body></html>`);
      await page.waitForLoadState('load');
      const r = await page.evaluate(() => {
        const box = (id: string) => document.getElementById(id)!.getBoundingClientRect();
        const main = document.querySelector('main')!, cs = getComputedStyle(main);
        const m = main.getBoundingClientRect();
        return {
          first: box('first').left, last: box('last').right,
          left: m.left + parseFloat(cs.paddingLeft), right: m.right - parseFloat(cs.paddingRight),
        };
      });
      expect(Math.abs(r.first - r.left), `title at ${r.first}, content at ${r.left}`).toBeLessThan(0.5);
      expect(Math.abs(r.last - r.right), `last item ends at ${r.last}, content at ${r.right}`).toBeLessThan(0.5);
    });
  }
}
