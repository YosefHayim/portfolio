import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { BlogCover } from '@/Components/Blog/BlogCover';
import { getRecentPosts } from '@/data/blog';
import { useLocale } from '@/i18n/localized';
import { SectionBlock } from './SectionBlock.tsx';

export const LatestWritingSection = () => {
  const { t } = useTranslation();
  const { localize } = useLocale();

  return (
    <SectionBlock
      description={t('sections.latestWritingDescription')}
      id="writing"
      title={t('sections.latestWriting')}
    >
      <div className="grid gap-2 md:grid-cols-3">
        {getRecentPosts(3).map((post) => (
          <Link
            className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] transition hover:border-brand/40 hover:bg-[var(--bg-card-hover)]"
            key={post.id}
            to={`/blog/${post.slug}`}
          >
            <BlogCover className="aspect-[16/9] w-full" post={post} />
            <div className="flex flex-1 flex-col gap-1.5 p-3">
              <h3 className="font-semibold text-sm leading-snug transition group-hover:text-brand-readable">
                {localize(post.title)}
              </h3>
              <p className="line-clamp-2 text-[var(--text-secondary)] text-xs leading-relaxed">
                {localize(post.excerpt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="pt-3">
        <Link
          className="inline-flex items-center gap-1.5 font-medium text-brand-readable text-sm hover:underline"
          to="/blog"
        >
          {t('projects.readAllWriting')}
        </Link>
      </div>
    </SectionBlock>
  );
};
