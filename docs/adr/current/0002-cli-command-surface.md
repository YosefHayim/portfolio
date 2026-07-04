# ADR 0002 — Dual-mode portfolio CLI

**Status:** Accepted · 2026-07-04

## Context

Dev and ops actions are spread across loose `package.json` scripts in `client/` and `server/`
plus ad-hoc shell scripts (`scripts/generate-hero.sh`, `scripts/generate-blog-covers.sh`).
There is no single front door a human or an agent can drive, and no consistent contract for
interactive vs. non-interactive use.

## Decision

Provide one **dual-mode CLI** for the repo, following the "interactive front door" pattern:

- A **bare invocation in a TTY** opens an interactive menu.
- **Flags or a non-TTY** (piped / CI) run the requested verb directly and **never hang** —
  no prompt waits on absent input.
- **Both routes call the same functions** — the menu and the flag parser are two doors into
  one implementation.
- **Verbs:** `dev`, `build`, `deploy`, `lint`, `test`, `format`.
  - `dev` → client + server together
  - `build` → build clientV3
  - `deploy` → `wrangler deploy`
  - `lint` / `test` / `format` → the quality gate
- Unknown verb → print help, exit non-zero.

## Consequences

- **+** One discoverable dev+ops surface for humans and agents; the same code path in both modes.
- **+** Retires the one-off `scripts/*.sh` in favor of named verbs.
- **−** A small CLI harness to build and maintain.
- Adding a verb: register it as a function wired into **both** routes, add help text, keep the
  non-TTY path non-blocking. Recipe in `CODE-STYLE.md` → *How to add a CLI command*.
