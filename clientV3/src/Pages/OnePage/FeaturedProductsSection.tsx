import { motion } from 'framer-motion';
import { CalendarDays, ExternalLink, Smartphone, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { featuredOffGitHubProjects } from '@/content/profile';
import type { ChromeExtensionUsersMap } from '@/hooks/useChromeExtensionUsers';
import { useLocale } from '@/i18n/localized';
import { LogoBadge } from './LogoBadge.tsx';
import { actionLinkClass } from './onePageShared.ts';
import { SectionBlock } from './SectionBlock.tsx';
import { TechIconChip } from './TechIconChip.tsx';

interface FeaturedProductsSectionProps {
  chromeExtensionUsers: ChromeExtensionUsersMap;
}

export const FeaturedProductsSection = ({ chromeExtensionUsers }: FeaturedProductsSectionProps) => {
  const { t } = useTranslation();
  const { localize } = useLocale();

  return (
    <SectionBlock id="mobile-projects" title={t('sections.projects')}>
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
                  <h3 className="font-semibold text-base leading-tight sm:text-lg">
                    {project.url ? (
                      <a
                        className="inline-flex max-w-full items-start gap-2 hover:text-brand-readable"
                        href={project.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <span className="min-w-0 break-words">{project.name}</span>
                      </a>
                    ) : (
                      <span className="min-w-0 break-words">{project.name}</span>
                    )}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-[var(--text-secondary)] text-xs">
                    <CalendarDays size={12} />
                    {localize(project.dateRange)}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {project.chromeExtensionId &&
                  chromeExtensionUsers[project.chromeExtensionId] !== undefined && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] p-2 text-green-500 text-xs">
                      <Users size={12} color="var(--brand-primary)" />
                      {chromeExtensionUsers[project.chromeExtensionId]?.toLocaleString()}
                    </span>
                  )}
                {!project.url && (
                  <span className="inline-flex h-9 items-center justify-center rounded-full border border-[var(--border-subtle)] px-2.5 text-[var(--text-secondary)] text-xs">
                    {localize(project.status)}
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
                    {t('projects.live')}
                  </a>
                )}
              </div>
            </div>
            <p className="mt-2 line-clamp-3 text-[var(--text-secondary)] text-sm leading-relaxed">
              {localize(project.description)}
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
  );
};
