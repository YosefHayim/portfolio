# ADR 0001 — Adopt Effect at the I/O and validation edges

**Status:** Accepted · 2026-07-04

## Context

The codebase carries recurring, machine-recognizable slop at its boundaries: silent
`catch { return null }` that erases errors (`client/src/db/localDb.ts`,
`client/src/hooks/useChromeExtensionUsers.ts`), hand-rolled type guards that reimplement
validation (`server/src/core/requestValidation.ts` — `isRecord`, `asString`, `asEnum`),
duplicated fetch scaffolding (`useGitHubStats` ≈ `useGitHubProjects`), and string-interpolated
`winston` logs. These are symptoms of missing typed-error, schema, and service primitives —
not isolated bugs.

We evaluated: (a) keep hand-rolled + `zod` + `node:test`; (b) adopt Effect for typed errors,
Schema validation, services/Layers, and structured logging **at the edges only**.

## Decision

Adopt **Effect** (`effect`) as the backbone of the boundary layer:

- **Typed errors** through one unified wrapper — never swallow; log or surface.
- **Effect Schema** decodes every boundary, replacing the hand-rolled guards **and** `zod`.
- **Pure core, I/O behind services + Layers** — OpenAI / GitHub / email are Effect services;
  the core stays pure and testable via swap-in test Layers.
- **Structured, keyed logs** via Effect's logger, replacing `winston`.
- **Effect at the edges only** — loaders, services, validation. React components stay
  idiomatic (`useState`, JSX); a single `useEffectQuery(program)` is the one data hook.
- **Tests:** `vitest` + `@effect/vitest` (`it.effect` + test Layers), colocated, core-first.

Scope note: **clientV3** (the living app) adopts this; **clientV1 / clientV2** are frozen
snapshots and exempt.

## Consequences

- **+** Errors become typed and visible; validation, types, and messages come from one schema;
  duplicated hooks collapse to one; logs are greppable.
- **+** The core is unit-testable without touching real I/O.
- **−** A real library to learn; Effect's `gen`/pipe idiom is unfamiliar at first.
- **−** A migration tail — existing edges move over per-diff (via `deslop`) and during the
  Step 8 reorg, not all at once. `CODE-STYLE.md` records the target; the `Never` list tracks
  the offenders still to convert.
- Adds `effect` (client + server) and `vitest` + `@effect/vitest` (dev). See ADR 0003 for the
  deps this retires (`zod`, `winston`).
