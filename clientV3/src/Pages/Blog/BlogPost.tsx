import { format } from 'date-fns';
import { ArrowLeft, Clock } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { AnimatedPage } from '@/Components/AnimatedPage/AnimatedPage';
import { BlogContent } from '@/Components/Blog/BlogContent';
import { BlogCover } from '@/Components/Blog/BlogCover';
import { SEO } from '@/Components/SEO/SEO';
import { blogPosts, getCategoryConfig, getPostBySlug } from '@/data/blog';

const SITE_URL = 'https://josephsabag.dev';

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

        <BlogContent content={post.content} />

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
