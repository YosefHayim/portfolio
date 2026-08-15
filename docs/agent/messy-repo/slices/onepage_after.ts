import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatedPage } from '@/Components/AnimatedPage/AnimatedPage';
import { SEO } from '@/Components/SEO/SEO';
import { featuredOffGitHubProjects, recruiterProfile } from '@/content/profile';
import { useChromeExtensionUsers } from '@/hooks/useChromeExtensionUsers';
import { useGitHubProjects } from '@/hooks/useGitHubProjects';
import { useGitHubStats } from '@/hooks/useGitHubStats';
import { ExperienceSection } from './ExperienceSection.tsx';
import { FeaturedProductsSection } from './FeaturedProductsSection.tsx';
import { FeaturedReposSection } from './FeaturedReposSection.tsx';
import { HeroSection } from './HeroSection.tsx';
import { LatestWritingSection } from './LatestWritingSection.tsx';
import { TechStackSection } from './TechStackSection.tsx';

export const OnePagePortfolio = () => {
  const { t } = useTranslation();
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
  const { users: chromeExtensionUsers } = useChromeExtensionUsers(chromeExtensionIds);
  const retryProjects = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <>
      <SEO
        description={t('seo.homeDescription')}
        keywords={[
          'Joseph Sabag',
          'AI Software Engineer',
          'Recruiter Portfolio',
          'React',
          'Node.js',
          'TypeScript',
          'GitHub Projects',
        ]}
        title={t('seo.homeTitle')}
        url="/"
      />

      <AnimatedPage className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-1 py-3 sm:px-2 sm:py-4 md:gap-8 md:px-3 md:py-6">
        <HeroSection stats={stats} />
        <TechStackSection />
        <ExperienceSection />
        <FeaturedProductsSection chromeExtensionUsers={chromeExtensionUsers} />
        <FeaturedReposSection
          error={projectsError}
          isLoading={isProjectsLoading}
          onRetry={retryProjects}
          projects={projects}
        />
        <LatestWritingSection />
      </AnimatedPage>
    </>
  );
};
