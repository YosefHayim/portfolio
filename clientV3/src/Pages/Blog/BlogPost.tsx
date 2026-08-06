import { ArrowLeft, Clock } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { AnimatedPage } from '@/Components/AnimatedPage/AnimatedPage';
import { BlogContent } from '@/Components/Blog/BlogContent';
import { BlogCover } from '@/Components/Blog/BlogCover';
import { SEO } from '@/Components/SEO/SEO';
import {
  type BlogPost as BlogPostRecord,
  blogPosts,
  getCategoryConfig,
  getPostBySlug,
} from '@/data/blog';
import { useLocale } from '@/i18n/localized';
import { cn } from '@/lib/utils';

const SITE_URL = 'https://josephsabag.dev';
const READ_NEXT_LIMIT = 3;

/**
 * Formats a full blog publish date for the active UI language.
 *
 * @param isoDate - ISO date string from the blog post.
 * @param language - Normalized app language.
 * @returns Locale-aware long publish date.
 * @example
 * formatArticleDate('2026-07-06', 'he')
 */
const formatArticleDate = (isoDate: string, language: string): string =>
  new Date(isoDate).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

/**
 * Builds the canonical not-found URL for a missing blog route.
 *
 * @param slug - Optional route slug from React Router params.
 * @returns Blog detail path used for noindex metadata.
 * @example
 * postNotFoundUrl('missing-post') // '/blog/missing-post'
 */
const postNotFoundUrl = (slug: string | undefined): string => {
  if (slug === undefined) return '/blog/';

  return `/blog/${slug}`;
};

const byNewest = (left: BlogPostRecord, right: BlogPostRecord): number =>
  new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();

/**
 * Picks a few recent posts that are not the current article.
 *
 * @param currentPost - Article currently on screen.
 * @returns Up to three newer/other posts for the "read next" rail.
 */
const readNextPosts = (currentPost: BlogPostRecord): BlogPostRecord[] =>
  blogPosts
    .filter((candidate) => candidate.id !== currentPost.id)
    .sort(byNewest)
    .slice(0, READ_NEXT_LIMIT);

export const BlogPost = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const { language, localize } = useLocale();
  const post = slug === undefined ? undefined : getPostBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [post?.id]);

  const readNext = useMemo(() => {
    if (post === undefined) return [];

    return readNextPosts(post);
  }, [post]);

  if (post === undefined) {
    return (
      <>
        <SEO noindex={true} title={t('seo.postNotFoundTitle')} url={postNotFoundUrl(slug)} />
        <AnimatedPage className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 px-2 py-16">
          <h1 className="text-2xl font-semibold tracking-tight">{t('blog.notFoundTitle')}</h1>
          <p className="text-sm text-[var(--text-secondary)]">{t('blog.notFoundBody')}</p>
          <Link
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-readable hover:underline"
            to="/blog"
          >
            <ArrowLeft size={14} />
            {t('blog.allWriting')}
          </Link>
        </AnimatedPage>
      </>
    );
  }

  const category = getCategoryConfig(post.category);
  const title = localize(post.title);
  const excerpt = localize(post.excerpt);
  const content = localize(post.content);
  const categoryLabel = t(`categories.${post.category}`);
  const modifiedAt = post.updatedAt ?? post.publishedAt;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    image: `${SITE_URL}${post.coverImage}`,
    datePublished: post.publishedAt,
    dateModified: modifiedAt,
    author: { '@type': 'Person', name: post.author.name, url: SITE_URL },
    keywords: post.tags.join(', '),
    articleSection: categoryLabel,
  };

  return (
    <>
      <SEO
        author={post.author.name}
        description={excerpt}
        image={post.coverImage}
        keywords={post.tags}
        modifiedTime={post.updatedAt}
        publishedTime={post.publishedAt}
        structuredData={structuredData}
        title={title}
        type="article"
        url={`/blog/${post.slug}`}
      />

      <AnimatedPage className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-1 py-3 sm:px-2 sm:py-4 md:gap-7 md:px-3 md:py-6">
        <Link
          className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] transition hover:text-brand-readable"
          to="/blog"
        >
          <ArrowLeft size={14} />
          {t('blog.allWriting')}
        </Link>

        <header className="flex flex-col gap-3">
          <span
            className={cn(
              'w-fit rounded-full border border-[var(--border-subtle)] px-2.5 py-1 text-[11px] font-medium',
              category.accentClassName,
            )}
          >
            {categoryLabel}
          </span>
          <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-4xl">
            {title}
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
            <time dateTime={post.publishedAt}>{formatArticleDate(post.publishedAt, language)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {t('blog.minutesRead', { count: post.readingTime })}
            </span>
          </div>
        </header>

        <BlogCover
          className="aspect-[16/9] w-full rounded-2xl border border-[var(--border-subtle)]"
          post={post}
          priority={true}
        />

        <BlogContent content={content} />

        <div className="flex flex-wrap gap-2 border-t border-[var(--border-subtle)] pt-5">
          {post.tags.map((tag) => (
            <span
              className="rounded-full border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--text-muted)]"
              key={tag}
            >
              #{tag}
            </span>
          ))}
        </div>

        {readNext.length > 0 && (
          <section className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-6">
            <h2 className="text-lg font-semibold tracking-tight">{t('blog.readNext')}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {readNext.map((nextPost) => (
                <Link
                  className="group rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 transition hover:border-brand/40 hover:bg-[var(--bg-card-hover)]"
                  key={nextPost.id}
                  to={`/blog/${nextPost.slug}`}
                >
                  <span
                    className={cn(
                      'text-xs font-medium',
                      getCategoryConfig(nextPost.category).accentClassName,
                    )}
                  >
                    {t(`categories.${nextPost.category}`)}
                  </span>
                  <h3 className="mt-1 line-clamp-2 text-sm leading-snug font-medium transition group-hover:text-brand-readable">
                    {localize(nextPost.title)}
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
