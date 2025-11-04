import { Handler } from '@netlify/functions';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['enclosure', 'enclosure']
    ]
  },
  timeout: 10000 // 10 second timeout
});

// Curated RSS Feed Sources - AI & Tech Focus
const RSS_SOURCES = [
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'AI' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', category: 'AI' },
  { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', category: 'Tech' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', category: 'AI' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'Tech' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'Tech' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'Tech' }
];

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  image: string;
}

interface RSSItem {
  'media:content'?: { $?: { url?: string } };
  'media:thumbnail'?: { $?: { url?: string } };
  enclosure?: { url?: string };
  'content:encoded'?: string;
  guid?: string;
  link?: string;
  title?: string;
  contentSnippet?: string;
  content?: string;
  pubDate?: string;
}

function extractImage(item: RSSItem): string {
  // Try multiple image extraction methods
  if (item['media:content']?.$?.url) return item['media:content'].$.url;
  if (item['media:thumbnail']?.$?.url) return item['media:thumbnail'].$.url;
  if (item.enclosure?.url) return item.enclosure.url;
  if (item['content:encoded']) {
    const match = item['content:encoded'].match(/<img[^>]+src="([^">]+)"/);
    if (match) return match[1];
  }
  return '/placeholder.svg';
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const allArticles: Article[] = [];

    // Fetch from all RSS sources in parallel
    const fetchPromises = RSS_SOURCES.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        
        return feed.items.slice(0, 5).map((item) => ({
          id: item.guid || item.link || `${source.name}-${Date.now()}`,
          title: item.title || 'Untitled',
          description: (item.contentSnippet || item.content || '').substring(0, 200),
          url: item.link || '#',
          publishedAt: item.pubDate || new Date().toISOString(),
          source: source.name,
          category: source.category,
          image: extractImage(item)
        }));
      } catch (err) {
        console.error(`Failed to fetch ${source.name}:`, err);
        return []; // Return empty array on error
      }
    });

    const results = await Promise.all(fetchPromises);
    
    // Flatten results and add to allArticles
    results.forEach(articles => {
      allArticles.push(...articles);
    });

    // Sort by date, newest first
    allArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // Remove duplicates based on title
    const uniqueArticles = allArticles.filter((article, index, self) =>
      index === self.findIndex((a) => a.title === article.title)
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        articles: uniqueArticles.slice(0, 30),
        count: uniqueArticles.length,
        sources: RSS_SOURCES.length,
        lastUpdated: new Date().toISOString()
      })
    };

  } catch (error: unknown) {
    console.error('RSS fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch RSS feeds',
        message: errorMessage
      })
    };
  }
};

