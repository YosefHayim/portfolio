import { format } from 'date-fns';
import { ArrowLeft, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { AnimatedPage } from '@/Components/AnimatedPage/AnimatedPage';
import { BlogCover } from '@/Components/Blog/BlogCover';
import { SEO } from '@/Components/SEO/SEO';
import {
  type BlogCategory,
  type BlogPost,
  blogPosts,
  getAllCategories,
  getCategoryConfig,
} from '@/data/blog';
import { cn } from '@/lib/utils';

type Filter = 'all' | BlogCategory;

const byNewest = (a: BlogPost, b: BlogPost): number =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

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
        ? 'border-[#05df72]/50 bg-[#05df72]/10 text-[#7ff7af]'
        : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]',
    )}
    onClick={onClick}
    type="button"
  >
    {label}
  </button>
);

const PostCard = ({ post, priority = false }: { post: BlogPost; priority?: boolean }) => (
  <Link
    className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] transition hover:border-[#05df72]/40 hover:bg-[var(--bg-card-hover)]"
    to={`/blog/${post.slug}`}
  >
    <BlogCover className="aspect-[16/9] w-full" post={post} priority={priority} />
    <div className="flex flex-1 flex-col gap-2 p-4">
      <h2 className="text-base leading-snug font-semibold tracking-tight transition group-hover:text-[#7ff7af] sm:text-lg">
        {post.title}
      </h2>
      <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
        {post.excerpt}
      </p>
      <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-[var(--text-muted)]">
        <time dateTime={post.publishedAt}>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</time>
        <span className="inline-flex items-center gap-1">
          <Clock size={12} />
          {post.readingTime} min
        </span>
      </div>
    </div>
  </Link>
);

export const BlogList = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const categories = getAllCategories();

  const posts = useMemo(() => {
    const sorted = [...blogPosts].sort(byNewest);
    return filter === 'all' ? sorted : sorted.filter((post) => post.category === filter);
  }, [filter]);

  return (
    <>
      <SEO
        description="Real stories from building things that ship the failed SaaS, the 3am fixes, and what actually worked. Writing by Joseph Sabag."
        keywords={[
          'Joseph Sabag',
          'blog',
          'engineering',
          'AI',
          'self-taught',
          'building in public',
        ]}
        title="Writing"
        url="/blog"
      />

      <AnimatedPage className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-1 py-3 sm:px-2 sm:py-4 md:gap-8 md:px-3 md:py-6">
        <header className="flex flex-col gap-3">
          <Link
            className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] transition hover:text-[#7ff7af]"
            to="/"
          >
            <ArrowLeft size={14} />
            Back to portfolio
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Writing</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
            No fluff, no listicles. Real stories from building things that actually ship the
            failures, the 3am fixes, and the stubbornness in between.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          <FilterChip active={filter === 'all'} label="All" onClick={() => setFilter('all')} />
          {categories.map((category) => (
            <FilterChip
              active={filter === category}
              key={category}
              label={getCategoryConfig(category).label}
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

export default BlogList;
