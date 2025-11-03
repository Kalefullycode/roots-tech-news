import { REAL_TIME_RSS_FEEDS } from '@/data/realTimeFeeds';

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  category: string;
  publishedAt: Date;
  image?: string;
}

type FeedConfig = typeof REAL_TIME_RSS_FEEDS[number];

class RealTimeFeedService {
  private cache: Map<string, { data: Article[]; timestamp: number }> = new Map();

  async fetchAllFeeds(): Promise<Article[]> {
    const allArticles: Article[] = [];

    const highPriorityFeeds = REAL_TIME_RSS_FEEDS.filter(f => f.priority === 'high' && f.active);

    const results = await Promise.allSettled(
      highPriorityFeeds.map(feed => this.fetchFeed(feed))
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      } else {
        console.error(`Failed to fetch ${highPriorityFeeds[index].name}:`, result.reason);
      }
    });

    const getSafeTime = (d: Date) => {
      const t = d?.getTime?.() ?? 0;
      return Number.isNaN(t) ? 0 : t;
    };
    return allArticles.sort((a, b) => getSafeTime(b.publishedAt) - getSafeTime(a.publishedAt));
  }

  async fetchFeed(feed: FeedConfig): Promise<Article[]> {
    const cached = this.cache.get(feed.id);
    const cacheAge = cached ? Date.now() - cached.timestamp : Infinity;
    const cacheValid = cacheAge < feed.updateFrequency * 60 * 1000;

    if (cached && cacheValid) {
      console.log(`Using cached data for ${feed.name}`);
      return cached.data;
    }

    try {
      const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(feed.url)}`;
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlText = await response.text();
      const articles = this.parseRSS(xmlText, feed);

      this.cache.set(feed.id, {
        data: articles,
        timestamp: Date.now()
      });

      return articles;
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error);
      return cached?.data || [];
    }
  }

  private parseRSS(xmlText: string, feed: FeedConfig): Article[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    const items = Array.from(xmlDoc.querySelectorAll('item, entry'));

    return items.slice(0, 10).map((item, index) => {
      const title = item.querySelector('title')?.textContent || 'Untitled';
      const description = item.querySelector('description, summary, content')?.textContent || '';
      const link = (
        item.querySelector('link')?.textContent ||
        item.querySelector('link')?.getAttribute('href') ||
        ''
      );
      const pubDateRaw = item.querySelector('pubDate, published, updated')?.textContent?.trim();
      const pubDate = pubDateRaw && !Number.isNaN(Date.parse(pubDateRaw))
        ? new Date(pubDateRaw)
        : new Date();

      const image = (
        item.querySelector('media\\:thumbnail, media\\:content')?.getAttribute('url') ||
        item.querySelector('enclosure[type^="image"]')?.getAttribute('url') ||
        undefined
      );

      return {
        id: `${feed.id}-${Date.now()}-${index}`,
        title: this.cleanHTML(title),
        description: this.cleanHTML(description).substring(0, 200),
        url: link,
        source: feed.name,
        category: feed.category,
        publishedAt: pubDate,
        image
      };
    });
  }

  private cleanHTML(text: string): string {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.body.textContent || text;
  }

  clearCache() {
    this.cache.clear();
  }
}

export const feedService = new RealTimeFeedService();


