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

          {/* AI Video Rotation Module */}
          <Card className="bg-gradient-card border-card-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-red-500" />
                <h3 className="font-orbitron font-bold text-lg text-glow-accent">
                  LIVE AI NEWS
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                  LIVE
                </Badge>
                {aiVideos.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleAutoPlay}
                    className="h-8 w-8"
                    title={isAutoPlaying ? "Pause rotation" : "Resume rotation"}
                  >
                    {isAutoPlaying ? (
                      <Pause className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Play className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {isLoadingVideos ? (
              <Skeleton className="aspect-video rounded-lg" />
            ) : currentVideo ? (
              <div className="relative">
                {/* Video Display */}
                <div 
                  className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => window.open(currentVideo.url, '_blank')}
                >
                  <img 
                    src={currentVideo.thumbnail}
                    alt={currentVideo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-red-500 rounded-full p-4">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                  </div>
                  
                  {/* Video Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-red-500 text-white border-red-600 text-xs">
                        {currentVideo.category}
                      </Badge>
                      <span className="text-xs text-gray-300">
                        {new Date(currentVideo.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-roboto text-sm font-medium text-white line-clamp-2 mb-1">
                      {currentVideo.title}
                    </h4>
                    <p className="text-xs text-gray-300">{currentVideo.channelName}</p>
                  </div>
                  
                  {/* Navigation Arrows */}
                  {aiVideos.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevious();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous video"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next video"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
                
                {/* Video Counter & Indicators */}
                {aiVideos.length > 1 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        {currentVideoIndex + 1} of {aiVideos.length}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {isAutoPlaying ? 'Auto-rotating' : 'Paused'}
                      </span>
                    </div>
                    
                    {/* Dot Indicators */}
                    <div className="flex gap-1.5 justify-center">
                      {aiVideos.slice(0, 10).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentVideoIndex(index);
                            setIsAutoPlaying(false);
                          }}
                          className={`h-1.5 rounded-full transition-all ${
                            index === currentVideoIndex 
                              ? 'bg-red-500 w-6' 
                              : 'bg-muted-foreground/30 w-1.5 hover:bg-muted-foreground/50'
                          }`}
                          aria-label={`Go to video ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* View All Link */}
                <Button
                  variant="outline"
                  className="w-full mt-3 border-red-500/50 hover:bg-red-500/10 text-sm"
                  onClick={() => window.open('/videos', '_blank')}
                >
                  View All AI Videos →
                </Button>
              </div>
            ) : (
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-12 w-12 text-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Loading latest AI videos...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
    </aside>
  );
};

export default Sidebar;