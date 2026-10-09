import { Effect } from 'effect';
import { cacheControlFor } from './cacheHeaders';
import { redirectDestination } from './domainRedirects';
import { addSecurityHeaders } from './securityHeaders';

const defaultCacheControl = 'public, max-age=0, must-revalidate';

const serveFile = (request: Request, env: Env) => {
  const { pathname } = new URL(request.url);
  const fetchFile = Effect.tryPromise(() => env.ASSETS.fetch(request));
  const withHeaders = Effect.map(fetchFile, (file) => {
    const response = new Response(file.body, file);
    const current = response.headers.get('Cache-Control') || defaultCacheControl;
    const cacheControl = cacheControlFor(pathname, response.status, current);
    response.headers.set('Cache-Control', cacheControl);
    addSecurityHeaders(response.headers);
    return response;
  });
  const handleFailure = Effect.catchAll(withHeaders, (error) => {
    const report = Effect.logError('static_asset_failure', error);
    const unavailable = new Response('Service temporarily unavailable', { status: 503 });
    return Effect.as(report, unavailable);
  });
  return Effect.runPromise(handleFailure);
};

const serveSite = (request: Request, env: Env) => {
  const destination = redirectDestination(request.url);
  if (destination) return Response.redirect(destination, 308);
  return serveFile(request, env);
};

export default { fetch: serveSite } satisfies ExportedHandler<Env>;
