/** Authored JTS service card. */
export type ServiceItem = {
  id: string;
  index: string;
  title: string;
  description: string;
};

/** Featured product/project card on the work surface. */
export type ProjectItem = {
  id: string;
  name: string;
  blurb: string;
  image: string;
  secondaryImage?: string;
  href?: string;
  tag: string;
};

/** Studio process step. */
export type ProcessStep = {
  id: string;
  index: string;
  title: string;
  description: string;
};

/** Glass 3D stack mark under public/images-of-me/. */
export type TechStackItem = {
  id: string;
  label: string;
  icon: string;
};

/** Floating constellation tile in the hero. */
export type ConstellationTile = {
  id: string;
  src: string;
  alt: string;
  className: string;
  rotate: number;
  floatDelay: number;
  isCharacter: boolean;
};

export const brand = {
  name: 'Joseph Tech Solutions',
  short: 'JTS',
  tagline: 'We build the hard middle.',
  email: 'yosefisabag@gmail.com',
  founder: 'Joseph Sabag',
  role: 'Founder · Builder',
  since: '2020',
  github: 'https://github.com/YosefHayim',
  linkedin: 'https://www.linkedin.com/in/yosef-hayim-sabag/',
} as const;

export const navLinks = [
  { id: 'work', label: 'Work', href: '#work' },
  { id: 'github', label: 'GitHub', href: '#github' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'journal', label: 'Journal', href: '/blog' },
  { id: 'studio', label: 'Studio', href: '#studio' },
  { id: 'contact', label: 'Contact', href: '#contact' },
] as const;

export const services: ServiceItem[] = [
  {
    id: 'ai',
    index: '01',
    title: 'AI products',
    description:
      'Assistants, agent workflows, and model-backed features that hold up past the demo — in production.',
  },
  {
    id: 'web',
    index: '02',
    title: 'Full-stack web',
    description:
      'Apps, dashboards, and APIs with real auth, data, billing rails, and deploy paths you can keep shipping.',
  },
  {
    id: 'automation',
    index: '03',
    title: 'Automation & ops',
    description:
      'Internal tools, browser extensions, and integrations that remove manual work without creating new chaos.',
  },
  {
    id: 'rescue',
    index: '04',
    title: 'Product rescue',
    description:
      'Half-shipped builds, stuck payments, brittle AI flows — we stabilize the middle and get you live.',
  },
];

export const projects: ProjectItem[] = [
  {
    id: 'ebay-mcp',
    name: 'eBay MCP',
    blurb: '387 tools. 270 endpoints. One local MCP server for real seller ops.',
    image: 'screenshots/ebay-mcp.webp',
    tag: 'AI infra',
    href: 'https://www.npmjs.com/package/ebay-mcp',
  },
  {
    id: 'autobay',
    name: 'AutoBay',
    blurb: 'Amazon → eBay dropshipping SaaS with the boring hard parts wired.',
    image: 'screenshots/auto-bay-saas.webp',
    tag: 'SaaS',
  },
  {
    id: 'sora',
    name: 'Sora Queue',
    blurb: 'Bulk prompt queues for video generation — extension that ships work.',
    image: 'screenshots/sora-extension.webp',
    secondaryImage: 'screenshots/ai-navigator-extension.webp',
    tag: 'Extension',
  },
  {
    id: 'tim',
    name: 'Tim Trailers',
    blurb: 'Production-facing product work for a real client catalog.',
    image: 'screenshots/tim-trailer.webp',
    tag: 'Client',
  },
  {
    id: 'ally',
    name: 'Ally AI',
    blurb: 'Calendar intelligence for teams that need less admin, more signal.',
    image: 'screenshots/ally-ai-calendar.webp',
    tag: 'AI product',
  },
  {
    id: 'momtool',
    name: 'MomTool',
    blurb: 'Practical tooling for real family ops — not a pitch deck app.',
    image: 'screenshots/MomTool.webp',
    tag: 'Product',
  },
];

/** Core stack shown as glass 3D marks — keep in sync with stack-*-3d.webp assets. */
export const techStack: TechStackItem[] = [
  // Languages & runtimes
  { id: 'typescript', label: 'TypeScript', icon: 'images-of-me/stack-typescript-3d.webp' },
  { id: 'javascript', label: 'JavaScript', icon: 'images-of-me/stack-javascript-3d.webp' },
  { id: 'python', label: 'Python', icon: 'images-of-me/stack-python-3d.webp' },
  { id: 'nodejs', label: 'Node.js', icon: 'images-of-me/stack-nodejs-3d.webp' },
  // Frameworks & UI
  { id: 'react', label: 'React', icon: 'images-of-me/stack-react-3d.webp' },
  { id: 'nextjs', label: 'Next.js', icon: 'images-of-me/stack-nextjs-3d.webp' },
  { id: 'vite', label: 'Vite', icon: 'images-of-me/stack-vite-3d.webp' },
  { id: 'expo', label: 'Expo', icon: 'images-of-me/stack-expo-3d.webp' },
  { id: 'tailwind', label: 'Tailwind CSS', icon: 'images-of-me/stack-tailwind-3d.webp' },
  { id: 'effect', label: 'Effect', icon: 'images-of-me/stack-effect-3d.webp' },
  { id: 'express', label: 'Express', icon: 'images-of-me/stack-express-3d.webp' },
  // Data
  { id: 'postgresql', label: 'PostgreSQL', icon: 'images-of-me/stack-postgresql-3d.webp' },
  { id: 'mongodb', label: 'MongoDB', icon: 'images-of-me/stack-mongodb-3d.webp' },
  { id: 'redis', label: 'Redis', icon: 'images-of-me/stack-redis-3d.webp' },
  { id: 'firebase', label: 'Firebase', icon: 'images-of-me/stack-firebase-3d.webp' },
  // Platform & ship
  { id: 'docker', label: 'Docker', icon: 'images-of-me/stack-docker-3d.webp' },
  { id: 'vercel', label: 'Vercel', icon: 'images-of-me/stack-vercel-3d.webp' },
  { id: 'cloudflare', label: 'Cloudflare', icon: 'images-of-me/stack-cloudflare-3d.webp' },
  { id: 'aws', label: 'AWS', icon: 'images-of-me/stack-aws-3d.webp' },
  { id: 'stripe', label: 'Stripe', icon: 'images-of-me/stack-stripe-3d.webp' },
  { id: 'chrome', label: 'Chrome', icon: 'images-of-me/stack-chrome-3d.webp' },
  // Automation & agents
  { id: 'mcp', label: 'MCP', icon: 'images-of-me/stack-mcp-3d.webp' },
  { id: 'playwright', label: 'Playwright', icon: 'images-of-me/stack-playwright-3d.webp' },
  { id: 'selenium', label: 'Selenium', icon: 'images-of-me/stack-selenium-3d.webp' },
  { id: 'openai', label: 'OpenAI', icon: 'images-of-me/stack-openai-3d.webp' },
  { id: 'claude', label: 'Claude', icon: 'images-of-me/stack-claude-3d.webp' },
  { id: 'gemini', label: 'Gemini', icon: 'images-of-me/stack-gemini-3d.webp' },
  { id: 'grok', label: 'Grok', icon: 'images-of-me/stack-grok-3d.webp' },
  { id: 'cursor', label: 'Cursor', icon: 'images-of-me/stack-cursor-3d.webp' },
  { id: 'kiro', label: 'Kiro', icon: 'images-of-me/stack-kiro-3d.webp' },
  { id: 'kimi', label: 'Kimi', icon: 'images-of-me/stack-kimi-3d.webp' },
  { id: 'devin', label: 'Devin', icon: 'images-of-me/stack-devin-3d.webp' },
];

export const processSteps: ProcessStep[] = [
  {
    id: 'discover',
    index: '01',
    title: 'Discover',
    description: 'Name the stuck point. Users, payments, data, or AI that only works in a demo.',
  },
  {
    id: 'scope',
    index: '02',
    title: 'Scope',
    description: 'Fixed rails for the build — what ships, what waits, what is not promised.',
  },
  {
    id: 'ship',
    index: '03',
    title: 'Ship',
    description: 'Production paths first. Auth, data, deploy, and the flows people actually use.',
  },
  {
    id: 'iterate',
    index: '04',
    title: 'Iterate',
    description: 'Keep the same base. No rewrite theater after go-live.',
  },
];

export const realityPoints = [
  {
    index: '01',
    title: 'Users and data?',
    body: 'Who signs in, what is stored, who can see what.',
  },
  {
    index: '02',
    title: 'Payments done right?',
    body: 'Checkout, webhooks, access after pay.',
  },
  {
    index: '03',
    title: 'AI that stays live?',
    body: 'Not a chat demo — flows that survive real traffic.',
  },
  {
    index: '04',
    title: 'Ship and stay up?',
    body: 'Deploy cleanly and notice when something breaks.',
  },
];

export const constellationTiles: readonly ConstellationTile[] = [
  {
    id: 'hero',
    src: 'images-of-me/hero-3d-constellation.webp',
    alt: 'Joseph Sabag 3D character with constellation glow',
    // Framer Motion owns transform — center with calc, not -translate-x-1/2.
    className:
      'left-[calc(50%-6.5rem)] top-[14%] z-20 h-52 w-52 sm:left-[calc(50%-8rem)] sm:h-64 sm:w-64 md:left-[calc(50%-9rem)] md:h-72 md:w-72',
    rotate: 0,
    floatDelay: 0,
    isCharacter: true,
  },
  {
    id: 'badge',
    src: 'images-of-me/jts-badge-3d.webp',
    alt: 'JTS glass badge',
    className: 'right-[6%] top-[12%] z-10 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24',
    rotate: 12,
    floatDelay: 0.5,
    isCharacter: true,
  },
  {
    id: 'laptop',
    src: 'images-of-me/float-laptop-3d.webp',
    alt: 'Floating product laptop',
    className: 'left-[4%] top-[20%] h-20 w-32 sm:h-24 sm:w-40 md:h-28 md:w-48',
    rotate: -8,
    floatDelay: 0.4,
    isCharacter: true,
  },
  {
    id: 'phone',
    src: 'images-of-me/float-phone-3d.webp',
    alt: 'Floating product phone',
    className: 'right-[8%] top-[40%] h-28 w-16 sm:h-36 sm:w-20 md:h-40 md:w-24',
    rotate: 8,
    floatDelay: 0.9,
    isCharacter: true,
  },
  {
    id: 'ebay',
    src: 'screenshots/ebay-mcp.webp',
    alt: 'eBay MCP project',
    className: 'left-[10%] bottom-[10%] h-16 w-24 sm:h-20 sm:w-32',
    rotate: 5,
    floatDelay: 1.1,
    isCharacter: false,
  },
  {
    id: 'sora',
    src: 'screenshots/sora-extension.webp',
    alt: 'Sora extension',
    className: 'right-[12%] bottom-[8%] h-16 w-24 sm:h-20 sm:w-32',
    rotate: -6,
    floatDelay: 0.65,
    isCharacter: false,
  },
];
