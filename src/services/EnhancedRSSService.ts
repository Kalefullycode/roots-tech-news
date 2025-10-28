import { NewsArticle } from './NewsService';
import ContentFilter from './ContentFilter';

interface RSSFeed {
  url: string;
  name: string;
  category: string;
}

class EnhancedRSSService {
  private cache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Comprehensive list of tech news RSS feeds
  private readonly RSS_FEEDS: RSSFeed[] = [
    // Major Tech News
    { url: 'https://techcrunch.com/feed/', name: 'TechCrunch', category: 'Tech' },
    { url: 'https://feeds.arstechnica.com/arstechnica/index', name: 'Ars Technica', category: 'Tech' },
    { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge', category: 'Gadgets' },
    { url: 'https://www.wired.com/feed/rss', name: 'WIRED', category: 'Tech' },
    { url: 'https://www.engadget.com/rss.xml', name: 'Engadget', category: 'Gadgets' },
    { url: 'https://www.cnet.com/rss/news/', name: 'CNET', category: 'Tech' },
    
    // AI & Machine Learning
    { url: 'https://www.technologyreview.com/feed/', name: 'MIT Technology Review', category: 'AI' },
    { url: 'https://towardsdatascience.com/feed', name: 'Towards Data Science', category: 'AI' },
    { url: 'https://machinelearningmastery.com/feed/', name: 'Machine Learning Mastery', category: 'AI' },
    { url: 'https://openai.com/blog/rss/', name: 'OpenAI Blog', category: 'AI' },
    { url: 'https://blogs.nvidia.com/feed/', name: 'NVIDIA Blog', category: 'AI' },
    { url: 'https://ai.googleblog.com/feeds/posts/default', name: 'Google AI Blog', category: 'AI' },
    
    // Startups & Business
    { url: 'https://feeds.feedburner.com/venturebeat/SZYF', name: 'VentureBeat', category: 'Startups' },
    { url: 'https://techcrunch.com/startups/feed/', name: 'TechCrunch Startups', category: 'Startups' },
    { url: 'https://www.producthunt.com/feed', name: 'Product Hunt', category: 'Startups' },
    
    // African Tech
    { url: 'https://disrupt-africa.com/feed/', name: 'Disrupt Africa', category: 'Culture' },
    { url: 'https://ventureburn.com/feed/', name: 'Ventureburn', category: 'Startups' },
    { url: 'https://techcabal.com/feed/', name: 'TechCabal', category: 'Culture' },
    
    // Cybersecurity
    { url: 'https://krebsonsecurity.com/feed/', name: 'Krebs on Security', category: 'Security' },
    { url: 'https://www.schneier.com/feed/atom/', name: 'Schneier on Security', category: 'Security' },
    { url: 'https://threatpost.com/feed/', name: 'Threatpost', category: 'Security' },
    
    // Quantum & Physics
    { url: 'https://www.quantamagazine.org/feed/', name: 'Quanta Magazine', category: 'Innovation' },
    
    // Innovation & Science
    { url: 'https://www.sciencedaily.com/rss/computers_math/computer_science.xml', name: 'ScienceDaily', category: 'Innovation' },
    { url: 'https://www.newscientist.com/subject/technology/feed/', name: 'New Scientist', category: 'Innovation' },
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

    // Filter out non-AI/tech content
    const filteredArticles = ContentFilter.filterAndSort(allArticles);

    return filteredArticles.sort((a, b) => 
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

