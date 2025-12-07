// Cloudflare Pages Function - Reddit Proxy
// Handles CORS issues when fetching Reddit posts from external sources
// Uses Cloudflare Cache API for performance

/// <reference types="@cloudflare/workers-types" />

interface Env {
  [key: string]: unknown;
}

interface PagesFunctionContext {
  request: Request;
  env: Env;
  waitUntil?: (promise: Promise<unknown>) => void;
  next?: () => Response | Promise<Response>;
  data?: Record<string, unknown>;
}

// Allowed subreddits for security
const ALLOWED_SUBREDDITS = [
  'artificial',
  'technology',
  'MachineLearning',
  'tech',
  'programming',
  'artificialintelligence',
  'computerscience',
  'cybersecurity',
  'startups',
  'webdev',
  'javascript',
  'python',
  'gamedev',
  'hardware',
  'sysadmin'
];

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

// Main request handler
export async function onRequestGet(context: PagesFunctionContext): Promise<Response> {
  const { request } = context;

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(request.url);
    const subreddit = url.searchParams.get('subreddit') || 'technology';
    const sort = url.searchParams.get('sort') || 'top';
    const limit = parseInt(url.searchParams.get('limit') || '15', 10);

    // Validate subreddit
    if (!ALLOWED_SUBREDDITS.includes(subreddit)) {
      return new Response(
        JSON.stringify({
          error: 'Subreddit not allowed',
          message: `The subreddit "${subreddit}" is not in the allowed list for security reasons.`,
          allowedSubreddits: ALLOWED_SUBREDDITS
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Validate sort parameter
    const validSorts = ['top', 'hot', 'new', 'rising'];
    const validSort = validSorts.includes(sort) ? sort : 'top';

    // Validate limit (max 25)
    const validLimit = Math.min(Math.max(1, limit), 25);

    // Create cache key
    const cacheKey = new Request(
      `https://www.reddit.com/r/${subreddit}/${validSort}.json?limit=${validLimit}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'RootsTechNews/1.0',
        },
      }
    );

    // Try to get from cache first (Cloudflare Cache API)
    const cache = caches.default;
    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      console.log(`Cache hit for Reddit r/${subreddit}`);
      // Clone response to add CORS headers
      const headers = new Headers(cachedResponse.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });

      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers,
      });
    }

    console.log(`Fetching Reddit r/${subreddit} (cache miss)`);

    // Fetch from Reddit API
    const redditUrl = `https://www.reddit.com/r/${subreddit}/${validSort}.json?limit=${validLimit}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    let response: Response;
    try {
      response = await fetch(redditUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'RootsTechNews/1.0',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      } as RequestInit);
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`Reddit API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Create response with caching
    const responseHeaders = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=300',
      ...corsHeaders,
    });

    const responseBody = JSON.stringify(data);
    const cachedResponseToStore = new Response(responseBody, {
      status: 200,
      headers: responseHeaders,
    });

    // Store in cache (Cloudflare will handle this automatically)
    context.waitUntil?.(cache.put(cacheKey, cachedResponseToStore.clone()));

    return cachedResponseToStore;
  } catch (error) {
    console.error('Reddit Proxy Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isTimeout = errorMessage.includes('aborted') || errorMessage.includes('timeout');

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch Reddit data',
        details: isTimeout ? 'Request timed out' : errorMessage,
      }),
      {
        status: isTimeout ? 504 : 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

