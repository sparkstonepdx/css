// Theme generator page. Docs only, not part of @sparkstone/css.
//
// State is a handful of inputs. They are written onto the preview frame's root
// as custom properties, the framework derives everything else, and the contrast
// table reads the derived colours back out of the frame.

const DEFAULTS = {
  name: 'my-theme',
  primary: '#663399', // rebeccapurple, the framework default
  secondary: null, // null: the primary rotated 180deg
  neutral: null, // null: the primary
  error: '#800000', // maroon
  radiusBox: 0.25,
  radiusField: 0.25,
  radiusSelector: null, // null: each selector keeps its own default
  border: 0.1625,
  padding: 1,
  shadow: true,
};

// The ten brand colours the framework's contrast numbers were measured on.
const PRESETS = ['#663399', '#ff6347', '#c2410c', '#6b7c59', '#708090', '#1d4ed8', '#ffd400', '#00ff88', '#ff69b4', '#000000'];

const STORE = 'sparkstone-css-themes';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const form = $('#tg-form');
const frame = $('#tg-frame');
let state = { ...DEFAULTS };
let scheme = 'light';
let scope = 'root';

/* ---------- colour helpers ---------- */

const canvas = document.createElement('canvas');
canvas.width = canvas.height = 1;
const ctx = canvas.getContext('2d', { willReadFrequently: true });

/** Any CSS colour the browser understands, as [r, g, b] in 0..255. */
const toRgb = css => {
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = '#000';
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  return [...ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)];
};

const toHex = css => '#' + toRgb(css).map(v => v.toString(16).padStart(2, '0')).join('');

const luminance = ([r, g, b]) => {
  const c = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const isHex = v => /^#[0-9a-f]{6}$/i.test(v);

/* ---------- state in and out ---------- */

const KEYS = { primary: 'p', secondary: 's', neutral: 'n', error: 'e', radiusBox: 'rb', radiusField: 'rf', radiusSelector: 'rs', border: 'b', padding: 'g', shadow: 'sh', name: 'name' };

const toHash = s => {
  const q = new URLSearchParams();
  for (const [k, short] of Object.entries(KEYS)) {
    if (s[k] === null || s[k] === DEFAULTS[k]) continue;
    q.set(short, typeof s[k] === 'boolean' ? (s[k] ? '1' : '0') : String(s[k]).replace('#', ''));
  }
  return q.toString();
};

const fromHash = hash => {
  const q = new URLSearchParams(hash.replace(/^#/, ''));
  const s = { ...DEFAULTS };
  for (const [k, short] of Object.entries(KEYS)) {
    if (!q.has(short)) continue;
    const v = q.get(short);
    if (k === 'shadow') s[k] = v === '1';
    else if (k === 'name') s[k] = v.replace(/[^a-z0-9-]/g, '') || DEFAULTS.name;
    else if (k === 'radiusSelector' || typeof DEFAULTS[k] === 'number') s[k] = Number.isFinite(Number(v)) ? Number(v) : DEFAULTS[k];
    else if (isHex('#' + v)) s[k] = '#' + v.toLowerCase();
  }
  return s;
};

const rem = n => `${+n.toFixed(4)}rem`;

/** The custom properties a state sets. Defaults are left out of the export. */
const declarations = (s, { all = false } = {}) => {
  const out = [['--primary', s.primary]];
  if (s.secondary) out.push(['--secondary', s.secondary]);
  if (s.neutral) out.push(['--neutral', s.neutral]);
  out.push(['--error', s.error]);
  if (all || s.radiusBox !== DEFAULTS.radiusBox) out.push(['--radius-box', rem(s.radiusBox)]);
  if (all || s.radiusField !== DEFAULTS.radiusField) out.push(['--radius-field', rem(s.radiusField)]);
  if (s.radiusSelector !== null) out.push(['--radius-selector', rem(s.radiusSelector)]);
  if (all || s.border !== DEFAULTS.border) out.push(['--border-width', rem(s.border)]);
  if (all || s.padding !== DEFAULTS.padding) out.push(['--padding', rem(s.padding)]);
  if (!s.shadow) out.push(['--box-shadow', 'none']);
  return out;
};

/* ---------- saved themes ---------- */

const readSaved = () => {
  try {
    const list = JSON.parse(localStorage.getItem(STORE) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const writeSaved = list => {
  try {
    localStorage.setItem(STORE, JSON.stringify(list));
  } catch {
    // Storage blocked: saving just does nothing.
  }
};

/* ---------- rendering ---------- */

const swatch = (color, label, onPick) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'semantic tg-swatch';
  b.title = label;
  b.setAttribute('aria-label', `Use ${label}`);
  b.style.setProperty('--sw', color);
  b.addEventListener('click', onPick);
  return b;
};

const renderPresets = () => {
  const box = $('#tg-presets');
  box.replaceChildren(
    ...PRESETS.map(c => swatch(c, c, () => set({ ...DEFAULTS, primary: c, name: state.name }))),
  );
};

const renderSaved = () => {
  const list = readSaved();
  $('#tg-mine-label').hidden = !list.length;
  $('#tg-mine').replaceChildren(
    ...list.map(t => {
      const chip = document.createElement('span');
      chip.className = 'tg-chip';
      const pick = swatch(t.primary, t.name, () => set({ ...DEFAULTS, ...t }));
      const name = document.createElement('button');
      name.type = 'button';
      name.className = 'semantic link';
      name.textContent = t.name;
      name.addEventListener('click', () => set({ ...DEFAULTS, ...t }));
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'semantic tg-remove';
      del.textContent = '×';
      del.setAttribute('aria-label', `Delete ${t.name}`);
      del.addEventListener('click', () => {
        writeSaved(readSaved().filter(x => x.name !== t.name));
        renderSaved();
      });
      chip.append(pick, name, del);
      return chip;
    }),
  );
};

const frameRoot = () => frame.contentDocument?.documentElement;

const applyToFrame = () => {
  const root = frameRoot();
  if (!root) return;
  for (const p of ['--primary', '--secondary', '--neutral', '--error', '--radius-box', '--radius-field', '--radius-selector', '--border-width', '--padding', '--box-shadow'])
    root.style.removeProperty(p);
  for (const [p, v] of declarations(state, { all: true })) root.style.setProperty(p, v);
  root.setAttribute('data-color-scheme', scheme);
};

/** Read a derived colour, resolved, from the frame. */
const probe = (vars, schemeName, extraClass = '') => {
  const doc = frame.contentDocument;
  const box = doc.createElement('div');
  box.setAttribute('data-color-scheme', schemeName);
  box.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden';
  const inner = doc.createElement('span');
  if (extraClass) inner.className = extraClass;
  inner.style.color = vars.fg;
  inner.style.backgroundColor = vars.bg;
  box.append(inner);
  doc.body.append(box);
  const cs = frame.contentWindow.getComputedStyle(inner);
  const out = { fg: cs.color, bg: cs.backgroundColor };
  box.remove();
  return out;
};

const PAIRS = [
  ['Text on the page', 'var(--fg)', 'var(--bg)', 4.5],
  ['Secondary text on the page', 'var(--fg-muted)', 'var(--bg)', 4.5],
  ['Text on a card', 'var(--fg)', 'var(--surface)', 4.5],
  ['Secondary text on a card', 'var(--fg-muted)', 'var(--surface)', 4.5],
  ['Badge text', 'var(--fg-muted)', 'var(--surface-strong)', 4.5],
  ['Links', 'var(--link)', 'var(--bg)', 4.5],
  ['Brand text', 'var(--primary-text)', 'var(--bg)', 4.5],
  ['Button text', 'var(--on-primary-fill)', 'var(--primary-fill)', 4.5],
  ['Placeholder text', 'color-mix(in oklch, var(--fg-muted) 70%, var(--bg))', 'var(--bg)', 4.5],
  ['Error text', 'var(--fg-muted)', 'var(--bg)', 4.5, 'error'],
  ['Borders and focus rings', 'var(--line)', 'var(--bg)', 3],
];

const renderContrast = () => {
  if (!frame.contentDocument?.body) return;
  const rows = PAIRS.map(([label, fg, bg, need, cls]) => {
    const cells = ['light', 'dark'].map(sch => {
      const c = probe({ fg, bg }, sch, cls);
      const r = ratio(toRgb(c.fg), toRgb(c.bg));
      const ok = r >= need;
      return `<td class="${ok ? 'tg-pass' : 'tg-fail retheme'}"><span class="tg-chip-swatch" style="background:${c.bg};color:${c.fg}">Aa</span> ${r.toFixed(2)}${ok ? '' : ' <strong>fails</strong>'}</td>`;
    });
    return `<tr><td>${label}</td><td>${need}:1</td>${cells.join('')}</tr>`;
  });
  $('#tg-contrast tbody').innerHTML = rows.join('');
};

const derivedHex = which => {
  const v = { secondary: 'var(--secondary-base)', neutral: 'var(--neutral-base)' }[which];
  const c = probe({ fg: v, bg: 'transparent' }, scheme);
  return toHex(c.fg);
};

const renderControls = () => {
  $('#tg-name').value = state.name;
  for (const key of ['primary', 'secondary', 'neutral', 'error']) {
    const follows = (key === 'secondary' || key === 'neutral') && !state[key];
    const value = follows ? (frameRoot() ? derivedHex(key) : '#000000') : state[key];
    const picker = $(`input[type="color"][data-key="${key}"]`);
    const hex = $(`input[data-hex="${key}"]`);
    picker.value = value;
    if (document.activeElement !== hex) hex.value = value;
    picker.disabled = hex.disabled = follows;
    const follow = $(`input[data-follow="${key}"]`);
    if (follow) follow.checked = follows;
  }
  for (const key of ['radiusBox', 'radiusField', 'radiusSelector', 'border', 'padding']) {
    const unset = state[key] === null;
    $(`input[data-key="${key}"]`).value = unset ? 0.25 : state[key];
    $(`output[data-out="${key}"]`).textContent = unset ? 'default' : rem(state[key]);
  }
  $('input[data-key="shadow"]').checked = state.shadow;
};

const renderCss = () => {
  const decls = declarations(state).map(([p, v]) => `  ${p}: ${v};`).join('\n');
  const selector = scope === 'root' ? ':root' : `.${state.name}`;
  $('#tg-css').textContent = `${selector} {\n${decls}\n}`;
  $('#tg-scope-note small').innerHTML =
    scope === 'root'
      ? 'Add after the framework\'s stylesheet. Every page re-themes.'
      : `Put the class on an element together with <code>retheme</code>, as in <code>&lt;section class="${state.name} retheme"&gt;</code>. The colours re-derive inside it; the shape settings need no <code>retheme</code>.`;
};

const fitFrame = () => {
  const doc = frame.contentDocument;
  if (doc?.documentElement) frame.style.height = `${doc.documentElement.scrollHeight}px`;
};

const render = () => {
  applyToFrame();
  renderControls();
  renderCss();
  renderContrast();
  fitFrame();
  history.replaceState(null, '', `#${toHash(state)}`);
};

const set = next => {
  state = { ...state, ...next };
  render();
};

/* ---------- events ---------- */

form.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'tg-name') {
    const v = t.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (v) set({ name: v });
    return;
  }
  if (t.dataset.key && t.type === 'color') return set({ [t.dataset.key]: t.value });
  if (t.dataset.hex) {
    const v = t.value.trim().startsWith('#') ? t.value.trim() : `#${t.value.trim()}`;
    if (isHex(v)) set({ [t.dataset.hex]: v.toLowerCase() });
    return;
  }
  if (t.dataset.follow) {
    const key = t.dataset.follow;
    return set({ [key]: t.checked ? null : derivedHex(key) });
  }
  if (t.dataset.key === 'shadow') return set({ shadow: t.checked });
  if (t.dataset.key) set({ [t.dataset.key]: Number(t.value) });
});

form.addEventListener('submit', e => e.preventDefault());

for (const r of $$('input[name="tg-scheme"]'))
  r.addEventListener('change', () => {
    scheme = r.value;
    render();
  });

for (const r of $$('input[name="tg-scope"]'))
  r.addEventListener('change', () => {
    scope = r.value;
    renderCss();
  });

$('#tg-random').addEventListener('click', () => {
  const h = Math.round(Math.random() * 360);
  const c = (0.04 + Math.random() * 0.18).toFixed(3);
  const l = (0.45 + Math.random() * 0.3).toFixed(3);
  set({
    primary: toHex(`oklch(${l} ${c} ${h})`),
    secondary: null,
    neutral: null,
    ...(() => {
      const pick = () => [0, 0.25, 0.5, 1, 2][Math.floor(Math.random() * 5)];
      return { radiusBox: pick(), radiusField: pick(), radiusSelector: pick() };
    })(),
    shadow: Math.random() > 0.3,
  });
});

$('#tg-reset').addEventListener('click', () => set({ ...DEFAULTS }));

$('#tg-save').addEventListener('click', () => {
  const list = readSaved().filter(t => t.name !== state.name);
  list.push({ ...state });
  writeSaved(list);
  renderSaved();
  const btn = $('#tg-save');
  btn.textContent = 'Saved';
  setTimeout(() => (btn.textContent = 'Save'), 1000);
});

$('#tg-share').addEventListener('click', async () => {
  const btn = $('#tg-share');
  try {
    await navigator.clipboard.writeText(location.href);
    btn.textContent = 'Link copied';
  } catch {
    btn.textContent = 'Copy the address bar';
  }
  setTimeout(() => (btn.textContent = 'Copy share link'), 1500);
});

/* ---------- start ---------- */

state = fromHash(location.hash);
renderPresets();
renderSaved();
renderCss();

const start = () => {
  render();
  new ResizeObserver(fitFrame).observe(frame.contentDocument.body);
};

if (frame.contentDocument?.readyState === 'complete' && frame.contentDocument.body?.childElementCount) start();
else frame.addEventListener('load', start, { once: true });
