# @sparkstone/css

A minimal CSS framework inspired by [Pico.css](https://picocss.com) and [daisyUI](https://daisyui.com), rebuilt with `oklch()` color primitives and a themeable design system using native CSS custom properties. Ships two builds from one source: class-based (the main export) and classless.

**🔗 [View on NPM](https://www.npmjs.com/package/@sparkstone/css) | [View on GitHub](https://github.com/sparkstonepdx/css)**

---

## ✨ Features

- 💡 Built with `oklch()` for perceptually uniform color scales
- 🌗 Automatic light/dark theming with CSS variables
- 🧱 Class-based build with daisyUI 5 class names (`btn`, `input`, `card`, ...)
- 📄 Classless build that styles plain HTML (the 1.x theme)
- ⚡ No JS required for core styles
- 🎨 Fully themeable via CSS variables or Sass functions
- 🧩 SCSS mixins for advanced integrations

---

## 🚀 Install

```bash
# pnpm
pnpm add @sparkstone/css
```

```bash
# yarn
yarn add @sparkstone/css
```

```bash
# npm
npm install @sparkstone/css
```

---

## 🌐 Live Demo & Docs

Explore the docs and theme live:

🔗 [https://sparkstonepdx.github.io/css/docs](https://sparkstonepdx.github.io/css/docs)

---

## 📦 Usage

### Pick a build

```scss
// Class-based (main export)
@use "pkg:@sparkstone/css";

// Classless
@use "pkg:@sparkstone/css/classless";
```

```ts
// Precompiled CSS
import '@sparkstone/css';           // dist/index.css
import '@sparkstone/css/classless'; // dist/classless.css
```

`pkg:` URLs need Sass's Node package importer (`--pkg-importer=node`, or `importers: [new NodePackageImporter()]`). Vite resolves the plain imports on its own.

### Class-based

Plain elements only get the reset and base colors. Styling comes from classes, named after daisyUI 5:

| Component | Classes |
| --- | --- |
| Button | `btn`, `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-neutral`, `btn-disabled` |
| Form controls | `input`, `select`, `textarea`, `checkbox`, `radio`, `range`, `file-input`, `color-input`, `input-error`, `select-error`, `textarea-error` |
| Form layout | `label`, `fieldset`, `fieldset-legend` |
| Card | `card`, `card-border`, `card-actions` |
| Dialog | `dialog`, `dialog-box`, `dialog-header`, `dialog-actions` |
| Content | `prose` (styles `p`, headings, lists, `blockquote`, `hr`, `code`, `pre`, `kbd` inside it), `link`, `kbd`, `table`, `progress`, `badge` |
| Utilities | `text-secondary`, `text-error`, `disabled`, `container`, `container-fluid`, `flex`, `flip`, `reverse`, `rounded` |

Dialogs intentionally use `dialog-*` instead of daisyUI's `modal-*`.

```html
<article class="card">
  <h2>Hello World</h2>
  <button class="btn btn-primary">Go</button>
</article>
```

### Classless

```html
<article>
  <h2>Hello World</h2>
  <button>Go</button>
</article>
```

The classless build applies the same component mixins to elements, so both builds stay in sync. When changing styles, edit the mixin in `src/components/`, not the entry files.

### Migrating from 1.x

1.x's theme is now the classless build. Replace `@sparkstone/css/src/theme.scss` with `@sparkstone/css/src/classless.scss` (or `pkg:@sparkstone/css/classless`), and `dist/theme.css` with `dist/classless.css`. Importing the package root now gives you the class-based build.

---

## 🎨 Theming

Set custom colors using CSS variables:

```css
:root {
  --color: rebeccapurple;
  --primary-color: blue;
  --accent-color: oklch(from var(--color) l c calc(h + 180));
  --error-color: maroon;
}
```

System-based dark mode is supported by default, but you can override manually:

```html
<html data-color-scheme="light">
  <!-- or -->
  <html data-color-scheme="dark"></html>
</html>
```

---

## 🧑‍🎨 Theme Swatches

Use these CSS variables for consistent contrast:

- `--text-lc-1` ... `--text-lc-9`
- `--surface-lc-1` ... `--surface-lc-9`

They adjust automatically in dark/light mode and derive from `--color`.

You can preview or override them using:

```scss
@use '@sparkstone/css/src/vars.scss' as *;

// Example: generate a color
color: get-color(var(--text-lc-2), var(--accent-color));
border-color: get-border-color();
```

---

## 🧪 Documentation

See it live via GitHub Pages:

- [`forms.html`](https://sparkstonepdx.github.io/css/forms.html) — Styled form elements and validation states
- [`colors.html`](https://sparkstonepdx.github.io/css/colors.html) — Theme-based palette viewer with interactive color picker
- [`containers.html`](https://sparkstonepdx.github.io/css/containers.html) — Articles, cards, and dialogs
- [`index.html`](https://sparkstonepdx.github.io/css/) — Overview & installation

Each page includes copyable code examples and live previews.

---

## 🛠 Dev

```bash
pnpm install
pnpm dev
```

This watches both `src/` and `pages/` for changes. It compiles SCSS to `dist/`, renders Nunjucks templates from `pages/` to `docs/`, and serves with live reload.

To build manually:

```bash
pnpm build
```

---

## 📦 Package Structure

```text
dist/             # Compiled CSS (index.css, classless.css)
src/index.scss    # Class-based entry
src/classless.scss # Classless entry
src/components/   # One mixin per component, shared by both entries
src/vars.scss     # Color scale, functions
pages/      # Nunjucks page templates
templates/  # Shared macros and layout
docs/       # Output static site for GitHub Pages
```

---

## 💬 License

MIT © [Sparkstone LLC](https://sparkstonepdx.com)
