import { FaDiscord, FaWhatsapp } from 'react-icons/fa';
import { Github, Linkedin, MessageCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useState } from 'react';

type Social = {
  name: string;
  href: string;
  icon: React.ReactNode;
  hoverColor: string;
};

const ICON_SIZE = 18;
const WHATSAPP_NUMBER = '546187549';

const socials: Social[] = [
  {
    name: 'GitHub',
    href: 'https://github.com/YosefHayim',
    icon: <Github size={ICON_SIZE} />,
    hoverColor: 'group-hover:text-white',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/yosefhayim/',
    icon: <Linkedin size={ICON_SIZE} />,
    hoverColor: 'group-hover:text-[#0A66C2]',
  },
  {
    name: 'WhatsApp',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    icon: <FaWhatsapp size={ICON_SIZE} />,
    hoverColor: 'group-hover:text-[#05df72]',
  },
  {
    name: 'Discord',
    href: 'https://discord.com/users/josephsabag',
    icon: <FaDiscord size={ICON_SIZE} />,
    hoverColor: 'group-hover:text-[#5865F2]',
  },
  {
    name: 'Contact',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    icon: <MessageCircle size={ICON_SIZE} />,
    hoverColor: 'group-hover:text-[#00d9ff]',
  },
];

type SocialIconsProps = {
  className?: string;
  showLabels?: boolean;
  variant?: 'default' | 'minimal';
};

export function SocialIcons({
  className,
  showLabels = false,
  variant = 'default',
}: SocialIconsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerStyles =
    variant === 'default'
      ? 'gap-0.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-1.5 py-1.5'
      : 'gap-2';

  return (
    <div
      className={cn(
        'relative flex w-fit items-center',
        containerStyles,
        className
      )}
    >
      {variant === 'default' && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent" />
      )}

      {socials.map((social, index) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center rounded-xl transition-colors duration-200"
          style={{ width: 40, height: 40 }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          aria-label={social.name}
        >
          <span
            className={cn(
              'absolute inset-1 rounded-lg bg-white/[0.08] transition-all duration-300 ease-out',
              hoveredIndex === index
                ? 'scale-100 opacity-100'
                : 'scale-90 opacity-0'
            )}
          />

          <span
            className={cn(
              'relative z-10 transition-all duration-300 ease-out',
              hoveredIndex === index ? 'scale-110' : '',
              hoveredIndex === index ? '' : 'text-[var(--text-muted)]',
              social.hoverColor
            )}
          >
            {social.icon}
          </span>

          <span
            className={cn(
              'absolute bottom-1.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-current transition-all duration-300 ease-out',
              hoveredIndex === index ? 'w-3 opacity-100' : 'w-0 opacity-0'
            )}
          />

          {showLabels && (
            <span
              className={cn(
                'absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg bg-[var(--text-primary)] px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-[var(--bg-void)] transition-all duration-300 ease-out',
                hoveredIndex === index
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-1 opacity-0'
              )}
            >
              {social.name}
              <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-[var(--text-primary)]" />
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
