import { Layers } from 'lucide-react';
import { appCatalog } from './catalog.ts';
import { createAppConfig } from './catalogBuilder.ts';
import type { AppConfig } from './types.ts';

const layersFeatureIcon = <Layers className="h-6 w-6" />;

export const gqminiConfig: AppConfig = createAppConfig(appCatalog['prompt-queue'], {
  logoIcon: <Layers className="h-5 w-5 text-neutral-950" />,
  featureIcons: appCatalog['prompt-queue'].features.map(() => layersFeatureIcon),
  fallbackFeatureIcon: layersFeatureIcon,
});
