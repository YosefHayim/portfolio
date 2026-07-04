import { motion } from 'framer-motion';
import { FiArrowUpRight, FiGithub } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';
import type { Project } from '@/data/projects';
import { TechBadge } from '@/utils/techIcons';

const ICON_SIZE = 18;
const VISIBLE_TECH_COUNT = 4;

const statusConfig = {
  live: {
    label: 'Live',
    className: 'bg-[#05df72]/90 text-black',
    dot: 'bg-[#05df72]',
  },
  development: {
    label: 'In Progress',
    className: 'bg-[#fdc700]/90 text-black',
    dot: 'bg-[#fdc700] animate-pulse',
  },
  completed: {
    label: 'Completed',
    className: 'bg-[#00d9ff]/90 text-black',
    dot: 'bg-[#00d9ff]',
  },
};

type ProjectCardProps = {
  project: Project;
  searchQuery?: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  searchQuery = '',
}) => {
  const navigate = useNavigate();
  const hasLiveUrl = project.deployedUrl && project.deployedUrl !== 'projects';
  const status = project.status ? statusConfig[project.status] : null;

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const highlightMatch = (text: string): React.ReactNode => {
    if (!searchQuery.trim()) return text;

    const query = searchQuery.toLowerCase();
    const lowerText = text.toLowerCase();
    const index = lowerText.indexOf(query);

    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + searchQuery.length);
    const after = text.slice(index + searchQuery.length);

    return (
      <>
        {before}
        <span className="rounded bg-[#05df72]/20 px-0.5 text-[#05df72]">
          {match}
        </span>
        {after}
      </>
    );
  };

  const isMatchingTech = (tech: string): boolean => {
    if (!searchQuery.trim()) return false;
    return tech.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <motion.article
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-[0_0_30px_rgba(5,223,114,0.08)]"
    >
      <div className="relative aspect-video overflow-hidden">
        <picture>
          <source srcSet={project.image} type="image/png" />
          <img
            src={project.image}
            alt={project.name}
            width={400}
            height={225}
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-60" />

        {status && (
          <div
            className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${status.className}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-tight font-medium text-[var(--text-primary)] transition-colors group-hover:text-[#05df72]">
            {highlightMatch(project.name)}
          </h3>

          <div
            role="group"
            className="relative z-10 flex shrink-0 items-center gap-1"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Link
              to={project.repoUrl}
              target="_blank"
              className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              aria-label="View source code"
            >
              <FiGithub size={ICON_SIZE} />
            </Link>
            {hasLiveUrl && (
              <Link
                to={project.deployedUrl}
                target="_blank"
                className="rounded-lg p-2 text-[var(--text-muted)] transition-colors hover:bg-[#05df72]/10 hover:text-[#05df72]"
                aria-label="View live site"
              >
                <FiArrowUpRight size={ICON_SIZE} />
              </Link>
            )}
          </div>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-[var(--text-secondary)]">
          {highlightMatch(project.description)}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, VISIBLE_TECH_COUNT).map((tech) => (
            <span
              key={tech}
              className={`transition-all duration-200 ${
                isMatchingTech(tech) ? 'ring-1 ring-[#05df72]/50' : ''
              }`}
            >
              <TechBadge tech={tech} />
            </span>
          ))}
          {project.techStack.length > VISIBLE_TECH_COUNT && (
            <span className="rounded-full bg-[var(--bg-surface)] px-2.5 py-1 text-xs text-[var(--text-muted)]">
              +{project.techStack.length - VISIBLE_TECH_COUNT}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
