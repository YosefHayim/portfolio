# Product health — portfolio

status: post-land (close-wave local cleanup done)
updated: 2026-08-07

## Tips

| Ref | SHA | Role |
|-----|-----|------|
| product tip | `c499f38` | main after land-wave MERGE set |
| origin/main | `c499f38` | same |
| backup/main-pre-messy-20260807 | `9a9e896` | restore pre-wave tip |
| backup/origin-main-pre-messy-20260807 | `862db12` | pre-publish origin |

## Land-wave result

| Class | PRs |
|-------|-----|
| **Merged** | #32 blog, #30 CI, #33 server-errors, #34 worker, #36 apps, #38 onepage |
| **Left open (FIX)** | #29 server-tests, #31 dual-mode-cli, #37 portfolio-assistant, #35 clientV4-jts |
| **HOLD** | none |

Merges via `gh pr merge --merge --admin` (branch protection required up-to-date base / CI Gate). No remote branch deletes. No FIX auto-merged.

## Features

| id | paths | tests | risk | wave disposition |
|----|-------|-------|------|------------------|
| blog-surface | clientV3 Blog | — | low | **landed** #32 |
| ci-workflows | .github + root scripts | root→server | med | **landed** #30 |
| server-effect-errors | server/src | 7 unit | low | **landed** #33 |
| server-tests | server tests | 56 pending fix | med | **open FIX** #29 |
| worker-runtime | worker/src | — | low | **landed** #34 |
| dual-mode-cli | scripts/cli | smoke | med | **open FIX** #31 |
| apps-catalog | clientV3 data/apps | — | low | **landed** #36 |
| portfolio-assistant | clientV3 chat | — | med | **open FIX** #37 |
| onepage-portfolio | OnePage+profile+projects | — | low | **landed** #38 |
| clientV4-jts | clientV4/src | build | med | **open FIX** #35 |

## Structure tree (top levels)

```text
clientV3/   living SPA @ /  (blog + OnePage + apps catalog landed)
clientV4/   JTS @ /v4/      (still open FIX #35)
server/     plain Error model landed (#33); expanded tests still open (#29)
worker/     lean runtime landed (#34)
scripts/cli dual-mode CLI still open (#31)
shared/     precompiled modules
```

## Post-land prove (tip `c499f38`)

| Layer | Command | Result |
|-------|---------|--------|
| unit | `pnpm test` → server vitest | **pass** 7/7 (`architecture.test.ts`) |
| e2e | — | **skip** — no root `test:e2e` |
| clientV3 tsc | `pnpm exec tsc -b` | see land notes |

## Branches

| Class | Count | Names |
|-------|-------|-------|
| merged this land | 6 | #32 #30 #33 #34 #36 #38 |
| FIX still open | 4 | #29 #31 #37 #35 |
| backups | 2 | backup/main-pre-messy-20260807, backup/origin-main-pre-messy-20260807 |

## Worktrees

| Path | Keep? | Reason |
|------|-------|--------|
| `.worktrees/*` lane trees | until close-wave | human may still fix FIX PRs there |
| dry-land worktree | optional remove local only | never product tip |

## Residual

1. **#29** — rewrite tests for plain Error / post-#33 API (same branch), then re-audit → land  
2. **#31** — rebase CLI onto main; package.json / pnpm install hygiene  
3. **#37** — restore chat autoscroll deps  
4. **#35** — sanitize lightMarkdown links + naming  
5. Full Playwright e2e still deferred  
6. Optional lean-prove if tip still feels fat  

## Next

- Same-branch FIX commits on open PRs, then `/messy-repo land` again (or land those four after re-audit)  
- `/messy-repo close` for local worktree cleanup after FIX land

## close-wave

- Local worktrees for **landed** lanes removed after reachability proof.
- FIX / unmerged work retained under `.worktrees/` (see MATRIX).
- Remote branches and backups **not** deleted.
- Worktrees kept: `feat-26-dual-mode-cli` (#31), `refactor-21-portfolio-assistant` (#37), `refactor-25-clientV4-jts` (#35), `test-28-server-tests` (#29 closed-not-merged).

