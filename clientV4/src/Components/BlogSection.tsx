import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeUp, staggerChildren } from '@/animations/variants';
import { blogPosts, formatPostDate, type BlogPost } from '@/data/blog';
import { asset } from '@/lib/utils';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => (
  <motion.div variants={fadeUp}>
    <Link
      className={
        featured
          ? 'group relative grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] md:grid-cols-[1.15fr_0.85fr]'
          : 'group flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition hover:border-white/20'
      }
      to={`/blog/${post.slug}`}
    >
      <div
        className={
          featured
            ? 'relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[320px]'
            : 'relative aspect-[16/10] overflow-hidden'
        }
      >
        <img
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          decoding="async"
          loading="lazy"
          src={asset(post.coverImage)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] tracking-[0.16em] text-zinc-300 uppercase backdrop-blur-sm">
          {post.category}
        </span>
      </div>

      <div className={featured ? 'flex flex-col justify-center p-6 sm:p-8' : 'flex flex-1 flex-col p-5'}>
        <div className="flex items-center gap-3 text-[11px] tracking-[0.14em] text-zinc-500 uppercase">
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          <span className="size-1 rounded-full bg-zinc-600" />
          <span>{post.readingTime} min</span>
        </div>
        <h3
          className={
            featured
              ? 'mt-3 text-2xl leading-tight font-medium tracking-tight text-white sm:text-3xl'
              : 'mt-2 text-lg leading-snug font-medium tracking-tight text-white'
          }
        >
          {post.title}
        </h3>
        <p
          className={
            featured
              ? 'mt-3 max-w-md text-sm leading-relaxed text-zinc-400'
              : 'mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500'
          }
        >
          {post.excerpt}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-zinc-300 transition group-hover:text-mint">
          Read
          <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  </motion.div>
);

export const BlogSection = () => {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const [featured, ...rest] = sorted;
  const secondary = rest.slice(0, 5);

  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32" id="journal">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(94,234,212,0.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between"
          initial="hidden"
          variants={fadeUp}
          viewport={{ once: true, margin: '-10%' }}
          whileInView="visible"
        >
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">
              Journal
            </p>
            <h2 className="text-[clamp(2.5rem,10vw,5.5rem)] leading-[0.9] font-semibold tracking-[-0.05em] text-white">
              NOTES
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
              Shipping stories, hard lessons, and the middle work that never makes the pitch deck.
            </p>
          </div>
          <Link
            className="inline-flex h-11 items-center self-start rounded-full border border-white/15 px-5 text-sm font-medium text-zinc-200 transition hover:border-white/30 hover:text-white sm:self-auto"
            to="/blog"
          >
            All notes
          </Link>
        </motion.div>

        <motion.div
          className="space-y-5"
          initial="hidden"
          variants={staggerChildren}
          viewport={{ once: true, margin: '-8%' }}
          whileInView="visible"
        >
          {featured && <BlogCard featured post={featured} />}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {secondary.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
