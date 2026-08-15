        >
          <ArrowLeft size={14} />
          {t('blog.allWriting')}
        </Link>

        <header className="flex flex-col gap-3">
          <span
            className={cn(
              'w-fit rounded-full border border-[var(--border-subtle)] px-2.5 py-1 text-[11px] font-medium',
              category.accentClassName,
            )}
          >
            {categoryLabel}
          </span>
          <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-4xl">
            {title}
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
            <time dateTime={post.publishedAt}>{formatArticleDate(post.publishedAt, language)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} />
              {t('blog.minutesRead', { count: post.readingTime })}
            </span>
          </div>
        </header>

        <BlogCover
          className="aspect-[16/9] w-full rounded-2xl border border-[var(--border-subtle)]"
