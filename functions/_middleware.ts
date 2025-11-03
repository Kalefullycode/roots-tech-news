import { blockAICrawlers } from './middleware/bot-protection';

export async function onRequest(context: any) {
  const { request } = context;
  
  const blockResponse = blockAICrawlers(request);
  if (blockResponse) {
    return blockResponse;
  }
  
  return context.next();
}



