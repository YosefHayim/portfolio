# Portfolio Agent Guide

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for `YosefHayim/portfolio` using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default five-label triage vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repo with one root `CONTEXT.md` (orientation), `LANGUAGE.md` (glossary), and `PRODUCT.md` (purpose); ADRs live under `docs/adr/current/`. See `docs/agents/domain.md`.

## Conventions

<!-- rules digest — full guide in CODE-STYLE.md; edit there -->

Load-bearing rules only; `CODE-STYLE.md` is the source with ✓/✗ examples and offenders.

- **Effect at the edges.** Typed errors (never swallow), Effect Schema at every boundary (replaces zod + hand-rolled guards), pure core with I/O behind services + Layers, structured keyed logs. React stays idiomatic — one `useEffectQuery(program)` is the only data hook. (ADR 0001)
- **Components & types.** One component per file; a named `type XProps` above each; `type` over `interface`; early-return guards; **no nested ternaries** (lint); `switch` over object-dispatch tricks.
- **Modules.** Named exports (`export default` only for lazy pages); **`import type`** (lint); `@shared/*` alias, never deep-relative; leaf-folder barrels (never import a folder's own barrel).
- **UI.** Brand color tokens (`text-brand`, `bg-brand-soft`), never inline `[#hex]`; canonical file order `imports → consts → XProps → component`.
- **Tests & format.** Colocated, core-first `*.test.ts` with `vitest` + `@effect/vitest`. Formatter: single quotes, semicolons, width 100, 2-space, trailing-all (Biome).
- **Never:** silent `catch`, nested ternary, hand-rolled guards, twin fetch hooks, one-use re-export aliases, redundant double export, inline hex, interpolated logs. See `CODE-STYLE.md → Never`.
- **CLI:** one dual-mode front door — menu in a TTY, flags/non-TTY run direct and never hang, both call the same functions. (ADR 0002)

## Repo layout

```
clientV3/ React 19 + Vite 6 + Tailwind v4 SPA — the living app, served at / ; its Navbar [v1][v2][v3] toggle links the eras
clientV1/ First-era portfolio — frozen buildable snapshot, served at /v1/ (Vite base '/v1/'); exempt from CODE-STYLE.md
clientV2/ Second-era portfolio — frozen buildable snapshot, served at /v2/ (Vite base '/v2/'); exempt from CODE-STYLE.md
server/   Express AI chat + contact-email API — adapters / core / middleware / routes / config / utils; Effect at the edges
worker/   ONE Cloudflare Worker (one wrangler.jsonc) — serves the unified dist/ + Product Route Registry static pages
shared/   precompiled JS modules shared by clientV3 / server / worker (portfolio/*)
scripts/  build-all.sh — builds all three eras and assembles dist/ (v3 at /, clientV1→dist/v1/, clientV2→dist/v2/)
docs/adr/ decisions — 0001 adopt-Effect · 0002 CLI surface · 0003 dependency-cleanup · 0004 version-showcase reorg
```

The three eras are one site: v1/v2/v3 are **paths** served by the single worker's assets binding, not separate workers.
Deploy = `bash scripts/build-all.sh && wrangler deploy`. Only `clientV3` follows `CODE-STYLE.md`; `clientV1`/`clientV2`
are frozen snapshots that build with their own pinned deps (e.g. clientV2 pins `react-icons@5.6.0`) and are Biome-exempt.
