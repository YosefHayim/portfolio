import {
  BarChart3,
  FileText,
  FileUp,
  Layers,
  ListTodo,
  Lock,
  type LucideIcon,
  Rocket,
  Settings,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { appCatalog } from './catalog.ts';
import type { AppConfig, AppMetadata } from './types.ts';

const appConfig = (
  metadata: AppMetadata,
  logoIcon: ReactNode,
  featureIcons: readonly LucideIcon[],
  FallbackIcon: LucideIcon,
): AppConfig => ({
  ...metadata,
  logoIcon,
  features: metadata.features.map((feature, index) => {
    const Icon = featureIcons[index] ?? FallbackIcon;
    return {
      ...feature,
      icon: <Icon className="h-6 w-6" />,
    };
  }),
});

export const appRegistry: Record<string, AppConfig> = {
  'prompt-queue': appConfig(
    appCatalog['prompt-queue'],
    <Layers className="h-5 w-5 text-neutral-950" />,
    appCatalog['prompt-queue'].features.map(() => Layers),
    Layers,
  ),
  'quick-apply': appConfig(
    appCatalog['quick-apply'],
    <Zap className="h-5 w-5 text-white" />,
    [Zap, FileText, BarChart3, Rocket, Lock, Sparkles],
    Zap,
  ),
  sorqa: appConfig(
    appCatalog.sorqa,
    <Zap className="h-5 w-5 text-neutral-950" />,
    [Sparkles, ListTodo, FileUp, Settings, Shield, Zap],
    Zap,
  ),
};

export const getAppConfig = (appId: string): AppConfig | undefined =>
  appRegistry[appId.toLowerCase()];

export const getAllApps = (): AppConfig[] => Object.values(appRegistry);
