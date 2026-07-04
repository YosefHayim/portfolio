import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { BookOpen, Calendar, Clock, Search, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { staggerContainer, staggerItem } from "@/animations/variants";
import { AnimatedPage } from "@/Components/AnimatedPage/AnimatedPage";
import { SEO } from "@/Components/SEO/SEO";
import {
  blogPosts,
  getFeaturedPosts,
  getCategoryConfig,
  type BlogCategory,
  type BlogPost,
} from "@/data/blog";
import { useDebounce } from "@/hooks/useDebounce";

type FilterCategory = "all" | BlogCategory;

const DEBOUNCE_DELAY_MS = 300;

const categoryFilters: { value: FilterCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "engineering", label: "Engineering" },
  { value: "career", label: "Career" },
  { value: "tutorials", label: "Tutorials" },
  { value: "thoughts", label: "Thoughts" },
  { value: "projects", label: "Projects" },
];

const BlogCard = ({
  post,
  searchQuery,
  isFeatured = false,
}: {
  post: BlogPost;
  searchQuery: string;
  isFeatured?: boolean;
}) => {
  const categoryConfig = getCategoryConfig(post.category);
  const formattedDate = format(new Date(post.publishedAt), "MMM d, yyyy");

  const highlightMatch = (text: string): React.ReactNode => {
    if (!searchQuery.trim()) return text;

    const query = searchQuery.toLowerCase();
    const lowerText = text.toLowerCase();
    const index = lowerText.indexOf(query);

    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + searchQuery.length);
    const after = text.slice(index + searchQuery.length);

    return (
      <>
        {before}
        <span className="rounded bg-[#05df72]/20 px-0.5 text-[#05df72]">
          {match}
        </span>
        {after}
      </>
    );
  };

  if (isFeatured) {
    return (
      <Link to={`/blog/${post.slug}`}>
        <motion.article
          className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[0_0_40px_rgba(5,223,114,0.12)] md:flex-row"
          whileHover={{ scale: 1.01, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#05df72] to-[#00d9ff] px-3 py-1.5 text-xs font-semibold text-black">
            <Sparkles size={12} />
            Featured
          </div>

          <div className="relative aspect-video w-full overflow-hidden md:aspect-auto md:w-1/2">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--bg-card)] opacity-0 md:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent md:hidden" />
          </div>

          <div className="flex flex-1 flex-col justify-center gap-4 p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${categoryConfig.bgColor}`}
              >
                {categoryConfig.label}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <Calendar size={12} />
                {formattedDate}
              </div>
            </div>

            <h2 className="text-2xl leading-tight font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[#05df72] md:text-3xl">
              {highlightMatch(post.title)}
            </h2>

            <p className="line-clamp-3 text-[var(--text-secondary)]">
              {highlightMatch(post.excerpt)}
            </p>

            <div className="mt-auto flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-8 w-8 rounded-full border border-[var(--border-subtle)] object-cover"
                />
                <span className="text-sm text-[var(--text-secondary)]">
                  {post.author.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                <Clock size={14} />
                {post.readingTime} min read
              </div>
            </div>
          </div>
        </motion.article>
      </Link>
    );
  }

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
            {highlightMatch(post.title)}
          </h3>

          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
            {highlightMatch(post.excerpt)}
          </p>

          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[var(--bg-surface)] px-2 py-0.5 text-xs text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="rounded-md bg-[var(--bg-surface)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

const Blog = () => {
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY_MS);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const featuredPosts = useMemo(() => getFeaturedPosts(), []);

  const filteredPosts = useMemo(() => {
    let result = blogPosts;

    if (filter !== "all") {
      result = result.filter((post) => post.category === filter);
    }

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      result = result.filter((post) => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const excerptMatch = post.excerpt.toLowerCase().includes(query);
        const tagMatch = post.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );
        const categoryMatch = post.category.toLowerCase().includes(query);
        return titleMatch || excerptMatch || tagMatch || categoryMatch;
      });
    }

    return result;
  }, [filter, debouncedSearchQuery]);

  const regularPosts = useMemo(() => {
    if (debouncedSearchQuery.trim() || filter !== "all") {
      return filteredPosts;
    }
    return filteredPosts.filter((post) => !post.featured);
  }, [filteredPosts, debouncedSearchQuery, filter]);

  const showFeatured = filter === "all" && !debouncedSearchQuery.trim();

  const getFilterCount = (category: FilterCategory): number => {
    if (category === "all") {
      return debouncedSearchQuery.trim() ? filteredPosts.length : blogPosts.length;
    }
    const baseFiltered = debouncedSearchQuery.trim()
      ? blogPosts.filter((post) => {
          const query = debouncedSearchQuery.toLowerCase().trim();
          const titleMatch = post.title.toLowerCase().includes(query);
          const excerptMatch = post.excerpt.toLowerCase().includes(query);
          const tagMatch = post.tags.some((tag) =>
            tag.toLowerCase().includes(query)
          );
          return titleMatch || excerptMatch || tagMatch;
        })
      : blogPosts;
    return baseFiltered.filter((post) => post.category === category).length;
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      <SEO
        title="Blog"
        description="Read Joseph Sabag's thoughts on software engineering, AI development, career advice, and technical tutorials. Insights from an AI Software Engineer's journey."
        url="/blog"
        keywords={[
          "Blog",
          "Software Engineering",
          "AI Development",
          "Career Advice",
          "Tutorials",
          "TypeScript",
          "React",
          "Full Stack",
        ]}
      />
      <AnimatedPage className="flex w-full flex-col items-center px-4 pb-20">
        <motion.header
          className="mb-12 w-full max-w-4xl pt-32 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#05df72]/20 to-[#00d9ff]/20 text-[#05df72]">
              <BookOpen size={24} />
            </div>
          </div>

          <h1 className="mb-4 text-4xl font-medium tracking-tight text-[var(--text-primary)] md:text-5xl">
            Blog
          </h1>
          <p className="mx-auto max-w-2xl py-4 text-lg text-[var(--text-secondary)]">
            Thoughts on software engineering, AI development, career pivots, and
            lessons learned building things that matter
          </p>

          <div className="mx-auto mb-6 max-w-xl">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-muted)]"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, content, or tags..."
                className="h-12 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] pr-10 pl-12 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#05df72] focus:ring-1 focus:ring-[#05df72]/50 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 py-4">
            {categoryFilters.map((option) => {
              const count = getFilterCount(option.value);
              const isDisabled = count === 0 && option.value !== "all";

              return (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => !isDisabled && setFilter(option.value)}
                  disabled={isDisabled}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    filter === option.value
                      ? "bg-[#05df72] text-black"
                      : isDisabled
                        ? "cursor-not-allowed bg-[var(--bg-surface)] text-[var(--text-dim)] opacity-50"
                        : "bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)]"
                  }`}
                  whileHover={!isDisabled ? { scale: 1.02 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                >
                  {option.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      filter === option.value
                        ? "bg-black/20 text-black"
                        : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                    }`}
                  >
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {debouncedSearchQuery && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-[var(--text-muted)]"
            >
              Showing {filteredPosts.length} result
              {filteredPosts.length !== 1 ? "s" : ""} for "
              {debouncedSearchQuery}"
            </motion.p>
          )}
        </motion.header>

        <AnimatePresence mode="wait">
          {showFeatured && featuredPosts.length > 0 && (
            <motion.section
              key="featured"
              className="mb-16 w-full max-w-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
                <h2 className="flex items-center gap-2 text-sm font-medium tracking-wider text-[var(--text-muted)] uppercase">
                  <Sparkles size={14} className="text-[#05df72]" />
                  Featured Articles
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
              </div>

              <motion.div
                className="flex flex-col gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {featuredPosts.map((post) => (
                  <motion.div key={post.id} variants={staggerItem}>
                    <BlogCard
                      post={post}
                      searchQuery={debouncedSearchQuery}
                      isFeatured
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>

        <section className="w-full max-w-6xl">
          {!showFeatured && (
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
              <h2 className="text-sm font-medium tracking-wider text-[var(--text-muted)] uppercase">
                {filter !== "all"
                  ? `${categoryFilters.find((c) => c.value === filter)?.label} Articles`
                  : "Search Results"}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
            </div>
          )}

          {showFeatured && regularPosts.length > 0 && (
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
              <h2 className="text-sm font-medium tracking-wider text-[var(--text-muted)] uppercase">
                All Articles
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`grid-${filter}-${debouncedSearchQuery}`}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              {regularPosts.map((post) => (
                <motion.div key={post.id} variants={staggerItem}>
                  <BlogCard post={post} searchQuery={debouncedSearchQuery} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <motion.div
              className="mt-12 flex flex-col items-center gap-4 py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-surface)]">
                <BookOpen size={28} className="text-[var(--text-muted)]" />
              </div>
              <p className="text-[var(--text-muted)]">
                No articles found matching your criteria.
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-sm text-[#05df72] transition-colors hover:text-[#04c566]"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          )}
        </section>
      </AnimatedPage>
    </>
  );
};

export default Blog;
