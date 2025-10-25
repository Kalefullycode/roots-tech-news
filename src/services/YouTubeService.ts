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
    { id: 'UCBJycsmduvYEL83R_U4JriQ', name: 'Marques Brownlee', category: 'Gadgets' },
    { id: 'UCXuqSBlHAE6Xw-yeJA0Tunw', name: 'Linus Tech Tips', category: 'Tech' },
    { id: 'UCkRfGP_UrWyEGH3hYcVQEDQ', name: 'Two Minute Papers', category: 'AI' },
    { id: 'UCbfYPyITQ-7l4upoX8nvctg', name: '2veritasium', category: 'Innovation' },
    { id: 'UCsooa4yRKGN_zEE8iknghZA', name: 'TED-Ed', category: 'Innovation' },
    { id: 'UC6107grRI4m0o2-emgoDnAA', name: 'SmarterEveryDay', category: 'Innovation' },
    { id: 'UCR1IuLEqb6UEA_zQ81kwXfg', name: 'Real Engineering', category: 'Innovation' },
    { id: 'UCUHW94eEFW7hkUMVaZz4eDg', name: 'Lex Fridman', category: 'AI' },
    { id: 'UCbmNph6atAoGfqLoCL_duAg', name: 'Computerphile', category: 'Tech' },
    { id: 'UCV0qA-eDDICsRR9rPcnG7tw', name: 'Joma Tech', category: 'Tech' },
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
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      const videos = this.parseYouTubeRSS(data.contents, channelName, category);
      
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

    return allVideos.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
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

    return allVideos.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export default new YouTubeService();

