# ADR 0003 — Dependency cleanup

**Status:** Accepted · 2026-07-04

## Context

`client/package.json` and `server/package.json` carry duplicate and superseded dependencies.
Some are twin packages of the same library; some are replaced by decisions in ADR 0001
(Effect) or by React 19 platform features.

## Decision

**Add**

- `effect` — client + server (ADR 0001).
- `vitest` + `@effect/vitest` — dev; the test runner and Effect test support.

**Remove**

| Dep | Why |
|---|---|
| `motion` | Twin of `framer-motion`; keep one animation library. |
| `react-router-dom` | Redundant with `react-router` v7 (the code imports from `react-router`). |
| `zod` | Superseded by Effect Schema (ADR 0001). |
| `winston` | Superseded by Effect structured logging (ADR 0001). |
| `react-helmet-async` | Superseded by React 19 native `<title>`/`<meta>` hoisting. |

**Verify, then remove**

- Client `express` + `serve` — the Worker serves `client/dist`; confirm nothing dev-time
  depends on them before dropping.
- `@tailwindcss/postcss` + `autoprefixer` + `postcss` — Tailwind v4 uses the Vite plugin
  (`@tailwindcss/vite`); confirm no PostCSS pipeline remains, then drop.

## Consequences

- **+** Smaller, unambiguous dependency graph; no twin libraries; dead deps gone.
- **−** Removals must land **with** the code change that stops importing them — e.g. drop
  `react-helmet-async` only once components use native metadata, drop `zod`/`winston` only as
  Effect replaces them. Sequence these per-diff, not in one sweep.
- The "verify, then remove" set stays until confirmed unused — asserted as cleanup, not yet as
  fact.
