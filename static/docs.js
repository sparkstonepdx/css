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
  });
}

/* ---------- dialog demos ---------- */

for (const opener of document.querySelectorAll('[data-dialog]')) {
  opener.addEventListener('click', () => {
    document.getElementById(opener.dataset.dialog)?.showModal();
  });
}
