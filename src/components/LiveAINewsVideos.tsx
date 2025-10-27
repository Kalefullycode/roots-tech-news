import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Eye, RefreshCw } from 'lucide-react';

const LiveAINewsVideos = () => {
  const videos = [
    {
      title: 'AI Revolution: How ChatGPT Changed Everything',
      source: 'TechCrunch',
      category: 'AI News',
      thumbnail: '/placeholder.svg',
      duration: '12:34',
      views: '2.1M',
      date: 'Today',
      url: 'https://youtube.com'
    },
    {
      title: 'Make $10K/Month with These AI Tools',
      source: 'AI Business School',
      category: 'Make Money with AI',
      thumbnail: '/placeholder.svg',
      duration: '18:42',
      views: '890K',
      date: 'Yesterday',
      url: 'https://youtube.com'
    },
    {
      title: 'Lex Fridman: The Future of AGI',
      source: 'Lex Fridman Podcast',
      category: 'Podcasts',
      thumbnail: '/placeholder.svg',
      duration: '2:15:30',
      views: '1.5M',
      date: '2 days ago',
      url: 'https://youtube.com'
    },
    {
      title: 'Tech News Roundup: October 2025',
      source: 'The Verge',
      category: 'Tech News',
      thumbnail: '/placeholder.svg',
      duration: '8:52',
      views: '450K',
      date: 'Today',
      url: 'https://youtube.com'
    },
    {
      title: 'AI vs Human Programmers: Surprising Results',
      source: 'Fireship',
      category: 'AI vs Human',
      thumbnail: '/placeholder.svg',
      duration: '6:23',
      views: '3.2M',
      date: 'Yesterday',
      url: 'https://youtube.com'
    },
    {
      title: 'Building Apps with Claude: Full Tutorial',
      source: 'Code with Antonio',
      category: 'Tutorials',
      thumbnail: '/placeholder.svg',
      duration: '45:12',
      views: '680K',
      date: '3 days ago',
      url: 'https://youtube.com'
    }
  ];

  const categories = ['All', 'AI News', 'Tech News', 'Podcasts', 'Make Money with AI', 'Tutorials', 'AI vs Human'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredVideos = selectedCategory === 'All' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'AI News': 'bg-blue-600',
      'Tech News': 'bg-green-600',
      'Podcasts': 'bg-purple-600',
      'Make Money with AI': 'bg-yellow-600',
      'Tutorials': 'bg-pink-600',
      'AI vs Human': 'bg-red-600'
    };
    return colors[category] || 'bg-gray-600';
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

          <Button variant="outline" className="hidden md:flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Auto-rotating
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredVideos.map((video, index) => (
            <Card
              key={index}
              className="bg-card-modern border border-card-border/60 overflow-hidden hover:border-red-600 transition-all cursor-pointer group"
              onClick={() => window.open(video.url, '_blank')}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1 fill-current" />
                  </div>
                </div>
                
                {/* Duration */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs font-bold">
                  {video.duration}
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <Badge className={`${getCategoryColor(video.category)} text-white border-0`}>
                    {video.category}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-roboto font-bold text-foreground mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="font-medium text-foreground">{video.source}</span>
                  <span>{video.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-xs text-muted-foreground">{video.views} views</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white">
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

