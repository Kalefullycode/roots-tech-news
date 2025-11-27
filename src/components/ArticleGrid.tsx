import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchArticles } from '@/utils/fetchArticles';
import { Clock, ExternalLink } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: string | { id: string; name: string };
  category?: string;
}

export function ArticleGrid() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const fetchedArticles = await fetchArticles();
        setArticles(fetchedArticles.slice(0, 12)); // Show first 12 articles
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getSourceName = (source: string | { id: string; name: string } | undefined): string => {
    if (!source) return 'Tech News';
    if (typeof source === 'string') return source;
    return source.name || 'Tech News';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-dark-800 border-dark-600 animate-pulse">
              <div className="h-48 bg-dark-700 rounded-t-lg" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-dark-700 rounded w-3/4" />
                <div className="h-4 bg-dark-700 rounded w-full" />
                <div className="h-4 bg-dark-700 rounded w-5/6" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-display font-bold mb-8 text-white">
        Latest Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => {
          const sourceName = getSourceName(article.source);
          const category = article.category || 'Tech';
          
          return (
            <Card 
              key={article.id} 
              className="bg-dark-800 border-dark-600 hover:border-primary-500 transition-all duration-300 hover:shadow-glow group overflow-hidden"
            >
              {article.urlToImage && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.urlToImage} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary-500 text-white">
                      {category}
                    </Badge>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
                  <span className="font-medium">{sourceName}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-primary-500 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 font-medium text-sm group/link"
                >
                  Read More
                  <ExternalLink className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default ArticleGrid;

