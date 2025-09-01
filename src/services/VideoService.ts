interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
  viewCount?: string;
  category: string;
}

interface YouTubeChannel {
  id: string;
  name: string;
  category: string;
}

class VideoService {
  private cache = new Map<string, { data: YouTubeVideo[]; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  private readonly CHANNELS: YouTubeChannel[] = [
    // Design Channels
    { id: 'UCVyRiMvfLNMA1UPlDPzG5Ow', name: 'The Futur', category: 'Design' },
    { id: 'UCeB_OpLspKJGiKv1CYkWFFw', name: 'AJ&Smart', category: 'Design' },
    { id: 'UC8xTHK2YWG7_5hg1cWu6b8w', name: 'CharliMarieTV', category: 'Design' },
    
    // Coding Channels
    { id: 'UC29ju8bIPH5as8OGnQzwJyA', name: 'Traversy Media', category: 'Coding' },
    { id: 'UC8butISFwT-Wl7EV0hUK0BQ', name: 'FreeCodeCamp', category: 'Coding' },
    { id: 'UCW5YeuERMmlnqo4oq8vwUpg', name: 'The Net Ninja', category: 'Coding' },
    
    // AI Channels
    { id: 'UCbfYPyITQ-7l4upoX8nvctg', name: 'Two Minute Papers', category: 'AI' },
    { id: 'UCSHZKyawb77ixDdsGog4iWA', name: 'Lex Fridman', category: 'AI' },
    { id: 'UCNJ1Ymd5yFuUPtn21xtRbbw', name: 'AI Explained', category: 'AI' },
    
    // Tech Culture
    { id: 'UCBJycsmduvYEL83R_U4JriQ', name: 'MKBHD', category: 'Culture' },
    { id: 'UCsTcErHg8oDvUnTzoqsYeNw', name: 'Unbox Therapy', category: 'Culture' },
    { id: 'UCXGgrKt94gR6lmN4aN3mYTg', name: 'Austin Evans', category: 'Culture' }
  ];

  // Fallback videos for when API is not available
  private readonly FALLBACK_VIDEOS: YouTubeVideo[] = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'The Future of AI: What to Expect in 2024',
      description: 'Exploring the latest breakthroughs in artificial intelligence and machine learning.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
      channelTitle: 'AI Explained',
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      category: 'AI',
      duration: '12:34',
      viewCount: '1.2M'
    },
    {
      id: 'ScMzIvxBSi4',
      title: 'Building Modern Web Apps with React',
      description: 'Complete tutorial on creating responsive web applications.',
      thumbnail: 'https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg',
      channelTitle: 'Traversy Media',
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      category: 'Coding',
      duration: '45:12',
      viewCount: '856K'
    },
    {
      id: 'ZSPZeMgvDXs',
      title: 'Design Systems: The Complete Guide',
      description: 'How to create and maintain consistent design systems.',
      thumbnail: 'https://img.youtube.com/vi/ZSPZeMgvDXs/hqdefault.jpg',
      channelTitle: 'The Futur',
      publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      category: 'Design',
      duration: '28:45',
      viewCount: '432K'
    },
    {
      id: 'LdxhiX0iCbY',
      title: 'The Latest in Tech Hardware',
      description: 'Reviewing the newest smartphones, laptops, and gadgets.',
      thumbnail: 'https://img.youtube.com/vi/LdxhiX0iCbY/hqdefault.jpg',
      channelTitle: 'MKBHD',
      publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      category: 'Culture',
      duration: '15:23',
      viewCount: '2.1M'
    }
  ];

  async fetchLatestVideos(): Promise<YouTubeVideo[]> {
    const cacheKey = 'latest_videos';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // In a real implementation, you would use the YouTube Data API
      // For now, we'll return fallback videos
      const videos = this.FALLBACK_VIDEOS;
      
      this.cache.set(cacheKey, { data: videos, timestamp: Date.now() });
      return videos;
    } catch (error) {
      console.warn('Failed to fetch videos from YouTube API:', error);
      return this.FALLBACK_VIDEOS;
    }
  }

  async fetchVideosByCategory(category: string): Promise<YouTubeVideo[]> {
    const allVideos = await this.fetchLatestVideos();
    return allVideos.filter(video => 
      video.category.toLowerCase() === category.toLowerCase()
    );
  }

  async fetchVideosByChannel(channelId: string): Promise<YouTubeVideo[]> {
    const channel = this.CHANNELS.find(c => c.id === channelId);
    if (!channel) return [];

    const allVideos = await this.fetchLatestVideos();
    return allVideos.filter(video => 
      video.channelTitle.toLowerCase() === channel.name.toLowerCase()
    );
  }

  getCategories(): string[] {
    return Array.from(new Set(this.CHANNELS.map(c => c.category))).sort();
  }

  getChannels(): YouTubeChannel[] {
    return this.CHANNELS;
  }

  getChannelsByCategory(category: string): YouTubeChannel[] {
    return this.CHANNELS.filter(channel => 
      channel.category.toLowerCase() === category.toLowerCase()
    );
  }

  generateThumbnailUrl(videoId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string {
    const qualityMap = {
      default: 'default',
      hq: 'hqdefault',
      mq: 'mqdefault', 
      sd: 'sddefault',
      maxres: 'maxresdefault'
    };
    
    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
  }

  getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  formatDuration(duration?: string): string {
    if (!duration) return '';
    
    // Convert ISO 8601 duration to readable format
    // For simplicity, we'll just return the duration as-is for fallback videos
    return duration;
  }

  formatViewCount(viewCount?: string): string {
    if (!viewCount) return '';
    
    const num = parseInt(viewCount.replace(/[^\d]/g, ''));
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`;
    }
    return `${num} views`;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export default new VideoService();