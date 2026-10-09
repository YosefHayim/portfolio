# Joseph Sabag

A one-page bilingual (English and Hebrew) business site, live at
https://joseph-tech-solutions.dev/. React 19, TypeScript, Vite and plain CSS, served by a
Cloudflare Worker with static assets. Everything lives in `client/`.

## Local development

Use Node 24 and pnpm 10.33.2.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
cp client/.env.example client/.env
pnpm dev
```

No secrets or remote services are needed. The flag button switches language. The first visit
follows the browser language; a manual choice is remembered.

## Checks

```sh
pnpm --dir client exec playwright install chromium webkit
pnpm check
```

This runs Biome, TypeScript, Vitest, the production build, Playwright in Chromium and WebKit,
and a mobile Lighthouse gate. The browser tests cover both languages at 320 to 1440px,
overflow and clipped text, accessibility, keyboard use, reduced motion, the problem and iceberg
animations, WhatsApp links, cache headers and 404s.

On macOS, WebKit moves focus with Option+Tab when full keyboard access is off, so the suite
uses it there ([Playwright issue](https://github.com/microsoft/playwright/issues/41808)).

## Preview

```sh
pnpm build
pnpm --dir client preview
```

Preview runs the real Worker locally at http://127.0.0.1:4173, including cache headers and 404s.
It uses localhost as its upstream, so the production domain redirects cannot loop locally.

## Release

Deploying needs explicit approval after a mobile screenshot review; CI never deploys. The steps
are in `AGENTS.md`. After changing `client/wrangler.jsonc`, regenerate the binding types:

```sh
pnpm --dir client types
```

## References

- [React effect cleanup](https://react.dev/learn/synchronizing-with-effects)
- [Vite static build](https://vite.dev/guide/static-deploy.html)
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Worker-first routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/)
- [Lighthouse CI](https://googlechrome.github.io/lighthouse-ci/docs/configuration.html)

Earlier versions of the site remain in Git history.
