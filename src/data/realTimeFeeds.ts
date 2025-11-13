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
  // AI NEWS - HIGHEST PRIORITY (Real-time)
  // ============================================
  {
    id: 'openai-blog',
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'ai',
    updateFrequency: 15,
    priority: 'high',
    active: false // RSS feed may not be available - disabled to prevent errors
  },
  {
    id: 'anthropic-news',
    name: 'Anthropic News',
    url: 'https://www.anthropic.com/news/rss',
    category: 'ai',
    updateFrequency: 15,
    priority: 'high',
    active: false // RSS feed may not be available - disabled to prevent errors
  },
  {
    id: 'google-ai',
    name: 'Google AI Blog',
    url: 'https://blog.research.google/feeds/posts/default', // UPDATED URL
    category: 'ai',
    updateFrequency: 15,
    priority: 'high',
    active: true
  },
  {
    id: 'deepmind',
    name: 'DeepMind Blog',
    url: 'https://deepmind.google/discover/blog/rss/',
    category: 'ai',
    updateFrequency: 30,
    priority: 'high',
    active: false // RSS feed may not be available - disabled to prevent errors
  },
  {
    id: 'meta-ai',
    name: 'Meta AI Blog',
    url: 'https://ai.meta.com/blog/rss/',
    category: 'ai',
    updateFrequency: 30,
    priority: 'high',
    active: false // RSS feed may not be available - disabled to prevent errors
  },

  // ============================================
  // TECH NEWS - HIGH FREQUENCY
  // ============================================
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'tech-news',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
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
    id: 'theverge',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'tech-news',
    updateFrequency: 10,
    priority: 'high',
    active: true
  },
  {
    id: 'wired',
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    category: 'tech-news',
    updateFrequency: 15,
    priority: 'high',
    active: true
  },
  {
    id: 'arstechnica',
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'tech-news',
    updateFrequency: 15,
    priority: 'high',
    active: true
  },
  {
    id: 'engadget',
    name: 'Engadget',
    url: 'https://www.engadget.com/rss.xml',
    category: 'tech-news',
    updateFrequency: 15,
    priority: 'medium',
    active: true
  },

  // ============================================
  // HACKER NEWS & REDDIT (Real-time)
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
  {
    id: 'reddit-machinelearning',
    name: 'Reddit - Machine Learning',
    url: 'https://www.reddit.com/r/MachineLearning/.rss',
    category: 'ai',
    updateFrequency: 15,
    priority: 'medium',
    active: true
  },
  {
    id: 'reddit-artificial',
    name: 'Reddit - Artificial',
    url: 'https://www.reddit.com/r/artificial/.rss',
    category: 'ai',
    updateFrequency: 15,
    priority: 'medium',
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
  // SECURITY & PRIVACY
  // ============================================
  {
    id: 'cyberinsider',
    name: 'CyberInsider',
    url: 'https://cyberinsider.com/feed/',
    category: 'security',
    updateFrequency: 15,
    priority: 'high',
    active: true
  },
  {
    id: 'krebs-security',
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    category: 'security',
    updateFrequency: 30,
    priority: 'medium',
    active: true
  },
  {
    id: 'schneier',
    name: 'Schneier on Security',
    url: 'https://www.schneier.com/feed/atom/',
    category: 'security',
    updateFrequency: 60,
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











