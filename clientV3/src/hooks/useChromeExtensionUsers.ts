import { Effect, Schema } from 'effect';
import { API_BASE_URL } from '@/utils/apiBaseUrl';
import { useEffectQuery } from './useEffectQuery.ts';

/** Map of Chrome Web Store extension id → live user count. */
export type ChromeExtensionUsersMap = Record<string, number>;

type UseChromeExtensionUsersResult = {
  users: ChromeExtensionUsersMap;
  isLoading: boolean;
  error: Error | null;
};

const ChromeExtensionUsersResponseSchema = Schema.Struct({
  success: Schema.Boolean,
  id: Schema.String,
  users: Schema.Number,
});

class ChromeExtensionUsersError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChromeExtensionUsersError';
  }
}

/**
<<<<<<< HEAD
 * Fetches a single Chrome Web Store user count.
 *
 * @param id - Chrome extension id.
 * @returns Extension id and live user count when the server response is successful.
 * @example
 * fetchChromeExtensionUserCount('abcdefghijklmnopabcdefghijklmnop')
=======
 * Fetches the public Chrome Web Store user count for each extension id.
 * Failures are skipped silently the badge just won't render for that id.
 * One in-flight request per id; runs once per `ids` set change.
>>>>>>> refs/heads/mac-reset-backup/2026-07-30/stash/000-afbb755efb3e
 */
const fetchChromeExtensionUserCount = (
  id: string,
): Effect.Effect<[string, number] | null, ChromeExtensionUsersError, never> =>
  Effect.tryPromise({
    try: async () => {
      const response = await fetch(`${API_BASE_URL}/api/chrome-extension/${id}/users`);

      if (!response.ok) {
        throw new ChromeExtensionUsersError(`Chrome user count request failed for ${id}`);
      }

      const data = Schema.decodeUnknownSync(ChromeExtensionUsersResponseSchema)(
        await response.json(),
      );

      if (!data.success) return null;

      const entry: [string, number] = [id, data.users];
      return entry;
    },
    catch: (error) => {
      if (error instanceof ChromeExtensionUsersError) return error;

      return new ChromeExtensionUsersError(
        error instanceof Error ? error.message : 'Chrome user count request failed',
      );
    },
  });

/**
 * Converts successful extension count entries into a lookup map.
 *
 * @param entries - Extension count entries from the API.
 * @returns Extension id keyed user-count map.
 * @example
 * toChromeExtensionUsersMap([['abc', 12]]) // { abc: 12 }
 */
const toChromeExtensionUsersMap = (
  entries: ReadonlyArray<[string, number] | null>,
): ChromeExtensionUsersMap => {
  const users: ChromeExtensionUsersMap = {};

  for (const entry of entries) {
    if (entry === null) continue;

    const [id, userCount] = entry;
    users[id] = userCount;
  }

  return users;
};

/**
 * Fetches public Chrome Web Store user counts through the shared query path.
 *
 * @param ids - Chrome extension ids to fetch.
 * @returns Cached user counts plus query state.
 * @example
 * useChromeExtensionUsers(['abcdefghijklmnopabcdefghijklmnop'])
 */
export const useChromeExtensionUsers = (ids: readonly string[]): UseChromeExtensionUsersResult => {
  const query = useEffectQuery({
    enabled: ids.length > 0,
    queryKey: ['chrome-extension-users', ids.join(',')],
    program: Effect.all(ids.map(fetchChromeExtensionUserCount), {
      concurrency: 'unbounded',
    }).pipe(Effect.map(toChromeExtensionUsersMap)),
  });

  return {
    users: query.data ? query.data : {},
    isLoading: query.isLoading,
    error: query.error,
  };
};
