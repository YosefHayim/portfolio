import { BarChart3, FileText, Lock, Rocket, Sparkles, Zap } from 'lucide-react';
import { appCatalog } from './catalog.ts';
import { createAppConfig } from './catalogBuilder.ts';
import type { AppConfig } from './types.ts';

const featureIcons = [
  <Zap className="h-6 w-6" />,
  <FileText className="h-6 w-6" />,
  <BarChart3 className="h-6 w-6" />,
  <Rocket className="h-6 w-6" />,
  <Lock className="h-6 w-6" />,
  <Sparkles className="h-6 w-6" />,
];

export const quickApplyConfig: AppConfig = createAppConfig(appCatalog['quick-apply'], {
  logoIcon: <Zap className="h-5 w-5 text-white" />,
  featureIcons,
  fallbackFeatureIcon: <Zap className="h-6 w-6" />,
});
