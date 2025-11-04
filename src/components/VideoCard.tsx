import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock } from 'lucide-react';
import { YouTubeVideo } from '@/services/YouTubeService';
import { generatePlaceholderThumbnail } from '@/lib/videoThumbnails';

interface VideoCardProps {
  video: YouTubeVideo;
}

export function VideoCard({ video }: VideoCardProps) {
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return 'Today';
    if (diffInHours < 48) return 'Yesterday';
    const days = Math.floor(diffInHours / 24);
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'AI': 'bg-blue-500',
      'Tech': 'bg-green-500',
      'Podcasts': 'bg-purple-500',
      'Business': 'bg-yellow-500',
      'Tutorials': 'bg-pink-500',
      'Innovation': 'bg-indigo-500',
      'Startups': 'bg-orange-500',
      // Legacy category names for backward compatibility
      'aiNews': 'bg-blue-500',
      'techNews': 'bg-green-500',
      'podcasts': 'bg-purple-500',
      'makeMoneyWithAI': 'bg-yellow-500',
      'tutorials': 'bg-pink-500',
      'aiVsHuman': 'bg-red-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'AI': 'AI News',
      'Tech': 'Tech News',
      'Podcasts': 'Podcasts',
      'Business': 'Make Money with AI',
      'Tutorials': 'Tutorials',
      'Innovation': 'Innovation',
      'Startups': 'Startups',
      // Legacy category names for backward compatibility
      'aiNews': 'AI News',
      'techNews': 'Tech News',
      'podcasts': 'Podcasts',
      'makeMoneyWithAI': 'Make Money with AI',
      'tutorials': 'Tutorials',
      'aiVsHuman': 'AI vs Human'
    };
    return labels[category] || category;
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-card">
      <a 
        href={video.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-secondary overflow-hidden">
          <img
            src={video.thumbnailHQ || video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              // Fallback if thumbnail fails to load
              const target = e.target as HTMLImageElement;
              
              // Try original thumbnail first
              if (target.src !== video.thumbnail && video.thumbnail) {
                target.src = video.thumbnail;
                return;
              }
              
              // Generate placeholder thumbnail as last resort
              try {
                const placeholder = generatePlaceholderThumbnail(
                  video.title,
                  video.category
                );
                if (placeholder) {
                  target.src = placeholder;
                } else {
                  target.src = '/placeholder.svg';
                }
              } catch (error) {
                console.warn('Failed to generate placeholder thumbnail:', error);
                target.src = '/placeholder.svg';
              }
            }}
          />
          
          {/* Duration badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {video.duration}
            </div>
          )}
          
          {/* Category badge */}
          <Badge className={`absolute top-2 left-2 ${getCategoryColor(video.category)} text-white border-0`}>
            {getCategoryLabel(video.category)}
          </Badge>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-4">
          <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="font-medium">{video.channelTitle || video.channelName}</span>
            <span>{getRelativeTime(video.publishedAt)}</span>
          </div>
          
          {/* View count - only show if available */}
          {video.viewCount && (
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {video.viewCount}
              </div>
            </div>
          )}
        </div>
      </a>
    </Card>
  );
}

export default VideoCard;
