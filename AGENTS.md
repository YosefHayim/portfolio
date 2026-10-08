# Business Portfolio Agent Guide

This repository contains one bilingual business website in `client/`.
Read `PROJECT.md`, `CONTEXT.md`, `LANGUAGE.md`, and `CODE-STYLE.md` before changing it.

- Use pnpm. Run `pnpm check` for lint, typecheck, unit tests, a production build,
  and Chromium/WebKit browser checks against the local Worker.
- Use named arrow functions, flat guards, specific names, and one component per file.
  No barrels, index.ts/tsx, nested calls, nullish coalescing, or TSDoc.
- React owns local UI state. Effect owns storage and Worker asset I/O and errors.
  This site has no business API, server-state cache, or forms.
- Keep all visible copy and accessible labels in English and Hebrew. Support RTL,
  keyboard access, reduced motion, and narrow mobile screens.
- Use Tailwind theme tokens and semantic CSS classes. Keep animations optional and
  clean up timers, observers, and listeners.
- Application and deployment code belongs inside `client/`. No root docs folder.
- Do not restore retired clients, chat, blog, product routes, or legal pages.
  Unknown and retired paths must return HTTP 404.
- Feature branches and PRs only; never push to main. No AI attribution or emojis.
- Before release, show verified mobile screenshots and get explicit user approval
  for merging, deploying, or changing production DNS. CI never deploys automatically.
- If GitHub Actions is blocked by billing, run the workflow with act in Docker and
  remove only resources created by that run. Never globally prune Docker.
- Preserve unrelated local work. Put temporary review artifacts in the session scratchpad.
  Stop servers started for verification when finished.

## Local CI

Run `act workflow_dispatch -W .github/workflows/ci.yml` before opening a PR.
The root `.actrc` selects the local Docker runner and keeps the pnpm store outside the workspace.
