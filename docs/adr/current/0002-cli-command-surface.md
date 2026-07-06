# ADR 0002 — Dual-mode portfolio CLI

**Status:** Accepted · 2026-07-04; amended by ADR 0005 · 2026-07-06

## Context

Dev and ops actions are spread across loose `package.json` scripts in `client/` and `server/`
plus ad-hoc shell scripts (`scripts/generateHero.sh`, `scripts/generateBlogCovers.sh`).
There is no single front door a human or an agent can drive, and no consistent contract for
interactive vs. non-interactive use.

## Decision

Provide one **dual-mode CLI** for the repo, following the "interactive front door" pattern:

- A **bare invocation in a TTY** opens an interactive menu.
- **Flags or a non-TTY** (piped / CI) run the requested verb directly and **never hang** —
  no prompt waits on absent input.
- **Both routes call the same functions** — the menu and the flag parser are two doors into
  one implementation.
- **Verbs:** `dev`, `build`, `deploy`, `lint`, `test`, `format`, `post new`,
  `assets generate`.
  - `dev` → client + server together
  - `build` → build clientV3
  - `deploy` → `wrangler deploy`
  - `lint` / `test` / `format` → the quality gate
  - `post new` → scaffold a blog post through the publishing workflow
  - `assets generate` → run local asset generation helpers
- Unknown verb → print help, exit non-zero.
- **Target source layout:** `scripts/cli/index.ts`, `commands.ts`, `menu.ts`,
  `runCommand.ts`, and per-verb files under `scripts/cli/commands/`.

## Consequences

- **+** One discoverable dev+ops surface for humans and agents; the same code path in both modes.
- **+** Retires one-off script entrypoints in favor of named verbs. Current kebab-case script
  wrappers are migration targets; once the CLI owns a path, rename to camelCase or replace
  with the CLI command instead of keeping compatibility aliases.
- **−** A small CLI harness to build and maintain.
- Adding a verb: register it as a function wired into **both** routes, add help text, keep the
  non-TTY path non-blocking. Recipe in `CODE-STYLE.md` → *How to add a CLI command*.
