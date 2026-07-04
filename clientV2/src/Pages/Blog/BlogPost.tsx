import { motion, useScroll, useTransform } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Check,
  Share2,
  Twitter,
  Linkedin,
  Tag,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AnimatedPage } from "@/Components/AnimatedPage/AnimatedPage";
import { SEO } from "@/Components/SEO/SEO";
import {
  getPostBySlug,
  getRecentPosts,
  getCategoryConfig,
  type BlogPost as BlogPostType,
} from "@/data/blog";

const SITE_URL = "https://josephsabag.dev";

const processContent = (content: string): string => {
  let processed = content.trim();

  processed = processed.replace(
    /^# (.+)$/gm,
    '<h1 class="blog-h1">$1</h1>'
  );

  processed = processed.replace(
    /^## (.+)$/gm,
    '<h2 class="blog-h2">$1</h2>'
  );

  processed = processed.replace(
    /^### (.+)$/gm,
    '<h3 class="blog-h3">$1</h3>'
  );

  processed = processed.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    '<pre class="blog-code-block"><code>$2</code></pre>'
  );

  processed = processed.replace(
    /`([^`]+)`/g,
    '<code class="blog-inline-code">$1</code>'
  );

  processed = processed.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong class="blog-bold">$1</strong>'
  );

  processed = processed.replace(
    /\*([^*]+)\*/g,
    '<em class="blog-italic">$1</em>'
  );

  processed = processed.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="blog-link" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  processed = processed.replace(
    /^---$/gm,
    '<hr class="blog-divider" />'
  );

  const paragraphs = processed.split(/\n\n+/);
  processed = paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h1") ||
        trimmed.startsWith("<h2") ||
        trimmed.startsWith("<h3") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<hr") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol")
      ) {
        return trimmed;
      }
      return `<p class="blog-paragraph">${trimmed}</p>`;
    })
    .join("\n");

  return processed;
};

const RelatedPostCard = ({ post }: { post: BlogPostType }) => {
  const categoryConfig = getCategoryConfig(post.category);
  const formattedDate = format(new Date(post.publishedAt), "MMM d, yyyy");

  return (
    <Link to={`/blog/${post.slug}`}>
      <motion.article
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[0_0_30px_rgba(5,223,114,0.08)]"
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-60" />
          <div className="absolute top-3 right-3">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${categoryConfig.bgColor}`}
            >
              {categoryConfig.label}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              {formattedDate}
            </div>
            <span className="text-[var(--border-default)]">|</span>
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              {post.readingTime} min
            </div>
          </div>

          <h3 className="line-clamp-2 text-lg leading-tight font-medium text-[var(--text-primary)] transition-colors group-hover:text-[#05df72]">
            {post.title}
          </h3>

          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
            {post.excerpt}
          </p>
        </div>
      </motion.article>
    </Link>
  );
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;
  const heroRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.9]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [post]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return getRecentPosts(4)
      .filter((p) => p.slug !== post.slug)
      .slice(0, 3);
  }, [post]);

  const processedContent = useMemo(() => {
    if (!post) return "";
    return processContent(post.content);
  }, [post]);

  const shareUrl = post ? `${SITE_URL}/blog/${post.slug}` : SITE_URL;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      return;
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${post?.title} by @yosefhayim`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  if (!post) {
    return (
      <>
        <SEO
          title="Post Not Found"
          description="The blog post you're looking for doesn't exist or has been moved."
          noindex
        />
        <AnimatedPage className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-4">
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
            initial={{ scale: 0.9, opacity: 0 }}
          >
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#05df72]/20 to-[#00d9ff]/20">
              <span className="text-5xl font-bold text-[var(--text-muted)]">?</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold text-[var(--text-primary)]">
              Post not found
            </h1>
            <p className="mb-8 max-w-md text-[var(--text-muted)]">
              The blog post you're looking for doesn't exist or may have been moved.
            </p>
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-[#05df72] px-6 py-3 font-semibold text-black transition-all hover:bg-[#04c566] hover:shadow-[0_0_30px_rgba(5,223,114,0.4)]"
              onClick={() => navigate("/blog")}
              type="button"
            >
              <ArrowLeft size={20} />
              Back to Blog
            </button>
          </motion.div>
        </AnimatedPage>
      </>
    );
  }

  const categoryConfig = getCategoryConfig(post.category);
  const formattedDate = format(new Date(post.publishedAt), "MMMM d, yyyy");

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.startsWith("http")
      ? post.coverImage
      : `${SITE_URL}${post.coverImage}`,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Joseph Sabag",
      url: SITE_URL,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        url={`/blog/${post.slug}`}
        image={post.coverImage}
        type="article"
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        author={post.author.name}
        keywords={[post.title, ...post.tags, post.category, "Blog"]}
        structuredData={articleStructuredData}
      />
      <AnimatedPage className="min-h-screen w-full bg-[var(--bg-void)]">
        <motion.section
          ref={heroRef}
          className="relative h-[70vh] min-h-[500px] overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            style={{ y: heroY }}
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] via-[var(--bg-void)]/60 to-transparent"
            style={{ opacity: overlayOpacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-void)]/80 via-transparent to-[var(--bg-void)]/80" />

          <motion.div
            className="absolute top-8 left-8 z-20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => navigate("/blog")}
              type="button"
              className="group flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:border-[#05df72]/50 hover:bg-black/50 hover:text-[#05df72]"
            >
              <motion.span whileHover={{ x: -4 }} className="inline-block">
                <ArrowLeft size={18} />
              </motion.span>
              Back to Blog
            </button>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-end"
            style={{ opacity: heroOpacity }}
          >
            <div className="mx-auto w-full max-w-4xl px-4 pb-16 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${categoryConfig.bgColor}`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: categoryConfig.color }}
                  />
                  {categoryConfig.label}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
              >
                {post.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-6"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-12 w-12 rounded-full border-2 border-[#05df72]/50 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-white">{post.author.name}</p>
                    <p className="text-sm text-white/60">Author</p>
                  </div>
                </div>

                <div className="hidden h-10 w-px bg-white/20 md:block" />

                <div className="flex items-center gap-2 text-white/80">
                  <Calendar size={18} className="text-[#05df72]" />
                  <span>{formattedDate}</span>
                </div>

                <div className="flex items-center gap-2 text-white/80">
                  <Clock size={18} className="text-[#00d9ff]" />
                  <span>{post.readingTime} min read</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        <section className="relative">
          <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 lg:py-20">
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-16 border-t border-[var(--border-subtle)] pt-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Tag size={18} className="text-[var(--text-muted)]" />
                <span className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">
                  Tags
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-all hover:border-[#05df72]/50 hover:text-[#05df72]"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12 rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-elevated)]/50 p-8"
            >
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#05df72]/20 to-[#00d9ff]/20">
                  <Share2 size={24} className="text-[#05df72]" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-[var(--text-primary)]">
                    Enjoyed this article?
                  </h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    Share it with your network and help others discover it.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShareTwitter}
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-all hover:border-[#1DA1F2]/50 hover:text-[#1DA1F2]"
                    aria-label="Share on Twitter"
                  >
                    <Twitter size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShareLinkedIn}
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-all hover:border-[#0A66C2]/50 hover:text-[#0A66C2]"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyLink}
                    type="button"
                    className={`flex h-11 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-all ${
                      copied
                        ? "border-[#05df72]/50 bg-[#05df72]/10 text-[#05df72]"
                        : "border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[#05df72]/50 hover:text-[#05df72]"
                    }`}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? "Copied!" : "Copy Link"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {relatedPosts.length > 0 && (
          <section className="relative border-t border-[var(--border-subtle)] bg-gradient-to-b from-transparent via-[var(--bg-card)]/20 to-transparent py-20">
            <div className="mx-auto max-w-6xl px-4 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center"
              >
                <h2 className="mb-4 text-3xl font-bold text-[var(--text-primary)]">
                  Continue Reading
                </h2>
                <p className="mx-auto max-w-2xl text-[var(--text-muted)]">
                  More articles you might find interesting
                </p>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost, index) => (
                  <motion.div
                    key={relatedPost.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <RelatedPostCard post={relatedPost} />
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-12 text-center"
              >
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition-all hover:border-[#05df72]/50 hover:text-[#05df72]"
                >
                  View All Articles
                  <ArrowLeft size={18} className="rotate-180" />
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        <style>{`
          .blog-content {
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 1.125rem;
            line-height: 1.8;
            color: var(--text-secondary);
          }

          .blog-h1 {
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 2.25rem;
            font-weight: 700;
            color: var(--text-primary);
            margin: 2.5rem 0 1.5rem;
            line-height: 1.3;
            letter-spacing: -0.02em;
          }

          .blog-h2 {
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 1.75rem;
            font-weight: 600;
            color: #05df72;
            margin: 2.5rem 0 1rem;
            line-height: 1.4;
            letter-spacing: -0.01em;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--border-subtle);
          }

          .blog-h3 {
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 1.375rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 2rem 0 0.75rem;
            line-height: 1.4;
          }

          .blog-paragraph {
            margin: 1.25rem 0;
          }

          .blog-bold {
            font-weight: 600;
            color: var(--text-primary);
          }

          .blog-italic {
            font-style: italic;
            color: var(--text-secondary);
          }

          .blog-link {
            color: #05df72;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: all 0.2s ease;
          }

          .blog-link:hover {
            border-bottom-color: #05df72;
          }

          .blog-code-block {
            display: block;
            background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
            border: 1px solid var(--border-subtle);
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin: 1.5rem 0;
            overflow-x: auto;
            font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
            font-size: 0.875rem;
            line-height: 1.7;
          }

          .blog-code-block code {
            color: #e6edf3;
            white-space: pre;
          }

          .blog-inline-code {
            font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
            font-size: 0.875em;
            color: #00d9ff;
            background: rgba(0, 217, 255, 0.1);
            padding: 0.2em 0.4em;
            border-radius: 0.375rem;
          }

          .blog-divider {
            border: none;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--border-subtle) 20%, var(--border-subtle) 80%, transparent);
            margin: 3rem 0;
          }

          @media (max-width: 768px) {
            .blog-content {
              font-size: 1rem;
            }

            .blog-h1 {
              font-size: 1.75rem;
            }

            .blog-h2 {
              font-size: 1.5rem;
            }

            .blog-h3 {
              font-size: 1.25rem;
            }

            .blog-code-block {
              padding: 1rem;
              font-size: 0.8rem;
              border-radius: 0.5rem;
            }
          }
        `}</style>
      </AnimatedPage>
    </>
  );
};

export default BlogPost;
