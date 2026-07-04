# ADR 0004 — Version showcase: clientV1 / clientV2 / clientV3 as one site

**Status:** Accepted · 2026-07-04

## Context

The portfolio is a proof-of-work journey, not a static resume. Recruiters should be able to
compare how the site itself evolved. Three eras exist in git history: a first root-level Vite
app, a second `client/` app, and the current single-page app. We want all three live and
switchable — but the site is **one** Cloudflare Worker with **one** `wrangler.jsonc`, and the
`assets` binding points at a single directory. Adding workers or subdomains per era was
explicitly rejected: the eras must be **paths on the same site**.

The frozen eras were also committed with slightly drifted deps — e.g. clientV2 floated to
`react-icons@5.7.0`, which dropped the `SiOpenai` mark that its source imports.

## Decision

- **Physically split by era.** `client/ → clientV3/` (the living app); recover the two prior
  eras as `clientV1/` and `clientV2/` — independent, buildable apps with their own pinned deps
  and configs.
- **One site, path-scoped.** Each frozen app builds with a Vite `base` (`/v1/`, `/v2/`);
  `scripts/build-all.sh` builds all three and assembles a unified `dist/` — clientV3 at the
  root, `clientV1 → dist/v1/`, `clientV2 → dist/v2/`. `wrangler.jsonc` points `assets.directory`
  at `dist/`. No new worker, no new deployment. Deploy = `build-all.sh` then `wrangler deploy`.
- **Freeze, don't restyle.** `clientV1`/`clientV2` are **exempt from `CODE-STYLE.md`** and
  Biome — they stay authentic to their era. Only `clientV3` follows the guide. Pin frozen deps
  to the version that builds rather than editing frozen source (clientV2 pins `react-icons@5.6.0`).
- **Toggle in clientV3.** A `Navbar` + mobile drawer carries a `[v1][v2][v3]` `VersionSwitch`;
  v1/v2 are full-page links to `/v1/` and `/v2/`, v3 routes in-app.
- **Track configs past the blanket ignore.** The root `.gitignore` ignores `*.json`/`*.md`;
  `!clientV1/**/*.json` + `!clientV2/**/*.json` re-include their build configs while each
  snapshot's nested `.gitignore` (and git's parent-exclusion rule) keeps `node_modules/` out.

## Consequences

- **+** Recruiters compare eras with one click; the history is a live artifact, not a changelog.
- **+** One worker, one deploy, one asset tree — no infra sprawl.
- **+** Frozen snapshots can't be broken by style churn or dep floats; each rebuilds deterministically.
- **−** Deploy now has a build step (`build-all.sh`) instead of a single `client` build; the
  unified `dist/` is a build artifact (git-ignored), rebuilt on deploy.
- **−** SPA not-found handling falls back to the v3 root, so a hard refresh of a *deep*
  client-side route **inside** a frozen app resolves to v3. The era landing paths (`/v1/`,
  `/v2/`) and in-app navigation work; deep-link refresh into a frozen sub-route is the accepted edge.
