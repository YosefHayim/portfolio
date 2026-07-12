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
  index: number;
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
      className={`absolute overflow-hidden rounded-xl border border-white/10 bg-zinc-950/80 shadow-2xl ${className}`}
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

const ProjectSlide = ({ repo, index }: ProjectSlideProps) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const yPrimary = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.35, 1, 1, 0.35]);

  const tag = repo.language ?? 'Repository';
  const href = repo.homepage ?? repo.repoUrl;
  const hasStars = repo.stars > 0;
  const primaryLeft = index % 2 === 0;

  return (
    <article
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-5 py-20 sm:px-8"
      ref={ref}
    >
      <div className="pointer-events-none absolute inset-0 vignette" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(94,234,212,0.04),transparent_55%)]" />

      <motion.div className="relative z-10 text-center" style={{ opacity }}>
        <p className="mb-3 text-[11px] tracking-[0.22em] text-zinc-500 uppercase">{tag}</p>
        <h3 className="text-[clamp(2.5rem,8vw,5.5rem)] leading-none font-semibold tracking-[-0.05em] text-white">
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

      {/* One repo → one floating README hero (no neighbor reuse, no double tiles).
          Starred repos get a slightly larger tile so social proof reads first. */}
      <HeroTile
        className={`${primaryLeft ? 'left-[5%] sm:left-[8%]' : 'right-[5%] sm:right-[8%]'} top-[18%] ${
          hasStars
            ? 'h-48 w-72 sm:h-56 sm:w-[22rem] md:h-64 md:w-[26rem]'
            : 'h-40 w-60 sm:h-48 sm:w-72 md:h-52 md:w-80'
        }`}
        fallbackLabel={repo.name}
        src={repo.heroImage}
        y={yPrimary}
      />
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
        : slides.map((repo, index) => (
            <ProjectSlide index={index} key={repo.id} repo={repo} />
          ))}
    </section>
  );
};
