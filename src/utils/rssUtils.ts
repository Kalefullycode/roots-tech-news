/**
 * RSS Feed Utilities
 * Provides utility functions for RSS feed parsing, date normalization, and error handling
 */

export interface RSSArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description?: string;
  author?: string;
  image?: string;
}

/**
 * Parse RSS XML using native DOMParser (browser) or regex (Node.js)
 * Works in both browser and Node.js environments
 * @param xmlText - Raw XML string from RSS feed
 * @param sourceName - Name of the RSS source
 * @returns Array of parsed articles
 */
export function parseRSSXML(xmlText: string, sourceName: string): RSSArticle[] {
  const articles: RSSArticle[] = [];
  
  try {
    // Check if DOMParser is available (browser environment)
    if (typeof DOMParser !== 'undefined') {
      return parseRSSWithDOMParser(xmlText, sourceName);
    } else {
      // Fallback to regex parsing for Node.js
      return parseRSSWithRegex(xmlText, sourceName);
    }
  } catch (error) {
    console.error(`Error parsing RSS XML from ${sourceName}:`, error);
  }
  
  return articles;
}

/**
 * Parse RSS XML using DOMParser (browser environment)
 */
function parseRSSWithDOMParser(xmlText: string, sourceName: string): RSSArticle[] {
  const articles: RSSArticle[] = [];
  
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('XML parsing error');
    }
    
    const items = xmlDoc.querySelectorAll('item');
    
    items.forEach((item) => {
      try {
        const title = item.querySelector('title')?.textContent || 'Untitled';
        const link = item.querySelector('link')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        
        // Extract author - try multiple possible tags for better compatibility
        let author: string | undefined;
        const authorElement = item.querySelector('author');
        if (authorElement) {
          author = authorElement.textContent || undefined;
        } else {
          // Try dc:creator with namespace-agnostic selector
          const creatorElement = item.querySelector('[*|creator]') || item.querySelector('creator');
          if (creatorElement) {
            author = creatorElement.textContent || undefined;
          }
        }
        
        // Extract pubDate from various possible tags
        const pubDateElement = item.querySelector('pubDate') || 
                               item.querySelector('[*|date]') || 
                               item.querySelector('date') || 
                               item.querySelector('published');
        const pubDate = pubDateElement?.textContent || new Date().toISOString();
        
        // Extract image from various sources
        let image: string | undefined;
        // Try media:content with namespace-agnostic selector
        const mediaContent = item.querySelector('[*|content]') || item.querySelector('content');
        if (mediaContent) {
          image = mediaContent.getAttribute('url') || undefined;
        }
        if (!image) {
          const enclosure = item.querySelector('enclosure');
          if (enclosure && enclosure.getAttribute('type')?.startsWith('image/')) {
            image = enclosure.getAttribute('url') || undefined;
          }
        }
        if (!image && description) {
          const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) {
            image = imgMatch[1];
          }
        }
        
        articles.push({
          title: cleanText(title),
          link: link.trim(),
          pubDate: normalizeDate(pubDate),
          source: sourceName,
          description: description ? cleanDescription(description) : undefined,
          author,
          image
        });
      } catch (itemError) {
        console.warn(`Error parsing RSS item from ${sourceName}:`, itemError);
      }
    });
  } catch (error) {
    console.error(`Error parsing RSS with DOMParser from ${sourceName}:`, error);
  }
  
  return articles;
}

/**
 * Parse RSS XML using regex (Node.js environment)
 */
function parseRSSWithRegex(xmlText: string, sourceName: string): RSSArticle[] {
  const articles: RSSArticle[] = [];
  
  try {
    // Extract items using regex
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    const items = xmlText.match(itemRegex) || [];
    
    for (const itemXml of items) {
      try {
        // Extract title
        const titleMatch = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = titleMatch ? cleanText(titleMatch[1]) : 'Untitled';
        
        // Extract link
        const linkMatch = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
        const link = linkMatch ? cleanText(linkMatch[1]) : '';
        
        // Extract description
        const descMatch = itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
        const description = descMatch ? cleanDescription(descMatch[1]) : undefined;
        
        // Extract author
        const authorMatch = itemXml.match(/<(?:author|dc:creator|creator)[^>]*>([\s\S]*?)<\/(?:author|dc:creator|creator)>/i);
        const author = authorMatch ? cleanText(authorMatch[1]) : undefined;
        
        // Extract pubDate
        const pubDateMatch = itemXml.match(/<(?:pubDate|dc:date|date|published)[^>]*>([\s\S]*?)<\/(?:pubDate|dc:date|date|published)>/i);
        const pubDate = pubDateMatch ? normalizeDate(cleanText(pubDateMatch[1])) : new Date().toISOString();
        
        // Extract image
        let image: string | undefined;
        const mediaContentMatch = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
        if (mediaContentMatch) {
          image = mediaContentMatch[1];
        } else {
          const enclosureMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
          if (enclosureMatch) {
            image = enclosureMatch[1];
          } else {
            const imgMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) {
              image = imgMatch[1];
            }
          }
        }
        
        articles.push({
          title,
          link: link.trim(),
          pubDate,
          source: sourceName,
          description,
          author,
          image
        });
      } catch (itemError) {
        console.warn(`Error parsing RSS item from ${sourceName}:`, itemError);
      }
    }
  } catch (error) {
    console.error(`Error parsing RSS with regex from ${sourceName}:`, error);
  }
  
  return articles;
}

/**
 * Clean text by removing HTML tags and normalizing whitespace
 * Removes all HTML content including tags and special characters to prevent injection
 * @param text - Text to clean
 * @returns Cleaned text
 */
function cleanText(text: string): string {
  // First, extract content from CDATA
  let cleaned = text.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
  
  // Remove complete HTML tags first
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  
  // Then remove any remaining angle brackets (incomplete tags)
  // This two-step process ensures no HTML injection is possible
  cleaned = cleaned.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

/**
 * Clean description by removing HTML, URLs, and metadata
 * Removes all HTML content including tags and special characters to prevent injection
 * @param description - Description text to clean
 * @returns Cleaned description (max 200 chars)
 */
function cleanDescription(description: string): string {
  // First, extract content from CDATA
  let cleaned = description.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
  
  // Remove complete HTML tags first
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  
  // Then remove any remaining angle brackets (incomplete tags)
  // This two-step process ensures no HTML injection is possible
  cleaned = cleaned.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Remove URLs and metadata
  cleaned = cleaned
    .replace(/https?:\/\/[^\s]+/g, '')
    .replace(/Article URL:.*?(?=\s|$|\n)/gi, '')
    .replace(/Comments URL:.*?(?=\s|$|\n)/gi, '')
    .replace(/Points:\s*\d+/gi, '');
  
  // Normalize whitespace and truncate
  cleaned = cleaned.replace(/\s+/g, ' ').trim().substring(0, 200);
  
  return cleaned;
}

/**
 * Normalize date to ISO 8601 format
 * Handles various date formats from different RSS feeds
 * @param dateString - Date string from RSS feed
 * @returns ISO 8601 formatted date string
 */
export function normalizeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${dateString}, using current date`);
      return new Date().toISOString();
    }
    
    return date.toISOString();
  } catch (error) {
    console.warn(`Error parsing date: ${dateString}`, error);
    return new Date().toISOString();
  }
}

/**
 * Sort articles by date (newest first)
 * @param articles - Array of articles to sort
 * @returns Sorted array of articles
 */
export function sortArticlesByDate(articles: RSSArticle[]): RSSArticle[] {
  return articles.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    
    // Handle invalid dates
    if (isNaN(dateA) && isNaN(dateB)) return 0;
    if (isNaN(dateA)) return 1; // Invalid dates go to end
    if (isNaN(dateB)) return -1;
    
    return dateB - dateA; // Newest first
  });
}

/**
 * Error handling wrapper for async RSS fetch operations
 * @param fn - Async function to wrap
 * @param feedName - Name of the feed (for error logging)
 * @returns Result of function or empty array on error
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  feedName: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error(`Error fetching ${feedName}:`, error);
    return null;
  }
}

/**
 * Fetch RSS feed with timeout and error handling
 * @param url - RSS feed URL
 * @param timeoutMs - Timeout in milliseconds (default: 10000)
 * @returns XML text or null on error
 */
export async function fetchRSSWithTimeout(
  url: string,
  timeoutMs: number = 10000
): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RootsTechNews/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`Timeout fetching ${url}`);
    } else {
      console.error(`Error fetching ${url}:`, error);
    }
    return null;
  }
}

/**
 * Remove duplicate articles based on title
 * @param articles - Array of articles
 * @returns Array of unique articles
 */
export function removeDuplicates(articles: RSSArticle[]): RSSArticle[] {
  const seen = new Set<string>();
  return articles.filter(article => {
    const titleLower = article.title.toLowerCase();
    if (seen.has(titleLower)) {
      return false;
    }
    seen.add(titleLower);
    return true;
  });
}
