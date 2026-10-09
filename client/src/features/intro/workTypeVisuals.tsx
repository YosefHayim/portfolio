import type { ComponentType, ReactNode } from 'react';
import { AiToolExample } from './workExamples/AiToolExample';
import { AppExample } from './workExamples/AppExample';
import { AutomationExample } from './workExamples/AutomationExample';
import { ExtensionExample } from './workExamples/ExtensionExample';
import { WebsiteExample } from './workExamples/WebsiteExample';
import type { WorkExampleProps } from './workExamples/workExample';
import type { WorkTypeName } from './workTypes';

type WorkTypeVisual = {
  iconShapes: ReactNode;
  Example: ComponentType<WorkExampleProps>;
};

export const workTypeVisuals: Record<WorkTypeName, WorkTypeVisual> = {
  website: {
    iconShapes: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9h18" />
      </>
    ),
    Example: WebsiteExample,
  },
  app: {
    iconShapes: (
      <>
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
    Example: AppExample,
  },
  automation: {
    iconShapes: <path d="M4 12a8 8 0 0 1 14-5.3M18 3v4h-4M20 12a8 8 0 0 1-14 5.3M6 21v-4h4" />,
    Example: AutomationExample,
  },
  aiTool: {
    iconShapes: <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" />,
    Example: AiToolExample,
  },
  extension: {
    iconShapes: (
      <path d="M4 4h7a2 2 0 0 1 4 0h3v5a2 2 0 0 1 0 4v5h-5a2 2 0 0 1-4 0H4v-5a2 2 0 0 1 0-4Z" />
    ),
    Example: ExtensionExample,
  },
};
