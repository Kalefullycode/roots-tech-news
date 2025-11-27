import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Sparkles } from 'lucide-react';
import EnhancedRSSService from '@/services/EnhancedRSSService';
import { NewsArticle } from '@/services/NewsService';
import DarkArticleCard from '@/components/cards/DarkArticleCard';

const AINewsSection = () => {
  const [aiArticles, setAiArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAINews = async () => {
      try {
        setIsLoading(true);
        const articles = await EnhancedRSSService.fetchByCategory('AI');
        setAiArticles(articles.slice(0, 6)); // Show top 6 AI articles
      } catch (error) {
        console.error('Failed to fetch AI news:', error);
        setAiArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAINews();
    // Refresh every 15 minutes
    const interval = setInterval(fetchAINews, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateString: string) => {
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
    if (!source) return 'AI News';
    if (typeof source === 'string') return source;
    return source.name || 'AI News';
  };

  if (isLoading) {
    return (
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🤖</div>
              <div>
                <h2 className="font-display text-3xl font-bold text-white">AI News</h2>
                <p className="text-gray-400 text-sm">Latest developments in AI, machine learning, and neural networks</p>
              </div>
            </div>
          </div>
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
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-black to-dark-900">
      <div className="container mx-auto">
        <div className="mb-8 pb-4 border-b border-primary-500/20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                AI News
              </h2>
              <p className="text-gray-400 text-sm mt-1">Latest developments in AI, machine learning, and neural networks</p>
            </div>
          </div>
        </div>

        {aiArticles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {aiArticles.map((article) => {
                const sourceName = getSourceName(article.source);
                
                return (
                  <DarkArticleCard
                    key={article.id || article.url}
                    title={article.title}
                    excerpt={article.description || 'Read more about this AI development...'}
                    category={sourceName}
                    date={formatTime(article.publishedAt)}
                    imageUrl={article.urlToImage || '/placeholder.svg'}
                    url={article.url}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-gray-400 text-lg mb-4">No AI news articles found at the moment.</p>
            <p className="text-gray-500 text-sm">Try refreshing the page or check back soon.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AINewsSection;

