# RSS Fetch Pattern - Standardized Approach

## 🎯 Pattern Overview

All RSS fetching in the application follows this consistent, error-resistant pattern.

---

## ✅ Standard Pattern

### **CORRECT Implementation:**

```typescript
async function fetchRSSFeed(feedUrl: string) {
  try {
    // 1. Use Cloudflare Pages Function proxy
    const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`;
    
    // 2. Fetch with proper headers
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/xml, application/rss+xml, text/xml',
      }
    });
    
    // 3. Check response status
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 4. Parse XML content
    const xmlText = await response.text();
    const articles = parseXML(xmlText);
    
    // 5. Cache if successful
    cache.set(feedUrl, { data: articles, timestamp: Date.now() });
    
    return articles;
  } catch (error) {
    // 6. Log error and return empty array (never crash)
    console.warn(`Failed to fetch RSS from ${feedUrl}:`, error);
    return [];
  }
}
```

---

## ❌ Anti-Patterns (What NOT to Do)

### **1. Direct Fetch (WRONG):**

```typescript
// ❌ BAD - Causes CORS errors, 403, 404
async function fetchRSSFeed(feedUrl: string) {
  const response = await fetch(feedUrl); // Direct fetch = blocked!
  const text = await response.text();
  return parseXML(text);
}
```

**Problems:**
- ❌ CORS errors (browser blocks cross-origin requests)
- ❌ 403 Forbidden (sites block non-browser requests)
- ❌ No error handling (crashes on failure)
- ❌ No caching (slow, redundant requests)

### **2. No Error Handling (WRONG):**

```typescript
// ❌ BAD - Crashes entire app on error
async function fetchRSSFeed(feedUrl: string) {
  const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`;
  const response = await fetch(proxyUrl);
  // No try-catch = unhandled promise rejection!
  const text = await response.text();
  return parseXML(text);
}
```

**Problems:**
- ❌ Unhandled promise rejection
- ❌ App crashes if one feed fails
- ❌ Poor user experience
- ❌ No fallback content

### **3. Throwing Errors (WRONG):**

```typescript
// ❌ BAD - Propagates errors up
async function fetchRSSFeed(feedUrl: string) {
  const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`;
  const response = await fetch(proxyUrl);
  
  if (!response.ok) {
    throw new Error(`Failed: ${response.status}`); // ❌ Throws!
  }
  
  return parseXML(await response.text());
}
```

**Problems:**
- ❌ Caller must handle error
- ❌ Easy to forget error handling
- ❌ Can cause blank pages
- ❌ Inconsistent behavior

---

## 📊 Implementation Status

### **Services Using Standard Pattern:**

| Service | File | Status | Error Handling |
|---------|------|--------|----------------|
| **EnhancedRSSService** | `src/services/EnhancedRSSService.ts` | ✅ | Returns `[]` |
| **RSSService** | `src/services/RSSService.ts` | ✅ | Returns `[]` |
| **PodcastService** | `src/services/PodcastService.ts` | ✅ | Returns `[]` |
| **YouTubeService** | `src/services/YouTubeService.ts` | ✅ | Returns `[]` |
| **LivePodcastFeed** | `src/components/LivePodcastFeed.tsx` | ✅ | Keeps fallback |

**Coverage:** 100% ✅

---

## 🔍 Pattern Breakdown

### **1. Proxy Endpoint**

```typescript
const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`;
```

**Why:**
- ✅ Handles CORS on server-side
- ✅ Uses realistic browser headers
- ✅ Bypasses bot detection
- ✅ Adds security whitelist
- ✅ Provides caching

**Note:** Always `encodeURIComponent(feedUrl)` to handle special characters!

---

### **2. Headers**

```typescript
headers: {
  'Accept': 'application/xml, application/rss+xml, text/xml',
}
```

**Why:**
- ✅ Tells server we want XML/RSS
- ✅ Some feeds require Accept header
- ✅ Improves compatibility

---

### **3. Response Check**

```typescript
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
```

**Why:**
- ✅ Catches 404, 403, 500 errors
- ✅ Provides status code in error
- ✅ Allows try-catch to handle it
- ✅ Prevents parsing invalid responses

---

### **4. Error Handling**

```typescript
try {
  // ... fetch logic
} catch (error) {
  console.warn(`Failed to fetch RSS from ${feedUrl}:`, error);
  return [];
}
```

**Why:**
- ✅ Never crashes app
- ✅ Logs for debugging
- ✅ Returns empty array (expected type)
- ✅ Caller can continue normally

**Important:** Use `console.warn` not `console.error` - it's expected that some feeds might fail occasionally.

---

### **5. Caching**

```typescript
// Check cache first
const cached = this.cache.get(feedUrl);
if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
  return cached.data;
}

// ... fetch ...

// Cache successful result
this.cache.set(feedUrl, { data: articles, timestamp: Date.now() });
```

**Why:**
- ✅ Reduces redundant requests
- ✅ Faster for users
- ✅ Reduces server load
- ✅ Respects rate limits

**Cache Duration:** 5 minutes (300,000 ms)

---

## 🎨 Complete Example

### **EnhancedRSSService Implementation:**

```typescript
class EnhancedRSSService {
  private cache = new Map<string, { data: NewsArticle[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async fetchFromRSS(
    feedUrl: string, 
    sourceName: string, 
    category: string
  ): Promise<NewsArticle[]> {
    // 1. Check cache
    const cacheKey = feedUrl;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // 2. Use proxy
      const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`;
      
      // 3. Fetch with headers
      const response = await fetch(proxyUrl, { 
        method: 'GET',
        headers: {
          'Accept': 'application/xml, application/rss+xml, text/xml',
        }
      });
      
      // 4. Check response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // 5. Parse content
      const xmlText = await response.text();
      const articles = this.parseRSSXML(xmlText, sourceName, category);
      
      // 6. Cache result
      this.cache.set(cacheKey, { data: articles, timestamp: Date.now() });
      
      return articles;
    } catch (error) {
      // 7. Handle error gracefully
      console.warn(`Failed to fetch RSS from ${feedUrl}:`, error);
      return [];
    }
  }
}
```

---

## 🚀 Benefits of This Pattern

### **1. Reliability**
- ✅ Never crashes app
- ✅ Graceful degradation
- ✅ Fallback content available
- ✅ User always sees something

### **2. Performance**
- ✅ Caching reduces requests
- ✅ Proxy is on edge network (fast)
- ✅ Parallel fetching with `Promise.allSettled`
- ✅ Non-blocking errors

### **3. Maintainability**
- ✅ Consistent pattern everywhere
- ✅ Easy to debug (clear logs)
- ✅ Simple to add new feeds
- ✅ Testable code

### **4. User Experience**
- ✅ Fast loading
- ✅ Always shows content
- ✅ No error messages
- ✅ Professional appearance

---

## 🧪 Testing the Pattern

### **Test 1: Successful Fetch**

```typescript
const articles = await fetchFromRSS('https://techcrunch.com/feed/');
// Expected: Array of articles
// Logs: None (success is silent)
```

### **Test 2: 404 Error**

```typescript
const articles = await fetchFromRSS('https://example.com/nonexistent.xml');
// Expected: [] (empty array)
// Logs: "Failed to fetch RSS from https://example.com/nonexistent.xml: HTTP error! status: 404"
```

### **Test 3: Network Error**

```typescript
// Simulate offline
const articles = await fetchFromRSS('https://techcrunch.com/feed/');
// Expected: [] (empty array)
// Logs: "Failed to fetch RSS from https://techcrunch.com/feed/: Failed to fetch"
```

### **Test 4: Cache Hit**

```typescript
// First call
const articles1 = await fetchFromRSS('https://techcrunch.com/feed/');
// Fetches from network

// Second call (within 5 minutes)
const articles2 = await fetchFromRSS('https://techcrunch.com/feed/');
// Returns from cache (instant)
```

---

## 📝 Checklist for New RSS Sources

When adding a new RSS feed:

- [ ] Use `/api/rss-proxy?url=${encodeURIComponent(feedUrl)}`
- [ ] Wrap in try-catch block
- [ ] Check `if (!response.ok)`
- [ ] Return empty array on error
- [ ] Log with `console.warn` (not `console.error`)
- [ ] Add to service's RSS_FEEDS array
- [ ] Add domain to proxy whitelist (`functions/api/rss-proxy.ts`)
- [ ] Test with real feed URL
- [ ] Verify error handling works
- [ ] Check fallback content displays

---

## 🔧 Debugging Tips

### **Problem: Feed returns empty array**

```typescript
// Add debugging
console.log('Fetching:', feedUrl);
const response = await fetch(proxyUrl);
console.log('Status:', response.status);
const text = await response.text();
console.log('Content length:', text.length);
console.log('First 200 chars:', text.substring(0, 200));
```

### **Problem: Proxy returns 403**

```
Check proxy whitelist:
- functions/api/rss-proxy.ts
- ALLOWED_DOMAINS array
- Add feed's domain if missing
```

### **Problem: Parse errors**

```typescript
// Validate XML before parsing
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
const parseError = xmlDoc.querySelector('parsererror');
if (parseError) {
  console.error('XML Parse Error:', parseError.textContent);
  return [];
}
```

---

## 📚 Related Documentation

- `docs/RSS_PROXY_SETUP.md` - Proxy configuration
- `docs/FALLBACK_DATA_PATTERN.md` - Fallback content
- `functions/api/rss-proxy.ts` - Proxy implementation

---

**Pattern Established:** October 28, 2025  
**Services Covered:** 5  
**Coverage:** 100%  
**Status:** ✅ Production Ready

