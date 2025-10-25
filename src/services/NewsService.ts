
import EnhancedRSSService from './EnhancedRSSService';

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

export class NewsService {
  // Use the more efficient EnhancedRSSService instead of making multiple API calls
  static async fetchAggregatedNews(): Promise<NewsArticle[]> {
    try {
      // Use the consolidated RSS service which handles caching and efficient requests
      const articles = await EnhancedRSSService.fetchAllRSSFeeds();
      
      // If RSS service returns articles, use them
      if (articles && articles.length > 0) {
        return articles.slice(0, 50); // Limit to 50 most recent articles
      }
      
      // Fallback to demo articles if RSS fails
      return this.getFallbackNews();
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
