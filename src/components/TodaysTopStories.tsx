import { Link } from "react-router-dom";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { Button } from "./components/ui/button";

interface NewsItem {
  title: string;
  source: string;
  date: string;
  timeAgo?: string;
  category?: string;
  slug: string;
  isTrending?: boolean;
}

const TodaysTopStories = () => {
  const newsItems: NewsItem[] = [
    {
      title: "Apple Unveils New AI-Powered Features in iOS 19",
      source: "TechCrunch",
      date: "June 15, 2025",
      timeAgo: "2 hours ago",
      category: "Mobile",
      slug: "/apple-ios-19-ai-features",
      isTrending: true
    },
    {
      title: "Microsoft to Acquire AI Startup for $2 Billion",
      source: "The Verge",
      date: "June 15, 2025",
      timeAgo: "3 hours ago",
      category: "Business",
      slug: "/microsoft-acquisition-ai-startup",
      isTrending: true
    },
    {
      title: "New Study Reveals Impact of AI on Job Market",
      source: "MIT Technology Review",
      date: "June 14, 2025",
      timeAgo: "1 day ago",
      category: "Research",
      slug: "/ai-job-market-study"
    },
    {
      title: "OpenAI Announces GPT-5 with Multimodal Capabilities",
      source: "Wired",
      date: "June 14, 2025",
      timeAgo: "1 day ago",
      category: "Artificial Intelligence",
      slug: "/openai-gpt-5-announcement",
      isTrending: true
    },
    {
      title: "Cybersecurity Experts Warn of New Phishing Campaign",
      source: "Krebs on Security",
      date: "June 13, 2025",
      timeAgo: "2 days ago",
      category: "Security",
      slug: "/cybersecurity-phishing-warning"
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="section-header">
          <h2 className="section-title">Today's Top Stories</h2>
          <Button asChild variant="outline" className="btn btn-outline">
            <Link to="/news">View All News</Link>
          </Button>
        </div>
        
        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <article 
              key={index} 
              className={`card p-6 transition-all duration-200 ${
                item.isTrending ? 'border-l-4 border-l-secondary' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-playfair font-bold text-xl leading-tight">
                      <Link 
                        to={item.slug} 
                        className="hover:text-primary-dark transition-colors line-clamp-1"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    {item.isTrending && (
                      <span className="flex items-center gap-1 text-secondary">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs font-medium">Trending</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-medium text-primary">{item.source}</span>
                    <span>{item.timeAgo || item.date}</span>
                    {item.category && (
                      <span className="badge badge-gray">{item.category}</span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TodaysTopStories;
