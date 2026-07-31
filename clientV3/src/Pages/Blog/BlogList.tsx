import { ArrowLeft, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { AnimatedPage } from '@/Components/AnimatedPage/AnimatedPage';
import { BlogCover } from '@/Components/Blog/BlogCover';
import { SEO } from '@/Components/SEO/SEO';
import { type BlogCategory, type BlogPost, blogPosts, getAllCategories } from '@/data/blog';
import { useLocale } from '@/i18n/localized';
import { cn } from '@/lib/utils';

type Filter = 'all' | BlogCategory;

const byNewest = (a: BlogPost, b: BlogPost): number =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

/**
 * Formats a blog publish date for the active UI language.
 *
 * @param isoDate - ISO date string from the blog post.
 * @param language - Normalized app language.
 * @returns Locale-aware compact publish date.
 * @example
 * formatPostDate('2026-07-06', 'he')
 */
const formatPostDate = (isoDate: string, language: string): string =>
  new Date(isoDate).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const FilterChip = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    className={cn(
      'rounded-full border px-3 py-1.5 text-xs font-medium transition',
      active
        ? 'border-brand/50 bg-brand/10 text-brand-readable'
        : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]',
    )}
    onClick={onClick}
    type="button"
  >
    {label}
  </button>
);

const PostCard = ({ post, priority = false }: { post: BlogPost; priority?: boolean }) => {
  const { t } = useTranslation();
  const { language, localize } = useLocale();

  return (
    <Link
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] transition hover:border-brand/40 hover:bg-[var(--bg-card-hover)]"
      to={`/blog/${post.slug}`}
    >
      <BlogCover className="aspect-[16/9] w-full" post={post} priority={priority} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-base leading-snug font-semibold tracking-tight transition group-hover:text-brand-readable sm:text-lg">
          {localize(post.title)}
        </h2>
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
          {localize(post.excerpt)}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-[var(--text-muted)]">
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, language)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            {t('blog.minutes', { count: post.readingTime })}
          </span>
        </div>
      </div>
    </Link>
  );
};

export const BlogList = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('all');
  const categories = getAllCategories();

  const posts = useMemo(() => {
    const sorted = [...blogPosts].sort(byNewest);
    return filter === 'all' ? sorted : sorted.filter((post) => post.category === filter);
  }, [filter]);

  return (
    <>
      <SEO
<<<<<<< HEAD
        description={t('seo.writingDescription')}
=======
        description="Real stories from building things that ship the failed SaaS, the 3am fixes, and what actually worked. Writing by Joseph Sabag."
>>>>>>> refs/heads/mac-reset-backup/2026-07-30/stash/000-afbb755efb3e
        keywords={[
          'Joseph Sabag',
          'blog',
          'engineering',
          'AI',
          'self-taught',
          'building in public',
        ]}
        title={t('seo.writingTitle')}
        url="/blog"
      />

      <AnimatedPage className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-1 py-3 sm:px-2 sm:py-4 md:gap-8 md:px-3 md:py-6">
        <header className="flex flex-col gap-3">
          <Link
            className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] transition hover:text-brand-readable"
            to="/"
          >
            <ArrowLeft size={14} />
            {t('blog.backToPortfolio')}
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{t('blog.title')}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
<<<<<<< HEAD
            {t('blog.intro')}
=======
            No fluff, no listicles. Real stories from building things that actually ship the
            failures, the 3am fixes, and the stubbornness in between.
>>>>>>> refs/heads/mac-reset-backup/2026-07-30/stash/000-afbb755efb3e
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={filter === 'all'}
            label={t('blog.all')}
            onClick={() => setFilter('all')}
          />
          {categories.map((category) => (
            <FilterChip
              active={filter === category}
              key={category}
              label={t(`categories.${category}`)}
              onClick={() => setFilter(category)}
            />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} priority={index < 3} />
          ))}
        </div>
      </AnimatedPage>
    </>
  );
};
