import { motion, type Transition } from 'framer-motion';

const LINE_HEIGHT = 2;
const LINE_WIDTH = 24;
const GAP = 6;
const CONTAINER_HEIGHT = 20;
const ROTATION_ANGLE = 45;
const NEGATIVE_ROTATION_ANGLE = -45;
const ANIMATION_DURATION = 0.3;
const FADE_DURATION = 0.2;
const EASE_START = 0.4;
const EASE_END = 0.2;

const lineTransition: Transition = {
  duration: ANIMATION_DURATION,
  ease: [EASE_START, 0, EASE_END, 1] as const,
};

const fadeTransition: Transition = {
  duration: FADE_DURATION,
  ease: 'easeInOut',
};

type AnimatedHamburgerProps = {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
};

const AnimatedHamburger = ({
  isOpen,
  onClick,
  className = '',
}: AnimatedHamburgerProps) => {
  const lineOffset = GAP + LINE_HEIGHT;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-10 w-10 items-center justify-center ${className}`}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div
        className="relative"
        style={{ width: LINE_WIDTH, height: CONTAINER_HEIGHT }}
      >
        <motion.span
          className="absolute left-0 block rounded-full bg-white"
          style={{ width: LINE_WIDTH, height: LINE_HEIGHT, top: 0 }}
          animate={{
            rotate: isOpen ? ROTATION_ANGLE : 0,
            y: isOpen ? lineOffset : 0,
          }}
          transition={lineTransition}
        />
        <motion.span
          className="absolute left-0 block rounded-full bg-white"
          style={{
            width: LINE_WIDTH,
            height: LINE_HEIGHT,
            top: lineOffset,
          }}
          animate={{
            opacity: isOpen ? 0 : 1,
            scaleX: isOpen ? 0 : 1,
          }}
          transition={fadeTransition}
        />
        <motion.span
          className="absolute left-0 block rounded-full bg-white"
          style={{
            width: LINE_WIDTH,
            height: LINE_HEIGHT,
            top: lineOffset * 2,
          }}
          animate={{
            rotate: isOpen ? NEGATIVE_ROTATION_ANGLE : 0,
            y: isOpen ? -lineOffset : 0,
          }}
          transition={lineTransition}
        />
      </div>
    </button>
  );
};

export default AnimatedHamburger;
