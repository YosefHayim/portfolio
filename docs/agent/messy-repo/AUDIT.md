# Messy-repo AUDIT — portfolio

Updated: 2026-08-07
Product tip (PR base): `main` @ `d2656c4`
MATRIX: docs/agent/messy-repo/MATRIX.md
Mode: audit-wave
New feature PRs this run: **0**

## Scoreboard

| Order | PR | Feature | Head | Intent | Deslop | CODE-STYLE | Tests | Gates | Risk | Verdict | Notes |
|-------|-----|---------|------|--------|--------|------------|-------|-------|------|---------|-------|
| 1 | #32 | blog-surface | 1752d4d | match | better | ok | none | GG+cubic pass; unblocks tsc | low | **MERGE** | fixes tip TAG_* |
| 2 | #30 | ci-workflows | 7051966 | match | better | nits | none | honest e2e skip | med | **MERGE** | land after #32 |
| 3 | #33 | server-effect-errors | e4d92e6 | match | better | ok | 7 unit | GG pass | low | **MERGE** | plain Error model |
| 4 | #29 | server-tests | dbccd8c | match | same | violates | 56 on pre-#33 | GG pass | med | **FIX** | CoreHttpError asserts break post-#33 |
| 5 | #34 | worker-runtime | 0cdfcfd | match | better | ok | none | GG pass | low | **MERGE** | no server imports |
| 6 | #31 | dual-mode-cli | 899f340 | match | better | ok | smoke only | GG pass | med | **FIX** | pnpm-workspace.yaml + package.json vs #30 |
| 7 | #36 | apps-catalog | 176edf2 | match | better | ok | smoke | GG pass | low | **MERGE** | |
| 8 | #37 | portfolio-assistant | bde6355 | match | better | nits | none | GG pass | med | **FIX** | autoscroll deps `[]` regression |
| 9 | #38 | onepage-portfolio | 6e51015 | match | better | ok | none | GG pass | low | **MERGE** | 672→65 composition |
| 10 | #35 | clientV4-jts | f61f8a9 | match | better | nits | build green | GG pass | med | **FIX** | lightMarkdown link HTML; response names |

## Verdict counts

| MERGE | FIX | HOLD |
|-------|-----|------|
| 6 | 4 | 0 |

## HOLD (do not land)

_None — GitGuardian SUCCESS on all open MATRIX PRs._

## FIX (same branch only — no new PR)

| PR | Branch | Fix hint |
|----|--------|----------|
| #29 | `test/28-server-tests` | Rebase after #33; drop `CoreHttpError`; assert plain `Error` + `HTTP_ERROR_MESSAGE`; rename parsers; `body`→`errorJson`; re-run `cd server && pnpm test` |
| #31 | `feat/26-dual-mode-cli` | Rebase after #30; avoid workspace-root install side effects (prefer package.json `pnpm.onlyBuiltDependencies`); close readline before long `dev` |
| #37 | `refactor/21-portfolio-assistant` | Restore scroll `useEffect` deps to include `messages` (and open/typing as needed); aria-label on chat input |
| #35 | `refactor/25-clientV4-jts` | Sanitize `lightMarkdown` links (http/https + escape); rename `response`/`fullResponse`; one-component-per-file for StatCard/HeroTile if touched |

## Overlaps / land order

1. **#32** blog-surface (MERGE) — unblocks clientV3 typecheck
2. **#30** ci-workflows (MERGE)
3. **#33** server-effect-errors (MERGE)
4. **#29** server-tests (**FIX first**, then MERGE)
5. **#34** worker-runtime (MERGE)
6. **#31** dual-mode-cli (**FIX** / rebase package.json after #30)
7. **#36** apps-catalog (MERGE)
8. **#37** portfolio-assistant (**FIX** scroll)
9. **#38** onepage-portfolio (MERGE)
10. **#35** clientV4-jts (**FIX** markdown safety)

## Dry-land integration

| Item | Value |
|------|--------|
| Base | `main` @ `d2656c4` |
| Branch | `audit/dry-land-20260807-010217` (local only under `.worktrees/audit-dry-land-20260807-010217`) |
| Merged in order | #32, #30, #33, #29, #34, #31, #36, #37, #38, #35 |
| Conflicts | **none** (all 10 merges clean) |
| Unit | `cd server && pnpm test` → **fail** — 41 pass / 15 fail; failures are #29 `CoreHttpError` asserts after #33 production model (proves FIX on #29) |
| E2E | **skip** — no root `test:e2e`; e2e.yml intentionally not in CI Gate |
| Tip advanced? | **no** |

## Code slices (for planpage)

| Feature | Path | Why shown |
|---------|------|-----------|
| server errors | `server/src/middleware/errorHandler.ts` + `httpErrors.ts` | CODE-STYLE plain Error |
| blog | `clientV3/src/Pages/Blog/BlogPost.tsx` | tip tsc unblock |
| onepage | `clientV3/src/Pages/OnePage/OnePagePortfolio.tsx` | structure lean 672→65 |
| assistant | `AIChatSidebar.tsx` scroll effect | FIX proof |
| worker | `worker/src/workerRuntime.ts` | deslop structure |

## Residual mess (not this wave)

- Full Playwright e2e suite
- Frozen clientV1/v2 restyle (forbidden)
- Production deploy / R2
- Optional lean-prove after land
- pnpm install weirdness when root `pnpm-workspace.yaml` present (#31) — relevant to FIX #31
