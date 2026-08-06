# Messy-repo MATRIX — portfolio

Updated: 2026-08-07  
Mode: **setup-wave complete** (Host A — background subagents)  
Product tip (PR base): `main` @ `779128c`  
Repo: https://github.com/YosefHayim/portfolio  
**Land-wave partial complete** (6 MERGE landed; 4 FIX open). See `HEALTH.md` (post-land).

**Audit complete** — see `AUDIT.md` + `HEALTH.md`. Next: same-branch FIX for #29/#31/#37/#35, then **`/messy-repo land`**. Do **not** open new feature PRs.

## Backups

| Ref | SHA | Role |
|-----|-----|------|
| `backup/main-pre-messy-20260807` | `9a9e896` | Tip before gitignore chore + wave |
| `backup/origin-main-pre-messy-20260807` | `862db12` | origin/main before tip publish |
| product tip @ wave start | `779128c` | `chore: ignore .worktrees for messy-repo lanes` |

Never force-push `main`. Never delete backup remotes unless human lists them.

## Lanes (all open PRs)

| Feature | Issue | Branch | Worktree | Host | PR | Head SHA | Verify | Notes |
|---------|-------|--------|----------|------|-----|----------|--------|-------|
| server-effect-errors | #19 | `refactor/19-server-effect-errors` | `.worktrees/refactor-19-server-effect-errors` | A | [#33](https://github.com/YosefHayim/portfolio/pull/33) | `e4d92e6` | server test 7/7 pass; lint pass | plain Error + boundary map |
| worker-runtime | #20 | `refactor/20-worker-runtime` | `.worktrees/refactor-20-worker-runtime` | A | [#34](https://github.com/YosefHayim/portfolio/pull/34) | `0cdfcfd` | tsc worker pass; routing smoke | no server imports |
| portfolio-assistant | #21 | `refactor/21-portfolio-assistant` | `.worktrees/refactor-21-portfolio-assistant` | A | [#37](https://github.com/YosefHayim/portfolio/pull/37) | `bde6355` | biome scoped clean; full tsc blocked by BlogPost on tip | clientV3 chat only |
| onepage-portfolio | #22 | `refactor/22-onepage-portfolio` | `.worktrees/refactor-22-onepage-portfolio` | A | [#38](https://github.com/YosefHayim/portfolio/pull/38) | `6e51015` | biome scoped clean | extracted sections; projects trimmed |
| blog-surface | #23 | `refactor/23-blog-surface` | `.worktrees/refactor-23-blog-surface` | A | [#32](https://github.com/YosefHayim/portfolio/pull/32) | `1752d4d` | **clientV3 tsc pass** | fixes tip BlogPost TAG_* break |
| apps-catalog | #24 | `refactor/24-apps-catalog` | `.worktrees/refactor-24-apps-catalog` | A | [#36](https://github.com/YosefHayim/portfolio/pull/36) | `176edf2` | registry path smoke | collapsed catalogBuilder |
| clientV4-jts | #25 | `refactor/25-clientV4-jts` | `.worktrees/refactor-25-clientV4-jts` | A | [#35](https://github.com/YosefHayim/portfolio/pull/35) | `f61f8a9` | **clientV4 build green** | dock/github split |
| dual-mode-cli | #26 | `feat/26-dual-mode-cli` | `.worktrees/feat-26-dual-mode-cli` | A | [#31](https://github.com/YosefHayim/portfolio/pull/31) | `899f340` | help/unknown/non-TTY smoke | ADR 0002; package.json touch |
| ci-workflows | #27 | `fix/27-ci-workflows` | `.worktrees/fix-27-ci-workflows` | A | [#30](https://github.com/YosefHayim/portfolio/pull/30) | `7051966` | YAML parse; root `pnpm test` | honest e2e; package.json touch |
| server-tests | #28 | `test/28-server-tests` | `.worktrees/test-28-server-tests` | A | [#29](https://github.com/YosefHayim/portfolio/pull/29) | `dbccd8c` | **56 tests pass** | tests assume CoreHttpError — land **after** #33 and re-verify |

## Recommended land order (after audit)

1. **#32** blog-surface — unblocks clientV3 typecheck on tip  
2. **#30** ci-workflows — truthful monorepo gates  
3. **#33** server-effect-errors — production error model  
4. **#29** server-tests — re-audit after #33 (may need same-branch FIX if tests still import CoreHttpError)  
5. **#34** worker-runtime  
6. **#31** dual-mode-cli (rebase if package.json conflicts with #30)  
7. **#36** apps-catalog  
8. **#37** portfolio-assistant  
9. **#38** onepage-portfolio  
10. **#35** clientV4-jts  

## Overlaps

| Pair | Risk |
|------|------|
| #33 + #29 | server production vs tests; #29 written against pre-#33 API |
| #30 + #31 | root `package.json` / lockfile |
| #21–#24 | mostly disjoint clientV3 globs; blog lands first for tsc |

## Deferred mess

- Frozen clientV1 / clientV2 restyle (forbidden)  
- Full Playwright e2e suite  
- Production deploy / R2 campaigns  
- Optional lean-prove after land if tip still fat  

## Safety checklist (setup-wave)

- [x] Backup recorded + pushed  
- [x] Each lane: issue + branch + PR + LANE-BRIEF  
- [x] No product feature commits on main from lanes  
- [x] MATRIX written; handoff → **audit-wave**  
- [x] Zero merges this wave  

## Handoff

```text
repo: /Users/yosefhayimsabag/Desktop/Code/portfolio
mode: setup
product_tip: main @ 779128c
backup: backup/main-pre-messy-20260807 @ 9a9e896 ; backup/origin-main-pre-messy-20260807 @ 862db12
matrix: docs/agent/messy-repo/MATRIX.md
audit: none
health: none
verdicts: n/a (setup)
new_feature_prs_opened: 10
dry_land_unit: n/a
dry_land_e2e: n/a
merged: none
skills_reused: coordinate-worktrees, messy-repo-orchestrator
residual: tip BlogPost break fixed only on #32; full CI may still be red until land
```


## close-wave (2026-08-07)

### Reachability

| Lane | PR | Disposition | Proof |
|------|-----|-------------|-------|
| blog-surface | #32 | **closed local** | head `1752d4d` ancestor of `origin/main` |
| ci-workflows | #30 | **closed local** | head `7051966` on tip |
| server-effect-errors | #33 | **closed local** | head `e4d92e6` on tip |
| worker-runtime | #34 | **closed local** | head `0cdfcfd` on tip |
| apps-catalog | #36 | **closed local** | head `176edf2` on tip |
| onepage-portfolio | #38 | **closed local** | head `6e51015` on tip |
| server-tests | #29 | **retained** | PR CLOSED but not on tip; worktree kept |
| dual-mode-cli | #31 | **retained** | PR OPEN; worktree kept |
| portfolio-assistant | #37 | **retained** | PR OPEN; worktree kept |
| clientV4-jts | #35 | **retained** | PR OPEN; worktree kept |
| audit dry-land | — | **closed local** | never product tip |

### Local cleanup done

- Removed worktrees: landed 6 lanes + dry-land
- Deleted **local** branches for landed lanes only
- **No remote branch deletes** (feature + backup remotes intact)
- **No backup deletes**
- Retained worktrees: `feat-26-dual-mode-cli`, `refactor-21-portfolio-assistant`, `refactor-25-clientV4-jts`, `test-28-server-tests`

### Still open

- FIX PRs: #31, #37, #35 (and #29 closed-not-merged — re-open or new same-branch work if desired)
