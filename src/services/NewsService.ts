import axios from 'axios';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  category: string;
}

// RSS Feed URLs for major tech sites
const RSS_FEEDS = {
  arstechnica: 'https://feeds.arstechnica.com/arstechnica/index',
  techcrunch: 'https://techcrunch.com/feed/',
  theverge: 'https://www.theverge.com/rss/index.xml',
  wired: 'https://www.wired.com/feed/rss',
  engadget: 'https://www.engadget.com/rss.xml',
  techmeme: 'https://www.techmeme.com/feed.xml'
};

// NewsAPI configuration (you'll need to get a free API key)
const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY || 'demo';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// RSS to JSON proxy service (free service)
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

export class NewsService {
  // Fetch from NewsAPI (requires API key)
  static async fetchFromNewsAPI(category: string = 'technology'): Promise<NewsArticle[]> {
    try {
      const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
        params: {
          category,
          country: 'us',
          apiKey: NEWS_API_KEY,
          pageSize: 20
        }
      });

      return response.data.articles.map((article: any, index: number) => ({
        id: `newsapi-${index}-${Date.now()}`,
        title: article.title,
        description: article.description || article.content?.substring(0, 200) + '...',
        url: article.url,
        urlToImage: article.urlToImage || '/placeholder.svg',
        publishedAt: article.publishedAt,
        source: article.source,
        category: this.categorizeArticle(article.title + ' ' + article.description)
      }));
    } catch (error) {
      console.error('NewsAPI fetch error:', error);
      return [];
    }
  }

  // Fetch from RSS feeds (free, no API key needed)
  static async fetchFromRSS(feedName: keyof typeof RSS_FEEDS): Promise<NewsArticle[]> {
    try {
      const feedUrl = RSS_FEEDS[feedName];
      const response = await axios.get(RSS_TO_JSON_API, {
        params: {
          rss_url: feedUrl,
          api_key: 'your-rss2json-api-key', // Free tier available
          count: 10
        }
      });

      if (response.data.status !== 'ok') {
        throw new Error('RSS feed fetch failed');
      }

      return response.data.items.map((item: any, index: number) => ({
        id: `rss-${feedName}-${index}-${Date.now()}`,
        title: item.title,
        description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        url: item.link,
        urlToImage: item.thumbnail || item.enclosure?.link || '/placeholder.svg',
        publishedAt: item.pubDate,
        source: {
          id: feedName,
          name: this.getSourceDisplayName(feedName)
        },
        category: this.categorizeArticle(item.title + ' ' + item.description)
      }));
    } catch (error) {
      console.error(`RSS fetch error for ${feedName}:`, error);
      return [];
    }
  }

  // Aggregate news from multiple sources
  static async fetchAggregatedNews(): Promise<NewsArticle[]> {
    try {
      const [
        newsApiArticles,
        arsTechnicaArticles,
        techCrunchArticles,
        theVergeArticles
      ] = await Promise.allSettled([
        this.fetchFromNewsAPI('technology'),
        this.fetchFromRSS('arstechnica'),
        this.fetchFromRSS('techcrunch'),
        this.fetchFromRSS('theverge')
      ]);

      const allArticles: NewsArticle[] = [];

      // Collect successful results
      if (newsApiArticles.status === 'fulfilled') {
        allArticles.push(...newsApiArticles.value);
      }
      if (arsTechnicaArticles.status === 'fulfilled') {
        allArticles.push(...arsTechnicaArticles.value);
      }
      if (techCrunchArticles.status === 'fulfilled') {
        allArticles.push(...techCrunchArticles.value);
      }
      if (theVergeArticles.status === 'fulfilled') {
        allArticles.push(...theVergeArticles.value);
      }

      // Sort by publication date (newest first)
      return allArticles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 50); // Limit to 50 most recent articles

    } catch (error) {
      console.error('Aggregated news fetch error:', error);
      return this.getFallbackNews();
    }
  }

  // Categorize articles based on content
  static categorizeArticle(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('ai') || lowerContent.includes('artificial intelligence') || 
        lowerContent.includes('machine learning') || lowerContent.includes('neural')) {
      return 'AI';
    }
    if (lowerContent.includes('startup') || lowerContent.includes('funding') || 
        lowerContent.includes('investment') || lowerContent.includes('venture')) {
      return 'Startups';
    }
    if (lowerContent.includes('security') || lowerContent.includes('hack') || 
        lowerContent.includes('privacy') || lowerContent.includes('cyber')) {
      return 'Security';
    }
    if (lowerContent.includes('gadget') || lowerContent.includes('device') || 
        lowerContent.includes('hardware') || lowerContent.includes('phone')) {
      return 'Gadgets';
    }
    if (lowerContent.includes('culture') || lowerContent.includes('social') || 
        lowerContent.includes('community') || lowerContent.includes('diversity')) {
      return 'Culture';
    }
    
    return 'Tech';
  }

  static getSourceDisplayName(feedName: string): string {
    const displayNames: Record<string, string> = {
      arstechnica: 'Ars Technica',
      techcrunch: 'TechCrunch',
      theverge: 'The Verge',
      wired: 'WIRED',
      engadget: 'Engadget',
      techmeme: 'Techmeme'
    };
    return displayNames[feedName] || feedName;
  }

  // Fallback news for demo purposes
  static getFallbackNews(): NewsArticle[] {
    return [
      {
        id: 'fallback-1',
        title: 'Quantum Computing Breakthrough Achieved in Laboratory',
        description: 'Researchers have made significant progress in quantum error correction, bringing practical quantum computers closer to reality.',
        url: '#',
        urlToImage: '/placeholder.svg',
        publishedAt: new Date().toISOString(),
        source: { id: 'demo', name: 'Tech News' },
        category: 'AI'
      },
      {
        id: 'fallback-2',
        title: 'African Startup Revolutionizes Mobile Banking',
        description: 'A fintech company from Lagos has developed a new mobile banking solution that works without internet connectivity.',
        url: '#',
        urlToImage: '/placeholder.svg',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: { id: 'demo', name: 'Startup News' },
        category: 'Startups'
      }
    ];
  }
}

export default NewsService;