import type { ReactNode } from 'react';

export const DEVELOPER_INFO = {
  name: 'Yosef Hayim Sabag',
  email: 'yosefisabag@gmail.com',
  website: 'https://yosefhayimsabag.com',
};

export type FeatureCopy = {
  title: string;
  description: string;
};

export type AppMetadata = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  pagePath: string;
  legalSlug?: string;
  chromeStoreUrl?: string;
  features: FeatureCopy[];
};

export type FeatureItem = FeatureCopy & {
  icon: ReactNode;
};

export type AppConfig = Omit<AppMetadata, 'features'> & {
  logoIcon: ReactNode;
  features: FeatureItem[];
};
