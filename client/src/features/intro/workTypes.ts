export const workTypeNames = ['website', 'app', 'automation', 'aiTool', 'extension'] as const;

export type WorkTypeName = (typeof workTypeNames)[number];

export const firstWorkType: WorkTypeName = workTypeNames[0];

export const nextWorkType = (workType: WorkTypeName) => {
  const position = workTypeNames.indexOf(workType);
  const nextPosition = (position + 1) % workTypeNames.length;
  return workTypeNames[nextPosition];
};
