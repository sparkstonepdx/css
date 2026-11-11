# @sparkstone/css

## 4.0.0

### Major Changes

- [#10](https://github.com/sparkstonepdx/css/pull/10) [`6ffbf93`](https://github.com/sparkstonepdx/css/commit/6ffbf938a23489bd18a0092f931e62a2e1073b20) Thanks [@odama626](https://github.com/odama626)! - 4.0: components rebuilt from the apps that already look good, reference knobs so each app can start from its own physical reference, the apps' token names, and a phone layer.
  
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

## 3.0.0

### Major Changes

- [#9](https://github.com/sparkstonepdx/css/pull/9) [`663e25b`](https://github.com/sparkstonepdx/css/commit/663e25bdf9892adc532e339f26885c33d9054246) Thanks [@odama626](https://github.com/odama626)! - 3.0: a new colour engine. Set `--primary` (or 2.x's `--color`), `--secondary`, `--neutral` and `--error` on any `.retheme` element and its subtree re-themes; the nine-step `--*-lc-*` scale is gone in favour of named colours (`--fg`, `--fg-muted`, `--surface`, `--line`, `--primary-fill` and so on). Disabled and invalid states are two generic rules. Adds entrance and state-change animations on `--duration-change` and `--duration-enter`, and the docs gain composition examples.

### Minor Changes

- [#9](https://github.com/sparkstonepdx/css/pull/9) [`663e25b`](https://github.com/sparkstonepdx/css/commit/663e25bdf9892adc532e339f26885c33d9054246) Thanks [@odama626](https://github.com/odama626)! - Split the corner radius into `--radius-box`, `--radius-field` and `--radius-selector`, each falling back to `--border-radius`, and add a theme generator to the docs.
