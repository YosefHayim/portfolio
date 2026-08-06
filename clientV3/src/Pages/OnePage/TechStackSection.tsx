import { useTranslation } from 'react-i18next';
import { coreTechStack } from '@/content/profile';
import { STACK_MARQUEE_REPEATS } from './onePageShared.ts';
import { SectionBlock } from './SectionBlock.tsx';
import { TechIconChip } from './TechIconChip.tsx';

export const TechStackSection = () => {
  const { t } = useTranslation();
  const stackedTechLoop = Array.from({ length: STACK_MARQUEE_REPEATS }, () => coreTechStack).flat();

  return (
    <SectionBlock id="stack" title={t('sections.techStack')}>
      <div className="stack-marquee w-full">
        <div className="stack-marquee-track">
          {stackedTechLoop.map((tech, index) => (
            <TechIconChip key={`left-${tech}-${index}`} tech={tech} />
          ))}
        </div>
      </div>
    </SectionBlock>
  );
};
