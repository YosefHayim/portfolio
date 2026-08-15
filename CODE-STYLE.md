# portfolio code style

How code is written in the portfolio. This file is prescriptive: it records the desired
end-state for `clientV3/`, `server/`, `worker/`, and `shared/`. `clientV1/` and `clientV2/`
are frozen snapshots and are exempt.

`AGENTS.md` mirrors only the load-bearing digest. Edit this file first, then refresh the
digest.

## How to read a rule

| Slot | Meaning |
| --- | --- |
| rule ID | Stable review and detector key |
| verify | Cheapest command that proves the rule, or judgment |
| chosen / rejected | The local idiom and the concrete failure shape |

## Rules

### Function Form
[rule:function.form] · verify: judgment

Use named arrow functions.

```ts
// ✓
export const formatTenure = (startedAt: Date, endedAt: Date): string => {
  return `${startedAt.getFullYear()}-${endedAt.getFullYear()}`;
};

// ✗
export function formatTenure(startedAt: Date, endedAt: Date): string {
  return `${startedAt.getFullYear()}-${endedAt.getFullYear()}`;
}
```

Why: Keeps the local idiom consistent and reviewable.

### Components And Props
[rule:components.and-props] · verify: judgment

One React component per file.

```tsx
// ✓: one simple prop stays inline.
export const StatusDot = ({ tone = 'idle' }: { tone?: StatusTone }) => {
  return <span data-tone={tone} className="size-2 rounded-full" />;
};

// ✓: multiple props get an interface and destructuring defaults.
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

// ✗: multiple props hidden inline.
export const LanguageSwitch = ({
  locale = 'en',
  onLocaleChange,
}: {
  locale?: string;
  onLocaleChange: (locale: string) => void;
}) => null;
```

Why: Keeps the local idiom consistent and reviewable.

### File Layout
[rule:file.layout] · verify: judgment

Use this order.

```txt
// ✓ chosen
imports
module constants
types/interfaces
schemas
helpers
component or exported API
// ✗ rejected
```

Why: Keeps the local idiom consistent and reviewable.

### File Naming
[rule:file.naming] · verify: judgment

Source and script file names use `camelCase`.

```txt
// ✓ chosen
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
// ✗ rejected
```

Why: Keeps the local idiom consistent and reviewable.

### Control Flow
[rule:control.flow] · verify: judgment

Prefer early-return guards.

```ts
// ✓
if (!session.isOpen) return null;

switch (session.status) {
  case 'idle':
    return <IdleState />;
  case 'streaming':
    return <StreamingState />;
  case 'failed':
    return <FailedState error={session.error} />;
}

// ✗
const label = active ? (saving ? 'Saving' : 'Active') : disabled ? 'Disabled' : 'Idle';
```

Why: Keeps the local idiom consistent and reviewable.

### Collections, Parsing, And Examples
[rule:collections.parsing-and-examples] · verify: judgment

Small `map`/`filter`/`slice` chains are fine when they read directly.

```ts
// ✓ chosen
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
// ✗ rejected
```

Why: Keeps the local idiom consistent and reviewable.

### Effect Usage
[rule:effect.usage] · verify: judgment

Use Effect fully for effectful code: validation, I/O, configuration, provider access, logging, retries/timeouts, typed errors, and tests.

```txt
// ✓ chosen
decode input -> run Effect program -> map tagged errors -> encode response
// ✗ rejected
```

Why: Keeps the local idiom consistent and reviewable.

### Client Data And Forms
[rule:client.data-and-forms] · verify: judgment

Effect owns the data program.

```ts
// ✓ chosen
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
// ✗ rejected
```

Why: Keeps the local idiom consistent and reviewable.

### Logging
[rule:logging] · verify: judgment

Use structured keyed logs through Effect logger annotations.

```ts
// ✓
yield* Effect.logInfo('chat_request').pipe(
  Effect.annotateLogs({ messageCount: request.messages.length }),
);

// ✗
logger.info(`chat request with ${request.messages.length} messages`);
```

Why: Keeps the local idiom consistent and reviewable.

### Modules, Imports, And Exports
[rule:modules.imports-and-exports] · verify: judgment

Use named inline exports.

```ts
// ✓
export const parseContactEmailMarker = (content: string): ContactEmailMarker | null => {
  return decodeContactEmailMarker(content);
};

// ✗
const parseContactEmailMarker = (content: string) => decodeContactEmailMarker(content);
const parseEmailMarker = parseContactEmailMarker;

export { parseContactEmailMarker, parseEmailMarker };
```

Why: Keeps the local idiom consistent and reviewable.

### UI Styling
[rule:ui.styling] · verify: judgment

Use Tailwind theme tokens and semantic classes.

```ts
// ✓ portfolio idiom

// ✗ rejected shape
```

Why: Keeps the local idiom consistent and reviewable.

### TSDoc
[rule:tsdoc] · verify: judgment

Exported reusable APIs get TSDoc when their contract, side effect, boundary, parsing, or default is not obvious.

```ts
// ✓ chosen
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
// ✗ rejected
```

Why: Keeps the local idiom consistent and reviewable.

### Tests And Format
[rule:tests.and-format] · verify: judgment

Use colocated `*.test.ts` / `*.test.tsx` files.

```ts
// ✓ portfolio idiom

// ✗ rejected shape
```

Why: Keeps the local idiom consistent and reviewable.

### Add An API Endpoint
[rule:add.an-api-endpoint] · verify: judgment

1.

```ts
// ✓ portfolio idiom

// ✗ rejected shape
```

Why: Keeps the local idiom consistent and reviewable.

### Add A Client Data Source
[rule:add.a-client-data-source] · verify: judgment

1.

```ts
// ✓ portfolio idiom

// ✗ rejected shape
```

Why: Keeps the local idiom consistent and reviewable.

### Add A Form
[rule:add.a-form] · verify: judgment

1.

```ts
// ✓ portfolio idiom

// ✗ rejected shape
```

Why: Keeps the local idiom consistent and reviewable.

### Add A CLI Command
[rule:add.a-cli-command] · verify: judgment

1.

```ts
// ✓ portfolio idiom

// ✗ rejected shape
```

Why: Keeps the local idiom consistent and reviewable.

### Target CLI Layout
[rule:target.cli-layout] · verify: judgment

Follow this project rule as specified.

```ts
// ✓ portfolio idiom

// ✗ rejected shape
```

Why: Keeps the local idiom consistent and reviewable.

## Canonical example

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

## Golden path — adding a unit

1. Name vocabulary changes in LANGUAGE.md / CONTEXT.md when needed.
2. Implement at the owning path for this repository.
3. Wire the unit at its registration seam.
4. Colocate or place tests per the rules above and run the project gate.

Definition of done:

- Focused tests pass.
- Style and typecheck pass.
- No `## Never` tell was introduced.

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

## Stack and framework practices

- Effect docs are the source for Effect API details; this file defines how this repo uses
  Effect.
- React stays idiomatic for local UI: props, events, `useState`, and JSX.
- TanStack Query owns client server-state caching/loading/refetch.
- React Hook Form owns multi-field client forms.
- Tailwind theme tokens own reusable colors and class patterns.
- Biome owns formatting and lint rules where a rule exists.
