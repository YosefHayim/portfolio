import { FaArrowRight, FaWhatsapp } from 'react-icons/fa';

import { Link } from 'react-router';
import { motion } from 'framer-motion';

const STAGGER_DELAY = 0.1;
const ANIMATION_DURATION = 0.8;
const CHILDREN_DELAY = 0.2;
const ITEM_Y_OFFSET = 30;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY,
      delayChildren: CHILDREN_DELAY,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: ITEM_Y_OFFSET },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION,
      ease: 'easeOut' as const,
    },
  },
};

const Hero = () => {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex min-h-[80vh] w-full max-w-6xl flex-col items-center justify-center px-6 py-20 lg:flex-row lg:gap-12"
    >
      <motion.div
        variants={itemVariants}
        className="order-first mb-8 w-full max-w-xs lg:order-last lg:mb-0 lg:max-w-md lg:flex-1"
      >
        <img
          src="/images-of-me/hero-image.svg"
          alt="Joseph Sabag illustration"
          className="h-auto w-full"
          width={400}
          height={400}
        />
      </motion.div>

      <div className="flex flex-1 flex-col items-center lg:items-start">
        <motion.h1
          variants={itemVariants}
          className="mb-6 text-center text-4xl leading-[1.1] font-medium tracking-tight text-[var(--text-primary)] md:text-6xl lg:text-left lg:text-7xl"
        >
          Building digital tools
          <br />
          <span className="text-[var(--text-muted)]">that actually</span>{' '}
          <span className="relative">
            <span className="relative z-10 text-[#05df72]">matter</span>
            <motion.span
              className="absolute -inset-x-2 -z-0 rounded-lg bg-[#05df72]/10"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.5, ease: 'easeOut' }}
              style={{ originX: 0 }}
            />
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mb-12 max-w-xl text-center text-lg leading-relaxed text-[var(--text-secondary)] lg:text-left"
        >
          AI Software engineer who codes with intent. I automate the boring
          stuff, solve real problems, and ship products that help people work
          smarter.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-4 py-6 sm:flex-row"
        >
          <Link to="/projects">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 rounded-full bg-[var(--text-primary)] px-6 py-2 font-medium text-[var(--bg-void)] transition-all"
            >
              View my work
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>

          <Link to="https://wa.me/546187549" target="_blank">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-full border border-[var(--border-default)] bg-transparent px-6 py-3 font-medium text-[var(--text-primary)] transition-all hover:border-[#05df72]/50 hover:bg-[#05df72]/5"
            >
              <FaWhatsapp className="text-[#05df72]" size={18} />
              Let's talk
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex items-center gap-8 text-[var(--text-dim)]"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl font-semibold text-[var(--text-primary)]">
              10+
            </span>
            <span className="text-sm">Projects</span>
          </div>
          <div className="h-8 w-px bg-[var(--border-subtle)]" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-semibold text-[var(--text-primary)]">
              2+
            </span>
            <span className="text-sm">Years coding</span>
          </div>
          <div className="h-8 w-px bg-[var(--border-subtle)]" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-semibold text-[var(--text-primary)]">
              3x
            </span>
            <span className="text-sm">Excellence</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
