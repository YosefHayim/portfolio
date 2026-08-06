import { motion } from 'framer-motion';
import { CalendarDays, ExternalLink, Github, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip';
import type { GitHubProjectPreview } from '@/db/types';
import { useLocale } from '@/i18n/localized';
import { LogoBadge } from './LogoBadge.tsx';
import { actionLinkClass } from './onePageShared.ts';
import { SectionBlock } from './SectionBlock.tsx';
import { TechIconChip } from './TechIconChip.tsx';

/**
 * Project-name → brand logo. Lets us swap the generic Github mark on a few
 * repos. Keys are matched case-insensitively against either the GitHub repo
 * slug ("ebay-mcp") or the curated display name ("eBay MCP API Server"), so
 * both live and fallback feeds resolve.
 */
const REPO_LOGO_OVERRIDES: Record<string, { src: string; alt: string }> = {
  'ebay-mcp': { src: '/logos/ebay.svg', alt: 'eBay logo' },
  'ebay mcp api server': { src: '/logos/ebay.svg', alt: 'eBay logo' },
  'fresh-squeezy': { src: '/logos/lemon-squeezy.svg', alt: 'Lemon Squeezy logo' },
  'tim-trailers': { src: '/logos/tim-trailers.png', alt: 'Tim Trailers logo' },
};

const findRepoLogoOverride = (projectName: string) =>
  REPO_LOGO_OVERRIDES[projectName.trim().toLowerCase()];

const formatDate = (isoDate: string, locale: string, fallback: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
  });
};

interface FeaturedReposSectionProps {
  projects: GitHubProjectPreview[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const FeaturedReposSection = ({
  projects,
  isLoading,
  error,
  onRetry,
}: FeaturedReposSectionProps) => {
  const { t } = useTranslation();
  const { language } = useLocale();

  return (
    <SectionBlock id="projects" title={t('sections.featuredRepositories')}>
      {isLoading && <p className="text-sm">{t('projects.loadingRepositories')}</p>}

      {error && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-2 text-sm">
          <span>{t('projects.usingCachedFallback')}</span>
          <button
            className="rounded-md border border-[var(--border-subtle)] p-2 hover:border-brand/50"
            onClick={onRetry}
            type="button"
          >
            {t('projects.retry')}
          </button>
        </div>
      )}

      <div className="grid gap-2 md:grid-cols-2">
        {projects.map((project) => {
          const logoOverride = findRepoLogoOverride(project.name);
          const logoSrc = logoOverride?.src ?? project.avatarUrl;
          const logoAlt = logoOverride?.alt ?? `${project.name} logo`;
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
                  <h3 className="font-semibold text-base leading-tight sm:text-lg">
                    <a
                      className="inline-flex max-w-full items-start gap-2 hover:text-brand-readable"
                      href={project.repoUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {logoSrc ? (
                        <Tooltip>
                          <TooltipTrigger asChild={true}>
                            <span>
                              <LogoBadge alt={logoAlt} icon={<Github size={14} />} src={logoSrc} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            sideOffset={8}
                            className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-1.5 shadow-lg"
                          >
                            <img
                              src={logoSrc}
                              alt={logoAlt}
                              className="size-[200px] rounded-lg object-contain"
                            />
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Github className="mt-0.5 shrink-0" size={16} />
                      )}
                      <span className="min-w-0 break-words">{project.name}</span>
                    </a>
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[var(--text-secondary)] text-xs">
                    <CalendarDays size={12} />
                    {t('projects.updated', {
                      date: formatDate(project.updatedAt, language, t('projects.recently')),
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {project.stars > 0 && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] p-2 text-green-500 text-xs">
                      <Star size={12} color="var(--brand-primary)" />
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
                    {t('projects.live')}
                  </a>
                </div>
              </div>

              <p className="mt-2 line-clamp-3 text-[var(--text-secondary)] text-sm leading-relaxed">
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
  );
};
