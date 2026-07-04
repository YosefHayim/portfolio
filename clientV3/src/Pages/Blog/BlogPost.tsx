import { format } from 'date-fns';
import {
  ArrowLeft,
  Bot,
  Brain,
  Briefcase,
  Chrome,
  Clock,
  Code2,
  Cpu,
  Globe,
  GraduationCap,
  Lightbulb,
  LineChart,
  Package,
  Puzzle,
  Rocket,
  Shield,
  Smartphone,
  Sparkles,
  Store,
  Terminal,
  TrendingUp,
  Trophy,
  Users,
  Wand2,
  Wrench,
} from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { FaPython } from 'react-icons/fa';
import { SiBinance, SiExpo, SiTypescript } from 'react-icons/si';
import { Link, useParams } from 'react-router';
import { AnimatedPage } from '@/Components/AnimatedPage/AnimatedPage';
import { BlogCover } from '@/Components/Blog/BlogCover';
import { SEO } from '@/Components/SEO/SEO';
import { blogPosts, getCategoryConfig, getPostBySlug } from '@/data/blog';

const SITE_URL = 'https://josephsabag.dev';

const TAG_ICON_SIZE = 12;

const TAG_ICONS: Record<string, React.ReactNode> = {
  'origin story': <Sparkles size={TAG_ICON_SIZE} />,
  'self-taught': <GraduationCap size={TAG_ICON_SIZE} />,
  automation: <Wrench size={TAG_ICON_SIZE} />,
  'Bolt ASINs': <Rocket size={TAG_ICON_SIZE} />,
  'open source': <Package size={TAG_ICON_SIZE} />,
  MCP: <Cpu size={TAG_ICON_SIZE} />,
  'eBay API': <Store size={TAG_ICON_SIZE} />,
  TypeScript: <SiTypescript size={TAG_ICON_SIZE} className="text-[#3178C6]" />,
  OAuth: <Shield size={TAG_ICON_SIZE} />,
  'browser extensions': <Puzzle size={TAG_ICON_SIZE} />,
  Chrome: <Chrome size={TAG_ICON_SIZE} />,
  'ai-browser-bridge': <Globe size={TAG_ICON_SIZE} />,
  indie: <Lightbulb size={TAG_ICON_SIZE} />,
  AI: <Brain size={TAG_ICON_SIZE} />,
  'vibe coding': <Wand2 size={TAG_ICON_SIZE} />,
  ChatGPT: <Bot size={TAG_ICON_SIZE} />,
  'trading bots': <LineChart size={TAG_ICON_SIZE} />,
  Python: <FaPython size={TAG_ICON_SIZE} className="text-[#3776AB]" />,
  Binance: <SiBinance size={TAG_ICON_SIZE} className="text-[#F0B90B]" />,
  'Interactive Brokers': <TrendingUp size={TAG_ICON_SIZE} />,
  failure: <Trophy size={TAG_ICON_SIZE} />,
  'React Native': <Smartphone size={TAG_ICON_SIZE} />,
  Expo: <SiExpo size={TAG_ICON_SIZE} />,
  iOS: <Smartphone size={TAG_ICON_SIZE} />,
  'App Store': <Store size={TAG_ICON_SIZE} />,
  freelance: <Briefcase size={TAG_ICON_SIZE} />,
  career: <Briefcase size={TAG_ICON_SIZE} />,
  'first job': <Trophy size={TAG_ICON_SIZE} />,
  QA: <Code2 size={TAG_ICON_SIZE} />,
  Predicto: <LineChart size={TAG_ICON_SIZE} />,
  startup: <Rocket size={TAG_ICON_SIZE} />,
  dropshipping: <Store size={TAG_ICON_SIZE} />,
  lessons: <GraduationCap size={TAG_ICON_SIZE} />,
  'AI agents': <Bot size={TAG_ICON_SIZE} />,
  agentic: <Bot size={TAG_ICON_SIZE} />,
  'context engineering': <Terminal size={TAG_ICON_SIZE} />,
  SDLC: <Code2 size={TAG_ICON_SIZE} />,
  IDF: <Shield size={TAG_ICON_SIZE} />,
  discipline: <Shield size={TAG_ICON_SIZE} />,
  'career change': <Users size={TAG_ICON_SIZE} />,
  military: <Shield size={TAG_ICON_SIZE} />,
};

const TAG_LINKS: Record<string, string> = {
  automation: 'https://en.wikipedia.org/wiki/Automation',
  'open source': 'https://en.wikipedia.org/wiki/Open-source_software',
  MCP: 'https://modelcontextprotocol.io',
  'eBay API': 'https://developer.ebay.com',
  TypeScript: 'https://www.typescriptlang.org',
  OAuth: 'https://en.wikipedia.org/wiki/OAuth',
  'browser extensions': 'https://developer.chrome.com/docs/extensions',
  Chrome: 'https://www.google.com/chrome',
  'ai-browser-bridge': 'https://github.com/YosefHayim/ai-browser-bridge',
  AI: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
  ChatGPT: 'https://chat.openai.com',
  'trading bots': 'https://en.wikipedia.org/wiki/Algorithmic_trading',
  Python: 'https://www.python.org',
  Binance: 'https://www.binance.com',
  'Interactive Brokers': 'https://www.interactivebrokers.com',
  'React Native': 'https://reactnative.dev',
  Expo: 'https://expo.dev',
  iOS: 'https://developer.apple.com/ios',
  'App Store': 'https://developer.apple.com/app-store',
  QA: 'https://en.wikipedia.org/wiki/Quality_assurance',
  dropshipping: 'https://en.wikipedia.org/wiki/Drop_shipping',
  'AI agents': 'https://en.wikipedia.org/wiki/Intelligent_agent',
  SDLC: 'https://en.wikipedia.org/wiki/Systems_development_life_cycle',
  IDF: 'https://en.wikipedia.org/wiki/Israel_Defense_Forces',
};

const toParagraphs = (content: string): string[] =>
  content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

const REPO_LINKS: { pattern: RegExp; url: string }[] = [
  { pattern: /ebay[- ]?mcp/gi, url: 'https://github.com/YosefHayim/ebay-mcp' },
  { pattern: /ai[- ]?browser[- ]?bridge/gi, url: 'https://github.com/YosefHayim/ai-browser-bridge' },
  { pattern: /sora\s+auto\s+queue/gi, url: 'https://chromewebstore.google.com/detail/sora-auto-queue-prompts/kbpbdckjechbjmnjagfkgcplmhdkkgph' },
  { pattern: /batchbeam/gi, url: 'https://chromewebstore.google.com/detail/gemini-nano-flow/lidnnjbepijjbbphbdhcchgpckpcbgfm' },
  { pattern: /smallbites/gi, url: 'https://github.com/YosefHayim/Oly-App' },
  { pattern: /wisenotetaker/gi, url: 'https://github.com/YosefHayim/Oly-App' },
  { pattern: /fresh[- ]?squeezy/gi, url: 'https://github.com/YosefHayim/fresh-squeezy' },
  { pattern: /autods/gi, url: 'https://www.autods.com' },
];

const renderParagraphWithLinks = (text: string): React.ReactNode => {
  const combinedPattern = new RegExp(
    `(${REPO_LINKS.map((r) => r.pattern.source).join('|')})`,
    'gi',
  );

  const parts = text.split(combinedPattern);

  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        const match = REPO_LINKS.find((r) => new RegExp(r.pattern.source, 'i').test(part));
        if (match) {
          return (
            <a
              key={index}
              href={match.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#7ff7af] hover:underline"
            >
              {part}
            </a>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
};

export const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [post?.id]);

  const readNext = useMemo(() => {
    if (!post) {
      return [];
    }
    return [...blogPosts]
      .filter((candidate) => candidate.id !== post.id)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 3);
  }, [post]);

  if (!post) {
    return (
      <>
        <SEO noindex={true} title="Post not found" url={`/blog/${slug ?? ''}`} />
        <AnimatedPage className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 px-2 py-16">
          <h1 className="text-2xl font-semibold tracking-tight">That post doesn't exist</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            The link may be old or mistyped. Everything I've written is one click away.
          </p>
          <Link
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7ff7af] hover:underline"
            to="/blog"
          >
            <ArrowLeft size={14} />
            All writing
          </Link>
        </AnimatedPage>
      </>
    );
  }

  const category = getCategoryConfig(post.category);
  const paragraphs = toParagraphs(post.content);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}${post.coverImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { '@type': 'Person', name: post.author.name, url: SITE_URL },
    keywords: post.tags.join(', '),
    articleSection: category.label,
  };

  return (
    <>
      <SEO
        author={post.author.name}
        description={post.excerpt}
        image={post.coverImage}
        keywords={post.tags}
        modifiedTime={post.updatedAt}
        publishedTime={post.publishedAt}
        structuredData={structuredData}
        title={post.title}
        type="article"
        url={`/blog/${post.slug}`}
      />

      <AnimatedPage className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-1 py-3 sm:px-2 sm:py-4 md:gap-7 md:px-3 md:py-6">
        <Link
          className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] transition hover:text-[#7ff7af]"
          to="/blog"
        >
          <ArrowLeft size={14} />
          All writing
        </Link>

        <header className="flex flex-col gap-3">
          <span
            className="w-fit rounded-full border border-[var(--border-subtle)] px-2.5 py-1 text-[11px] font-medium"
            style={{ color: category.color }}
          >
            {category.label}
          </span>
          <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-2">
              <img
                alt={post.author.name}
                className="size-6 rounded-full object-cover"
                src={post.author.avatar}
              />
              {post.author.name}
            </span>
            <time dateTime={post.publishedAt}>
              {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
            </time>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime} min read
            </span>
          </div>
        </header>

        <BlogCover
          className="aspect-[16/9] w-full rounded-2xl border border-[var(--border-subtle)]"
          post={post}
          priority={true}
        />

        <article className="flex flex-col gap-5 text-[15px] leading-8 text-[var(--text-secondary)] md:text-base">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{renderParagraphWithLinks(paragraph)}</p>
          ))}
        </article>

        <div className="flex flex-wrap gap-2 border-t border-[var(--border-subtle)] pt-5">
          {post.tags.map((tag) => {
            const href = TAG_LINKS[tag];
            const icon = TAG_ICONS[tag];
            return href ? (
              <a
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--text-muted)] transition hover:border-[#05df72]/40 hover:text-[#7ff7af]"
                href={href}
                key={tag}
                rel="noopener noreferrer"
                target="_blank"
              >
                {icon}
                #{tag}
              </a>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--text-muted)]"
                key={tag}
              >
                {icon}
                #{tag}
              </span>
            );
          })}
        </div>

        {readNext.length > 0 && (
          <section className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-6">
            <h2 className="text-lg font-semibold tracking-tight">Read next</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {readNext.map((next) => (
                <Link
                  className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 transition hover:border-[#05df72]/40 hover:bg-[var(--bg-card-hover)]"
                  key={next.id}
                  to={`/blog/${next.slug}`}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: getCategoryConfig(next.category).color }}
                  >
                    {getCategoryConfig(next.category).label}
                  </span>
                  <h3 className="mt-1 line-clamp-2 text-sm leading-snug font-medium transition group-hover:text-[#7ff7af]">
                    {next.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </AnimatedPage>
    </>
  );
};

export default BlogPost;
