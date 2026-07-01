import { Link } from "react-router-dom";
import ArticleCard from "./ArticleCard";
import { Button } from "./components/ui/button";

const LatestDiscoveries = () => {
  const articles = [
    {
      title: "Quantum Computing Breakthrough: Google Achieves Quantum Supremacy 2.0",
      excerpt: "Google's latest quantum processor demonstrates error correction capabilities that could revolutionize computing.",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop",
      category: "Quantum Computing",
      date: "June 15, 2025",
      readTime: "6 min read",
      author: "Sarah Chen",
      slug: "/quantum/google-supremacy-2"
    },
    {
      title: "AI Startup Secures $100M Funding for Revolutionary Language Model",
      excerpt: "The new model promises to understand context and nuance better than any existing AI system.",
      imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
      category: "Startups",
      date: "June 14, 2025",
      readTime: "5 min read",
      author: "Marcus Johnson",
      slug: "/startups/ai-funding-round"
    },
    {
      title: "Cybersecurity Threats: New Vulnerability Discovered in Major Cloud Platforms",
      excerpt: "Security researchers have identified a critical flaw that could affect millions of cloud users worldwide.",
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
      category: "Security",
      date: "June 13, 2025",
      readTime: "7 min read",
      author: "Elena Rodriguez",
      slug: "/security/cloud-vulnerability"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="section-header">
          <h2 className="section-title">Latest Discoveries</h2>
          <Button asChild variant="outline" className="btn btn-outline">
            <Link to="/category/technology">View All</Link>
          </Button>
        </div>
        
        <div className="grid-articles">
          {articles.map((article, index) => (
            <ArticleCard 
              key={index}
              title={article.title}
              excerpt={article.excerpt}
              imageUrl={article.imageUrl}
              category={article.category}
              date={article.date}
              readTime={article.readTime}
              author={article.author}
              slug={article.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestDiscoveries;
