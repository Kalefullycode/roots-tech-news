import ContentFilter from './ContentFilter';
import { YOUTUBE_CONFIG } from '@/config/youtube';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelName: string;
  publishedAt: string;
  url: string;
  category: string;
}

interface YouTubeChannel {
  id: string;
  name: string;
  category: string;
}

class YouTubeService {
  private cache = new Map<string, { data: YouTubeVideo[]; timestamp: number }>();
  private readonly CACHE_DURATION = YOUTUBE_CONFIG.refreshInterval;

  // Flatten all channels from config into a single array with categories
  private readonly YOUTUBE_CHANNELS: YouTubeChannel[] = [
    // AI News channels
    ...YOUTUBE_CONFIG.channels.aiNews.map(ch => ({ ...ch, category: 'AI' })),
    // Tech News channels
    ...YOUTUBE_CONFIG.channels.techNews.map(ch => ({ ...ch, category: 'Tech' })),
    // Podcast channels
    ...YOUTUBE_CONFIG.channels.podcasts.map(ch => ({ ...ch, category: 'Podcasts' })),
    // Tutorial channels
    ...YOUTUBE_CONFIG.channels.tutorials.map(ch => ({ ...ch, category: 'Tutorials' })),
    // Make Money with AI channels
    ...YOUTUBE_CONFIG.channels.makeMoneyWithAI.map(ch => ({ ...ch, category: 'Business' })),
    // AI vs Human channels
    ...YOUTUBE_CONFIG.channels.aiVsHuman.map(ch => ({ ...ch, category: 'AI' })),
  ];

  private parseYouTubeRSS(xmlText: string, channelName: string, category: string): YouTubeVideo[] {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const entries = xmlDoc.querySelectorAll('entry');
      
      const videos: YouTubeVideo[] = [];
      
      entries.forEach((entry, index) => {
        if (index >= YOUTUBE_CONFIG.maxResults) return; // Limit based on config
        
        const videoId = entry.querySelector('yt\\:videoId, videoId')?.textContent || '';
        const title = entry.querySelector('title')?.textContent || 'Untitled Video';
        const description = entry.querySelector('media\\:description, description')?.textContent || '';
        const published = entry.querySelector('published')?.textContent || new Date().toISOString();
        
        // Get thumbnail with quality from config
        const thumbnail = entry.querySelector('media\\:thumbnail')?.getAttribute('url') || 
                         `https://i.ytimg.com/vi/${videoId}/${YOUTUBE_CONFIG.thumbnailQuality}.jpg`;
        
        if (videoId) {
          videos.push({
            id: videoId,
            title,
            description: description.substring(0, 200),
            thumbnail,
            channelName,
            publishedAt: published,
            url: `https://www.youtube.com/watch?v=${videoId}`,
            category
          });
        }
      });
      
      return videos;
    } catch (error) {
      console.warn('Failed to parse YouTube RSS:', error);
      return [];
    }
  }

  async fetchChannelVideos(channelId: string, channelName: string, category: string): Promise<YouTubeVideo[]> {
    const cacheKey = channelId;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      // Use our Cloudflare Pages Function RSS proxy
      const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(rssUrl)}`;
      
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'application/xml, application/atom+xml, text/xml',
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Get XML content directly (no JSON wrapper)
      const xmlText = await response.text();
      const videos = this.parseYouTubeRSS(xmlText, channelName, category);
      
      this.cache.set(cacheKey, { data: videos, timestamp: Date.now() });
      return videos;
    } catch (error) {
      console.warn(`Failed to fetch YouTube channel ${channelName}:`, error);
      return [];
    }
  }

  async fetchAllVideos(): Promise<YouTubeVideo[]> {
    const allVideos: YouTubeVideo[] = [];
    
    const fetchPromises = this.YOUTUBE_CHANNELS.map(channel => 
      this.fetchChannelVideos(channel.id, channel.name, channel.category)
    );

    const results = await Promise.allSettled(fetchPromises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allVideos.push(...result.value);
      }
    });

    // Filter out non-AI/tech content
    const filteredVideos = ContentFilter.filterAndSort(allVideos);

    return filteredVideos.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getFeaturedVideo(): Promise<YouTubeVideo | null> {
    try {
      const videos = await this.fetchAllVideos();
      return videos.length > 0 ? videos[0] : null;
    } catch (error) {
      console.error('Failed to fetch featured video:', error);
      return null;
    }
  }

  async fetchByCategory(category: string): Promise<YouTubeVideo[]> {
    const categoryChannels = this.YOUTUBE_CHANNELS.filter(channel => 
      channel.category.toLowerCase() === category.toLowerCase()
    );

    const allVideos: YouTubeVideo[] = [];
    
    const fetchPromises = categoryChannels.map(channel => 
      this.fetchChannelVideos(channel.id, channel.name, channel.category)
    );

    const results = await Promise.allSettled(fetchPromises);
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        allVideos.push(...result.value);
      }
    });

    // Filter out non-AI/tech content
    const filteredVideos = ContentFilter.filterAndSort(allVideos);

    return filteredVideos.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export default new YouTubeService();

