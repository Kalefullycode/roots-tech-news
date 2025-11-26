import FreeNewsService from '@/services/FreeNewsService';

/**
 * Unified function to fetch articles from free news sources
 * Replaces broken RSS proxy calls
 */
export async function fetchArticles(): Promise<Array<{
  id: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  urlToImage?: string;
  url: string;
  source: { id: string; name: string };
}>> {
  try {
    // Use free news sources (no API key required)
    const articles = await FreeNewsService.loadAllFeeds();
    
    // Convert to expected format
    return articles.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      category: article.category || 'Tech',
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage,
      url: article.url,
      source: article.source
    }));
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    // Return empty array on error - components should have fallbacks
    return [];
  }
}

/**
 * Fetch articles by category
 */
export async function fetchArticlesByCategory(category: string): Promise<Array<{
  id: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  urlToImage?: string;
  url: string;
  source: { id: string; name: string };
}>> {
  try {
    const articles = await FreeNewsService.loadByCategory(category);
    
    return articles.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      category: article.category || category,
      publishedAt: article.publishedAt,
      urlToImage: article.urlToImage,
      url: article.url,
      source: article.source
    }));
  } catch (error) {
    console.error(`Failed to fetch articles for category ${category}:`, error);
    return [];
  }
}

