# Domain Docs

This is a single-context repo.

## Before Exploring

Read `CONTEXT.md` at the repo root before using engineering skills that depend on domain
language, especially `improve-codebase-architecture`, `diagnose`, `tdd`, `to-issues`,
`to-prd`, and `zoom-out`. Read `PROJECT.md` when the work touches purpose, audience, product
positioning, publishing workflows, or portfolio content.

If `docs/adr/` exists, read ADRs that touch the area being changed. If the directory does not exist, proceed silently.

## Current Layout

```text
/
├── CONTEXT.md
├── PROJECT.md
├── LANGUAGE.md
├── CODE-STYLE.md
├── docs/
│   └── agents/
├── clientV3/   living app, served at /
├── clientV1/   frozen snapshot, served at /v1/
├── clientV2/   frozen snapshot, served at /v2/
├── server/
├── worker/
├── shared/
└── scripts/    buildAll.sh → assembles dist/
```

## Vocabulary

Use the domain terms from `CONTEXT.md` and `LANGUAGE.md` when naming issues, PRDs, refactor
proposals, hypotheses, and tests.

If a needed concept is missing from `CONTEXT.md`, treat that as a signal for `grill-with-docs` or a focused docs update rather than inventing parallel vocabulary.

## ADR Conflicts

If future work contradicts an ADR, call it out explicitly and explain why reopening the decision may be worth it.
