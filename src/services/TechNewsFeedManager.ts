import { NewsArticle } from './NewsService';
import { fetchViaProxy } from '@/lib/fetchViaProxy';

interface FeedConfig {
  name: string;
  url: string;
  type: 'rss' | 'atom' | 'json';
  category: string;
}

interface Article {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  category: string;
  type: string;
}

interface CacheData {
  timestamp: number;
  articles: Article[];
}

class TechNewsFeedManager {
  // Free RSS feeds for Tech & AI News
  feeds = {
    ai: [
      {
        name: 'OpenAI Blog',
        url: 'https://openai.com/blog/rss.xml',
        type: 'rss' as const,
        category: 'AI Research'
      },
      {
        name: 'MIT AI News',
        url: 'https://news.mit.edu/rss/topic/artificial-intelligence2',
        type: 'rss' as const,
        category: 'AI Research'
      },
      {
        name: 'The Verge AI',
        url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
        type: 'rss' as const,
        category: 'AI News'
      },
      {
        name: 'VentureBeat AI',
        url: 'https://feeds.feedburner.com/venturebeat/SZYF',
        type: 'rss' as const,
        category: 'AI Business'
      },
      {
        name: 'AI News',
        url: 'https://www.artificialintelligence-news.com/feed/',
        type: 'rss' as const,
        category: 'AI Updates'
      }
    ],
    tech: [
      {
        name: 'TechCrunch',
        url: 'https://techcrunch.com/feed/',
        type: 'rss' as const,
        category: 'Tech News'
      },
      {
        name: 'Ars Technica',
        url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
        type: 'rss' as const,
        category: 'Tech Analysis'
      },
      {
        name: 'Wired',
        url: 'https://www.wired.com/feed/rss',
        type: 'rss' as const,
        category: 'Tech Culture'
      },
      {
        name: 'Hacker News',
        url: 'https://hnrss.org/frontpage',
        type: 'rss' as const,
        category: 'Tech Community'
      },
      {
        name: 'The Register',
        url: 'https://www.theregister.com/headlines.atom',
        type: 'atom' as const,
        category: 'Tech News'
      }
    ],
    // API-based sources (no CORS issues)
    apis: [
      {
        name: 'DEV Community AI',
        url: 'https://dev.to/api/articles?tag=ai&per_page=10',
        type: 'json' as const,
        category: 'AI Tutorials'
      },
      {
        name: 'DEV Community Tech',
        url: 'https://dev.to/api/articles?tag=technology&per_page=10',
        type: 'json' as const,
        category: 'Tech Articles'
      },
      {
        name: 'Reddit AI',
        url: 'https://www.reddit.com/r/artificial/top.json?limit=10',
        type: 'json' as const,
        category: 'AI Discussion'
      },
      {
        name: 'Reddit Tech',
        url: 'https://www.reddit.com/r/technology/top.json?limit=10',
        type: 'json' as const,
        category: 'Tech Discussion'
      }
    ]
  };

  // Cache configuration
  cache = {
    enabled: true,
    duration: 30 * 60 * 1000, // 30 minutes
    storage: typeof window !== 'undefined' ? window.localStorage : null
  };

  // Load all feeds
  async loadAllFeeds(): Promise<NewsArticle[]> {
    const allArticles: Article[] = [];

    // Load RSS feeds
    for (const feed of [...this.feeds.ai, ...this.feeds.tech]) {
      try {
        const articles = await this.loadRSSFeed(feed);
        allArticles.push(...articles);
      } catch (error) {
        console.error(`Failed to load ${feed.name}:`, error);
      }
    }

    // Load API feeds
    for (const api of this.feeds.apis) {
      try {
        const articles = await this.loadAPIFeed(api);
        allArticles.push(...articles);
      } catch (error) {
        console.error(`Failed to load ${api.name}:`, error);
      }
    }

    // Sort by date
    allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // Convert to NewsArticle format
    return allArticles.slice(0, 50).map(article => ({
      id: article.link || Math.random().toString(36),
      title: article.title,
      description: article.description,
      url: article.link,
      urlToImage: '',
      publishedAt: article.pubDate,
      source: {
        id: article.source.toLowerCase().replace(/\s+/g, '-'),
        name: article.source
      },
      category: article.category
    }));
  }

  // Load RSS feed with our RSS proxy
  private async loadRSSFeed(feed: FeedConfig): Promise<Article[]> {
    const cacheKey = `feed_${feed.name}`;

    // Check cache first
    if (this.cache.enabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    // Use our RSS proxy via the helper
    try {
      const response = await fetchViaProxy(feed.url);

      if (response.ok) {
        const text = await response.text();
        const articles = this.parseRSS(text, feed);

        // Cache successful response
        if (this.cache.enabled && articles.length > 0) {
          this.saveToCache(cacheKey, articles);
        }

        return articles;
      } else {
        console.warn(`Failed to load ${feed.name}: ${response.status} ${response.statusText}`);
        return [];
      }
    } catch (error) {
      console.error(`Error loading ${feed.name}:`, error);
      return [];
    }
  }

  // Load JSON API feed
  private async loadAPIFeed(api: FeedConfig): Promise<Article[]> {
    const cacheKey = `api_${api.name}`;

    // Check cache first
    if (this.cache.enabled) {
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const response = await fetch(api.url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const articles = this.parseJSON(data, api);

      // Cache successful response
      if (this.cache.enabled && articles.length > 0) {
        this.saveToCache(cacheKey, articles);
      }

      return articles;
    } catch (error) {
      console.error(`API feed error for ${api.name}:`, error);
      return [];
    }
  }

  // Parse RSS/XML feed
  private parseRSS(xmlText: string, feed: FeedConfig): Article[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const items = doc.querySelectorAll('item, entry');
    const articles: Article[] = [];

    items.forEach((item, index) => {
      if (index >= 10) return; // Limit to 10 items per feed

      const title = item.querySelector('title')?.textContent || 'Untitled';
      const link = item.querySelector('link')?.textContent || 
                   item.querySelector('link')?.getAttribute('href') || '#';
      const description = item.querySelector('description, summary, content')?.textContent || '';
      const pubDate = item.querySelector('pubDate, published, updated')?.textContent || new Date().toISOString();

      const article: Article = {
        title,
        link,
        description: this.cleanDescription(description),
        pubDate,
        source: feed.name,
        category: feed.category,
        type: 'article'
      };

      // Filter for AI/Tech content
      if (this.isRelevantContent(article)) {
        articles.push(article);
      }
    });

    return articles;
  }

  // Parse JSON API response
  private parseJSON(data: any, api: FeedConfig): Article[] {
    const articles: Article[] = [];

    if (api.name.includes('DEV')) {
      // DEV.to API format
      const items = Array.isArray(data) ? data : [];
      items.forEach((item: any, index: number) => {
        if (index >= 10) return;

        articles.push({
          title: item.title,
          link: item.url,
          description: item.description || item.tag_list?.join(', ') || '',
          pubDate: item.published_at || item.created_at,
          source: api.name,
          category: api.category,
          type: 'article'
        });
      });
    } else if (api.name.includes('Reddit')) {
      // Reddit API format
      const posts = data.data?.children || [];
      posts.forEach((post: any, index: number) => {
        if (index >= 10) return;

        const item = post.data;
        articles.push({
          title: item.title,
          link: `https://reddit.com${item.permalink}`,
          description: item.selftext || item.title,
          pubDate: new Date(item.created_utc * 1000).toISOString(),
          source: api.name,
          category: api.category,
          type: 'discussion'
        });
      });
    }

    return articles.filter(article => this.isRelevantContent(article));
  }

  // Check if content is AI/Tech relevant
  private isRelevantContent(article: Article): boolean {
    const relevantKeywords = [
      'ai', 'artificial intelligence', 'machine learning', 'neural',
      'gpt', 'claude', 'gemini', 'llm', 'technology', 'tech',
      'software', 'hardware', 'programming', 'cloud', 'data',
      'algorithm', 'robotics', 'automation', 'api', 'framework',
      'opensource', 'startup', 'innovation', 'digital', 'cyber'
    ];

    const text = `${article.title} ${article.description}`.toLowerCase();
    return relevantKeywords.some(keyword => text.includes(keyword));
  }

  // Clean HTML from description
  private cleanDescription(text: string): string {
    if (typeof document === 'undefined') {
      // Server-side: simple text cleaning
      return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 200);
    }

    const div = document.createElement('div');
    div.innerHTML = text;
    let clean = div.textContent || div.innerText || '';
    clean = clean.replace(/\s+/g, ' ').trim();
    return clean.substring(0, 200) + (clean.length > 200 ? '...' : '');
  }

  // Cache management
  private getFromCache(key: string): Article[] | null {
    if (!this.cache.storage) return null;

    try {
      const cached = this.cache.storage.getItem(key);
      if (!cached) return null;

      const data: CacheData = JSON.parse(cached);
      const age = Date.now() - data.timestamp;

      if (age < this.cache.duration) {
        return data.articles;
      }

      // Remove expired cache
      this.cache.storage.removeItem(key);
    } catch (error) {
      console.error('Cache read error:', error);
    }

    return null;
  }

  private saveToCache(key: string, articles: Article[]): void {
    if (!this.cache.storage) return;

    try {
      const data: CacheData = {
        timestamp: Date.now(),
        articles: articles
      };
      this.cache.storage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Cache write error:', error);
    }
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return 'Yesterday';

    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  clearCache(): void {
    if (this.cache.storage) {
      Object.keys(this.cache.storage).forEach(key => {
        if (key.startsWith('feed_') || key.startsWith('api_')) {
          this.cache.storage?.removeItem(key);
        }
      });
    }
  }
}

export default new TechNewsFeedManager();

