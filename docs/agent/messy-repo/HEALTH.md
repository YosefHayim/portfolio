# Product health — portfolio

status: audit-draft
updated: 2026-08-07

## Tips

| Ref | SHA | Role |
|-----|-----|------|
| product tip | `d2656c4` | PR base / main |
| origin/main | `d2656c4` | same |
| backup/main-pre-messy-20260807 | `9a9e896` | restore pre-wave tip |
| backup/origin-main-pre-messy-20260807 | `862db12` | pre-publish origin |

## Features

| id | paths | tests | risk | wave disposition |
|----|-------|-------|------|------------------|
| blog-surface | clientV3 Blog | none | low | MERGE #32 |
| ci-workflows | .github + root scripts | root→server | med | MERGE #30 |
| server-effect-errors | server/src | 7 unit | low | MERGE #33 |
| server-tests | server/src/**/*.test.ts | 56 (pre-#33) | med | FIX #29 |
| worker-runtime | worker/src | none | low | MERGE #34 |
| dual-mode-cli | scripts/cli | smoke | med | FIX #31 |
| apps-catalog | clientV3 data/apps | smoke | low | MERGE #36 |
| portfolio-assistant | clientV3 chat | none | med | FIX #37 |
| onepage-portfolio | OnePage+profile+projects | none | low | MERGE #38 |
| clientV4-jts | clientV4/src | build | med | FIX #35 |

## Structure tree (top levels)

```text
clientV3/   living recruiter SPA @ /
clientV4/   JTS studio @ /v4/
clientV1/   frozen @ /v1/
clientV2/   frozen @ /v2/
server/     Express AI + email (Effect core)
worker/     Cloudflare Worker + Product Route Registry
shared/     precompiled portfolio modules
scripts/    buildAll + dual-mode CLI (PR #31)
docs/agent/messy-repo/  campaign SSOT
```

## How code is written (slices)

### 1. server errors — plain Error at core, status at boundary

See PR #33 `httpErrors.ts` + `errorHandler.ts`. Matches CODE-STYLE: no class Error with status on domain path.

### 2. OnePage composition (PR #38)

`OnePagePortfolio.tsx` ~65 LOC composition vs ~672 god-file; sections extracted one-per-file.

### 3. Blog tags (PR #32)

Tip had undefined TAG_LINKS/TAG_ICONS; PR uses plain `#tag` chips (unblocks tsc).

## Tests

| Layer | Count / command | Result |
|-------|-----------------|--------|
| unit (server alone #28) | 56 | pass on pre-#33 API |
| unit (dry-land combined) | 41 pass / 15 fail | fail — CoreHttpError coupling |
| e2e | none | skip |
| stale deleted this wave | n/a (not landed) | — |

## Branches

| Class | Count | Names (sample) |
|-------|-------|----------------|
| product lanes open | 10 | refactor/*, feat/26-*, fix/27-*, test/28-* |
| merged this land | 0 | — |
| backups | 2+ | backup/main-pre-messy-20260807 |
| audit dry-land | 1 local | audit/dry-land-20260807-010217 |

## Worktrees

| Path | Keep? | Reason |
|------|-------|--------|
| `.worktrees/refactor-*` etc. | until close-wave | lane workspaces |
| `.worktrees/audit-dry-land-*` | until close or re-audit | local only; not product tip |

## Residual

- 4 FIX PRs before full land confidence
- dry-land unit red until #29 fixed
- no e2e suite yet
