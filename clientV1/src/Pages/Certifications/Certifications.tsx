import { staggerContainer, staggerItem } from '@/animations/variants';

import { AnimatedPage } from '@/Components/AnimatedPage/AnimatedPage';
import CertificationCards from './CertificationsCards/CertificationCards';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const Certifications = () => {
  useEffect(() => {
    document.title = 'Certifications';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AnimatedPage className="flex w-full flex-col items-center px-4 pb-20">
      <motion.header
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-12 pt-32 text-center"
      >
        <motion.h1
          variants={staggerItem}
          className="mb-4 text-4xl font-medium tracking-tight text-[var(--text-primary)] md:text-5xl"
        >
          Certifications
        </motion.h1>

        <motion.p
          variants={staggerItem}
          className="mx-auto max-w-lg text-lg text-[var(--text-secondary)]"
        >
          Professional certifications and courses completed to enhance technical
          expertise and stay current with industry standards
        </motion.p>
      </motion.header>

      <CertificationCards />
    </AnimatedPage>
  );
};

export default Certifications;
