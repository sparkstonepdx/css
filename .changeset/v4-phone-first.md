---
"@sparkstone/css": major
---

4.0: components rebuilt from the apps that already look good, reference knobs so each app can start from its own physical reference, the apps' token names, and a phone layer.

- **Token names** follow the apps built on this library:

  | 3.x | 4.0 |
  | --- | --- |
  | `--bg` (page and fields) | `--bg` is the page; fields, cards and sheets use `--surface` |
  | `--surface`, `--surface-strong` | `--fill`, `--fill-strong` |
  | `--divider` | `--line` |
  | `--line` (3:1 boundary) | `--edge` |
  | `--fg`, `--fg-muted`, `--fg-faint` | `--ink`, `--muted`, `--faint` |
  | `--primary-fill`, `--on-primary-fill`, `--primary-text` | `--accent`, `--accent-ink`, `--accent-text` |
  | | new: `--good`, `--warn`, `--bad` |

- **Defaults:** the neutral is a near-grey on the brand's hue and links use the brand colour (set `--neutral: var(--primary)` and `--secondary` for 3.x's look); cards are raised off a page a step darker; borders are 1px; body text is 16px.
- **Reference knobs:** `--font`, `--display`, `--display-weight`, `--card-shadow`, `--card-pad`, `--card-gap`, with the radii and `--border-width`.
- **Navbar:** follows the box radius with a hairline all round; add `.navbar-flush` to a bar that runs edge to edge across the top of the page.
- **Components:** new looks for `.btn`, `.card`, `.badge`, `.table` and headings; new `.list` / `.row`, `.page-head`, `.eyebrow`, `.stack`, `.section`, `.sheet`, `.notice`, `.btn-sm`, `.btn-lg`, `.icon-btn`.
- **Status:** `--success`, `--warning` and `.success`, `.warning` beside `.error`, with `.badge-*`, `.alert-*` and `.notice-*` variants.
- **Tokens:** `--text-*`, `--space-*`, `--z-*`, `--tap`, `--ease-*`.
- **Phone layer:** `.dock`, `.dock-space`, `.bottom-bars`, `.tap`, safe areas, no double-tap zoom, no iOS field zoom.
