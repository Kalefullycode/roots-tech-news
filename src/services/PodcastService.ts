import ContentFilter from './ContentFilter';

export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  podcastName: string;
  publishedAt: string;
  url: string;
  audioUrl?: string;
  duration?: string;
  category: string;
}

class PodcastService {
  private cache = new Map<string, { data: PodcastEpisode[]; timestamp: number }>();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  // Popular Tech & Innovation Podcasts RSS feeds
  private readonly PODCASTS = [
    // AI-Focused Podcasts
    { url: 'https://lexfridman.com/feed/podcast/', name: 'Lex Fridman Podcast', category: 'AI' },
    { url: 'https://twimlai.com/feed/', name: 'TWIML AI Podcast', category: 'AI' },
    { url: 'https://api.substack.com/feed/podcast/1084089.rss', name: 'Latent Space', category: 'AI' },
    { url: 'https://changelog.com/practicalai/feed', name: 'Practical AI', category: 'AI' },
    { url: 'https://feeds.megaphone.fm/MLN2155636147', name: 'Hard Fork', category: 'AI' },
    
    // Tech News & Analysis
    { url: 'https://feeds.simplecast.com/54nAGcIl', name: 'The Vergecast', category: 'Tech' },
    { url: 'https://feeds.megaphone.fm/accidental-tech-podcast', name: 'Accidental Tech Podcast', category: 'Tech' },
    { url: 'https://feeds.twit.tv/twit.xml', name: 'This Week in Tech', category: 'Tech' },
    { url: 'https://feeds.pacific-content.com/commandlineheroes', name: 'Command Line Heroes', category: 'Tech' },
    { url: 'https://changelog.com/podcast/feed', name: 'The Changelog', category: 'Tech' },
    
    // Quantum Computing & Advanced Tech
    { url: 'https://feeds.simplecast.com/dHoohVNH', name: 'a16z Podcast', category: 'Tech' }, // Covers quantum, VR/AR, space tech
    { url: 'https://feeds.megaphone.fm/acquired', name: 'Acquired', category: 'Tech' }, // Covers emerging tech
    
    // Startups & Business
    { url: 'https://feeds.megaphone.fm/WWO3519750118', name: 'Pivot', category: 'Startups' },
    { url: 'https://feeds.npr.org/510313/podcast.xml', name: 'How I Built This', category: 'Startups' },
    { url: 'https://feeds.simplecast.com/JoGtLBBd', name: 'Masters of Scale', category: 'Startups' },
    
    // Security & Privacy
    { url: 'https://feeds.megaphone.fm/darknetdiaries', name: 'Darknet Diaries', category: 'Security' },
    { url: 'https://risky.biz/feeds/risky-business/', name: 'Risky Business', category: 'Security' },
    { url: 'https://feeds.megaphone.fm/cyberwire-daily-podcast', name: 'CyberWire Daily', category: 'Security' },
    
    // Diversity & Culture
    { url: 'https://feeds.simplecast.com/wjQvV7j0', name: 'Code Switch', category: 'Culture' },
    { url: 'https://feeds.megaphone.fm/business-wars', name: 'Business Wars', category: 'Startups' },
  ];

  private parsePodcastRSS(xmlText: string, podcastName: string, category: string): PodcastEpisode[] {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const items = xmlDoc.querySelectorAll('item');
      
      const episodes: PodcastEpisode[] = [];
      
      items.forEach((item, index) => {
        if (index >= 5) return; // Limit to 5 episodes per podcast
        
        const title = item.querySelector('title')?.textContent || 'Untitled Episode';
        const description = item.querySelector('description')?.textContent || '';
        const link = item.querySelector('link')?.textContent || item.querySelector('guid')?.textContent || '#';
        const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
        
        // Get audio URL
        const enclosure = item.querySelector('enclosure');
        const audioUrl = enclosure?.getAttribute('url') || '';
        
        // Get duration
        const duration = item.querySelector('itunes\\:duration, duration')?.textContent || '';
        
        // Get thumbnail
        const itunesImage = item.querySelector('itunes\\:image');
        const thumbnail = itunesImage?.getAttribute('href') || 
                         xmlDoc.querySelector('channel itunes\\:image')?.getAttribute('href') || 
                         '/placeholder.svg';
        
        episodes.push({
          id: link + pubDate,
          title,
          description: description.replace(/<[^>]*>/g, '').substring(0, 250),
          thumbnail,
          podcastName,
          publishedAt: pubDate,
          url: link,
          audioUrl,
          duration,
          category
        });
      });
      
      return episodes;
    } catch (error) {
      console.warn('Failed to parse Podcast RSS:', error);
      return [];
    }
  }

  async fetchPodcast(feedUrl: string, podcastName: string, category: string): Promise<PodcastEpisode[]> {
    const cacheKey = feedUrl;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Use our Cloudflare Pages Function RSS proxy
      const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`;
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'application/xml, application/rss+xml, text/xml',
        }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      // Get XML content directly (no JSON wrapper)
      const xmlText = await response.text();
      const episodes = this.parsePodcastRSS(xmlText, podcastName, category);
      
      this.cache.set(cacheKey, { data: episodes, timestamp: Date.now() });
      return episodes;
    } catch (error) {
      // Only log errors in development to reduce console noise
      if (import.meta.env.DEV) {
        console.warn(`Failed to fetch podcast ${podcastName}:`, error);
      }
      return [];
    }
  }

  async fetchAllPodcasts(): Promise<PodcastEpisode[]> {
    const allEpisodes: PodcastEpisode[] = [];
    
    const fetchPromises = this.PODCASTS.map(podcast => 
      this.fetchPodcast(podcast.url, podcast.name, podcast.category)
    );

    const results = await Promise.allSettled(fetchPromises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allEpisodes.push(...result.value);
      }
    });

    // Filter out non-AI/tech content
    const filteredEpisodes = ContentFilter.filterAndSort(allEpisodes);

    return filteredEpisodes.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async fetchByCategory(category: string): Promise<PodcastEpisode[]> {
    const categoryPodcasts = this.PODCASTS.filter(podcast => 
      podcast.category.toLowerCase() === category.toLowerCase()
    );

    const allEpisodes: PodcastEpisode[] = [];
    
    const fetchPromises = categoryPodcasts.map(podcast => 
      this.fetchPodcast(podcast.url, podcast.name, podcast.category)
    );

    const results = await Promise.allSettled(fetchPromises);
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        allEpisodes.push(...result.value);
      }
    });

    return allEpisodes.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export default new PodcastService();

