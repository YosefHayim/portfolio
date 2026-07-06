import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges conditional class names and resolves Tailwind conflicts.
 *
 * @param inputs - Class names accepted by clsx.
 * @returns Merged class string.
 * @example
 * cn('p-2', isActive && 'bg-brand')
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
