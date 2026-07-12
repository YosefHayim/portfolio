import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiteFooter } from '@/Components/SiteFooter';
import { SiteHeader } from '@/Components/SiteHeader';
import { blogPosts, formatPostDate } from '@/data/blog';
import { asset } from '@/lib/utils';

export const BlogListPage = () => {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <div className="bg-void text-ink" id="top">
      <SiteHeader />
      <main className="px-5 pt-28 pb-24 sm:px-8 sm:pt-32 sm:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 sm:mb-16">
            <Link
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition hover:text-mint"
              to="/"
            >
              <ArrowLeft size={14} />
              Back to studio
            </Link>
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">
              Journal
            </p>
            <h1 className="text-[clamp(2.75rem,10vw,5.5rem)] leading-[0.9] font-semibold tracking-[-0.05em] text-white">
              NOTES
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
              Shipping stories, hard lessons, and the middle work that never makes the pitch deck.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((post) => (
              <Link
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-white/20"
                key={post.id}
                to={`/blog/${post.slug}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                  <img
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    decoding="async"
                    height={400}
                    loading="lazy"
                    src={asset(post.coverImage)}
                    width={640}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] tracking-[0.16em] text-zinc-300 uppercase backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-3 text-[11px] tracking-[0.14em] text-zinc-500 uppercase">
                    <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                    <span className="size-1 rounded-full bg-zinc-600" />
                    <span>{post.readingTime} min</span>
                  </div>
                  <h2 className="mt-2 text-lg leading-snug font-medium tracking-tight text-white">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium tracking-[0.08em] text-mint uppercase">
                    Read
                    <ArrowUpRight
                      className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.8}
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};
