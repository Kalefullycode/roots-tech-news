import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Eye, RefreshCw } from 'lucide-react';
import { youtubeService } from '@/services/YouTubeService';
import type { YouTubeVideo } from '@/services/YouTubeService';

const LiveAINewsVideos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ['All', 'AI', 'Tech', 'Podcasts', 'Business', 'Tutorials'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        // Clear cache to ensure we get latest videos
        youtubeService.clearCache();
        const fetchedVideos = await youtubeService.fetchAllVideos();
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
    // Refresh every 5 minutes to get latest AI and tech news
    const interval = setInterval(fetchVideos, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredVideos = selectedCategory === 'All' 
    ? videos.slice(0, 6)
    : videos.filter(v => {
        const categoryMap: Record<string, string[]> = {
          'AI': ['AI', 'aiNews', 'aiVsHuman'],
          'Tech': ['Tech', 'techNews'],
          'Podcasts': ['Podcasts', 'podcasts'],
          'Business': ['Business', 'makeMoneyWithAI'],
          'Tutorials': ['Tutorials', 'tutorials']
        };
        const categoryMatches = categoryMap[selectedCategory] || [selectedCategory];
        return categoryMatches.includes(v.category);
      }).slice(0, 6);

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
      'Business': 'Make Money with AI',
      'makeMoneyWithAI': 'Make Money with AI',
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
    if (diffInHours < 24) return 'Today';
    if (diffInHours < 48) return 'Yesterday';
    const days = Math.floor(diffInHours / 24);
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-gray-900/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Play className="w-8 h-8 text-red-500 fill-current" />
              <h2 className="font-orbitron text-3xl font-bold text-white">LIVE AI NEWS</h2>
              <Badge className="bg-red-600 text-white border-red-500 animate-pulse px-3 py-1">
                LIVE
              </Badge>
            </div>
            <p className="text-gray-400">
              Latest AI developments, tech news, podcasts, and tutorials from YouTube & Spotify
            </p>
          </div>

          <Button 
            variant="outline" 
            className="hidden md:flex items-center gap-2"
            onClick={() => {
              youtubeService.clearCache();
              const fetchVideos = async () => {
                setLoading(true);
                try {
                  const fetchedVideos = await youtubeService.fetchAllVideos();
                  setVideos(fetchedVideos);
                } catch (error) {
                  console.error('Error fetching videos:', error);
                } finally {
                  setLoading(false);
                }
              };
              fetchVideos();
            }}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-card-modern border border-card-border/60 overflow-hidden">
                <div className="aspect-video bg-secondary animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-secondary animate-pulse rounded" />
                  <div className="h-4 bg-secondary animate-pulse rounded w-3/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
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
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No videos found. Try selecting a different category.
              </div>
            )}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white"
            onClick={() => navigate('/videos')}
          >
            View All AI Videos
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LiveAINewsVideos;

