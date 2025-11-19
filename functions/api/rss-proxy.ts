// Cloudflare Pages Function - RSS Proxy
// Handles CORS issues when fetching RSS feeds from external sources
// Uses Cloudflare Cache API for performance

/// <reference types="@cloudflare/workers-types" />

interface Env {
  RESEND_API_KEY?: string;
  [key: string]: unknown;
}

interface PagesFunctionContext {
  request: Request;
  env: Env;
  waitUntil?: (promise: Promise<unknown>) => void;
  next?: () => Response | Promise<Response>;
  data?: Record<string, unknown>;
}

// Whitelist of allowed RSS feed domains for security
const ALLOWED_DOMAINS = [
  // Tech News
  'techcrunch.com',
  'feeds.arstechnica.com',
  'theverge.com',
  'technologyreview.com',
  'techcabal.com',
  'wired.com',
  'engadget.com',
  'venturebeat.com',
  'readwrite.com',
  'techafrique.com',
  'disrupt-africa.com',
  'africa.businessinsider.com',
  'thenextweb.com',
  'mashable.com',
  'cnet.com',
  'zdnet.com',
  'axios.com',
  'bloomberg.com',
  'hnrss.org',
  
  // RSS Aggregators
  'rss.app', // RSS.app YouTube feeds
  'feedburner.com',
  'feeds.feedburner.com',
  
  // AI Companies & Research
  'openai.com',
  'www.openai.com',
  'anthropic.com',
  'www.anthropic.com',
  'deepmind.com',
  'deepmind.google',
  'www.deepmind.com',
  'ai.meta.com',
  'www.ai.meta.com',
  'meta.com',
  'blogs.nvidia.com',
  'nvidia.com',
  'ai.googleblog.com',
  'blog.research.google',
  'research.google',
  'blogs.microsoft.com',
  'microsoft.com',
  
  // Academic & Research
  'rss.arxiv.org', // ✅ Added arXiv (AI & ML research papers)
  'arxiv.org',
  'spectrum.ieee.org', // ✅ Added IEEE Spectrum
  
  // AI News & Analysis
  'artificialintelligence-news.com', // ✅ Added AI News
  'www.artificialintelligence-news.com',
  'towardsdatascience.com',
  'machinelearningmastery.com',
  
  // Additional Tech Sources
  'techradar.com',
  'www.techradar.com',
  
  // Podcasts
  'feeds.transistor.fm', // Cognitive Revolution
  'api.substack.com', // Latent Space & others
  'substack.com',
  'changelog.com', // Practical AI & The Changelog
  'lexfridman.com', // Lex Fridman Podcast
  'twimlai.com', // TWIML AI Podcast
  'feeds.simplecast.com', // The Vergecast, a16z, Code Switch, Masters of Scale
  'feeds.megaphone.fm', // Accidental Tech, Pivot, Darknet Diaries, Hard Fork, CyberWire, Acquired
  'feeds.twit.tv', // This Week in Tech
  'feeds.npr.org', // How I Built This, Code Switch
  'risky.biz', // Risky Business
  'feeds.pacific-content.com', // Command Line Heroes
  
  // News & Culture
  'afrotech.com', // AfroTech
  'blackenterprise.com', // Black Enterprise
  'urbangeekz.com', // UrbanGeekz
  'essence.com', // Essence
  'theguardian.com', // The Guardian
  'rss.nytimes.com', // NYT
  'reuters.com', // Reuters
  
  // Daily Tech News Sources
  '9to5mac.com', // 9to5Mac
  '9to5google.com', // 9to5Google
  'androidauthority.com', // Android Authority
  'androidpolice.com', // Android Police
  'geekwire.com', // GeekWire
  'siliconangle.com', // SiliconANGLE
  'theregister.com', // The Register
  'marktechpost.com', // MarkTechPost
  'syncedreview.com', // Synced AI
  'news.crunchbase.com', // Crunchbase News
  'techinasia.com', // Tech in Asia
  'technode.com', // TechNode
  'bleepingcomputer.com', // BleepingComputer
  'darkreading.com', // Dark Reading
  'therecord.media', // The Record
  'cyberinsider.com', // CyberInsider
  'www.cyberinsider.com', // CyberInsider (www)
  'cybernews.com', // CyberNews
  'www.cybernews.com', // CyberNews (www)
  'thehackernews.com', // The Hacker News
  'www.thehackernews.com', // The Hacker News (www)
  'www.reuters.com', // Reuters (www)
  'apnews.com', // Associated Press
  'www.apnews.com', // Associated Press (www)
  'www.cnbc.com', // CNBC (www)
  'cnbc.com', // CNBC
  'gizmodo.com', // Gizmodo
  'www.gizmodo.com', // Gizmodo (www)
  'digitaltrends.com', // Digital Trends
  'www.digitaltrends.com', // Digital Trends (www)
  
  // Video Platforms
  'youtube.com',
  'www.youtube.com',
  'reddit.com',
  'www.reddit.com',
  
  // Startups & Business
  'producthunt.com',
  'www.producthunt.com',
  
  // Security & Science
  'ventureburn.com',
  'krebsonsecurity.com',
  'schneier.com',
  'threatpost.com',
  'quantamagazine.org',
  'sciencedaily.com',
  'newscientist.com',
  'cyberinsider.com', // CyberInsider
  'www.cyberinsider.com', // CyberInsider (www)
  'www.reuters.com', // Reuters (www)
  'apnews.com', // Associated Press
  'www.apnews.com', // Associated Press (www)
  'www.cnbc.com', // CNBC (www)
  'cnbc.com', // CNBC
  'gizmodo.com', // Gizmodo
  'www.gizmodo.com', // Gizmodo (www)
  'digitaltrends.com', // Digital Trends
  'www.digitaltrends.com', // Digital Trends (www)
];

// Check if URL is from an allowed domain
function isAllowedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    return ALLOWED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch (error) {
    return false;
  }
}

// Main request handler
export async function onRequestGet(context: PagesFunctionContext): Promise<Response> {
  const { request } = context;
  
  // Block AI crawlers at edge
  try {
    const { blockAICrawlers } = await import('../lib/bot-block');
    const aiBlock = blockAICrawlers(request);
    if (aiBlock) return aiBlock;
  } catch (_) {
    // No-op if util not available
  }
  
  // CORS headers - restrict to allowed origins
  const allowedOrigins = [
    'https://rootstechnews.com',
    'https://www.rootstechnews.com',
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative dev port
  ];
  
  const origin = request.headers.get('Origin') || '';
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  try {
    // Parse URL and get the 'url' query parameter
    let url: URL;
    try {
      url = new URL(request.url);
    } catch (urlError) {
      console.error('Invalid request URL:', urlError);
      return new Response(
        JSON.stringify({ error: 'Invalid request URL' }), 
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    const feedUrl = url.searchParams.get('url');

    // Validate feed URL parameter
    if (!feedUrl) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameter: url',
          usage: '/api/rss-proxy?url=https://example.com/feed.xml'
        }), 
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Decode URL if it's encoded
    let decodedFeedUrl: string;
    try {
      decodedFeedUrl = decodeURIComponent(feedUrl);
    } catch (decodeError) {
      console.error('Failed to decode URL:', decodeError);
      return new Response(
        JSON.stringify({ error: 'Invalid URL encoding' }), 
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Validate URL format
    let parsedFeedUrl: URL;
    try {
      parsedFeedUrl = new URL(decodedFeedUrl);
    } catch (urlParseError) {
      console.error('Invalid feed URL format:', urlParseError);
      return new Response(
        JSON.stringify({ error: 'Invalid feed URL format' }), 
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Security check: Validate domain
    if (!isAllowedDomain(decodedFeedUrl)) {
      console.warn(`Blocked request to unauthorized domain: ${parsedFeedUrl.hostname}`);
      return new Response(
        JSON.stringify({ 
          error: 'Domain not allowed',
          message: 'This RSS feed domain is not in the allowed list for security reasons.',
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

    // Create cache key from URL
    const cacheKey = new Request(decodedFeedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // Try to get from cache first (Cloudflare Cache API)
    const cache = caches.default;
    let cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      console.log(`Cache hit for: ${decodedFeedUrl}`);
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

    console.log(`Fetching RSS feed (cache miss): ${decodedFeedUrl}`);

    // Fetch the RSS feed with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    let response: Response;
    try {
      // Use realistic browser headers to avoid 403 errors from some sites
      response = await fetch(decodedFeedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Referer': 'https://rootstechnews.com/',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error(`Timeout fetching RSS feed: ${decodedFeedUrl}`);
        return new Response(
          JSON.stringify({ 
            error: 'Request timeout',
            message: 'RSS feed took too long to respond (15s timeout)',
            url: decodedFeedUrl
          }), 
          {
            status: 504,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
      
      console.error('Failed to fetch RSS feed:', fetchError);
      throw fetchError;
    }

    // Check if fetch was successful
    if (!response.ok) {
      // Suppress logging for common errors (404, 400, 403)
      if (response.status >= 400 && response.status < 500) {
        // Only log in development or for unexpected 4xx errors
        if (response.status !== 404 && response.status !== 400 && response.status !== 403) {
          console.warn(`Failed to fetch RSS feed: ${response.status} ${response.statusText} - ${decodedFeedUrl}`);
        }
      } else {
        console.error(`Failed to fetch RSS feed: ${response.status} ${response.statusText} - ${decodedFeedUrl}`);
      }
      
      // Return proper error status but with JSON body for client-side handling
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch RSS feed',
          status: response.status,
          statusText: response.statusText,
          url: decodedFeedUrl
        }), 
        {
          status: response.status >= 400 && response.status < 500 ? response.status : 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Get the RSS content
    let rssContent: string;
    try {
      rssContent = await response.text();
    } catch (textError) {
      console.error('Failed to read RSS content:', textError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to read RSS feed content',
          url: decodedFeedUrl
        }), 
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Validate that we got actual content
    if (!rssContent || rssContent.trim().length === 0) {
      console.error('Empty RSS feed content received');
      return new Response(
        JSON.stringify({ 
          error: 'Empty RSS feed received',
          url: decodedFeedUrl
        }), 
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Determine content type
    const contentType = response.headers.get('content-type') || 'application/xml';

    // Create response with caching headers
    const responseHeaders = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=300, s-maxage=300', // Cache for 5 minutes
      ...corsHeaders,
    });

    const finalResponse = new Response(rssContent, {
      status: 200,
      headers: responseHeaders,
    });

    // Cache the response (Cloudflare Cache API)
    // Use waitUntil to cache in background if available
    if (context.waitUntil) {
      context.waitUntil(
        cache.put(cacheKey, finalResponse.clone()).catch((cacheError) => {
          console.warn('Failed to cache RSS feed:', cacheError);
        })
      );
    } else {
      // Fallback: cache synchronously
      cache.put(cacheKey, finalResponse.clone()).catch((cacheError) => {
        console.warn('Failed to cache RSS feed:', cacheError);
      });
    }

    return finalResponse;

  } catch (error: unknown) {
    console.error('RSS Proxy Error:', error);

    // Handle specific error types
    let errorMessage = 'An error occurred while fetching the RSS feed';
    let statusCode = 500;
    let errorName = 'UnknownError';

    if (error instanceof Error) {
      errorName = error.name;
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout - RSS feed took too long to respond';
        statusCode = 504;
      } else if (error.message) {
        errorMessage = error.message;
      }
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        type: errorName
      }), 
      {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function onRequestOptions(context: PagesFunctionContext) {
  const { request } = context;
  const allowedOrigins = [
    'https://rootstechnews.com',
    'https://www.rootstechnews.com',
    'http://localhost:5173',
    'http://localhost:3000',
  ];
  
  const origin = request.headers.get('Origin') || '';
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

