import { NewsArticle } from './NewsService';
import TechNewsFeedManager from './TechNewsFeedManager';
import { fetchViaProxy } from '@/lib/fetchViaProxy';

interface DevToArticle {
  title: string;
  url: string;
  description: string;
  published_at: string;
  tag_list: string[];
  user: {
    username: string;
  };
  cover_image?: string;
}

interface HackerNewsItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  descendants: number;
  time: number;
  by: string;
}

interface RedditPost {
  data: {
    title: string;
    permalink: string;
    selftext: string;
    created_utc: number;
    score: number;
    num_comments: number;
    url: string;
    thumbnail?: string;
  };
}

class FreeNewsService {
  private cache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  /**
   * Load Dev.to articles (no API key needed)
   */
  async loadDevTo(tag: string = 'ai', limit: number = 20): Promise<NewsArticle[]> {
    const cacheKey = `devto-${tag}-${limit}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=${limit}`);
      
      if (!response.ok) {
        return [];
      }

      const articles: DevToArticle[] = await response.json();

      const newsArticles: NewsArticle[] = articles.map(article => ({
        id: `devto-${article.url}`,
        title: article.title,
        description: article.description || 'No description available',
        url: article.url,
        urlToImage: article.cover_image || '',
        publishedAt: article.published_at,
        source: {
          id: 'devto',
          name: 'Dev.to'
        },
        category: this.categorizeByTags(article.tag_list)
      }));

      this.cache.set(cacheKey, { data: newsArticles, timestamp: Date.now() });
      return newsArticles;
    } catch (error) {
      console.warn('Dev.to API error:', error);
      return [];
    }
  }

  /**
   * Load Hacker News top stories
   */
  async loadHackerNews(limit: number = 20): Promise<NewsArticle[]> {
    const cacheKey = `hn-top-${limit}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Get top story IDs
      const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      
      if (!response.ok) {
        return [];
      }

      const storyIds: number[] = await response.json();

      // Load first N stories
      const storyPromises = storyIds.slice(0, limit).map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
      );

      const stories: HackerNewsItem[] = await Promise.all(storyPromises);

      const newsArticles: NewsArticle[] = stories
        .filter(story => story && story.title && !story.deleted)
        .map(story => ({
          id: `hn-${story.id}`,
          title: story.title,
          description: `${story.score} points | ${story.descendants || 0} comments`,
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
          urlToImage: '',
          publishedAt: new Date(story.time * 1000).toISOString(),
          source: {
            id: 'hackernews',
            name: 'Hacker News'
          },
          category: this.categorizeByTitle(story.title)
        }));

      this.cache.set(cacheKey, { data: newsArticles, timestamp: Date.now() });
      return newsArticles;
    } catch (error) {
      console.warn('Hacker News API error:', error);
      return [];
    }
  }

  /**
   * Load Reddit posts from a subreddit
   */
  async loadReddit(subreddit: string = 'technology', limit: number = 25): Promise<NewsArticle[]> {
    const cacheKey = `reddit-${subreddit}-${limit}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Use fetchViaProxy to avoid CORS issues with Reddit API
      const response = await fetchViaProxy(`https://www.reddit.com/r/${subreddit}/top.json?limit=${limit}`);
      
      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      const posts: RedditPost[] = data.data?.children || [];

      const newsArticles: NewsArticle[] = posts
        .filter(post => post.data.title)
        .map(post => ({
          id: `reddit-${post.data.permalink}`,
          title: post.data.title,
          description: post.data.selftext?.substring(0, 300) || post.data.title,
          url: `https://reddit.com${post.data.permalink}`,
          urlToImage: post.data.thumbnail && post.data.thumbnail !== 'self' ? post.data.thumbnail : '',
          publishedAt: new Date(post.data.created_utc * 1000).toISOString(),
          source: {
            id: `reddit-${subreddit}`,
            name: `Reddit r/${subreddit}`
          },
          category: this.categorizeByTitle(post.data.title)
        }));

      this.cache.set(cacheKey, { data: newsArticles, timestamp: Date.now() });
      return newsArticles;
    } catch (error) {
      console.warn(`Reddit r/${subreddit} API error:`, error);
      return [];
    }
  }

  /**
   * Load all free feeds
   */
  async loadAllFeeds(): Promise<NewsArticle[]> {
    try {
      // Try TechNewsFeedManager first (includes RSS feeds with CORS proxies)
      try {
        const rssArticles = await TechNewsFeedManager.loadAllFeeds();
        if (rssArticles.length > 0) {
          console.log(`✅ Loaded ${rssArticles.length} articles from RSS feeds`);
          return rssArticles;
        }
      } catch (error) {
        console.warn('TechNewsFeedManager failed, falling back to direct APIs:', error);
      }

      // Fallback to direct API calls
      const [devtoAI, devtoTech, hn, redditTech, redditAI] = await Promise.all([
        this.loadDevTo('ai', 15),
        this.loadDevTo('technology', 10),
        this.loadHackerNews(20),
        this.loadReddit('technology', 15),
        this.loadReddit('artificial', 10)
      ]);

      const allArticles = [
        ...devtoAI,
        ...devtoTech,
        ...hn,
        ...redditTech,
        ...redditAI
      ];

      // Remove duplicates by URL
      const uniqueArticles = Array.from(
        new Map(allArticles.map(article => [article.url, article])).values()
      );

      // Sort by date
      return uniqueArticles.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } catch (error) {
      console.error('Error loading all free feeds:', error);
      return [];
    }
  }

  /**
   * Load feeds by category
   */
  async loadByCategory(category: string): Promise<NewsArticle[]> {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower === 'ai' || categoryLower === 'artificial-intelligence') {
      const [devto, reddit] = await Promise.all([
        this.loadDevTo('ai', 20),
        this.loadReddit('artificial', 15)
      ]);
      return [...devto, ...reddit].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }

    if (categoryLower === 'tech' || categoryLower === 'technology') {
      const [devto, hn, reddit] = await Promise.all([
        this.loadDevTo('technology', 15),
        this.loadHackerNews(15),
        this.loadReddit('technology', 15)
      ]);
      return [...devto, ...hn, ...reddit].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }

    // Default: return all feeds
    return this.loadAllFeeds();
  }

  private categorizeByTags(tags: string[]): string {
    const tagStr = tags.join(' ').toLowerCase();
    
    if (tagStr.includes('ai') || tagStr.includes('artificial-intelligence') || tagStr.includes('machine-learning')) {
      return 'AI';
    }
    if (tagStr.includes('security') || tagStr.includes('cybersecurity')) {
      return 'Security';
    }
    if (tagStr.includes('startup') || tagStr.includes('business')) {
      return 'Startups';
    }
    
    return 'Tech';
  }

  private categorizeByTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('ai') || lowerTitle.includes('gpt') || lowerTitle.includes('llm') || 
        lowerTitle.includes('artificial intelligence') || lowerTitle.includes('machine learning') ||
        lowerTitle.includes('neural network') || lowerTitle.includes('openai') || 
        lowerTitle.includes('anthropic') || lowerTitle.includes('claude')) {
      return 'AI';
    }
    if (lowerTitle.includes('security') || lowerTitle.includes('cyber') || lowerTitle.includes('hack') ||
        lowerTitle.includes('breach') || lowerTitle.includes('vulnerability')) {
      return 'Security';
    }
    if (lowerTitle.includes('startup') || lowerTitle.includes('funding') || lowerTitle.includes('raise') ||
        lowerTitle.includes('venture') || lowerTitle.includes('unicorn')) {
      return 'Startups';
    }
    
    return 'Tech';
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export default new FreeNewsService();

