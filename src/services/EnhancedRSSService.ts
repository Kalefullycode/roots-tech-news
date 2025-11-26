import { NewsArticle } from './NewsService';
import ContentFilter from './ContentFilter';
import { REAL_TIME_RSS_FEEDS } from '@/data/realTimeFeeds';
import FreeNewsService from './FreeNewsService';

interface RSSFeed {
  url: string;
  name: string;
  category: string;
}

class EnhancedRSSService {
  private cache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Use real-time feeds data source - only include active feeds
  private readonly RSS_FEEDS: RSSFeed[] = REAL_TIME_RSS_FEEDS
    .filter(feed => feed.active === true)
    .map(feed => ({
      url: feed.url,
      name: feed.name,
      category: this.mapCategory(feed.category)
    }));

  private mapCategory(category: string): string {
    const map: Record<string, string> = {
      'ai': 'AI',
      'tech-news': 'Tech',
      'research': 'AI',
      'startups': 'Startups',
      'security': 'Security',
      'products': 'Startups'
    };
    return map[category] || category;
  }

  private isValidImageUrl(url: string): boolean {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.includes('images') || url.includes('media');
  }

  private extractImageFromContent(content: string): string | null {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
  }

  private parseRSSXML(xmlText: string, sourceName: string, category: string): NewsArticle[] {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const items = xmlDoc.querySelectorAll('item, entry');
      
      const articles: NewsArticle[] = [];
      
      items.forEach((item, index) => {
        if (index >= 10) return;
        
        const title = item.querySelector('title')?.textContent || 'Untitled';
        const link = item.querySelector('link')?.textContent || 
                     item.querySelector('link')?.getAttribute('href') || '#';
        const description = item.querySelector('description, summary')?.textContent || 'No description available';
        const pubDate = item.querySelector('pubDate, published, updated')?.textContent || new Date().toISOString();
        
        let imageUrl = '';
        const enclosure = item.querySelector('enclosure');
        if (enclosure) {
          const enclosureUrl = enclosure.getAttribute('url');
          if (enclosureUrl && this.isValidImageUrl(enclosureUrl)) {
            imageUrl = enclosureUrl;
          }
        }
        
        const mediaContent = item.querySelector('media\\:content, [medium="image"]');
        if (!imageUrl && mediaContent) {
          const mediaUrl = mediaContent.getAttribute('url');
          if (mediaUrl && this.isValidImageUrl(mediaUrl)) {
            imageUrl = mediaUrl;
          }
        }
        
        if (!imageUrl && description) {
          const extractedImage = this.extractImageFromContent(description);
          if (extractedImage && this.isValidImageUrl(extractedImage)) {
            imageUrl = extractedImage;
          }
        }
        
        articles.push({
          id: link || Math.random().toString(36),
          title,
          description: description.replace(/<[^>]*>/g, '').substring(0, 300),
          url: link,
          urlToImage: imageUrl,
          publishedAt: pubDate,
          source: { id: sourceName.toLowerCase().replace(/\s+/g, '-'), name: sourceName },
          category
        });
      });
      
      return articles;
    } catch (error) {
      console.warn('Failed to parse RSS XML:', error);
      return [];
    }
  }

  async fetchFromRSS(feedUrl: string, sourceName: string, category: string): Promise<NewsArticle[]> {
    const cacheKey = feedUrl;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Use our Cloudflare Pages Function RSS proxy (preferred)
      const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`;
      const response = await fetch(proxyUrl, { 
        method: 'GET',
        headers: {
          'Accept': 'application/xml, application/rss+xml, text/xml',
        }
      });
      
      // Get response text first
      const responseText = await response.text();
      
      // Check if response is JSON error (from rss-proxy error handling)
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json') || (responseText.trim().startsWith('{') && responseText.includes('error'))) {
        // Silently handle errors - don't throw to prevent console noise
        return [];
      }
      
      if (!response.ok) {
        // Silently handle HTTP errors
        return [];
      }
      
      // Parse XML content
      const articles = this.parseRSSXML(responseText, sourceName, category);
      
      // Only cache successful results with articles
      if (articles.length > 0) {
        this.cache.set(cacheKey, { data: articles, timestamp: Date.now() });
      }
      return articles;
    } catch (error) {
      // Suppress all console errors for failed RSS feeds to reduce noise
      // Only log in development mode and only for non-404/400 errors
      if (import.meta.env.DEV) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const statusCode = errorMessage.match(/\b(400|404|403|500|502|503|504)\b/);
        if (!statusCode) {
          console.warn(`Failed to fetch RSS from ${sourceName}:`, errorMessage);
        }
      }
      
      // Return empty array - let the calling function handle fallbacks
      return [];
    }
  }

  async fetchAllRSSFeeds(): Promise<NewsArticle[]> {
    const allArticles: NewsArticle[] = [];
    
    const fetchPromises = this.RSS_FEEDS.map(feed => 
      this.fetchFromRSS(feed.url, feed.name, feed.category)
    );

    const results = await Promise.allSettled(fetchPromises);
    
    let successCount = 0;
    let failureCount = 0;
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allArticles.push(...result.value);
        successCount++;
      } else {
        failureCount++;
        // Only log failures in development mode to reduce console noise
        if (import.meta.env.DEV) {
          const feedName = this.RSS_FEEDS[index]?.name || 'Unknown';
          const reason = result.status === 'rejected' 
            ? (result.reason instanceof Error ? result.reason.message : String(result.reason))
            : 'No articles returned';
          
          // Suppress common error messages
          if (!reason.includes('404') && !reason.includes('400') && !reason.includes('403')) {
            console.warn(`Failed to fetch RSS feed: ${feedName}`, reason);
          }
        }
      }
    });

    // Only log summary in development
    if (import.meta.env.DEV && failureCount > 0) {
      console.log(`RSS Feed Summary: ${successCount} succeeded, ${failureCount} failed out of ${this.RSS_FEEDS.length} total feeds`);
    }

    // If we have articles, filter and return them
    if (allArticles.length > 0) {
      // Filter out non-AI/tech content
      const filteredArticles = ContentFilter.filterAndSort(allArticles);

      return filteredArticles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }

    // Fallback to free news sources if RSS feeds fail
    console.log('📡 RSS feeds failed, falling back to free news sources...');
    try {
      const freeArticles = await FreeNewsService.loadAllFeeds();
      if (freeArticles.length > 0) {
        console.log(`✅ Loaded ${freeArticles.length} articles from free sources`);
        return ContentFilter.filterAndSort(freeArticles).sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      }
    } catch (error) {
      console.warn('Free news sources also failed:', error);
    }

    // Return empty array if no articles - components should have fallbacks
    return [];
  }

  async fetchByCategory(category: string): Promise<NewsArticle[]> {
    const categoryFeeds = this.RSS_FEEDS.filter(feed => 
      feed.category.toLowerCase() === category.toLowerCase()
    );

    const allArticles: NewsArticle[] = [];
    
    const fetchPromises = categoryFeeds.map(feed => 
      this.fetchFromRSS(feed.url, feed.name, feed.category)
    );

    const results = await Promise.allSettled(fetchPromises);
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      }
    });

    // If RSS feeds failed, use free sources
    if (allArticles.length === 0) {
      try {
        const freeArticles = await FreeNewsService.loadByCategory(category);
        if (freeArticles.length > 0) {
          return ContentFilter.filterAndSort(freeArticles).sort((a, b) => 
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
        }
      } catch (error) {
        console.warn(`Free news sources failed for category ${category}:`, error);
      }
    }

    // Filter out non-AI/tech content
    const filteredArticles = ContentFilter.filterAndSort(allArticles);

    return filteredArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export default new EnhancedRSSService();

