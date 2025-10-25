import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Mail, Play } from "lucide-react";
import { useTrendingNews } from "@/hooks/useNews";
import { useState, useEffect } from "react";
import YouTubeService, { YouTubeVideo } from "@/services/YouTubeService";

const Sidebar = () => {
  const { data: trendingArticles, isLoading: isTrendingLoading } = useTrendingNews();
  const [featuredVideo, setFeaturedVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    const fetchFeaturedVideo = async () => {
      try {
        // Get the best AI/tech video available
        const video = await YouTubeService.getFeaturedVideo();
        if (video) {
          setFeaturedVideo(video);
        } else {
          // Try AI category as fallback
          const videos = await YouTubeService.fetchByCategory('AI');
          if (videos.length > 0) {
            setFeaturedVideo(videos[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch featured video:', error);
      }
    };

    fetchFeaturedVideo();
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchFeaturedVideo, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fallbackTrending = [
    {
      title: "AI Revolution in African Tech Startups",
      urlToImage: "/placeholder.svg",
      category: "AI",
      url: "#"
    },
    {
      title: "Quantum Computing Breakthrough",
      urlToImage: "/placeholder.svg", 
      category: "Science",
      url: "#"
    },
    {
      title: "Cybersecurity in the Metaverse",
      urlToImage: "/placeholder.svg",
      category: "Security", 
      url: "#"
    },
    {
      title: "Green Tech Innovations from Nigeria",
      urlToImage: "/placeholder.svg",
      category: "Startups",
      url: "#"
    }
  ];

  const trending = trendingArticles && trendingArticles.length > 0 
    ? trendingArticles.slice(0, 4) 
    : fallbackTrending;

  return (
    <aside className="space-y-6">
      {/* Trending Section */}
      <Card className="bg-gradient-card border-card-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h3 className="font-orbitron font-bold text-lg text-glow-accent">
            TRENDING NOW
          </h3>
        </div>
        
        {isTrendingLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {trending.map((article, index) => (
              <a 
                key={index} 
                href={article.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 cursor-pointer group block"
              >
                <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={article.urlToImage || "/placeholder.svg"} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge className="text-xs mb-1 bg-primary/20 text-primary">
                    {article.category}
                  </Badge>
                  <h4 className="font-roboto text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                </div>
              </a>
            ))}
          </div>
        )}
      </Card>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-card border-card-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-neon-blue" />
          <h3 className="font-orbitron font-bold text-lg text-glow-primary">
            STAY ROOTED IN TECH
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 font-roboto">
          Get the latest in futuristic technology delivered to your inbox.
        </p>
        
        <div className="space-y-3">
          <Input 
            placeholder="Enter your email" 
            className="bg-input border-border focus:border-neon-blue"
          />
          <Button className="w-full bg-gradient-hero glow-primary font-orbitron font-bold">
            SUBSCRIBE
          </Button>
        </div>
      </Card>

      {/* Video Module */}
      <Card className="bg-gradient-card border-card-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Play className="h-5 w-5 text-cyber-pink" />
          <h3 className="font-orbitron font-bold text-lg text-glow-accent">
            FEATURED VIDEO
          </h3>
        </div>
        
        {featuredVideo ? (
          <div 
            className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => window.open(featuredVideo.url, '_blank')}
          >
            <img 
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-red-500 rounded-full p-4">
                <Play className="h-8 w-8 text-white fill-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
              <Badge className="bg-red-500 text-white border-red-600 mb-2">
                {featuredVideo.category}
              </Badge>
              <h4 className="font-roboto text-sm font-medium text-white line-clamp-2">
                {featuredVideo.title}
              </h4>
              <p className="text-xs text-gray-300 mt-1">{featuredVideo.channelName}</p>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Play className="h-12 w-12 text-foreground group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h4 className="font-roboto text-sm font-medium text-foreground">
                Loading latest AI tech video...
              </h4>
            </div>
          </div>
        )}
      </Card>
    </aside>
  );
};

export default Sidebar;