import { blockAICrawlers } from './middleware/bot-protection';

interface CloudflareContext {
  request: Request;
  env: Record<string, unknown>;
  next: () => Response | Promise<Response>;
}

export async function onRequest(context: CloudflareContext) {
  const { request } = context;
  
  const blockResponse = blockAICrawlers(request);
  if (blockResponse) {
    return blockResponse;
  }
  
  return context.next();
}






