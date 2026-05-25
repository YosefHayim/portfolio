import { CONTACT_EMAIL_MARKER_EXAMPLE } from "./contactEmail.js";

export const portfolioKnowledge = {
  person: {
    displayName: "Joseph Sabag",
    role: "AI Software Engineer",
    positioning:
      "Joseph builds practical AI and full-stack products that automate real workflows, reduce manual work, and ship quickly with production reliability.",
    shortBio:
      "I build practical AI and full-stack products that automate real workflows, reduce manual work, and ship fast with production reliability, including improvements on systems serving 83M+ requests daily, a zero-data-loss migration of 10 years of data, products reaching 500+ active users, and delivery of production iOS apps.",
    currentProfileFocus:
      "AI software engineering, backend architecture, API integrations, automation systems, and production-grade React/Node/TypeScript products.",
  },
  links: {
    githubUsername: "YosefHayim",
    github: "https://github.com/YosefHayim",
    linkedin: "https://www.linkedin.com/in/yosef-hayim-sabag/",
    whatsapp: "https://wa.me/546187549",
    resume:
      "https://docs.google.com/document/d/1oMcChoLpNMrr-E8fcXUsb7RED5yXZ9J1mUCjcjGTUlw/edit?tab=t.0",
    contactEmail: "",
  },
  proofPoints: [
    "systems serving 83M+ daily requests",
    "zero-data-loss migration of 10 years of data",
    "products with 500+ active users",
    "production iOS app delivery",
    "open-source MCP/tooling work",
  ],
  education: [
    "B.Sc Computer Science at Open University (Oct 2025+)",
    "IITC Full Stack Bootcamp (795hrs, Excellence)",
  ],
  military:
    "IDF Infantry Commander, Gdud 931 (2018-2021), 2x Excellence Awards",
  coreTechStack: [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "Python",
    "PostgreSQL",
    "MongoDB",
    "Firebase",
    "Supabase",
    "Tailwind CSS",
    "Playwright",
    "Docker",
    "AWS",
    "Socket.io",
    "Zod",
    "OpenAI SDK Agents",
    "Lemon Squeezy",
  ],
  skills: {
    Backend: ["Node.js", "Express", "TypeScript", "Python", "REST/GraphQL"],
    Frontend: ["React", "React Native", "Next.js", "Tailwind", "Framer Motion"],
    DB: ["MongoDB", "PostgreSQL", "Supabase", "Firebase"],
    DevOps: ["AWS", "GitHub Actions", "Docker", "CI/CD"],
    APIs: ["eBay", "OpenAI", "Google", "Telegram", "Binance"],
    Testing: ["Vitest", "Jest", "Playwright"],
  },
  experience: [
    {
      id: "predicto",
      company: "Predicto AI",
      role: "Software Engineer",
      companyUrl:
        "https://www.linkedin.com/company/predicto-ai/posts/?feedView=all",
      logoUrl: "/logos/predicto-ai.png",
      logoMonogram: "PA",
      startDate: "2025-07",
      endDate: "2026-05",
      dateRange: "Jul 2025 - May 2026",
      promptDateRange: "Jul 2025 - current profile",
      bullets: [
        "Fixed bugs and shipped production features on the buying platform with React 18.",
        "Executed a zero-data-loss migration of 10 years of production data to Cloudflare.",
        "Built a CMS theme and improved tooling to help protect ad revenue quality.",
      ],
    },
    {
      id: "wotch",
      company: "Wotch Health",
      role: "Software Engineer Intern",
      companyUrl: "https://www.linkedin.com/company/wotch-health/",
      logoUrl: "/logos/wotch-health.webp",
      logoMonogram: "WH",
      startDate: "2025-02",
      endDate: "2025-04",
      dateRange: "Feb 2025 - Apr 2025",
      promptDateRange: "Feb 2025 - Apr 2025",
      bullets: [
        "Optimized CI/CD and test workflows for real-time healthcare delivery.",
        "Engineered WebSocket testing coverage with Jest and Playwright.",
        "Built a production debugging tool that masks sensitive patient data.",
      ],
    },
    {
      id: "automation",
      company: "Automation Developer",
      role: "Automation Developer",
      dateRange: "Aug 2023 - Sep 2024",
      promptDateRange: "Aug 2023 - Sep 2024",
      bullets: [
        "Built Python/API automation for marketplace and data workflows.",
      ],
    },
  ],
  featuredProducts: [
    {
      id: "small-bites",
      name: "SmallBites",
      url: "https://apps.apple.com/ca/app/small-bites/id6759283694",
      logoUrl: "/logos/small-bites.jpg",
      logoMonogram: "SB",
      description:
        "Ditch the puree panic. SmallBites helps parents start solids with confidence through expert-led BLW guidance, a 400+ first-food database, personalized meal plans, progress tracking, and 300+ practical recipes.",
      status: "Published",
      dateRange: "2026",
      techStack: ["React Native", "Expo", "NestJS", "CI/CD"],
      promptSummary:
        "published React Native/Expo product for baby-led weaning guidance, 400+ first-food database, meal plans, progress tracking, and 300+ recipes.",
    },
    {
      id: "wise-note-taker",
      name: "WiseNoteTaker",
      logoUrl: "https://www.apple.com/apple-touch-icon.png",
      logoMonogram: "WN",
      description:
        "Professional AI meeting-notes app that records, transcribes, and summarizes conversations in one tap, turning raw voice recordings into accurate, structured, and actionable notes for teams, professionals, and students.",
      status: "In Review",
      dateRange: "2026",
      techStack: ["React Native", "Expo", "NestJS", "CI/CD"],
      promptSummary:
        "AI meeting-notes app for recording, transcription, summaries, and structured action notes.",
    },
    {
      id: "ebay-mcp-api-server",
      name: "eBay MCP API Server",
      logoUrl: "/logos/ebay.svg",
      logoMonogram: "eB",
      status: "Open Source",
      dateRange: "2025",
      techStack: ["TypeScript", "MCP", "OAuth", "eBay API", "Vitest"],
      description:
        "Open-source MCP server for eBay Sell APIs with broad tool coverage, tests, and npm distribution.",
      promptSummary:
        "open-source MCP server for eBay Sell APIs, broad tool coverage, tests, and npm distribution.",
    },
    {
      id: "omri-association",
      name: "Omri Association",
      url: "https://www.omri-association.com/",
      logoUrl: "/logos/omri-association.svg",
      logoMonogram: "OA",
      status: "Live",
      dateRange: "2026",
      techStack: ["Next.js", "TypeScript", "PostgreSQL", "Mantine"],
      description:
        "Developed and maintains a charity financial platform for managing beneficiaries, donors, donations, expenses, and monthly reporting.",
      promptSummary:
        "Hebrew charity management platform built and maintained for Omri Association covering beneficiaries, donors, donations, budgeting, and monthly reports.",
    },
    {
      id: "sora-auto-queue-prompts",
      name: "Sora Auto Queue Prompts",
      url: "https://chromewebstore.google.com/detail/sora-auto-queue-prompts/kbpbdckjechbjmnjagfkgcplmhdkkgph",
      chromeExtensionId: "kbpbdckjechbjmnjagfkgcplmhdkkgph",
      logoUrl: "/logos/chrome.svg",
      logoMonogram: "SQ",
      status: "Chrome Web Store",
      dateRange: "2025",
      techStack: ["TypeScript", "React", "WXT", "Playwright"],
      description:
        "Chrome extension that queues prompts in Sora and fires them back-to-back unattended — no manual clicking between generations.",
      promptSummary:
        "Chrome extension that queues prompts in Sora and fires them back-to-back unattended.",
    },
    {
      id: "batchbeam-bulk-prompt-queue",
      name: "BatchBeam — Bulk Prompt Queue",
      url: "https://chromewebstore.google.com/detail/batchbeam-bulk-prompt-que/lidnnjbepijjbbphbdhcchgpckpcbgfm",
      chromeExtensionId: "lidnnjbepijjbbphbdhcchgpckpcbgfm",
      logoUrl: "/logos/chrome.svg",
      logoMonogram: "BB",
      status: "Chrome Web Store",
      dateRange: "2025",
      techStack: ["TypeScript", "React", "WXT", "CSV"],
      description:
        "Bulk prompt runner for Gemini, AI Studio, and ChatGPT — CSV import, retries, auto-downloads, and mass edits across runs.",
      promptSummary:
        "Bulk prompt runner across Gemini, AI Studio, and ChatGPT with CSV import, retries, auto-downloads, and mass edits.",
    },
    {
      id: "automation-marketplace-tools",
      name: "Automation and marketplace tools",
      status: "Portfolio",
      dateRange: "2023 - 2026",
      techStack: ["Python", "Browser Extensions", "OpenAI", "Automation"],
      description:
        "Amazon/eBay workflow automation, prompt queue extensions, AI assistant tooling, OCR/parser projects, and trading/data bots.",
      promptSummary:
        "Amazon/eBay workflow automation, prompt queue extensions, AI assistant tooling, OCR/parser projects, and trading/data bots.",
    },
  ],
};

export function createPortfolioSystemPromptBase() {
  const experience = portfolioKnowledge.experience
    .map(
      (item) =>
        `- ${item.company}, ${item.role} (${item.promptDateRange}): ${item.bullets.join(" ")}`,
    )
    .join("\n");
  const skills = Object.entries(portfolioKnowledge.skills)
    .map(([area, values]) => `${area}: ${values.join(", ")}`)
    .join("\n");
  const featuredProducts = portfolioKnowledge.featuredProducts
    .map((product) => `- ${product.name}: ${product.promptSummary}`)
    .join("\n");

  return `You are Joseph Sabag's portfolio AI assistant. Help recruiters, founders, and technical visitors understand why Joseph is a strong AI software engineering candidate.

## ${portfolioKnowledge.person.displayName} - ${portfolioKnowledge.person.role}

**Positioning**: ${portfolioKnowledge.person.positioning}
**Current profile focus**: ${portfolioKnowledge.person.currentProfileFocus}
**Experience**:
${experience}

**Proof points**: ${portfolioKnowledge.proofPoints.join(", ")}.
**Education**: ${portfolioKnowledge.education.join(", ")}
**Military**: ${portfolioKnowledge.military}

## Skills
${skills}

## Featured Product Work
${featuredProducts}

## Contact
GitHub: ${portfolioKnowledge.links.github}
LinkedIn: ${portfolioKnowledge.links.linkedin}
Resume: available on the website and at ${portfolioKnowledge.links.resume}
WhatsApp: available on the website

## Email Capability
You can send emails to Joseph. When user wants to contact him:
1. Collect: name and email address
2. Subject is auto-inferred from conversation
3. When ready, end response with:
${CONTACT_EMAIL_MARKER_EXAMPLE}

## Guidelines
- Be professional but personable
- Highlight relevant skills for recruiters
- Give specific project examples and concrete impact metrics
- When asked about GitHub or recent projects, use the live GitHub snapshot below first
- When asked about LinkedIn or resume details, use the profile/resume links above and avoid claiming live LinkedIn scraping
- Keep responses concise (2-3 paragraphs max)
- Use markdown for readability
- Redirect salary/availability questions to direct contact`;
}

export const portfolioOfflineResponses = {
  skills: `Joseph's core technical skills include:

**Backend Development**
- Node.js & Express with TypeScript
- Python for automation and scripting
- REST API design and GraphQL
- Database design (MongoDB, PostgreSQL, Supabase)

**Frontend Development**
- React & React Native
- Next.js for full-stack applications
- Tailwind CSS for styling
- Framer Motion for animations

**DevOps & Tools**
- AWS deployment
- GitHub Actions CI/CD
- Docker containerization
- OAuth 2.0/2.1 authentication

His strongest areas are backend architecture, API integrations, and building automation tools.`,

  projects: `Joseph's most notable projects:

**1. SmallBites** (Published)
A React Native/Expo product for baby-led weaning guidance with a 400+ first-food database, meal plans, progress tracking, and 300+ recipes.

**2. WiseNoteTaker** (In Review)
An AI meeting-notes app that records, transcribes, and summarizes conversations into structured action notes.

**3. eBay MCP API Server** (Open Source)
An open-source MCP server for eBay Sell APIs with broad tool coverage, tests, OAuth support, and npm distribution.

These projects show production mobile delivery, AI workflow automation, and backend/API depth.`,

  experience: `**Current Profile**
Software Engineer at Predicto AI (Jul 2025 - current profile)
- Production React 18 features
- Zero-data-loss migration of 10 years of production data to Cloudflare
- CMS/theme/tooling work to protect ad revenue quality

**Previous Roles**
- Software Engineer Intern at Wotch Health (Feb - Apr 2025)
- Automation Developer (Aug 2023 - Sep 2024)

**Education**
- B.Sc Computer Science at Open University
- IITC Full Stack Bootcamp, 795 hours, Excellence`,

  hire: `**Why hire Joseph?**

1. **Production impact**: Experience touching systems serving 83M+ daily requests and migration work with zero data loss.

2. **AI product range**: Built AI assistants, mobile apps, browser extensions, automation tools, and MCP/API systems.

3. **Full-stack ownership**: Can work across React, React Native, Node.js, APIs, data, deployment, and testing.

4. **Delivery discipline**: Military leadership background plus a record of shipping practical products quickly.

5. **Recruiter-friendly proof**: Public GitHub work, production apps, and concrete impact metrics are easy to inspect.`,
};
