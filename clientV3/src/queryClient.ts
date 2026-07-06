import { QueryClient } from '@tanstack/react-query';

const QUERY_STALE_TIME_MS = 5 * 60 * 1000;
const QUERY_GC_TIME_MS = 30 * 60 * 1000;

export const portfolioQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: QUERY_GC_TIME_MS,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: QUERY_STALE_TIME_MS,
    },
  },
});
