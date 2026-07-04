import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/utils/apiBaseUrl';

/** Map of Chrome Web Store extension id → live user count. */
export type ChromeExtensionUsersMap = Record<string, number>;

type ServerResponse = {
  success: boolean;
  id: string;
  users: number;
};

/**
 * Fetches the public Chrome Web Store user count for each extension id.
 * Failures are skipped silently the badge just won't render for that id.
 * One in-flight request per id; runs once per `ids` set change.
 */
export const useChromeExtensionUsers = (ids: readonly string[]): ChromeExtensionUsersMap => {
  const key = ids.join(',');
  const [users, setUsers] = useState<ChromeExtensionUsersMap>({});

  useEffect(() => {
    if (ids.length === 0) {
      return;
    }
    const controller = new AbortController();

    Promise.all(
      ids.map(async (id) => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/chrome-extension/${id}/users`, {
            signal: controller.signal,
          });
          if (!response.ok) {
            return null;
          }
          const data = (await response.json()) as ServerResponse;
          return data.success ? ([id, data.users] as const) : null;
        } catch {
          return null;
        }
      }),
    ).then((entries) => {
      const next: ChromeExtensionUsersMap = {};
      for (const entry of entries) {
        if (entry) {
          next[entry[0]] = entry[1];
        }
      }
      if (Object.keys(next).length > 0) {
        setUsers(next);
      }
    });

    return () => controller.abort();
    // `key` already encodes the full id list; depending on `ids` directly
    // would re-run on every render due to new array identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return users;
};
