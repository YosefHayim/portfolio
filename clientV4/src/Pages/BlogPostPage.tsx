import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { BlogContent } from '@/Components/BlogContent';
import { SiteFooter } from '@/Components/SiteFooter';
import { SiteHeader } from '@/Components/SiteHeader';
import {
  blogPosts,
  formatPostDateLong,
  getPostBySlug,
} from '@/data/blog';
import { brand } from '@/data/content';
import { asset } from '@/lib/utils';

export const BlogPostPage = () => {
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
      <div className="bg-void text-ink">
        <SiteHeader />
        <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start gap-4 px-5 pt-32 pb-24 sm:px-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Note not found</h1>
          <p className="text-sm text-zinc-500">That journal slug does not exist on v4.</p>
          <Link
            className="inline-flex items-center gap-1.5 text-sm font-medium text-mint hover:underline"
            to="/blog"
          >
            <ArrowLeft size={14} />
            All notes
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="bg-void text-ink">
      <SiteHeader />
      <main className="px-5 pt-28 pb-24 sm:px-8 sm:pt-32 sm:pb-32">
        <article className="mx-auto max-w-3xl">
          <Link
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-mint"
            to="/blog"
          >
            <ArrowLeft size={14} />
            All notes
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-3 text-[11px] tracking-[0.16em] text-zinc-500 uppercase">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-zinc-300">
              {post.category}
            </span>
            <time dateTime={post.publishedAt}>{formatPostDateLong(post.publishedAt)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime} min read
            </span>
          </div>

          <h1 className="text-[clamp(2rem,6vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-white">
            {post.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {post.excerpt}
          </p>
          <p className="mt-3 text-sm text-zinc-600">By {brand.founder}</p>

          <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10">
            <img
              alt=""
              className="aspect-[16/9] w-full object-cover"
              decoding="async"
              src={asset(post.coverImage)}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="mt-10 border-t border-white/10 pt-10">
            <BlogContent content={post.content} />
          </div>

          {post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-white/10 pt-8">
              {post.tags.map((tag) => (
                <span
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] tracking-wide text-zinc-500"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {readNext.length > 0 && (
          <section className="mx-auto mt-20 max-w-3xl border-t border-white/10 pt-12">
            <p className="mb-6 text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">
              Read next
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {readNext.map((next) => (
                <Link
                  className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition hover:border-mint/25"
                  key={next.id}
                  to={`/blog/${next.slug}`}
                >
                  <img
                    alt=""
                    className="aspect-[16/10] w-full object-cover"
                    decoding="async"
                    loading="lazy"
                    src={asset(next.coverImage)}
                  />
                  <div className="p-4">
                    <h3 className="text-sm leading-snug font-medium text-white group-hover:text-mint">
                      {next.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};
