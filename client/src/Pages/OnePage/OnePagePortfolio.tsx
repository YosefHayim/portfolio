import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ExternalLink,
  FileText,
  FolderGit2,
  Github,
  GitCommitHorizontal,
  Mail,
  Smartphone,
  Star,
  Users,
} from "lucide-react";
import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { useState, type ReactNode } from "react";
import { AnimatedPage } from "@/Components/AnimatedPage/AnimatedPage";
import { SEO } from "@/Components/SEO/SEO";
import {
  coreTechStack,
  experienceItems,
  featuredOffGitHubProjects,
  recruiterProfile,
} from "@/content/profile";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import { useChromeExtensionUsers } from "@/hooks/useChromeExtensionUsers";
import { useGitHubProjects } from "@/hooks/useGitHubProjects";
import { useGitHubStats } from "@/hooks/useGitHubStats";
import { cn } from "@/lib/utils";
import { getTechIcon } from "@/utils/techIcons";

const sectionTitleClass = "text-2xl font-semibold tracking-tight md:text-3xl";

const SOCIAL_ICON_SIZE = 14;

const actionLinkClass =
  "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-2.5 text-xs font-medium hover:border-[#05df72]/50";

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });
};

/**
 * Total months between two "YYYY-MM" ISO month strings, inclusive of both
 * months — matches how tenure is usually counted on a CV ("Feb–Apr 2025" is
 * three months, not two).
 */
const monthsInclusive = (startIso: string, endIso: string): number => {
  const [startY, startM] = startIso.split("-").map(Number);
  const [endY, endM] = endIso.split("-").map(Number);
  if (!startY || !startM || !endY || !endM) {
    return 0;
  }
  return (endY - startY) * 12 + (endM - startM) + 1;
};

/** Human-readable tenure label like "11 mos" or "1 yr 2 mos". */
const formatTenure = (months: number): string => {
  if (months <= 0) {
    return "";
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const monthPart = remainingMonths === 1 ? "1 mo" : `${remainingMonths} mos`;
  if (years === 0) {
    return monthPart;
  }
  const yearPart = years === 1 ? "1 yr" : `${years} yrs`;
  if (remainingMonths === 0) {
    return yearPart;
  }
  return `${yearPart} ${monthPart}`;
};

const tenureLabel = (item: {
  startDate?: string;
  endDate?: string;
}): string => {
  if (!item.startDate) {
    return "";
  }
  const endIso =
    item.endDate ?? new Date().toISOString().slice(0, 7); // "YYYY-MM"
  return formatTenure(monthsInclusive(item.startDate, endIso));
};

/**
 * Project-name → brand logo. Lets us swap the generic Github mark on a few
 * repos. Keys are matched case-insensitively against either the GitHub repo
 * slug ("ebay-mcp") or the curated display name ("eBay MCP API Server"), so
 * both live and fallback feeds resolve.
 */
const REPO_LOGO_OVERRIDES: Record<string, { src: string; alt: string }> = {
  "ebay-mcp": { src: "/logos/ebay.svg", alt: "eBay logo" },
  "ebay mcp api server": { src: "/logos/ebay.svg", alt: "eBay logo" },
  "fresh-squeezy": { src: "/logos/lemon-squeezy.svg", alt: "Lemon Squeezy logo" },
  "tim-trailers": { src: "/logos/tim-trailers.png", alt: "Tim Trailers logo" },
};

const findRepoLogoOverride = (projectName: string) =>
  REPO_LOGO_OVERRIDES[projectName.trim().toLowerCase()];

const SectionBlock = ({
  id,
  title,
  description,
  className,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}) => {
  return (
    <section className={cn("w-full max-w-6xl scroll-mt-24", className)} id={id}>
      <header className="space-y-1.5 pb-3 sm:space-y-2">
        <h2 className={sectionTitleClass}>{title}</h2>
        {description && (
          <p className="max-w-3xl text-sm text-[var(--text-secondary)] md:text-base">
            {description}
          </p>
        )}
      </header>
      {children}
    </section>
  );
};

const TechIconChip = ({ tech }: { tech: string }) => {
  const icon = getTechIcon(tech);
  const fallbackLabel = tech
    .split(/[\s-/]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          aria-label={tech}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-void)]/50 text-[var(--text-secondary)]"
        >
          {icon ?? (
            <span className="text-[10px] font-semibold">
              {fallbackLabel || "?"}
            </span>
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        {tech}
      </TooltipContent>
    </Tooltip>
  );
};

const LogoBadge = ({
  src,
  alt,
  monogram,
  icon,
}: {
  src?: string;
  alt: string;
  monogram?: string;
  icon: ReactNode;
}) => {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <span className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border-subtle)] bg-[var(--bg-void)]/40">
      {showImage ? (
        <img
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
          src={src}
        />
      ) : (
        <span className="inline-flex items-center justify-center text-[10px] font-semibold">
          {monogram || icon}
        </span>
      )}
    </span>
  );
};

const OnePagePortfolio = () => {
  const { stats } = useGitHubStats();
  const {
    projects,
    isLoading: isProjectsLoading,
    error: projectsError,
    refetch,
  } = useGitHubProjects(recruiterProfile.githubUsername);
  const chromeExtensionIds = featuredOffGitHubProjects
    .map((project) => project.chromeExtensionId)
    .filter((id): id is string => Boolean(id));
  const chromeExtensionUsers = useChromeExtensionUsers(chromeExtensionIds);
  const contactEmail = recruiterProfile.contactEmail || "yosefisabag@gmail.com";
  const stackedTechLoop = [
    ...coreTechStack,
    ...coreTechStack,
    ...coreTechStack,
    ...coreTechStack,
    ...coreTechStack,
    ...coreTechStack,
    ...coreTechStack,
    ...coreTechStack,
  ];

  const heroStats = [
    {
      icon: <FolderGit2 size={14} className="text-[#7ff7af]" />,
      label: "Repositories",
      tooltip: "Total public repositories on GitHub",
      value: stats?.totalRepos ?? "--",
    },
    {
      icon: <Star size={14} className="text-[#7ff7af]" />,
      label: "Stars",
      tooltip: "Total stars across public repositories",
      value: stats?.totalStars ?? "--",
    },
    {
      icon: <GitCommitHorizontal size={14} className="text-[#7ff7af]" />,
      label: "Commits",
      tooltip: "Total public GitHub commits",
      value: stats?.totalCommits ?? "--",
    },
  ] as const;

  const socialLinks = [
    {
      label: "LinkedIn",
      href: recruiterProfile.linkedinUrl,
      icon: <FaLinkedinIn size={SOCIAL_ICON_SIZE} className="text-[#0A66C2]" />,
    },
    {
      label: "GitHub",
      href: `https://github.com/${recruiterProfile.githubUsername}`,
      icon: <FaGithub size={SOCIAL_ICON_SIZE} className="text-[#f1f5f9]" />,
    },
    {
      label: "WhatsApp",
      href: recruiterProfile.whatsappUrl,
      icon: <FaWhatsapp size={SOCIAL_ICON_SIZE} className="text-[#25D366]" />,
    },
    {
      label: "CV",
      href: recruiterProfile.resumeUrl,
      icon: <FileText size={SOCIAL_ICON_SIZE} className="text-[#7ff7af]" />,
    },
    {
      label: "Email",
      href: `mailto:${contactEmail}`,
      icon: <Mail size={SOCIAL_ICON_SIZE} className="text-[#f7c76b]" />,
    },
  ] as const;

  return (
    <>
      <SEO
        description="Joseph Sabag, AI Software Engineer. Fast recruiter overview with core projects, stack, and direct contact."
        keywords={[
          "Joseph Sabag",
          "AI Software Engineer",
          "Recruiter Portfolio",
          "React",
          "Node.js",
          "TypeScript",
          "GitHub Projects",
        ]}
        title="Portfolio"
        url="/"
      />

      <AnimatedPage className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-1 py-3 sm:px-2 sm:py-4 md:gap-8 md:px-3 md:py-6">
        <section className="w-full scroll-mt-24" id="home">
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.35fr_0.9fr] lg:items-center">
            <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
              <h1 className="max-w-3xl text-2xl leading-tight font-semibold text-balance md:text-4xl">
                {recruiterProfile.name}
              </h1>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-[#9fdab6] md:text-base">
                <BriefcaseBusiness size={15} />
                {recruiterProfile.role}
              </p>
              <p className="max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)] md:text-base md:leading-7">
                {recruiterProfile.shortBio}
              </p>

              <div className="grid grid-cols-3 gap-2">
                {heroStats.map((stat) => (
                  <Tooltip key={stat.label}>
                    <TooltipTrigger asChild>
                      <div className="flex min-h-17 flex-col items-start justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-2 sm:min-h-0 sm:flex-row sm:items-center sm:justify-start">
                        <div
                          aria-label={stat.label}
                          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-void)]/40"
                          role="img"
                        >
                          {stat.icon}
                        </div>
                        <p className="text-lg leading-none font-semibold tabular-nums sm:text-xl">
                          {stat.value}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={8}>
                      {stat.label}: {stat.tooltip}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 min-[430px]:grid-cols-3 sm:flex sm:flex-wrap">
                {socialLinks.map((social) => (
                  <a
                    className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-full border border-[var(--border-default)] px-3 text-xs font-medium transition hover:border-[#05df72]/50 hover:bg-[#05df72]/10 sm:w-auto sm:justify-start"
                    href={social.href}
                    key={social.label}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--bg-void)]/40">
                      {social.icon}
                    </span>
                    <span className="truncate">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="grid min-w-0 place-items-center" id="contact">
              <div className="mx-auto flex h-[min(64vw,270px)] w-full max-w-[300px] items-end justify-center sm:h-[340px] sm:max-w-[360px] lg:h-[420px] lg:max-w-none">
                <img
                  alt="Joseph Sabag"
                  className="h-full w-full rounded-2xl object-contain object-bottom"
                  src="/images-of-me/hero-image.svg"
                />
              </div>
            </div>
          </div>
        </section>

        <SectionBlock id="stack" title="Tech Stack">
          <div className="stack-marquee w-full">
            <div className="stack-marquee-track">
              {stackedTechLoop.map((tech, index) => (
                <TechIconChip key={`left-${tech}-${index}`} tech={tech} />
              ))}
            </div>
          </div>
        </SectionBlock>

        <SectionBlock id="experience" title="Experience">
          <div className="grid gap-2 md:grid-cols-2">
            {experienceItems.map((item) => (
              <article
                className="flex min-w-0 flex-col gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 sm:p-4"
                key={item.id}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <LogoBadge
                      alt={`${item.company} logo`}
                      icon={<Building2 size={14} />}
                      monogram={item.logoMonogram}
                      src={item.logoUrl}
                    />
                    <div className="min-w-0">
                      <h3 className="text-base leading-tight font-semibold">
                        {item.companyUrl ? (
                          <a
                            className="inline-flex max-w-full items-center gap-2 hover:text-[#7ff7af]"
                            href={item.companyUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <span className="truncate">{item.company}</span>
                          </a>
                        ) : (
                          <span className="truncate">{item.company}</span>
                        )}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {item.role}
                      </p>
                    </div>
                  </div>
                  <p className="inline-flex shrink-0 items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <CalendarDays size={12} />
                    <span>{item.dateRange}</span>
                    {tenureLabel(item) && (
                      <span className="text-[10px] text-[var(--text-secondary)]/80">
                        ({tenureLabel(item)})
                      </span>
                    )}
                  </p>
                </div>
                <ul className="grid gap-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {item.bullets.map((bullet) => (
                    <li className="line-clamp-3" key={`${item.id}-${bullet}`}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock id="mobile-projects" title="Products">
          <div className="grid gap-2 md:grid-cols-2">
            {featuredOffGitHubProjects.map((project) => (
              <motion.article
                className="min-w-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 sm:p-4"
                initial={{ opacity: 0, y: 12 }}
                key={project.id}
                transition={{ duration: 0.24 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2">
                    <LogoBadge
                      alt={`${project.name} logo`}
                      icon={<Smartphone size={14} />}
                      monogram={project.logoMonogram}
                      src={project.logoUrl}
                    />
                    <div className="min-w-0">
                      <h3 className="text-base leading-tight font-semibold sm:text-lg">
                        {project.url ? (
                          <a
                            className="inline-flex max-w-full items-start gap-2 hover:text-[#7ff7af]"
                            href={project.url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <span className="min-w-0 break-words">
                              {project.name}
                            </span>
                          </a>
                        ) : (
                          <span className="min-w-0 break-words">
                            {project.name}
                          </span>
                        )}
                      </h3>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                        <CalendarDays size={12} />
                        {project.dateRange}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {project.chromeExtensionId &&
                      chromeExtensionUsers[project.chromeExtensionId] !==
                        undefined && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] p-2 text-xs text-green-500">
                          <Users size={12} color="#05df72" />
                          {chromeExtensionUsers[
                            project.chromeExtensionId
                          ]?.toLocaleString()}
                        </span>
                      )}
                    {!project.url && (
                      <span className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--border-subtle)] px-2.5 text-xs text-[var(--text-secondary)]">
                        {project.status}
                      </span>
                    )}
                    {project.url && (
                      <a
                        className={actionLinkClass}
                        href={project.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <ExternalLink size={14} />
                        Live
                      </a>
                    )}
                  </div>
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {project.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <TechIconChip key={`${project.id}-${tech}`} tech={tech} />
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock id="projects" title="Featured Projects">
          {isProjectsLoading && (
            <p className="text-sm">Loading GitHub projects...</p>
          )}

          {projectsError && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-2 text-sm">
              <span>Using cached fallback data right now.</span>
              <button
                className="rounded-md border border-[var(--border-subtle)] p-2 hover:border-[#05df72]/50"
                onClick={refetch}
                type="button"
              >
                Retry
              </button>
            </div>
          )}

          <div className="grid gap-2 md:grid-cols-2">
            {projects.map((project) => {
              const logoOverride = findRepoLogoOverride(project.name);
              return (
              <motion.article
                className="min-w-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 sm:p-4"
                initial={{ opacity: 0, y: 12 }}
                key={project.id}
                transition={{ duration: 0.24 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base leading-tight font-semibold sm:text-lg">
                      <a
                        className="inline-flex max-w-full items-start gap-2 hover:text-[#7ff7af]"
                        href={project.repoUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {logoOverride ? (
                          <img
                            alt={logoOverride.alt}
                            className="mt-0.5 size-4 shrink-0 object-contain"
                            src={logoOverride.src}
                          />
                        ) : (
                          <Github className="mt-0.5 shrink-0" size={16} />
                        )}
                        <span className="min-w-0 break-words">
                          {project.name}
                        </span>
                      </a>
                    </h3>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <CalendarDays size={12} />
                      Updated {formatDate(project.updatedAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {project.stars > 0 && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] p-2 text-xs text-green-500">
                        <Star size={12} color="#05df72" />
                        {project.stars}
                      </span>
                    )}
                    <a
                      className={actionLinkClass}
                      href={project.deployedUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <ExternalLink size={14} />
                      Live
                    </a>
                  </div>
                </div>

                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {project.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.slice(0, 6).map((tech) => (
                    <TechIconChip key={`${project.id}-${tech}`} tech={tech} />
                  ))}
                </div>
              </motion.article>
              );
            })}
          </div>
        </SectionBlock>
      </AnimatedPage>
    </>
  );
};

export default OnePagePortfolio;
