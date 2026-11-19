---
"@sparkstone/css": minor
---

A full-width header lines up with the page: `.navbar-flush` still runs edge to edge, but its contents now sit over the page content's left and right edges at every width, clear of a notch. The page column is now two tokens, `--page-max` and `--page-pad`, which `.container` reads (same values as before); an app with its own column sets them once. Proposal, see DESIGN-REVIEW.md.
