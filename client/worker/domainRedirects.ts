const canonicalHost = 'joseph-tech-solutions.dev';
const redirectHosts = new Set([
  'yosefhayimsabag.com',
  'www.yosefhayimsabag.com',
  'yosefhayimsabag.dev',
  'www.yosefhayimsabag.dev',
  'www.joseph-tech-solutions.dev',
]);

export const redirectDestination = (address: string) => {
  const url = new URL(address);
  const isFormerHost = redirectHosts.has(url.hostname);
  const isInsecureCanonical = url.hostname === canonicalHost && url.protocol !== 'https:';
  if (!isFormerHost && !isInsecureCanonical) return null;
  url.protocol = 'https:';
  url.hostname = canonicalHost;
  url.port = '';
  return url.toString();
};
