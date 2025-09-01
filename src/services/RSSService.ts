import Parser from 'rss-parser';
import { NewsArticle } from './NewsService';

interface RSSFeed {
  url: string;
  name: string;
  category: string;
}

class RSSService {
  private parser: Parser;
  private cache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['media:content', 'enclosure']
      }
    });
  }

  private readonly RSS_FEEDS: RSSFeed[] = [
    { url: 'https://techcrunch.com/feed/', name: 'TechCrunch', category: 'Startups' },
    { url: 'https://feeds.arstechnica.com/arstechnica/index', name: 'Ars Technica', category: 'Tech' },
    { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge', category: 'Gadgets' },
    { url: 'https://www.technologyreview.com/feed/', name: 'MIT Technology Review', category: 'AI' },
    { url: 'https://feeds.feedburner.com/venturebeat/SZYF', name: 'VentureBeat', category: 'Startups' },
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

  private mapRSSItemToArticle(item: any, sourceName: string, category: string): NewsArticle {
    let imageUrl = '';
    
    // Try various image sources
    if (item.enclosure?.url && this.isValidImageUrl(item.enclosure.url)) {
      imageUrl = item.enclosure.url;
    } else if (item['media:content']?.url && this.isValidImageUrl(item['media:content'].url)) {
      imageUrl = item['media:content'].url;
    } else if (item.content) {
      const extractedImage = this.extractImageFromContent(item.content);
      if (extractedImage && this.isValidImageUrl(extractedImage)) {
        imageUrl = extractedImage;
      }
    }

    return {
      id: item.guid || item.link || Math.random().toString(36),
      title: item.title || 'Untitled',
      description: item.contentSnippet || item.content?.replace(/<[^>]*>/g, '').substring(0, 200) || 'No description available',
      url: item.link || '#',
      urlToImage: imageUrl,
      publishedAt: item.pubDate || new Date().toISOString(),
      source: { id: sourceName.toLowerCase(), name: sourceName },
      category
    };
  }

  async fetchFromRSS(feedUrl: string, sourceName: string, category: string): Promise<NewsArticle[]> {
    const cacheKey = feedUrl;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const feed = await this.parser.parseURL(feedUrl);
      const articles = feed.items.slice(0, 10).map(item => 
        this.mapRSSItemToArticle(item, sourceName, category)
      );
      
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