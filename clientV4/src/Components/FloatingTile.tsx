import { asset, cn } from '@/lib/utils';

interface FloatingTileProps {
  src: string;
  alt: string;
  className?: string;
  rotate?: number;
  floatDelay?: number;
  isCharacter?: boolean;
  /** Eager load + high fetch priority (LCP hero only). */
  priority?: boolean;
}

/**
 * Hero constellation tile — pure CSS float (no framer-motion on critical path).
 */
export const FloatingTile = ({
  src,
  alt,
  className = '',
  rotate = 0,
  floatDelay = 0,
  isCharacter = false,
  priority = false,
}: FloatingTileProps) => (
  <div
    className={cn(
      'absolute will-change-transform',
      isCharacter
        ? className
        : cn(
            'overflow-hidden rounded-md border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.55)]',
            className,
          ),
      !priority && 'animate-[v4-float_6s_ease-in-out_infinite]',
    )}
    style={{
      transformOrigin: 'center',
      transform: `rotate(${rotate}deg)`,
      animationDelay: priority ? undefined : `${floatDelay}s`,
    }}
  >
    <img
      alt={alt}
      className={
        isCharacter
          ? 'h-full w-full object-contain drop-shadow-[0_0_40px_rgba(94,234,212,0.18)]'
          : 'h-full w-full object-cover'
      }
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      height={isCharacter ? 480 : 320}
      loading={priority ? 'eager' : 'lazy'}
      src={asset(src)}
      width={isCharacter ? 480 : 320}
    />
    {!isCharacter && (
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    )}
  </div>
);
