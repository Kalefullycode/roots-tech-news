import ContentFilter from './ContentFilter';

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

class YouTubeService {
  private cache = new Map<string, { data: YouTubeVideo[]; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  // Popular Tech YouTube Channels RSS feeds
  private readonly YOUTUBE_CHANNELS = [
    // Gadgets & Reviews
    { id: 'UCBJycsmduvYEL83R_U4JriQ', name: 'Marques Brownlee', category: 'Gadgets' },
    { id: 'UCXuqSBlHAE6Xw-yeJA0Tunw', name: 'Linus Tech Tips', category: 'Tech' },
    { id: 'UCl2mFZoRqjw_ELax4Yisf6w', name: 'Unbox Therapy', category: 'Gadgets' },
    { id: 'UCsTcErHg8oDvUnTzoqsYeNw', name: 'Mrwhosetheboss', category: 'Gadgets' },
    
    // AI & Machine Learning
    { id: 'UCbfYPyITQ-7l4upoX8nvctg', name: 'Two Minute Papers', category: 'AI' },
    { id: 'UCUHW94eEFW7hkUMVaZz4eDg', name: 'Lex Fridman', category: 'AI' },
    { id: 'UC5zx8Owijmv-bbhAK6Z9apg', name: 'AI Explained', category: 'AI' },
    { id: 'UCbfYPyITQ-7l4upoX8nvctg', name: 'Yannic Kilcher', category: 'AI' },
    
    // Tech News & Analysis
    { id: 'UCOmcA3f_RrH6b9NmcNa4tdg', name: 'The Verge', category: 'Tech' },
    { id: 'UCddiUEpeqJcYeBxX1IVBKvQ', name: 'CNET', category: 'Tech' },
    { id: 'UC9-y-6csu5WGm29I7JiwpnA', name: 'Engadget', category: 'Tech' },
    { id: 'UCpljFlcTMoeller-C-4ra6hw', name: 'TechLinked', category: 'Tech' },
    
    // Science & Innovation
    { id: 'UCHnyfMqiRRG1u-2MsSQLbXA', name: 'Veritasium', category: 'Innovation' },
    { id: 'UCsooa4yRKGN_zEE8iknghZA', name: 'TED-Ed', category: 'Innovation' },
    { id: 'UC6107grRI4m0o2-emgoDnAA', name: 'SmarterEveryDay', category: 'Innovation' },
    { id: 'UCR1IuLEqb6UEA_zQ81kwXfg', name: 'Real Engineering', category: 'Innovation' },
    
    // Programming & CS
    { id: 'UCbmNph6atAoGfqLoCL_duAg', name: 'Computerphile', category: 'Tech' },
    { id: 'UCV0qA-eDDICsRR9rPcnG7tw', name: 'Joma Tech', category: 'Tech' },
    { id: 'UC8butISFwT-Wl7EV0hUK0BQ', name: 'freeCodeCamp', category: 'Tech' },
    
    // Startups & Business
    { id: 'UCCjyq_K1Xwfg8Lndy7lKMpA', name: 'Y Combinator', category: 'Startups' },
    { id: 'UCV_qLHbFo_E-_bBW1HdvJGg', name: 'Startup Stories', category: 'Startups' },
  ];

  private parseYouTubeRSS(xmlText: string, channelName: string, category: string): YouTubeVideo[] {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const entries = xmlDoc.querySelectorAll('entry');
      
      const videos: YouTubeVideo[] = [];
      
      entries.forEach((entry, index) => {
        if (index >= 5) return; // Limit to 5 videos per channel
        
        const videoId = entry.querySelector('yt\\:videoId, videoId')?.textContent || '';
        const title = entry.querySelector('title')?.textContent || 'Untitled Video';
        const description = entry.querySelector('media\\:description, description')?.textContent || '';
        const published = entry.querySelector('published')?.textContent || new Date().toISOString();
        
        // Get thumbnail
        const thumbnail = entry.querySelector('media\\:thumbnail')?.getAttribute('url') || 
                         `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
        
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

