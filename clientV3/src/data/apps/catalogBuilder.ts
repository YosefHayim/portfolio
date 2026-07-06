import { requirePortfolioProductFact } from '@shared/portfolio/productRegistry.js';
import type { ReactNode } from 'react';
import type { AppConfig, AppMetadata, FeatureCopy } from './types.ts';

export type AppCatalogSeed = Omit<AppMetadata, 'pagePath' | 'legalSlug'> & {
  features: FeatureCopy[];
};

/**
 * Creates app metadata from local copy and the shared product registry.
 *
 * @param entries - App metadata seeds keyed by product id.
 * @returns App metadata with page path and legal slug filled from the registry.
 * @example
 * createAppCatalog({ sorqa: { id: 'sorqa', name: 'Sorqa', features: [] } })
 */
export const createAppCatalog = (
  entries: Record<string, AppCatalogSeed>,
): Record<string, AppMetadata> =>
  Object.fromEntries(
    Object.entries(entries).map(([key, entry]) => {
      const product = requirePortfolioProductFact(entry.id);
      if (!product.pagePath) {
        throw new Error(`Portfolio product ${entry.id} is missing a page path`);
      }

      return [
        key,
        {
          ...entry,
          pagePath: product.pagePath,
          legalSlug: product.legalSlug,
        },
      ];
    }),
  );

/**
 * Combines app metadata with React icons used by the UI.
 *
 * @param metadata - App metadata from the catalog.
 * @param icons - Logo and feature icon configuration.
 * @returns Renderable app config.
 * @example
 * createAppConfig(metadata, { logoIcon, featureIcons: [], fallbackFeatureIcon })
 */
export const createAppConfig = (
  metadata: AppMetadata,
  {
    logoIcon,
    featureIcons,
    fallbackFeatureIcon,
  }: {
    logoIcon: ReactNode;
    featureIcons: ReactNode[];
    fallbackFeatureIcon: ReactNode;
  },
): AppConfig => ({
  ...metadata,
  logoIcon,
  features: metadata.features.map((feature, index) => ({
    ...feature,
    icon: featureIcons[index] ?? fallbackFeatureIcon,
  })),
});
