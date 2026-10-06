import { copy, type Language } from './copy';

interface PortraitProps {
  language: Language;
  large?: boolean;
}
export const Portrait = ({ language, large = false }: PortraitProps) => (
  <img
    className={large ? 'portrait' : 'avatar'}
    src={large ? '/portrait.webp' : '/avatar.webp'}
    srcSet={large ? '/portrait.webp 640w, /portraitLarge.webp 960w' : undefined}
    sizes={large ? '(max-width: 760px) 240px, 300px' : undefined}
    width={large ? 640 : 96}
    height={large ? 800 : 96}
    alt={copy[language].portrait}
    loading={large ? 'lazy' : 'eager'}
  />
);
