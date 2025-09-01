import Fuse from 'fuse.js';
import { NewsArticle } from './NewsService';

interface SearchOptions {
  category?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  source?: string;
}

class SearchService {
  private fuse: Fuse<NewsArticle> | null = null;
  private articles: NewsArticle[] = [];

  private readonly fuseOptions = {
    keys: [
      { name: 'title', weight: 0.7 },
      { name: 'description', weight: 0.3 },
      { name: 'category', weight: 0.2 },
      { name: 'source.name', weight: 0.1 }
    ],
    threshold: 0.3,
    includeScore: true,
    minMatchCharLength: 2
  };

  initializeSearch(articles: NewsArticle[]): void {
    this.articles = articles;
    this.fuse = new Fuse(articles, this.fuseOptions);
  }

  search(query: string, options: SearchOptions = {}): NewsArticle[] {
    if (!this.fuse || !query.trim()) {
      return this.filterArticles(this.articles, options);
    }

    const results = this.fuse.search(query);
    const searchResults = results.map(result => result.item);
    
    return this.filterArticles(searchResults, options);
  }

  private filterArticles(articles: NewsArticle[], options: SearchOptions): NewsArticle[] {
    let filtered = [...articles];

    // Filter by category
    if (options.category) {
      filtered = filtered.filter(article => 
        article.category.toLowerCase() === options.category!.toLowerCase()
      );
    }

    // Filter by source
    if (options.source) {
      filtered = filtered.filter(article => 
        article.source.name.toLowerCase().includes(options.source!.toLowerCase())
      );
    }

    // Filter by date range
    if (options.dateRange) {
      filtered = filtered.filter(article => {
        const articleDate = new Date(article.publishedAt);
        return articleDate >= options.dateRange!.start && articleDate <= options.dateRange!.end;
      });
    }

    return filtered;
  }

  getCategories(): string[] {
    const categories = new Set(this.articles.map(article => article.category));
    return Array.from(categories).sort();
  }

  getSources(): string[] {
    const sources = new Set(this.articles.map(article => article.source.name));
    return Array.from(sources).sort();
  }

  getPopularTags(): string[] {
    const tagCounts = new Map<string, number>();
    
    this.articles.forEach(article => {
      // Extract potential tags from title and description
      const text = `${article.title} ${article.description}`.toLowerCase();
      const words = text.match(/\b\w{4,}\b/g) || [];
      
      words.forEach(word => {
        if (this.isValidTag(word)) {
          tagCounts.set(word, (tagCounts.get(word) || 0) + 1);
        }
      });
    });

    return Array.from(tagCounts.entries())
      .filter(([_, count]) => count >= 3) // Only tags that appear 3+ times
      .sort((a, b) => b[1] - a[1]) // Sort by frequency
      .slice(0, 20) // Top 20 tags
      .map(([tag]) => tag);
  }

  private isValidTag(word: string): boolean {
    const commonWords = new Set([
      'that', 'with', 'have', 'this', 'will', 'from', 'they', 'know', 'want',
      'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here',
      'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than',
      'them', 'well', 'were', 'what'
    ]);
    
    return !commonWords.has(word) && word.length >= 4 && word.length <= 15;
  }

  getRecentSearches(): string[] {
    const searches = localStorage.getItem('recent_searches');
    return searches ? JSON.parse(searches) : [];
  }

  addRecentSearch(query: string): void {
    const searches = this.getRecentSearches();
    const filtered = searches.filter(s => s !== query);
    filtered.unshift(query);
    
    // Keep only last 10 searches
    const updated = filtered.slice(0, 10);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  }

  clearRecentSearches(): void {
    localStorage.removeItem('recent_searches');
  }
}

export default new SearchService();
