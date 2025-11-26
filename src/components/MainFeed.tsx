import ArticleCard from "./ArticleCard";
import LiveNewsIndicator from "./LiveNewsIndicator";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cleanDescription } from "@/utils/cleanDescription";
import aiArticle from "@/assets/ai-article.webp";
import startupArticle from "@/assets/startup-article.webp";
import securityArticle from "@/assets/security-article.webp";
import gadgetArticle from "@/assets/gadget-article.webp";

// Fetch articles from serverless function (eliminates CORS)
async function fetchArticles() {
  const response = await fetch('/functions/fetch-rss');
  if (!response.ok) throw new Error('Failed to fetch articles');
  const data = await response.json();
  return data.articles;
}

const MainFeed = () => {
  // Use serverless function instead of direct RSS fetching
  const { data: newsArticles, isLoading, isError } = useQuery({
    queryKey: ['tech-articles'],
    queryFn: fetchArticles,
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 60000,
    retry: 2
  });
  
  console.log('MainFeed - Loading:', isLoading, 'Error:', isError, 'Articles:', newsArticles?.length || 0);
  console.log('MainFeed - Using serverless RSS function (no CORS issues)');
  
  // Fallback articles with our generated images
  const fallbackArticles = [
    {
      id: "fallback-1",
      title: "Revolutionary AI Breakthrough in Quantum Neural Networks",
      description: "Scientists at the University of Cape Town have developed a groundbreaking quantum-AI hybrid that could reshape machine learning as we know it. This futuristic approach combines traditional computing with quantum mechanics.",
      category: "AI",
      publishedAt: new Date().toISOString(),
      urlToImage: aiArticle,
      url: "#",
      source: { id: "roots", name: "RootsTech" }
    },
    {
      id: "fallback-2", 
      title: "Nigerian Startup Raises $50M for Solar-Powered Smart Cities",
      description: "Lagos-based tech company unveils plans to build Africa's first fully solar-powered smart city infrastructure.",
      category: "Startups",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      urlToImage: startupArticle,
      url: "#",
      source: { id: "roots", name: "RootsTech" }
    },
    {
      id: "fallback-3",
      title: "Cybersecurity Threats in the Metaverse Era", 
      description: "As virtual worlds become more integrated with our daily lives, new security challenges emerge.",
      category: "Security",
      publishedAt: new Date(Date.now() - 21600000).toISOString(),
      urlToImage: securityArticle,
      url: "#",
      source: { id: "roots", name: "RootsTech" }
    },
    {
      id: "fallback-4",
      title: "Revolutionary Holographic Display Technology",
      description: "South African engineers develop first consumer-grade holographic displays for everyday use.",
      category: "Gadgets", 
      publishedAt: new Date(Date.now() - 28800000).toISOString(),
      urlToImage: gadgetArticle,
      url: "#",
      source: { id: "roots", name: "RootsTech" }
    }
  ];

  // Use real news data if available, otherwise use fallback
  // ALWAYS use fallback articles to ensure content displays
  const articles = (newsArticles && newsArticles.length > 0) ? newsArticles : fallbackArticles;
  
  console.log('MainFeed - Final articles count:', articles.length);
  
  // Format articles for our ArticleCard component
  interface ArticleInput {
    title: string;
    description?: string;
    category?: string;
    publishedAt: string;
    urlToImage?: string;
    url?: string;
    source?: { id?: string; name?: string };
  }
  
  const formatArticle = (article: ArticleInput) => {
    return {
      title: article.title,
      excerpt: cleanDescription(article.description) || "Click to read more about this exciting development in technology.",
      category: article.category || "Tech",
      date: new Date(article.publishedAt).toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        day: 'numeric',
        month: 'short'
      }),
      imageUrl: article.urlToImage || gadgetArticle,
      url: article.url || "#"
    };
  };

  const featuredArticle = articles.length > 0 ? formatArticle(articles[0]) : null;
  const regularArticles = articles.slice(1, 9).map(formatArticle);

  if (isLoading) {
    return (
      <main className="space-y-8">
        <LiveNewsIndicator />
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-10">
      <LiveNewsIndicator />
      
      {/* Featured Article */}
      {featuredArticle && (
        <section className="space-y-6">
          <h2 className="font-orbitron text-2xl font-bold text-glow-primary">
            {isError ? 'FEATURED STORY' : 'BREAKING NEWS'}
          </h2>
          <ArticleCard {...featuredArticle} featured={true} />
        </section>
      )}

      {/* Latest News Grid */}
      <section className="space-y-6">
        <h2 className="font-orbitron text-2xl font-bold text-glow-accent">
          {isError ? 'LATEST DISCOVERIES' : 'LIVE TECH FEED'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {regularArticles.map((article, index) => (
            <ArticleCard key={`article-${index}`} {...article} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default MainFeed;