# Design review

## 4.0 (`v4` branch) — not signed off

Why: UIs built on 3.x without a design direction came out lavender with olive links and heavy outlines (the Nook dashboard), and none of the phone apps used the library because it had no dock, sheet, safe areas or tap minimum. These are the changes; every value is a proposal.

| Decision | Proposed | Note |
| --- | --- | --- |
| `--neutral` default | `oklch(from primary l 0.02 h)`: a near-grey on the brand's hue | **Breaking.** 3.x used the primary itself, so the page, surfaces and text took the brand's full colour. `--neutral: var(--primary)` restores it |
| `--secondary` default | the primary | **Breaking.** 3.x rotated it 180deg: purple brands got olive links |
| `--border-width` | `1px` | **Breaking.** 3.x was `0.1625rem` (2.6px) |
| Body text | `var(--text)`, 16px | **Breaking.** 3.x was 18px |
| Status colours | `--success` `oklch(0.55 0.13 150)`, `--warning` `oklch(0.7 0.15 75)`; `.success`, `.warning` beside `.error`; `.badge-*` and `.alert-*` for all three, and `.notice-*` | a status sets `--neutral` as well as `--primary`, so the surface takes a tint of it, not just the text |
| Type scale | `--text-xs` 0.75, `--text-sm` 0.875, `--text` 1, `--text-lg` 1.25, `--text-xl` 1.75, `--text-icon` 1.5 rem | from Wordbag; components still use their own sizes until moved over |
| Space scale | `--space-2xs` 0.125 to `--space-3xl` 3rem, eight steps | from Wordbag; same note |
| Layers | `--z-dock` 10, `--z-sheet` 20, `--z-notice` 30, `--z-popover` 35, `--z-drag` 40, `--z-fx` 45, `--z-bar` 60 | `.dialog` is still 999 and the dropdown 50 |
| `--tap` | 44px | WCAG 2.2 2.5.5 |
| Easing | `--ease-pop`, `--ease-spring`, `--ease-out`, `--ease-in-out`, `--ease-settle` | Word Summit's curves and Wordbag's sheet curve |
| Phone layer (`_phone.scss`) | `.dock`, `.dock-space`, `.bottom-bars` (28px above a 16px-minimum safe area), `.tap` reach, `touch-action: manipulation` on controls, 16px inputs on iOS | |
| `.sheet` | bottom-anchored, 520px (720 wide), 88dvh, a `--divider` rule round its edge (a shadow doesn't show in dark), grip 36 by 4, slides up 340ms on `--ease-settle`; centred with all corners rounded from 700px | the look of Wordbag's drawer; behaviour lives in @sparkstone/kit |
| `.notice` | stack above `--dock-h`, cards up to 420px, rise over `--duration-enter` on `--ease-spring`, a 2.5rem coin for the thing it's about | replaces the corner `.toast` on phones |
| Buttons | `.btn-sm`, `.btn-lg`, `.icon-btn` (44 by 44, `--text-icon`) | |
| Token names | the apps' names: `--bg` (page), `--surface` (raised), `--fill`, `--fill-strong`, `--line` (hairline), `--edge` (3:1 boundary), `--ink`, `--muted`, `--faint`, `--accent`, `--accent-ink`, `--accent-text`, `--link`, and new `--good`, `--warn`, `--bad` | **Breaking.** Decided by Adam; the migration table is in the 4.0 changeset |
| Controls line up | every one-line control is `--control-h` (2.75rem) tall: fields, colour inputs, buttons, tabs; selects reach it by padding. Controls carry no outer margin; `.label` spaces a form (1rem) and rows zero it. New `.field-row` lines controls up on their bottom edge | **Breaking:** bare controls lose their 1rem bottom margin. `tests/alignment.spec.ts` fails if controls side by side differ in height or bottom edge on any docs page |
| Reference knobs | `--font`, `--display`, `--display-weight` (750), `--card-shadow`, `--card-pad`, `--card-gap`, with the radii and `--border-width` | what an app sets from its physical reference; the PR shows four references set this way |
| Page and raised | `--bg` (light 0.955, dark 0.15) behind everything; `--surface` (light 0.995, dark 0.215) for cards, rows, sheets, fields, notices | **Breaking.** 3.x cards were darker than the page, so they read as wells |
| `.btn` | inline-flex, `--tap` tall, `--space-sm` by `--space-lg`, weight 650; press shrinks to 0.97 | `.btn-secondary` is the raised fill with a hairline (Wordbag's quiet button), `.btn-ghost` text only |
| `.card` | raised fill, hairline, `--card-shadow`, `--card-pad` | `.card-border` is the hairline alone |
| `.list` / `.row` | one raised block, rows split by hairlines, at least `--tap` + 12px tall | new |
| `.badge` | Wordbag's pill: `--text-sm`, weight 650, pill corners, `--surface` fill | |
| `.table` | `--space-sm` by `--space-md` cells, muted small headers, tabular numbers, no rule under the last row | |
| Headings | `--display` at `--display-weight`, line-height 1.15, balanced | |
| `.page-head`, `.page-actions`, `.eyebrow`, `.stack`, `.section` | | new |
| `.alert`, `.notice` | raised fill and hairline (the notice adds a soft drop shadow) instead of the brand's tint and line | |

## 3.0 colour engine (`src/vars.scss`) — not signed off

The nine-step scale is gone. Four inputs, set on any `.retheme` element,
re-theme its whole subtree: `--primary` (or 2.x's `--color`), `--secondary`,
`--neutral`, `--error`. The derived colours are computed at the root and at each
`.retheme` boundary, registered with `@property` so they inherit as finished
colours; components that set an input themselves `@extend .retheme`. Colours keep
the input's hue and chroma and pin only the lightness.

| Decision | Proposed | Note |
| --- | --- | --- |
| Lightness and chroma per role | taken from 2.x's scale stops, so a vivid brand looks as it did | the caps are per scheme, since the dark end of the scale carries more chroma |
| Surfaces and rules | a tinted mid-tone (`--tint`) mixed into `--bg`, 30% and 63% | solid, not translucent, so text on them has one contrast ratio wherever they sit, over images included. Lands on 2.x's surface stops. Nested surfaces no longer stack |
| `--line` | lightness 0.62 light, 0.54 dark | **Deliberate change from 2.x**: 0.695 failed WCAG 1.4.11 (3:1 for UI boundaries) at about 2.7 for every brand tested. Borders, focus rings, active underlines and fills are slightly darker |
| Disabled | `--chroma: 0` plus `@extend .retheme` | replaces 29 re-bound variables per disabled selector, and a disabled element's own text now greys too |
| `.retheme` | the boundary class, from sparkcss | re-derivation is opt-in: overriding a derived colour such as `--surface` reaches the whole subtree, and restyles are 8% faster than 2.x (median 38.2 against 41.5 ms over 5,000 elements) |
| Tooltip | `--fg` background, `--bg` text: a true inverse | the mid-tone it had measured 3.47:1 in the worst case (2.x's was similar); the inverse measures 18.37 |
| Placeholder text | `--fg-muted` mixed 70% into the page | the smallest mix that passes 4.5:1 for every brand in both schemes (lowest 4.78); 50% measured 2.86. Still reads lighter than an entered value |
| Dialog open animation | fades in from `scale(1.25)` over `--duration-enter`, 400ms, off under reduced motion | your keyframes, from your Pico project. 400ms is Material 3's duration for an element entering the screen; it was 550ms. State changes use `--duration-change` (200ms, your 1.x value): toggles, ticks, radio dots, and tab and segmented indicators. Loops (spinner 0.7s, skeleton 1.4s) keep their own |
| Dialog backdrop and close | blur and backdrop fade in over `--duration-change`; closing fades the dialog out over the same | the exit needs `transition-behavior: allow-discrete` (Chrome 117+, Safari 17.5+, Firefox 129+); older browsers close instantly. Firefox lacks `overlay`, so its exit may cut short |
| Panel entrance | dropdown, popover and tooltip fade in from `scale(0.96)` over `--duration-change`, from the top edge (tooltips from the centre) | plays whenever the panel starts rendering, so it works however it is shown. **Open**: panels arrive on screen, so arguably they belong on `--duration-enter`; at 400ms a dropdown felt heavy, so they use `--duration-change` |
| Micro-interactions | `.btn` eases colour changes and grows to `scale(1.02)` while pressed, your call over the earlier shrink, on Material 3's standard curve `cubic-bezier(0.2, 0, 0, 1)`: 41% of the way there 25ms after the click, where the default `ease` managed 7%; menu rows, tabs and collapse titles ease their hover | colour transitions also animate a scheme switch on those elements |
| Toast entrance | each message rises `0.75rem` and fades in over `--duration-enter` | no swipe-to-dismiss without a component library |
| Collapse open and close | the content's visibility (`<details>`) or `display` (`[hidden]`) flips with `allow-discrete`, so it stays until it has closed; height animates with `interpolate-size`, opacity fades alongside; Kobalte's Accordion.Content gets keyframes on `--kb-accordion-content-height` | 4.0: height animates in Chromium; Safari and Firefox fade at full height; browsers without `::details-content` open instantly |
| Checkbox | the box fills over `--duration-change`; the tick pops in from `scale(0.4)` with a slight overshoot, `cubic-bezier(0.34, 1.56, 0.64, 1)`, peaking at about 1.05 | the first easing curve in the framework other than the browser defaults. Checked, the tick rests exactly where it did |
| Row state | `.menu-active` also matches `:focus` and `[data-highlighted]`; `.menu-selected` also matches `[aria-selected="true"]` and `[aria-checked="true"]` | the class build couldn't show a headless library's highlight at all, since none exposes which row is highlighted. Same generic-state approach as disabled and error |
| Select text | one line with an ellipsis; chevron `0.75rem` from the right edge, `2.25rem` reserved for it | your values. Date and time inputs keep their own spacing for their picker button |
| Names | `--bg`, `--fg`, `--fg-muted`, `--fg-faint`, `--surface`, `--surface-strong`, `--divider`, `--line`, `--primary-text`, `--primary-fill`, `--on-primary-fill`, `--link` | renamed to the apps' names in 4.0 (see the 4.0 section) |

Measured across ten brand colours in both schemes (rebeccapurple, tomato,
#c2410c, #6b7c59, slategrey, #1d4ed8, #ffd400, #00ff88, hotpink, black): every
text pairing clears 4.5:1, the lowest being `--link` at 5.61, and `--line` clears
3:1, the lowest being 3.25.


Fixed since the last pass: a label's text never turned red when its control was
invalid. The rule set `--color` on the label's `<p>`, but the `<p>` inherits an
already-resolved colour from `body`, so nothing read it. It now sets its own
colour, at `--text-lc-3` to match `.text-error` (your call: at `--text-lc-1` the
error hue has too little chroma to read as red). This was broken in 1.x too.

Also fixed: `apply-greyscale()` now swaps `--surface-lc-*` as well
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

## Corner radius tokens (`--radius-box`, `--radius-field`, `--radius-selector`) — not signed off

Split from `--border-radius` the way daisyUI does, for the theme generator.
Nothing is declared, so every default renders exactly as before (checked pixel
for pixel on the theme preview page).

| Decision | Proposed | Note |
| --- | --- | --- |
| Boxes | card, card-border, card-actions corners, dialog-box, alert (and toast), dropdown panel, popover, fieldset, `.label.block`, skeleton, progress | daisyUI puts progress here too |
| Fields | button, input, select, textarea, file and colour inputs (and their inner button and swatch), tab top corners, menu row, segmented track, item and indicator | the segmented control counts as one control, so all three parts take the field radius |
| Selectors | checkbox, badge, toggle | unset, the checkbox keeps `--border-radius / 2`, the badge `--border-radius * 2` and the toggle stays a pill, so each looks as it did; set, all three take the one value. The toggle's knob takes the selector radius less twice the border width, so it stays concentric with the track |
| Left alone | radio (circle), slider and range rails (pills), spinner, prose `code` and `kbd` (fixed `0.25rem`), focus rings | |

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
| `.tab-active` | colour and underline, no weight change | bold was shifting the tab's width, which resized the Kobalte indicator on every switch |
| `.tab-active` underline | inset box-shadow, `--border-width` in `--surface-lc-4` | box-shadow rather than a border so it does not shift the text |
| `.tab-disabled` | `apply-greyscale()`, text at `--text-lc-5`, `pointer-events: none` | lighter text rather than a background, your call. `--text-lc-5` is the midpoint of the scale, so it lands at the same lightness in light and dark |
| `.tab-content` padding | `1rem 0` | horizontal padding left at 0 so panel text lines up with the page |

## Kobalte bindings (`src/components/_kobalte.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| `.tab-indicator` colour | `--surface-lc-4` | same as the active underline it replaces |
| `.tab-indicator` thickness | `--border-width` | |
| `.tab-indicator` transition | `all var(--duration-change)`, 200ms | shared with every other state change |
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
| `.menu-item` padding | `--padding / 2` block, `--padding` inline | your values. Rows are 42px tall; menubar triggers use the same class, so they widen too |
| `.menu-item` hover | `--surface-lc-2` | same hover surface as `.tab` |
| `.menu-active` | `--surface-lc-2`, no colour change | **Questionable**: identical to hover, so a highlighted row and a hovered row are indistinguishable. Kobalte's own example inverts the row instead |
| `.menu-disabled` | `apply-greyscale()`, text at `--text-lc-5`, `pointer-events: none` | matches `.tab-disabled`, your call |
| `.menu-title` | `0.875rem` in `--text-lc-3` | |
| `.menu-shortcut` | `margin-left: auto`, `0.875rem` in `--text-lc-3` | names the trailing slot Kobalte's example calls `item-right-slot` |
| Kobalte separator | `hr` inside a menu gets a `--surface-lc-2` rule with `--padding / 4` margins | the framework's `hr` is a prose rule with 1rem margins, too loose inside a panel |

## Toggle (`src/components/_toggle.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Size | `--toggle-height: 1.5rem`, track 1.75x that | matches `.checkbox`'s 1.5rem box |
| Track | `--surface-lc-2`, `--surface-lc-4` when on, border from `get-border-color()` | |
| Knob | `--surface-lc-1` | |
| Motion | `var(--duration-change)`, 200ms | shared with every other state change; see the motion note under 3.0 |
| One-element form | knob drawn as `::before`, the same box as `.toggle-thumb`, slid with `transform` | was a radial gradient, which could not take the selector radius. `::before` rather than `::after`, because the classless build also gives every checkbox `.checkbox`, whose tick is its `::after` |

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
| Menu row states | highlighted also on `:focus` and `[data-highlighted]`; selected also on `[aria-selected="true"]` and `[aria-checked="true"]` | the same generic-states approach as disabled and error: a headless library never exposes which row is highlighted, so the classes alone could not follow it |
| `.menu-selected` | a detached pill in `--surface-lc-4`, inset to the middle half of the row | an inset shadow bent around the row's rounded corners. **Alternative**: a trailing check mark, which most native selects use |
| Kobalte trigger | takes `.select`'s field styling, chevron included; `Select.Icon` is left out | it is a button that should read as a form control, and one chevron source means both builds match |
| Disabled `.select` | `opacity: 0.7`, `cursor: default` | Chrome already fades a disabled native select to 0.7; pinning it makes a button trigger and other browsers match. **Questionable**: this is the only disabled field that fades, since `.input` and `.textarea` only lose chroma |

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

## Navbar and menubar (`src/components/_navbar.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Bar | `--surface-lc-1` with a `--surface-lc-2` rule under it, `--padding / 2` vertical | matches the rule under `.tabs` and `.collapse` |
| Groups | `.navbar-start` and `.navbar-end` push apart with auto margins | **Open question**: no `.navbar-center`. Three-group layouts need a grid, not margins |
| Menubar | a row with the same gap as `.menu`, triggers are `.menu-item` | |

## Breadcrumbs (`src/components/_breadcrumbs.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Trail | `0.875rem`, `--padding / 4` gaps, wraps | |
| Current page | `--text-lc-1`, no underline | links carry the accent colour, so plain text is enough to mark the current page |
| Separator | a character you supply, `--text-lc-3` | a border or a slash pseudo-element would take it out of the markup |

## Pagination (`src/components/_pagination.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Row | `--padding / 4` gaps, wraps | |
| Page buttons | 2.25rem tall (`--pagination-size`), `--padding * 0.75` either side, numbers at least as wide as they are tall | a full-size `.btn` made them 55px tall and single digits tall, narrow rectangles (46 by 55); they are now 38 by 36 |
| Current page | applies the `btn-primary` block from `_button.scss` | so a row of `.btn-secondary` reads with one filled button, from one definition |
| Ellipsis | `--text-lc-3` | |

## Segmented control (`src/components/_segmented.scss`) — not signed off

| Decision | Proposed | Note |
| --- | --- | --- |
| Track | `--surface-lc-2` with a matching border, `--border-radius` | the inverse of `.tabs`, which has a rule rather than a fill |
| Item | `--text-lc-3`, `--text-lc-1` when checked | no weight change, so the item does not shift under the indicator |
| Checked fill | `--surface-lc-1`, from the indicator when one is present, otherwise from the item | same pattern as the tab indicator |
| Indicator motion | `all var(--duration-change)`, 200ms | shared with every other state change |

## Range (`src/components/_range.scss`) — not signed off

`.range` used to be a native range on the field surface: a bordered box with the
browser's own track and thumb inside. It is now painted with the slider's rail,
fill and thumb, so it matches `.slider` and Kobalte's Slider pixel for pixel.

| Decision | Proposed | Note |
| --- | --- | --- |
| Look | the slider's rail, fill and thumb, from one set of blocks in `_slider.scss` | **This changes the classless build**: every `input[type="range"]` looks like this now, not like 1.x |
| Fill in Chrome and Safari | reads `--range-fill`, which the page must keep in step with the value | they have no fill pseudo-element. Firefox draws the fill itself. **Questionable**: without the variable, the fill never moves in those browsers |
| Layout | `display: block` | it is full width anyway; block keeps it off the text baseline |

The slider was adjusted to meet it, which matters more than it looks: Kobalte
centres its thumb on the value, so the thumb used to hang half off the rail at 0%
and 100%, where a native thumb stays inside. `.slider-track` is now inset by half
a thumb and draws its rail back out to full width, so both travel identically.

