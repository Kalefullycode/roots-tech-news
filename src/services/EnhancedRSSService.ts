import { NewsArticle } from './NewsService';
import ContentFilter from './ContentFilter';
import { REAL_TIME_RSS_FEEDS } from '@/data/realTimeFeeds';

interface RSSFeed {
  url: string;
  name: string;
  category: string;
}

class EnhancedRSSService {
  private cache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Use real-time feeds data source
  private readonly RSS_FEEDS: RSSFeed[] = REAL_TIME_RSS_FEEDS.map(feed => ({
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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get XML content directly (no JSON wrapper like allorigins)
      const xmlText = await response.text();
      const articles = this.parseRSSXML(xmlText, sourceName, category);
      
      // Only cache successful results with articles
      if (articles.length > 0) {
        this.cache.set(cacheKey, { data: articles, timestamp: Date.now() });
      }
      return articles;
    } catch (error) {
      // Only log errors in development to reduce console noise
      if (import.meta.env.DEV) {
        console.warn(`Failed to fetch RSS from ${feedUrl}:`, error);
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
        console.warn(`Failed to fetch RSS feed: ${this.RSS_FEEDS[index].name}`, 
          result.status === 'rejected' ? result.reason : 'No articles returned');
      }
    });

    console.log(`RSS Feed Summary: ${successCount} succeeded, ${failureCount} failed out of ${this.RSS_FEEDS.length} total feeds`);

    // If we have articles, filter and return them
    if (allArticles.length > 0) {
      // Filter out non-AI/tech content
      const filteredArticles = ContentFilter.filterAndSort(allArticles);

      return filteredArticles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
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

