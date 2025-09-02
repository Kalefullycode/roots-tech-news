import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Calendar, Users } from "lucide-react";
import ArticleCard from "@/components/ArticleCard";
import aiArticle from "@/assets/ai-article.webp";
import startupArticle from "@/assets/startup-article.webp";
import securityArticle from "@/assets/security-article.webp";
import gadgetArticle from "@/assets/gadget-article.webp";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  
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
        description: "Dive into the intersection of technology, society, and Afro-futuristic innovations.",
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

  const sampleArticles = [
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
    },
    {
      title: `Interview: Leading Expert Discusses ${categoryData.title} Future`,
      excerpt: "An in-depth conversation about what's next in this rapidly evolving field.",
      category: categoryData.title,
      date: "2 days ago",
      imageUrl: categoryData.image,
      url: "#"
    }
  ];

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
                <div className="text-2xl font-bold">{categoryData.stats.articles}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5" />
                  <span className="font-orbitron font-semibold">Readers</span>
                </div>
                <div className="text-2xl font-bold">{categoryData.stats.readers}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-orbitron font-semibold">Trending</span>
                </div>
                <div className="text-2xl font-bold">{categoryData.stats.trending}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Article */}
        <section className="mb-12">
          <h2 className="font-orbitron text-2xl font-bold text-glow-primary mb-6">
            Featured Story
          </h2>
          <ArticleCard {...sampleArticles[0]} />
        </section>

        {/* Latest Articles */}
        <section>
          <h2 className="font-orbitron text-2xl font-bold text-glow-accent mb-6">
            Latest in {categoryData.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleArticles.slice(1).map((article, index) => (
              <ArticleCard key={index} {...article} />
            ))}
          </div>
        </section>

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