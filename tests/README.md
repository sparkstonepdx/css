# Tests

Both projects drive the built docs site, so they build first.

## `pnpm test`: the three builds against each other

Every demo in the docs is screenshotted in each build it shows (Class,
Classless, Kobalte), in light and dark, and each render must match the Class
render pixel for pixel, apart from anti-aliasing. Everything is rendered in the
same run on the same machine, so there are no stored images and it gives the
same answer on any platform.

A failure attaches both screenshots, a diff image, and the computed styles that
differ. Open the report with `pnpm exec playwright show-report`.

Differences that are there by design are listed in
`cross-build-exceptions.json` with a reason. Anything else fails, and so does an
exception that no longer happens, so the list can't go stale.

## `pnpm test:visual`: every render against stored screenshots

Catches an unintended change to any component over time. Stored screenshots only
match on the platform that made them, so run this project inside Playwright's
Docker image, where fonts and rendering are fixed:

```bash
docker run --rm -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.56.0-noble \
  sh -c "corepack enable && pnpm install --frozen-lockfile && pnpm test:update"
```

That writes the baselines to `tests/regression.visual.ts-snapshots/`; commit
them. After an intended visual change, run the same command again and review the
changed images in the diff before committing.
