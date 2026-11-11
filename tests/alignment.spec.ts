import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';

// Controls side by side in a row must share their height, and, in a row that
// lines things up on their bottom edge, their bottom edge too. This is the
// misalignment that kept coming back (a colour swatch beside its hex field, a
// button beside an input), so every docs page is checked, demos included.
const pages = readdirSync('docs').filter(f => f.endsWith('.html'));

const check = () => {
  const sel = '.btn,.input,.select,.color-input,button,select,input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden])';
  const out: string[] = [];
  const docs = [document, ...[...document.querySelectorAll('iframe')].map(f => f.contentDocument).filter(Boolean)] as Document[];
  for (const d of docs) {
    const rows = new Map<Element, DOMRect[]>();
    for (const el of d.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      let row = el.parentElement;
      while (row && row.tagName === 'LABEL') row = row.parentElement;
      if (!row) continue;
      const cs = getComputedStyle(row);
      if (!cs.display.includes('flex') || cs.flexDirection.startsWith('column')) continue;
      if (!rows.has(row)) rows.set(row, []);
      rows.get(row)!.push(r);
    }
    for (const [row, rects] of rows) {
      if (rects.length < 2) continue;
      const hs = rects.map(r => r.height), bs = rects.map(r => r.bottom);
      const end = getComputedStyle(row).alignItems.includes('end');
      if (Math.max(...hs) - Math.min(...hs) > 0.5 || (end && Math.max(...bs) - Math.min(...bs) > 0.5))
        out.push(`${row.className || row.tagName}: heights ${hs.map(h => h.toFixed(1)).join(', ')}`);
    }
  }
  return out;
};

for (const page of pages) {
  test(`controls line up: ${page}`, async ({ page: p }) => {
    await p.goto(`/${page}`);
    await p.waitForTimeout(800);
    expect(await p.evaluate(check)).toEqual([]);
  });
}
