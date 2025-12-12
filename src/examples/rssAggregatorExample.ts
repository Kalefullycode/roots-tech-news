/**
 * RSS Feed Aggregator Example Usage
 * 
 * This file demonstrates how to use the RSS feed aggregator
 * in both server-side and client-side contexts.
 */

import {
  parseRSSXML,
  normalizeDate,
  sortArticlesByDate,
  withErrorHandling,
  fetchRSSWithTimeout,
  removeDuplicates,
  RSSArticle
} from '../utils/rssUtils';

/**
 * RSS Feed Sources as defined in the requirements
 */
const RSS_FEEDS = [
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'TechCrunch', url: 'https://feeds.feedburner.com/TechCrunch' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
  { name: 'VentureBeat AI', url: 'https://feeds.feedburner.com/venturebeat/SZYF' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss' },
  { name: 'Cyber Insider', url: 'https://cyberinsider.com/feed/' },
  { name: 'Cybernews', url: 'https://cybernews.com/feed/' },
];

/**
 * Example 1: Fetch and parse a single RSS feed
 */
export async function fetchSingleFeed(feedUrl: string, feedName: string): Promise<RSSArticle[]> {
  console.log(`Fetching ${feedName}...`);
  
  const xmlText = await fetchRSSWithTimeout(feedUrl, 10000);
  
  if (!xmlText) {
    console.error(`Failed to fetch ${feedName}`);
    return [];
  }
  
  const articles = parseRSSXML(xmlText, feedName);
  console.log(`Parsed ${articles.length} articles from ${feedName}`);
  
  return articles;
}

/**
 * Example 2: Fetch and aggregate all RSS feeds
 */
export async function fetchAllFeeds(): Promise<RSSArticle[]> {
  console.log('Fetching all RSS feeds...');
  
  const allArticles: RSSArticle[] = [];
  const errors: string[] = [];
  
  // Fetch all feeds in parallel
  const results = await Promise.all(
    RSS_FEEDS.map(feed =>
      withErrorHandling(
        async () => {
          const xmlText = await fetchRSSWithTimeout(feed.url, 10000);
          if (!xmlText) {
            throw new Error(`Empty response from ${feed.name}`);
          }
          return parseRSSXML(xmlText, feed.name);
        },
        feed.name
      )
    )
  );
  
  // Collect results and errors
  results.forEach((result, index) => {
    if (result) {
      allArticles.push(...result);
    } else {
      errors.push(RSS_FEEDS[index].name);
    }
  });
  
  console.log(`Successfully fetched ${RSS_FEEDS.length - errors.length} of ${RSS_FEEDS.length} feeds`);
  if (errors.length > 0) {
    console.log(`Failed feeds: ${errors.join(', ')}`);
  }
  
  // Remove duplicates and sort by date
  const uniqueArticles = removeDuplicates(allArticles);
  const sortedArticles = sortArticlesByDate(uniqueArticles);
  
  console.log(`Total articles: ${sortedArticles.length}`);
  
  return sortedArticles;
}

/**
 * Example 3: Using the Cloudflare Pages Function endpoint
 * (Client-side approach)
 */
export async function fetchFromServerEndpoint(): Promise<any> {
  console.log('Fetching from server endpoint...');
  
  try {
    const response = await fetch('/fetch-rss');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`Received ${data.count} articles from server`);
    console.log(`Successful sources: ${data.successfulSources}/${data.sources}`);
    
    if (data.errors) {
      console.log(`Errors: ${data.errors.length}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching from server endpoint:', error);
    throw error;
  }
}

/**
 * Example 4: Format articles as JSON for API response
 */
export function formatAsJSON(articles: RSSArticle[]): string {
  const formatted = articles.map(article => ({
    title: article.title,
    link: article.link,
    pubDate: article.pubDate,
    source: article.source,
    description: article.description || '',
    author: article.author || ''
  }));
  
  return JSON.stringify(formatted, null, 2);
}

/**
 * Example 5: Filter articles by date range
 */
export function filterByDateRange(
  articles: RSSArticle[],
  startDate: Date,
  endDate: Date
): RSSArticle[] {
  return articles.filter(article => {
    const articleDate = new Date(article.pubDate);
    return articleDate >= startDate && articleDate <= endDate;
  });
}

/**
 * Example 6: Search articles by keyword
 */
export function searchArticles(articles: RSSArticle[], keyword: string): RSSArticle[] {
  const lowerKeyword = keyword.toLowerCase();
  return articles.filter(article => 
    article.title.toLowerCase().includes(lowerKeyword) ||
    (article.description && article.description.toLowerCase().includes(lowerKeyword))
  );
}

/**
 * Example Usage - Main function
 * 
 * Uncomment the examples you want to run:
 */
export async function runExamples() {
  console.log('=== RSS Feed Aggregator Examples ===\n');
  
  // Example 1: Fetch single feed
  // const articles = await fetchSingleFeed(
  //   'https://www.theverge.com/rss/index.xml',
  //   'The Verge'
  // );
  // console.log('First article:', articles[0]);
  
  // Example 2: Fetch all feeds
  // const allArticles = await fetchAllFeeds();
  // console.log(`\nTotal articles fetched: ${allArticles.length}`);
  // console.log('Latest article:', allArticles[0]);
  
  // Example 3: Use server endpoint (in browser or Node with fetch)
  // const serverData = await fetchFromServerEndpoint();
  // console.log('Server response:', serverData);
  
  // Example 4: Format as JSON
  // const allArticles = await fetchAllFeeds();
  // const json = formatAsJSON(allArticles.slice(0, 5));
  // console.log('\nJSON output (first 5 articles):\n', json);
  
  // Example 5: Filter by date
  // const allArticles = await fetchAllFeeds();
  // const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  // const today = new Date();
  // const recentArticles = filterByDateRange(allArticles, yesterday, today);
  // console.log(`\nArticles from last 24 hours: ${recentArticles.length}`);
  
  // Example 6: Search articles
  // const allArticles = await fetchAllFeeds();
  // const aiArticles = searchArticles(allArticles, 'AI');
  // console.log(`\nArticles mentioning "AI": ${aiArticles.length}`);
  
  console.log('\nExamples completed!');
}

// Export all examples for use in other files
export default {
  fetchSingleFeed,
  fetchAllFeeds,
  fetchFromServerEndpoint,
  formatAsJSON,
  filterByDateRange,
  searchArticles,
  runExamples
};
