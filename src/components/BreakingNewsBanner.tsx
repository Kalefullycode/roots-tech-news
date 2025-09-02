import { useState, useEffect } from "react";
import { AlertTriangle, X, Clock, Zap, TrendingUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [isLive, setIsLive] = useState(true);
  
  // Use the breaking news hook for real-time updates
  const { breakingNews, isLoading, refreshNews, getTimeUntilNextUpdate } = useBreakingNews();

  // Rotate news every 8 seconds
  useEffect(() => {
    if (breakingNews.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % breakingNews.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [breakingNews.length]);

  // Simulate live status indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 2000); // Blink every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Reset index when news updates
  useEffect(() => {
    setCurrentNewsIndex(0);
  }, [breakingNews]);

  const getCurrentNews = () => {
    if (breakingNews.length === 0) return null;
    return breakingNews[currentNewsIndex];
  };

  const getUrgencyConfig = (urgency: string) => {
    switch (urgency) {
      case 'breaking':
        return {
          badge: 'BREAKING',
          bgColor: 'from-red-600/95 to-red-500/95',
          borderColor: 'border-red-400',
          icon: AlertTriangle
        };
      case 'urgent':
        return {
          badge: 'URGENT',
          bgColor: 'from-orange-600/95 to-orange-500/95', 
          borderColor: 'border-orange-400',
          icon: Zap
        };
      case 'trending':
        return {
          badge: 'TRENDING',
          bgColor: 'from-blue-600/95 to-blue-500/95',
          borderColor: 'border-blue-400',
          icon: TrendingUp
        };
      default:
        return {
          badge: 'NEWS',
          bgColor: 'from-gray-600/95 to-gray-500/95',
          borderColor: 'border-gray-400',
          icon: AlertTriangle
        };
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  if (!isVisible || breakingNews.length === 0) return null;

  const currentNews = getCurrentNews();
  if (!currentNews) return null;
  
  const urgencyConfig = getUrgencyConfig(currentNews.urgency);
  const Icon = urgencyConfig.icon;

  return (
    <div className={`bg-gradient-to-r ${urgencyConfig.bgColor} border-b ${urgencyConfig.borderColor} backdrop-blur-sm`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Live Indicator & Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-white animate-pulse" />
              <Badge className="bg-white/20 text-white border-white/30 font-orbitron font-bold backdrop-blur-sm">
                {urgencyConfig.badge}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400' : 'bg-green-400/50'} transition-all duration-300`} />
              <span className="text-white/80 text-xs font-roboto">LIVE</span>
            </div>
          </div>
          
          {/* News Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4">
              <p className="text-white font-roboto font-medium truncate">
                {currentNews.headline}
              </p>
              
              <div className="hidden md:flex items-center gap-2 text-white/70 text-xs">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(currentNews.timestamp)}</span>
                <span>•</span>
                <span>{currentNews.source}</span>
              </div>
            </div>
          </div>

          {/* News Counter & Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              {/* Manual refresh button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshNews}
                disabled={isLoading}
                className="text-white/80 hover:bg-white/20 transition-colors"
                title="Refresh breaking news"
              >
                <RotateCcw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <span className="font-orbitron">
                  {currentNewsIndex + 1}/{breakingNews.length}
                </span>
                <div className="flex gap-1">
                  {breakingNews.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index === currentNewsIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Update Info */}
        <div className="flex items-center justify-center mt-2 pt-2 border-t border-white/20">
          <p className="text-white/60 text-xs font-roboto">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                Updating breaking news...
              </span>
            ) : (
              <>
                Auto-updates every hour • Breaking news every 15 min • 
                <span className="ml-1 text-white/80">Next update in {getTimeUntilNextUpdate()} minutes</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsBanner;