import postsJson from './blogPosts.json' with { type: 'json' };

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
  publishedAt: string;
  readingTime: number;
  featured?: boolean;
};

const BLOG_CATEGORIES = new Set<BlogCategory>([
  'engineering',
  'career',
  'tutorials',
  'thoughts',
  'projects',
]);

const asBlogCategory = (value: string): BlogCategory => {
  if (BLOG_CATEGORIES.has(value as BlogCategory)) {
    return value as BlogCategory;
  }
  return 'thoughts';
};

/**
 * Full journal corpus for v4 (English source from the living site).
 * Covers live under public/blog/; routes under /v4/blog/*.
 */
export const blogPosts: BlogPost[] = (postsJson as readonly BlogPost[]).map((post) => ({
  ...post,
  // Raw row example: "/blog/cover.webp" becomes "blog/cover.webp" for asset().
  coverImage: post.coverImage.replace(/^\//, ''),
  category: asBlogCategory(post.category),
}));

export const featuredPosts = blogPosts.filter((post) => post.featured);

/**
 * Looks up a journal note by URL slug.
 *
 * @param slug - Route slug.
 * @returns Matching post, or undefined.
 * @example
 * getPostBySlug('shipping-ios-for-real-smallbites')
 */
export const getPostBySlug = (slug: string): BlogPost | undefined =>
  blogPosts.find((post) => post.slug === slug);

/**
 * Recent notes sorted by publish date descending.
 *
 * @param limit - Max posts to return.
 * @returns Sorted post list.
 * @example
 * getRecentPosts(3)
 */
export const getRecentPosts = (limit = 6): BlogPost[] =>
  [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);

export const formatPostDate = (iso: string): string => {
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatPostDateLong = (iso: string): string => {
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
