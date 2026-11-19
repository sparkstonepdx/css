---
"@sparkstone/css": minor
---

Notices are styled through tokens (`--notice-edge`, `--notice-bg`, `--notice-ink`, `--notice-muted`, `--notice-weight`, `--notice-width`, `--notice-pad`, `--notice-radius`, `--notice-shadow`, `--notice-art-size`, `--notice-art-bg`, `--notice-art-ink`), so each app fits them to its look. The defaults take Wordbag's shape: as wide as their words, an edge in the new `--notice-edge` (the accent unless an app sets its reward colour) on a 14% tint of it, words at normal weight, and the picture at text size. A notice with buttons or a detail line stays the column's width. Proposal, see DESIGN-REVIEW.md.
