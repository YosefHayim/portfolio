import { type ReactNode, useState } from 'react';

interface LogoBadgeProps {
  src?: string;
  alt: string;
  monogram?: string;
  icon: ReactNode;
}

export const LogoBadge = ({ src, alt, monogram, icon }: LogoBadgeProps) => {
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
        <span className="inline-flex items-center justify-center font-semibold text-[10px]">
          {monogram || icon}
        </span>
      )}
    </span>
  );
};
