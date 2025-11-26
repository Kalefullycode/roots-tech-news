import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Calendar, Users, Loader2, AlertCircle } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import { getCategoryBySlug, articleMatchesCategory, CATEGORIES } from '@/config/categories';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  image: string;
}

// Fetch articles from free news sources
import { fetchArticlesByCategory } from '@/utils/fetchArticles';

async function fetchArticles(category?: string): Promise<Article[]> {
  try {
    const articles = category 
      ? await fetchArticlesByCategory(category)
      : await import('@/utils/fetchArticles').then(m => m.fetchArticles());
    
    return articles.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      category: article.category,
      publishedAt: article.publishedAt,
      url: article.url,
      source: article.source.name,
      sourceDomain: article.source.id,
      image: article.urlToImage || ''
    }));
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }
}

// Filter articles by category
function filterArticlesByCategory(articles: Article[], categorySlug: string): Article[] {
  return articles.filter(article => articleMatchesCategory(article, categorySlug));
}

const CategorySlugPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // Get category config
  const category = slug ? getCategoryBySlug(slug) : undefined;
  
  // Fetch all articles
  const { data: allArticles, isLoading, isError, error } = useQuery({
    queryKey: ['category-articles', slug],
    queryFn: fetchArticles,
    staleTime: 300000, // 5 minutes
    retry: 2,
  });

  // Filter articles by category
  const categoryArticles = allArticles && slug 
    ? filterArticlesByCategory(allArticles, slug)
    : [];

  // If category not found, redirect or show error
  if (slug && !category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The category "{slug}" doesn't exist.
          </p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  const categoryData = category || CATEGORIES[0];
  const displayArticles = categoryArticles.length > 0 ? categoryArticles : [];

  // Format articles for ArticleCard component
  const formattedArticles = displayArticles.map((article) => ({
    title: article.title,
    excerpt: article.description || 'Click to read more about this exciting development.',
    category: article.source || categoryData.title,
    date: new Date(article.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    imageUrl: article.image || '/placeholder.svg',
    url: article.url,
  }));

  return (
    <>
      <Helmet>
        <title>{categoryData.title} | Roots Tech News</title>
        <meta name="description" content={categoryData.description} />
        <meta name="keywords" content={categoryData.keywords.join(', ')} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Category Header */}
        <div className="bg-card border-b border-card-border">
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className={`bg-gradient-to-r ${categoryData.color} p-8 rounded-xl text-white`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{categoryData.icon}</span>
                    <Badge className="bg-white/20 text-white border-white/30">
                      Category
                    </Badge>
                  </div>
                  <h1 className="font-orbitron text-4xl font-bold mb-4">
                    {categoryData.title}
                  </h1>
                  <p className="font-roboto text-lg opacity-90 max-w-2xl">
                    {categoryData.description}
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-orbitron font-semibold">Articles</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      displayArticles.length
                    )}
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5" />
                    <span className="font-orbitron font-semibold">Readers</span>
                  </div>
                  <div className="text-2xl font-bold">50K+</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-orbitron font-semibold">Trending</span>
                  </div>
                  <div className="text-2xl font-bold">{displayArticles.length > 0 ? '🔥' : '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Content */}
        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <span className="ml-4 text-lg text-muted-foreground">
                Loading {categoryData.title} articles...
              </span>
            </div>
          ) : isError ? (
            <Card className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Error Loading Articles</h2>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : 'Failed to load articles. Please try again later.'}
              </p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </Card>
          ) : formattedArticles.length === 0 ? (
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">No Articles Found</h2>
              <p className="text-muted-foreground mb-4">
                We couldn't find any articles in this category. Check back soon for new content!
              </p>
              <Button onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Card>
          ) : (
            <>
              {/* Featured Article */}
              {formattedArticles[0] && (
                <section className="mb-12">
                  <h2 className="font-orbitron text-2xl font-bold text-glow-primary mb-6">
                    Featured Story
                  </h2>
                  <ArticleCard {...formattedArticles[0]} featured />
                </section>
              )}

              {/* Latest Articles Grid */}
              {formattedArticles.length > 1 && (
                <section>
                  <h2 className="font-orbitron text-2xl font-bold text-glow-accent mb-6">
                    Latest in {categoryData.title} ({formattedArticles.length - 1} articles)
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {formattedArticles.slice(1).map((article, index) => (
                      <ArticleCard key={`${article.url}-${index}`} {...article} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Coming Soon Card */}
          <Card className="mt-12 p-8 text-center bg-card-modern border border-card-border/60">
            <h3 className="font-orbitron text-xl font-bold mb-4 text-glow-primary">
              More Content Coming Soon
            </h3>
            <p className="text-muted-foreground font-roboto mb-6">
              We're constantly adding new {categoryData.title.toLowerCase()} content. 
              Check back regularly for the latest updates and insights.
            </p>
            <Button className="bg-gradient-hero hover:glow-primary" onClick={() => navigate('/newsletter')}>
              Subscribe for Updates
            </Button>
          </Card>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default CategorySlugPage;

