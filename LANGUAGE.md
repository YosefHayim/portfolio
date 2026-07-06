# LANGUAGE.md

The shared vocabulary for the portfolio — the human↔agent bridge. **Names only:** each term
gets a definition and the aliases to avoid, so code, commits, PRs, and chat all use the same
word for the same thing. Orientation lives in `CONTEXT.md`; purpose in `PROJECT.md`.

## Terms

**Portfolio Assistant**
The AI assistant that answers recruiter and visitor questions, streams chat, supports voice,
and can initiate a portfolio contact email.
_Use:_ "Portfolio Assistant." _Avoid:_ "the bot," "the chatbot," "the AI."

**Product Route Registry**
The single source of truth for public product pages, extension legal redirects, and route
variants — kept stable across the static server and the Cloudflare Worker.
_Use:_ "Product Route Registry" (code: `productRegistry`). _Avoid:_ "the routes file," "links map."

**GitHub Portfolio Snapshot**
The live GitHub-derived view of public repositories used by the portfolio UI and the
Portfolio Assistant.
_Use:_ "GitHub Portfolio Snapshot" (code: `githubPortfolio`). _Avoid:_ "the repos data," "GitHub dump."

**App Catalog**
The product metadata used by app pages and marketing surfaces.
_Use:_ "App Catalog." _Avoid:_ "the apps list," "projects data."

**Chat Session**
The client-side state machine for a Portfolio Assistant conversation — streaming, voice, and
email-marker handling.
_Use:_ "Chat Session" (code: `usePortfolioChatSession`). _Avoid:_ "chat state," "the convo."

**Version showcase — clientV1 / clientV2 / clientV3**
The three preserved eras of the site. **clientV3** is the living app (governed by
`CODE-STYLE.md`); **clientV1** and **clientV2** are frozen snapshots, exempt from the style
rules. The Worker serves them at `/v1`, `/v2`, `/v3`; the navbar and mobile sidebar carry the
`v1 / v2 / v3` toggle.
_Use:_ "clientV3 (living app)," "clientV1/V2 (frozen snapshots)." _Avoid:_ "old client," "legacy," "the current one."

**Effect program**
The typed program model for effectful work: validation, I/O, provider access, config,
logging, retries/timeouts, and typed errors. React components still use idiomatic local UI
state.
_Use:_ "Effect program," "Effect runtime." _Avoid:_ "the Effect layer" (ambiguous with Effect `Layer`).

**Client server-state**
Remote data cached by TanStack Query after an Effect loader decodes it.
_Use:_ "client server-state." _Avoid:_ "manual fetch state," "the loading booleans."

**Effect Layer**
An Effect `Layer` that provides a service (e.g. the OpenAI client) to the runtime.
_Use:_ "Layer" (capital L, the Effect construct). _Avoid:_ "provider," "the DI thing."
