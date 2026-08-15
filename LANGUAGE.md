# LANGUAGE.md — portfolio

The human↔agent glossary: names only. Use these exact terms in code, comments,
commits, and docs; avoid the listed aliases. Orientation lives in `CONTEXT.md`.

## Terms

**Portfolio Assistant**
The AI assistant that answers recruiter and visitor questions, streams chat, supports voice, and can initiate a portfolio contact email.
_Avoid_: "the bot," "the chatbot," "the AI."

**Product Route Registry**
The single source of truth for public product pages, extension legal redirects, and route variants — kept stable across the static server and the Cloudflare Worker.
_Avoid_: "the routes file," "links map."

**GitHub Portfolio Snapshot**
The live GitHub-derived view of public repositories used by the portfolio UI and the Portfolio Assistant.
_Avoid_: "the repos data," "GitHub dump."

**App Catalog**
The product metadata used by app pages and marketing surfaces.
_Avoid_: "the apps list," "projects data."

**Chat Session**
The client-side state machine for a Portfolio Assistant conversation — streaming, voice, and email-marker handling.
_Avoid_: "chat state," "the convo."

**Version showcase — clientV1 / clientV2 / clientV3**
The three preserved eras of the site. **clientV3** is the living app (governed by `CODE-STYLE.md`); **clientV1** and **clientV2** are frozen snapshots, exempt from the style rules. The Worker serves them at `/v1`, `/v2`, `/v3`; the navbar and mobile sidebar carry the `v1 / v2 / v3` toggle.
_Avoid_: "old client," "legacy," "the current one."

**Effect program**
The typed program model for effectful work: validation, I/O, provider access, config, logging, retries/timeouts, and typed errors. React components still use idiomatic local UI state.
_Avoid_: "the Effect layer" (ambiguous with Effect `Layer`).

**Client server-state**
Remote data cached by TanStack Query after an Effect loader decodes it.
_Avoid_: "manual fetch state," "the loading booleans."

**Effect Layer**
An Effect `Layer` that provides a service (e.g. the OpenAI client) to the runtime.
_Avoid_: "provider," "the DI thing."
