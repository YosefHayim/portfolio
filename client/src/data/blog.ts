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

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'from-idf-commander-to-software-engineer',
    title: 'From IDF Commander to Software Engineer: My Unconventional Path',
    excerpt:
      'How military leadership, discipline, and problem-solving shaped my approach to software engineering. The story of pivoting careers and finding my passion in code.',
    content: `
# From IDF Commander to Software Engineer

When people ask about my background, they're often surprised to learn I spent three years as an Infantry Commander in the IDF before touching my first line of code. But looking back, that experience shaped everything about how I approach software engineering.

## The Military Foundation

During my service in Gdud 931, I learned three things that still guide me today:

**1. Discipline Under Pressure**
In combat operations, there's no room for "I'll figure it out later." Every decision matters, every detail counts. This translates directly to writing clean, maintainable code and handling production incidents with a cool head.

**2. Leading by Example**
I earned two Excellence Awards not by telling people what to do, but by being the first to tackle the hardest tasks. In software teams, I apply the same principle - I won't ask anyone to work on something I wouldn't dig into myself.

**3. Rapid Problem-Solving**
Tactical situations change in seconds. You gather information, make a decision, and adapt. Sound familiar? That's exactly what debugging is.

## The Pivot

After my service, I found myself working at an insurance company in Holon. The job was fine, but I noticed something: there was this manual process that took hours every week. With zero coding knowledge, I opened ChatGPT and started asking questions.

That first Python script I built to automate data extraction was terrible by any standard. But it worked. And more importantly, it saved the company hours of manual work.

That feeling - of building something that solves a real problem - that's when I knew.

## The Grind

I enrolled in IITC's 795-hour Full Stack Development program. Coming from a non-technical background, the learning curve was steep. But here's the thing about military training: you learn that discomfort is just part of the process.

I graduated with Excellence. Not because I was the most talented in the room, but because I treated every assignment like a mission. Every bug like an obstacle to overcome. Every new concept like a skill to master.

## The Philosophy

Today, as a Software Developer at Predicto AI, I still approach every day with the same mindset:

**"Turning ideas into products people love."**

It's not about being the best. It's about being better than yesterday. Whether that's learning a new TypeScript pattern, optimizing a database query, or building a side project that pushes my limits.

## To Anyone Making a Career Pivot

If you're considering switching to tech from a completely different field, here's what I'll tell you:

Your "unrelated" experience isn't a liability - it's your superpower. The discipline, the work ethic, the unique perspective you bring - that's what will set you apart in an industry full of people who all learned the same way.

The path isn't always conventional. But sometimes, the unconventional path is exactly the one you were meant to take.

---

*If you're on a similar journey and want to connect, feel free to reach out. I'm always happy to share what I've learned along the way.*
 `,
    coverImage: '/images-of-me/desktop-view.svg',
    category: 'career',
    tags: ['career change', 'IDF', 'software engineering', 'journey'],
    author: {
      name: 'Joseph Sabag',
      avatar: '/images-of-me/hero-image.svg',
    },
    publishedAt: '2025-01-15',
    readingTime: 6,
    featured: true,
  },
  {
    id: '2',
    slug: 'building-ebay-mcp-server-lessons-learned',
    title: 'Building an Open Source MCP Server: 387 Tools for eBay APIs',
    excerpt:
      'Deep dive into building my most ambitious open source project - a Model Context Protocol server with 100% eBay API coverage. Architecture decisions, testing strategies, and lessons learned.',
    content: `
# Building the eBay MCP Server

When I set out to build the eBay MCP API Server, I had a simple goal: give AI assistants comprehensive access to eBay's selling capabilities. What started as a weekend project turned into my most ambitious open source contribution - 387 tools across 270 endpoints with 958+ tests.

## Why MCP?

The Model Context Protocol is changing how AI assistants interact with external services. Instead of relying on generic API calls, MCP provides a standardized way for AI to discover and use tools intelligently.

For eBay sellers, this means being able to ask Claude or Cursor things like "List my top-selling items this month" or "Update inventory for SKU-123" and have it just work.

## The Architecture

Here's the high-level structure I landed on:

\`\`\`
ebay-mcp/
├── src/
│ ├── tools/ # 387 tool implementations
│ ├── auth/ # OAuth 2.0 handling
│ ├── validation/ # Zod schemas
│ └── utils/ # Shared utilities
├── tests/ # 958+ test cases
└── docs/ # API documentation
\`\`\`

### Key Decisions

**1. TypeScript All The Way**
Every tool, every response, every edge case is typed. This caught countless bugs during development and makes the codebase maintainable.

**2. Zod for Validation**
Runtime validation isn't optional when you're dealing with external APIs. Zod schemas ensure we catch invalid data before it causes problems.

**3. Test Everything**
958+ tests might seem like overkill. It's not. When you're building something that sellers rely on for their business, you need confidence that updates won't break things.

## Challenges

**OAuth Token Management**
eBay's OAuth flow is complex. I built automatic token refresh that handles edge cases like network failures and expired credentials gracefully.

**API Consistency**
eBay has 270 endpoints across different API versions. Making them work consistently through MCP required careful abstraction.

**Documentation**
Good tools need good docs. Every single tool has clear descriptions, parameter explanations, and example usage.

## What I Learned

1. **Start with the hard parts** - OAuth was the scariest piece. Tackling it first meant everything else was easier.

2. **Tests are documentation** - When someone wants to understand how a tool works, the tests show exactly what inputs produce what outputs.

3. **Open source is a commitment** - Once people depend on your project, you need to maintain it. I've set up CI/CD to ensure quality stays high.

## What's Next

The server now supports 9 AI clients including Claude Desktop, Cursor, and Zed. I'm working on:

- Better error messages for common seller mistakes
- Batch operations for inventory management
- Analytics dashboards integration

## Try It Out

The project is live on npm:

\`\`\`bash
npm install ebay-mcp
\`\`\`

Check out the [GitHub repo](https://github.com/YosefHayim/ebay-mcp) for full documentation.

---

*Building developer tools is a different beast than building user-facing products. The satisfaction of seeing other developers use something you built is hard to describe. If you're considering contributing to open source, I can't recommend it enough.*
 `,
    coverImage: '/screenshots/ebay-mcp.png',
    category: 'projects',
    tags: ['open source', 'MCP', 'TypeScript', 'eBay API', 'AI tools'],
    author: {
      name: 'Joseph Sabag',
      avatar: '/images-of-me/hero-image.svg',
    },
    publishedAt: '2025-01-10',
    readingTime: 8,
    featured: true,
  },
  {
    id: '3',
    slug: 'why-i-build-browser-extensions',
    title: 'Why I Build Browser Extensions (And You Should Too)',
    excerpt:
      "Browser extensions are the perfect side project. Small scope, immediate feedback, real users. Here's why I've built 3 of them and what I've learned along the way.",
    content: `
# Why Browser Extensions?

I've shipped three browser extensions now - Sora Auto Queue, AI Conversation Navigator, and Gemini Nano Flow. Each one taught me something different about building products that people actually use.

## The Perfect Side Project Scope

Here's the thing about side projects: most of them die. Not because the idea is bad, but because the scope is too big. You get excited, start building, and three months later you're burnt out with nothing to show.

Browser extensions are different:

- **Clear constraints** - You're working within a defined API
- **Small surface area** - Most extensions do one thing well
- **Immediate feedback** - Install it, use it, iterate

## What I Built

### Sora Auto Queue
The first extension came from my own frustration. I was using AI tools heavily and kept wishing I could queue up prompts. So I built it.

Features I'm proud of:
- Completely redesigned UI in v2.0.0
- E2E testing with Playwright
- CI/CD with GitHub Actions

### AI Conversation Navigator
This one adds advanced navigation to ChatGPT, Claude, and Gemini. The challenging part was making it work consistently across three different platforms that change their DOM frequently.

Key learning: **90%+ test coverage isn't paranoia when platforms update without notice.**

### Gemini Nano Flow
The newest addition, focusing on streamlined Gemini workflows. Still in active development, but already live on the Chrome Web Store.

## Technical Lessons

**1. DOM is a moving target**
These AI platforms update their interfaces constantly. Build your selectors to be resilient, and test often.

**2. Manifest V3 is the future**
Chrome is phasing out V2. Learn V3 now and save yourself migration headaches later.

**3. Cross-browser support matters**
Chrome and Firefox have enough API differences to cause bugs. Test on both.

## Why You Should Try It

If you've never built an extension, here's my challenge to you:

1. Think of one small annoyance in your daily browsing
2. Spend one weekend building a solution
3. Publish it to the Chrome Web Store

The process of going from idea to published product - even a tiny one - teaches you more than months of tutorial following.

Plus, there's something magical about seeing "X users" on your extension page. Real people, using something you built to solve a problem they have.

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [WXT Framework](https://wxt.dev/) - What I use for modern extension development
- My extensions on the Chrome Web Store (links in projects page)

---

*The best project is one you'll actually finish. Browser extensions have the right constraints to make that happen.*
 `,
    coverImage: '/screenshots/sora-extension.png',
    category: 'engineering',
    tags: ['browser extensions', 'Chrome', 'side projects', 'WXT'],
    author: {
      name: 'Joseph Sabag',
      avatar: '/images-of-me/hero-image.svg',
    },
    publishedAt: '2025-01-05',
    readingTime: 5,
  },
  {
    id: '4',
    slug: 'chatgpt-taught-me-to-code',
    title: "ChatGPT Taught Me to Code (And That's Okay)",
    excerpt:
      "I built my first automation scripts by asking ChatGPT questions. Here's why AI-assisted learning is valid and how to do it right.",
    content: `
# ChatGPT Taught Me to Code

There's a certain gatekeeping in tech that says you need to learn everything from scratch. Start with fundamentals. Don't copy code. Understand every line.

I'm going to push back on that a bit.

## My Story

When I was working at that insurance company, I had zero programming experience. I saw a problem - manual data extraction that took hours - and I wanted to solve it.

I opened ChatGPT and asked: "How do I write a Python script to extract data from a website?"

Over the next few weeks, through hundreds of questions and iterations, I built working automation that saved real hours of real work. Was my code elegant? No. Did I understand every concept? No. Did it work and provide value? Absolutely.

## The Critics

I've seen the takes online:
- "AI-generated code creates developers who can't think"
- "You need to understand fundamentals first"
- "Copilot is making programmers lazy"

Here's my counter: **The goal is solving problems, not passing purity tests.**

## How to Learn with AI Right

That said, there's a difference between using AI as a learning accelerator and using it as a crutch.

### Do This:
- Ask "why" after every answer
- Try to predict what the AI will say before you ask
- Intentionally break the code to understand how it works
- Move beyond tutorials to your own projects

### Avoid This:
- Copy-pasting without reading
- Accepting the first answer without questioning
- Never writing code from memory
- Staying at the same level forever

## The Real Skill

The engineers I respect most aren't the ones who memorized every algorithm. They're the ones who can:

1. Identify the actual problem
2. Know what questions to ask
3. Evaluate solutions critically
4. Ship working software

AI accelerates all of these. It doesn't replace them.

## Where I Am Now

Today, I can write TypeScript, React, Node.js, and Python without AI assistance. I understand the concepts. I can debug complex issues. I contribute to open source projects with hundreds of stars.

The fundamentals came - but they came through building things, not through gatekept traditional learning paths.

## My Advice

If you're learning to code in 2025:

1. **Use AI tools liberally** - They're the most patient teachers you'll ever have
2. **Build real projects** - Tutorials are where learning begins, not ends
3. **Don't let gatekeepers slow you down** - Your path is valid
4. **Stay curious** - Keep asking "why" until you truly understand

The tools have changed. The goal hasn't. Build things that matter.

---

*This isn't a defense of not learning fundamentals. It's a defense of using every tool available to get there faster.*
 `,
    coverImage: '/screenshots/auto-bay-saas.png',
    category: 'thoughts',
    tags: ['AI learning', 'ChatGPT', 'career advice', 'self-taught'],
    author: {
      name: 'Joseph Sabag',
      avatar: '/images-of-me/hero-image.svg',
    },
    publishedAt: '2024-12-20',
    readingTime: 5,
  },
  {
    id: '5',
    slug: 'building-trading-bots-with-zero-experience',
    title: 'Building Trading Bots With Zero Coding Experience',
    excerpt:
      'How I went from knowing nothing about programming to building automated trading systems for stocks and crypto. A story of curiosity, iteration, and a lot of 3am debugging sessions.',
    content: `
# Trading Bots: Where It All Started

Before the browser extensions. Before the full-stack bootcamp. Before Predicto AI. There were trading bots.

## The Origin

I was interested in trading but didn't have time to watch charts all day. The idea of automated trading seemed like science fiction - something only hedge funds could do.

Then I discovered you could access trading APIs programmatically.

Armed with nothing but curiosity and ChatGPT, I started building.

## The First Bot

My first crypto bot used Binance's API. The strategy was simple: RSI-based entries and exits.

\`\`\`python
# My actual first working code (don't judge)
if rsi < 30:
 buy()
elif rsi > 70:
 sell()
\`\`\`

Was it sophisticated? No. Did it lose money initially? Yes. But it ran. Automatically. Making decisions while I slept.

## Leveling Up

Over months, I built more complex systems:

**Stock Trading (Interactive Brokers)**
- MACD + RSI combination strategies
- Wyckoff pattern detection
- Telegram notifications for trades

**Crypto Trading (Binance)**
- Multiple timeframe analysis
- Risk management rules
- Portfolio balancing

## What I Learned

### 1. APIs Are Powerful
The ability to interact with financial systems programmatically opened my eyes to what's possible with code. Every platform you use probably has an API.

### 2. Testing is Everything
When real money is on the line, you learn to test thoroughly. Backtesting, paper trading, then small real trades. This discipline carried over to all my future development.

### 3. Failure is Data
My bots lost money. A lot at first. But each loss was information about what didn't work. The bots got better because I tracked and analyzed every trade.

### 4. Automation Compounds
A bot doesn't get tired. It doesn't get emotional. It executes consistently 24/7. The power of automation became crystal clear.

## The Bigger Picture

These bots were never about getting rich. They were about proving to myself that I could build things.

That proof of concept led to:
- Confidence to tackle bigger projects
- Understanding of APIs and automation
- Foundation for my bootcamp journey
- Eventual career in software engineering

## Should You Build Trading Bots?

If you're interested in programming and finance, yes. But understand:

- Start with paper trading (fake money)
- Accept that you'll lose some real money learning
- The code skills matter more than the profits
- Don't bet money you can't afford to lose

## Code Is Still Running

Some of those original bots, refined over time, still run today. They're not my main focus anymore, but they're a reminder of where this all started.

Sometimes the best way to learn is to build something you actually care about. For me, that was trying to automate away the tedious parts of trading.

---

*The projects that teach you the most are often the ones that seem slightly crazy when you start them.*
 `,
    coverImage: '/screenshots/binance.png',
    category: 'projects',
    tags: ['trading bots', 'Python', 'automation', 'Binance', 'APIs'],
    author: {
      name: 'Joseph Sabag',
      avatar: '/images-of-me/hero-image.svg',
    },
    publishedAt: '2024-12-10',
    readingTime: 6,
  },
  {
    id: '6',
    slug: 'react-native-first-mobile-app',
    title: 'Building My First React Native App: Lessons from Get Barber',
    excerpt:
      "Transitioning from web to mobile development with React Native and Expo. What surprised me, what frustrated me, and what I'd do differently.",
    content: `
# From Web to Mobile

After building web apps for over a year, I finally took the plunge into mobile development. The project: Get Barber, a barber booking app built with React Native and Expo.

## Why React Native?

The decision was practical:
- I already knew React
- Cross-platform from day one
- Expo makes deployment painless
- Large ecosystem and community

## The Surprises

### 1. Styling is Different (But Familiar)
No CSS files. Everything is StyleSheet or inline styles. But coming from Tailwind, NativeWind felt right at home.

\`\`\`javascript
// NativeWind makes this possible
<View className="flex-1 bg-black p-2">
 <Text className="text-white text-xl font-bold">
 Hello Mobile
 </Text>
</View>
\`\`\`

### 2. Navigation is Complex
React Router on web is simple. React Navigation has more concepts - stacks, tabs, drawers. Expo Router simplified this significantly.

### 3. Platform Differences Are Real
iOS and Android handle things differently. Keyboard behavior, status bars, safe areas - you can't ignore these.

## The Tech Stack

- **Expo** - Build tooling and development
- **Expo Router** - File-based routing
- **NativeWind** - Tailwind for React Native
- **Supabase** - Backend and auth
- **TanStack Query** - Data fetching
- **Zustand** - State management
- **React Native Maps** - Location features

## What I'd Do Differently

1. **Start with Expo from day one** - I initially tried bare React Native. Don't.
2. **Design mobile-first** - Web thinking doesn't translate directly
3. **Test on real devices early** - Simulators lie

## The Result

Get Barber now has:
- Real-time appointment booking
- Location-based barber discovery
- Apple authentication
- Push notifications

## Should You Learn React Native?

If you know React, the barrier is lower than you think. The hardest part isn't the technology - it's thinking in mobile patterns.

Start with a small project. Use Expo. Ship something.

---

*Mobile development opened up a whole new world of possibilities. The skills transfer more than you'd expect.*
 `,
    coverImage: '/screenshots/get-barber.png',
    category: 'tutorials',
    tags: ['React Native', 'Expo', 'mobile development', 'NativeWind'],
    author: {
      name: 'Joseph Sabag',
      avatar: '/images-of-me/hero-image.svg',
    },
    publishedAt: '2024-11-28',
    readingTime: 7,
  },
  {
    id: '7',
    slug: 'mcp-protocol-future-of-ai-tools',
    title: 'The MCP Protocol: Why I Built Two MCP Servers',
    excerpt:
      "Model Context Protocol is changing how AI assistants interact with the world. Here's why I went all-in on building MCP servers.",
    content: `
# The Rise of MCP

When Anthropic released the Model Context Protocol, I immediately saw the potential. This wasn't just another API standard - it was a way to give AI assistants real capabilities.

## What is MCP?

In simple terms: MCP lets AI assistants use tools. Instead of just generating text, Claude can now:
- Search databases
- Call APIs
- Read files
- Execute actions

## Why I Built Two MCP Servers

### 1. eBay MCP Server
387 tools for eBay's selling APIs. Sellers can now ask their AI assistant to manage inventory, track orders, run marketing campaigns - all through natural language.

### 2. Chrome Extension API Reference MCP
This one helps AI assistants write better Chrome extensions. Instead of hallucinating API details, they can look up the actual documentation.

## The Architecture Pattern

Both servers follow similar patterns:

\`\`\`typescript
// Tool definition
const tool = {
 name: "get_inventory_item",
 description: "Retrieves inventory item by SKU",
 inputSchema: z.object({
 sku: z.string()
 }),
 handler: async (input) => {
 // API call
 return result;
 }
};
\`\`\`

## Key Learnings

### 1. Documentation is Everything
AI assistants need to understand when and how to use each tool. Vague descriptions lead to misuse.

### 2. Error Handling Matters More
When a human uses an API, they can interpret error messages. AI needs structured, clear error responses.

### 3. Test Coverage is Non-Negotiable
The eBay MCP has 958+ tests. When you're building something AI will use autonomously, you need confidence.

## The Future

MCP is still early. But I believe this pattern - giving AI assistants access to real tools - is how we'll interact with software in the future.

Instead of learning 100 different UIs, you'll just ask your AI assistant to handle it.

## Getting Started with MCP

If you want to build your own MCP server:

1. Start with the [MCP SDK](https://github.com/modelcontextprotocol/sdk)
2. Pick an API you know well
3. Build incrementally - start with 5 tools, not 50
4. Write tests for every tool
5. Document extensively

---

*The best time to learn MCP was when it launched. The second best time is now.*
 `,
    coverImage: '/screenshots/chrome-extension-mcp.png',
    category: 'engineering',
    tags: ['MCP', 'AI tools', 'TypeScript', 'open source'],
    author: {
      name: 'Joseph Sabag',
      avatar: '/images-of-me/hero-image.svg',
    },
    publishedAt: '2024-11-15',
    readingTime: 6,
    featured: true,
  },
  {
    id: '8',
    slug: 'from-zero-to-predicto-ai',
    title: 'Landing My First Dev Job: From Bootcamp to Predicto AI',
    excerpt:
      'The job search, the interviews, the rejections, and finally the offer. An honest look at breaking into tech in 2024.',
    content: `
# The Job Hunt Reality

Let me be honest: the job search was brutal. Here's what actually happened between finishing my bootcamp and starting at Predicto AI.

## The Numbers

- **Applications sent**: 150+
- **Responses received**: ~30
- **Technical interviews**: 12
- **Final round interviews**: 4
- **Offers**: 1

Those numbers aren't pretty. But they're real.

## What Didn't Work

### Mass Applying
Sending generic applications to every job posting was a waste of time. Maybe 2% response rate.

### Focusing Only on Big Companies
The competition for entry-level roles at established companies is fierce. Hundreds of applicants per position.

### Underselling My Background
I initially downplayed my military experience and trading bot projects. Mistake.

## What Actually Worked

### 1. Building in Public
My GitHub was active. Real projects, not just tutorial clones. When recruiters looked, they saw:
- The eBay MCP server
- Browser extensions
- Full-stack applications

### 2. The "Different" Background
Turns out, "IDF commander who taught himself Python to build trading bots" is memorable. It became my story.

### 3. Targeting Startups
Startups care less about years of experience and more about:
- Can you ship?
- Will you learn fast?
- Do you have initiative?

I could demonstrate all three.

### 4. Networking (The Real Kind)
Not LinkedIn spam. Actually talking to developers, attending meetups, engaging in communities. One conversation led to the Predicto AI opportunity.

## The Predicto AI Interview

The interview process:
1. Initial call - culture fit, background discussion
2. Technical assessment - take-home project
3. Technical interview - code review and system design
4. Final conversation with founders

The take-home was building a feature I actually found interesting. I over-delivered - not because I was trying to impress, but because I was genuinely curious.

## Lessons for Job Seekers

**1. Quality over quantity**
5 thoughtful applications beat 50 generic ones.

**2. Build things you'd actually use**
Passion shows. If you're bored building it, interviewers will be bored hearing about it.

**3. Your "weakness" might be your strength**
Non-traditional background? That's differentiation.

**4. Keep building during the search**
Every week without a job is a week to add to your portfolio.

**5. It only takes one yes**
150 rejections don't matter if application 151 is the one.

---

*The job search tested my resilience more than the bootcamp did. But every rejection was just data pointing me toward the right opportunity.*
 `,
    coverImage: '/screenshots/ally-ai-calendar.png',
    category: 'career',
    tags: ['job search', 'career advice', 'interviews', 'bootcamp'],
    author: {
      name: 'Joseph Sabag',
      avatar: '/images-of-me/hero-image.svg',
    },
    publishedAt: '2024-11-01',
    readingTime: 7,
  },
  {
    id: '9',
    slug: 'supabase-vs-firebase-real-experience',
    title: 'Supabase vs Firebase: My Real-World Experience',
    excerpt:
      "After using both extensively in production projects, here's my honest comparison of Supabase and Firebase for full-stack applications.",
    content: `
# The Backend-as-a-Service Decision

Every new project starts with the same question: what's the backend going to be?

I've shipped projects with both Supabase and Firebase. Here's what I actually experienced.

## Projects Built

**With Firebase:**
- AutoBay SaaS platform
- Early trading bot dashboards

**With Supabase:**
- Ally AI Calendar
- Get Barber mobile app
- Facebook Lead AI Extension

## The Comparison

### Authentication

**Firebase Auth**
- More providers out of the box
- Better documentation
- Google integration is seamless (obviously)

**Supabase Auth**
- Simpler API
- Row Level Security integration
- Better for Postgres-centric apps

**Winner**: Tie - depends on your needs

### Database

**Firebase (Firestore)**
- NoSQL - flexible schema
- Real-time by default
- Pricing can surprise you at scale

**Supabase (PostgreSQL)**
- SQL - structured and powerful
- Real-time as an option
- Predictable pricing

**Winner**: Supabase - PostgreSQL is just more capable

### Real-time

**Firebase**
- Built into the core product
- Works great, just expensive

**Supabase**
- Requires explicit subscription
- More control, less magic

**Winner**: Firebase for simplicity, Supabase for control

### Developer Experience

**Firebase**
- Mature tooling
- Sometimes feels heavy
- Google Cloud integration

**Supabase**
- Modern, clean dashboard
- Open source
- SQL is a superpower

**Winner**: Supabase

## When I Choose What

**Choose Firebase when:**
- Deep Google Cloud integration needed
- Team is already familiar with it
- NoSQL fits your data model

**Choose Supabase when:**
- You want PostgreSQL power
- Budget is a concern
- You prefer open source
- Row Level Security is important

## The Real Answer

For my personal projects now, I default to Supabase. The PostgreSQL foundation means I'm not fighting the database - I'm working with it.

But Firebase isn't bad. It's just different. The right choice depends on your project, your team, and your preferences.

## Code Comparison

**Supabase query:**
\`\`\`typescript
const { data, error } = await supabase
 .from('appointments')
 .select('*, barber:barbers(*)')
 .eq('user_id', userId)
 .order('date', { ascending: true });
\`\`\`

**Firebase query:**
\`\`\`typescript
const snapshot = await db.collection('appointments')
 .where('userId', '==', userId)
 .orderBy('date')
 .get();
const data = snapshot.docs.map(doc => doc.data());
\`\`\`

Both work. Supabase feels more like writing SQL (because it is).

---

*Don't overthink the BaaS decision. Pick one, learn it well, and ship. You can always migrate later (though you probably won't).*
 `,
    coverImage: '/screenshots/facebook-lead-ai.png',
    category: 'tutorials',
    tags: ['Supabase', 'Firebase', 'backend', 'comparison'],
    author: {
      name: 'Joseph Sabag',
      avatar: '/images-of-me/hero-image.svg',
    },
    publishedAt: '2024-10-20',
    readingTime: 6,
  },
  {
    id: '10',
    slug: 'ai-assisted-development-workflow',
    title: 'My AI-Assisted Development Workflow in 2025',
    excerpt:
      'How I use Claude, Cursor, and custom MCP servers to ship code faster. A practical guide to AI pair programming.',
    content: `
# The New Development Reality

I write more code than ever, but I type less. Here's how AI has changed my development workflow.

## The Tools

### Claude (via API and Claude Code)
My thinking partner. Architecture decisions, code review, debugging complex issues.

### Cursor
Daily driver IDE. Tab completion that actually understands context.

### Custom MCP Servers
My eBay MCP and Chrome Extension API MCP give Claude access to real documentation and APIs.

## The Workflow

### 1. Planning Phase
Before writing code, I discuss architecture with Claude:

\`\`\`
"I need to build a queue system for prompt submissions.
Users should be able to add, reorder, and remove prompts.
It needs to persist across sessions.
What patterns would you suggest?"
\`\`\`

Claude suggests options, I evaluate trade-offs, we refine together.

### 2. Implementation Phase
In Cursor, I write the skeleton and let AI fill in the details:

\`\`\`typescript
// I write this
function processQueue(queue: Prompt[]): void {
 // Process each prompt in order
 // Handle errors gracefully
 // Update progress state
}

// AI completes the implementation
\`\`\`

### 3. Review Phase
After a feature is complete, I ask Claude to review:

\`\`\`
"Review this code for:
- Edge cases I might have missed
- Performance issues
- Security concerns
- Better patterns"
\`\`\`

### 4. Documentation Phase
AI generates first drafts of documentation that I refine.

## What AI Is Good At

- Boilerplate code
- Remembering syntax details
- Exploring API options
- Catching obvious bugs
- Explaining unfamiliar code

## What AI Is Bad At

- Understanding full system context
- Making product decisions
- Knowing your codebase conventions
- Catching subtle business logic errors

## The 80/20 Rule

AI handles ~80% of the mechanical work. The remaining 20% - architecture, decisions, reviews - still requires human judgment.

That 20% is also where the value is.

## Practical Tips

### 1. Be Specific
Bad: "Write a function to handle users"
Good: "Write a TypeScript function that validates user input against this Zod schema and returns typed errors"

### 2. Provide Context
Share relevant code, explain constraints, describe the system.

### 3. Verify Everything
AI makes confident mistakes. Always read the generated code.

### 4. Learn the Patterns
Over time, you'll know what prompts work best. Build that intuition.

## The Controversial Take

Using AI doesn't make you a worse developer. It makes you a more productive one.

The developers who resist AI tools will write less code, ship slower, and eventually wonder why they're being left behind.

---

*The question isn't whether to use AI in development. It's how to use it effectively.*
 `,
    coverImage: '/screenshots/vision-agent-mas.png',
    category: 'engineering',
    tags: ['AI', 'productivity', 'Cursor', 'Claude', 'workflow'],
    author: {
      name: 'Joseph Sabag',
      avatar: '/images-of-me/hero-image.svg',
    },
    publishedAt: '2024-10-05',
    readingTime: 8,
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
