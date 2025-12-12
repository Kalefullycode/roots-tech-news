
import { NewsArticle } from './NewsService';

interface RSSFeed {
  url: string;
  name: string;
  category: string;
}

class RSSService {
  private cache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private readonly RSS_FEEDS: RSSFeed[] = [
    // Required Feeds from Problem Statement
    { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge', category: 'Tech' },
    { url: 'https://feeds.feedburner.com/TechCrunch', name: 'TechCrunch', category: 'Tech' },
    { url: 'https://feeds.arstechnica.com/arstechnica/index', name: 'Ars Technica', category: 'Tech' },
    { url: 'https://feeds.feedburner.com/venturebeat/SZYF', name: 'VentureBeat AI', category: 'AI' },
    { url: 'https://www.technologyreview.com/feed', name: 'MIT Technology Review', category: 'AI' },
    { url: 'https://www.wired.com/feed/rss', name: 'Wired', category: 'Tech' },
    { url: 'https://cyberinsider.com/feed/', name: 'Cyber Insider', category: 'Security' },
    { url: 'https://cybernews.com/feed/', name: 'Cybernews', category: 'Security' },
    // Additional Feeds
    { url: 'https://disrupt-africa.com/feed/', name: 'Disrupt Africa', category: 'Culture' },
    { url: 'https://ventureburn.com/feed/', name: 'Ventureburn', category: 'Startups' },
    { url: 'https://techcabal.com/feed/', name: 'TechCabal', category: 'Culture' },
    { url: 'https://towardsdatascience.com/feed', name: 'Towards Data Science', category: 'AI' }
  ];

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
      const items = xmlDoc.querySelectorAll('item');
      
      const articles: NewsArticle[] = [];
      
      items.forEach((item, index) => {
        if (index >= 10) return; // Limit to 10 items
        
        const title = item.querySelector('title')?.textContent || 'Untitled';
        const link = item.querySelector('link')?.textContent || '#';
        const description = item.querySelector('description')?.textContent || 'No description available';
        const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
        
        // Try to find image from various sources
        let imageUrl = '';
        const enclosure = item.querySelector('enclosure');
        if (enclosure) {
          const enclosureUrl = enclosure.getAttribute('url');
          if (enclosureUrl && this.isValidImageUrl(enclosureUrl)) {
            imageUrl = enclosureUrl;
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
          description: description.replace(/<[^>]*>/g, '').substring(0, 200),
          url: link,
          urlToImage: imageUrl,
          publishedAt: pubDate,
          source: { id: sourceName.toLowerCase(), name: sourceName },
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
      // Use our Cloudflare Pages Function RSS proxy
      const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`;
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'application/xml, application/rss+xml, text/xml',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get XML content directly (no JSON wrapper)
      const xmlText = await response.text();
      const articles = this.parseRSSXML(xmlText, sourceName, category);
      
      this.cache.set(cacheKey, { data: articles, timestamp: Date.now() });
      return articles;
    } catch (error) {
      console.warn(`Failed to fetch RSS from ${feedUrl}:`, error);
      return [];
    }
  }

  async fetchAllRSSFeeds(): Promise<NewsArticle[]> {
    const allArticles: NewsArticle[] = [];
    
    const fetchPromises = this.RSS_FEEDS.map(feed => 
      this.fetchFromRSS(feed.url, feed.name, feed.category)
    );

    const results = await Promise.allSettled(fetchPromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      } else {
        console.warn(`Failed to fetch RSS feed: ${this.RSS_FEEDS[index].name}`);
      }
    });

    // Sort by publication date (newest first)
    return allArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
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

    return allArticles.sort((a, b) => 
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

export default new RSSService();
