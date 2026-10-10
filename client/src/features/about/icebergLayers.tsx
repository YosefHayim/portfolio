export const icebergLayers = [
  {
    name: 'safeSignIn',
    iconShapes: (
      <>
        <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
      </>
    ),
  },
  {
    name: 'payments',
    iconShapes: (
      <>
        <rect x="2" y="4" width="12" height="8.5" rx="1.5" />
        <path d="M2 7h12M4.5 10.5h2.5" />
      </>
    ),
  },
  {
    name: 'organizedData',
    iconShapes: (
      <>
        <ellipse cx="8" cy="4" rx="5" ry="2" />
        <path d="M3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2" />
      </>
    ),
  },
  {
    name: 'testedUpdates',
    iconShapes: <path d="M3 4.5 4.5 6 7 3.5M3 10.5 4.5 12 7 9.5M9.5 5h4M9.5 11h4" />,
  },
  {
    name: 'attackProtection',
    iconShapes: (
      <>
        <path d="M8 1.8 13 3.6v4.1c0 3-2.1 5.4-5 6.5-2.9-1.1-5-3.5-5-6.5V3.6Z" />
        <path d="m5.8 8 1.6 1.6 3-3.2" />
      </>
    ),
  },
  {
    name: 'earlyAlerts',
    iconShapes: (
      <>
        <path d="M4 11V7.5a4 4 0 0 1 8 0V11l1 1.5H3Z" />
        <path d="M6.6 14a1.5 1.5 0 0 0 2.8 0" />
      </>
    ),
  },
  {
    name: 'automaticBackups',
    iconShapes: (
      <>
        <path d="M4.5 12.5a3 3 0 0 1-.4-6 4 4 0 0 1 7.7-.9 3 3 0 0 1 .7 5.9Z" />
        <path d="M8 7.5V11m-1.5-1.5L8 11l1.5-1.5" />
      </>
    ),
  },
  {
    name: 'readyToGrow',
    iconShapes: (
      <>
        <path d="m2 11.5 4-4 3 3 5-5.5" />
        <path d="M10 5h4v4" />
      </>
    ),
  },
] as const;

export type IcebergLayerName = (typeof icebergLayers)[number]['name'];
