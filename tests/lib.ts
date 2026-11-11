import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const root = process.cwd();

/** Which stylesheet renders which variant of a demo. */
export const SHEETS = {
  classes: 'index.css',
  classless: 'classless.css',
  'kobalte-markup': 'kobalte.css',
} as const;
export type Variant = keyof typeof SHEETS;


const decode = (s: string) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

export interface Demo {
  page: string;
  name: string;
  markup: Partial<Record<Variant, string>>;
}

/** Every demo on every built docs page, with the markup of each variant it shows. */
export const demos = (): Demo[] => {
  const out: Demo[] = [];
  for (const file of readdirSync(join(root, 'docs')).filter(f => f.endsWith('.html')).sort()) {
    const html = readFileSync(join(root, 'docs', file), 'utf8');
    for (const block of html.matchAll(/<div class="demo" data-demo>([\s\S]*?)\n<\/div>/g)) {
      const markup: Demo['markup'] = {};
      let name = '';
      for (const [, id, variant, code] of block[1].matchAll(/<code id="([^"]+)" data-variant="([\w-]+)">([\s\S]*?)<\/code>/g)) {
        name ||= id.replace(/-(classes|classless|kobalte|kobalte-markup)$/, '');
        if (variant in SHEETS) markup[variant as Variant] = decode(code);
      }
      if (name) out.push({ page: file.replace('.html', ''), name, markup });
    }
  }
  return out;
};


/** Properties compared when two builds' renders differ, to say why. */
export const PROPS = [
  'display', 'width', 'height', 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
  'border-top-width', 'border-top-color', 'border-radius', 'color', 'background-color', 'font-size',
  'font-weight', 'gap', 'box-shadow', 'min-width', 'align-items', 'flex-direction', 'list-style-type', 'opacity',
];

/** A logical part of a component, and how each build marks it: class, element, or Kobalte's role or attribute. */
export const PARTS: [string, string][] = [
  ['trigger', 'summary, [aria-haspopup]'],
  ['toggle', '.toggle'],
  ['thumb', '.toggle-thumb'],
  ['tooltip', '.tooltip-content, [role=tooltip]'],
  ['alert', '.alert, [role=alert]'],
  ['collapse-title', '.collapse-title, :is(h1,h2,h3,h4,h5,h6):has(+ [role=region]) > button'],
  ['collapse-content', '.collapse-content, [role=region]'],
  ['panel', '.dropdown-content, [role=menu]'],
  ['row', '.menu-item, [role=option], [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio]'],
  ['menu-title', '.menu-title, [role=group] > span:first-child'],
  ['separator', 'hr, [role=separator]'],
  ['tablist', '.tabs, [role=tablist]'],
  ['tab', '.tab, [role=tab]'],
  ['tabpanel', '.tab-content, [role=tabpanel]'],
  ['segmented-item', '.segmented-item'],
  ['slider-thumb', '.slider-thumb, [role=slider]'],
  ['pagination-button', '.pagination li > *'],
  ['skeleton', '.skeleton'],
  ['badge', '.badge'],
  ['card', '.card, .card-border'],
  ['button', '.btn'],
  ['popover', '.popover-content, [role=dialog]'],
  ['toast-item', '.toast .alert, .toast [role=status]'],
];

/** In the page: each part's computed styles, one row per element. */
export const dumpStyles = ({ parts, props }: { parts: [string, string][]; props: string[] }) =>
  Object.fromEntries(parts.map(([name, sel]) =>
    [name, [...document.querySelectorAll(sel)].map(el => props.map(p => getComputedStyle(el).getPropertyValue(p)))]));

/** Which computed styles differ between two dumps, as readable lines. */
export const styleDiff = (a: Record<string, string[][]>, b: Record<string, string[][]>) => {
  const out: string[] = [];
  for (const [part] of PARTS) {
    if (a[part].length !== b[part].length) { out.push(`${part}: ${a[part].length} against ${b[part].length} elements`); continue; }
    a[part].forEach((row, i) => row.forEach((v, k) => {
      if (v !== b[part][i][k]) out.push(`${part}[${i}] ${PROPS[k]}: ${v}  ->  ${b[part][i][k]}`);
    }));
  }
  return out;
};
