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
| Vertical orientation | bottom rule becomes a right rule, indicator moves to the trailing edge | |

## Menu and dropdown (`src/components/_menu.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| `.dropdown-content` surface | `--surface-lc-1` with a `--surface-lc-2` border and `--box-shadow` | same recipe as `.card-border` plus the card's shadow, so a panel reads as a raised card |
| `.dropdown-content` min-width | `12rem` | Kobalte's own example uses 220px |
| `.dropdown-content` padding | `--padding / 4` | just enough that a highlighted row's corners clear the panel edge |
| `.dropdown-content` z-index | `50` | **Questionable**: the framework's only other z-index is 999 on `.dialog`. Two magic numbers with nothing between them |
| `.menu` gap | `--padding / 8` | |
| `.menu-item` padding | `--padding / 3` and `--padding / 2` | tighter than `.btn`, since rows stack |
| `.menu-item` hover | `--surface-lc-2` | same hover surface as `.tab` |
| `.menu-active` | `--surface-lc-2`, no colour change | **Questionable**: identical to hover, so a highlighted row and a hovered row are indistinguishable. Kobalte's own example inverts the row instead |
| `.menu-disabled` | `apply-greyscale()` plus `pointer-events: none` | matches `.tab-disabled` |
| `.menu-title` | `0.875rem` in `--text-lc-3` | |
| `.menu-shortcut` | `margin-left: auto`, `0.875rem` in `--text-lc-3` | not a daisyUI class; it names the trailing slot Kobalte's example calls `item-right-slot` |
| Kobalte separator | `hr` inside a menu gets a `--surface-lc-2` rule with `--padding / 4` margins | the framework's `hr` is a prose rule with 1rem margins, too loose inside a panel |
