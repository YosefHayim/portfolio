import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type BlogPost, getCategoryConfig } from '@/data/blog';
import { useLocale } from '@/i18n/localized';
import { cn } from '@/lib/utils';

// Raw row example: "Effect Belongs At The Edges" -> ["Effect", "Belongs", "At", "The", "Edges"]
const TITLE_WORD_PATTERN = /\s+/;

/**
 * Builds a short fallback mark from a blog title.
 *
 * @param title - Blog post title from authored content.
 * @returns Up to two uppercase initials, or an empty string when the title is empty.
 * @example
 * initialsFrom('Effect Belongs At The Edges') // 'EB'
 */
const initialsFrom = (title: string): string => {
  const trimmedTitle = title.trim();

  if (trimmedTitle.length === 0) return '';

  const words = trimmedTitle.split(TITLE_WORD_PATTERN);
  const initials: string[] = [];

  for (const word of words.slice(0, 2)) {
    const [firstLetter] = word;

    if (firstLetter !== undefined) {
      initials.push(firstLetter.toUpperCase());
    }
  }

  return initials.join('');
};

interface BlogCoverProps {
  post: BlogPost;
  className?: string;
  priority?: boolean;
}

/**
 * Post cover with a graceful fallback. If the generated image is missing (or
 * 404s), it renders an on-brand gradient keyed to the post's category color
 * instead of a broken image — mirrors the LogoBadge `onError` pattern used
 * elsewhere in the portfolio, so a cover-less post still looks intentional.
 */
export const BlogCover = ({ post, className, priority = false }: BlogCoverProps) => {
  const { t } = useTranslation();
  const { localize } = useLocale();
  const [imageFailed, setImageFailed] = useState(false);
  const category = getCategoryConfig(post.category);
  const title = localize(post.title);
  const showImage = Boolean(post.coverImage) && !imageFailed;
  const handleImageError = useCallback(() => setImageFailed(true), []);

  return (
    <div className={cn('relative overflow-hidden bg-[var(--bg-card)]', className)}>
      {showImage ? (
        <img
          alt={title}
          className="h-full w-full object-cover"
          height={900}
          loading={priority ? 'eager' : 'lazy'}
          onError={handleImageError}
          src={post.coverImage}
          width={1600}
        />
      ) : (
        <div
          aria-hidden={true}
          className={cn(
            'blog-cover-fallback flex h-full w-full items-center justify-center',
            category.accentClassName,
          )}
        >
          <span className="select-none font-mono text-6xl font-bold tracking-tight opacity-20 sm:text-7xl">
            {initialsFrom(title)}
          </span>
        </div>
      )}
      <span
        className={cn(
          'absolute top-3 left-3 rounded-full border border-[var(--border-subtle)] bg-black/40 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm',
          category.accentClassName,
        )}
      >
        {t(`categories.${post.category}`)}
      </span>
    </div>
  );
};
