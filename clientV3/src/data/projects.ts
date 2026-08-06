import type { Collaborator, Project, ProjectStatus } from '@/db/types';

export type { Collaborator, Project, ProjectStatus };

/**
 * Curated project catalog used as the offline/GitHub-fallback feed.
 * Stacks list product-facing tech only (tooling noise stripped).
 * Optional longDescription/highlights are omitted — clientV3 never renders them.
 */
export const projects: Project[] = [
  {
    id: 'ebay-mcp',
    name: 'eBay MCP API Server',
    description:
      "A local MCP server providing AI assistants with comprehensive access to eBay's Sell APIs - 387 tools, 100% API coverage, OAuth 2.0 support.",
    techStack: ['TypeScript', 'Node.js', 'MCP SDK', 'Express', 'Axios', 'Zod', 'JWT', 'Vitest'],
    deployedUrl: 'https://www.npmjs.com/package/ebay-mcp',
    repoUrl: 'https://github.com/YosefHayim/ebay-mcp',
    image: '/screenshots/ebay-mcp.png',
    status: 'live',
  },
  {
    id: 'autobay-saas',
    name: 'AutoBay DropShipping Saas Platform',
    description:
      'Amazon to eBay dropshipping SaaS platform engineered to mitigate common pain points encountered by sellers.',
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'TanStack Query',
      'Firebase',
      'Stripe',
      'Playwright',
      'eBay API',
    ],
    deployedUrl: 'projects',
    repoUrl: 'https://github.com/orgs/AutoBay/repositories',
    image: '/screenshots/auto-bay-saas.png',
    status: 'development',
  },
  {
    id: 'extension-sora-auto-queue',
    name: 'Sora Auto Queue Prompts Extension',
    description:
      'A browser extension that introduces an automated prompt-queuing system for AI-driven workflows with clarity, flow, and openness.',
    techStack: ['TypeScript', 'React', 'WXT', 'Vite', 'Tailwind CSS', 'DnD Kit', 'Playwright'],
    deployedUrl:
      'https://chromewebstore.google.com/detail/sora-auto-queue-prompts/kbpbdckjechbjmnjagfkgcplmhdkkgph',
    repoUrl: 'https://github.com/YosefHayim/extension-sora-auto-queue-prompts',
    image: '/screenshots/sora-extension.png',
    status: ['live', 'development'],
  },
  {
    id: 'extension-ai-conversation-navigator',
    name: 'AI Conversation Navigator Extension',
    description: 'Advanced navigation and analytics for ChatGPT, Claude, and Gemini conversations.',
    techStack: ['TypeScript', 'JavaScript', 'Chrome Extensions API', 'Lucide Icons'],
    deployedUrl:
      'https://chromewebstore.google.com/detail/ai-conversation-navigator/lidnnjbepijjbbphbdhcchgpckpcbgfm',
    repoUrl: 'https://github.com/YosefHayim/extension-ai-conversation-navigator',
    image: '/screenshots/ai-navigator-extension.png',
    status: 'live',
  },
  {
    id: 'gemini-nano-flow',
    name: 'Gemini Nano Flow Extension',
    description:
      'A Chrome extension that enhances Gemini AI workflow with automated prompt queuing and streamlined interactions.',
    techStack: ['TypeScript', 'React', 'WXT', 'Tailwind CSS', 'Gemini AI', 'DnD Kit'],
    deployedUrl:
      'https://chromewebstore.google.com/detail/gemini-nano-flow/lidnnjbepijjbbphbdhcchgpckpcbgfm',
    repoUrl: 'https://github.com/YosefHayim/extension-gemini-auto-queue',
    image: '/screenshots/gemini-nano-flow.png',
    status: ['live', 'development'],
  },
  {
    id: 'ally-ai-calendar',
    name: 'Ally AI Calendar',
    description:
      'An intelligent calendar management platform that converts natural language into Google Calendar events across web, Telegram, and WhatsApp.',
    techStack: [
      'Next.js',
      'React',
      'TypeScript',
      'Express',
      'Supabase',
      'OpenAI Agents',
      'Grammy.js',
      'BullMQ',
      'Redis',
    ],
    deployedUrl: 'https://askally.io',
    telegramBotUrl: 'https://t.me/ai_schedule_event_server_bot',
    repoUrl: 'https://github.com/YosefHayim/ai-google-calendar-assistant',
    image: '/screenshots/ally-ai-calendar.png',
    status: 'live',
  },
  {
    id: 'prompt-queue-extension',
    name: 'Prompt Queue Extension',
    description:
      'A Chrome extension for managing AI prompt queues with drag-and-drop functionality and real-time synchronization.',
    techStack: [
      'TypeScript',
      'React',
      'WXT',
      'Vite',
      'Tailwind CSS',
      'TanStack Query',
      'MongoDB',
      'Redis',
    ],
    deployedUrl: 'projects',
    repoUrl: 'https://github.com/YosefHayim/prompt-queue-extension',
    image: '/screenshots/prompt-queue-extension.png',
    status: 'development',
  },
  {
    id: 'udemy-clone',
    name: 'Udemy Clone',
    description:
      'Full-stack implementation of a Udemy-style learning platform covering course management, user enrollment, and media handling.',
    techStack: [
      'React',
      'TypeScript',
      'Vite',
      'Node.js',
      'Express',
      'MongoDB',
      'Redux Toolkit',
      'TanStack Query',
      'Socket.io',
    ],
    deployedUrl: 'https://udemy-clone-ron-ben-iitc.onrender.com/',
    repoUrl: 'https://github.com/YosefHayim/udemy-clone-ron-ben-iitc',
    image: '/screenshots/udemy.png',
    status: ['live', 'completed'],
    collaborators: [
      { name: 'Ron Sherling', githubProfileLink: 'https://github.com/ron959' },
      {
        name: 'Ben Klinski',
        githubProfileLink: 'https://github.com/Ben-Kilinski',
      },
    ],
  },
  {
    id: 'tim-trailers',
    name: 'Tim Trailers',
    description:
      'A comprehensive movie database application built from scratch with Vanilla JavaScript to master web development fundamentals.',
    techStack: ['JavaScript', 'TMDB API'],
    deployedUrl: 'https://iitc-b-frontend-vanilla-tim-trailers.onrender.com/',
    repoUrl: 'https://github.com/YosefHayim/tim-trailers-vanilla-js',
    image: '/screenshots/tim-trailer.png',
    status: ['live', 'completed'],
  },
  {
    id: 'ocr-parse-ai',
    name: 'OCR Parse AI',
    description:
      'Automated tool that extracts data from PDF invoices using AI, converting messy paperwork into organized data.',
    techStack: [
      'React',
      'TypeScript',
      'Vite',
      'Node.js',
      'Express',
      'OpenAI API',
      'PDF.js',
      'Socket.io',
    ],
    deployedUrl: 'https://pdf-extractor-data-helping-mom-fronted.onrender.com/',
    repoUrl: 'https://github.com/YosefHayim/ai-ocr-parser-web',
    image: '/screenshots/MomTool.png',
    status: ['live', 'completed'],
  },
  {
    id: 'amazon-asin-scraper',
    name: 'Amazon ASIN Scraper W/CAPTCHA',
    description: 'Python bot using Selenium to grab ASINs from Amazon with CAPTCHA bypass.',
    techStack: ['Selenium', '2Captcha API', 'Python'],
    deployedUrl: 'projects',
    repoUrl:
      'https://github.com/YosefHayim/projects-with-chatgpt/tree/main/Python/09.08.2024%20-%20Amazon%20ASIN%20Collector%20%2B%20normal%20captcha',
    image: '/screenshots/amazon.png',
    status: 'completed',
  },
  {
    id: 'ebay-title-scraper',
    name: 'eBay Sellers Title Scraper',
    description: 'Python bot that scrapes product titles across pages.',
    techStack: ['Selenium', 'Python'],
    deployedUrl: 'projects',
    repoUrl:
      'https://github.com/YosefHayim/projects-with-chatgpt/tree/main/Python/11.08.2024%20-%20eBay%20Titles%20Collector',
    image: '/screenshots/ebay.png',
    status: 'completed',
  },
  {
    id: 'harabituah-scraper',
    name: 'HarABituah Government Scraper',
    description:
      'Python automation for extracting and processing customer files from government site.',
    techStack: ['Selenium', 'Python'],
    deployedUrl: 'projects',
    repoUrl:
      'https://github.com/YosefHayim/projects-with-chatgpt/tree/main/Python/19.02.2024%20-%20HarABituh-data%20read%20and%20extraction%20with%20manual%20captcha%20automation',
    image: '/screenshots/har-a-bituah.png',
    status: 'completed',
  },
  {
    id: 'stocks-trading-bots',
    name: 'Stocks Trading Bots',
    description: 'Modular Python bots running MACD, RSI, SMA, and Wyckoff strategies.',
    techStack: ['Selenium', 'Interactive Brokers API', 'Telegram API', 'Python'],
    deployedUrl: 'projects',
    repoUrl:
      'https://github.com/YosefHayim/projects-with-chatgpt/tree/main/Python/19.11.2023%20-%20Interactive%20broker%20API%20trading%20bots',
    image: '/screenshots/interactive-brokers.png',
    status: 'completed',
  },
  {
    id: 'crypto-trading-bots',
    name: 'Crypto Trading Bots',
    description: 'Python bots for automated trading on Binance with RSI, MACD, and SMA strategies.',
    techStack: ['Selenium', 'Binance API', 'Telegram API', 'Python'],
    deployedUrl: 'projects',
    repoUrl:
      'https://github.com/YosefHayim/projects-with-chatgpt/tree/main/Python/10.28.2023%20-%20Binance%20API%20trading%20bots',
    image: '/screenshots/binance.png',
    status: 'completed',
  },
  {
    id: 'facebook-lead-ai-extension',
    name: 'Facebook Lead AI Extension',
    description:
      'A next-gen AI scouting extension for Facebook leads with Human-in-the-Loop automation and hyper-personalized reply generation.',
    techStack: [
      'TypeScript',
      'React',
      'WXT',
      'Tailwind CSS',
      'Supabase',
      'OpenAI API',
      'Gemini AI',
    ],
    deployedUrl: 'projects',
    repoUrl: 'https://github.com/YosefHayim/facebook-lead-ai-extension',
    image: '/screenshots/facebook-lead-ai.png',
    status: 'development',
  },
  {
    id: 'discord-signal-ai-trader',
    name: 'Discord Signal AI Trader',
    description:
      'An automated AI-driven trading engine that monitors Discord signals in real-time and executes high-frequency orders.',
    techStack: ['TypeScript', 'Node.js', 'Discord API', 'NLP', 'Trading APIs'],
    deployedUrl: 'projects',
    repoUrl: 'https://github.com/YosefHayim/discord-signal-ai-trader',
    image: '/screenshots/discord-signal-trader.png',
    status: 'development',
  },
  {
    id: 'vision-agent-mas',
    name: 'Vision Agent MAS',
    description:
      'Vision-to-React Agentic Pipeline that transforms any UI image into a precise, multi-layered React application.',
    techStack: ['TypeScript', 'React', 'Vite', 'Gemini AI'],
    deployedUrl: 'projects',
    repoUrl: 'https://github.com/YosefHayim/vision-agent-mas',
    image: '/screenshots/vision-agent-mas.png',
    status: 'development',
  },
  {
    id: 'parallel-ai-image-generation',
    name: 'Parallel AI Image Generation',
    description:
      'A platform to trigger, compare, and analyze results from multiple AI image generation models in parallel.',
    techStack: ['TypeScript', 'React', 'Vite', 'Tailwind CSS', 'Gemini AI', 'Framer Motion'],
    deployedUrl: 'projects',
    repoUrl: 'https://github.com/YosefHayim/parallel-ai-image-generation',
    image: '/screenshots/parallel-ai-image.png',
    status: 'development',
  },
  {
    id: 'chrome-extension-api-reference-mcp',
    name: 'Chrome Extension API Reference MCP',
    description:
      'Open source MCP server providing on-demand access to Chrome Extensions API reference for AI agents.',
    techStack: ['TypeScript', 'Node.js', 'MCP SDK', 'Cheerio', 'Zod', 'Vitest'],
    deployedUrl: 'projects',
    repoUrl: 'https://github.com/YosefHayim/chrome-extension-api-reference-mcp',
    image: '/screenshots/chrome-extension-mcp.png',
    status: 'live',
  },
  {
    id: 'get-barber',
    name: 'Get Barber',
    description:
      'A React Native mobile app for booking barber appointments with real-time availability and location services.',
    techStack: [
      'React Native',
      'Expo',
      'TypeScript',
      'Supabase',
      'TanStack Query',
      'Zustand',
      'NativeWind',
    ],
    deployedUrl: 'projects',
    repoUrl: 'https://github.com/YosefHayim/get-barber',
    image: '/screenshots/get-barber.png',
    status: 'development',
  },
  {
    id: 'instagram-ai-thumbnail-replacer',
    name: 'Instagram AI Thumbnail Replacer',
    description:
      'A Chrome extension for automated AI-powered Instagram thumbnail replacement with Convex backend.',
    techStack: ['TypeScript', 'React', 'WXT', 'Tailwind CSS', 'Convex', 'Framer Motion'],
    deployedUrl: 'projects',
    repoUrl: 'https://github.com/YosefHayim/instagram-ai-auto-image-thumbnail-replacer',
    image: '/screenshots/instagram-thumbnail-replacer.png',
    status: 'development',
  },
];

export const getProjectById = (id: string): Project | undefined =>
  projects.find((project) => project.id === id);
