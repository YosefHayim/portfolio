import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { repoRoot } from '../runCommand.ts';

const DRAFTS_DIR = path.join(repoRoot, 'clientV3/src/data/drafts');

/**
 * Turn free text into a URL-safe slug.
 *
 * Raw example: "Hello, World!" → "hello-world"
 *
 * @param raw - Title or slug fragment from the CLI
 * @returns Lowercase hyphenated slug
 */
const slugify = (raw: string): string => {
  // Raw row example: "eBay MCP: 322 tools!" → "ebay-mcp-322-tools"
  const lowered = raw.trim().toLowerCase();
  const dashed = lowered
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return dashed;
};

/**
 * Scaffold a draft blog post JSON for the publishing workflow.
 *
 * Does not mutate blog.ts — write the draft, then merge by hand.
 *
 * @param args - `[slugOrTitle]` required in non-interactive use
 * @returns 0 on success, 1 on usage/error
 */
export const runPostNew = async (args: readonly string[]): Promise<number> => {
  const slugSource = args[0];
  if (slugSource === undefined || slugSource.trim() === '') {
    console.error('Usage: portfolio post new <slug-or-title>');
    return 1;
  }

  const slug = slugify(slugSource);
  if (slug === '') {
    console.error('Could not derive a slug from:', slugSource);
    return 1;
  }

  const title =
    slugSource.includes(' ') || /[A-Z]/.test(slugSource)
      ? slugSource.trim()
      : slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

  const today = new Date().toISOString().slice(0, 10);
  const draft = {
    id: `draft-${slug}`,
    slug,
    title,
    excerpt: 'TODO: one-paragraph excerpt for the card and SEO.',
    content: `TODO: full post body for "${title}".\n\nWrite in first person. Ship the ugly true version.`,
    coverImage: `/blog/${slug}.png`,
    category: 'engineering',
    tags: [] as string[],
    author: {
      name: 'Joseph Sabag',
      avatar: '/images-of-me/hero-image.png',
    },
    publishedAt: today,
    readingTime: 3,
    featured: false,
  };

  await mkdir(DRAFTS_DIR, { recursive: true });
  const draftPath = path.join(DRAFTS_DIR, `${slug}.json`);
  await writeFile(draftPath, `${JSON.stringify(draft, null, 2)}\n`, 'utf8');

  console.log(`✓ draft scaffolded → ${path.relative(repoRoot, draftPath)}`);
  console.log('Next: merge into clientV3/src/data/blog.ts (+ Hebrew overlay), add cover art.');
  return 0;
};
