import { AnimatePresence, motion } from 'framer-motion';
import { FolderGit2, GitCommitHorizontal, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CommitsGrid } from '@/Components/ui/commits-grid';
import { useGitHubStats } from '@/hooks/useGitHubStats';

const PASSION_PHRASES = [
  'SHIP IT',
  'BUILD',
  'CREATE',
  'DEPLOY',
  'HUSTLE',
  'SCALE',
  'GROW',
  'CODE',
];

const PHRASE_INTERVAL_MS = 3000;

const PassionSection = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const { stats, isLoading } = useGitHubStats();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % PASSION_PHRASES.length);
    }, PHRASE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <section className="flex w-full max-w-4xl flex-col items-center gap-8 px-6 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="mb-2 text-lg font-medium text-[var(--text-muted)]">
          Daily Motivation
        </h2>
        <p className="text-sm text-[var(--text-dim)]">
          What drives me every single day
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhraseIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <CommitsGrid text={PASSION_PHRASES[currentPhraseIndex]} />
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-6 text-center"
      >
        <div className="flex flex-col items-center">
          <span className="flex items-center gap-1 text-2xl font-bold text-[#05df72]">
            <GitCommitHorizontal className="size-5" />
            {isLoading ? '...' : formatNumber(stats?.totalCommits || 0)}
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            Total Commits
          </span>
        </div>

        <div className="h-8 w-px bg-[var(--border-subtle)]" />

        <div className="flex flex-col items-center">
          <span className="flex items-center gap-1 text-2xl font-bold text-[#00d9ff]">
            <FolderGit2 className="size-5" />
            {isLoading ? '...' : stats?.totalRepos || 0}
          </span>
          <span className="text-xs text-[var(--text-muted)]">Repositories</span>
        </div>

        <div className="h-8 w-px bg-[var(--border-subtle)]" />

        <div className="flex flex-col items-center">
          <span className="flex items-center gap-1 text-2xl font-bold text-[#fdc700]">
            <Star className="size-5" />
            {isLoading ? '...' : stats?.totalStars || 0}
          </span>
          <span className="text-xs text-[var(--text-muted)]">GitHub Stars</span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-md text-center text-sm text-[var(--text-dim)] italic"
      >
        "Every commit is a step forward. Every project is a lesson learned."
      </motion.p>
    </section>
  );
};

export default PassionSection;
