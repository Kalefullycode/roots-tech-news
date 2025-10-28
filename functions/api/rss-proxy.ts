// Cloudflare Pages Function - RSS Proxy
// Handles CORS issues when fetching RSS feeds from external sources

interface Env {
  // Add any environment variables here if needed
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
  'rss.app',
  'feedburner.com',
  'feeds.feedburner.com',
  
  // AI Companies & Research
  'openai.com',
  'anthropic.com',
  'www.anthropic.com',
  'blogs.nvidia.com',
  'ai.googleblog.com',
  'blog.research.google',
  'ai.meta.com', // ✅ Added Meta AI
  'blogs.microsoft.com', // ✅ Added Microsoft AI
  
  // Academic & Research
  'rss.arxiv.org', // ✅ Added arXiv (AI & ML research papers)
  'arxiv.org',
  
  // AI News & Analysis
  'artificialintelligence-news.com', // ✅ Added AI News
  'www.artificialintelligence-news.com',
  'towardsdatascience.com',
  'machinelearningmastery.com',
  
  // Podcasts
  'feeds.transistor.fm', // ✅ Added (Cognitive Revolution)
  'api.substack.com', // ✅ Added (Latent Space & others)
  'substack.com',
  'changelog.com', // ✅ Added (Practical AI)
  
  // Video Platforms
  'youtube.com',
  'www.youtube.com',
  
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
export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  try {
    // Parse URL and get the 'url' query parameter
    const url = new URL(request.url);
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
    const decodedFeedUrl = decodeURIComponent(feedUrl);

    // Security check: Validate domain
    if (!isAllowedDomain(decodedFeedUrl)) {
      return new Response(
        JSON.stringify({ 
          error: 'Domain not allowed',
          message: 'This RSS feed domain is not in the allowed list for security reasons.',
          allowedDomains: ALLOWED_DOMAINS
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

    console.log(`Fetching RSS feed: ${decodedFeedUrl}`);

    // Fetch the RSS feed with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Use realistic browser headers to avoid 403 errors from some sites
    const response = await fetch(decodedFeedUrl, {
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

    // Check if fetch was successful
    if (!response.ok) {
      console.error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch RSS feed',
          status: response.status,
          statusText: response.statusText,
          url: decodedFeedUrl
        }), 
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Get the RSS content
    const rssContent = await response.text();

    // Determine content type
    const contentType = response.headers.get('content-type') || 'application/xml';

    // Return the RSS feed with CORS headers
    return new Response(rssContent, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('RSS Proxy Error:', error);

    // Handle specific error types
    let errorMessage = 'An error occurred while fetching the RSS feed';
    let statusCode = 500;

    if (error.name === 'AbortError') {
      errorMessage = 'Request timeout - RSS feed took too long to respond';
      statusCode = 504;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        type: error.name || 'UnknownError'
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
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

