export type Collaborator = {
  name: string;
  githubProfileLink: string;
};

export type ProjectStatus = "live" | "development" | "completed";

export type Project = {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  deployedUrl: string;
  telegramBotUrl?: string;
  repoUrl: string;
  image: string;
  collaborators?: Collaborator[];
  status?: ProjectStatus | ProjectStatus[];
  highlights?: string[];
};

export const projects: Project[] = [
  {
    id: "ebay-mcp",
    name: "eBay MCP API Server",
    description:
      "A local MCP server providing AI assistants with comprehensive access to eBay's Sell APIs - 387 tools, 100% API coverage, OAuth 2.0 support.",
    longDescription:
      "A local MCP server providing AI assistants with comprehensive access to eBay's Sell APIs across 270 unique endpoints. Features 387 purpose-built tools for seller operations including inventory, orders, marketing, and analytics. Supports 9 AI clients including Claude Desktop, Cursor, Zed, Cline, Continue.dev, Windsurf, Roo Code, Claude Code CLI, and Amazon Q. Includes OAuth 2.0 with automatic token refresh, TypeScript implementation with Zod validation, and 958+ passing tests.",
    techStack: [
      "TypeScript",
      "Node.js",
      "MCP SDK",
      "Express",
      "Axios",
      "Zod",
      "Jose",
      "JWT",
      "Winston",
      "Vitest",
      "ESLint",
      "Prettier",
    ],
    deployedUrl: "https://www.npmjs.com/package/ebay-mcp",
    repoUrl: "https://github.com/YosefHayim/ebay-mcp",
    image: "/screenshots/ebay-mcp.png",
    status: "live",
    highlights: [
      "387 tools across 270 unique eBay endpoints",
      "100% API coverage with 958+ passing tests",
      "Supports 9 AI clients (Claude, Cursor, Zed, etc.)",
      "OAuth 2.0 with automatic token refresh",
    ],
  },
  {
    id: "autobay-saas",
    name: "AutoBay DropShipping Saas Platform",
    description:
      "Amazon to eBay dropshipping SaaS platform engineered to mitigate common pain points encountered by sellers.",
    longDescription:
      "Leveraging my prior experience as an eBay seller, I am developing an Amazon to eBay dropshipping SaaS platform. This platform is engineered to mitigate common pain points encountered by sellers, integrating advanced optimizations and novel features to enhance the dropshipping workflow and maximize profit margins.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Zod",
      "Playwright",
      "AWS",
      "GitHub Actions",
      "Jest",
      "Firebase",
      "Nodemailer",
      "OAuth",
      "eBay API",
      "Amazon SP-API",
      "USA USPTO Trademarks API",
      "International WIPO Patents API",
      "Stripe API",
      "PayPal API",
      "Postman",
    ],
    deployedUrl: "projects",
    repoUrl: "https://github.com/orgs/AutoBay/repositories",
    image: "/screenshots/auto-bay-saas.png",
    status: "development",
    highlights: [
      "Multi-marketplace integration",
      "Trademark & patent verification",
      "Automated pricing optimization",
      "Real-time inventory sync",
    ],
  },
  {
    id: "extension-sora-auto-queue",
    name: "Sora Auto Queue Prompts Extension",
    description:
      "A browser extension that introduces an automated prompt-queuing system for AI-driven workflows with clarity, flow, and openness.",
    longDescription:
      "A browser extension that introduces an automated prompt-queuing system inspired by the concept of 'Sora'—clarity, flow, and openness. It streamlines how prompts are submitted, organizes them into a controlled queue, and ensures consistent, uninterrupted task execution for AI-driven workflows. Features a complete UI redesign in v2.0.0 with reusable components.",
    techStack: [
      "TypeScript",
      "React",
      "WXT",
      "Tailwind CSS",
      "Radix UI",
      "DnD Kit",
      "Jest",
      "Playwright",
      "Husky",
    ],
    deployedUrl: "https://chromewebstore.google.com/detail/sora-auto-queue-prompts/kbpbdckjechbjmnjagfkgcplmhdkkgph",
    repoUrl: "https://github.com/YosefHayim/extension-sora-auto-queue-prompts",
    image: "/screenshots/sora-extension.png",
    status: ["live", "development"],
    highlights: [
      "Automated prompt queuing system",
      "Complete UI redesign in v2.0.0",
      "E2E testing with Playwright",
      "CI/CD with GitHub Actions",
    ],
  },
  {
    id: "extension-ai-conversation-navigator",
    name: "AI Conversation Navigator Extension",
    description:
      "Advanced navigation and analytics for ChatGPT, Claude, and Gemini conversations.",
    longDescription:
      "A browser extension providing advanced navigation and analytics for ChatGPT, Claude, and Gemini conversations. Enables users to better organize and analyze their AI chat interactions across multiple platforms with comprehensive testing (90%+ coverage) and automated CI/CD pipelines.",
    techStack: [
      "TypeScript",
      "JavaScript",
      "Chrome Extensions API",
      "Lucide Icons",
    ],
    deployedUrl: "https://chromewebstore.google.com/detail/ai-conversation-navigator/lidnnjbepijjbbphbdhcchgpckpcbgfm",
    repoUrl: "https://github.com/YosefHayim/extension-ai-conversation-navigator",
    image: "/screenshots/ai-navigator-extension.png",
    status: "live",
    highlights: [
      "Multi-platform support (ChatGPT, Claude, Gemini)",
      "90%+ test coverage requirement",
      "Chrome/Edge and Firefox support",
      "Automated security audits",
    ],
  },
  {
    id: "gemini-nano-flow",
    name: "Gemini Nano Flow Extension",
    description:
      "A Chrome extension that enhances Gemini AI workflow with automated prompt queuing and streamlined interactions.",
    longDescription:
      "A Chrome extension designed to enhance the Gemini AI experience with automated prompt queuing capabilities. Streamlines AI-driven workflows by organizing prompts into a controlled queue system, ensuring consistent and uninterrupted task execution. Built with modern web extension technologies and actively under development with new features.",
    techStack: [
      "TypeScript",
      "React",
      "WXT",
      "Tailwind CSS",
      "Gemini AI",
      "DnD Kit",
      "Lucide React",
      "Sonner",
      "ESLint",
      "Prettier",
    ],
    deployedUrl: "https://chromewebstore.google.com/detail/gemini-nano-flow/lidnnjbepijjbbphbdhcchgpckpcbgfm",
    repoUrl: "https://github.com/YosefHayim/extension-gemini-auto-queue",
    image: "/screenshots/gemini-nano-flow.png",
    status: ["live", "development"],
    highlights: [
      "Automated prompt queuing for Gemini",
      "Streamlined AI workflow management",
      "Chrome Web Store published",
      "Active development with new features",
    ],
  },
  {
    id: "ally-ai-calendar",
    name: "Ally AI Calendar",
    description:
      "An intelligent calendar management platform that converts natural language into Google Calendar events across web, Telegram, and WhatsApp.",
    longDescription:
      "An intelligent calendar management platform that converts natural language into Google Calendar events across multiple interfaces including web dashboard, Telegram bot, and WhatsApp. Features a multi-agent AI architecture using OpenAI's framework for specialized calendar operations, AI-powered detection and automatic filling of untracked calendar gaps, voice input capabilities, analytics dashboards, and support for six languages with RTL text handling.",
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Express",
      "Supabase",
      "Bun",
      "Grammy.js",
      "Google APIs",
      "OpenAI Agents",
      "Anthropic SDK",
      "MCP SDK",
      "Sentry",
      "Socket.io",
      "BullMQ",
      "Redis",
      "Zod",
      "Framer Motion",
      "Radix UI",
      "Three.js",
      "Recharts",
      "Storybook",
      "Vitest",
      "Playwright",
      "i18next",
      "PostHog",
    ],
    deployedUrl: "https://askally.io",
    telegramBotUrl: "https://t.me/ai_schedule_event_server_bot",
    repoUrl: "https://github.com/YosefHayim/ai-google-calendar-assistant",
    image: "/screenshots/ally-ai-calendar.png",
    status: "live",
    highlights: [
      "Multi-platform support (Web, Telegram, WhatsApp)",
      "Multi-agent AI architecture with OpenAI",
      "Voice input & 6 language support with RTL",
      "AI-powered calendar gap detection & filling",
    ],
  },
  {
    id: "udemy-clone",
    name: "Udemy Clone",
    description:
      "Full-stack implementation of a Udemy-style learning platform covering course management, user enrollment, and media handling.",
    longDescription:
      "Full-stack implementation of a Udemy-style learning platform based on Ron Ben's IITC curriculum, covering course management, user enrollment, media handling, and instructor workflows. Built as the final capstone for our course at IITC to showcase full-stack proficiency.",
    techStack: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "Redux Toolkit",
      "TanStack Query",
      "Tailwind CSS",
      "Radix UI",
      "MUI",
      "Socket.io",
      "PayPal SDK",
      "Google OAuth",
      "Video.js",
      "React Quill",
      "JWT",
      "Nodemailer",
      "Sharp",
      "Multer",
    ],
    deployedUrl: "https://udemy-clone-ron-ben-iitc.onrender.com/",
    repoUrl: "https://github.com/YosefHayim/udemy-clone-ron-ben-iitc",
    image: "/screenshots/udemy.png",
    status: ["live", "completed"],
    collaborators: [
      { name: "Ron Sherling", githubProfileLink: "https://github.com/ron959" },
      {
        name: "Ben Klinski",
        githubProfileLink: "https://github.com/Ben-Kilinski",
      },
    ],
    highlights: [
      "Full authentication system",
      "Course management",
      "Video streaming",
      "Payment integration",
    ],
  },
  {
    id: "tim-trailers",
    name: "Tim Trailers",
    description:
      "A comprehensive movie database application built from scratch with Vanilla JavaScript to master web development fundamentals.",
    longDescription:
      "A comprehensive movie database application built from scratch to master web development fundamentals. Constructed entirely with Vanilla JavaScript (no frameworks) to demonstrate deep understanding of the DOM, state management, and API integration, featuring a custom AI-driven asset pipeline.",
    techStack: ["JavaScript", "TMDB API"],
    deployedUrl: "https://iitc-b-frontend-vanilla-tim-trailers.onrender.com/",
    repoUrl: "https://github.com/YosefHayim/tim-trailers-vanilla-js",
    image: "/screenshots/tim-trailer.png",
    status: ["live", "completed"],
    highlights: [
      "TMDB API integration",
      "Responsive design",
      "Pure vanilla JS",
      "Custom animations",
    ],
  },
  {
    id: "ocr-parse-ai",
    name: "OCR Parse AI",
    description:
      "Automated tool that extracts data from PDF invoices using AI, converting messy paperwork into organized data.",
    longDescription:
      "Developed an automated tool that extracts data from PDF invoices using AI. By leveraging OpenAI technology, the system accurately identifies and pulls key details—like total quantities, prices, and supplier names—converting messy paperwork into organized data. This solves a major workflow bottleneck and significantly speeds up invoice processing.",
    techStack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "TanStack Query",
      "Socket.io",
      "Node.js",
      "Express",
      "OpenAI API",
      "PDF.js",
      "pdf-poppler",
      "Sharp",
      "Multer",
      "Lucide React",
      "Playwright",
      "Husky",
    ],
    deployedUrl: "https://pdf-extractor-data-helping-mom-fronted.onrender.com/",
    repoUrl: "https://github.com/YosefHayim/ai-ocr-parser-web",
    image: "/screenshots/MomTool.png",
    status: ["live", "completed"],
    highlights: [
      "PDF to image conversion",
      "OCR text extraction",
      "AI-powered data parsing",
      "Real-time processing with WebSockets",
    ],
  },
  {
    id: "amazon-asin-scraper",
    name: "Amazon ASIN Scraper W/CAPTCHA",
    description:
      "Python bot using Selenium to grab ASINs from Amazon with CAPTCHA bypass.",
    longDescription:
      "Python bot using Selenium to grab ASINs from Amazon, bypass CAPTCHAs with 2Captcha, switch ZIP codes, and export to CSV.",
    techStack: ["Selenium", "2Captcha API", "Python"],
    deployedUrl: "projects",
    repoUrl:
      "https://github.com/YosefHayim/projects-with-chatgpt/tree/main/Python/09.08.2024%20-%20Amazon%20ASIN%20Collector%20%2B%20normal%20captcha",
    image: "/screenshots/amazon.png",
    status: "completed",
    highlights: [
      "Automated CAPTCHA solving",
      "ZIP code switching",
      "CSV export",
      "Bulk ASIN collection",
    ],
  },
  {
    id: "ebay-title-scraper",
    name: "eBay Sellers Title Scraper",
    description: "Python bot that scrapes product titles across pages.",
    longDescription:
      "Python bot that scrapes product titles across pages and saves them to CSV.",
    techStack: ["Selenium", "Python"],
    deployedUrl: "projects",
    repoUrl:
      "https://github.com/YosefHayim/projects-with-chatgpt/tree/main/Python/11.08.2024%20-%20eBay%20Titles%20Collector",
    image: "/screenshots/ebay.png",
    status: "completed",
    highlights: [
      "Multi-page scraping",
      "CSV export",
      "Seller title extraction",
    ],
  },
  {
    id: "harabituah-scraper",
    name: "HarABituah Government Scraper",
    description:
      "Python automation for extracting and processing customer files from government site.",
    longDescription:
      "At an insurance company in Holon, I spotted a manual process slowing things down. With zero coding background, I used ChatGPT to guide me in building a Python automation that extracted and processed customer files—saving time and cutting costs for the business.",
    techStack: ["Selenium", "Python"],
    deployedUrl: "projects",
    repoUrl:
      "https://github.com/YosefHayim/projects-with-chatgpt/tree/main/Python/19.02.2024%20-%20HarABituh-data%20read%20and%20extraction%20with%20manual%20captcha%20automation",
    image: "/screenshots/har-a-bituah.png",
    status: "completed",
    highlights: [
      "Manual CAPTCHA handling",
      "Customer data extraction",
      "Business process automation",
      "Cost savings for company",
    ],
  },
  {
    id: "stocks-trading-bots",
    name: "Stocks Trading Bots",
    description:
      "Modular Python bots running MACD, RSI, SMA, and Wyckoff strategies.",
    longDescription:
      "Started with zero coding—used ChatGPT to build modular Python bots running MACD, RSI, SMA, and Wyckoff strategies. Fully automated for live trading via Interactive Brokers API.",
    techStack: [
      "Selenium",
      "Interactive Brokers API",
      "Telegram API",
      "Python",
    ],
    deployedUrl: "projects",
    repoUrl:
      "https://github.com/YosefHayim/projects-with-chatgpt/tree/main/Python/19.11.2023%20-%20Interactive%20broker%20API%20trading%20bots",
    image: "/screenshots/interactive-brokers.png",
    status: "completed",
    highlights: [
      "Multiple trading strategies",
      "Interactive Brokers integration",
      "Telegram notifications",
      "Fully automated trading",
    ],
  },
  {
    id: "crypto-trading-bots",
    name: "Crypto Trading Bots",
    description:
      "Python bots for automated trading on Binance with RSI, MACD, and SMA strategies.",
    longDescription:
      "With no coding background, I built Python bots using ChatGPT to automate trading on Binance. Strategies included RSI, MACD, and SMA—fully hands-off and data-driven.",
    techStack: ["Selenium", "Binance API", "Telegram API", "Python"],
    deployedUrl: "projects",
    repoUrl:
      "https://github.com/YosefHayim/projects-with-chatgpt/tree/main/Python/10.28.2023%20-%20Binance%20API%20trading%20bots",
    image: "/screenshots/binance.png",
    status: "completed",
    highlights: [
      "Binance API integration",
      "Multiple trading strategies",
      "Telegram alerts",
      "Data-driven decisions",
    ],
  },
  {
    id: "facebook-lead-ai-extension",
    name: "Facebook Lead AI Extension",
    description:
      "A next-gen AI scouting extension for Facebook leads with Human-in-the-Loop automation and hyper-personalized reply generation.",
    longDescription:
      "A next-gen AI scouting extension for Facebook leads, built with the WXT framework, React, and TypeScript. It uses 'Human-in-the-Loop' automation to identify high-intent posts and generate hyper-personalized replies based on deep user context while strictly adhering to platform anti-bot policies.",
    techStack: [
      "TypeScript",
      "React",
      "WXT",
      "Tailwind CSS",
      "Supabase",
      "OpenAI API",
      "Gemini AI",
      "Zustand",
      "Lucide React",
      "Vitest",
    ],
    deployedUrl: "projects",
    repoUrl: "https://github.com/YosefHayim/facebook-lead-ai-extension",
    image: "/screenshots/facebook-lead-ai.png",
    status: "development",
    highlights: [
      "Human-in-the-Loop automation",
      "AI-powered lead identification",
      "Hyper-personalized reply generation",
      "Platform-compliant automation",
    ],
  },
  {
    id: "discord-signal-ai-trader",
    name: "Discord Signal AI Trader",
    description:
      "An automated AI-driven trading engine that monitors Discord signals in real-time and executes high-frequency orders.",
    longDescription:
      "An automated AI-driven trading engine that monitors Discord server signals in real-time, processes sentiment and technical data using Natural Language Processing (NLP), and executes high-frequency buy/sell orders via the API Marketplace.",
    techStack: ["TypeScript", "Node.js", "Discord API", "NLP", "Trading APIs"],
    deployedUrl: "projects",
    repoUrl: "https://github.com/YosefHayim/discord-signal-ai-trader",
    image: "/screenshots/discord-signal-trader.png",
    status: "development",
    highlights: [
      "Real-time Discord signal monitoring",
      "NLP sentiment analysis",
      "High-frequency trading execution",
      "Automated order management",
    ],
  },
  {
    id: "vision-agent-mas",
    name: "Vision Agent MAS",
    description:
      "Vision-to-React Agentic Pipeline that transforms any UI image into a precise, multi-layered React application.",
    longDescription:
      "Vision-to-React Agentic Pipeline that transforms any UI image into a precise, multi-layered React application. Uses AI vision models to analyze design images and generate production-ready React components with proper structure and styling.",
    techStack: [
      "TypeScript",
      "React",
      "Vite",
      "Gemini AI",
      "Lucide React",
    ],
    deployedUrl: "projects",
    repoUrl: "https://github.com/YosefHayim/vision-agent-mas",
    image: "/screenshots/vision-agent-mas.png",
    status: "development",
    highlights: [
      "AI-powered UI image analysis",
      "Automated React code generation",
      "Multi-layered component structure",
      "Production-ready output",
    ],
  },
  {
    id: "parallel-ai-image-generation",
    name: "Parallel AI Image Generation",
    description:
      "A platform to trigger, compare, and analyze results from multiple AI image generation models in parallel.",
    longDescription:
      "Parallel AI Image Generation & Evaluation Platform. Trigger, compare, and analyze results from multiple AI models simultaneously. Features a modern UI with Framer Motion animations and Radix UI components.",
    techStack: [
      "TypeScript",
      "React",
      "Vite",
      "Tailwind CSS",
      "Gemini AI",
      "Framer Motion",
      "Radix UI",
      "Lucide React",
    ],
    deployedUrl: "projects",
    repoUrl: "https://github.com/YosefHayim/parallel-ai-image-generation",
    image: "/screenshots/parallel-ai-image.png",
    status: "development",
    highlights: [
      "Multi-model parallel generation",
      "Side-by-side comparison",
      "AI model evaluation",
      "Modern animated UI",
    ],
  },
  {
    id: "chrome-extension-api-reference-mcp",
    name: "Chrome Extension API Reference MCP",
    description:
      "Open source MCP server providing on-demand access to Chrome Extensions API reference for AI agents.",
    longDescription:
      "Local MCP server that provides on-demand access to the Chrome Extensions API reference for precise, best-practice extension generation for AI Agents. Enables AI assistants to generate accurate Chrome extension code by referencing official API documentation.",
    techStack: [
      "TypeScript",
      "Node.js",
      "MCP SDK",
      "Cheerio",
      "Zod",
      "Vitest",
      "ESLint",
    ],
    deployedUrl: "projects",
    repoUrl: "https://github.com/YosefHayim/chrome-extension-api-reference-mcp",
    image: "/screenshots/chrome-extension-mcp.png",
    status: "live",
    highlights: [
      "Chrome Extensions API reference",
      "MCP protocol integration",
      "AI agent tooling",
      "Best-practice code generation",
    ],
  },
  {
    id: "get-barber",
    name: "Get Barber",
    description:
      "A React Native mobile app for booking barber appointments with real-time availability and location services.",
    longDescription:
      "A React Native mobile application for booking barber appointments. Features real-time availability, location-based barber discovery, secure authentication with Supabase, and a polished UI built with Gluestack and NativeWind.",
    techStack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Supabase",
      "TanStack Query",
      "Zustand",
      "NativeWind",
      "Gluestack UI",
      "React Native Maps",
      "Expo Router",
    ],
    deployedUrl: "projects",
    repoUrl: "https://github.com/YosefHayim/get-barber",
    image: "/screenshots/get-barber.png",
    status: "development",
    highlights: [
      "Real-time appointment booking",
      "Location-based discovery",
      "Supabase authentication",
      "Cross-platform mobile app",
    ],
  },
  {
    id: "instagram-ai-thumbnail-replacer",
    name: "Instagram AI Thumbnail Replacer",
    description:
      "A Chrome extension for automated AI-powered Instagram thumbnail replacement with Convex backend.",
    longDescription:
      "A Chrome extension that automates Instagram thumbnail replacement using AI. Built with WXT framework, React, and Convex backend for real-time data synchronization. Features confetti animations and a modern Framer Motion-powered UI.",
    techStack: [
      "TypeScript",
      "React",
      "WXT",
      "Tailwind CSS",
      "Convex",
      "Framer Motion",
      "Canvas Confetti",
      "Lucide React",
    ],
    deployedUrl: "projects",
    repoUrl: "https://github.com/YosefHayim/instagram-ai-auto-image-thumbnail-replacer",
    image: "/screenshots/instagram-thumbnail-replacer.png",
    status: "development",
    highlights: [
      "AI-powered thumbnail generation",
      "Real-time Convex backend",
      "Animated UI with confetti",
      "Chrome extension architecture",
    ],
  },
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find((project) => project.id === id);
};
