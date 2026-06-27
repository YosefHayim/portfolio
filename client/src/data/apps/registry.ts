import { gqminiConfig } from './gqmini.tsx';
import { quickApplyConfig } from './quickapply.tsx';
import { sorqaConfig } from './sorqa.tsx';
import type { AppConfig } from './types.ts';

export const appRegistry: Record<string, AppConfig> = {
  'prompt-queue': gqminiConfig,
  'quick-apply': quickApplyConfig,
  sorqa: sorqaConfig,
};

export const getAppConfig = (appId: string): AppConfig | undefined =>
  appRegistry[appId.toLowerCase()];

export const getAllAppIds = (): string[] => Object.keys(appRegistry);

export const getAllApps = (): AppConfig[] => Object.values(appRegistry);
