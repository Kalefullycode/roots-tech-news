import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import ArticleCard from "./ArticleCard";
import aiArticle from "@/assets/ai-article.webp";
import startupArticle from "@/assets/startup-article.webp";
import securityArticle from "@/assets/security-article.webp";
import gadgetArticle from "@/assets/gadget-article.webp";

async function fetchArticles() {
  const response = await fetch('/functions/fetch-rss');
  if (!response.ok) throw new Error('Failed to fetch articles');
  const data = await response.json();
  return data.articles;
}

const LatestDiscoveries = () => {
  const { data: newsArticles, isLoading } = useQuery({
    queryKey: ['latest-discoveries'],
    queryFn: fetchArticles,
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 60000,
    retry: 2
  });

  // Fallback articles with categories
  const fallbackArticles = [
    {
      id: "fallback-1",
      title: "Revolutionary AI Breakthrough in Quantum Neural Networks",
      description: "Scientists at the University of Cape Town have developed a groundbreaking quantum-AI hybrid that could reshape machine learning as we know it.",
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
      description: "As virtual worlds become more integrated with our daily lives, new security challenges emerge requiring innovative solutions.",
      category: "Security",
      publishedAt: new Date(Date.now() - 21600000).toISOString(),
      urlToImage: securityArticle,
      url: "#",
      source: { id: "roots", name: "RootsTech" }
    },
    {
      id: "fallback-4",
      title: "Revolutionary Holographic Display Technology",
      description: "South African engineers develop first consumer-grade holographic displays for everyday use in homes and offices.",
      category: "Gadgets", 
      publishedAt: new Date(Date.now() - 28800000).toISOString(),
      urlToImage: gadgetArticle,
      url: "#",
      source: { id: "roots", name: "RootsTech" }
    }
  ];

  // Use real news data if available, otherwise use fallback
  const articles = (newsArticles && newsArticles.length > 0) ? newsArticles : fallbackArticles;
  
  // Format articles for ArticleCard component
  const formatArticle = (article: any, index: number) => {
    // Map categories from real articles to our categories
    const categoryMap: Record<string, string> = {
      'AI': 'AI',
      'Tech': 'Gadgets',
      'Startups': 'Startups',
      'Security': 'Security'
    };

    // Determine category from article or use fallback based on index
    let category = article.category || categoryMap[article.category] || 'Tech';
    if (!categoryMap[category]) {
      // Assign categories based on index if not available
      const categories = ['AI', 'Startups', 'Security', 'Gadgets'];
      category = categories[index % categories.length];
    }

    return {
      title: article.title || `Discovery ${index + 1}`,
      excerpt: article.description?.substring(0, 150) || article.contentSnippet?.substring(0, 150) || "Click to read more about this exciting development in technology.",
      category: category,
      date: new Date(article.publishedAt || article.pubDate || new Date()).toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        day: 'numeric',
        month: 'short'
      }),
      imageUrl: article.image || article.urlToImage || article.media?.thumbnail || fallbackArticles[index % fallbackArticles.length].urlToImage,
      url: article.url || article.link || "#"
    };
  };

  // Get 4 articles for 2x2 grid
  const discoveryArticles = articles.slice(0, 4).map((article: any, index: number) => formatArticle(article, index));

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="font-orbitron text-3xl font-bold text-glow-accent">
            LATEST DISCOVERIES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {discoveryArticles.map((article, index) => (
            <ArticleCard key={`discovery-${index}`} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestDiscoveries;

