# Agent guide

A one-page bilingual (English and Hebrew) business site for Joseph Sabag, served at
https://joseph-tech-solutions.dev/ by one Cloudflare Worker named `portfolio`. The look and
motion follow the design file `03-sheets-v6.html` one to one; only the words were rewritten.
Every call button opens WhatsApp at +972546187549 with a localized draft message. There are no
forms, accounts, business API, database or secrets.

## Structure

Code is split by where it runs, then by feature. Imports go one way.

```txt
client/
  src/                  runs in the browser (React 19 + Vite)
    main.tsx  App.tsx  globalStyles.css  pageTitle.text.ts
    assets/             images Vite hashes
    components/         UI used by 2+ features
    hooks/              hooks used by 2+ features
    features/<feature>/ everything one feature needs
  worker/               runs on Cloudflare: redirects, security and cache headers, 404s
  e2e/                  runs in Node: Playwright against the production build
  public/               copied as is: 404 page, favicon, robots, sitemap
```

- `src/**` never imports `worker/**` and the reverse (Biome `noRestrictedImports`).
  One tsconfig per runtime (`tsconfig.app.json`, `tsconfig.worker.json`, `tsconfig.node.json`).
- No `shared/`, `utils/`, `docs/`, barrels, re-exports or index files.

Where a new file goes:

1. Where does it run? Browser `src/`, Cloudflare `worker/`, browser test `e2e/`.
2. Which feature? `src/features/<feature>/`.
3. Used by 2+ features? A component goes in `src/components/`, a hook in `src/hooks/`.
4. Unsure? The feature folder.

Name patterns: `<Name>Section.tsx` (a full-screen section), `<Name>Canvas.tsx` (a canvas
animation), `<Problem>Animation.tsx`, `<Name>.tsx` (other components), `use<Name>.ts`,
`<name>.ts` (no React), `<feature>.text.ts` (English and Hebrew words), `<feature>.css`,
`<file>.test.ts` (colocated Vitest), `e2e/<topic>.spec.ts`. A name says what the thing is.
No design-file jargon such as sheet, hero, pains, scene, stage, band, toast or copy, in file
names or CSS classes.

## Code

- Readable and simple. Extend existing code before adding an abstraction.
- Named arrow functions, `const`, flat guard clauses with early returns. One idea combines
  with `&&`; different outcomes get separate guards. No nested ifs, nested ternaries, nested
  calls, `??`, or type assertions that hide errors.
- Specific names, never `data`, `result`, `row` or `record`.
- One component per file. PascalCase component files, camelCase other source files.
- Inline named exports, direct imports, `import type`. Default exports only where a tool
  requires one (configs, the Worker entry).
- `interface XProps` for props, `type` for domain shapes.
- React owns UI state. Effect owns browser storage, the clipboard and Worker asset I/O, with
  failures logged. Decode outside values with Effect Schema.
- Effects return cleanup. Loops stop offscreen, while covered by the next section, and under
  reduced motion. No animation may block reading or selecting text.
- Plain CSS per feature. Colors are custom properties in the `:root` of `globalStyles.css`.
  No Tailwind, no `!important`.
- Every interactive element has an accessible name, visible focus and a usable touch area.
- No narrating comments or TSDoc. Biome formats: single quotes, semicolons, 100 columns,
  2 spaces, trailing commas.

## Words and languages

- English (`ltr`) and Hebrew (`rtl`) are equal. The first visit uses Hebrew when the browser's
  main language is Hebrew. A manual choice is saved in `localStorage` and wins later.
- Every visible word and accessible label lives in a `<feature>.text.ts` in both languages.
- Voice: spoken, specific, first person. Hebrew talks to the visitor in plural. No em dashes,
  no revenue promises, no claims beyond the facts already in the text. Do not mention
  military service.
- Use CSS logical properties. Mirror directional animations under `html[dir="rtl"]`.

## Caching and routes

- `worker/cacheHeaders.ts` sets them (Cloudflare ignores `_headers` when the Worker runs
  first): hashed `/assets/*` are immutable for a year; everything else is
  `max-age=0, must-revalidate` with an ETag, so a reload gets a cheap 304.
- Former domains and `www` redirect with 308 to the canonical apex, keeping path and query.
- Unknown and retired paths return 404, never the home page. Do not bring back the old
  versioned sites, chat, blog, product or legal pages.

## Checks

`pnpm check` runs Biome, `tsc -b`, Vitest, the build, Playwright (Chromium and WebKit, both
languages, 320 to 1440px, on the local Worker at 127.0.0.1:4173) and a mobile Lighthouse gate
(performance 0.9+, LCP 2.5s or less, CLS 0.1 or less, TBT 200ms or less). Port 4173 must be
free.

## Release

- Feature branch and PR, squash merge. Never push to main. No AI attribution or emojis.
- Before merging, deploying or changing DNS: show verified mobile screenshots and get explicit
  approval. CI never deploys.
- Steps: record the current Worker version for rollback. Squash merge. On the approved main
  commit run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm --dir client run deploy`.
  Then check on the real domains: the canonical apex serves the site, every other host returns
  308 with path and query kept, a retired path ends in 404, both languages and the WhatsApp
  links work. Save the commit and Worker version in the PR. If the live check fails, roll back
  to the recorded version.
- Open since 2026-10-06: the four `yosefhayimsabag.com` and `yosefhayimsabag.dev` hosts have no
  public DNS. Restore them as proxied records and verify TLS before relying on them. Never
  touch mail records.
- If GitHub Actions is blocked by billing, run the workflow with act in Docker and remove only
  what that run created. Never prune Docker globally.

## Working here

Preserve unrelated local work. Temporary files go in the session scratchpad, not the repo.
Stop servers you start.
