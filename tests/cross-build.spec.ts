import { test, expect, type Page, type Locator } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { demos, dumpStyles, styleDiff, PARTS, PROPS } from './lib';

// Every demo in the docs is shown in each build it supports: Class, Classless,
// and Kobalte. Here each one is screenshotted from the real docs page, in both
// schemes, and must match the Class render pixel for pixel, apart from
// anti-aliasing. All renders happen in the same run on the same machine, so
// there are no stored images to go stale between platforms.
//
// When a render doesn't match, the report attaches both screenshots, a diff
// image, and the computed styles that differ, so it says why.
//
// Differences that are there by design are listed, with a reason, in
// cross-build-exceptions.json. Anything else fails, and so does an exception
// that no longer happens.

const TAB = { classes: 'classes', classless: 'classless', 'kobalte-markup': 'kobalte' } as const;
type Variant = keyof typeof TAB;
const EXCEPTIONS: Record<string, Record<string, string>> = JSON.parse(
  readFileSync('tests/cross-build-exceptions.json', 'utf8'),
);

/** Show one build in a demo's frame and wait until it has settled. */
const show = async (page: Page, demo: Locator, variant: Variant) => {
  const tab = demo.locator(`.variant-tab[data-variant="${TAB[variant]}"]`);
  const frame = demo.locator('[data-demo-frame]');
  await tab.click();
  await expect(tab).toHaveAttribute('aria-selected', 'true');
  let last = -1;
  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(100);
    const h = (await frame.boundingBox())?.height ?? 0;
    if (h > 0 && h === last) break;
    last = h;
  }
  return frame;
};

for (const demo of demos()) {
  const variants = (Object.keys(TAB) as Variant[]).filter(v => demo.markup[v]);
  if (variants.length < 2) continue;
  const key = `${demo.page}/${demo.name}`;

  test(key, async ({ page }, info) => {
    const found = new Map<string, string>();
    for (const scheme of ['light', 'dark'] as const) {
      await page.addInitScript(s => sessionStorage.setItem('color-scheme', s), scheme);
      await page.goto(`/${demo.page}.html`);
      const el = page.locator('[data-demo]').filter({ has: page.locator(`code[id^="${demo.name}-"]`) }).first();
      await el.scrollIntoViewIfNeeded();

      const shots = {} as Record<Variant, Buffer>;
      const styles = {} as Record<Variant, Record<string, string[][]>>;
      for (const v of variants) {
        const frame = await show(page, el, v);
        shots[v] = await frame.screenshot({ animations: 'disabled', caret: 'hide' });
        styles[v] = await (await frame.elementHandle())!.contentFrame().then(f => f!.evaluate(dumpStyles, { parts: PARTS, props: PROPS }));
      }

      const [base, ...rest] = variants;
      const a = PNG.sync.read(shots[base]);
      for (const v of rest) {
        const b = PNG.sync.read(shots[v]);
        let problem = '';
        if (a.width !== b.width || a.height !== b.height) {
          problem = `size: ${a.width}x${a.height} against ${b.width}x${b.height}`;
        } else {
          const diff = new PNG({ width: a.width, height: a.height });
          const n = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
          if (n > Math.max(20, a.width * a.height * 0.001)) {
            problem = `${n} pixels differ`;
            await info.attach(`${v} ${scheme} diff`, { body: PNG.sync.write(diff), contentType: 'image/png' });
          }
        }
        if (!problem) continue;
        const id = `${v} ${scheme}`;
        found.set(id, problem);
        if (!(id in (EXCEPTIONS[key] ?? {})) && !(v in (EXCEPTIONS[key] ?? {}))) {
          await info.attach(`${base} ${scheme}`, { body: shots[base], contentType: 'image/png' });
          await info.attach(`${v} ${scheme}`, { body: shots[v], contentType: 'image/png' });
          await info.attach(`${v} ${scheme} styles`, { body: styleDiff(styles[base], styles[v]).join('\n') || 'no computed-style difference on the tracked parts', contentType: 'text/plain' });
        }
      }
    }

    const allowed = EXCEPTIONS[key] ?? {};
    const hit = (id: string) => id in allowed || id.split(' ')[0] in allowed;
    const unexpected = [...found].filter(([id]) => !hit(id)).map(([id, why]) => `${id}: ${why}`);
    const stale = Object.keys(allowed).filter(k => ![...found.keys()].some(id => id === k || id.split(' ')[0] === k));
    expect(unexpected, 'builds render differently where they should match').toEqual([]);
    expect(stale, 'listed in cross-build-exceptions.json but no longer happens: remove it').toEqual([]);
  });
}
