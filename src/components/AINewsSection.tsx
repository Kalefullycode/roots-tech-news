import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, Brain, Code2, Sparkles } from "lucide-react";

interface AINewsItem {
  title: string;
  excerpt: string;
  category: string;
  icon: React.ReactNode;
  slug: string;
}

const AINewsSection = () => {
  const aiNews: AINewsItem[] = [
    {
      title: "Breakthrough in AI Reasoning Capabilities",
      excerpt: "New research demonstrates AI systems that can perform complex multi-step reasoning with human-like accuracy.",
      category: "Research",
      icon: <Brain className="h-5 w-5" />,
      slug: "/ai/reasoning-breakthrough"
    },
    {
      title: "Ethical AI: Addressing Bias in Machine Learning",
      excerpt: "Industry leaders gather to discuss strategies for eliminating bias and ensuring fairness in AI systems.",
      category: "Ethics",
      icon: <Sparkles className="h-5 w-5" />,
      slug: "/ai/ethical-ai-bias"
    },
    {
      title: "AI in Healthcare: Transforming Patient Care",
      excerpt: "How artificial intelligence is revolutionizing diagnostics, treatment planning, and patient monitoring.",
      category: "Healthcare",
      icon: <Bot className="h-5 w-5" />,
      slug: "/ai/healthcare-revolution"
    },
    {
      title: "The Future of AI Development: No-Code Platforms",
      excerpt: "Emerging platforms are making AI development accessible to non-technical users.",
      category: "Development",
      icon: <Code2 className="h-5 w-5" />,
      slug: "/ai/no-code-platforms"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="section-header">
          <h2 className="section-title">AI News & Insights</h2>
          <Button asChild variant="outline" className="btn btn-outline">
            <Link to="/category/ai">All AI News</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiNews.map((item, index) => (
            <article key={index} className="card p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-primary/5 rounded-lg">
                  <span className="text-primary">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-playfair font-bold text-xl mb-2">
                    <Link 
                      to={item.slug} 
                      className="hover:text-primary-dark transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{item.excerpt}</p>
                  <span className="badge badge-primary">{item.category}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AINewsSection;
