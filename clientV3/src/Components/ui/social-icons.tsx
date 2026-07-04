import { Github, Linkedin, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { FaDiscord, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

export type IconItem = {
  label: string;
  icon: React.ReactNode;
  hoverColor?: string;
  href?: string;
  to?: string;
};

type LabelSide = 'top' | 'bottom' | 'left' | 'right';

const LABEL_STYLES: Record<
  LabelSide,
  { position: string; arrow: string; show: string; hide: string }
> = {
  top: {
    position: '-top-10 left-1/2 -translate-x-1/2',
    arrow: '-bottom-1 left-1/2 -translate-x-1/2',
    show: 'translate-y-0',
    hide: 'translate-y-1',
  },
  bottom: {
    position: '-bottom-10 left-1/2 -translate-x-1/2',
    arrow: '-top-1 left-1/2 -translate-x-1/2',
    show: 'translate-y-0',
    hide: '-translate-y-1',
  },
  left: {
    position: 'top-1/2 right-full -translate-y-1/2 mr-2',
    arrow: 'top-1/2 -right-1 -translate-y-1/2',
    show: 'translate-x-0',
    hide: 'translate-x-1',
  },
  right: {
    position: 'top-1/2 left-full -translate-y-1/2 ml-2',
    arrow: 'top-1/2 -left-1 -translate-y-1/2',
    show: 'translate-x-0',
    hide: '-translate-x-1',
  },
};

const ICON_SIZE = 18;
const WHATSAPP_NUMBER = '546187549';

const socials: IconItem[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/YosefHayim',
    icon: <Github size={ICON_SIZE} />,
    hoverColor: 'group-hover:text-white',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/yosef-hayim-sabag/',
    icon: <Linkedin size={ICON_SIZE} />,
    hoverColor: 'group-hover:text-[#0A66C2]',
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    icon: <FaWhatsapp size={ICON_SIZE} />,
    hoverColor: 'group-hover:text-[#05df72]',
  },
  {
    label: 'Discord',
    href: 'https://discord.com/users/josephsabag',
    icon: <FaDiscord size={ICON_SIZE} />,
    hoverColor: 'group-hover:text-[#5865F2]',
  },
  {
    label: 'Contact',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    icon: <MessageCircle size={ICON_SIZE} />,
    hoverColor: 'group-hover:text-[#00d9ff]',
  },
];

type SocialIconsProps = {
  className?: string;
  showLabels?: boolean;
  variant?: 'default' | 'minimal' | 'nav';
  items?: IconItem[];
  forceShowLabels?: boolean;
  labelSides?: LabelSide[];
  activePath?: string;
};

export function SocialIcons({
  className,
  showLabels = false,
  variant = 'default',
  items,
  forceShowLabels = false,
  labelSides,
  activePath,
}: SocialIconsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const displayItems = items ?? socials;
  const sides = labelSides ?? ['top'];

  const nonNavStyles =
    variant === 'default'
      ? 'w-fit gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-2 p-2'
      : 'w-fit gap-2';
  const containerStyles = variant === 'nav' ? 'w-full justify-around' : nonNavStyles;

  return (
    <div className={cn('relative flex items-center', containerStyles, className)}>
      {variant === 'default' && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent" />
      )}

      {displayItems.map((item, index) => {
        const isHovered = hoveredIndex === index;
        const isItemActive = activePath !== undefined && item.to === activePath;
        const isActive = isHovered || isItemActive;
        const side = sides[index % sides.length];
        const labelVisible = forceShowLabels || (showLabels && isActive);

        if (variant === 'nav') {
          const navCls = cn(
            'relative flex flex-1 flex-col items-center justify-center p-2',
            isItemActive ? 'text-[#05df72]' : 'text-[var(--text-muted)]',
          );
          const navInner = (
            <>
              <span className={cn('transition-colors duration-200', isItemActive && 'scale-110')}>
                {item.icon}
              </span>
              <span className=" text-[10px]" style={{ fontWeight: isItemActive ? 600 : 400 }}>
                {item.label}
              </span>
            </>
          );
          return item.to ? (
            <Link className={navCls} key={item.label} to={item.to}>
              {navInner}
            </Link>
          ) : (
            <span className={navCls} key={item.label}>
              {navInner}
            </span>
          );
        }

        const inner = (
          <>
            <span
              className={cn(
                'absolute inset-1 rounded-lg bg-white/[0.08] transition-all duration-300 ease-out',
                isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0',
              )}
            />
            <span
              className={cn(
                'relative z-10 transition-all duration-300 ease-out',
                isActive ? 'scale-110' : '',
                isActive ? '' : 'text-[var(--text-muted)]',
                item.hoverColor,
                isItemActive && 'text-[#05df72]',
              )}
            >
              {item.icon}
            </span>
            <span
              className={cn(
                'absolute bottom-1.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-current transition-all duration-300 ease-out',
                isActive ? 'w-3 opacity-100' : 'w-0 opacity-0',
              )}
            />
            {(showLabels || forceShowLabels) && (
              <span
                className={cn(
                  'absolute z-50 rounded-lg bg-[var(--text-primary)] p-2 p-2 text-[11px] font-medium whitespace-nowrap text-[var(--bg-void)] transition-all duration-300 ease-out',
                  LABEL_STYLES[side].position,
                  labelVisible
                    ? cn(LABEL_STYLES[side].show, 'opacity-100')
                    : cn('pointer-events-none', LABEL_STYLES[side].hide, 'opacity-0'),
                )}
              >
                {item.label}
                <span
                  className={cn(
                    'absolute size-2 rotate-45 bg-[var(--text-primary)]',
                    LABEL_STYLES[side].arrow,
                  )}
                />
              </span>
            )}
          </>
        );

        const baseCls =
          'group relative flex items-center justify-center rounded-xl transition-colors duration-200';
        const handlers = {
          onMouseEnter: () => setHoveredIndex(index),
          onMouseLeave: () => setHoveredIndex(null),
        };
        const size = { width: 40, height: 40 };

        if (item.to) {
          return (
            <Link
              aria-label={item.label}
              className={baseCls}
              key={item.label}
              style={size}
              to={item.to}
              {...handlers}
            >
              {inner}
            </Link>
          );
        }
        return item.href ? (
          <a
            aria-label={item.label}
            className={baseCls}
            href={item.href}
            key={item.label}
            rel="noopener noreferrer"
            style={size}
            target="_blank"
            {...handlers}
          >
            {inner}
          </a>
        ) : (
          <span
            aria-label={item.label}
            className={cn(baseCls, 'cursor-default')}
            key={item.label}
            style={size}
            {...handlers}
          >
            {inner}
          </span>
        );
      })}
    </div>
  );
}
