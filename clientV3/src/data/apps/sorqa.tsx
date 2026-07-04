import { FileUp, ListTodo, Settings, Shield, Sparkles, Zap } from 'lucide-react';
import { appCatalog } from './catalog.ts';
import { createAppConfig } from './catalogBuilder.ts';
import type { AppConfig } from './types.ts';

const featureIcons = [
  <Sparkles className="h-6 w-6" />,
  <ListTodo className="h-6 w-6" />,
  <FileUp className="h-6 w-6" />,
  <Settings className="h-6 w-6" />,
  <Shield className="h-6 w-6" />,
  <Zap className="h-6 w-6" />,
];

export const sorqaConfig: AppConfig = createAppConfig(appCatalog.sorqa, {
  logoIcon: <Zap className="h-5 w-5 text-[#0a0a0b]" />,
  featureIcons,
  fallbackFeatureIcon: <Zap className="h-6 w-6" />,
});
