import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type AnimatedPageProps = {
  children: ReactNode;
  className?: string;
};

const SLIDE_OFFSET = 60;
const DURATION = 0.4;
const DURATION_EXIT = 0.3;
const REDUCED_DURATION = 0.2;
const REDUCED_EXIT = 0.15;
const EASE_1 = 0.16;
const EASE_2 = 1;
const EASE_3 = 0.3;

const pageVariants = {
  initial: {
    opacity: 0,
    x: SLIDE_OFFSET,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: DURATION,
      ease: [EASE_1, EASE_2, EASE_3, EASE_2],
    },
  },
  exit: {
    opacity: 0,
    x: -SLIDE_OFFSET,
    transition: {
      duration: DURATION_EXIT,
      ease: 'easeIn',
    },
  },
};

const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: REDUCED_DURATION } },
  exit: { opacity: 0, transition: { duration: REDUCED_EXIT } },
};

export function AnimatedPage({ children, className = '' }: AnimatedPageProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : pageVariants;

  return (
    <motion.div
      animate="animate"
      className={className}
      exit="exit"
      initial="initial"
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedPage;
