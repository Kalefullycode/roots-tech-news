import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Youtube, Clock, ExternalLink } from "lucide-react";
import { Loader2 } from "lucide-react";

interface VideoItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    scheduledStartTime?: string;
    thumbnails: {
      high: { url: string };
      default: { url: string };
    };
    channelTitle: string;
  };
  channelName?: string;
}

const fetchVideos = async (): Promise<VideoItem[]> => {
  const res = await fetch("/api/latest-ai-tech-videos");
  if (!res.ok) throw new Error("Failed to fetch videos");
  return res.json();
};

function VideoCard({ video }: { video: VideoItem }) {
  const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
  const thumbnail = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url;
  const channelName = video.channelName || video.snippet.channelTitle;
  
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
    <Card 
      className="overflow-hidden bg-card-modern border border-card-border/60 hover:border-red-500/50 transition-all hover-lift group cursor-pointer"
      onClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img 
          src={thumbnail}
          alt={video.snippet.title}
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
        <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {video.snippet.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span className="font-medium truncate">{channelName}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getRelativeTime(video.snippet.publishedAt)}
          </span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">
          {video.snippet.description}
        </p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Watch on YouTube</span>
          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
        </div>
      </div>
    </Card>
  );
}

export default function LatestAiTechVideos() {
  const { data: videos, isLoading, isError } = useQuery({
    queryKey: ["latestAiTechVideos"],
    queryFn: fetchVideos,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Youtube className="h-8 w-8 text-red-500" />
            <h2 className="font-orbitron text-3xl font-bold text-foreground">
              Latest AI & Tech Videos
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading videos...</span>
        </div>
      </section>
    );
  }

  if (isError || !videos || videos.length === 0) {
    return (
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Youtube className="h-8 w-8 text-red-500" />
            <h2 className="font-orbitron text-3xl font-bold text-foreground">
              Latest AI & Tech Videos
            </h2>
          </div>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <p>Unable to load videos at this time. Please try again later.</p>
        </div>
      </section>
    );
  }

  const displayVideos = videos.slice(0, 6);

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Youtube className="h-8 w-8 text-red-500" />
          <h2 className="font-orbitron text-3xl font-bold text-foreground">
            Latest AI & Tech Videos
          </h2>
        </div>
        <a 
          href="/videos" 
          className="text-sm text-primary hover:underline font-medium"
        >
          View All →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayVideos.map((video) => (
          <VideoCard key={video.id.videoId} video={video} />
        ))}
      </div>
    </section>
  );
}









