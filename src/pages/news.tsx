import { useQuery } from "@tanstack/react-query";
import { Helmet } from 'react-helmet-async';
import { Skeleton } from "@/components/ui/skeleton";
import NewsListItem from "@/components/NewsListItem";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchArticles } from "@/utils/fetchArticles";

// Format time ago helper
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

// Extract domain from URL
function getDomain(url?: string): string {
  if (!url || url === '#') return '';
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return '';
  }
}

export default function NewsPage() {
  const { data: articles, isLoading, isError } = useQuery({
    queryKey: ['news-articles'],
    queryFn: fetchArticles,
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 60000,
    retry: 2,
  });

  // Format articles for NewsListItem
  interface Article {
    id?: string;
    title?: string;
    url?: string;
    link?: string;
    source?: { name?: string } | string;
    publishedAt?: string;
    pubDate?: string;
  }

  const formattedArticles = articles?.map((article: Article) => ({
    id: article.id,
    title: article.title,
    url: article.url || article.link || '#',
    source: article.source?.name || article.source || 'Tech News',
    timeAgo: formatTimeAgo(article.publishedAt || article.pubDate || new Date().toISOString()),
    domain: getDomain(article.url || article.link),
  })) || [];

  return (
    <>
      <Helmet>
        <title>Tech News Feed | Roots Tech News</title>
        <meta name="description" content="Latest AI and technology news from top sources" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Tech News Feed</h1>
            <p className="text-muted-foreground">Latest stories from top tech sources</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Skeleton className="w-8 h-4" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Failed to load articles. Please try again later.</p>
            </div>
          ) : (
            <div className="news-list-container">
              {formattedArticles.length > 0 ? (
                formattedArticles.map((article, index) => (
                  <NewsListItem 
                    key={article.id || index} 
                    article={article} 
                    index={index} 
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
}

