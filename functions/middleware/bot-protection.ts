import { blockAICrawlers as block } from '../lib/bot-block';

export function blockAICrawlers(request: Request) {
  return block(request);
}





