import { useState } from 'react';
import { type BlogPost, getCategoryConfig } from '@/data/blog';
import { cn } from '@/lib/utils';

const initialsFrom = (title: string): string =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

type BlogCoverProps = {
  post: BlogPost;
  className?: string;
  priority?: boolean;
};

/**
 * Post cover with a graceful fallback. If the generated image is missing (or
 * 404s), it renders an on-brand gradient keyed to the post's category color
 * instead of a broken image — mirrors the LogoBadge `onError` pattern used
 * elsewhere in the portfolio, so a cover-less post still looks intentional.
 */
export const BlogCover = ({ post, className, priority = false }: BlogCoverProps) => {
  const [failed, setFailed] = useState(false);
  const category = getCategoryConfig(post.category);
  const showImage = Boolean(post.coverImage) && !failed;

  return (
    <div className={cn('relative overflow-hidden bg-[var(--bg-card)]', className)}>
      {showImage ? (
        <img
          alt={post.title}
          className="h-full w-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
          src={post.coverImage}
        />
      ) : (
        <div
          aria-hidden={true}
          className="flex h-full w-full items-center justify-center"
          style={{
            background: `radial-gradient(120% 120% at 12% 12%, ${category.color}30, transparent 55%), linear-gradient(135deg, ${category.color}14, transparent 62%), var(--bg-surface)`,
          }}
        >
          <span
            className="select-none text-6xl font-bold tracking-tight opacity-20 sm:text-7xl"
            style={{ color: category.color, fontFamily: 'var(--code-font)' }}
          >
            {initialsFrom(post.title)}
          </span>
        </div>
      )}
      <span
        className="absolute top-3 left-3 rounded-full border border-[var(--border-subtle)] bg-black/40 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm"
        style={{ color: category.color }}
      >
        {category.label}
      </span>
    </div>
  );
};

export default BlogCover;
