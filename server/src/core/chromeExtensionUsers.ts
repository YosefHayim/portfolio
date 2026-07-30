/**
 * Parses the public Chrome Web Store user count out of a listing page.
 *
 * The store is a server-rendered React app, so the active-user count appears
 * as plain text near the top of the document (e.g. `>1,234 users` or `>10,000+ users`).
 * Pattern is intentionally loose because Google occasionally A/B-tests the
 * surrounding markup; we only depend on the numeric span itself.
 */
// Raw row example: ">1,234 users" or ">10,000+ users" captures "1,234" / "10,000+".
const CHROME_USERS_PATTERN = />\s*([0-9][0-9,]*\+?)\s*users?\b/i;
// Raw row example: "1,234+" becomes "1234" after stripping commas and plus.
const CHROME_USERS_NUMBER_PATTERN = /[+,]/g;
// Raw row example: "abcdefghijklmnopqrstuvwxyzabcdef" (32 chars a–p) is a valid store id.
const EXTENSION_ID_REGEX = /^[a-p]{32}$/;

export const extractChromeUsers = (html: string): number | null => {
  const match = html.match(CHROME_USERS_PATTERN);
  if (!match) {
    return null;
  }
  const [, rawUserCount] = match;

  if (rawUserCount === undefined) {
    return null;
  }

  const numeric = Number.parseInt(rawUserCount.replace(CHROME_USERS_NUMBER_PATTERN, ''), 10);
  return Number.isFinite(numeric) ? numeric : null;
};

/**
 * Chrome Web Store IDs are 32-character lowercase alphanumeric slugs (a-p).
 * Validated here so the route never proxies arbitrary input back to Google.
 */
export const isValidChromeExtensionId = (id: string): boolean => EXTENSION_ID_REGEX.test(id);

export const chromeExtensionUrl = (id: string): string =>
  `https://chromewebstore.google.com/detail/${id}`;
