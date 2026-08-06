const LOCAL_API_URL = 'http://localhost:3000';
// Raw row example: "yosefhayimsabag.com" or "www.yosefhayimsabag.com" should match production host.
const PRODUCTION_HOST_PATTERN = /(^|\.)yosefhayimsabag\.com$/i;
// Raw row example: "portfolio.joseph.workers.dev" should match workers.dev preview hosts.
const WORKERS_DEV_HOST_PATTERN = /\.workers\.dev$/i;

// Raw row example: "https://api.example.com/" becomes "https://api.example.com".
const TRAILING_SLASH_PATTERN = /\/+$/;
const stripTrailingSlash = (value: string): string => value.replace(TRAILING_SLASH_PATTERN, '');

/**
 * Reads the Portfolio Assistant API origin from env or the current host.
 *
 * @returns Absolute origin without a trailing slash.
 * @example
 * readApiBaseUrl() // "http://localhost:3000" in local Vite
 */
const readApiBaseUrl = (): string => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredUrl) {
    return stripTrailingSlash(configuredUrl);
  }

  if (typeof globalThis.location === 'undefined') {
    return LOCAL_API_URL;
  }

  const hostname = globalThis.location.hostname;
  if (PRODUCTION_HOST_PATTERN.test(hostname) || WORKERS_DEV_HOST_PATTERN.test(hostname)) {
    return globalThis.location.origin;
  }

  return LOCAL_API_URL;
};

export const API_BASE_URL = readApiBaseUrl();
