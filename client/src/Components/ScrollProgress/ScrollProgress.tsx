import { motion, useScroll, useSpring } from 'framer-motion';

const SPRING_STIFFNESS = 100;
const SPRING_DAMPING = 30;
const REST_DELTA = 0.001;

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: SPRING_STIFFNESS,
    damping: SPRING_DAMPING,
    restDelta: REST_DELTA,
  });

  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-50 h-0.5 origin-left bg-gradient-to-r from-[#05df72] to-[#00d9ff]"
      style={{ scaleX }}
    />
  );
}

export default ScrollProgress;
