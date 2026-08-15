            <span className="inline-flex items-center gap-2">
              <img
                alt={post.author.name}
                className="size-6 rounded-full object-cover"
                src={post.author.avatar}
              />
              {post.author.name}
            </span>
            <time dateTime={post.publishedAt}>{formatArticleDate(post.publishedAt, language)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {t('blog.minutesRead', { count: post.readingTime })}
            </span>
          </div>
        </header>

        <BlogCover
          className="aspect-[16/9] w-full rounded-2xl border border-[var(--border-subtle)]"
          post={post}
          priority={true}
        />

        <BlogContent content={content} />

        <div className="flex flex-wrap gap-2 border-t border-[var(--border-subtle)] pt-5">
          {post.tags.map((tag) => {
            const href = TAG_LINKS[tag];
            const icon = TAG_ICONS[tag];
            return href ? (
              <a
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] px-2.5 py-1 text-xs text-[var(--text-muted)] transition hover:border-[#05df72]/40 hover:text-[#7ff7af]"
                href={href}
                key={tag}
                rel="noopener noreferrer"
                target="_blank"
              >
