const paths: Record<string, string> = {
  launch: 'M12 3c5 2 7 7 7 11l-7-3-7 3c0-4 2-9 7-11ZM12 11v7m-4-1-2 4m10-4 2 4',
  rescue: 'm14 5 5 5M4 20l8-8m1-8a6 6 0 0 0-7 7L3 14l7 7 3-3a6 6 0 0 0 7-7l-5 3-5-5Z',
  connect: 'M8 7h8M7 8v8m10-8v8M8 17h8M3 3h5v5H3Zm13 0h5v5h-5ZM3 16h5v5H3Zm13 0h5v5h-5Z',
  lock: 'M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5Zm7 4v3',
  payment: 'M3 5h18v14H3ZM3 9h18M6 15h4',
  information: 'M4 4h16v16H4ZM8 4v16M8 9h12M8 14h12',
  check: 'm3 6 2 2 4-4m3 2h9M3 16l2 2 4-4m3 2h9',
  shield: 'm12 2 9 4v6c0 5-5 9-9 10-4-1-9-5-9-10V6Zm-4 10 3 3 5-6',
  bell: 'M6 16V9a6 6 0 0 1 12 0v7l2 3H4Zm4 6h4',
  backup: 'M7 18a5 5 0 0 1-2-9 7 7 0 0 1 13-2 6 6 0 0 1 0 11M12 11v10m-3-3 3 3 3-3',
  growth: 'M3 20V4m0 16h18M7 15l5-5 3 3 6-8m-5 0h5v5',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  pause: 'M8 5v14M16 5v14',
  play: 'm8 4 12 8-12 8Z',
  chat: 'M4 4h16v13H9l-5 4Zm4 5h8m-8 4h5',
};

export const Icon = ({ name }: { name: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={paths[name]} />
  </svg>
);
