# Portfolio Agent Guide

## Agent Skills

### Issue Tracker

Issues are tracked in GitHub Issues for `YosefHayim/portfolio` using the `gh` CLI. See
`docs/agents/issue-tracker.md`.

### Triage Labels

Use the default five-label triage vocabulary. See `docs/agents/triage-labels.md`.

### Domain Docs

This is a single-context repo with one root `CONTEXT.md` (orientation), `LANGUAGE.md`
(glossary), and `PROJECT.md` (purpose); ADRs live under `docs/adr/current/`. See
`docs/agents/domain.md`.

## Conventions

<!-- rules digest - full guide in CODE-STYLE.md; edit there -->

Load-bearing rules only. `CODE-STYLE.md` is the source with examples, recipes, and current
offenders.

- **Effect program model.** Use Effect fully for I/O, validation, config, provider access,
  retries/timeouts, typed errors, structured logs, and tests. React local UI state stays
  idiomatic. Effect Schema replaces zod and hand-rolled guards. (ADR 0001, ADR 0005)
- **Client state.** Effect owns data programs; TanStack Query owns server-state cache,
  loading, error, and refetch. Multi-field forms use React Hook Form with Effect Schema
  validation. One-field chat inputs may stay controlled React.
- **Components & props.** One component per file. One simple prop may be inline; multiple or
  meaningful props use `interface XProps` with defaults in destructuring. Domain/DTO/helper
  shapes use `type`; Effect service contracts may use `interface`.
- **Functions & flow.** Use named arrow functions, not function declarations. Early-return
  guards; no nested ternaries; `switch` for multi-way branching. Parsing/regex/split/index
  logic needs named helpers plus raw example comments.
- **Modules.** Inline named exports only; no bottom export blocks, redundant double exports,
  one-use aliases, or backward-compatibility aliases. Use `import type`. Use `@shared/*`
  instead of deep cross-root relatives. Worker code must not import `server/src/*`.
- **File names.** Source/script filenames are `camelCase`; React component files are
  `PascalCase`. No kebab-case for new or migrated source files; rename offenders with their
  imports/commands and do not add compatibility wrappers.
- **Barrels.** Leaf folders get wildcard barrels: `index.tsx` for component folders and
  `index.ts` for non-JSX folders. Never import a folder's own barrel from inside that folder.
- **UI.** Use Tailwind/theme tokens and semantic classes; no scattered `[#hex]`. Promote any
  repeated class/color pattern used more than 3-4 times. Icon-only buttons need
  `aria-label`; recruiter-facing copy is localized and RTL-safe. Use React 19 native metadata.
- **Docs & tests.** Exported reusable APIs get TSDoc with `@param`, `@returns`, and
  `@example` when behavior is non-obvious. Tests are colocated Vitest + `@effect/vitest`,
  core/boundary first. Formatter: single quotes, semicolons, width 100, 2-space,
  trailing-all (Biome).
- **Never:** silent catches, hand-rolled guards, assertion shortcuts, `?? ''` as erased
  missing data, nested ternaries, parsing chains without examples, default exports, bottom
  export blocks, deep shared relatives, Worker imports from server, interpolated logs,
  duplicated fetch state, kebab-case source filenames, or `PRODUCT.md` alongside
  `PROJECT.md`.
- **CLI:** one dual-mode front door. Bare TTY opens a menu; flags/non-TTY run direct and
  never hang. Verbs: `dev`, `build`, `deploy`, `lint`, `test`, `format`, `post new`,
  `assets generate`. Both modes call the same command functions. (ADR 0002)

## Repo Layout

```txt
clientV3/ React 19 + Vite 6 + Tailwind v4 SPA - living app at /
clientV4/ JTS studio landing - Joseph Tech Solutions era at /v4/
clientV1/ First-era portfolio - frozen buildable snapshot at /v1/
clientV2/ Second-era portfolio - frozen buildable snapshot at /v2/
server/   Express AI chat + contact-email API - adapters / core / middleware / routes / config / utils
worker/   ONE Cloudflare Worker - serves unified dist/ + Product Route Registry static pages
shared/   Runtime-neutral modules shared by clientV3 / server / worker
scripts/  Current build wrapper plus target dual-mode CLI under scripts/cli/
docs/adr/ decisions - 0001 Effect · 0002 CLI · 0003 deps · 0004 versions · 0005 runtime target
```

Eras are one site: v1/v2/v3/v4 are paths served by the single Worker's assets binding,
not separate workers. Deploy = `bash scripts/buildAll.sh && wrangler deploy`. Only
`clientV3` (and new work in `clientV4`) follow `CODE-STYLE.md`; `clientV1`/`clientV2` are frozen
snapshots that build with their own pinned deps and are Biome-exempt.
