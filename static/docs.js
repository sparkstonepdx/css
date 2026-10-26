// Documentation site behavior. Not part of @sparkstone/css.

const root = document.documentElement;

/* ---------- color scheme ---------- */

const savedScheme = sessionStorage.getItem('color-scheme');
if (savedScheme) root.setAttribute('data-color-scheme', savedScheme);

const toggle = document.getElementById('theme-toggle');

const labelToggle = () => {
  if (!toggle) return;
  const scheme = root.getAttribute('data-color-scheme') || 'light';
  toggle.textContent = scheme === 'dark' ? 'Light' : 'Dark';
  toggle.setAttribute('aria-pressed', String(scheme === 'dark'));
};

toggle?.addEventListener('click', () => {
  const next =
    (root.getAttribute('data-color-scheme') || 'light') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-color-scheme', next);
  sessionStorage.setItem('color-scheme', next);
  labelToggle();
  rerenderDemos?.();
});

labelToggle();

/* ---------- copy buttons ---------- */

for (const btn of document.querySelectorAll('.copy-button')) {
  btn.addEventListener('click', async () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    await navigator.clipboard.writeText(target.innerText);
    btn.textContent = 'Copied';
    setTimeout(() => (btn.textContent = 'Copy'), 1000);
  });
}

/* ---------- live theme pickers ---------- */

const pickers = [
  { cssVar: '--primary', id: 'base-color-picker', key: 'sparkstone-primary', fallback: 'rebeccapurple' },
  { cssVar: '--secondary', id: 'accent-color-picker', key: 'sparkstone-secondary', fallback: '#425e00' },
  { cssVar: '--error', id: 'error-color-picker', key: 'sparkstone-error', fallback: 'maroon' },
];

// A colour input needs #rrggbb. Custom properties can hold relative-colour
// expressions that nothing parses, so resolve them through a real element's
// computed colour, then read the pixel back.
const toHex = (cssColor, fallback) => {
  try {
    const probe = document.createElement('span');
    probe.style.color = cssColor;
    document.body.append(probe);
    const resolved = getComputedStyle(probe).color;
    probe.remove();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = resolved;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  } catch {
    return fallback;
  }
};

for (const { cssVar, id, key, fallback } of pickers) {
  // Only write an input the reader actually chose. Writing the default would pin
  // it at the root, and an unset input is what lets --secondary follow --primary
  // wherever --primary is changed.
  const stored = sessionStorage.getItem(key);
  if (stored) root.style.setProperty(cssVar, stored);

  const input = document.getElementById(id);
  if (!input) continue;
  // Seed from what the page is actually using: the resolved colour of the
  // derived role, so an unset --secondary shows the link colour it produces.
  const role = { '--primary': 'var(--primary-base)', '--secondary': 'var(--link)', '--error': 'var(--error)' }[cssVar];
  input.value = stored || toHex(role, fallback);
  input.addEventListener('input', () => {
    root.style.setProperty(cssVar, input.value);
    sessionStorage.setItem(key, input.value);
    rerenderDemos?.();
  });
}

/* ---------- sidebar ---------- */

const sidebar = document.getElementById('site-sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');

sidebarToggle?.addEventListener('click', () => {
  const open = sidebar.getAttribute('data-open') !== 'true';
  sidebar.setAttribute('data-open', String(open));
  sidebarToggle.setAttribute('aria-expanded', String(open));
});

/* ---------- demo previews ----------

Each demo renders in an iframe so the preview uses the same build as the tab
that is selected: index.css for class markup, classless.css for classless. The
frame reports its own height back, and demo runtime (dialog openers) lives
inside it. */

const FRAME_RUNTIME = `
<sty` + `le>body{margin:0;padding:1rem;min-height:0}</sty` + `le>
<scr` + `ipt>
document.addEventListener('click', e => {
  const opener = e.target.closest('[data-dialog]');
  if (!opener) return;
  document.getElementById(opener.dataset.dialog)?.showModal();
  setTimeout(send);
});
const openHeight = () => {
  const dialog = document.querySelector('dialog[open], [open].dialog');
  if (!dialog) return 0;
  const box = dialog.firstElementChild;
  return Math.max((box?.scrollHeight || 0) + 96, 240);
};
const selectTab = tab => {
  const list = tab.closest('[role="tablist"]');
  if (!list) return;
  for (const other of list.querySelectorAll('[role="tab"]')) {
    // Both spellings: data-selected is what Kobalte sets, .tab-active is what
    // the class-based build styles.
    other.toggleAttribute('data-selected', other === tab);
    other.classList.toggle('tab-active', other === tab && other.classList.contains('tab'));
    other.setAttribute('aria-selected', String(other === tab));
    other.tabIndex = other === tab ? 0 : -1;
    const panel = document.getElementById(other.getAttribute('aria-controls') || '');
    if (panel) panel.hidden = other !== tab;
  }
  const indicator = list.querySelector('.tab-indicator');
  if (indicator) {
    indicator.style.width = tab.offsetWidth + 'px';
    indicator.style.left = tab.offsetLeft + 'px';
  }
};
const placeSegmented = root => {
  const indicator = root.querySelector('.segmented-indicator');
  const item = [...root.querySelectorAll('.segmented-item')].find(i => i.querySelector('input:checked'));
  if (!indicator || !item) return;
  for (const i of root.querySelectorAll('.segmented-item')) i.toggleAttribute('data-checked', i === item);
  Object.assign(indicator.style, { left: item.offsetLeft + 'px', width: item.offsetWidth + 'px' });
};
document.addEventListener('change', e => {
  const root = e.target.closest('.segmented');
  if (root) placeSegmented(root);
});
addEventListener('load', () => document.querySelectorAll('.segmented').forEach(placeSegmented));
document.addEventListener('click', e => {
  const tab = e.target.closest('[role="tab"]');
  if (tab && !tab.hasAttribute('data-disabled')) selectTab(tab);
});
addEventListener('load', () => {
  for (const list of document.querySelectorAll('[role="tablist"]')) {
    const selected = list.querySelector('[role="tab"][data-selected]');
    if (selected) selectTab(selected);
  }
});
const send = () => parent.postMessage(
  { demo: FRAME_ID, height: Math.max(document.body.scrollHeight, openHeight()) },
  '*'
);
new ResizeObserver(send).observe(document.body);
addEventListener('load', send);
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.addEventListener('close', () => setTimeout(send));
}
<\/scr` + `ipt>`;

const themeVars = ['--primary', '--secondary', '--error'];

const frameDoc = (markup, variant, id) => {
  const scheme = root.getAttribute('data-color-scheme') || 'light';
  const vars = themeVars
    .map(v => [v, root.style.getPropertyValue(v).trim()])
    .filter(([, value]) => value)
    .map(([v, value]) => `${v}:${value}`)
    .join(';');
  const sheets =
    { classless: ['classless.css'], kobalte: ['kobalte.css'], 'kobalte-markup': ['kobalte.css'] }[
      variant
    ] || ['index.css'];
  return `<!doctype html><html lang="en" data-color-scheme="${scheme}" style="${vars}">
<head><meta charset="utf-8">${sheets.map(s => `<link rel="stylesheet" href="./${s}">`).join('')}</head>
<body>${markup}${FRAME_RUNTIME.replace('FRAME_ID', JSON.stringify(id))}</body></html>`;
};

const demos = [...document.querySelectorAll('[data-demo]')].map((el, index) => {
  const id = `demo-${index}`;
  const frame = el.querySelector('[data-demo-frame]');
  const codes = [...el.querySelectorAll('code[data-variant]')];
  const render = () => {
    const variant = el.dataset.variant || 'classes';
    const code = codes.find(c => c.dataset.variant === variant) || codes[0];
    // Tabs that hold JSX rather than markup preview the DOM that JSX renders.
    const previewFor = { source: 'classes', kobalte: 'kobalte-markup' }[code.dataset.variant];
    const preview = previewFor ? codes.find(c => c.dataset.variant === previewFor) || codes[0] : code;
    frame.srcdoc = frameDoc(preview.textContent, preview.dataset.variant, id);
  };
  const demo = { id, el, frame, codes, render };

  for (const tab of el.querySelectorAll('.variant-tab')) {
    tab.addEventListener('click', () => {
      const variant = tab.dataset.variant;
      el.dataset.variant = variant;
      for (const other of el.querySelectorAll('.variant-tab'))
        other.setAttribute('aria-selected', String(other === tab));
      for (const code of codes) code.parentElement.hidden = code.dataset.variant !== variant;
      const copy = el.querySelector('.copy-button');
      if (copy) copy.dataset.target = codes.find(c => c.dataset.variant === variant).id;
      render();
    });
  }

  render();
  return demo;
});

addEventListener('message', event => {
  const { demo, height } = event.data || {};
  const match = demos.find(d => d.id === demo);
  if (match && height) match.frame.style.height = `${height}px`;
});

const rerenderDemos = () => demos.forEach(d => d.render());
