import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, X, Clock, Eye, ExternalLink } from 'lucide-react';
import { AggregatedVideo } from '@/types/video';
import { getRelativeTime, getCategoryColor } from '@/utils/videoUtils';
import ReactPlayer from 'react-player';

interface HeroSectionProps {
  featuredVideo: AggregatedVideo | null;
  onClose?: () => void;
}

export function HeroSection({ featuredVideo, onClose }: HeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!featuredVideo) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-primary/20 via-background to-primary/10 rounded-lg flex items-center justify-center border border-card-border/60">
        <div className="text-center">
          <Play className="h-16 w-16 text-primary/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No featured video available</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden bg-card-modern border border-card-border/60 relative group">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="relative aspect-video bg-muted">
        {isPlaying ? (
          <ReactPlayer
            url={featuredVideo.url}
            width="100%"
            height="100%"
            playing={isPlaying}
            controls
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <>
            <img
              src={featuredVideo.thumbnailHQ || featuredVideo.thumbnail}
              alt={featuredVideo.title}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 rounded-full p-6 h-auto"
                onClick={() => setIsPlaying(true)}
              >
                <Play className="h-12 w-12 text-white fill-white" />
              </Button>
            </div>
          </>
        )}

        {/* Overlay info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className={`${getCategoryColor(featuredVideo.category as any)} border`}>
                  {featuredVideo.category}
                </Badge>
                {featuredVideo.topic && (
                  <Badge variant="outline">{featuredVideo.topic}</Badge>
                )}
                {featuredVideo.duration && (
                  <Badge variant="secondary" className="bg-black/50 text-white border-0">
                    <Clock className="h-3 w-3 mr-1" />
                    {featuredVideo.duration}
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2">
                {featuredVideo.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="font-medium text-foreground">{featuredVideo.channelName}</span>
                <span>•</span>
                <span>{featuredVideo.source}</span>
                {featuredVideo.viewCount && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {featuredVideo.viewCount}
                    </span>
                  </>
                )}
                <span>•</span>
                <span>{getRelativeTime(featuredVideo.publishedAt)}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {featuredVideo.description}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => window.open(featuredVideo.url, '_blank', 'noopener,noreferrer')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Watch on YouTube
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

