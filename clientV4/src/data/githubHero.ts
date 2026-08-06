export const GITHUB_USERNAME = 'YosefHayim';

// Raw row example: '![alt](public/hero.png)' captures "public/hero.png".
const MD_IMAGE_REGEX = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
// Raw row example: '<img src="assets/cover.png">' captures "assets/cover.png".
const HTML_IMAGE_REGEX = /<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi;

const BADGE_HOST_HINTS = [
  'img.shields.io',
  'shields.io',
  'badge.',
  'badgen.net',
  'github.com/badges',
  'camo.githubusercontent.com',
] as const;

const HERO_NAME_HINTS = ['hero', 'cover', 'banner', 'og', 'social', 'preview', 'logo'] as const;

/** Known README hero paths for first-paint reliability (raw CDN — no API quota). */
const KNOWN_HERO_PATHS: Record<string, readonly string[]> = {
  'ebay-mcp': ['public/ebay-mcp-hero.png'],
  planpage: ['public/hero.png'],
  'fresh-squeezy': ['public/fresh-squeezy-hero.png'],
  'launch-store': ['assets/launch-v4.png', 'assets/launch-v3.png'],
  dufflebag: ['public/hero.png'],
  'ai-browser-bridge': ['assets/hero.png'],
  'agent-session-pack': ['assets/hero.png', 'public/hero.png'],
  'tim-trailers': ['public/hero.png', 'assets/hero.png'],
};

const COMMON_HERO_PATHS = [
  'public/hero.png',
  'public/cover.png',
  'public/banner.png',
  'assets/hero.png',
  'assets/cover.png',
  'docs/hero.png',
  'media/hero.png',
  'images/hero.png',
] as const;

const isBadgeUrl = (url: string): boolean => {
  const lower = url.toLowerCase();
  return BADGE_HOST_HINTS.some((hint) => lower.includes(hint));
};

const isImageUrl = (url: string): boolean => {
  // Raw row example: "https://cdn.example/x.png?v=1" → check path before query.
  const clean = url.split('?')[0]?.toLowerCase() ?? '';
  return (
    clean.endsWith('.png') ||
    clean.endsWith('.jpg') ||
    clean.endsWith('.jpeg') ||
    clean.endsWith('.webp') ||
    clean.endsWith('.gif') ||
    clean.endsWith('.svg') ||
    clean.includes('/raw/') ||
    clean.includes('raw.githubusercontent.com') ||
    clean.includes('user-images.githubusercontent.com') ||
    clean.includes('opengraph.githubassets.com')
  );
};

/** GitHub social-preview cards are not product/README heroes. */
const isOpenGraphCard = (url: string): boolean =>
  url.includes('opengraph.githubassets.com') ||
  url.includes('repository-images.githubusercontent.com');

// Raw row example: path "/docs/hero.png" → "docs/hero.png" in the raw.githubusercontent URL.
const rawFileUrl = (repoName: string, branch: string, path: string): string =>
  `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${branch}/${path.replace(/^\/+/, '')}`;

/**
 * Turns a README-relative image path into a raw.githubusercontent.com URL.
 *
 * @param src - Image src from markdown/HTML.
 * @param repoName - Repository name.
 * @param branch - Default branch.
 * @returns Absolute image URL, or null if unusable.
 * @example
 * absoluteReadmeImageUrl('public/hero.png', 'ebay-mcp', 'main')
 */
export const absoluteReadmeImageUrl = (
  src: string,
  repoName: string,
  branch: string,
): string | null => {
  // Raw row example: "<public/hero.png>" becomes "public/hero.png".
  const trimmed = src.trim().replace(/^<|>$/g, '');
  if (!trimmed || trimmed.startsWith('data:')) {
    return null;
  }

  // Decode HTML entities that show up in GitHub README HTML fragments.
  // Raw row example: "&amp;" / "&quot;" / "&#39;" → & / " / '
  const decoded = trimmed
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
    return isBadgeUrl(decoded) ? null : decoded;
  }

  // Raw row example: "./docs/hero.png" or "/docs/hero.png" → "docs/hero.png".
  const path = decoded.replace(/^\.\//, '').replace(/^\/+/, '');
  if (!path || path.startsWith('#')) {
    return null;
  }

  const absolute = rawFileUrl(repoName, branch, path);
  return isBadgeUrl(absolute) ? null : absolute;
};

/**
 * Picks the best hero image URL from a README body.
 * Prefers names containing hero/cover/banner, then first non-badge image.
 *
 * @param readme - Decoded README markdown.
 * @param repoName - Repository name.
 * @param branch - Default branch.
 * @returns Hero URL or null.
 * @example
 * pickReadmeHeroImage('<img src="public/hero.png">', 'planpage', 'main')
 */
export const pickReadmeHeroImage = (
  readme: string,
  repoName: string,
  branch: string,
): string | null => {
  const candidates: string[] = [];

  for (const match of readme.matchAll(HTML_IMAGE_REGEX)) {
    if (match[1]) {
      candidates.push(match[1]);
    }
  }
  for (const match of readme.matchAll(MD_IMAGE_REGEX)) {
    if (match[1]) {
      candidates.push(match[1]);
    }
  }

  const resolved = candidates
    .map((src) => absoluteReadmeImageUrl(src, repoName, branch))
    .filter((url): url is string => url !== null && isImageUrl(url));

  if (resolved.length === 0) {
    return null;
  }

  const preferred = resolved.find((url) => {
    const lower = url.toLowerCase();
    return HERO_NAME_HINTS.some((hint) => lower.includes(hint));
  });

  return preferred ?? resolved[0] ?? null;
};

/**
 * HEAD-probes a raw.githubusercontent URL. Returns the URL when the file exists.
 */
const probeRawUrl = async (url: string): Promise<string | null> => {
  try {
    const head = await fetch(url, { method: 'HEAD' });
    if (head.ok) {
      return url;
    }

    // Some CDNs reject HEAD — fall back to a tiny ranged GET.
    const ranged = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-0' },
    });
    if (ranged.ok || ranged.status === 206) {
      return url;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Resolves a README hero without the GitHub REST API (avoids rate limits).
 * Order: known paths → raw README parse → common hero filenames.
 *
 * @param repoName - Repository name.
 * @param branch - Default branch.
 * @returns Absolute raw image URL, or null.
 */
export const fetchReadmeHero = async (
  repoName: string,
  branch: string,
): Promise<string | null> => {
  const key = repoName.toLowerCase();
  const known = KNOWN_HERO_PATHS[key] ?? [];
  const guessed = [
    ...known,
    `public/${repoName}-hero.png`,
    `public/${key}-hero.png`,
    `assets/${repoName}-hero.png`,
    ...COMMON_HERO_PATHS,
  ];
  const uniquePaths = [...new Set(guessed)];

  const probes = await Promise.all(
    uniquePaths.map(async (path) => probeRawUrl(rawFileUrl(repoName, branch, path))),
  );
  const firstHit = probes.find((url): url is string => Boolean(url));
  if (firstHit) {
    return firstHit;
  }

  try {
    const response = await fetch(rawFileUrl(repoName, branch, 'README.md'));
    if (!response.ok) {
      return null;
    }

    const readmeBody = await response.text();
    const picked = pickReadmeHeroImage(readmeBody, repoName, branch);
    if (!picked || isOpenGraphCard(picked)) {
      return null;
    }

    if (picked.startsWith('https://raw.githubusercontent.com/')) {
      return probeRawUrl(picked);
    }

    if (picked.startsWith('http')) {
      return picked;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Drops GitHub OG social cards so only real README art is kept.
 *
 * @param heroImage - Candidate hero URL.
 * @returns Cleaned URL or null.
 */
export const cleanHeroImage = (heroImage: string | null): string | null => {
  if (!heroImage || isOpenGraphCard(heroImage)) {
    return null;
  }
  return heroImage;
};
