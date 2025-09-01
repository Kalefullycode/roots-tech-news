import { useState } from 'react';
import { Play, Clock, Eye, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
// Removed ReactPlayer import - using iframe instead
import VideoService from '@/services/VideoService';

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
  category: string;
  featured?: boolean;
}

const VideoCard = ({
  id,
  title,
  description,
  thumbnail,
  channelTitle,
  publishedAt,
  duration,
  viewCount,
  category,
  featured = false
}: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const embedUrl = VideoService.getEmbedUrl(id);
  const formattedDuration = VideoService.formatDuration(duration);
  const formattedViews = VideoService.formatViewCount(viewCount);
  
  const publishedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handlePlayClick = () => {
    setShowPlayer(true);
    setIsPlaying(true);
  };

  const handleExternalLink = () => {
    window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={`${
      featured ? 'md:col-span-2 lg:col-span-2' : ''
    } bg-card-modern border border-card-border/60 hover:border-primary/70 hover:shadow-card-elevated transition-all duration-300 overflow-hidden group backdrop-blur-sm`}>
      
      {/* Thumbnail Container */}
      <div className={`relative overflow-hidden ${featured ? 'h-80' : 'h-48'} rounded-t-lg group-hover:scale-[1.02] transition-transform duration-300`}>
        <img 
          src={thumbnail} 
          alt={`${title} video thumbnail`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay with play button */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Dialog open={showPlayer} onOpenChange={setShowPlayer}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                onClick={handlePlayClick}
                className="bg-primary/90 hover:bg-primary text-primary-foreground rounded-full h-16 w-16 p-0 shadow-xl backdrop-blur-sm border border-primary/20"
              >
                <Play className="h-6 w-6 ml-1" fill="currentColor" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full h-[80vh] p-0 bg-background/95 backdrop-blur-sm">
              <div className="w-full h-full rounded-lg overflow-hidden">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Duration Badge */}
        {formattedDuration && (
          <Badge className="absolute bottom-3 right-3 bg-background/90 text-foreground font-mono text-xs px-2 py-1 rounded backdrop-blur-sm border border-border/30">
            <Clock className="h-3 w-3 mr-1" />
            {formattedDuration}
          </Badge>
        )}
        
        {/* Category Badge */}
        <Badge className="absolute top-3 left-3 bg-primary/95 text-primary-foreground font-orbitron font-semibold text-xs px-3 py-1.5 rounded-full border border-primary/20 shadow-md backdrop-blur-sm">
          {category}
        </Badge>
        
        {featured && (
          <Badge className="absolute top-3 right-3 bg-accent/95 text-accent-foreground font-orbitron font-semibold text-xs px-3 py-1.5 rounded-full border border-accent/20 shadow-md backdrop-blur-sm">
            FEATURED
          </Badge>
        )}
      </div>
      
      {/* Content */}
      <div className={`p-6 ${featured ? 'p-8' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className={`font-orbitron font-bold line-clamp-2 text-foreground leading-tight ${
            featured ? 'text-xl' : 'text-lg'
          }`}>
            {title}
          </h3>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExternalLink}
            className="ml-2 text-muted-foreground hover:text-primary p-2"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        
        <p className={`text-muted-foreground font-roboto mb-4 line-clamp-2 leading-relaxed ${
          featured ? 'text-base' : 'text-sm'
        }`}>
          {description}
        </p>
        
        {/* Channel and Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span className="font-roboto font-medium">{channelTitle}</span>
          {formattedViews && (
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formattedViews}
            </span>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <span className="text-sm text-muted-foreground font-roboto">
            {publishedDate}
          </span>
          
          <Button
            variant="ghost"
            onClick={handlePlayClick}
            className="text-sm text-accent font-roboto font-medium hover:text-accent-glow transition-colors duration-300 flex items-center gap-2 h-auto p-0"
          >
            <Play className="h-3 w-3" fill="currentColor" />
            Watch Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;