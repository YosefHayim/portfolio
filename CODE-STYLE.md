# CODE-STYLE.md

How code is written in the portfolio. **Prescriptive** (how to write), not descriptive
(what exists — that's `AGENTS.md`). The rules digest is mirrored into `AGENTS.md`; this
file is the source — edit here. Records the **desired end-state**: some rules describe
where the code is going (Effect adoption), not where every file is today. The `## Never`
list names the current offenders so `deslop` can close the gap per-diff.

## Stack & framework practices

For framework/library best-practices, follow these skills (do not restate them here):

- Cloudflare Worker (serves the unified `dist/`, routes) → `workers-best-practices`, `cloudflare`
- `wrangler` dev/deploy → `wrangler`
- **Effect** (typed errors, Schema, services, logging) → the Effect docs at
  <https://effect.website> are the SSOT; this file covers only how *this* repo wires it.
- React 19 document metadata → native `<title>`/`<meta>` hoisting (no library).

This file covers only what is specific to THIS project on top of those.

## Rules

Load-bearing, project-specific rules only. Each: a one-line rule + the **✓ chosen / ✗
rejected** pair from the pick-the-code grill + an enforcement tag (`[lint: <rule>]` when a
linter catches it, else `[taste]`; `[config]` when a build/tooling file enforces it).

### Function form — split by intent · `[taste]`
Arrow `const` for components, hooks, and closures; `function` declaration for pure utilities.
```ts
// ✓ chosen
export const useGitHubStats = () => useEffectQuery(loadGitHubStats); // hook → arrow
function formatTenure(start: Date, end: Date): string { /* pure util → function */ }
// ✗ not this  (arrow util hides that it is a hoistable pure helper)
const formatTenure = (start: Date, end: Date) => { /* ... */ };
```
_Why:_ `function` signals a pure, hoisted helper; arrow marks a component/hook/closure.

### One component per file · `[taste]`
Each React component gets its own file. Helpers may still share a file — this rule is about components.
```tsx
// ✓ chosen        SectionBlock.tsx · TechIconChip.tsx · LogoBadge.tsx (own files)
// ✗ not this      clientV3/src/Pages/OnePage/OnePagePortfolio.tsx — SectionBlock,
//                 TechIconChip, LogoBadge all inlined in one 620-line file
```
_Why:_ greppable, lazy-friendly, readable.

### Early-return guards · `[taste]`
Guard clauses up top, bail early, keep the main path unindented.
```ts
// ✓ chosen
if (!isRecording) return;
process(stream);
// ✗ not this
if (isRecording) { process(stream); }
```
_Why:_ keeps nesting shallow.

### No nested ternaries · `[lint: noNestedTernary]`
One ternary level max; lift nested ones to flat `const`s, a `switch`, or an early-return helper.
```tsx
// ✓ chosen
const mobileDock = isOpen ? 'right-3 bottom-6 left-3' : 'right-3 bottom-6';
const dockClass = isMobile ? mobileDock : 'right-4 bottom-6';
// ✗ not this  (clientV3/src/Components/AIChatSidebar/AIChatSidebar.tsx:105)
const dockClass = isMobile ? (isOpen ? 'right-3 bottom-6 left-3' : 'right-3 bottom-6') : 'right-4 bottom-6';
```
_Why:_ readability beats terse cleverness.

### Branching: `switch` allowed · `[taste]`
`switch` for multi-way logic; Record maps reserved for pure data (e.g. a tech-icon map), not control flow.
```ts
// ✓ chosen                              // ✗ not this
switch (kind) {                          const run = ({ dev, build }[cmd] ?? help)();
  case 'dev': return dev();              // object-dispatch standing in for branching
  case 'build': return build();
  default: return help();
}
```
_Why:_ explicit branching reads better than dispatch tricks.

### Named `XProps` type · `[taste]`
A named `type XProps` above every component; never an inline object type in the parameter list.
```tsx
// ✓ chosen
type SectionBlockProps = { title: string; children: ReactNode };
const SectionBlock = ({ title, children }: SectionBlockProps) => { /* ... */ };
// ✗ not this  (OnePagePortfolio inline subcomponents)
const SectionBlock = ({ title, children }: { title: string; children: ReactNode }) => { /* ... */ };
```
_Why:_ reusable, greppable, clean signatures.

### `type` over `interface` · `[taste]`
type-first; `interface` only for genuinely extendable / declaration-merged shapes.
```ts
// ✓ chosen  (clientV3/src/utils/chatUtils.ts:9)
type Message = { role: 'user' | 'assistant'; content: string };
// ✗ not this
interface Message { role: 'user' | 'assistant'; content: string }
```
_Why:_ one keyword; unions and object shapes read the same way.

### Errors via Effect · `[taste]`
Effect's typed error channel through one unified wrapper. Never swallow — log or surface.
```ts
// ✓ chosen
Effect.tryPromise({ try: () => read(key), catch: (e) => new CacheError({ cause: e }) });
// ✗ not this  (clientV3/src/db/localDb.ts:25 · hooks/useChromeExtensionUsers.ts:35,40)
try { return JSON.parse(item); } catch { return null; } // error vanishes
```
_Why:_ errors become typed and visible instead of disappearing.

### Effect Schema at boundaries · `[taste]`
Effect Schema decodes every boundary — it replaces the hand-rolled guards **and** zod.
```ts
// ✓ chosen
const ChatMessage = Schema.Struct({ role: Schema.Literal('user', 'assistant'), content: Schema.String });
const req = yield* Schema.decodeUnknown(ChatRequest)(body);
// ✗ not this  (server/src/core/requestValidation.ts:31,45,46)
if (!isRecord(body)) throw ...; asEnum(message.role, 'role', [...]); asString(message.content, 'content', 1, 2000);
```
_Why:_ parse-don't-validate — types + runtime check + messages from one schema.

### Thin Effect-running handler · `[taste]`
Route = `Schema.decode` → core Effect → `runtime.runPromise` → map tagged errors to HTTP. No business logic in the handler.
```ts
// ✓ chosen
app.post('/api/chat', (req, res) =>
  runtime.runPromise(Schema.decodeUnknown(ChatRequest)(req.body).pipe(
    Effect.flatMap(createChatReply),
    Effect.match({ onFailure: (e) => res.status(statusOf(e)).json({ error: e._tag }), onSuccess: (r) => res.json(r) }))));
// ✗ not this
app.post('/api/chat', async (req, res, next) => { try { /* logic inline */ } catch (e) { next(e); } });
```
_Why:_ typed errors; business logic leaves the edge.

### Pure core, I/O behind services · `[taste]`
Core is pure Effect programs; OpenAI / GitHub / email live behind Effect services + Layers (keep `server/src/adapters/`).
```ts
// ✓ chosen
const ai = yield* OpenAiClient;          // Context.Tag service, provided by a Layer
const content = yield* ai.complete(msgs);
// ✗ not this
const openai = new OpenAI({ apiKey }); const content = await openai.chat(...); // I/O welded into core
```
_Why:_ testable by swapping in a test Layer.

### Structured logs · `[taste]`
Keyed, leveled logs via Effect's logger — never string-interpolated.
```ts
// ✓ chosen
yield* Effect.logInfo('chat_request').pipe(Effect.annotateLogs({ msgCount: req.messages.length }));
// ✗ not this
winston.info(`chat request with ${req.messages.length} messages`);
```
_Why:_ greppable and machine-parseable.

### Effect at the edges only · `[taste]`
Effect lives in loaders, services, and validation. React components stay idiomatic — plain `useState`, no Effect atoms in component state.
```ts
// ✓ chosen        component: const { data, isLoading } = useEffectQuery(loadGitHubStats);
// ✗ not this      component: const stats = useRxValue(githubStatsAtom); // Effect Rx driving UI state
```
_Why:_ lowest friction; the UI stays idiomatic React.

### One data-fetch hook · `[taste]`
A single `useEffectQuery(program)` → `{ data, isLoading, error, refetch }`; every source is an Effect.
```ts
// ✓ chosen
export const useGitHubStats = () => useEffectQuery(loadGitHubStats);
// ✗ not this  (clientV3/src/hooks/useGitHubStats.ts ≈ useGitHubProjects.ts — duplicated scaffolding)
const [data, setData] = useState(null); const [loading, setLoading] = useState(true);
useEffect(() => { fetch(...).then(setData).finally(() => setLoading(false)); }, []);
```
_Why:_ ~20 copy-pasted lines collapse to one reused hook.

### Named exports; default only for lazy pages · `[taste]`
Named export everywhere; `export default` only on `React.lazy` page components.
```tsx
// ✓ chosen                              // ✗ not this (clientV3/src/Components/ui/ai-input.tsx)
export const AnimatedPage = () => ...;   export const AnimatedPage = () => ...;
// default only on a lazy page           export default AnimatedPage; // redundant double export
```
_Why:_ kills the redundant double export.

### `@shared` alias · `[config]`
Import shared modules via a `@shared/*` path alias, matching the existing `@/` convention — never a deep-relative crawl.
```ts
// ✓ chosen                                        // ✗ not this
import { productRegistry } from '@shared/portfolio/productRegistry.js';
                                                   import { productRegistry } from '../../../shared/portfolio/productRegistry.js';
```
_Why:_ stable call sites; matches `@/`. (Alias wiring lands with the Step 8 reorg that rewrites the imports.)

### `import type` · `[lint: useImportType]`
`import type` for type-only imports; inline `type` specifiers for mixed imports.
```ts
// ✓ chosen                                    // ✗ not this
import type { ReactNode } from 'react';        import { ReactNode } from 'react';
```
_Why:_ honest runtime imports; better bundling.

### Barrel files · `[taste]`
One `index.ts` `export *` per feature/leaf folder for clean call sites. Never import a folder's own barrel from inside that folder (cycle risk).
```ts
// ✓ chosen   clientV3/src/Components/Blog/index.ts → export * from './BlogCard'; ...
//            consumer: import { BlogCard, BlogList } from '@/Components/Blog';
// ✗ not this  import { BlogCard } from '@/Components/Blog/BlogCard'; // deep path per file
```
_Why:_ cleaner wildcard-barrel imports; the leaf-only rule avoids cycles.

### Brand color tokens · `[taste]`
Tailwind v4 `@theme` tokens (`--color-brand`, `--color-brand-soft`, `--color-accent`) + semantic classes — never inline hex.
```tsx
// ✓ chosen                        // ✗ not this (≈145 bracketed-hex utilities across .tsx)
<span className="text-brand" />    <span className="text-[#7ff7af]" />
<div className="bg-brand-soft" />  <div className="from-[#05df72]" />
```
_Why:_ one place to change the brand.

### Canonical file layout · `[taste]`
`imports (type-first) → module consts → XProps → component (hooks → derived → handlers → JSX)`.
```tsx
// ✓ chosen: imports → consts → type FooProps → const Foo = () => { hooks; derived; handlers; return JSX }
// ✗ not this: free-form order with subcomponents inlined mid-file
```
_Why:_ every file reads the same way.

### Colocated, core-first tests · `[taste]`
Colocated `*.test.ts` next to source; cover the Effect core + pure utils. Presentational JSX stays light.
```ts
// ✓ chosen   server/src/core/chat.test.ts  →  it.effect('replies', () => Effect.gen(function* () { ... }))
// ✗ not this  a broad __tests__/ tree of UI + integration snapshots
```
_Why:_ high-value coverage, low upkeep for a portfolio.

## Canonical example

The agreed style assembled on one real feature slice — the chat endpoint plus its client
query hook — every rule working together. Illustrative documentation, not shipping code;
it is the litmus the plan was approved against and a positive target for `deslop`.

```ts
// shared/chat/schema.ts — Effect Schema is the boundary contract
import { Schema } from 'effect';
export const ChatMessage = Schema.Struct({
  role: Schema.Literal('user', 'assistant'),
  content: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(2000)),
});
export const ChatRequest = Schema.Struct({ messages: Schema.NonEmptyArray(ChatMessage) });
export type ChatRequest = typeof ChatRequest.Type;

// server/src/core/chat.ts — pure Effect core; I/O behind a service
import { Effect } from 'effect';
import { OpenAiClient } from '@/adapters/openai'; // Context.Tag service

export class ChatError extends Schema.TaggedError<ChatError>()('ChatError', {
  reason: Schema.String,
}) {}

export const createChatReply = (req: ChatRequest) =>
  Effect.gen(function* () {
    yield* Effect.logInfo('chat_request').pipe(
      Effect.annotateLogs({ msgCount: req.messages.length }),
    );
    const ai = yield* OpenAiClient;          // effectful edge
    const content = yield* ai.complete(req.messages);
    return { role: 'assistant' as const, content };
  });

// server/src/routes/chat.ts — thin edge: decode → run → map
app.post('/api/chat', (req, res) =>
  runtime.runPromise(
    Schema.decodeUnknown(ChatRequest)(req.body).pipe(
      Effect.flatMap(createChatReply),
      Effect.match({
        onFailure: (e) => res.status(statusOf(e)).json({ error: e._tag }),
        onSuccess: (reply) => res.json(reply),
      }),
    ),
  ));

// clientV3/src/hooks/useEffectQuery.ts — the one data hook (kills the twins)
export const useEffectQuery = <A, E>(program: Effect.Effect<A, E>) => {
  const [state, setState] = useState({ data: null as A | null, isLoading: true, error: null as E | null });
  const run = useCallback(() => {
    setState((s) => ({ ...s, isLoading: true }));
    Effect.runPromiseExit(program).then((exit) =>
      setState(Exit.match(exit, {
        onSuccess: (data) => ({ data, isLoading: false, error: null }),
        onFailure: (cause) => ({ data: null, isLoading: false, error: Cause.squash(cause) as E }),
      })));
  }, [program]);
  useEffect(() => { run(); }, [run]);
  return { ...state, refetch: run };
};

// clientV3/src/hooks/useGitHubStats.ts — named export, one line
export const useGitHubStats = () => useEffectQuery(loadGitHubStats);
```

## Recipes

### How to add an API endpoint
1. Define the request/response **Effect Schema** in `shared/` (the boundary contract).
2. Write the pure **Effect core** in `server/src/core/` — no I/O, business logic only.
3. New I/O? Add an **Effect service + Layer** in `server/src/adapters/`; provide it in the runtime.
4. Add a **thin route** in `server/src/routes/`: `Schema.decode → core → runtime.runPromise → map tagged errors to HTTP`.
5. Add a colocated `*.test.ts` on the core with `it.effect` and a test Layer.

### How to add a client data source
1. Write an **Effect program** (a loader) that fetches + decodes with Schema.
2. Wrap it: `export const useThing = () => useEffectQuery(loadThing);`.
3. Consume `{ data, isLoading, error, refetch }` in an idiomatic component with `useState`/JSX.

### How to add a CLI command
1. Add the verb to the command registry as a **function** (e.g. `deploy()`).
2. Wire it into **both** routes — the interactive menu and the flag parser call the *same* function.
3. Register help text; ensure a non-TTY / flagged invocation runs direct and **never hangs**.
4. Record any new surface in ADR `docs/adr/current/0002-cli-command-surface.md`.

## Exemplars

Write new code like these:

- **`CODE-STYLE.md` → Canonical example** — the composed target. Until the Effect
  migration lands, it is the exemplar: the chat Effect core + `useEffectQuery` hook are the
  first files to write in this style.
- `clientV3/src/utils/chatUtils.ts` — closest current file for **type-first + named exports**
  (but see `Never`: it also carries one-use re-export aliases to remove).
- `server/src/` layered layout (`adapters / core / middleware / routes`) — the target
  server shape the Effect rules slot into.

> **Finding:** no file yet embodies the *full* agreed (Effect) style — expected, since Effect
> is newly adopted (ADR 0001). The canonical example is the target until the first migrated
> slice ships.

## Never

The AI-slop fingerprint for THIS repo — concrete banned patterns, each with a real offender and how it is caught:

- **Silent `catch { return null }` / empty `catch {}`** — errors vanish · `clientV3/src/db/localDb.ts:25,33`, `clientV3/src/hooks/useChromeExtensionUsers.ts:35,40` · `[lint: noEmptyBlockStatements]` for empty blocks; the swallow itself is `[taste]` → Effect typed errors.
- **Nested ternaries** — unreadable branching · `clientV3/src/Components/AIChatSidebar/AIChatSidebar.tsx:105,118,124` · `[lint: noNestedTernary]`.
- **Hand-rolled type guards** (`isRecord`, `asString`, `asEnum`) — reimplement what a schema gives free · `server/src/core/requestValidation.ts:31,45,46` · `[taste]` → Effect Schema.
- **Twin fetch hooks** — duplicated `useState`/`useEffect` scaffolding · `clientV3/src/hooks/useGitHubStats.ts` ≈ `useGitHubProjects.ts` · `[taste]` → `useEffectQuery`.
- **One-use re-export aliases** — indirection with no caller · `clientV3/src/utils/chatUtils.ts:20-22` (`parseEmailMarker = parseContactEmailMarker`) · `[taste]`.
- **Redundant double export** — `export const X; export default X;` on non-lazy components · `clientV3/src/Components/ui/ai-input.tsx` · `[taste]`.
- **Inline hex color literals** — ≈145 bracketed `[#hex]` utilities across `.tsx` (`text-[#7ff7af]`, `from-[#05df72]`) · `[taste]` → brand tokens.
- **String-interpolated logs** — unkeyed, ungreppable · winston call sites in `server/src/` · `[taste]` → `Effect.logInfo` + `annotateLogs`.
