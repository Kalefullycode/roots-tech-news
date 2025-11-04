import { useState, useEffect } from 'react';
import { VideoCard } from './VideoCard';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RefreshCw, Play } from 'lucide-react';
import { youtubeService } from '@/services/YouTubeService';
import type { YouTubeVideo } from '@/services/YouTubeService';

export function LiveVideoFeed() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<YouTubeVideo[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    { id: 'all', label: 'All', icon: '🎬' },
    { id: 'AI', label: 'AI News', icon: '🤖' },
    { id: 'Tech', label: 'Tech News', icon: '💻' },
    { id: 'Podcasts', label: 'Podcasts', icon: '🎙️' },
    { id: 'Business', label: 'Make Money with AI', icon: '💰' },
    { id: 'Tutorials', label: 'Tutorials', icon: '📚' },
  ];

  // Fetch videos on mount
  useEffect(() => {
    loadVideos();
  }, []);

  // Filter videos when category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos(videos.filter(v => 
        v.category.toLowerCase() === activeCategory.toLowerCase() ||
        v.category === activeCategory
      ));
    }
  }, [activeCategory, videos]);

  // Auto-rotation
  useEffect(() => {
    if (!autoRotate || filteredVideos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredVideos.length);
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(interval);
  }, [autoRotate, filteredVideos.length]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const fetchedVideos = await youtubeService.fetchAllVideos();
      setVideos(fetchedVideos);
      setFilteredVideos(fetchedVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayVideos = filteredVideos.slice(0, 12);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Play className="w-6 h-6 text-red-600" />
          <h2 className="text-3xl font-bold">LIVE AI NEWS</h2>
          <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={autoRotate ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAutoRotate(!autoRotate)}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
            Auto-rotating
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={loadVideos}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-muted-foreground mb-6">
        Latest AI developments, tech news, podcasts, and tutorials from YouTube & Spotify
      </p>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat.id)}
            className="whitespace-nowrap"
          >
            <span className="mr-1">{cat.icon}</span>
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-video bg-secondary animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {/* View All Button */}
          <div className="flex justify-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8"
              onClick={() => {
                // Navigate to YouTube page or show all videos
                window.location.href = '/videos';
              }}
            >
              View All AI Videos
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default LiveVideoFeed;

