import {
  FiCheckCircle,
  FiCode,
  FiCpu,
  FiDatabase,
  FiDollarSign,
  FiGithub,
  FiGlobe,
  FiLayers,
  FiPackage,
  FiRefreshCw,
  FiServer,
  FiShield,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { IoArrowBack, IoCodeSlash, IoOpenOutline } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

import { AnimatedPage } from "@/Components/AnimatedPage/AnimatedPage";
import { SEO } from "@/Components/SEO/SEO";
import { FaWhatsapp } from "react-icons/fa";
import { TechBadge } from "@/utils/techIcons";
import { getProjectById, type ProjectStatus } from "@/data/projects";

const ICON_SIZE = 20;

const statusConfig: Record<ProjectStatus, { label: string; className: string; dot: string }> = {
  live: {
    label: "Live",
    className: "border border-[#05df72]/40 bg-[#05df72]/10 text-[#05df72]",
    dot: "bg-[#05df72]",
  },
  development: {
    label: "In Development",
    className: "border border-[#fdc700]/40 bg-[#fdc700]/10 text-[#fdc700]",
    dot: "bg-[#fdc700]",
  },
  completed: {
    label: "Completed",
    className: "border border-[#00d9ff]/40 bg-[#00d9ff]/10 text-[#00d9ff]",
    dot: "bg-[#00d9ff]",
  },
};

const getStatusArray = (status: ProjectStatus | ProjectStatus[] | undefined): ProjectStatus[] => {
  if (!status) return [];
  return Array.isArray(status) ? status : [status];
};

type IconComponent = typeof FiGlobe;

const highlightIconMap: Array<{ keywords: string[]; icon: IconComponent }> = [
  { keywords: ["marketplace", "integration"], icon: FiGlobe },
  { keywords: ["trademark", "patent", "verification"], icon: FiShield },
  { keywords: ["pricing", "payment", "stripe"], icon: FiDollarSign },
  { keywords: ["inventory", "sync", "real-time"], icon: FiRefreshCw },
  { keywords: ["api", "oauth"], icon: FiServer },
  { keywords: ["automated", "automation"], icon: FiZap },
  { keywords: ["database", "data"], icon: FiDatabase },
  { keywords: ["test", "coverage"], icon: FiCheckCircle },
  { keywords: ["npm", "package"], icon: FiPackage },
  { keywords: ["ai", "machine"], icon: FiCpu },
];

const getHighlightIcon = (highlight: string): IconComponent => {
  const lowerHighlight = highlight.toLowerCase();
  for (const mapping of highlightIconMap) {
    if (mapping.keywords.some((keyword) => lowerHighlight.includes(keyword))) {
      return mapping.icon;
    }
  }
  return FiCode;
};

const techCategoryMap: Record<string, string> = {
  "Next.js": "Frameworks & Languages",
  React: "Frameworks & Languages",
  "React Native": "Frameworks & Languages",
  TypeScript: "Frameworks & Languages",
  JavaScript: "Frameworks & Languages",
  Python: "Frameworks & Languages",
  "Node.js": "Frameworks & Languages",
  Express: "Frameworks & Languages",
  Playwright: "Testing & Quality",
  Jest: "Testing & Quality",
  Vitest: "Testing & Quality",
  Husky: "Testing & Quality",
  AWS: "Cloud & DevOps",
  Firebase: "Cloud & DevOps",
  Supabase: "Cloud & DevOps",
  "GitHub Actions": "Cloud & DevOps",
  "eBay API": "APIs & Integrations",
  "Amazon SP-API": "APIs & Integrations",
  "USA USPTO Trademarks API": "APIs & Integrations",
  "International WIPO Patents API": "APIs & Integrations",
  "Stripe API": "APIs & Integrations",
  "PayPal API": "APIs & Integrations",
  "Google API": "APIs & Integrations",
  "Telegram API": "APIs & Integrations",
  "Binance API": "APIs & Integrations",
  "Interactive Brokers API": "APIs & Integrations",
  "TMDB API": "APIs & Integrations",
  "OpenAI API": "APIs & Integrations",
  "Open AI Agents": "APIs & Integrations",
  OAuth: "APIs & Integrations",
  "OAuth 2.1": "APIs & Integrations",
};

const categorizeTech = (techStack: string[]): Record<string, string[]> => {
  const categories: Record<string, string[]> = {
    "Frameworks & Languages": [],
    "Testing & Quality": [],
    "Cloud & DevOps": [],
    "APIs & Integrations": [],
    "Tools & Libraries": [],
  };

  for (const tech of techStack) {
    const category = techCategoryMap[tech] ?? "Tools & Libraries";
    categories[category].push(tech);
  }

  return Object.fromEntries(
    Object.entries(categories).filter(([, techs]) => techs.length > 0),
  );
};

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = projectId ? getProjectById(projectId) : undefined;
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [project]);

  if (!project) {
    return (
      <>
        <SEO
          title="Project Not Found"
          description="The project you're looking for doesn't exist or has been moved."
          noindex
        />
        <AnimatedPage className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-4">
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
            initial={{ scale: 0.9, opacity: 0 }}
          >
            <h1 className="mb-4 text-4xl font-bold text-[var(--text-primary)]">
              Project not found
            </h1>
            <p className="mb-8 text-[var(--text-muted)]">
              The project you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-[#05df72] px-6 py-3 font-semibold text-black transition-all hover:bg-[#04c566] hover:shadow-[0_0_30px_rgba(5,223,114,0.4)]"
              onClick={() => navigate("/projects")}
              type="button"
            >
              <IoArrowBack size={ICON_SIZE} />
              Back to Projects
            </button>
          </motion.div>
        </AnimatedPage>
      </>
    );
  }

  const hasLiveUrl = project.deployedUrl && project.deployedUrl !== "projects";
  const statuses = getStatusArray(project.status);
  const categorizedTech = categorizeTech(project.techStack);

  return (
    <>
      <SEO
        title={project.name}
        description={project.longDescription || project.description}
        url={`/projects/${project.id}`}
        image={project.image}
        keywords={[project.name, ...project.techStack.slice(0, 5), "Project", "Portfolio"]}
      />
      <AnimatedPage className="min-h-screen w-full bg-[var(--bg-void)]">
      <motion.section
        className="relative overflow-hidden"
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 lg:py-16">
          <motion.button
            animate={{ opacity: 1, x: 0 }}
            className="group mb-8 flex items-center gap-2 text-[var(--text-muted)] transition-all hover:text-[#05df72]"
            initial={{ opacity: 0, x: -20 }}
            onClick={() => navigate("/projects")}
            transition={{ delay: 0.1 }}
            type="button"
          >
            <motion.span className="inline-block" whileHover={{ x: -4 }}>
              <IoArrowBack size={18} />
            </motion.span>
            <span className="text-sm font-medium">Back to Projects</span>
          </motion.button>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                {statuses.map((s, index) => {
                  const config = statusConfig[s];
                  return (
                    <motion.span
                      key={s}
                      animate={{ opacity: 1 }}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${config.className}`}
                      initial={{ opacity: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${config.dot}`}
                      />
                      {config.label}
                    </motion.span>
                  );
                })}
                <motion.span
                  animate={{ opacity: 1 }}
                  className="inline-flex justify-start gap-1.5 rounded-full bg-[var(--bg-card)] px-3 py-1.5 text-sm text-[var(--text-muted)]"
                  initial={{ opacity: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <FiLayers size={14} />
                  {project.techStack.length} technologies
                </motion.span>
              </div>

              <motion.h1
                animate={{ opacity: 1 }}
                className="text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {project.name}
              </motion.h1>

              <motion.p
                animate={{ opacity: 1 }}
                className="max-w-xl text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {project.longDescription ?? project.description}
              </motion.p>

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4 }}
              >
                {hasLiveUrl && (
                  <Link
                    className="inline-flex items-center gap-2 rounded-lg bg-[#05df72] px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#04c566]"
                    target="_blank"
                    to={project.deployedUrl}
                  >
                    <IoOpenOutline size={18} />
                    View Live
                  </Link>
                )}
                <Link
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-hover)] hover:text-[#05df72]"
                  target="_blank"
                  to={project.repoUrl}
                >
                  <FiGithub size={18} />
                  Source Code
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1 }}
              className="relative"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative aspect-video overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <picture>
                  <source srcSet={project.image} type="image/png" />
                  <img
                    alt={project.name}
                    className="h-full w-full object-cover object-top"
                    height={1080}
                    src={project.image}
                    width={1920}
                  />
                </picture>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {project.highlights && project.highlights.length > 0 && (
        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-card)]/30 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <motion.div
              className="mb-12 flex flex-col items-center justify-center py-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="mb-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
                Key Features
              </h2>
              <p className="mx-auto max-w-2xl text-[var(--text-muted)]">
                Powerful capabilities designed to solve real problems
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {project.highlights.map((highlight, index) => {
                const Icon = getHighlightIcon(highlight);
                return (
                  <motion.div
                    className="group relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/50 p-6 backdrop-blur-sm transition-all hover:border-[#05df72]/50 hover:bg-[var(--bg-card)] hover:shadow-[0_0_40px_rgba(5,223,114,0.15)]"
                    initial={{ opacity: 0, y: 30 }}
                    key={highlight}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#05df72]/0 via-[#05df72]/10 to-[#00d9ff]/0 opacity-0 transition-opacity group-hover:opacity-100" />

                    <div className="relative">
                      <motion.div
                        className="mb-4 inline-flex rounded-xl bg-[#05df72]/10 p-3 text-[#05df72]"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon size={24} />
                      </motion.div>
                      <h3 className="mb-2 font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[#05df72]">
                        {highlight}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="mb-4 flex items-center justify-center gap-3 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
              <IoCodeSlash className="text-[#00d9ff]" size={32} />
              Tech Stack
            </h2>
            <p className="w-full max-w-full py-2 text-[var(--text-muted)]">
              Built with modern, production-ready technologies
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(categorizedTech).map(
              ([category, techs], categoryIndex) => (
                <motion.div
                  className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/50 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 30 }}
                  key={category}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/50 px-5 py-4">
                    <h3 className="flex items-center justify-between font-semibold text-[var(--text-primary)]">
                      {category}
                      <span className="rounded-full bg-[#05df72]/20 px-2 py-0.5 text-xs text-[#05df72]">
                        {techs.length}
                      </span>
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 p-5">
                    {techs.map((tech, index) => (
                      <motion.div
                        className="transition-all"
                        initial={{ opacity: 0, scale: 0.8 }}
                        key={tech}
                        transition={{
                          delay: categoryIndex * 0.1 + index * 0.05,
                        }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                      >
                        <TechBadge tech={tech} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {project.collaborators && project.collaborators.length > 0 && (
        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-card)]/20 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="mb-4 flex items-center justify-center gap-3 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
                <FiUsers className="text-[#fdc700]" size={32} />
                Team
              </h2>
              <p className="mx-auto max-w-2xl text-[var(--text-muted)]">
                Built together with amazing collaborators
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-6">
              {project.collaborators.map((collaborator, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  key={collaborator.name}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                >
                  <Link
                    className="group flex items-center gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/50 px-6 py-4 backdrop-blur-sm transition-all hover:border-[#fdc700]/50 hover:bg-[var(--bg-card)] hover:shadow-[0_0_30px_rgba(253,199,0,0.15)]"
                    target="_blank"
                    to={collaborator.githubProfileLink}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fdc700]/10 transition-colors group-hover:bg-[#fdc700]/20">
                      <FiGithub className="text-[#fdc700]" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[#fdc700]">
                        {collaborator.name}
                      </p>
                      <p className="text-sm text-[var(--text-muted)]">
                        View GitHub Profile
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="w-full max-w-full px-4 text-center md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1 }}
          >
            <div className="mb-6 flex items-center justify-center rounded-xl p-3">
              <FiGithub className="text-[#05df72]" size={28} />
            </div>

            <h2 className="mb-3 text-center text-xl font-semibold text-[var(--text-primary)] md:text-2xl">
              Interested in this project?
            </h2>
            <p className="py-4 text-[var(--text-muted)]">
              Explore my code or reach out for collaboration.
            </p>

            <div className="flex w-full items-center justify-center gap-2">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#05df72] px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#04c566]"
                target="_blank"
                to={project.repoUrl}
              >
                <FiGithub size={18} />
                Star on GitHub
              </Link>
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--border-hover)] hover:text-[#05df72]"
                to="https://wa.me/546187549"
              >
                <FaWhatsapp size={18} />
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      </AnimatedPage>
    </>
  );
};

export default ProjectDetail;
