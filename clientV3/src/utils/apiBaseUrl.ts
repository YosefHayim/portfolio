const LOCAL_API_URL = 'http://localhost:3000';
const PRODUCTION_HOST_PATTERN = /(^|\.)yosefhayimsabag\.com$/i;
const WORKERS_DEV_HOST_PATTERN = /\.workers\.dev$/i;

const stripTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

export const resolveApiBaseUrl = (): string => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredUrl) {
    return stripTrailingSlash(configuredUrl);
  }

  if (
    typeof window !== 'undefined' &&
    (PRODUCTION_HOST_PATTERN.test(window.location.hostname) ||
      WORKERS_DEV_HOST_PATTERN.test(window.location.hostname))
  ) {
    return window.location.origin;
  }

  return LOCAL_API_URL;
};

export const API_BASE_URL = resolveApiBaseUrl();
