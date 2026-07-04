export type ProjectStatus = 'live' | 'development' | 'completed';

type FilterableStatus = ProjectStatus | 'all';

export const getStatusArray = (
  status: ProjectStatus | ProjectStatus[] | undefined,
): ProjectStatus[] => {
  if (!status) return [];
  return Array.isArray(status) ? status : [status];
};

export const hasStatus = (
  projectStatus: ProjectStatus | ProjectStatus[] | undefined,
  filterStatus: FilterableStatus,
): boolean => {
  if (filterStatus === 'all') return true;
  const statuses = getStatusArray(projectStatus);
  return statuses.includes(filterStatus);
};
