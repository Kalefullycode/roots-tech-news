import { useState, useEffect } from "react";
import { X, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBreakingNews } from "@/hooks/useBreakingNews";

interface BreakingNewsItem {
  id: string;
  headline: string;
  timestamp: string;
  urgency: 'breaking' | 'urgent' | 'trending';
  source: string;
  url: string;
}

const BreakingNewsBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  
  // Use the breaking news hook for real-time updates
  const { breakingNews, isLoading, refreshNews } = useBreakingNews();

  // Rotate news every 8 seconds
  useEffect(() => {
    if (breakingNews.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % breakingNews.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [breakingNews.length]);

  // Reset index when news updates
  useEffect(() => {
    setCurrentNewsIndex(0);
  }, [breakingNews]);

  const getCurrentNews = () => {
    if (breakingNews.length === 0) return null;
    return breakingNews[currentNewsIndex];
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'breaking':
        return 'bg-accent text-white';
      case 'urgent':
        return 'bg-secondary text-white';
      case 'trending':
        return 'bg-primary text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'breaking':
        return 'Breaking';
      case 'urgent':
        return 'Urgent';
      case 'trending':
        return 'Trending';
      default:
        return 'News';
    }
  };

  const currentNews = getCurrentNews();

  if (!isVisible || !currentNews) return null;

  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Urgency Badge */}
            <span 
              className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(currentNews.urgency)}`}
            >
              {getUrgencyLabel(currentNews.urgency)}
            </span>
            
            {/* News Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {currentNews.headline}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{currentNews.source}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {currentNews.timestamp}
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0"
              onClick={refreshNews}
              aria-label="Refresh news"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsVisible(false)}
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dummy RotateCcw import for the refresh button
import { RotateCcw } from "lucide-react";

export default BreakingNewsBanner;
