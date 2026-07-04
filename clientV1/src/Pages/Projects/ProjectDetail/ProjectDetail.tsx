import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import { IoArrowBack, IoOpenOutline } from 'react-icons/io5';
import { FiGithub } from 'react-icons/fi';
import { AnimatedPage } from '@/Components/AnimatedPage/AnimatedPage';
import { getProjectById } from '@/data/projects';
import { staggerContainer, staggerItem } from '@/animations/variants';
import { TechBadge } from '@/utils/techIcons';

const ICON_SIZE = 20;
const COLLABORATOR_ICON_SIZE = 16;

const statusConfig = {
  live: {
    label: 'Live',
    className: 'bg-[#05df72]/90 text-black',
  },
  development: {
    label: 'In Development',
    className: 'bg-[#fdc700]/90 text-black',
  },
  completed: {
    label: 'Completed',
    className: 'bg-[#00d9ff]/90 text-black',
  },
};

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = projectId ? getProjectById(projectId) : undefined;

  useEffect(() => {
    if (project) {
      document.title = `${project.name} | Projects`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project]);

  if (!project) {
    return (
      <AnimatedPage className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl text-[var(--text-primary)]">
          Project not found
        </h1>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-[#05df72] transition-colors hover:text-[#00d9ff]"
        >
          <IoArrowBack size={ICON_SIZE} />
          Back to Projects
        </button>
      </AnimatedPage>
    );
  }

  const hasLiveUrl = project.deployedUrl && project.deployedUrl !== 'projects';
  const status = project.status ? statusConfig[project.status] : null;

  return (
    <AnimatedPage className="min-h-screen w-full">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-[50vh] w-full overflow-hidden"
        >
          <picture>
            <source srcSet={project.image} type="image/png" />
            <img
              src={project.image}
              alt={project.name}
              width={1920}
              height={1080}
              className="h-full w-full object-cover object-top"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] via-[var(--bg-void)]/50 to-transparent" />
        </motion.div>

        <motion.button
          type="button"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/projects')}
          className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-[var(--text-primary)] backdrop-blur-sm transition-all hover:bg-black/70"
        >
          <IoArrowBack size={ICON_SIZE} />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        {status && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`absolute top-4 right-4 rounded-full px-4 py-2 text-sm font-semibold backdrop-blur-sm ${status.className}`}
          >
            {status.label}
          </motion.span>
        )}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto -mt-20 max-w-4xl px-4 pb-20 md:px-6"
      >
        <motion.h1
          variants={staggerItem}
          className="relative z-10 mb-6 text-3xl font-bold text-[var(--text-primary)] md:text-5xl"
        >
          {project.name}
        </motion.h1>

        <motion.p
          variants={staggerItem}
          className="mb-8 text-lg leading-relaxed text-[var(--text-secondary)]"
        >
          {project.longDescription || project.description}
        </motion.p>

        <motion.div
          variants={staggerItem}
          className="mb-10 flex flex-wrap gap-3"
        >
          {hasLiveUrl && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to={project.deployedUrl}
                target="_blank"
                className="flex items-center gap-2 rounded-xl bg-[#05df72] px-6 py-3 font-semibold text-black transition-all hover:bg-[#04c566] hover:shadow-[0_0_20px_rgba(5,223,114,0.3)]"
              >
                <IoOpenOutline size={ICON_SIZE} />
                View Live
              </Link>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to={project.repoUrl}
              target="_blank"
              className="flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-transparent px-6 py-3 font-semibold text-[var(--text-primary)] transition-all hover:border-[#05df72] hover:text-[#05df72]"
            >
              <FiGithub size={ICON_SIZE} />
              View Code
            </Link>
          </motion.div>
        </motion.div>

        {project.highlights && project.highlights.length > 0 && (
          <motion.div variants={staggerItem} className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-[#00d9ff]">
              Highlights
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {project.highlights.map((highlight) => (
                <motion.div
                  key={highlight}
                  whileHover={{ x: 4 }}
                  className="rounded-lg border-l-2 border-[#05df72] bg-[var(--bg-card)] p-4"
                >
                  <p className="text-[var(--text-secondary)]">{highlight}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div variants={staggerItem} className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-[#00d9ff]">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <motion.div
                key={tech}
                whileHover={{ scale: 1.05, y: -2 }}
                className="transition-all hover:shadow-[0_0_15px_rgba(5,223,114,0.15)]"
              >
                <TechBadge tech={tech} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {project.collaborators && project.collaborators.length > 0 && (
          <motion.div variants={staggerItem}>
            <h2 className="mb-4 text-xl font-semibold text-[#00d9ff]">
              Collaborators
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.collaborators.map((collaborator) => (
                <motion.div
                  key={collaborator.name}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link
                    to={collaborator.githubProfileLink}
                    target="_blank"
                    className="flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 transition-all hover:border-[#05df72] hover:text-[#05df72]"
                  >
                    <FiGithub size={COLLABORATOR_ICON_SIZE} />
                    <span className="font-medium">{collaborator.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatedPage>
  );
};

export default ProjectDetail;
