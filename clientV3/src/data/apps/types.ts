import type { ReactNode } from 'react';

/** Marketing feature line before icons are attached. */
export type AppFeature = {
  title: string;
  description: string;
};

/** Authored app copy plus Product Route Registry fields. */
export type AppMetadata = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  pagePath: string;
  legalSlug?: string;
  chromeStoreUrl?: string;
  features: AppFeature[];
};

export type AppFeatureWithIcon = AppFeature & {
  icon: ReactNode;
};

/** Renderable app entry used by app landing UI. */
export type AppConfig = Omit<AppMetadata, 'features'> & {
  logoIcon: ReactNode;
  features: AppFeatureWithIcon[];
};
