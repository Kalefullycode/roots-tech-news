# RSS Feed Aggregator Implementation

This document describes the RSS feed aggregator implementation for Roots Tech News.

## Overview

The RSS feed aggregator fetches and displays articles from multiple tech news sources. It supports both server-side and client-side implementations with proper error handling and caching.

## Architecture

### 1. Server-Side Implementation (Cloudflare Pages Functions)

**Location:** `/functions/fetch-rss.ts`

The server-side implementation runs on Cloudflare Pages Functions and provides:
- **Direct RSS fetching** without CORS limitations
- **KV caching** for 5-minute TTL to reduce API calls
- **Parallel fetching** of all feeds with individual error handling
- **Smart filtering** to prioritize AI and tech content
- **Deduplication** based on article titles

**Endpoint:** `GET /fetch-rss`

**Response Format:**
```json
{
  "articles": [
    {
      "id": "unique-id",
      "title": "Article Title",
      "description": "Article summary...",
      "url": "https://example.com/article",
      "publishedAt": "2024-12-12T10:30:00Z",
      "source": "TechCrunch",
      "category": "Tech",
      "image": "https://example.com/image.jpg"
    }
  ],
  "count": 100,
  "totalFetched": 250,
  "sources": 32,
  "successfulSources": 30,
  "errors": ["Source1: timeout", "Source2: 404"],
  "lastUpdated": "2024-12-12T10:35:00Z"
}
```

### 2. Client-Side Implementation

**Location:** `/src/services/RSSService.ts`

The client-side service provides:
- **RSS proxy usage** to avoid CORS issues
- **Client-side caching** (5-minute duration)
- **Category filtering** for targeted content
- **Fallback handling** for failed feeds

### 3. Utility Functions

**Location:** `/src/utils/rssUtils.ts`

Provides reusable utilities:
- `parseRSSXML()` - Parse RSS XML using DOMParser
- `normalizeDate()` - Convert dates to ISO 8601 format
- `sortArticlesByDate()` - Sort articles by publication date
- `withErrorHandling()` - Wrap async operations with error handling
- `fetchRSSWithTimeout()` - Fetch with configurable timeout
- `removeDuplicates()` - Remove duplicate articles

### 4. Example Usage

**Location:** `/src/examples/rssAggregatorExample.ts`

Demonstrates various usage patterns:
- Fetching single feeds
- Aggregating multiple feeds
- Using the server endpoint
- Filtering and searching articles

## RSS Feed Sources

The aggregator includes the following sources (as requested):

### Required Feeds
1. **The Verge** - `https://www.theverge.com/rss/index.xml`
2. **TechCrunch** - `https://feeds.feedburner.com/TechCrunch`
3. **Ars Technica** - `https://feeds.arstechnica.com/arstechnica/index`
4. **VentureBeat AI** - `https://feeds.feedburner.com/venturebeat/SZYF`
5. **MIT Tech Review** - `https://www.technologyreview.com/feed`
6. **Wired** - `https://www.wired.com/feed/rss`
7. **Cyber Insider** - `https://cyberinsider.com/feed/`
8. **Cybernews** - `https://cybernews.com/feed/`

### Additional Sources
- AI company blogs (Meta AI, Anthropic, DeepMind, OpenAI)
- High-frequency news sources (Reuters, AP, CNBC, ZDNet)
- Security sources (Krebs, Bleeping Computer, Dark Reading)

## Features

### ✅ Core Functionality
- ✅ Parse RSS XML feeds
- ✅ Extract article title, link, pubDate, source, description, author
- ✅ Combine feeds into single collection
- ✅ Sort by date (newest first)
- ✅ Return data as JSON array
- ✅ Handle errors gracefully for individual feeds
- ✅ Use async/await for all operations

### ✅ Error Handling
- ✅ Wrap each feed fetch in try-catch
- ✅ Continue processing if one feed fails
- ✅ Return partial results with error information
- ✅ Log errors for debugging

### ✅ Technical Implementation
- ✅ Use native `fetch` API
- ✅ XML parsing with regex (server) and DOMParser (client)
- ✅ TypeScript types included
- ✅ User-Agent headers set
- ✅ 15-second timeout for requests (server), 10-second (client)
- ✅ Logging of successful/failed feeds

## Usage

### Server-Side (Recommended)

The server-side endpoint is the recommended approach as it avoids CORS issues:

```typescript
// Fetch from the Cloudflare Pages Function
const response = await fetch('/fetch-rss');
const data = await response.json();

console.log(`Received ${data.count} articles`);
console.log(`From ${data.successfulSources} sources`);
```

### Client-Side with Utilities

```typescript
import { fetchAllFeeds } from './examples/rssAggregatorExample';

// Fetch and aggregate all feeds
const articles = await fetchAllFeeds();
console.log(`Total articles: ${articles.length}`);
```

### Using the RSS Service

```typescript
import RSSService from './services/RSSService';

// Fetch all RSS feeds
const articles = await RSSService.fetchAllRSSFeeds();

// Fetch by category
const aiArticles = await RSSService.fetchByCategory('AI');
```

## Testing Locally

### 1. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### 2. Test Server Endpoint

```bash
# Using curl
curl http://localhost:5173/fetch-rss

# Using browser
# Open http://localhost:5173/fetch-rss in your browser
```

### 3. Test with Cloudflare Pages Dev

```bash
# Build the project first
npm run build

# Start Cloudflare Pages dev server
npm run cf:dev
```

### 4. Run Example Code

Create a test file:

```typescript
// test-rss.ts
import { runExamples } from './src/examples/rssAggregatorExample';

// Uncomment examples you want to test
runExamples();
```

Run with:
```bash
npx tsx test-rss.ts
```

## CORS Considerations

### Browser Limitations

Direct RSS feed fetching from the browser is blocked by CORS for most feeds. This is why we have two implementations:

1. **Server-side** (Cloudflare Pages Functions) - No CORS issues ✅
2. **Client-side** - Uses RSS proxy or requires CORS proxy service

### Solutions

- **Recommended:** Use the server-side endpoint `/fetch-rss`
- **Alternative:** Use a CORS proxy service (e.g., `cors-anywhere`, `allorigins.win`)
- **Not Recommended:** Direct fetch from browser (will fail for most feeds)

## Caching Strategy

### Server-Side (Cloudflare KV)
- **Duration:** 5 minutes (300 seconds)
- **Storage:** Cloudflare KV namespace (`FEED_CACHE`)
- **Fallback:** Fresh fetch if cache read fails

### Client-Side (Memory)
- **Duration:** 5 minutes
- **Storage:** In-memory Map
- **Clearing:** Manual via `RSSService.clearCache()`

## Error Handling

The implementation handles various error scenarios:

1. **Network Errors:** Timeout, DNS failures, connection issues
2. **HTTP Errors:** 404, 500, rate limiting
3. **Parse Errors:** Invalid XML, missing fields
4. **Empty Responses:** No content or empty feed

Each error is logged and doesn't break the entire aggregation:

```typescript
// Example error in response
{
  "errors": [
    "Source1: Timeout fetching",
    "Source2: 404 Not Found",
    "Source3: Invalid XML"
  ]
}
```

## Performance

- **Parallel Fetching:** All feeds fetched simultaneously
- **Timeout Protection:** 10-15 second timeout per feed
- **Caching:** 5-minute cache reduces API calls by ~12x
- **Partial Results:** Returns available data even if some feeds fail
- **Deduplication:** Removes duplicate articles efficiently

## Monitoring

### Check Cache Status (Client-side)

```typescript
import RSSService from './services/RSSService';

const stats = RSSService.getCacheStats();
console.log(`Cached feeds: ${stats.size}`);
console.log(`Cache keys:`, stats.keys);
```

### Server Logs

Check Cloudflare Pages Function logs for:
- Successful fetches
- Failed fetches with reasons
- Cache hits/misses
- Performance metrics

## Troubleshooting

### Problem: No articles returned

**Solution:**
1. Check if feeds are accessible
2. Verify User-Agent headers are set
3. Check timeout settings
4. Review error logs

### Problem: CORS errors in browser

**Solution:**
- Use the server-side endpoint `/fetch-rss` instead
- Or configure a CORS proxy

### Problem: Old articles showing

**Solution:**
- Clear cache: `RSSService.clearCache()`
- Wait for cache expiration (5 minutes)
- Check feed's publication dates

### Problem: Specific feed not working

**Solution:**
1. Test feed URL directly in browser
2. Check if feed requires authentication
3. Verify feed format is valid RSS/XML
4. Check error logs for specific error message

## Future Enhancements

Potential improvements for the aggregator:

1. **Extended Caching:** Database storage for longer-term caching
2. **Feed Health Monitoring:** Track feed availability over time
3. **Advanced Filtering:** ML-based content categorization
4. **Webhook Support:** Real-time updates when new articles arrive
5. **Rate Limiting:** Respect feed rate limits per source
6. **Article Images:** Better image extraction from content
7. **Full-Text Extraction:** Fetch full article content when possible

## API Reference

### Server Endpoint: GET /fetch-rss

**Request:**
```
GET /fetch-rss
```

**Response:**
```typescript
interface FetchRSSResponse {
  articles: Article[];
  count: number;
  totalFetched: number;
  sources: number;
  successfulSources: number;
  errors?: string[];
  lastUpdated: string;
}

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
```

### Utility Functions

See `/src/utils/rssUtils.ts` for detailed function signatures and documentation.

## License

This implementation is part of the Roots Tech News project.
