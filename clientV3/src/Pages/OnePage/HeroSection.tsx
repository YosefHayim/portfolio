import {
  BriefcaseBusiness,
  FileText,
  FolderGit2,
  GitCommitHorizontal,
  Mail,
  Star,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip';
import { recruiterProfile } from '@/content/profile';
import type { GitHubStats } from '@/db/types';
import { useLocale } from '@/i18n/localized';

const SOCIAL_ICON_SIZE = 14;

type HeroStat = {
  icon: ReactNode;
  label: string;
  tooltip: string;
  value: number | string;
};

type SocialLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

interface HeroSectionProps {
  stats: GitHubStats | null;
}

export const HeroSection = ({ stats }: HeroSectionProps) => {
  const { t } = useTranslation();
  const { localize } = useLocale();

  const heroStats: HeroStat[] = [
    {
      icon: <FolderGit2 size={14} className="text-brand-readable" />,
      label: t('hero.repositories'),
      tooltip: t('hero.repositoriesTooltip'),
      value: stats?.totalRepos ?? '--',
    },
    {
      icon: <Star size={14} className="text-brand-readable" />,
      label: t('hero.stars'),
      tooltip: t('hero.starsTooltip'),
      value: stats?.totalStars ?? '--',
    },
    {
      icon: <GitCommitHorizontal size={14} className="text-brand-readable" />,
      label: t('hero.commits'),
      tooltip: t('hero.commitsTooltip'),
      value: stats?.totalCommits ?? '--',
    },
  ];

  const socialLinks: SocialLink[] = [
    {
      label: t('social.linkedin'),
      href: recruiterProfile.linkedinUrl,
      icon: <FaLinkedinIn size={SOCIAL_ICON_SIZE} className="text-social-linkedin" />,
    },
    {
      label: t('social.github'),
      href: `https://github.com/${recruiterProfile.githubUsername}`,
      icon: <FaGithub size={SOCIAL_ICON_SIZE} className="text-social-github" />,
    },
    {
      label: t('social.whatsapp'),
      href: recruiterProfile.whatsappUrl,
      icon: <FaWhatsapp size={SOCIAL_ICON_SIZE} className="text-social-whatsapp" />,
    },
    {
      label: t('hero.cv'),
      href: recruiterProfile.resumeUrl,
      icon: <FileText size={SOCIAL_ICON_SIZE} className="text-brand-readable" />,
    },
    {
      label: t('hero.email'),
      href: `mailto:${recruiterProfile.contactEmail}`,
      icon: <Mail size={SOCIAL_ICON_SIZE} className="text-social-mail" />,
    },
  ];

  return (
    <section className="w-full scroll-mt-24" id="home">
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.35fr_0.9fr] lg:items-center">
        <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
          <h1 className="max-w-3xl text-balance font-semibold text-2xl leading-tight md:text-4xl">
            {recruiterProfile.name}
          </h1>
          <p className="inline-flex items-center gap-2 font-medium text-brand-muted text-sm md:text-base">
            <BriefcaseBusiness size={15} />
            {localize(recruiterProfile.role)}
          </p>
          <p className="max-w-3xl text-[var(--text-secondary)] text-sm leading-relaxed md:text-base md:leading-7">
            {localize(recruiterProfile.shortBio)}
          </p>

          <div className="grid grid-cols-3 gap-2">
            {heroStats.map((stat) => (
              <Tooltip key={stat.label}>
                <TooltipTrigger asChild={true}>
                  <div className="flex min-h-17 flex-col items-start justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-2 sm:min-h-0 sm:flex-row sm:items-center sm:justify-start">
                    <div
                      aria-label={stat.label}
                      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-void)]/40"
                      role="img"
                    >
                      {stat.icon}
                    </div>
                    <p className="font-semibold text-lg tabular-nums leading-none sm:text-xl">
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

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap min-[430px]:grid-cols-3">
            {socialLinks.map((social) => (
              <a
                className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-full border border-[var(--border-default)] px-3 font-medium text-xs transition hover:border-brand/50 hover:bg-brand/10 sm:w-auto sm:justify-start"
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
          <div className="mx-auto flex h-[min(80vw,360px)] w-full max-w-[360px] items-end justify-center sm:h-[440px] sm:max-w-[420px] lg:h-[540px] lg:max-w-none">
            <img
              alt="Joseph Sabag"
              className="h-full w-full rounded-2xl object-contain object-bottom"
              src="/images-of-me/hero-image.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
