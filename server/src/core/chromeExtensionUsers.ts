/**
 * Parses the public Chrome Web Store user count out of a listing page.
 *
 * The store is a server-rendered React app, so the active-user count appears
 * as plain text near the top of the document (e.g. `>1,234 users` or `>10,000+ users`).
 * Pattern is intentionally loose because Google occasionally A/B-tests the
 * surrounding markup; we only depend on the numeric span itself.
 */
export function extractChromeUsers(html: string): number | null {
	const match = html.match(/>\s*([0-9][0-9,]*\+?)\s*users?\b/i);
	if (!match) {
		return null;
	}
	const numeric = Number.parseInt(match[1].replace(/[+,]/g, ""), 10);
	return Number.isFinite(numeric) ? numeric : null;
}

/**
 * Chrome Web Store IDs are 32-character lowercase alphanumeric slugs (a-p).
 * Validated here so the route never proxies arbitrary input back to Google.
 */
const EXTENSION_ID_REGEX = /^[a-p]{32}$/;

export function isValidChromeExtensionId(id: string): boolean {
	return EXTENSION_ID_REGEX.test(id);
}

export function chromeExtensionUrl(id: string): string {
	return `https://chromewebstore.google.com/detail/${id}`;
}
