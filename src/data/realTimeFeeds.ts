export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  updateFrequency: number; // minutes
  priority: 'high' | 'medium' | 'low';
  active: boolean;
  lastChecked?: Date;
}

export const REAL_TIME_RSS_FEEDS: RSSFeed[] = [
  // ============================================
  // BREAKING NEWS SOURCES (Hourly Updates)
  // ============================================
  // DISABLED: Paywalled/broken feeds
  {
    id: 'reuters-technology',
    name: 'Reuters Technology',
    url: 'https://www.reuters.com/technology/feed/',
    category: 'tech-news',
    updateFrequency: 60, // Hourly
    priority: 'high',
    active: false // DISABLED: Paywalled
  },
  {
    id: 'ap-news-tech',
    name: 'Associated Press Tech',
    url: 'https://apnews.com/hub/technology/rss',
    category: 'tech-news',
    updateFrequency: 60, // Hourly
    priority: 'high',
    active: false // DISABLED: Format changed
  },
  {
    id: 'cnbc-technology',
    name: 'CNBC Technology',
    url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html',
    category: 'tech-news',
    updateFrequency: 60, // Hourly
    priority: 'high',
    active: false // DISABLED: Broken RSS feed
  },

  // ============================================
  // HIGH-FREQUENCY TECH NEWS (Multiple Daily Updates)
  // ============================================
  // DISABLED: Broken/dead feeds
  {
    id: 'engadget',
    name: 'Engadget',
    url: 'https://www.engadget.com/rss.xml',
    category: 'tech-news',
    updateFrequency: 10, // 5-10x daily
    priority: 'high',
    active: false // DISABLED: Dead feed
  },
  {
    id: 'zdnet',
    name: 'ZDNet',
    url: 'https://www.zdnet.com/news/rss.xml',
    category: 'tech-news',
    updateFrequency: 10, // 5-10x daily
    priority: 'high',
    active: false // DISABLED: Dead feed
  },
  {
    id: 'gizmodo',
    name: 'Gizmodo',
    url: 'https://gizmodo.com/rss',
    category: 'tech-news',
    updateFrequency: 10, // 5-10x daily
    priority: 'high',
    active: false // DISABLED: Blocked
  },
  {
    id: 'mashable-tech',
    name: 'Mashable Tech',
    url: 'https://mashable.com/feeds/rss/tech',
    category: 'tech-news',
    updateFrequency: 10, // 5-10x daily
    priority: 'high',
    active: false // DISABLED: Dead feed
  },
  {
    id: 'thenextweb',
    name: 'The Next Web',
    url: 'https://thenextweb.com/feed/',
    category: 'tech-news',
    updateFrequency: 10, // 5-10x daily
    priority: 'high',
    active: true
  },
  {
    id: 'digital-trends',
    name: 'Digital Trends',
    url: 'https://www.digitaltrends.com/feed/',
    category: 'tech-news',
    updateFrequency: 10, // 5-10x daily
    priority: 'high',
    active: true
  },

  // ============================================
  // AI-SPECIFIC NEWS SOURCES (Daily Updates)
  // ============================================
  {
    id: 'techcrunch-ai',
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'ai',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'venturebeat-ai',
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    category: 'ai',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'theverge-ai',
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    category: 'ai',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'ai-news',
    name: 'AI News',
    url: 'https://www.artificialintelligence-news.com/feed/',
    category: 'ai',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'unite-ai',
    name: 'Unite.AI',
    url: 'https://www.unite.ai/feed/',
    category: 'ai',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'synced-review',
    name: 'SyncedReview',
    url: 'https://syncedreview.com/feed/',
    category: 'ai',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },

  // ============================================
  // AI COMPANY BLOGS (Weekly Updates)
  // ============================================
  {
    id: 'openai-blog',
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'ai',
    updateFrequency: 60, // Weekly
    priority: 'high',
    active: true
  },
  {
    id: 'meta-ai',
    name: 'Meta AI',
    url: 'https://ai.meta.com/blog/rss/',
    category: 'ai',
    updateFrequency: 60, // Weekly
    priority: 'high',
    active: false // DISABLED: RSS feed doesn't exist
  },
  {
    id: 'anthropic-news',
    name: 'Anthropic',
    url: 'https://www.anthropic.com/news/rss',
    category: 'ai',
    updateFrequency: 60, // Weekly
    priority: 'high',
    active: true
  },
  {
    id: 'deepmind',
    name: 'DeepMind',
    url: 'https://deepmind.google/discover/blog/rss/',
    category: 'ai',
    updateFrequency: 60, // Weekly
    priority: 'high',
    active: false // DISABLED: Format changed, often fails
  },
  {
    id: 'google-ai',
    name: 'Google AI Blog',
    url: 'https://blog.research.google/feeds/posts/default',
    category: 'ai',
    updateFrequency: 60, // Weekly
    priority: 'high',
    active: false // DISABLED: Often fails
  },

  // ============================================
  // CYBERSECURITY NEWS (Daily Updates)
  // ============================================
  {
    id: 'cyberinsider',
    name: 'CyberInsider',
    url: 'https://cyberinsider.com/feed/',
    category: 'security',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'hacker-news-security',
    name: 'The Hacker News',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    category: 'security',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'cybernews',
    name: 'CyberNews',
    url: 'https://cybernews.com/feed/',
    category: 'security',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'wired-security',
    name: 'Wired Security',
    url: 'https://www.wired.com/feed/category/security/',
    category: 'security',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'krebs-security',
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    category: 'security',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'bleeping-computer',
    name: 'Bleeping Computer',
    url: 'https://www.bleepingcomputer.com/feed/',
    category: 'security',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'dark-reading',
    name: 'Dark Reading',
    url: 'https://www.darkreading.com/rss.xml',
    category: 'security',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },

  // ============================================
  // GENERAL TECH NEWS (Daily Updates)
  // ============================================
  {
    id: 'mit-technology-review',
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'tech-news',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'arstechnica',
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'tech-news',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'theverge',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'tech-news',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'tech-news',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },

  // ============================================
  // HACKER NEWS (Real-time News Aggregator)
  // ============================================
  {
    id: 'hackernews-frontpage',
    name: 'Hacker News - Front Page',
    url: 'https://hnrss.org/frontpage',
    category: 'tech-news',
    updateFrequency: 5, // Very frequent
    priority: 'high',
    active: true
  },
  {
    id: 'hackernews-ai',
    name: 'Hacker News - AI',
    url: 'https://hnrss.org/newest?q=AI+OR+artificial+intelligence',
    category: 'ai',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },

  // ============================================
  // AI RESEARCH & PAPERS
  // ============================================
  {
    id: 'arxiv-ai',
    name: 'arXiv - AI',
    url: 'https://rss.arxiv.org/rss/cs.AI',
    category: 'research',
    updateFrequency: 60,
    priority: 'medium',
    active: true
  },
  {
    id: 'arxiv-ml',
    name: 'arXiv - Machine Learning',
    url: 'https://rss.arxiv.org/rss/cs.LG',
    category: 'research',
    updateFrequency: 60,
    priority: 'medium',
    active: true
  },

  // ============================================
  // STARTUPS & BUSINESS
  // ============================================
  {
    id: 'venturebeat',
    name: 'VentureBeat',
    url: 'https://venturebeat.com/feed/',
    category: 'startups',
    updateFrequency: 20,
    priority: 'medium',
    active: true
  },
  {
    id: 'techcrunch-startups',
    name: 'TechCrunch Startups',
    url: 'https://techcrunch.com/category/startups/feed/',
    category: 'startups',
    updateFrequency: 15,
    priority: 'medium',
    active: true
  },

  // ============================================
  // PRODUCT LAUNCHES
  // ============================================
  {
    id: 'producthunt',
    name: 'Product Hunt',
    url: 'https://www.producthunt.com/feed',
    category: 'products',
    updateFrequency: 20,
    priority: 'medium',
    active: true
  },

  // ============================================
  // RSS.APP YOUTUBE FEEDS (Add after setup)
  // ============================================
  // Add your RSS.app feed URLs here after creating feeds on RSS.app
  // Example:
  // {
  //   id: 'rssapp-ai-channels',
  //   name: 'RSS.app AI Channels',
  //   url: 'https://rss.app/feeds/YOUR_FEED_ID.xml',
  //   category: 'ai',
  //   updateFrequency: 30,
  //   priority: 'high',
  //   active: true
  // },
];

// Helper to get feeds by priority
export function getFeedsByPriority(priority: 'high' | 'medium' | 'low') {
  return REAL_TIME_RSS_FEEDS.filter(f => f.priority === priority && f.active);
}

// Helper to get feeds by category
export function getFeedsByCategory(category: string) {
  return REAL_TIME_RSS_FEEDS.filter(f => f.category === category && f.active);
}











