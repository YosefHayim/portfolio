# Repository context

One pnpm workspace with a single `client/` package.

- `client/src/`: React/TypeScript components, authored bilingual copy, state, CSS, unit tests.
- `client/public/`: optimized portraits, favicon, robots, sitemap, and bilingual 404 page.
- `client/deploy/`: Worker entry, generated binding types, and redirect tests.
- `client/e2e/`: Chromium and WebKit tests of the production build through Wrangler.
- `client/wrangler.jsonc`: static assets, Worker configuration, and observability.
- `.github/workflows/ci.yml`: install, lint, typecheck, unit tests, build, browser checks.

`pnpm dev` starts Vite. `pnpm build` produces `client/dist/`.
`pnpm --dir client preview` serves the built site through the local Cloudflare runtime.
Root scripts delegate to the client package. No database, remote media, secrets, or business API.

The Worker redirects known former domains and JTS www to the canonical HTTPS apex,
preserving paths and queries. Static assets use 404-page handling rather than an SPA fallback.
All hosts go through the Worker so assets on old hosts redirect too.

Root environment examples document that no application secrets are needed. Wrangler uses
its existing local login for deployment; never add credentials to source control.
