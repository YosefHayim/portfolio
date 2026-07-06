export type BlogCategory = 'engineering' | 'career' | 'tutorials' | 'thoughts' | 'projects';

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: BlogCategory;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  featured?: boolean;
};

const categoryConfig: Record<BlogCategory, { label: string; color: string; bgColor: string }> = {
  engineering: {
    label: 'Engineering',
    color: '#05df72',
    bgColor: 'bg-[#05df72]/10 text-[#05df72]',
  },
  career: {
    label: 'Career',
    color: '#00d9ff',
    bgColor: 'bg-[#00d9ff]/10 text-[#00d9ff]',
  },
  tutorials: {
    label: 'Tutorials',
    color: '#fdc700',
    bgColor: 'bg-[#fdc700]/10 text-[#fdc700]',
  },
  thoughts: {
    label: 'Thoughts',
    color: '#a855f7',
    bgColor: 'bg-[#a855f7]/10 text-[#a855f7]',
  },
  projects: {
    label: 'Projects',
    color: '#f97316',
    bgColor: 'bg-[#f97316]/10 text-[#f97316]',
  },
};

export const getCategoryConfig = (category: BlogCategory) => categoryConfig[category];

const AUTHOR = {
  name: 'Joseph Sabag',
  avatar: '/images-of-me/hero-image.png',
};

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'the-security-guard-who-taught-himself-to-code',
    title: 'The security guard who taught himself to code',
    excerpt:
      'I wanted to automate Amazon. I couldn’t afford a developer. So I became the developer. The ugly, true version — the failed SaaS, the plastic chair, the month I didn’t sleep.',
    content: `I wanted to automate Amazon. I couldn't afford a developer. So I became the developer.

That's the whole story. Here's the ugly version, because the ugly version is the true one.

2021. I had an idea I called Bolt ASINs — a system that rips winning products off Amazon and hands them to dropshipping sellers on autopilot. No spreadsheets, no manual hunting. Push a button, get ASINs. I was sure it was money.

One problem. I couldn't build it. Not a line.

So I did what you do. I hired. A Python guy on Fiverr, good reviews, big promises. He took my money and my deadline and handed back a pile of Selenium scripts held together with spit. Half didn't run. The other half ran wrong. I asked for something heavier, something real. He went quiet.

So I hired more. Other platforms, other promises, same movie every time — my idea in my head, my money in their pocket, nothing shipping. The best anyone gave me was an MVP in pure HTML. No JavaScript. A brochure pretending to be software.

Then the money ran out. Turns out a dream gets expensive when you're paying other people to not build it.

So I took a job as a security guard.

Picture it. Twenty-something, plastic chair, night shift, watching a door — with a SaaS idea rotting in a Google Doc I had no way to turn into anything. That wasn't a low point in the story. That was the end of it. Over.

Then ChatGPT showed up.

I opened it the way you open anything when you're broke and out of ideas — not expecting a thing. Asked it a dumb Python question. It answered. Asked another. It answered that too. And something in my chest went off like a starter pistol.

I didn't sleep right for a month. My mother was sure I'd finally cracked. And understand — this was 2022. That model was nothing like the sharp thing you use now. It lied to your face and smiled doing it. No MCP, no tools, no way to ground it or trust a single line it gave you. So I became the grounding. I copy-pasted whole Interactive Brokers PDFs and Binance API docs into that box by hand, page after page, force-feeding it the truth until it finally spat back code that actually ran. This was before anyone said "vibe coding," before there was a name for it or a course selling it — just me, a model that lied, and a hunger I couldn't switch off. Eighteen hours a day, I rebuilt every single thing I'd paid strangers to fail at. Interactive Brokers bots firing trades. Crypto bots running while I slept. Scrapers eating Amazon alive. In under a month I had more working software than all that hired help ever shipped.

And then I stopped cold, staring at the screen, and thought: what the fuck is this. I can make it work but I can't read a word of it. I'm driving with my eyes shut and I keep not crashing.

That scared me more than the plastic chair ever did.

I don't do slow — never have. So I cut a deal with myself on the spot: take one real course, and if the fire's still burning when it's done, go all the way to a degree. IITC in Ramat Gan, the program that takes combat soldiers and turns them into engineers. Finished it with Excellence — the same word I earned twice in the army, once as a soldier, once as a commander. Turns out whatever makes you good at holding a line makes you good at holding a build.

I'm a freelance AI engineer now. I ship things people pay for — apps in the App Store, open-source tools with real users, automation that deletes someone else's boring work the way I once wanted to delete mine.

Bolt ASINs never shipped. Doesn't matter. It was never about the ASINs. It was about the guy in the plastic chair who refused to stay in it.`,
    coverImage: '/blog/security-guard.png',
    category: 'career',
    tags: ['origin story', 'self-taught', 'automation', 'Bolt ASINs'],
    author: AUTHOR,
    publishedAt: '2026-07-01',
    readingTime: 4,
    featured: true,
  },
  {
    id: '2',
    slug: 'ebay-mcp-322-tools',
    title: 'eBay MCP: 322 tools I gave away for free',
    excerpt:
      'I couldn’t build the whole dropshipping SaaS, so I built the one piece nobody else had: eBay’s entire Sell API, wrapped for AI agents. 322 tools. 92 stars. Given away.',
    content: `I wanted to build the next AutoDS. A platform that does the boring eBay work for you — listing, pricing, inventory, orders — so a seller can run a store without living inside sixteen browser tabs.

Then I looked at the size of it. AutoDS has a team, years, funding. I had a laptop and a stubborn streak. The full platform was too big for one guy. Fine. I asked a smaller question: what's the one piece nobody's built yet?

Nobody had wired eBay's Sell APIs into an MCP. Nobody. An AI agent could reason about your eBay store all day but couldn't touch it — couldn't list an item, fix a price, pull an order. All the thinking, none of the hands.

So I built the hands.

eBay's Sell APIs are a swamp. Modern REST in one corner, a crusty legacy XML Trading API in the other, all of it locked behind OAuth that fights you the whole way. I wrapped the entire thing — 322 tools across around 270 endpoints, the full Sell surface — into one local MCP server. OAuth wizard, refresh tokens, JWT, STDIO and HTTP, and a gate so an agent only loads the tools it needs instead of drowning in all 322.

I open-sourced it because I couldn't build the whole SaaS, but I could build the part everyone after me would need. Developers plug it into Claude and Cursor and run real eBay work through an agent.

I didn't get to build AutoDS. So I built the piece anyone chasing it needs first — and gave it away. Ninety-two stars say I read that right.`,
    coverImage: '/blog/ebay-mcp.png',
    category: 'projects',
    tags: ['open source', 'MCP', 'eBay API', 'TypeScript', 'OAuth'],
    author: AUTHOR,
    publishedAt: '2026-06-20',
    readingTime: 3,
    featured: true,
  },
  {
    id: '3',
    slug: 'two-extensions-400-users-one-paying-customer',
    title: '2 extensions, 400 users, 1 paying customer',
    excerpt:
      'Every extension I’ve shipped started as me being annoyed. Two of them, 400 users, one paying stranger — and the bigger tool they led me to build.',
    content: `Every extension I've shipped started as me being annoyed.

I was generating a lot in Sora, sitting there like an idiot clicking go, waiting, clicking go again. So I built Sora Auto Queue — line up your prompts, walk away, come back to a stack of finished work. Then the same itch hit me across ChatGPT, Gemini, AI Studio, so I built BatchBeam — dump a CSV of prompts, let it run them all back to back, retries and downloads handled.

Two extensions. Around 400 users between them. And one got me my first paying customer — a stranger on the internet who liked what I built enough to hand me money for it. I don't care how small the number was. The day someone pays you for a thing you made out of your own annoyance, something rewires in your head. You stop being a guy who codes. You're a guy who ships things people buy.

But here's where it actually went. Automating a button inside a browser tab is fun. Automating the whole AI is better. So I built ai-browser-bridge — drive a real ChatGPT or Gemini conversation straight from your terminal, and hand the model a narrow, sandboxed set of your repo's tools over MCP. Grep, read, patch, run tests, diff. No raw shell, ever. Playwright drives the real browser tab, a Cloudflare tunnel lets ChatGPT reach back into your machine, six providers answer to one command.

The extensions taught me to kill small annoyances. ai-browser-bridge is me killing a big one. Same instinct, bigger blast radius.`,
    coverImage: '/blog/extensions.png',
    category: 'projects',
    tags: ['browser extensions', 'Chrome', 'ai-browser-bridge', 'MCP', 'indie'],
    author: AUTHOR,
    publishedAt: '2026-06-10',
    readingTime: 3,
  },
  {
    id: '4',
    slug: 'i-vibe-coded-before-it-had-a-name',
    title: 'I vibe-coded before it had a name',
    excerpt:
      'They sell courses on it now. I was doing it in 2022 in the dark, hand-feeding a model that lied to me until it stopped.',
    content: `They call it vibe coding now. There are courses. Influencers. A whole vocabulary. I was doing it in 2022 in the dark, with no name for it and no idea if it would work.

Except back then the model was a liar. Today's version is sharp — reads your repo, calls tools, checks itself. The 2022 one hallucinated functions that didn't exist and apologized beautifully when you caught it. No MCP, no grounding, nothing to trust. So I did the trusting by hand. I copy-pasted entire Interactive Brokers PDFs and Binance API docs into that little box, page after page, until it had enough truth in front of it to stop making things up.

That's the part nobody selling a course tells you. It wasn't lazy. It was the opposite. Eighteen hours a day feeding a machine the documentation it should've known, catching its lies, running the code, watching it break, pasting the error back, going again. I built trading bots and scrapers that way, from zero, on pure stubbornness and a chat window.

People argue about whether vibe coding makes you a real engineer. Wrong question. The tool doesn't make you anything. The stubbornness does. I know guys with the sharpest AI on earth who ship nothing because they quit at the first hallucination. I shipped because I refused to.

And I'll say the rest plain: we are living in the single greatest time in history to build the thing in your head. The gap between "I imagine it" and "it runs" has never been this thin. If you're not building right now, it's not the tools holding you back. It's you.`,
    coverImage: '/blog/vibe-coding.png',
    category: 'thoughts',
    tags: ['AI', 'vibe coding', 'self-taught', 'ChatGPT'],
    author: AUTHOR,
    publishedAt: '2026-05-28',
    readingTime: 3,
    featured: true,
  },
  {
    id: '5',
    slug: 'the-bots-that-ran-while-i-slept',
    title: 'The bots that ran while I slept',
    excerpt:
      'For half a year I tried to build a trading bot that made money. I lost about four thousand shekels finding out I couldn’t — and it taught me the most important thing I know.',
    content: `For half a year I tried to build a trading bot that actually made money. I did not succeed. I lost about four thousand shekels finding that out, and I'd do it again.

Here's what people get wrong about that. I could build the bot. That was never the problem. Interactive Brokers bot firing trades, a crypto bot on Binance running while I slept, backtests grinding through years of TradingView data hunting for an edge. The code worked. The engineering was real. What I couldn't do was make the market hand me money for it.

I'd sit in TradingView for hours replaying strategies backwards over old candles. This pattern, that indicator, this stop-loss. Every one looked like genius in the backtest and bled money the second it touched real prices. The market doesn't care how clean your code is. It'll take your four thousand shekels and teach you something no course will.

And it did. It taught me the difference between "it runs" and "it works." A bot that executes perfectly and loses money runs — it doesn't work. That gap is the whole job. Passing tests isn't shipping. Green isn't done. The market beat that into me for four grand, which is honestly cheaper than most people's tuition.

The bots are off now. The lesson never turned off.`,
    coverImage: '/blog/trading-bots.png',
    category: 'projects',
    tags: ['trading bots', 'Python', 'Binance', 'Interactive Brokers', 'failure'],
    author: AUTHOR,
    publishedAt: '2026-05-15',
    readingTime: 2,
  },
  {
    id: '6',
    slug: 'shipping-ios-for-real-smallbites',
    title: 'Shipping iOS for real: SmallBites',
    excerpt:
      'My first real native app went to the App Store on the back of a single Udemy course. You don’t wait until you’re ready. Nobody’s ever ready.',
    content: `My first real native app went to the App Store. Before it, my entire mobile experience was one Udemy course — Maximilian's React Native guide, watched at 1.5x like everyone else.

Then a freelance client hired me to build SmallBites. Real product, real users, App Store review, the whole thing. Baby-led weaning — helping parents start their kid on solid food without losing their minds. Not a domain I'd have picked. Doesn't matter. The job isn't to build what you know. It's to build what the client needs and learn the rest on the way.

So I learned the rest on the way. There's a specific terror in shipping your first native app that the web never gave me. On the web you push and it's live in seconds; break it, fix it, push again. The App Store makes you stand in line. You submit, you wait, a stranger at Apple decides, and if you got something wrong you go to the back of the line and wait again. It forced a discipline the web let me be lazy about.

SmallBites shipped. It's live. WiseNoteTaker — my own one, an AI that records a meeting and hands you back structured notes — is in review now.

Turns out "I only did one course" and "I shipped it to production" can both be true at once. You don't wait until you're ready. Nobody's ever ready. You take the job and you become ready by the deadline.`,
    coverImage: '/blog/smallbites.png',
    category: 'projects',
    tags: ['React Native', 'Expo', 'iOS', 'App Store', 'freelance'],
    author: AUTHOR,
    publishedAt: '2026-05-02',
    readingTime: 3,
  },
  {
    id: '7',
    slug: 'i-got-hired-as-qa-not-a-dev',
    title: 'I got hired as QA, not a dev',
    excerpt:
      'I wanted full-stack. They offered me QA. I said yes so fast it looked desperate — and it was the smartest move I made.',
    content: `I wanted to be a full-stack developer. I got hired as QA. And I said yes so fast it probably looked desperate.

It wasn't desperation. Not only, anyway. After the years I'd put in — the failed SaaS, the security guard chair, teaching myself in the dark — walking into a real tech company and having them want me at all felt like a dream. My internship's first day, I remember thinking: I'm actually in. Then Predicto hired me and it hit different. I wasn't the outsider clawing at the window anymore. I was inside. Blending in. One of them.

So no, being "just QA" didn't sting. QA was the door, and I'd have taken a smaller one. I tested, I broke things on purpose, I learned how the platform actually held together from the inside. A few months in, I moved to the frontend — real features on the buying platform, CMS templates built to lift revenue. Then they handed me the migration: ten years of production data moving to Cloudflare, and my job was to not lose a single byte. We didn't.

That's what I'd tell anyone hunting their first job. Stop being precious about the title. Get in the building. The distance from QA to frontend is short once you're inside. The distance from outside to inside is the whole war. I took the smallest door they'd open. Then I didn't stop walking.`,
    coverImage: '/blog/qa-to-frontend.png',
    category: 'career',
    tags: ['career', 'first job', 'QA', 'Predicto'],
    author: AUTHOR,
    publishedAt: '2026-04-20',
    readingTime: 3,
  },
  {
    id: '8',
    slug: 'bolt-asins-the-saas-i-put-in-a-drawer',
    title: 'Bolt ASINs: the SaaS I put in a drawer',
    excerpt:
      'Everyone confesses their failures now. Mine wasn’t a failure. I put it in a drawer — and that’s a different thing entirely.',
    content: `Everyone wants to tell you about their failures now. It's a whole genre. So let me be precise: Bolt ASINs didn't fail. I put it in a drawer.

The idea was a system that pulls winning products off Amazon and feeds them to dropshipping sellers, automatically. I couldn't build it back then, couldn't afford anyone who could, and the money ran out before the code did. So it went in the drawer. Not dead. Filed.

The difference matters. A failure is a thing you tried fully and it beat you. Bolt ASINs I just never got to execute — I ran out of runway before I ran out of belief. There's a version of me that's bitter about that. I'm not him. That drawer is where I keep proof that I saw the problem years before I had the hands to solve it.

Would I open it today? Not for that exact idea. I can build it now, easily — which is exactly why it bores me now. If I went back into dropshipping it'd be for a different problem, a sharper one the AutoDS's of the world haven't flattened yet. The old idea already did its job. It pointed me at a whole industry of manual pain and said: learn to kill this.

I learned. The drawer can keep the blueprint. I moved on to bigger buildings.`,
    coverImage: '/blog/bolt-asins.png',
    category: 'thoughts',
    tags: ['startup', 'dropshipping', 'automation', 'lessons'],
    author: AUTHOR,
    publishedAt: '2026-04-08',
    readingTime: 2,
  },
  {
    id: '9',
    slug: 'falling-for-agentic-workflows',
    title: 'Falling for agentic workflows',
    excerpt:
      'Everyone thinks agentic coding is about the model. It’s not. It’s about context, the assignment, and knowing what good code even looks like.',
    content: `The thing I'm obsessed with right now isn't a language or a framework. It's how you talk to an agent so it hands you back code you'd actually ship.

Everyone thinks agentic coding is about the model. It's not. It's about context and the assignment. Give an agent a vague task and a blind view of your codebase and it'll confidently write garbage that runs — the worst kind, because it passes and it's wrong underneath. Give it the right context, a sharp assignment, and real taste for how your code should be shaped, and it writes something you'd sign your name to.

That's the whole game I'm playing now. Not "make the AI write it." Make the AI write it the way I would. Readable. Structured like a human who cares built it, not a machine that guessed. I spend my effort upstream — on the context I feed it and the instructions I give it — because that's where the quality is decided, long before a line gets generated.

And here's what the hype crowd skips: none of this works without the fundamentals. You can't judge whether an agent's output is good if you don't know what good looks like. You can't steer it through a codebase you couldn't navigate yourself. The agents didn't make engineering obsolete. They made it matter more — because now I'm not just writing the code, I'm the standard it gets measured against.

That's the hybrid I'm building myself into. Agentic speed on top of real judgment. Anyone can generate a thousand lines now. Knowing which thousand deserve to exist — that's the job.`,
    coverImage: '/blog/agentic-workflows.png',
    category: 'engineering',
    tags: ['AI agents', 'agentic', 'context engineering', 'SDLC'],
    author: AUTHOR,
    publishedAt: '2026-06-28',
    readingTime: 3,
    featured: true,
  },
  {
    id: '10',
    slug: 'idf-to-high-tech-what-actually-transfers',
    title: 'IDF → high-tech: what actually transfers',
    excerpt:
      'Every “military to tech” story sells the same clean lie. Here’s what actually transferred from commanding soldiers to writing code — and what I had to leave at the door.',
    content: `Every "military to tech" story sells the same clean lie: that everything transferred, that leading soldiers made me a natural at leading code. Most of it is nonsense. Let me tell you what actually carried and what I left at the door.

What carried is smaller than people want and stronger than they think. Discipline — the real kind. Showing up and doing the boring rep when nobody's watching and there's no medal in it. In Gdud 931 I learned you don't rise to the moment, you sink to your training, so you train until the floor is high. That's the most useful thing I own. And under it, a stubborn belief that anything is achievable if you're willing to suffer for it long enough. That belief taught me to code. That belief is why I'm here.

Now what didn't transfer. Command. In the army I gave an order and bodies moved. In engineering, rank is a joke — the compiler has never once cared that I was a commander. The machine doesn't respect you or fear you. It does exactly what you wrote, not what you meant. I had to unlearn authority and relearn humility. You don't command a codebase into working. You listen to it. You get it wrong, it tells you, you fix it. No salute involved.

That was the hard part. Not learning to code. Learning that being right about people didn't make me right about systems. I earned Excellence twice in uniform. Then I sat at a keyboard and started again from private.`,
    coverImage: '/blog/idf-transfer.png',
    category: 'career',
    tags: ['IDF', 'discipline', 'career change', 'military'],
    author: AUTHOR,
    publishedAt: '2026-03-25',
    readingTime: 3,
  },
  {
    id: '11',
    slug: 'effect-the-library-that-looks-weird-until-it-doesnt',
    title: "Effect: the library that looks weird until it doesn't",
    excerpt:
      'Effect replaces try/catch, zod, and async/await boilerplate with one system that composes. It looks alien on first read — then you realize how much noise it deleted.',
    content: `I resisted [Effect](https://github.com/Effect-TS/effect) for months. The syntax looked alien. Generators instead of async/await? Pipe everywhere? Who writes TypeScript like that?

Then I used it on a real project and something clicked. Every piece of boilerplate I'd been copy-pasting for years — try/catch wrappers, zod schemas, manual error threading, retry logic — gone. Not hidden. *Gone.* Replaced by one composable system that types your errors, validates your boundaries, and never lets you forget to handle a failure.

## The try/catch noise is over

Here's what most TypeScript code looks like:

\`\`\`typescript
async function getUser(id: string) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) throw new Error('Fetch failed');
    const data = await response.json();
    return data;
  } catch (error) {
    // what even is this error? string? Error? unknown?
    console.error('Something went wrong', error);
    throw error;
  }
}
\`\`\`

You've written this a thousand times. The catch swallows type information. The error could be anything. If you call three functions that each throw, your catch is a graveyard of unknowns.

Effect makes errors *typed and tracked*:

\`\`\`typescript
import { Effect } from 'effect';

class FetchError { readonly _tag = 'FetchError'; }
class ParseError { readonly _tag = 'ParseError'; }

const getUser = (id: string) =>
  Effect.tryPromise({
    try: () => fetch(\`/api/users/\${id}\`).then(r => r.json()),
    catch: () => new FetchError(),
  });
\`\`\`

The return type *tells you* what can fail. No guessing. No \`unknown\`. The compiler tracks every error channel through your whole program.

## Schemas that replace zod — and do more

I loved zod. Then I used [Effect Schema](https://github.com/Effect-TS/effect/tree/main/packages/schema) and realized zod is half a solution. Effect Schema gives you validation *and* encoding *and* transformation in one declaration. You define the shape once and get a decoder, an encoder, a type guard, and a JSON Schema — all derived, all consistent.

\`\`\`typescript
import { Schema } from 'effect';

const User = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  createdAt: Schema.DateFromString,  // parses string → Date automatically
});

type User = typeof User.Type;  // inferred TypeScript type
\`\`\`

No more \`.parse()\` that throws. No more writing the type *and* the validator separately and hoping they don't drift. One source of truth, compile-time and runtime.

## yield > await

This is the one that looks weird until it saves you. Instead of \`async/await\`, Effect uses generators:

\`\`\`typescript
const program = Effect.gen(function* () {
  const user = yield* getUser('123');
  const posts = yield* getUserPosts(user.id);
  return { user, posts };
});
\`\`\`

Why? Because \`yield*\` composes with the type system in a way \`await\` never could. Each \`yield*\` propagates the error type upward. The final program's type signature tells you *every error* that can happen inside it — automatically, without you manually unioning anything.

With \`async/await\`, errors vanish into \`catch\`. With generators, errors *compose through the type system*. You get the same linear readability as async/await but with full error tracking.

## It removes boilerplate, not readability

Here's the thing people miss: Effect doesn't add complexity. It *moves* complexity from scattered try/catch blocks and ad-hoc error handling into one predictable system. Your code gets shorter. Your error handling gets explicit. Your types get honest.

The first time you look at an Effect program you think "this is over-engineered." The tenth time you think "why did I ever write \`catch (e: unknown)\` and pretend that was engineering?"

## My recommendation

If you're writing TypeScript that talks to the network, validates data, or handles errors (so… all TypeScript), look at Effect seriously. Start with [Effect.gen](https://effect.website/docs/getting-started/using-generators) and [Schema](https://effect.website/docs/schema/introduction). Give it a weekend. The syntax stops being weird in about two hours.

The repo: [github.com/Effect-TS/effect](https://github.com/Effect-TS/effect)
The docs: [effect.website](https://effect.website)

It's not a framework. It's the missing standard library TypeScript should have shipped with.`,
    coverImage: '/blog/effect-ts.png',
    category: 'engineering',
    tags: ['Effect', 'TypeScript', 'schemas', 'error handling', 'functional programming'],
    author: AUTHOR,
    publishedAt: '2026-07-05',
    readingTime: 4,
    featured: true,
  },
  {
    id: '12',
    slug: 'the-skill-that-writes-code-like-me',
    title: 'The skill that finally writes code like me',
    excerpt:
      'For two weeks I stopped writing code and started writing the thing that writes code. I brainstormed with the AI to build a skill that makes the AI write like me — then refined it prompt by prompt until it did.',
    content: `For the last two weeks I barely wrote code. I wrote the thing that writes code.

Let me explain, because it sounds backwards and it changed everything.

I ship for freelance clients and for myself. The bottleneck was never speed — an agent will hand me a thousand lines before I finish my coffee. The bottleneck was *taste*. The AI writes code that runs and looks nothing like mine. Nested ternaries. Silent catches. Twelve ways to declare the same route. Files I'd never sign my name to. So every session I'd generate fast, then spend the real time dragging the output back to how I actually write. Fast to generate, slow to trust. That's not productivity. That's babysitting.

So I tried something that felt stupid at first: instead of fixing the output, I sat down and *brainstormed with the AI about how to make the AI write better*. Not "write this feature." "Let's design a skill that interrogates how I build, writes it down, and then holds every future diff to it." I was using the model to sharpen the tool that sharpens the model.

## Prompt by prompt until it clicked

The first version was garbage. It asked lazy questions and wrote a bland style guide nobody would follow. Fine. I told it exactly where it was weak, and we went again. And again. Prompt to prompt, iteration to iteration, I refined that skill the same way you refine a person — point at the miss, explain the standard, watch it adjust. 

A few days in it stopped guessing and started *grilling* me. Arrow consts or function declarations? \`type\` or \`interface\`? Where does an error live — do you throw, or do you return a typed channel? It dragged the real rules out of my head and pinned them to the page. By the end it wasn't a prompt anymore. It was a skill I keep in my personal bag — [dufflebag](https://github.com/YosefHayim/dufflebag) — that any agent loads before it touches my code.

Now the loop is inverted. I don't clean up after the AI. The AI writes it my way the first time, because the standard ships *with* the assignment.

## The boring markdown files are the fuel

Here's the part that surprised me most. What makes this work isn't a clever prompt. It's a stack of unglamorous markdown files.

\`CONTEXT.md\` — the domain and the blueprint.
\`LANGUAGE.md\` — the exact words this project uses, so the code speaks one dialect.
\`CODE-STYLE.md\` — how code is *written* here, every rule with a ✓ chosen and a ✗ rejected.
\`PROJECT.md\` — what this thing is even for.

\`\`\`markdown
#### Arrow consts, never a function declaration · [taste]

// ✓ chosen
export const issueApiKey = (input: IssueApiKey) => Effect.gen(function* () {…});
// ✗ not this
export function issueApiKey(input) {…}
\`\`\`

Yes, it's a lot of files. Yes, writing them is a chore. But they're the difference between an agent that guesses and one that *knows*. Every rule I write down once is a mistake the AI never makes again. Vague task plus blind repo equals confident garbage. Sharp context plus a written standard equals code I'd ship. The markdown is where the quality is decided, long before a line is generated.

## I stopped reading code in the terminal

The other thing that quietly wrecked my flow: reading everything as flat text in a terminal. Monochrome scrollback, plans and diffs and reviews all the same grey. My eyes glaze, I skim, I miss things. It's exhausting and it's slow, and I read a *lot* of AI output now.

So I fixed that too. Plans and reviews render as a proper local HTML page — [planpage](https://github.com/YosefHayim/planpage) — clean templates, color-coded diffs, the decision I actually have to make sitting right there instead of buried in a wall of text. The eye reads structure in seconds what it reads out of a terminal in minutes. Same information. A tenth of the friction. It's calm to look at, so I actually *look*.

That's the whole shift of these two weeks. I moved my effort upstream — into the skill, the markdown, the way I read — and the code downstream started coming out right on its own.

Anyone can generate a thousand lines now. I spent two weeks making sure the thousand lines come out sounding like me. That's the part that turns a fast typist into a beast.`,
    coverImage: '/blog/write-like-me.png',
    category: 'engineering',
    tags: ['AI agents', 'skills', 'context engineering', 'developer tools', 'readability'],
    author: AUTHOR,
    publishedAt: '2026-07-06',
    readingTime: 4,
    featured: true,
  },
];

export const getFeaturedPosts = (): BlogPost[] => blogPosts.filter((post) => post.featured);

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  blogPosts.find((post) => post.slug === slug);

export const getPostsByCategory = (category: BlogCategory): BlogPost[] =>
  blogPosts.filter((post) => post.category === category);

export const getRecentPosts = (limit = 3): BlogPost[] =>
  [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);

export const getAllCategories = (): BlogCategory[] => [
  ...new Set(blogPosts.map((post) => post.category)),
];

export const getAllTags = (): string[] => [...new Set(blogPosts.flatMap((post) => post.tags))];
