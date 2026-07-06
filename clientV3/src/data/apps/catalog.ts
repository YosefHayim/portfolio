import { createAppCatalog } from './catalogBuilder.ts';
import type { AppMetadata } from './types.ts';

export const appCatalog = createAppCatalog({
  'prompt-queue': {
    id: 'prompt-queue',
    name: 'PromptQueue',
    tagline: 'Bulk Image Generation & Automation for Gemini',
    description:
      'Transform Google Gemini into a batch processing powerhouse. Queue multiple prompts, attach reference images, and let the extension automate your creative workflow.',
    chromeStoreUrl:
      'https://chromewebstore.google.com/detail/gemini-nano-flow/lidnnjbepijjbbphbdhcchgpckpcbgfm',
    features: [
      {
        title: 'Queue Management',
        description:
          'Add unlimited prompts and let PromptQueue automatically submit them to Gemini while you work. Set drip-feed timing, pause/resume anytime, and watch results come in automatically.',
      },
      {
        title: 'Bulk Image Generation',
        description:
          'Generate dozens or hundreds of images in one batch. Choose between Gemini 2.0 Flash or Imagen 3, and watch as images are automatically created and downloaded to your computer.',
      },
      {
        title: 'Bulk Translation & Optimization',
        description:
          'Translate your prompts instantly to 8+ languages for global campaigns. Optimize prompts across multiple AI providers to get better results. Localize content at scale in minutes.',
      },
      {
        title: 'Automation & Scheduling',
        description:
          'Schedule queue processing for specific times, enable automatic smart retry on failures, and set realistic timing between submissions to avoid rate limits. Set it and forget it.',
      },
      {
        title: 'Template System & Organization',
        description:
          'Save your favorite prompts as reusable templates and organize them into color-coded folders. Build a library of brand-consistent prompts and instantly reuse them for similar tasks.',
      },
      {
        title: 'Pro Unlimited Access',
        description:
          'Unlock unlimited prompts, advanced features, and priority support with Pro. Generate 500+ images monthly without limits. Perfect for high-volume creators and agencies.',
      },
    ],
  },
  'quick-apply': {
    id: 'quick-apply',
    name: 'QuickApply',
    tagline: 'Streamline Your Job Application Process with AI',
    description:
      'Automate and accelerate your job search with AI-powered form filling, resume customization, and application tracking. Apply to jobs faster and smarter.',
    features: [
      {
        title: 'AI-Powered Form Filling',
        description:
          'Auto-fill job applications using your profile data. Save time by letting AI populate common fields with your information.',
      },
      {
        title: 'Smart Resume Matching',
        description:
          'Customize your resume for each job posting. AI analyzes job descriptions and tailors your resume to highlight relevant skills.',
      },
      {
        title: 'Application Tracking',
        description:
          'Track all your applications in one place. Monitor status, deadlines, and follow-ups for every job you apply to.',
      },
      {
        title: 'One-Click Apply',
        description:
          'Apply to multiple jobs with a single click. Batch apply to similar positions and save hours of repetitive work.',
      },
      {
        title: 'Privacy Focused',
        description:
          'Your data stays on your device. No tracking, no analytics, and no sharing with third parties. Complete control over your information.',
      },
      {
        title: 'Job Recommendations',
        description:
          'Get AI-powered job suggestions based on your profile and preferences. Discover opportunities that match your skills and goals.',
      },
    ],
  },
  sorqa: {
    id: 'sorqa',
    name: 'Sorqa',
    tagline: 'Automate Prompt Generation & Queueing for Sora AI',
    description:
      'Supercharge your Sora AI workflow with automated prompt generation and queue management. Generate creative prompts using AI and automatically queue them for Sora video/image generation.',
    chromeStoreUrl:
      'https://chromewebstore.google.com/detail/sora-auto-queue-prompts/kbpbdckjechbjmnjagfkgcplmhdkkgph',
    features: [
      {
        title: 'AI-Powered Prompt Generation',
        description:
          'Generate high-quality prompts using OpenAI GPT models. Customize context and style for your specific needs. Batch generate 10, 50, or 100+ prompts at once.',
      },
      {
        title: 'Smart Queue Management',
        description:
          'Automatically queue prompts for Sora processing. Drag-and-drop to reorder, start, pause, resume, and stop queue at any time with real-time progress tracking.',
      },
      {
        title: 'Import & Export',
        description:
          'Import prompts from CSV files and export your prompts to CSV or JSON. Manual prompt entry option available for quick additions.',
      },
      {
        title: 'Customizable Settings',
        description:
          'Choose AI model (GPT-3.5-turbo, GPT-4, GPT-4-turbo). Adjust prompt length, style, and configure batch processing delays. Dark/Light theme support.',
      },
      {
        title: 'Privacy Focused',
        description:
          'Your API key is stored locally and never transmitted to our servers. No tracking or analytics. All data stays on your device.',
      },
      {
        title: 'Automated Processing',
        description:
          'Watch as prompts are submitted to Sora automatically. Perfect for AI artists, video generation enthusiasts, and anyone who needs bulk prompt processing.',
      },
    ],
  },
}) satisfies Record<string, AppMetadata>;
