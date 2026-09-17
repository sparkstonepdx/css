# Design review

Fixed since the last pass: `apply-greyscale()` now swaps `--surface-lc-*` as well
as `--swatch-lc-*` and `--text-lc-*`, so backgrounds inside a disabled subtree
lose their chroma. They stayed fully saturated before, which is what the unused
`--grey-surface-lc-*` scale was built for. One gap remains: text inherited from
an ancestor, rather than set from the scale, still does not grey, because an
inherited `color` is an already-resolved value.

Visual decisions made while adding components, waiting on your sign-off. Nothing
here was derived from an existing rule in the framework: these are proposals.
Structure, class names and state handling are settled; the numbers and the look
are not.

A component with a section here ships as **alpha**: its styles can change in a
minor release, without a major version bump. The docs badge every alpha
component in the sidebar and on the components page, and each of their pages
carries a banner saying so. When you sign a component off, delete its section
here, drop the `alpha` flag from its entry in `templates/nav.njk`, remove the
`{{ m.alpha() }}` call from its page, and drop the ALPHA header from its source
file.

## Tabs (`src/components/_tabs.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| `.tabs` layout | flex row, `align-items: center` | |
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
| `.menu-shortcut` | `margin-left: auto`, `0.875rem` in `--text-lc-3` | names the trailing slot Kobalte's example calls `item-right-slot` |
| Kobalte separator | `hr` inside a menu gets a `--surface-lc-2` rule with `--padding / 4` margins | the framework's `hr` is a prose rule with 1rem margins, too loose inside a panel |

## Toggle (`src/components/_toggle.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Size | `--toggle-height: 1.5rem`, track 1.75x that | matches `.checkbox`'s 1.5rem box |
| Track | `--surface-lc-2`, `--surface-lc-4` when on, border from `get-border-color()` | |
| Knob | `--surface-lc-1` | |
| Motion | `150ms` on background and on the knob's transform | **Questionable**: the tab indicator animates at 250ms. Two durations, no scale |
| One-element form | knob drawn as a radial gradient and slid with `background-position` | a checkbox has no child to move and no usable `::before`. **Questionable**: a gradient knob will not take a border or a shadow if the design ever wants one |

## Tooltip (`src/components/_tooltip.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Bubble | `--surface-lc-5` background with `--surface-lc-1` text | the only inverted surface in the framework |
| Text | `0.875rem`, max-width `20rem` | |
| z-index | `50` | same magic number as the dropdown panel |

## Collapse (`src/components/_collapse.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Section | bottom rule only, no border or background | so a stack reads as a list, not as cards |
| Title | bold, `1rem`, full width, space-between | the size is pinned because Kobalte's trigger sits inside a heading |
| Title hover | text drops to `--text-lc-3` | **Questionable**: every other trigger in the framework changes its background on hover, not its text |
| Content padding | bottom only | |

## Alert (`src/components/_alert.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Box | `--surface-lc-2` with a border and `1rem` bottom margin | same surface as `.card` |
| Variants | `.alert-error` only | **Open question**: info, success and warning variants need tokens the framework does not have; it has `--color` and `--error-color` and nothing else |

## Select, Kobalte listbox (`src/components/_menu.scss`, `_kobalte.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| `.menu-selected` | bold | distinguishes the chosen option from the highlighted one. **Questionable**: bold shifts row width, the same objection as `.tab-active` |
| Kobalte trigger | takes `.select`'s field styling, with the chevron background dropped | it is a button that should read as a form control |

## Popover (`src/components/_popover.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Panel | same recipe as `.dropdown-content`: `--surface-lc-1`, `--surface-lc-2` border, `--box-shadow` | **Questionable**: two classes with identical surfaces. One could extend the other, or they could stay separate so they can diverge |
| Padding, width | `--padding`, max `20rem` | |
| Title, description | `1rem` bold, and `--text-lc-3` body | |
| z-index | `50` | the third place this number appears |

## Toast (`src/components/_toast.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Position | fixed, bottom-right, `--padding` from each edge | **Open question**: bottom-right is a guess. Top-right and bottom-centre are equally common |
| Stack | column, `--padding / 2` gap, max `24rem` | |
| Message | reuses `.alert` | |
| z-index | `100` | above the dropdown's 50, below the dialog's 999 |

## Divider (`src/components/_divider.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Rule | `--border-width` in `--surface-lc-2`, `--padding` margins | matches the rule under `.collapse` and `.tabs` |
| Vertical | `.divider-vertical`, sized by the caller | it needs a height from the flex row it sits in |

## Skeleton (`src/components/_skeleton.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Block | `--surface-lc-2`, `--border-radius` | |
| Shimmer | a `--surface-lc-1` gradient sweeping over 1.4s, off under reduced motion | **Questionable**: the third motion duration in the framework, after 150ms and 250ms |
| Sizing | none: the caller sets width and height | |

## Loading (`src/components/_loading.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Spinner | a `currentColor` ring on a 25% transparent track, 1.25rem, 0.7s | drawn from `currentColor` so it works inside a button without a variant per colour |
| Variants | none | daisyUI has dots, bars, ring and others. **Open question**: worth having, or is one spinner enough? |

## Slider (`src/components/_slider.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Track | half the thumb tall, `--surface-lc-2`, fully rounded | |
| Fill, thumb | `--surface-lc-4`; thumb is `--surface-lc-1` with a `--surface-lc-4` border | same pairing as the tab indicator and the toggle knob |
| Thumb size | `--slider-thumb: 1rem`, exposed so a caller can resize it | the only component here with its own sizing variable |
| Label, value | `0.875rem` in `--text-lc-3` | matches `.menu-title` and `.menu-shortcut` |

