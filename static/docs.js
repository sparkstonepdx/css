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
  { cssVar: '--color', id: 'base-color-picker', key: 'sparkstone-base-color', fallback: 'rebeccapurple' },
  { cssVar: '--accent-color', id: 'accent-color-picker', key: 'sparkstone-accent-color', fallback: '#425e00' },
  { cssVar: '--error-color', id: 'error-color-picker', key: 'sparkstone-error-color', fallback: 'maroon' },
];

const toHex = (value, fallback) => {
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = fallback;
    ctx.fillStyle = value;
    return ctx.fillStyle;
  } catch {
    return fallback;
  }
};

for (const { cssVar, id, key, fallback } of pickers) {
  const computed = getComputedStyle(root).getPropertyValue(cssVar).trim();
  const initial = sessionStorage.getItem(key) || toHex(computed, fallback);
  root.style.setProperty(cssVar, initial);

  const input = document.getElementById(id);
  if (!input) continue;
  input.value = initial;
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

const themeVars = ['--color', '--accent-color', '--error-color'];

const frameDoc = (markup, variant, id) => {
  const scheme = root.getAttribute('data-color-scheme') || 'light';
  const vars = themeVars
    .map(v => [v, root.style.getPropertyValue(v).trim()])
    .filter(([, value]) => value)
    .map(([v, value]) => `${v}:${value}`)
    .join(';');
  const sheet = variant === 'classless' ? 'classless.css' : 'index.css';
  return `<!doctype html><html lang="en" data-color-scheme="${scheme}" style="${vars}">
<head><meta charset="utf-8"><link rel="stylesheet" href="./${sheet}"></head>
<body>${markup}${FRAME_RUNTIME.replace('FRAME_ID', JSON.stringify(id))}</body></html>`;
};

const demos = [...document.querySelectorAll('[data-demo]')].map((el, index) => {
  const id = `demo-${index}`;
  const frame = el.querySelector('[data-demo-frame]');
  const codes = [...el.querySelectorAll('code[data-variant]')];
  const render = () => {
    const variant = el.dataset.variant || 'classes';
    const code = codes.find(c => c.dataset.variant === variant) || codes[0];
    frame.srcdoc = frameDoc(code.textContent, code.dataset.variant, id);
  };
  const demo = { id, el, frame, codes, render };

  for (const tab of el.querySelectorAll('.tab')) {
    tab.addEventListener('click', () => {
      const variant = tab.dataset.variant;
      el.dataset.variant = variant;
      for (const other of el.querySelectorAll('.tab'))
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
