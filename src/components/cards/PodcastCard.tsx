import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, Clock } from "lucide-react";
import { PodcastEpisode } from "@/services/PodcastService";

interface PodcastCardProps {
  podcast: PodcastEpisode;
}

const PodcastCard = ({ podcast }: PodcastCardProps) => {
  return (
    <Card 
      className="p-5 bg-card-modern border border-card-border/60 hover:border-purple-500/50 transition-all hover-lift group"
    >
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-24 h-24 bg-muted rounded-lg overflow-hidden">
          <img 
            src={podcast.thumbnail}
            alt={podcast.podcastName}
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
              {podcast.category}
            </Badge>
            {podcast.duration && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {podcast.duration}
              </div>
            )}
          </div>

          <h3 className="font-orbitron text-base font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-purple-500 transition-colors">
            {podcast.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-2">
            {podcast.podcastName}
          </p>

          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {podcast.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {new Date(podcast.publishedAt).toLocaleDateString()}
            </span>
            <Button 
              size="sm" 
              className="bg-purple-500 hover:bg-purple-600"
              onClick={() => window.open(podcast.url, '_blank')}
            >
              <Play className="h-3 w-3 mr-1" />
              Listen
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PodcastCard;

