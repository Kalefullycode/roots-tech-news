import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Youtube, Clock, ExternalLink, Calendar } from "lucide-react";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

interface LiveVideoItem {
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

const fetchLiveVideos = async (): Promise<LiveVideoItem[]> => {
  const res = await fetch("/api/live-videos");
  if (!res.ok) throw new Error("Failed to fetch live videos");
  return res.json();
};

function LiveVideoCard({ video }: { video: LiveVideoItem }) {
  const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
  const thumbnail = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url;
  const channelName = video.channelName || video.snippet.channelTitle;
  const scheduledTime = video.snippet.scheduledStartTime || video.snippet.publishedAt;
  
  const formatScheduledTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    
    if (diffInMs < 0) {
      return 'Started';
    }
    
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `In ${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
    }
    if (diffInHours > 0) {
      return `In ${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;
    }
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `In ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
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
        <Badge className="absolute top-2 right-2 bg-red-600 text-white border-red-700 animate-pulse">
          <Youtube className="h-3 w-3 mr-1" />
          LIVE
        </Badge>
        <Badge className="absolute bottom-2 left-2 bg-black/80 text-white border-0">
          <Calendar className="h-3 w-3 mr-1" />
          {formatScheduledTime(scheduledTime)}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {video.snippet.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span className="font-medium truncate">{channelName}</span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {video.snippet.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {new Date(scheduledTime).toLocaleString()}
          </span>
          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
        </div>
      </div>
    </Card>
  );
}

export default function LiveVideosPage() {
  const { data: videos, isLoading, isError, error } = useQuery({
    queryKey: ["liveVideos"],
    queryFn: fetchLiveVideos,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return (
    <>
      <Helmet>
        <title>Upcoming Live Streams | Roots Tech News</title>
        <meta name="description" content="Watch upcoming live streams from top AI & Tech YouTube channels. Stay updated with the latest live events and discussions." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Youtube className="h-10 w-10 text-red-500" />
              <h1 className="font-orbitron text-4xl font-bold text-foreground">
                Upcoming Live Streams
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Scheduled live events from top AI & Tech channels. Click on any video to watch on YouTube.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <span className="ml-4 text-lg text-muted-foreground">Loading live streams...</span>
            </div>
          ) : isError ? (
            <Card className="p-8 text-center">
              <p className="text-destructive mb-2">Error loading live streams</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Please try again later.'}
              </p>
            </Card>
          ) : videos && videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <LiveVideoCard key={video.id.videoId} video={video} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Youtube className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Upcoming Live Streams</h2>
              <p className="text-muted-foreground">
                There are no scheduled live streams at the moment. Check back soon for upcoming events!
              </p>
            </Card>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}













