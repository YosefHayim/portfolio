import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges conditional class names and resolves Tailwind conflicts.
 *
 * @param inputs - Class names accepted by clsx.
 * @returns Merged class string.
 * @example
 * cn('p-2', isActive && 'text-mint')
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Public asset path under the /v4/ Vite base.
 * Production can point images at the Worker R2 media edge (`/media/v4/...`)
 * via `VITE_MEDIA_BASE` for long-lived CDN cache independent of the SPA bundle.
 *
 * @param path - Relative path under public/ (e.g. `images-of-me/hero.webp`).
 * @returns Absolute site path for the asset.
 * @example
 * asset('images-of-me/stack-react-3d.webp')
 */
export const asset = (path: string): string => {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  const mediaBase = import.meta.env.VITE_MEDIA_BASE as string | undefined;
  if (mediaBase && mediaBase.length > 0) {
    return `${mediaBase.replace(/\/$/, '')}/${clean}`;
  }
  return `${import.meta.env.BASE_URL}${clean}`;
};
