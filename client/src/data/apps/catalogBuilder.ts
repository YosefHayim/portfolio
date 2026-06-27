import type { ReactNode } from 'react';
import { requirePortfolioProductFact } from '../../../../shared/portfolio/productRegistry.js';
import type { AppConfig, AppMetadata, FeatureCopy } from './types.ts';

export type AppCatalogSeed = Omit<AppMetadata, 'pagePath' | 'legalSlug'> & {
  features: FeatureCopy[];
};

export function createAppCatalog<T extends Record<string, AppCatalogSeed>>(
  entries: T,
): Record<keyof T, AppMetadata> {
  return Object.fromEntries(
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
  ) as Record<keyof T, AppMetadata>;
}

export function createAppConfig(
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
): AppConfig {
  return {
    ...metadata,
    logoIcon,
    features: metadata.features.map((feature, index) => ({
      ...feature,
      icon: featureIcons[index] ?? fallbackFeatureIcon,
    })),
  };
}
