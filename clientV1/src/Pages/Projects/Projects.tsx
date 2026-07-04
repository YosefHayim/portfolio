import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Grid3X3, FolderOpen } from 'lucide-react';
import { AnimatedPage } from '@/Components/AnimatedPage/AnimatedPage';
import ProjectCard from './ProjectCard/ProjectCard';
import { projects as projectsData } from '@/data/projects';
import { staggerContainer, staggerItem } from '@/animations/variants';
import { useDebounce } from '@/hooks/useDebounce';
import {
  AnimatedFolder,
  type FolderProject,
} from '@/Components/ui/project-folder';

type FilterStatus = 'all' | 'live' | 'development' | 'completed';
type ViewMode = 'grid' | 'folders';

const filterOptions: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'live', label: 'Live' },
  { value: 'development', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const DEBOUNCE_DELAY_MS = 300;

const folderConfig: {
  status: FilterStatus;
  title: string;
  gradient: string;
}[] = [
  {
    status: 'live',
    title: 'Live Projects',
    gradient: 'linear-gradient(135deg, #05df72 0%, #04a859 100%)',
  },
  {
    status: 'development',
    title: 'In Development',
    gradient: 'linear-gradient(135deg, #fdc700 0%, #f59e0b 100%)',
  },
  {
    status: 'completed',
    title: 'Completed',
    gradient: 'linear-gradient(135deg, #00d9ff 0%, #0072ff 100%)',
  },
];

const Projects = () => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('folders');
  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY_MS);

  useEffect(() => {
    document.title = 'Projects';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredProjects = useMemo(() => {
    let result = projectsData;

    if (filter !== 'all') {
      result = result.filter((p) => p.status === filter);
    }

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      result = result.filter((project) => {
        const nameMatch = project.name.toLowerCase().includes(query);
        const descriptionMatch = project.description
          .toLowerCase()
          .includes(query);
        const techMatch = project.techStack.some((tech) =>
          tech.toLowerCase().includes(query)
        );
        return nameMatch || descriptionMatch || techMatch;
      });
    }

    return result;
  }, [filter, debouncedSearchQuery]);

  const projectsByStatus = useMemo(() => {
    const grouped: Record<string, FolderProject[]> = {
      live: [],
      development: [],
      completed: [],
    };

    const projectsToGroup = debouncedSearchQuery.trim()
      ? filteredProjects
      : projectsData;

    projectsToGroup.forEach((project) => {
      const status = project.status || 'completed';
      if (grouped[status]) {
        grouped[status].push({
          id: project.id,
          image: project.image,
          title: project.name,
          description: project.description,
          techStack: project.techStack,
          deployedUrl: project.deployedUrl,
          repoUrl: project.repoUrl,
          status: project.status,
        });
      }
    });

    return grouped;
  }, [filteredProjects, debouncedSearchQuery]);

  const getFilterCount = (status: FilterStatus): number => {
    if (status === 'all') {
      return debouncedSearchQuery.trim()
        ? filteredProjects.length
        : projectsData.length;
    }
    const baseFiltered = debouncedSearchQuery.trim()
      ? projectsData.filter((p) => {
          const query = debouncedSearchQuery.toLowerCase().trim();
          const nameMatch = p.name.toLowerCase().includes(query);
          const descriptionMatch = p.description.toLowerCase().includes(query);
          const techMatch = p.techStack.some((tech) =>
            tech.toLowerCase().includes(query)
          );
          return nameMatch || descriptionMatch || techMatch;
        })
      : projectsData;
    return baseFiltered.filter((p) => p.status === status).length;
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <AnimatedPage className="flex w-full flex-col items-center px-4 pb-20">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 w-full max-w-2xl pt-32 text-center"
      >
        <h1 className="mb-4 text-4xl font-medium tracking-tight text-[var(--text-primary)] md:text-5xl">
          Projects
        </h1>
        <p className="mx-auto py-4 text-lg text-[var(--text-secondary)]">
          A collection of things I've built, from automation tools to full-stack
          applications
        </p>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, description, or tech stack..."
              className="h-12 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] pr-10 pl-12 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#05df72] focus:ring-1 focus:ring-[#05df72]/50 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex h-12 items-center gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5">
            <button
              type="button"
              onClick={() => setViewMode('folders')}
              className={`flex h-full items-center justify-center rounded-lg px-3 transition-all ${
                viewMode === 'folders'
                  ? 'bg-[#05df72] text-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Folder View"
            >
              <FolderOpen size={20} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex h-full items-center justify-center rounded-lg px-3 transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#05df72] text-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Grid View"
            >
              <Grid3X3 size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 py-4">
          {filterOptions.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                filter === option.value
                  ? 'bg-[#05df72] text-black'
                  : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {option.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  filter === option.value
                    ? 'bg-black/20 text-black'
                    : 'grid grid-cols-2 gap-2 bg-[var(--bg-elevated)] py-2 text-[var(--text-muted)]'
                }`}
              >
                {getFilterCount(option.value)}
              </span>
            </motion.button>
          ))}
        </div>

        {debouncedSearchQuery && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-[var(--text-muted)]"
          >
            Showing {filteredProjects.length} result
            {filteredProjects.length !== 1 ? 's' : ''} for "
            {debouncedSearchQuery}"
          </motion.p>
        )}
      </motion.header>

      <AnimatePresence mode="wait">
        {viewMode === 'folders' ? (
          <motion.div
            key="folders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid w-full max-w-5xl grid-cols-1 justify-items-center gap-8 py-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {filter === 'all' ? (
              folderConfig.map(
                (folder) =>
                  projectsByStatus[folder.status].length > 0 && (
                    <motion.div
                      key={folder.status}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full"
                    >
                      <AnimatedFolder
                        title={folder.title}
                        projects={projectsByStatus[folder.status]}
                        gradient={folder.gradient}
                        className="w-full"
                        forceHover={
                          debouncedSearchQuery.trim().length > 0 &&
                          projectsByStatus[folder.status].length > 0
                        }
                      />
                    </motion.div>
                  )
              )
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="col-span-full w-full max-w-sm"
              >
                <AnimatedFolder
                  title={
                    folderConfig.find((f) => f.status === filter)?.title ||
                    'Projects'
                  }
                  projects={filteredProjects.map((p) => ({
                    id: p.id,
                    image: p.image,
                    title: p.name,
                    description: p.description,
                    techStack: p.techStack,
                    deployedUrl: p.deployedUrl,
                    repoUrl: p.repoUrl,
                    status: p.status,
                  }))}
                  gradient={
                    folderConfig.find((f) => f.status === filter)?.gradient
                  }
                  className="w-full"
                  forceHover={debouncedSearchQuery.trim().length > 0}
                />
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={`grid-${filter}-${debouncedSearchQuery}`}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="grid w-full max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredProjects.map((project) => (
              <motion.div key={project.id} variants={staggerItem}>
                <ProjectCard
                  project={project}
                  searchQuery={debouncedSearchQuery}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <p className="text-[var(--text-muted)]">
            No projects found matching your criteria.
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-sm text-[#05df72] transition-colors hover:text-[#04c566]"
            >
              Clear search
            </button>
          )}
        </motion.div>
      )}
    </AnimatedPage>
  );
};

export default Projects;
