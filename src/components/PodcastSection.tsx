import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Podcast, Play, ExternalLink, Clock } from "lucide-react";
import PodcastService, { PodcastEpisode } from "@/services/PodcastService";
import { Skeleton } from "@/components/ui/skeleton";

const PodcastSection = () => {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const fetchedEpisodes = await PodcastService.fetchAllPodcasts();
        setEpisodes(fetchedEpisodes.slice(0, 6)); // Show top 6 episodes
      } catch (error) {
        console.error("Failed to fetch podcast episodes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  if (isLoading) {
    return (
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <Podcast className="h-8 w-8 text-purple-500" />
          <h2 className="font-orbitron text-3xl font-bold">Latest Podcasts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Podcast className="h-8 w-8 text-purple-500" />
          <h2 className="font-orbitron text-3xl font-bold text-foreground">
            Latest Tech Podcasts
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {episodes.map((episode) => (
          <Card 
            key={episode.id}
            className="p-5 bg-card-modern border border-card-border/60 hover:border-purple-500/50 transition-all hover-lift group"
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-24 h-24 bg-muted rounded-lg overflow-hidden">
                <img 
                  src={episode.thumbnail}
                  alt={episode.podcastName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                    {episode.category}
                  </Badge>
                  {episode.duration && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {episode.duration}
                    </div>
                  )}
                </div>

                <h3 className="font-orbitron text-base font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-purple-500 transition-colors">
                  {episode.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {episode.podcastName}
                </p>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {episode.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(episode.publishedAt).toLocaleDateString()}
                  </span>
                  <Button 
                    size="sm" 
                    className="bg-purple-500 hover:bg-purple-600"
                    onClick={() => window.open(episode.url, '_blank')}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Listen
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PodcastSection;

