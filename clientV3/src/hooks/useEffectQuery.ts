import type { QueryKey, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { Effect } from 'effect';

type EffectQueryInput<TData, TError> = {
  queryKey: QueryKey;
  program: Effect.Effect<TData, TError, never>;
  enabled?: boolean;
};

/**
 * Runs an Effect program through the portfolio's TanStack Query path.
 *
 * @param input - Query key, Effect program, and optional enabled flag.
 * @returns TanStack Query result for the program output.
 * @example
 * useEffectQuery({ queryKey: ['profile'], program: Effect.promise(loadProfile) })
 */
export const useEffectQuery = <TData, TError = Error>({
  queryKey,
  program,
  enabled = true,
}: EffectQueryInput<TData, TError>): UseQueryResult<TData, TError> =>
  useQuery<TData, TError>({
    enabled,
    queryKey,
    queryFn: () => Effect.runPromise(program),
  });
