import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Zap, Radio } from "lucide-react";
import EnhancedRSSService from "@/services/EnhancedRSSService";
import { NewsArticle } from "@/services/NewsService";

const RealTimeNewsTicker = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Initial fetch
    const fetchNews = async () => {
      try {
        const articles = await EnhancedRSSService.fetchAllRSSFeeds();
        setNews(articles.slice(0, 20)); // Get top 20 most recent
      } catch (error) {
        console.error("Failed to fetch ticker news:", error);
      }
    };

    fetchNews();

    // Refresh every 5 minutes
    const refreshInterval = setInterval(fetchNews, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (news.length === 0) return;

    // Rotate news items every 5 seconds
    const rotateInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000);

    return () => clearInterval(rotateInterval);
  }, [news.length]);

  if (news.length === 0) return null;

  const currentNews = news[currentIndex];

  return (
    <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-y border-primary/30 py-3 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          {/* Live Indicator */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <Radio className="h-5 w-5 text-red-500" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping" />
            </div>
            <Badge className="bg-red-500 text-white border-red-600 font-orbitron">
              LIVE
            </Badge>
          </div>

          {/* News Content */}
          <div className="flex-1 flex items-center gap-3 overflow-hidden">
            <Zap className="h-4 w-4 text-accent flex-shrink-0" />
            <a
              href={currentNews.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity overflow-hidden"
            >
              <span className="font-orbitron text-sm font-semibold text-foreground whitespace-nowrap">
                {currentNews.source.name}:
              </span>
              <span className="text-sm text-muted-foreground truncate">
                {currentNews.title}
              </span>
            </a>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {news.slice(0, 5).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  idx === currentIndex % 5
                    ? "bg-primary w-4"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeNewsTicker;

