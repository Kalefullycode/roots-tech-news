const AI_CRAWLER_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'CCBot',
  'anthropic-ai',
  'Claude-Web',
  'ClaudeBot',
  'cohere-ai',
  'Omgilibot',
  'FacebookBot',
  'Applebot',
  'Applebot-Extended',
  'Google-Extended',
  'PerplexityBot',
  'YouBot',
  'Bytespider',
  'Diffbot',
  'ImagesiftBot',
  'PetalBot',
  'meta-externalagent'
];

export function isAICrawler(userAgent: string): boolean {
  const ua = (userAgent || '').toLowerCase();
  return AI_CRAWLER_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

export function blockAICrawlers(request: Request): Response | null {
  const userAgent = request.headers.get('User-Agent') || '';
  if (isAICrawler(userAgent)) {
    console.warn(`Blocked AI crawler: ${userAgent}`);
    return new Response('Access Denied', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        'X-Robots-Tag': 'noindex, nofollow, noarchive'
      }
    });
  }
  return null;
}











