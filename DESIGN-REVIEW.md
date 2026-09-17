# Design review

Visual decisions made while adding components, waiting on your sign-off. Nothing
here was derived from an existing rule in the framework: these are proposals.
Structure, class names and state handling are settled; the numbers and the look
are not.

When a component is signed off, delete its section.

## Tabs (`src/components/_tabs.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| `.tabs` layout | flex row, `align-items: center` | daisyUI 5 uses grid here |
| `.tabs` rule | bottom border, `--border-width` in `--surface-lc-2` | matches `.card-border` and `.fieldset` |
| `.tab` padding | `0.75rem 1rem` | copied from `.btn` so a tab and a button line up |
| `.tab` color | `--text-lc-3` | same muted level as `.text-secondary` |
| `.tab` corners | `--border-radius` on the top two only | |
| `.tab` hover | background `--surface-lc-2` | same surface as the rule above it |
| `.tab-active` color | `--text-lc-1` | |
| `.tab-active` weight | bold | **Questionable**: bolding changes the tab's width, so the Kobalte indicator resizes as you switch. Colour alone, or a fixed-weight trick, would avoid it |
| `.tab-active` underline | inset box-shadow, `--border-width` in `--surface-lc-4` | box-shadow rather than a border so it does not shift the text |
| `.tab-disabled` | `apply-greyscale()` plus `pointer-events: none` | greyscale matches `:disabled` elsewhere; the pointer-events part is new behaviour for this framework |
| `.tab-content` padding | `1rem 0` | horizontal padding left at 0 so panel text lines up with the page |

## Kobalte bindings (`src/components/_kobalte.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| `.tab-indicator` colour | `--surface-lc-4` | same as the active underline it replaces |
| `.tab-indicator` thickness | `--border-width` | |
| `.tab-indicator` transition | `all 250ms` | taken from Kobalte's own docs example; the framework has no motion convention yet, and this is the first animated thing in it |
| Indicator vs underline | when an indicator is present, the active tab drops its own underline | |
| Cascade layer | bindings live in a `kobalte` layer above `theme` | structural, not visual: it makes a Kobalte part beat the element defaults without relying on rule order |
| Vertical orientation | bottom rule becomes a right rule, indicator moves to the trailing edge | |
