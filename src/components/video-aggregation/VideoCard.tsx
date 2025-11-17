import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Play, 
  Clock, 
  Eye, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  ExternalLink,
  MoreVertical,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle
} from 'lucide-react';
import { AggregatedVideo, ViewMode } from '@/types/video';
import { getRelativeTime, getCategoryColor } from '@/utils/videoUtils';
import { addToWatchLater, removeFromWatchLater, isInWatchLater as checkWatchLater } from '@/utils/watchLater';
import { shareVideo, copyVideoLink, shareViaWebAPI } from '@/utils/shareUtils';
import { toast } from 'sonner';

interface VideoCardProps {
  video: AggregatedVideo;
  viewMode?: ViewMode;
  onPlay?: (video: AggregatedVideo) => void;
}

export function VideoCard({ video, viewMode = 'grid', onPlay }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInWatchLater, setIsInWatchLater] = useState(checkWatchLater(video.id));

  const handleWatchLater = () => {
    if (isInWatchLater) {
      removeFromWatchLater(video.id);
      setIsInWatchLater(false);
      toast.success('Removed from Watch Later');
    } else {
      addToWatchLater(video);
      setIsInWatchLater(true);
      toast.success('Added to Watch Later');
    }
  };

  // Update watch later status when video changes
  useEffect(() => {
    setIsInWatchLater(checkWatchLater(video.id));
  }, [video.id]);

  const handleShare = async (platform?: 'twitter' | 'facebook' | 'linkedin' | 'reddit') => {
    if (platform) {
      shareVideo(video, platform);
    } else {
      // Try Web Share API first
      const shared = await shareViaWebAPI(video);
      if (!shared) {
        // Fallback to copy link
        const copied = await copyVideoLink(video);
        if (copied) {
          toast.success('Link copied to clipboard!');
        }
      }
    }
  };

  const handleClick = () => {
    if (onPlay) {
      onPlay(video);
    } else {
      window.open(video.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (viewMode === 'list') {
    return (
      <Card 
        className="overflow-hidden bg-card-modern border border-card-border/60 hover:border-primary/50 transition-all cursor-pointer group"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex gap-4 p-4">
          {/* Thumbnail */}
          <div className="relative w-48 h-32 flex-shrink-0 bg-muted overflow-hidden rounded-md">
            <img 
              src={video.thumbnailHQ || video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-primary rounded-full p-3">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
            {video.duration && (
              <Badge className="absolute bottom-2 right-2 bg-black/80 text-white border-0 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {video.duration}
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleWatchLater(); }}>
                    {isInWatchLater ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 mr-2" />
                        Remove from Watch Later
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 mr-2" />
                        Add to Watch Later
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShare('twitter'); }}>
                    <Twitter className="h-4 w-4 mr-2" />
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShare('facebook'); }}>
                    <Facebook className="h-4 w-4 mr-2" />
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShare('linkedin'); }}>
                    <Linkedin className="h-4 w-4 mr-2" />
                    Share on LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShare('reddit'); }}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Share on Reddit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShare(); }}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
              <span className="font-medium">{video.channelName}</span>
              <span>•</span>
              <span>{video.source}</span>
              {video.viewCount && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {video.viewCount}
                  </span>
                </>
              )}
              <span>•</span>
              <span>{getRelativeTime(video.publishedAt)}</span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {video.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`${getCategoryColor(video.category as any)} border text-xs`}>
                {video.category}
              </Badge>
              {video.topic && (
                <Badge variant="outline" className="text-xs">
                  {video.topic}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card 
      className="overflow-hidden bg-card-modern border border-card-border/60 hover:border-primary/50 transition-all hover-lift cursor-pointer group"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img 
          src={video.thumbnailHQ || video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-primary rounded-full p-4">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          <Badge className={`${getCategoryColor(video.category as any)} border text-xs`}>
            {video.category}
          </Badge>
        </div>

        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {video.duration && (
            <Badge className="bg-black/80 text-white border-0 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {video.duration}
            </Badge>
          )}
        </div>

        {/* Actions overlay */}
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-black/80 hover:bg-black/90"
            onClick={(e) => {
              e.stopPropagation();
              handleWatchLater();
            }}
          >
            {isInWatchLater ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-black/80 hover:bg-black/90"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleShare('twitter')}>
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('facebook')}>
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('reddit')}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Reddit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare()}>
                <Share2 className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span className="font-medium truncate">{video.channelName}</span>
          {video.viewCount && (
            <span className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Eye className="h-3 w-3" />
              {video.viewCount}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{video.source}</span>
          <span>{getRelativeTime(video.publishedAt)}</span>
        </div>
      </div>
    </Card>
  );
}

