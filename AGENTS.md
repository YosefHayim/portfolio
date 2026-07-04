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
client/   React 19 + Vite 6 + Tailwind v4 SPA — the living app (→ clientV3; clientV1/V2 = frozen snapshots)
server/   Express AI chat + contact-email API — adapters / core / middleware / routes / config / utils; Effect at the edges
worker/   Cloudflare Worker — serves client/dist + Product Route Registry routes (/v1 /v2 /v3)
shared/   precompiled JS modules shared by client / server / worker (portfolio/*)
docs/adr/ decisions — 0001 adopt-Effect · 0002 CLI surface · 0003 dependency-cleanup
```

The `client/ → clientV3/` split (frozen `clientV1`/`clientV2` + the `v1/v2/v3` navbar toggle) is the pending Step 8 reorg.
