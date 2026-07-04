import { motion } from 'framer-motion';
import { AnimatedPage } from '@/Components/AnimatedPage/AnimatedPage';
import { useEffect } from 'react';
import { FaDownload, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router';
import MyJourney from './MyJourney/MyJourney';

const STAGGER_DELAY = 0.1;
const CHILDREN_DELAY = 0.2;

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const About = () => {
  useEffect(() => {
    document.title = 'About | Joseph Sabag';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AnimatedPage className="flex w-full flex-col items-center px-4 pb-20">
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex w-full max-w-3xl flex-col items-center gap-12 pt-32"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="mb-4 text-4xl font-medium tracking-tight text-[var(--text-primary)] md:text-5xl">
            About me
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            The story behind the code
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="w-full">
          <motion.img
            src="/images-of-me/desktop-view.svg"
            alt="Desktop workspace view"
            className="w-full rounded-lg"
            width={800}
            height={600}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-6 text-center"
        >
          <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
            I'm <span className="text-[var(--text-primary)]">Joseph</span>, a AI
            software engineer who sees coding as a blend of creativity and
            problem-solving. I started with zero experience and built my way up
            through curiosity, persistence, and a lot of late nights.
          </p>

          <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
            From earning 2 excellence awards as an IDF combat commander to
            graduating with excellence from my bootcamp, I've learned that the
            best way to grow is to{' '}
            <span className="font-medium text-[#05df72]">
              build things that matter
            </span>
            .
          </p>

          <p className="text-lg text-[var(--text-muted)] italic">
            "Trying to get better everyday."
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <a href="/resume/yosef-hayim-full-stack-resume.pdf" download>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-full bg-[var(--text-primary)] px-6 py-3 font-medium text-[var(--bg-void)] transition-all"
            >
              <FaDownload size={16} />
              Download CV
            </motion.button>
          </a>

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
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-24 w-full max-w-4xl"
      >
        <MyJourney />
      </motion.div>
    </AnimatedPage>
  );
};

export default About;
