import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { fadeIn, fadeUp } from '@/animations/variants';
import { GitHubStatsStrip } from '@/Components/GitHubStatsStrip';
import {
  fallbackGitHubRepos,
  formatRepoUpdatedAt,
  type GitHubRepoPreview,
} from '@/data/github';
import { useGitHubSnapshot } from '@/hooks/useGitHubSnapshot';
import { asset } from '@/lib/utils';

interface ProjectSlideProps {
  repo: GitHubRepoPreview;
}

/**
 * Resolves absolute README heroes or local public assets.
 *
 * @param src - URL or path under /v4/.
 * @returns Usable img src.
 */
const resolveImageSrc = (src: string): string => {
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  return asset(src);
};

interface HeroTileProps {
  src: string | null;
  fallbackLabel: string;
  className: string;
  y: ReturnType<typeof useTransform<number, number>>;
}

const HeroTile = ({ src, fallbackLabel, className, y }: HeroTileProps) => {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <motion.div
      className={`overflow-hidden rounded-xl border border-white/10 bg-zinc-950/80 shadow-2xl ${className}`}
      style={{ y }}
    >
      {showImage && src ? (
        <img
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-top"
          decoding="async"
          loading="lazy"
          onError={() => setFailed(true)}
          // raw.githubusercontent.com is fine without a document referrer
          referrerPolicy="no-referrer"
          src={resolveImageSrc(src)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(ellipse_at_30%_20%,rgba(94,234,212,0.14),transparent_60%)]">
          <span className="max-w-[90%] truncate px-2 font-mono text-[10px] tracking-[0.16em] text-zinc-500 uppercase">
            {fallbackLabel}
          </span>
        </div>
      )}
    </motion.div>
  );
};

const ProjectSlide = ({ repo }: ProjectSlideProps) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const yPrimary = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.35, 1, 1, 0.35]);

  const tag = repo.language ?? 'Repository';
  const href = repo.homepage ?? repo.repoUrl;
  const hasStars = repo.stars > 0;

  return (
    <article
      className="relative flex min-h-[70vh] flex-col items-center justify-center gap-10 overflow-hidden px-5 py-16 sm:px-8 sm:py-20"
      ref={ref}
    >
      <div className="pointer-events-none absolute inset-0 vignette" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(94,234,212,0.04),transparent_55%)]" />

      {/* One repo → one README hero, centered above the copy so nothing overlaps at
          any width. Parallax drift keeps the cinematic feel of the old float. */}
      <HeroTile
        className={`relative w-full max-w-sm sm:max-w-md md:max-w-lg ${
          hasStars ? 'h-48 sm:h-56 md:h-64' : 'h-44 sm:h-52 md:h-56'
        }`}
        fallbackLabel={repo.name}
        src={repo.heroImage}
        y={yPrimary}
      />

      <motion.div className="relative z-10 max-w-2xl text-center" style={{ opacity }}>
        <p className="mb-3 text-[11px] tracking-[0.22em] text-zinc-500 uppercase">{tag}</p>
        <h3 className="text-[clamp(2rem,7vw,5rem)] leading-none font-semibold tracking-[-0.05em] text-white">
          {repo.name}
        </h3>
        <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400">{repo.description}</p>
        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-zinc-600">
          {hasStars ? (
            <span className="inline-flex items-center gap-1.5 tabular-nums text-zinc-400">
              <img
                alt=""
                aria-hidden="true"
                className="size-5 object-contain drop-shadow-[0_0_12px_rgba(94,234,212,0.5)] sm:size-6"
                decoding="async"
                height={24}
                src={asset('images-of-me/stat-star-3d.webp')}
                style={{ transform: 'rotateY(18deg) rotateX(10deg)' }}
                width={24}
              />
              {repo.stars}
            </span>
          ) : null}
          <span>Updated {formatRepoUpdatedAt(repo.updatedAt)}</span>
        </div>
        <a
          className="mt-6 inline-block border-b border-white/40 pb-0.5 text-sm text-zinc-200 transition hover:border-mint hover:text-mint"
          href={href}
          rel="noreferrer"
          target="_blank"
        >
          {repo.homepage ? 'Open project' : 'View on GitHub'}
        </a>
      </motion.div>
    </article>
  );
};

const TheaterSkeleton = ({ index }: { index: number }) => (
  <article className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-5 py-20">
    <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-4">
      <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
      <div className="h-12 w-3/4 animate-pulse rounded bg-white/10" />
      <div className="h-4 w-full animate-pulse rounded bg-white/5" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-white/5" />
    </div>
    <div
      className={`absolute ${index % 2 === 0 ? 'left-[12%]' : 'right-[12%]'} top-[18%] h-36 w-52 animate-pulse rounded-md border border-white/5 bg-white/[0.04]`}
    />
  </article>
);

export const ProjectTheater = () => {
  const { stats, repos, isLoading, source } = useGitHubSnapshot();
  const slides = repos.length > 0 ? repos : fallbackGitHubRepos;

  return (
    <section id="work">
      <motion.div
        className="flex min-h-[40vh] items-center justify-center px-5 py-16"
        initial="hidden"
        variants={fadeIn}
        viewport={{ once: true }}
        whileInView="visible"
      >
        <h2 className="text-[clamp(2.75rem,12vw,7rem)] font-semibold tracking-[-0.06em] text-white">
          PROJECTS
        </h2>
      </motion.div>

      <motion.p
        className="mx-auto mb-4 max-w-lg px-5 text-center text-sm text-zinc-500"
        initial="hidden"
        variants={fadeUp}
        viewport={{ once: true }}
        whileInView="visible"
      >
        Live public graph — README heroes from each repo, sorted by last push.
      </motion.p>

      <GitHubStatsStrip isLoading={isLoading} source={source} stats={stats} />

      {isLoading && repos.length === 0
        ? [0, 1, 2].map((slot) => <TheaterSkeleton index={slot} key={`sk-${slot}`} />)
        : slides.map((repo) => <ProjectSlide key={repo.id} repo={repo} />)}
    </section>
  );
};
