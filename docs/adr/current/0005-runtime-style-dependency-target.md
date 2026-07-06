# ADR 0005 — Runtime style and dependency target

**Status:** Accepted · 2026-07-06

## Context

The code-style grill surfaced three kinds of drift:

- The docs still described `PRODUCT.md`, but the repo is a personal portfolio and publishing
  system for thoughts, work, projects, ideas, and proof-of-work.
- The existing style guide still allowed older patterns: function declarations for pure
  helpers, `type XProps`, bottom export blocks, default exports, manual fetch state, and
  compatibility aliases.
- ADR 0001/0002/0003 were directionally right but too narrow for the now-approved target:
  Effect should be used fully for effectful code, the client should use TanStack Query for
  server-state, and multi-field forms should use React Hook Form.

## Decision

- Replace `PRODUCT.md` with `PROJECT.md`. `PROJECT.md` is the purpose source of truth.
- Use Effect as the program model for effectful code: validation, I/O, config, provider
  access, logging, retries/timeouts, typed errors, and tests.
- Keep React local UI state idiomatic. Do not move button state, local toggles, or JSX flow
  into Effect.
- Use TanStack Query as the one client server-state cache/loading/refetch layer around Effect
  loaders.
- Use React Hook Form for multi-field forms. Keep validation in Effect Schema via a small
  resolver/helper.
- Use `interface XProps` for multi-prop component contracts; one simple prop may stay inline.
  Use `type` for domain data and DTOs. Effect service contracts may use `interface`.
- Use named arrow functions. Do not write function declarations, except for required
  `function*` generator callbacks inside `Effect.gen`.
- Use inline named exports only. No bottom export blocks, no redundant default+named exports,
  no one-use aliases, and no backward-compatibility aliases.
- Use `camelCase` filenames for source/scripts and `PascalCase` filenames for React
  component files. Existing kebab-case source/script files are migration targets and should
  be renamed with their imports/commands, without compatibility wrappers.
- Add leaf wildcard barrels: `index.tsx` for component folders and `index.ts` for non-JSX
  folders. Never import a folder's own barrel from inside that folder.
- Require raw example comments above regex/split/index parsing and hard-to-follow transform
  steps.
- Centralize repeated UI class/color patterns in Tailwind theme config or named components
  once they repeat more than 3-4 times.
- Expand the dual-mode CLI target verbs to `dev`, `build`, `deploy`, `lint`, `test`,
  `format`, `post new`, and `assets generate`.

## Dependency Target

Add with the migration:

- `effect`
- `vitest`
- `@effect/vitest`
- `@tanstack/react-query`
- `react-hook-form`

Remove with the code changes that retire them:

- `zod`
- `winston`
- `react-helmet-async`
- `react-router-dom`

Verify, then remove if unused:

- `motion`
- client `express`
- client `serve`
- unused PostCSS stack when Tailwind v4 Vite plugin is the only pipeline

## Consequences

- The style guide now describes a target ahead of the current code. Migration work should be
  done per slice, not by broad churn.
- Existing imports and components may temporarily warn under the stricter rules. Treat those
  as migration targets, not as permission to add compatibility fallbacks.
- ADR 0001, ADR 0002, and ADR 0003 remain historical decisions but are amended by this ADR
  where their older wording was narrower.
