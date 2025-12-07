import { blockAICrawlers } from './middleware/bot-protection';

interface CloudflareContext {
  request: Request;
  env: Record<string, unknown>;
  next: () => Response | Promise<Response>;
}

export async function onRequest(context: CloudflareContext) {
  const { request } = context;
  
  // Enforce HTTPS - redirect HTTP to HTTPS
  const url = new URL(request.url);
  if (url.protocol === 'http:' && url.hostname !== 'localhost') {
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  
  // Block AI crawlers
  const blockResponse = blockAICrawlers(request);
  if (blockResponse) {
    return blockResponse;
  }
  
  // Add security headers to all responses
  const response = await context.next();
  const newHeaders = new Headers(response.headers);
  
  // Ensure security headers are present
  if (!newHeaders.has('Strict-Transport-Security')) {
    newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  if (!newHeaders.has('X-Content-Type-Options')) {
    newHeaders.set('X-Content-Type-Options', 'nosniff');
  }
  if (!newHeaders.has('X-Frame-Options')) {
    newHeaders.set('X-Frame-Options', 'DENY');
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}






