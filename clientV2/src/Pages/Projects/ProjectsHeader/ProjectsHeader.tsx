import { motion } from "framer-motion";

const ProjectsHeader = () => {
  return (
    <motion.header
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 pt-32 text-center"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="mb-4 text-4xl font-medium tracking-tight text-[var(--text-primary)] md:text-5xl">
        Projects
      </h1>
      <p className="mx-auto max-w-md text-lg text-[var(--text-secondary)]">
        A collection of things I've built, from automation tools to full-stack
        applications
      </p>
    </motion.header>
  );
};

export default ProjectsHeader;
