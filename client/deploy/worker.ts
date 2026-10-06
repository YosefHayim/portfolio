import { Effect } from 'effect';

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
  if (
    !redirectHosts.has(url.hostname) &&
    !(url.hostname === canonicalHost && url.protocol !== 'https:')
  )
    return null;
  url.protocol = 'https:';
  url.hostname = canonicalHost;
  url.port = '';
  return url.toString();
};

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'",
};

const fetchSite = (request: Request, env: Env): Promise<Response> => {
  const destination = redirectDestination(request.url);
  if (destination) return Promise.resolve(Response.redirect(destination, 308));
  const fetchAsset = Effect.tryPromise(() => env.ASSETS.fetch(request));
  const serveAsset = Effect.map(fetchAsset, (asset) => {
    const response = new Response(asset.body, asset);
    const cacheControl = response.headers.get('Cache-Control') || 'public';
    response.headers.set('Cache-Control', `${cacheControl}, no-transform`);
    for (const [name, value] of Object.entries(securityHeaders)) response.headers.set(name, value);
    return response;
  });
  const handleFailure = Effect.catchAll(serveAsset, (error) => {
    const report = Effect.logError('static_asset_failure', error);
    const unavailable = new Response('Service temporarily unavailable', { status: 503 });
    return Effect.as(report, unavailable);
  });
  return Effect.runPromise(handleFailure);
};

export default { fetch: fetchSite } satisfies ExportedHandler<Env>;
