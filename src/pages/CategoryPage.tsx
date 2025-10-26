import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Calendar, Users, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ArticleCard from "@/components/ArticleCard";
import aiArticle from "@/assets/ai-article.webp";
import startupArticle from "@/assets/startup-article.webp";
import securityArticle from "@/assets/security-article.webp";
import gadgetArticle from "@/assets/gadget-article.webp";

// Fetch articles filtered by category
async function fetchCategoryArticles(category: string) {
  const response = await fetch('/.netlify/functions/fetch-rss');
  if (!response.ok) throw new Error('Failed to fetch articles');
  const data = await response.json();
  
  // Filter articles by category (AI, Tech, etc.)
  const categoryLower = category.toLowerCase();
  return data.articles.filter((article: any) => {
    const articleCategory = article.category.toLowerCase();
    return articleCategory.includes(categoryLower) || 
           article.title.toLowerCase().includes(categoryLower) ||
           article.description.toLowerCase().includes(categoryLower);
  });
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  
  // Fetch real articles for this category
  const { data: categoryArticles, isLoading } = useQuery({
    queryKey: ['category-articles', category],
    queryFn: () => fetchCategoryArticles(category || 'tech'),
    enabled: !!category,
    staleTime: 300000 // 5 minutes
  });
  
  const getCategoryData = (cat: string) => {
    const categories = {
      ai: {
        title: "Artificial Intelligence",
        description: "Explore the cutting-edge world of AI, machine learning, and neural networks shaping our future.",
        color: "from-blue-500 to-purple-600",
        icon: "🤖",
        stats: { articles: 1247, readers: "45K", trending: 15 },
        image: aiArticle
      },
      startups: {
        title: "Startup Ecosystem",
        description: "Discover innovative startups, funding rounds, and entrepreneurial ventures across Africa and beyond.",
        color: "from-green-500 to-teal-600",
        icon: "🚀",
        stats: { articles: 892, readers: "32K", trending: 23 },
        image: startupArticle
      },
      culture: {
        title: "Tech Culture",
        description: "Dive into the intersection of technology, society, and futuristic innovations.",
        color: "from-purple-500 to-pink-600",
        icon: "🌍",
        stats: { articles: 634, readers: "28K", trending: 8 },
        image: gadgetArticle
      },
      gadgets: {
        title: "Gadgets & Hardware",
        description: "Latest reviews, launches, and breakthrough hardware innovations from around the world.",
        color: "from-orange-500 to-red-600",
        icon: "📱",
        stats: { articles: 756, readers: "51K", trending: 19 },
        image: gadgetArticle
      },
      security: {
        title: "Cybersecurity",
        description: "Stay informed about digital security, privacy, and emerging cyber threats in our connected world.",
        color: "from-red-500 to-yellow-600",
        icon: "🔒",
        stats: { articles: 423, readers: "22K", trending: 12 },
        image: securityArticle
      }
    };
    
    return categories[cat as keyof typeof categories] || categories.ai;
  };

  const categoryData = getCategoryData(category || 'ai');

  // Format real articles for display
  const formatArticle = (article: any) => ({
    title: article.title,
    excerpt: article.description || "Click to read more about this exciting development in technology.",
    category: article.source,
    date: new Date(article.publishedAt).toLocaleDateString(),
    imageUrl: article.image || categoryData.image,
    url: article.url
  });

  // Use real articles if available, otherwise use sample
  const displayArticles = categoryArticles && categoryArticles.length > 0
    ? categoryArticles.map(formatArticle)
    : [
        {
          title: `Latest ${categoryData.title} Breakthrough Changes Everything`,
          excerpt: "Revolutionary developments in this field are reshaping how we think about technology and innovation.",
          category: categoryData.title,
          date: "2 hours ago",
          imageUrl: categoryData.image,
          url: "#",
          featured: true
        },
        {
          title: `Top 10 ${categoryData.title} Trends to Watch This Year`,
          excerpt: "Industry experts share their insights on the most important developments coming in 2024.",
          category: categoryData.title,
          date: "5 hours ago",
          imageUrl: categoryData.image,
          url: "#"
        },
        {
          title: `How ${categoryData.title} is Transforming African Tech`,
          excerpt: "Exploring the unique ways this technology is being adopted and innovated across the continent.",
          category: categoryData.title,
          date: "1 day ago",
          imageUrl: categoryData.image,
          url: "#"
        }
      ];
  
  // Update stats with real data
  const realStats = {
    articles: categoryArticles?.length || categoryData.stats.articles,
    readers: categoryData.stats.readers,
    trending: categoryArticles?.length || categoryData.stats.trending
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-card-border">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
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
                    realStats.articles
                  )}
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5" />
                  <span className="font-orbitron font-semibold">Readers</span>
                </div>
                <div className="text-2xl font-bold">{realStats.readers}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-orbitron font-semibold">Trending</span>
                </div>
                <div className="text-2xl font-bold">{realStats.trending}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <span className="ml-4 text-lg text-muted-foreground">Loading {categoryData.title} articles...</span>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {displayArticles[0] && (
              <section className="mb-12">
                <h2 className="font-orbitron text-2xl font-bold text-glow-primary mb-6">
                  Featured Story
                </h2>
                <ArticleCard {...displayArticles[0]} featured />
              </section>
            )}

            {/* Latest Articles */}
            <section>
              <h2 className="font-orbitron text-2xl font-bold text-glow-accent mb-6">
                Latest in {categoryData.title} ({displayArticles.length - 1} articles)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayArticles.slice(1).map((article, index) => (
                  <ArticleCard key={index} {...article} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Coming Soon */}
        <Card className="mt-12 p-8 text-center bg-card-modern border border-card-border/60">
          <h3 className="font-orbitron text-xl font-bold mb-4 text-glow-primary">
            More Content Coming Soon
          </h3>
          <p className="text-muted-foreground font-roboto mb-6">
            We're constantly adding new {categoryData.title.toLowerCase()} content. 
            Check back regularly for the latest updates and insights.
          </p>
          <Button className="bg-gradient-hero hover:glow-primary">
            Subscribe for Updates
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CategoryPage;