import type { Variants, Transition } from 'framer-motion';

const DURATION_FAST = 0.3;
const DURATION_NORMAL = 0.4;
const DURATION_SLOW = 0.5;
const OFFSET_SMALL = 20;
const OFFSET_MEDIUM = 30;
const EASE_EXPO_1 = 0.16;
const EASE_EXPO_2 = 1;
const EASE_EXPO_3 = 0.3;
const EASE_BACK_1 = 0.34;
const EASE_BACK_2 = 1.56;
const EASE_BACK_3 = 0.64;
const EASE_OUT_EXPO: Transition['ease'] = [
  EASE_EXPO_1,
  EASE_EXPO_2,
  EASE_EXPO_3,
  EASE_EXPO_2,
];
const EASE_OUT_BACK: Transition['ease'] = [
  EASE_BACK_1,
  EASE_BACK_2,
  EASE_BACK_3,
  EASE_EXPO_2,
];

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION_NORMAL, ease: 'easeOut' },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: OFFSET_SMALL },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_SLOW, ease: EASE_OUT_EXPO },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -OFFSET_SMALL },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_SLOW, ease: EASE_OUT_EXPO },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -OFFSET_MEDIUM },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION_SLOW, ease: EASE_OUT_EXPO },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: OFFSET_MEDIUM },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION_SLOW, ease: EASE_OUT_EXPO },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION_NORMAL, ease: EASE_OUT_BACK },
  },
};

export const slideInFromLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: DURATION_SLOW, ease: EASE_OUT_EXPO },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { duration: DURATION_FAST, ease: 'easeIn' },
  },
};

export const slideInFromRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: DURATION_SLOW, ease: EASE_OUT_EXPO },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: DURATION_FAST, ease: 'easeIn' },
  },
};

export const pageSlide: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: DURATION_NORMAL, ease: EASE_OUT_EXPO },
  },
  exit: {
    x: '-30%',
    opacity: 0,
    transition: { duration: DURATION_FAST, ease: 'easeIn' },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: OFFSET_SMALL },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_NORMAL, ease: EASE_OUT_EXPO },
  },
};

export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: DURATION_FAST, ease: EASE_OUT_EXPO },
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: DURATION_FAST, ease: EASE_OUT_EXPO },
  },
};

export const buttonTap = {
  scale: 0.97,
  transition: { duration: 0.1 },
};

export const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(5, 223, 114, 0)',
      '0 0 0 8px rgba(5, 223, 114, 0.3)',
      '0 0 0 0 rgba(5, 223, 114, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'easeInOut',
    },
  },
};

export const blinkCursor: Variants = {
  animate: {
    opacity: [1, 1, 0, 0],
    transition: {
      duration: 1,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'linear',
    },
  },
};

export const floatAnimation: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'easeInOut',
    },
  },
};

export const shimmer: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 1.5,
      repeat: Number.POSITIVE_INFINITY,
      ease: 'linear',
    },
  },
};
