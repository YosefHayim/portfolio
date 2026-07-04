import { motion } from "framer-motion";
import { useEffect } from "react";
import { FaDownload, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router";
import { AnimatedPage } from "@/Components/AnimatedPage/AnimatedPage";
import { SEO } from "@/Components/SEO/SEO";
import MyJourney from "./MyJourney/MyJourney";

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
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const About = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <SEO
        title="About"
        description="Learn about Joseph Sabag's journey from IDF combat commander to AI Software Engineer. Discover the story behind the code and my passion for building impactful software."
        url="/about"
        keywords={[
          "Joseph Sabag",
          "About",
          "Software Engineer",
          "IDF",
          "Full Stack Developer",
          "Career Journey",
          "Predicto AI",
        ]}
      />
      <AnimatedPage className="flex w-full flex-col items-center px-4 pb-20">
      <motion.section
        animate="visible"
        className="flex w-full max-w-3xl flex-col items-center gap-12 pt-32"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.div className="text-center" variants={itemVariants}>
          <h1 className="mb-4 text-4xl font-medium tracking-tight text-[var(--text-primary)] md:text-5xl">
            About me
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            The story behind the code
          </p>
        </motion.div>

        <motion.div className="w-full" variants={itemVariants}>
          <motion.img
            alt="Desktop workspace view"
            className="w-full rounded-lg"
            height={600}
            src="/images-of-me/desktop-view.svg"
            width={800}
          />
        </motion.div>

        <motion.div
          className="flex flex-col gap-6 text-center"
          variants={itemVariants}
        >
          <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
            I'm <span className="text-[var(--text-primary)]">Joseph</span>, a
            Software Developer dedicated to building robust backend architecture
            for superior products. Passionate about tackling complex API
            integrations, isolating system bottlenecks, and ensuring data
            integrity through rigorous DevOps and database design.
          </p>

          <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
            From earning 2 excellence awards as an IDF combat commander to
            graduating with excellence from my 795-hour bootcamp, I've learned
            that the best way to grow is to{" "}
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
          className="flex flex-col items-center gap-4 sm:flex-row"
          variants={itemVariants}
        >
          <a download href="/resume/yosef-hayim-full-stack-resume.pdf">
            <motion.button
              className="flex items-center gap-3 rounded-full bg-[var(--text-primary)] px-6 py-3 font-medium text-[var(--bg-void)] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaDownload size={16} />
              Download CV
            </motion.button>
          </a>

          <Link target="_blank" to="https://wa.me/546187549">
            <motion.button
              className="flex items-center gap-3 rounded-full border border-[var(--border-default)] bg-transparent px-6 py-3 font-medium text-[var(--text-primary)] transition-all hover:border-[#05df72]/50 hover:bg-[#05df72]/5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaWhatsapp className="text-[#05df72]" size={18} />
              Let's talk
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>

      <motion.div
        className="mt-24 w-full max-w-4xl"
        initial={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        whileInView={{ opacity: 1 }}
      >
        <MyJourney />
      </motion.div>
    </AnimatedPage>
    </>
  );
};

export default About;
