# CONTEXT.md

Orientation for the portfolio repo — what it is, who acts on it, and how it is shaped. Read
this before non-trivial work. For **why** it exists see `PRODUCT.md`; for **names** see
`LANGUAGE.md`; for **how to write code** see `CODE-STYLE.md`; for **decisions** see
`docs/adr/`.

## What it is

A personal portfolio web app that works as a proof-of-work journey for recruiters — not a
static resume. One repository, four cooperating parts, deployed on Cloudflare via `wrangler`:

- **`clientV3/`** — React 19 + Vite 6 + Tailwind v4 single-page app (the portfolio UI, blog,
  and the Portfolio Assistant chat surface); served at `/`, with the `[v1][v2][v3]` toggle.
- **`server/`** — Express API for the AI chat and contact email; layered into
  `adapters / core / middleware / routes / config / utils`. Adopting **Effect** at its edges
  (see ADR 0001).
- **`worker/`** — one Cloudflare Worker that serves the unified `dist/` (v3 at `/`, v1+v2
  nested) and honors the Product Route Registry (product pages, extension legal redirects).
- **`shared/`** — precompiled JS modules shared by client, server, and worker (Product Route
  Registry, GitHub Portfolio Snapshot, contact-email + assistant-stream helpers).

## Actors

- **Recruiter / visitor** — the primary reader; skims the journey, asks the Portfolio
  Assistant, may trigger a contact email.
- **Owner** (Joseph Sabag) — publishes work and evolves the site.
- **Portfolio Assistant** — the AI surface answering questions from the GitHub Portfolio
  Snapshot and App Catalog.
- **Agents** — Claude Code and `deslop`, governed by `CODE-STYLE.md` + `AGENTS.md`.

## Shape

- The **client** is a lazy-routed SPA; data comes from the server API and the GitHub
  Portfolio Snapshot through a single `useEffectQuery` hook. Effect stays at the edges; React
  components stay idiomatic.
- The **server** keeps a pure Effect core with I/O (OpenAI, GitHub, email) behind Effect
  services + Layers; routes are thin edges that decode with Effect Schema, run the core, and
  map tagged errors to HTTP.
- The **worker** is the deploy front door — it serves the built client and resolves routes
  from the shared Product Route Registry so the static server and the Worker never drift.

## Version showcase — clientV1 / clientV2 / clientV3

The site preserves three eras for recruiters to compare (see `LANGUAGE.md`), all on **one site
served by one worker** — the eras are paths, not separate deployments:

- **clientV3** — the living app at `/`, the only one governed by `CODE-STYLE.md`.
- **clientV1 / clientV2** — frozen buildable snapshots at `/v1/` and `/v2/` (each built with a
  Vite `base`), **exempt** from the style rules; they stay authentic to their era rather than
  being restyled, and build with their own pinned deps (e.g. clientV2 pins `react-icons@5.6.0`).
- `scripts/build-all.sh` builds all three and assembles `dist/` (clientV3 at root, clientV1→
  `dist/v1/`, clientV2→`dist/v2/`); the Navbar + mobile sidebar carry the `[v1][v2][v3]` toggle.

## Where things live

- Client entry: `clientV3/src/App.tsx` (routes, Navbar, global chat sidebar, scroll progress).
- Portfolio page: `clientV3/src/Pages/OnePage/OnePagePortfolio.tsx`.
- Version toggle: `clientV3/src/Components/Navbar/` (Navbar, VersionSwitch, NavMobileDrawer).
- Server entry: `server/src/index.ts`; core in `server/src/core/`, I/O in `server/src/adapters/`.
- Worker + deploy: `worker/`, `wrangler.jsonc`.
- Shared modules: `shared/portfolio/`.
- The dev+ops CLI (dual-mode: menu in a TTY, flags otherwise) — see ADR 0002.
