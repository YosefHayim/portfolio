# CODE-STYLE.md

How code is written in the portfolio. This file is prescriptive: it records the desired
end-state for `clientV3/`, `server/`, `worker/`, and `shared/`. `clientV1/` and `clientV2/`
are frozen snapshots and are exempt.

`AGENTS.md` mirrors only the load-bearing digest. Edit this file first, then refresh the
digest.

## Scope

- `clientV3/`: living React 19 + Vite + Tailwind v4 app.
- `server/`: Express API, moving to Effect programs, services, schemas, and typed errors.
- `worker/`: one Cloudflare Worker serving the unified `dist/`.
- `shared/`: runtime-neutral contracts and generated/precompiled modules used by more than
  one runtime.

## Stack Practices

- Effect docs are the source for Effect API details; this file defines how this repo uses
  Effect.
- React stays idiomatic for local UI: props, events, `useState`, and JSX.
- TanStack Query owns client server-state caching/loading/refetch.
- React Hook Form owns multi-field client forms.
- Tailwind theme tokens own reusable colors and class patterns.
- Biome owns formatting and lint rules where a rule exists.

## Rules

### Function Form

Use named arrow functions. Do not write function declarations.

```ts
// Good
export const formatTenure = (startedAt: Date, endedAt: Date): string => {
  return `${startedAt.getFullYear()}-${endedAt.getFullYear()}`;
};

// Bad
export function formatTenure(startedAt: Date, endedAt: Date): string {
  return `${startedAt.getFullYear()}-${endedAt.getFullYear()}`;
}
```

Effect generator callbacks may use `function*` because `yield*` requires generator syntax.
That exception is for the callback only, not for declaring helpers.

### Components And Props

One React component per file. Helpers may live beside the component only when they are
private and small.

Use inline props only when a component has one simple prop. Use `interface XProps` when a
component has multiple props or a meaningful public component contract. Defaults belong in
the destructuring pattern.

```tsx
// Good: one simple prop stays inline.
export const StatusDot = ({ tone = 'idle' }: { tone?: StatusTone }) => {
  return <span data-tone={tone} className="size-2 rounded-full" />;
};

// Good: multiple props get an interface and destructuring defaults.
interface LanguageSwitchProps {
  locale?: string;
  onLocaleChange: (locale: string) => void;
}

export const LanguageSwitch = ({
  locale = 'en',
  onLocaleChange,
}: LanguageSwitchProps) => {
  return <button type="button" onClick={() => onLocaleChange(locale)}>EN</button>;
};

// Bad: multiple props hidden inline.
export const LanguageSwitch = ({
  locale = 'en',
  onLocaleChange,
}: {
  locale?: string;
  onLocaleChange: (locale: string) => void;
}) => null;
```

Use `type` for domain data, DTOs, unions, utility shapes, and hook input objects. Use
`interface` for component props and Effect service contracts.

### File Layout

Use this order:

```txt
imports
module constants
types/interfaces
schemas
helpers
component or exported API
```

Inside React components, use:

```txt
hooks
derived values
handlers
early-return guards
JSX
```

### File Naming

Source and script file names use `camelCase`. React component files use `PascalCase` and
match the exported component name. Do not create kebab-case source files.

Barrels are the standard exception: use `index.ts` for non-JSX folders and `index.tsx` for
component folders. Standard tool/config/doc names that are fixed by ecosystem convention may
keep their required names.

```txt
Good
LanguageSwitch.tsx
usePortfolioQuery.ts
chatSessionRuntime.ts
buildAll.sh
generateBlogCovers.sh
prismPortfolio.css

Bad
language-switch.tsx
use-portfolio-query.ts
chat-session-runtime.ts
build-all.sh
generate-blog-covers.sh
prism-portfolio.css
```

When touching an existing kebab-case source/script file, rename it in the same slice and
rewrite every import or command that referenced it. Do not add a compatibility wrapper.

### Control Flow

Prefer early-return guards. Do not nest ternaries. Use a one-line ternary only for tiny value
selection; use `switch` for multi-way branching.

```ts
// Good
if (!session.isOpen) return null;

switch (session.status) {
  case 'idle':
    return <IdleState />;
  case 'streaming':
    return <StreamingState />;
  case 'failed':
    return <FailedState error={session.error} />;
}

// Bad
const label = active ? (saving ? 'Saving' : 'Active') : disabled ? 'Disabled' : 'Idle';
```

### Collections, Parsing, And Examples

Small `map`/`filter`/`slice` chains are fine when they read directly. Extract named helpers
for parsing, regex, split/index logic, nested transforms, or anything that needs a raw
example comment.

Use `for...of` when the code needs early exit, mutation, async sequencing, or clearer
intermediate names.

Do not use assertion shortcuts like `as SomeType` or `as readonly string[]` to silence the
language service. Narrow with schemas, typed constants, or guards. If a platform boundary
forces a cast, isolate it and explain the boundary.

```ts
const SUPPORTED_LANGUAGE_CODES = new Set<string>(['en', 'he']);

/**
 * Normalizes a browser locale to a supported language code.
 *
 * @param locale - Browser or user-selected locale.
 * @returns A supported language code.
 * @example
 * normalizeLanguageCode('he-IL') // 'he'
 */
export const normalizeLanguageCode = (locale: string): string => {
  // Raw example: "he-IL" -> ["he", "IL"]
  const [languageCode = 'en'] = locale.split('-');

  if (SUPPORTED_LANGUAGE_CODES.has(languageCode)) return languageCode;

  return 'en';
};

/**
 * Builds initials for compact identity UI.
 *
 * @param fullName - Display name from authored profile data.
 * @returns Uppercase initials, or an empty string when the name itself is empty.
 * @example
 * getInitials('Yosef Hayim Sabag') // 'YHS'
 */
export const getInitials = (fullName: string): string => {
  const trimmedName = fullName.trim();

  if (trimmedName.length === 0) return '';

  // Raw example: "Yosef Hayim Sabag" -> ["Yosef", "Hayim", "Sabag"]
  const nameParts = trimmedName.split(/\s+/);
  const firstLetters: string[] = [];

  for (const namePart of nameParts) {
    const [firstLetter] = namePart;

    if (firstLetter === undefined) continue;

    firstLetters.push(firstLetter.toUpperCase());
  }

  // Raw example: ["Y", "H", "S"] -> "YHS"
  return firstLetters.join('');
};
```

Avoid `?? ''` as a quiet fallback when data should exist. Guard, validate, or make the empty
value an explicit domain case.

### Effect Usage

Use Effect fully for effectful code: validation, I/O, configuration, provider access,
logging, retries/timeouts, typed errors, and tests. React component-local UI state remains
plain React.

Use typed errors. Never swallow. A UI may render a fallback, but the code path must not erase
the error with `catch { return null }`.

Use Effect Schema as the only runtime boundary contract system. It replaces zod and
hand-rolled guards like `isRecord`, `asString`, and `asEnum`.

Keep provider access behind Effect services and Layers. OpenAI, GitHub, email, browser
storage, fetch, env/config, clocks, and random IDs should be services when business logic
depends on them.

Routes and handlers stay thin:

```txt
decode input -> run Effect program -> map tagged errors -> encode response
```

### Client Data And Forms

Effect owns the data program. TanStack Query owns cache, loading, error, and refetch state.
Do not duplicate manual `isLoading`/`error`/`refetch` state in every hook.

```ts
import { useQuery } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import { Effect } from 'effect';

type UsePortfolioQueryInput<A, E> = {
  queryKey: QueryKey;
  program: Effect.Effect<A, E>;
};

/**
 * Runs a decoded Effect program through the client cache layer.
 *
 * @param input - Query key and Effect program for one server-state source.
 * @returns TanStack Query result for the decoded data.
 * @example
 * const stats = usePortfolioQuery({ queryKey: ['github-stats'], program: loadGitHubStats });
 */
export const usePortfolioQuery = <A, E>({ queryKey, program }: UsePortfolioQueryInput<A, E>) => {
  return useQuery({
    queryKey,
    queryFn: () => Effect.runPromise(program),
  });
};
```

Use React Hook Form for multi-field forms. Effect Schema remains the source of validation;
wire it through a small local resolver/helper instead of zod.

One-field chat inputs may stay controlled React state.

### Logging

Use structured keyed logs through Effect logger annotations. Do not interpolate log strings.

```ts
// Good
yield* Effect.logInfo('chat_request').pipe(
  Effect.annotateLogs({ messageCount: request.messages.length }),
);

// Bad
logger.info(`chat request with ${request.messages.length} messages`);
```

### Modules, Imports, And Exports

Use named inline exports. Do not add default exports unless a framework boundary forces one.
Do not use bottom export blocks, redundant double exports, one-use re-export aliases, or
backward-compatibility aliases.

```ts
// Good
export const parseContactEmailMarker = (content: string): ContactEmailMarker | null => {
  return decodeContactEmailMarker(content);
};

// Bad
const parseContactEmailMarker = (content: string) => decodeContactEmailMarker(content);
const parseEmailMarker = parseContactEmailMarker;

export { parseContactEmailMarker, parseEmailMarker };
```

Use `import type` for type-only imports.

Use cross-root aliases instead of deep relative crawls:

```ts
// Good
import { productRegistry } from '@shared/portfolio/productRegistry.js';

// Bad
import { productRegistry } from '../../../shared/portfolio/productRegistry.js';
```

The Worker must not import `server/src/*`. Move shared runtime logic into `shared/` or a
dedicated runtime-neutral module.

Feature/component folders get leaf barrels. Use `index.tsx` for component folders and
`index.ts` for non-JSX module folders.

```ts
// clientV3/src/Components/Navbar/index.tsx
export * from './LanguageSwitch';
export * from './Navbar';
export * from './VersionSwitch';
```

Never import a folder's own barrel from inside that folder.

### UI Styling

Use Tailwind theme tokens and semantic classes. Do not scatter inline arbitrary hex classes.

If a class/color pattern repeats more than 3-4 times, promote it to Tailwind config, a theme
token, a small component, or a named helper.

Product/technology brand colors belong in one typed map, not repeated in components.

Icon-only buttons need an `aria-label`; a tooltip is not enough. Buttons must declare
`type="button"` unless they intentionally submit a form.

Recruiter-facing copy should be localized. Use `Localized<T>` for authored data and
translation keys for UI chrome. RTL should come from root `dir`, logical CSS, and no
hardcoded LTR spacing assumptions.

Use React 19 native metadata. Do not use `react-helmet-async`.

### TSDoc

Exported reusable APIs get TSDoc when their contract, side effect, boundary, parsing, or
default is not obvious. Include `@param`, `@returns`, and `@example` when an example makes
the behavior easier to follow.

Do not restate TypeScript.

```ts
/**
 * Decodes an unknown payload into a contact request.
 *
 * @param payload - Raw request body from the HTTP boundary.
 * @returns A decoded contact request Effect.
 * @example
 * const request = yield* decodeContactRequest(req.body);
 */
export const decodeContactRequest = (payload: unknown) => {
  return Schema.decodeUnknown(ContactRequestSchema)(payload);
};
```

Add raw example comments above regex/split/index parsing even when the function has TSDoc.

### Tests And Format

Use colocated `*.test.ts` / `*.test.tsx` files.

Use Vitest and `@effect/vitest`. Test core, schemas, and boundaries first. Component tests
should cover focused behavior or accessibility, not broad snapshots.

Mock external providers at the Effect service boundary with test Layers. Browser APIs should
sit behind services/fakes when core behavior depends on them.

Biome formatting is fixed:

- Single quotes.
- Semicolons.
- 2 spaces.
- Line width 100.
- Trailing commas all.
- Organized imports.

## Canonical Slice

This is the target shape for a migrated feature. It is illustrative; use the surrounding
repo names when implementing.

```ts
// shared/portfolio/chatSchema.ts
import { Schema } from 'effect';

export const ChatMessageSchema = Schema.Struct({
  role: Schema.Literal('user', 'assistant'),
  content: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(2000)),
});

export const ChatRequestSchema = Schema.Struct({
  messages: Schema.NonEmptyArray(ChatMessageSchema),
});

export const ChatReplySchema = Schema.Struct({
  role: Schema.Literal('assistant'),
  content: Schema.String,
});

export type ChatRequest = typeof ChatRequestSchema.Type;
export type ChatReply = typeof ChatReplySchema.Type;
```

```ts
// server/src/core/createChatReply.ts
import { Effect, Schema } from 'effect';
import { OpenAiClient } from '../adapters/OpenAiClient';
import type { ChatReply, ChatRequest } from '@shared/portfolio/chatSchema';

export class ChatReplyError extends Schema.TaggedError<ChatReplyError>()('ChatReplyError', {
  reason: Schema.String,
}) {}

/**
 * Creates a Portfolio Assistant reply from a decoded chat request.
 *
 * @param request - Chat request already decoded by the route boundary.
 * @returns An Effect that yields the assistant reply or a typed chat error.
 * @example
 * const reply = yield* createChatReply({ messages: [{ role: 'user', content: 'Who is Joseph?' }] });
 */
export const createChatReply = (
  request: ChatRequest,
): Effect.Effect<ChatReply, ChatReplyError, OpenAiClient> =>
  Effect.gen(function* () {
    yield* Effect.logInfo('chat_request').pipe(
      Effect.annotateLogs({ messageCount: request.messages.length }),
    );

    const openAi = yield* OpenAiClient;
    const content = yield* openAi.complete(request.messages);
    const reply: ChatReply = { role: 'assistant', content };

    return reply;
  });
```

```ts
// server/src/routes/chat.ts
import { Effect, Schema } from 'effect';
import { ChatRequestSchema } from '@shared/portfolio/chatSchema';
import { createChatReply } from '../core/createChatReply';

export const registerChatRoute = (app: Express, runtime: Runtime.Runtime<ServerRuntime>) => {
  app.post('/api/chat', (req, res) => {
    const program = Schema.decodeUnknown(ChatRequestSchema)(req.body).pipe(
      Effect.flatMap(createChatReply),
      Effect.match({
        onFailure: (error) => res.status(statusOf(error)).json({ error: error._tag }),
        onSuccess: (reply) => res.json(reply),
      }),
    );

    void runtime.runPromise(program);
  });
};
```

```tsx
// clientV3/src/Components/Navbar/LanguageSwitch.tsx
import { Languages } from 'lucide-react';
import { normalizeLanguageCode } from '@/i18n/normalizeLanguageCode';

interface LanguageSwitchProps {
  locale?: string;
  onLocaleChange: (locale: string) => void;
}

export const LanguageSwitch = ({
  locale = 'en',
  onLocaleChange,
}: LanguageSwitchProps) => {
  const languageCode = normalizeLanguageCode(locale);

  return (
    <button
      type="button"
      aria-label="Change language"
      className="text-brand hover:text-brand-strong"
      onClick={() => onLocaleChange(languageCode)}
    >
      <Languages aria-hidden="true" className="size-4" />
    </button>
  );
};
```

## Recipes

### Add An API Endpoint

1. Define request/response Effect Schemas in `shared/` when more than one runtime needs the
   contract.
2. Write the core as an Effect program in `server/src/core/`.
3. Put new I/O behind an Effect service and Layer in `server/src/adapters/`.
4. Keep the route thin: decode, run, map tagged errors, encode.
5. Add colocated Vitest coverage with `@effect/vitest` and test Layers.

### Add A Client Data Source

1. Write an Effect loader that fetches and decodes.
2. Wrap it with the unified TanStack bridge hook.
3. Consume the query result directly; do not recreate manual loading/error/refetch state.

### Add A Form

1. Use React Hook Form for multi-field forms.
2. Keep validation in Effect Schema.
3. Use a small resolver/helper that maps decoded success and typed errors into form errors.
4. Keep one-field chat inputs as controlled state when RHF would add noise.

### Add A CLI Command

1. Add the command function under `scripts/cli/commands/`.
2. Register it in the command registry.
3. Wire both entrypoints to the same function: interactive menu and flags/non-TTY direct run.
4. Ensure non-TTY/flagged invocations never hang.
5. Update ADR 0002 if the command is a new public verb.

## Target CLI Layout

```txt
scripts/
├── buildAll.sh
├── cli/
│   ├── index.ts
│   ├── commands.ts
│   ├── menu.ts
│   ├── runCommand.ts
│   └── commands/
│       ├── assets.ts
│       ├── build.ts
│       ├── deploy.ts
│       ├── dev.ts
│       ├── format.ts
│       ├── lint.ts
│       ├── post.ts
│       └── test.ts
└── dev/
    ├── generateBlogCovers.sh
    └── generateHero.sh
```

`scripts/dev/` stays local and gitignored. Build/deploy surfaces stay committed.

## Exemplars

- `CODE-STYLE.md` canonical slice: the full target until the migration lands.
- `clientV3/src/i18n/localized.ts`: closest current helper after cleanup.
- `clientV3/src/Components/Navbar/LanguageSwitch.tsx`: closest current component after
  cleanup.
- `server/src/core/rateLimit.ts`: closest current pure-ish core after formatting, Effect,
  and test alignment.

No current file fully embodies the target yet. That is expected; this guide records the
migration destination.

## Never

- Silent `catch`, `catch { return null }`, or empty `catch`.
- Hand-rolled boundary guards instead of Effect Schema.
- Type assertion shortcuts that override TypeScript/LSP feedback.
- Nested ternaries or duplicated ternary clusters.
- Regex/split/index parsing without raw example comments.
- One-use re-export aliases or backward-compatibility aliases.
- Bottom export blocks after implementation.
- Redundant double exports.
- Default exports outside framework-forced boundaries.
- Deep cross-root relative imports.
- Worker imports from `server/src/*`.
- Scattered inline hex or repeated class/color patterns that should be theme tokens.
- Interpolated string logs.
- Duplicated fetch/query state hooks.
- `PRODUCT.md` alongside `PROJECT.md`.
- Kebab-case source/script filenames.
