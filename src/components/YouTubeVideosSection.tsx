import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { youtubeService } from "@/services/YouTubeService";
import type { YouTubeVideo } from "@/services/YouTubeService";

const YouTubeVideosSection = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch latest videos from all categories
        const fetchedVideos = await youtubeService.fetchAllVideos();
        // Get top 6 most recent videos
        setVideos(fetchedVideos.slice(0, 6));
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
    // Refresh every 10 minutes to get latest videos
    const interval = setInterval(fetchVideos, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'AI': 'bg-blue-600',
      'aiNews': 'bg-blue-600',
      'Tech': 'bg-green-600',
      'techNews': 'bg-green-600',
      'Podcasts': 'bg-purple-600',
      'podcasts': 'bg-purple-600',
      'Business': 'bg-yellow-600',
      'makeMoneyWithAI': 'bg-yellow-600',
      'Tutorials': 'bg-pink-600',
      'tutorials': 'bg-pink-600',
      'aiVsHuman': 'bg-red-600'
    };
    return colors[category] || 'bg-gray-600';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'AI': 'AI News',
      'aiNews': 'AI News',
      'Tech': 'Tech News',
      'techNews': 'Tech News',
      'Podcasts': 'Podcasts',
      'podcasts': 'Podcasts',
      'Business': 'Business',
      'makeMoneyWithAI': 'Business',
      'Tutorials': 'Tutorials',
      'tutorials': 'Tutorials',
      'aiVsHuman': 'AI vs Human'
    };
    return labels[category] || category;
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const days = Math.floor(diffInHours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="font-orbitron text-3xl font-bold text-glow-primary flex items-center gap-3">
            <Play className="h-8 w-8 text-red-500" />
            🎥 Latest AI & Tech Videos
          </h2>
          <p className="text-muted-foreground mt-2 font-roboto">
            Curated from top tech channels: Stefan Mischook, Sabrina Ramonov, Nicky Saunders, AI Explained, Two Minute Papers, Matt Wolfe
          </p>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 mb-8">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                const fetchVideos = async () => {
                  setLoading(true);
                  try {
                    youtubeService.clearCache();
                    const fetchedVideos = await youtubeService.fetchAllVideos();
                    setVideos(fetchedVideos.slice(0, 6));
                  } catch (err) {
                    console.error('Error fetching videos:', err);
                    setError('Failed to load videos. Please try again later.');
                  } finally {
                    setLoading(false);
                  }
                };
                fetchVideos();
              }}
            >
              Try Again
            </Button>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {videos.map((video) => (
              <Card
                key={video.id}
                className="bg-card-modern border border-card-border/60 overflow-hidden hover:border-red-600 transition-all cursor-pointer group"
                onClick={() => window.open(video.url, '_blank')}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 overflow-hidden">
                  <img
                    src={video.thumbnailHQ || video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1 fill-current" />
                    </div>
                  </div>
                  
                  {/* Duration */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs font-bold">
                      {video.duration}
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className={`${getCategoryColor(video.category)} text-white border-0`}>
                      {getCategoryLabel(video.category)}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-roboto font-bold text-foreground mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="font-medium text-foreground">{video.channelName || video.channelTitle}</span>
                    <span>{getRelativeTime(video.publishedAt)}</span>
                  </div>
                  {video.viewCount && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-600" />
                      <span className="text-xs text-muted-foreground">{video.viewCount}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-8 text-muted-foreground">
            No videos available at the moment. Please check back later.
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-orbitron font-bold"
            onClick={() => navigate('/videos')}
          >
            View All Videos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default YouTubeVideosSection;

