# @sparkstone/css

## 3.0.0

### Major Changes

- [#9](https://github.com/sparkstonepdx/css/pull/9) [`663e25b`](https://github.com/sparkstonepdx/css/commit/663e25bdf9892adc532e339f26885c33d9054246) Thanks [@odama626](https://github.com/odama626)! - 3.0: a new colour engine. Set `--primary` (or 2.x's `--color`), `--secondary`, `--neutral` and `--error` on any `.retheme` element and its subtree re-themes; the nine-step `--*-lc-*` scale is gone in favour of named colours (`--fg`, `--fg-muted`, `--surface`, `--line`, `--primary-fill` and so on). Disabled and invalid states are two generic rules. Adds entrance and state-change animations on `--duration-change` and `--duration-enter`, and the docs gain composition examples.

### Minor Changes

- [#9](https://github.com/sparkstonepdx/css/pull/9) [`663e25b`](https://github.com/sparkstonepdx/css/commit/663e25bdf9892adc532e339f26885c33d9054246) Thanks [@odama626](https://github.com/odama626)! - Split the corner radius into `--radius-box`, `--radius-field` and `--radius-selector`, each falling back to `--border-radius`, and add a theme generator to the docs.
