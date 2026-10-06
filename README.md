# Joseph Tech Solutions

A bilingual business website for Joseph Sabag. React, TypeScript, Vite, Tailwind, and
Cloudflare Workers Static Assets, with one application folder: `client/`.

## Local development

Use Node 24 and pnpm 10.33.2.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
cp client/.env.example client/.env
pnpm dev
```

No application secrets or remote services are required. Choose EN or עב to switch languages.
Browser language is used on the first visit; manual choices are remembered locally.

## Checks

```sh
pnpm --dir client exec playwright install chromium webkit
pnpm check
```

This runs Biome, TypeScript, Vitest, the production build, and Playwright in Chromium/WebKit.
On macOS, WebKit uses Option+Tab for native keyboard traversal when full keyboard access
is disabled; the suite follows that browser behavior without changing OS preferences.
See the [Playwright WebKit keyboard issue](https://github.com/microsoft/playwright/issues/41808).

The browser suite covers English and Hebrew at 320, 390, 430, 768, and 1440px, image loading,
overflow, accessibility, WhatsApp destinations, language persistence, keyboard selection,
reduced motion, carousel timing, and retired-route 404s. It saves full-page and section images.
Set `PLAYWRIGHT_ARTIFACTS` to a session scratchpad for local review artifacts.

The eight scenes cycle through a shuffled bag without immediate repeats. Pointer hover,
keyboard focus, offscreen visibility, page visibility, and explicit pause suspend playback.
Reduced motion gives a static, selectable version. The hero pause control stops decorative
motion and scenario playback throughout the page.

## Preview and release

```sh
pnpm build
pnpm --dir client preview
```

Preview uses the real local Worker at http://127.0.0.1:4173, including redirects and 404s.
Unknown URLs do not fall back to the home page.

Deployment requires explicit approval after mobile screenshot review. CI does not deploy.
After approval, squash merge the PR, check out the approved main commit, and run:

```sh
pnpm install --frozen-lockfile
pnpm --dir client deploy
```

The Worker remains named `portfolio` in the existing account. The six intended domain routes are declared in configuration and applied only by an
authorized deployment. Complete the read-only readiness review in `RELEASE.md` before
changing bindings or DNS. Regenerate binding types after configuration changes:

```sh
pnpm --dir client types
```

## Reference patterns

- [React effect cleanup](https://react.dev/learn/synchronizing-with-effects)
- [Vite static build](https://vite.dev/guide/static-deploy.html)
- [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite)
- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Worker-first routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/)

The legacy site versions, API, chat, blog, product pages, and legal pages have been removed.
Earlier versions remain available in Git history.
