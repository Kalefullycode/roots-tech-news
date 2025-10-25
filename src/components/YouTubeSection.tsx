import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Youtube, Play, ExternalLink } from "lucide-react";
import YouTubeService, { YouTubeVideo } from "@/services/YouTubeService";
import { Skeleton } from "@/components/ui/skeleton";

const YouTubeSection = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const fetchedVideos = await YouTubeService.fetchAllVideos();
        setVideos(fetchedVideos.slice(0, 6)); // Show top 6 videos
      } catch (error) {
        console.error("Failed to fetch YouTube videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Youtube className="h-8 w-8 text-red-500" />
          <h2 className="font-orbitron text-3xl font-bold">Latest Tech Videos</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Youtube className="h-8 w-8 text-red-500" />
          <h2 className="font-orbitron text-3xl font-bold text-foreground">
            Latest Tech Videos
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card 
            key={video.id}
            className="overflow-hidden bg-card-modern border border-card-border/60 hover:border-red-500/50 transition-all hover-lift group cursor-pointer"
            onClick={() => window.open(video.url, '_blank')}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-muted overflow-hidden">
              <img 
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-red-500 rounded-full p-4">
                  <Play className="h-8 w-8 text-white fill-white" />
                </div>
              </div>
              <Badge className="absolute top-2 right-2 bg-red-500 text-white border-red-600">
                <Youtube className="h-3 w-3 mr-1" />
                Video
              </Badge>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-orbitron text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-red-500 transition-colors">
                {video.title}
              </h3>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{video.channelName}</span>
                <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                  {video.category}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {video.description}
              </p>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  {new Date(video.publishedAt).toLocaleDateString()}
                </span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default YouTubeSection;

