// Cloudflare Pages Function - RSS Feed Aggregator
// Accessible at /functions/fetch-rss
// Fetches and aggregates articles from multiple RSS feeds

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

// Curated RSS Feed Sources - AI & Tech Focus
// Updated with working URLs for Meta AI, Anthropic, and DeepMind
// Includes high-frequency news sources for breaking news
const RSS_SOURCES = [
  // AI-Focused Sources
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'AI' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', category: 'AI' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', category: 'AI' },
  // AI Company Blogs - Updated URLs
  { name: 'Meta AI', url: 'https://ai.meta.com/blog/rss/', category: 'AI' },
  { name: 'Anthropic', url: 'https://www.anthropic.com/news/rss', category: 'AI' },
  { name: 'DeepMind', url: 'https://deepmind.google/discover/blog/rss/', category: 'AI' },
  { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', category: 'AI' },
  { name: 'Google AI Blog', url: 'https://blog.research.google/feeds/posts/default', category: 'AI' },
  
  // High-Frequency Tech News Sources
  { name: 'Reuters Technology', url: 'https://www.reuters.com/technology/feed/', category: 'Tech' },
  { name: 'Associated Press Tech', url: 'https://apnews.com/hub/technology/rss', category: 'Tech' },
  { name: 'CNBC Technology', url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html', category: 'Tech' },
  { name: 'ZDNet', url: 'https://www.zdnet.com/news/rss.xml', category: 'Tech' },
  { name: 'TechMeme', url: 'https://www.techmeme.com/feed.xml', category: 'Tech' },
  { name: 'Engadget', url: 'https://www.engadget.com/rss.xml', category: 'Tech' },
  { name: 'Gizmodo', url: 'https://gizmodo.com/rss', category: 'Tech' },
  { name: 'Mashable', url: 'https://mashable.com/feeds/rss/tech', category: 'Tech' },
  { name: 'The Next Web', url: 'https://thenextweb.com/feed/', category: 'Tech' },
  { name: 'Digital Trends', url: 'https://www.digitaltrends.com/feed/', category: 'Tech' },
  
  // Established Tech Sources
  { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', category: 'Tech' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'Tech' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'Tech' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'Tech' },
  
  // Cybersecurity & AI Security Sources
  { name: 'CyberInsider', url: 'https://cyberinsider.com/feed/', category: 'Security' },
  { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews', category: 'Security' },
  { name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/', category: 'Security' },
  { name: 'Bleeping Computer', url: 'https://www.bleepingcomputer.com/feed/', category: 'Security' },
  { name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml', category: 'Security' },
];

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  image: string;
}

// Parse RSS XML using regex (works in Cloudflare Workers)
function parseRSSXML(xmlText: string, sourceName: string, category: string): Article[] {
  const articles: Article[] = [];
  
  try {
    // Extract items using regex (more reliable in Workers environment)
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    const items = xmlText.match(itemRegex) || [];
    
    for (const itemXml of items.slice(0, 10)) {
      try {
        // Extract title
        const titleMatch = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : 'Untitled';
        
        // Extract link/url
        const linkMatch = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
        const url = linkMatch ? linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : '#';
        
        // Extract description
        const descMatch = itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
        let description = descMatch 
          ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').trim()
          : '';
        description = description.substring(0, 200);
        
        // Extract pubDate - handle multiple date formats
        const pubDateMatch = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) || 
                            itemXml.match(/<dc:date[^>]*>([\s\S]*?)<\/dc:date>/i) ||
                            itemXml.match(/<published[^>]*>([\s\S]*?)<\/published>/i);
        let pubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString();
        
        // Parse and normalize date format
        try {
          const parsedDate = new Date(pubDate);
          if (!isNaN(parsedDate.getTime())) {
            pubDate = parsedDate.toISOString();
          } else {
            // Fallback to current time if date is invalid
            pubDate = new Date().toISOString();
          }
        } catch {
          pubDate = new Date().toISOString();
        }
        
        // Extract guid
        const guidMatch = itemXml.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i);
        const guid = guidMatch ? guidMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim() : null;
        
        // Extract image from various sources
        let image = '/placeholder.svg';
        
        // Try media:content
        const mediaContentMatch = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
        if (mediaContentMatch) {
          image = mediaContentMatch[1];
        } else {
          // Try media:thumbnail
          const mediaThumbMatch = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
          if (mediaThumbMatch) {
            image = mediaThumbMatch[1];
          } else {
            // Try enclosure
            const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
            if (enclosureMatch) {
              image = enclosureMatch[1];
            } else {
              // Try img tag in description
              const imgMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["']/i);
              if (imgMatch) {
                image = imgMatch[1];
              }
            }
          }
        }
        
        const id = guid || url || `${sourceName}-${Date.now()}-${Math.random()}`;
        
        articles.push({
          id,
          title,
          description,
          url,
          publishedAt: pubDate,
          source: sourceName,
          category,
          image
        });
      } catch (itemError) {
        console.error(`Error parsing item from ${sourceName}:`, itemError);
        // Continue with next item
      }
    }
  } catch (parseError) {
    console.error(`Error parsing RSS from ${sourceName}:`, parseError);
  }
  
  return articles;
}

export async function onRequestGet(context: PagesFunctionContext): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Cache duration: 5 minutes (300 seconds) - reduced for fresher news
  const CACHE_DURATION = 300;
  const headers = {
    ...corsHeaders,
    'Content-Type': 'application/json',
    'Cache-Control': `public, max-age=${CACHE_DURATION}, s-maxage=${CACHE_DURATION}`,
  };

  // Create cache key
  const cache = caches.default;
  const cacheKey = new Request(context.request.url, {
    method: 'GET',
  });

  // Try to get from cache first
  try {
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      console.log('Cache hit for RSS feeds');
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
  } catch (cacheError) {
    console.warn('Cache read error:', cacheError);
    // Continue with fresh fetch
  }

  try {
    const allArticles: Article[] = [];
    const fetchErrors: string[] = [];

    // Fetch from all RSS sources in parallel with better error handling
    const fetchPromises = RSS_SOURCES.map(async (source) => {
      try {
        // Create controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        let response: Response;
        try {
          response = await fetch(source.url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/rss+xml, application/xml, text/xml, */*',
              'Accept-Language': 'en-US,en;q=0.9',
              'Referer': 'https://rootstechnews.com/',
            },
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
        } catch (fetchError) {
          clearTimeout(timeoutId);
          if (fetchError instanceof Error && fetchError.name === 'AbortError') {
            const errorMsg = `Timeout fetching ${source.name}`;
            console.error(errorMsg);
            fetchErrors.push(errorMsg);
            return [];
          }
          throw fetchError;
        }
        
        if (!response.ok) {
          const errorMsg = `${source.name}: ${response.status} ${response.statusText}`;
          console.error(`Failed to fetch ${errorMsg}`);
          fetchErrors.push(errorMsg);
          return [];
        }
        
        const xmlText = await response.text();
        
        // Validate that we got actual content
        if (!xmlText || xmlText.trim().length === 0) {
          const errorMsg = `${source.name}: Empty response`;
          console.error(errorMsg);
          fetchErrors.push(errorMsg);
          return [];
        }
        
        const articles = parseRSSXML(xmlText, source.name, source.category);
        
        if (articles.length === 0) {
          console.warn(`No articles parsed from ${source.name}`);
        }
        
        return articles;
      } catch (err) {
        const errorMsg = `${source.name}: ${err instanceof Error ? err.message : 'Unknown error'}`;
        console.error(`Failed to fetch ${errorMsg}`);
        fetchErrors.push(errorMsg);
        return []; // Return empty array on error
      }
    });

    const results = await Promise.all(fetchPromises);
    
    // Flatten results and add to allArticles
    results.forEach(articles => {
      allArticles.push(...articles);
    });

    // Sort by date, newest first - prioritize AI articles
    allArticles.sort((a, b) => {
      // Prioritize AI articles
      const aIsAI = (a.category || '').toLowerCase() === 'ai' || 
                    (a.title || '').toLowerCase().includes('ai') ||
                    (a.title || '').toLowerCase().includes('gpt') ||
                    (a.title || '').toLowerCase().includes('llm') ||
                    (a.title || '').toLowerCase().includes('artificial intelligence');
      const bIsAI = (b.category || '').toLowerCase() === 'ai' || 
                    (b.title || '').toLowerCase().includes('ai') ||
                    (b.title || '').toLowerCase().includes('gpt') ||
                    (b.title || '').toLowerCase().includes('llm') ||
                    (b.title || '').toLowerCase().includes('artificial intelligence');
      
      if (aIsAI && !bIsAI) return -1;
      if (!aIsAI && bIsAI) return 1;
      
      // Then sort by date
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      
      // Handle invalid dates
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1; // Invalid dates go to end
      if (isNaN(dateB)) return -1;
      
      return dateB - dateA; // Newest first
    });

    // Remove duplicates based on title
    const uniqueArticles = allArticles.filter((article, index, self) =>
      index === self.findIndex((a) => a.title.toLowerCase() === article.title.toLowerCase())
    );

    // Filter to only show Tech/AI articles and exclude non-tech content
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    // Keywords that indicate non-tech content to exclude
    const excludeKeywords = [
      'black friday', 'coupon', 'promo code', 'deal', 'sale', 'discount',
      'kitchenaid', 'sephora', 'target', 'best buy', 'lowes', 'whoop',
      'marvel rivals', 'gaming', 'video game', 'playstation', 'xbox', 'nintendo'
    ];
    
    const recentArticles = uniqueArticles.filter(article => {
      const articleDate = new Date(article.publishedAt).getTime();
      const titleLower = (article.title || '').toLowerCase();
      const categoryLower = (article.category || '').toLowerCase();
      const descriptionLower = (article.description || '').toLowerCase();
      const combinedText = `${titleLower} ${descriptionLower}`;
      
      // Exclude articles with non-tech keywords
      const hasExcludeKeyword = excludeKeywords.some(keyword => 
        combinedText.includes(keyword)
      );
      if (hasExcludeKeyword) return false;
      
      // Check if it's AI/Tech content
      const isAI = categoryLower === 'ai' || 
                   titleLower.includes('ai') ||
                   titleLower.includes('gpt') ||
                   titleLower.includes('llm') ||
                   titleLower.includes('artificial intelligence') ||
                   titleLower.includes('openai') ||
                   titleLower.includes('anthropic') ||
                   titleLower.includes('deepmind') ||
                   titleLower.includes('machine learning') ||
                   titleLower.includes('neural network');
      
      const isTech = categoryLower === 'tech' || 
                     categoryLower === 'security' ||
                     titleLower.includes('tech') ||
                     titleLower.includes('technology') ||
                     titleLower.includes('cyber') ||
                     titleLower.includes('software') ||
                     titleLower.includes('hardware') ||
                     titleLower.includes('startup') ||
                     titleLower.includes('innovation');
      
      // Include AI articles (always, even if older)
      if (isAI) return true;
      
      // Include Tech articles if recent
      if (isTech) {
        if (isNaN(articleDate)) return false; // Exclude invalid dates
        return articleDate >= sevenDaysAgo; // Include recent tech articles
      }
      
      // Exclude everything else
      return false;
    });
    
    const responseData = {
      articles: recentArticles.slice(0, 100), // Increased limit for better coverage
      count: recentArticles.length,
      totalFetched: uniqueArticles.length,
      sources: RSS_SOURCES.length,
      successfulSources: RSS_SOURCES.length - fetchErrors.length,
      errors: fetchErrors.length > 0 ? fetchErrors : undefined,
      lastUpdated: new Date().toISOString()
    };

    const response = new Response(JSON.stringify(responseData), {
      status: 200,
      headers
    });

    // Cache the response (use waitUntil if available)
    if (context.waitUntil) {
      context.waitUntil(
        cache.put(cacheKey, response.clone()).catch((cacheError) => {
          console.warn('Failed to cache RSS feeds:', cacheError);
        })
      );
    } else {
      // Fallback: cache synchronously
      cache.put(cacheKey, response.clone()).catch((cacheError) => {
        console.warn('Failed to cache RSS feeds:', cacheError);
      });
    }

    return response;

  } catch (error: unknown) {
    console.error('RSS fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch RSS feeds',
      message: errorMessage,
      sources: RSS_SOURCES.length,
      successfulSources: 0
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      }
    });
  }
}

// Handle OPTIONS for CORS preflight
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Max-Age': '86400',
    }
  });
}

