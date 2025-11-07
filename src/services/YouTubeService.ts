import { YOUTUBE_CONFIG } from '@/config/youtube-config';

// Extended interface with new fields from YouTube API
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailHQ?: string; // High quality thumbnail
  channelName: string;
  channelTitle?: string; // Alias for channelName
  publishedAt: string;
  duration?: string; // Formatted duration (e.g., "15:30")
  viewCount?: string; // Formatted view count (e.g., "1.2M views")
  category: string;
  url: string;
}

interface YouTubeSearchItem {
  id: {
    videoId: string;
  };
}

interface YouTubeVideoDetails {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
      maxresdefault?: { url: string };
    };
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
}

class YouTubeService {
  private cache: Map<string, { data: YouTubeVideo[]; timestamp: number }> = new Map();

  async fetchChannelVideos(
    channelId: string,
    channelName: string,
    category: string,
    maxResults: number = 10
  ): Promise<YouTubeVideo[]> {
    const cacheKey = `${channelId}-${category}`;
    const cached = this.cache.get(cacheKey);

    // Use cache if less than refresh interval old
    if (cached && Date.now() - cached.timestamp < YOUTUBE_CONFIG.refreshInterval) {
      return cached.data;
    }

    // Check if API key is available
    if (!YOUTUBE_CONFIG.apiKey) {
      // Only log once per session to reduce console noise
      if (!(window as any).__youtubeApiKeyWarningShown) {
        if (import.meta.env.DEV) {
          console.warn('YouTube API key not configured. Falling back to RSS feeds.');
        }
        (window as any).__youtubeApiKeyWarningShown = true;
      }
      return this.fetchChannelVideosRSS(channelId, channelName, category);
    }

    try {
      // Step 1: Get channel's latest videos
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
        `key=${YOUTUBE_CONFIG.apiKey}&` +
        `channelId=${channelId}&` +
        `part=snippet&` +
        `order=date&` +
        `type=video&` +
        `maxResults=${maxResults}`
      );

      if (!searchResponse.ok) {
        throw new Error(`YouTube API error: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      const videoIds = searchData.items
        .map((item: YouTubeSearchItem) => item.id.videoId)
        .filter((id: string) => id)
        .join(',');

      if (!videoIds) {
        return cached?.data || [];
      }

      // Step 2: Get video details (duration, views)
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?` +
        `key=${YOUTUBE_CONFIG.apiKey}&` +
        `id=${videoIds}&` +
        `part=snippet,contentDetails,statistics`
      );

      if (!detailsResponse.ok) {
        throw new Error(`YouTube API error: ${detailsResponse.status}`);
      }

      const detailsData = await detailsResponse.json();

      // Step 3: Process and format videos
      const videos: YouTubeVideo[] = detailsData.items.map((video: YouTubeVideoDetails) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description || '',
        thumbnail: this.getBestThumbnail(video.snippet.thumbnails),
        thumbnailHQ: video.snippet.thumbnails.maxresdefault?.url ||
                     video.snippet.thumbnails.high?.url,
        channelName,
        channelTitle: channelName,
        publishedAt: video.snippet.publishedAt,
        duration: this.formatDuration(video.contentDetails.duration),
        viewCount: this.formatViewCount(video.statistics.viewCount),
        category,
        url: `https://www.youtube.com/watch?v=${video.id}`
      }));

      // Cache the results
      this.cache.set(cacheKey, {
        data: videos,
        timestamp: Date.now()
      });

      return videos;
    } catch (error) {
      console.error(`Error fetching videos for ${channelName}:`, error);
      // Fallback to RSS if API fails
      return this.fetchChannelVideosRSS(channelId, channelName, category) || cached?.data || [];
    }
  }

  // Fallback RSS method for when API key is not available
  private async fetchChannelVideosRSS(
    channelId: string,
    channelName: string,
    category: string
  ): Promise<YouTubeVideo[]> {
    try {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(rssUrl)}`;

      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'application/xml, application/atom+xml, text/xml',
        }
      });

      if (!response.ok) {
        // Suppress 404 errors for YouTube RSS feeds (they may not be available)
        if (response.status !== 404) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return [];
      }

      const xmlText = await response.text();
      return this.parseYouTubeRSS(xmlText, channelName, category);
    } catch (error) {
      // Suppress all YouTube RSS errors to reduce console noise
      return [];
    }
  }

  private parseYouTubeRSS(xmlText: string, channelName: string, category: string): YouTubeVideo[] {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const entries = xmlDoc.querySelectorAll('entry');

      const videos: YouTubeVideo[] = [];

      entries.forEach((entry, index) => {
        if (index >= YOUTUBE_CONFIG.maxResults) return;

        const videoId = entry.querySelector('yt\\:videoId, videoId')?.textContent || '';
        const title = entry.querySelector('title')?.textContent || 'Untitled Video';
        const description = entry.querySelector('media\\:description, description')?.textContent || '';
        const published = entry.querySelector('published')?.textContent || new Date().toISOString();

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

  async fetchCategoryVideos(category: string): Promise<YouTubeVideo[]> {
    // Map category names to config keys
    const categoryMap: Record<string, keyof typeof YOUTUBE_CONFIG.channels> = {
      'AI': 'aiNews',
      'Tech': 'techNews',
      'Podcasts': 'podcasts',
      'Tutorials': 'tutorials',
      'Business': 'makeMoneyWithAI',
      'aiNews': 'aiNews',
      'techNews': 'techNews',
      'podcasts': 'podcasts',
      'tutorials': 'tutorials',
      'makeMoneyWithAI': 'makeMoneyWithAI',
      'aiVsHuman': 'aiVsHuman',
    };

    const configKey = categoryMap[category] || category;
    const channels = YOUTUBE_CONFIG.channels[configKey] || [];

    const allVideos: YouTubeVideo[] = [];

    // Fetch videos from all channels in parallel
    const results = await Promise.allSettled(
      channels.map(channel =>
        this.fetchChannelVideos(channel.id, channel.name, category, 5)
      )
    );

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allVideos.push(...result.value);
      }
    });

    // Sort by publish date (newest first)
    return allVideos.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async fetchAllVideos(): Promise<YouTubeVideo[]> {
    const categories = Object.keys(YOUTUBE_CONFIG.channels) as Array<keyof typeof YOUTUBE_CONFIG.channels>;
    const allVideos: YouTubeVideo[] = [];

    for (const category of categories) {
      // Map config category to display category
      const displayCategory = category === 'aiNews' ? 'AI' :
                             category === 'techNews' ? 'Tech' :
                             category === 'makeMoneyWithAI' ? 'Business' :
                             category === 'aiVsHuman' ? 'AI' :
                             category.charAt(0).toUpperCase() + category.slice(1);

      const videos = await this.fetchCategoryVideos(displayCategory);
      allVideos.push(...videos);
    }

    // Sort by date and return top 50
    return allVideos
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 50);
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
    return this.fetchCategoryVideos(category);
  }

  private getBestThumbnail(thumbnails: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
    maxresdefault?: { url: string };
  }): string {
    // Try to get the best quality thumbnail available
    return thumbnails.maxresdefault?.url ||
           thumbnails.high?.url ||
           thumbnails.medium?.url ||
           thumbnails.default?.url ||
           '/placeholder-video.jpg';
  }

  private formatDuration(duration: string): string {
    // Convert ISO 8601 duration (PT15M30S) to readable format (15:30)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    if (!match) return '0:00';

    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const seconds = match[3] ? parseInt(match[3], 10) : 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private formatViewCount(count: string): string {
    const num = parseInt(count, 10);

    if (isNaN(num)) return '0 views';

    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M views`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K views`;
    }
    return `${num} views`;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

const youtubeService = new YouTubeService();

export { youtubeService };
export default youtubeService;
