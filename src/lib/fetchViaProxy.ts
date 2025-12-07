/**
 * Client helper for fetching external feeds via our RSS proxy
 * 
 * This helper switches direct cross-origin fetches to use our server-side proxy
 * at /api/rss-proxy, which handles CORS and provides better reliability.
 * 
 * @example
 * ```typescript
 * // Instead of:
 * const response = await fetch('https://reddit.com/r/technology/top.json');
 * 
 * // Use:
 * const response = await fetchViaProxy('https://reddit.com/r/technology/top.json');
 * const data = await response.json();
 * ```
 */

/**
 * Fetch a feed URL via the RSS proxy
 * 
 * @param feedUrl - The URL of the feed to fetch (RSS, JSON, etc.)
 * @returns Promise<Response> - The fetch Response object
 * @throws Error if the proxy request fails or feedUrl is invalid
 */
export async function fetchViaProxy(feedUrl: string): Promise<Response> {
  // Validate input
  if (!feedUrl || typeof feedUrl !== 'string') {
    throw new Error('fetchViaProxy: feedUrl must be a non-empty string');
  }

  // Trim whitespace
  feedUrl = feedUrl.trim();

  // Check if URL is valid
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(feedUrl);
  } catch (error) {
    throw new Error(`fetchViaProxy: Invalid URL format: ${feedUrl}`);
  }

  // Check if URL is same-origin (our own API) - bypass proxy for these
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  if (currentOrigin && parsedUrl.origin === currentOrigin) {
    // Same origin - fetch directly without proxy
    return fetch(feedUrl);
  }

  // Check if URL is relative - fetch directly without proxy
  if (feedUrl.startsWith('/')) {
    return fetch(feedUrl);
  }

  // External URL - use proxy
  try {
    const encodedUrl = encodeURIComponent(feedUrl);
    const proxyUrl = `/api/rss-proxy?url=${encodedUrl}`;

    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/xml, application/rss+xml, application/json, text/xml, */*',
      },
    });

    // Check if the proxy returned an error response
    if (!response.ok) {
      // Try to parse error message from JSON response
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          // Clone response to avoid consuming body
          const errorData = await response.clone().json();
          const errorMessage = errorData.error || errorData.message || 'Unknown error';
          throw new Error(
            `RSS Proxy error (${response.status}): ${errorMessage} for URL: ${feedUrl}`
          );
        } catch (jsonError) {
          // If JSON parsing fails, log and use generic error
          if (jsonError instanceof Error && !jsonError.message.includes('RSS Proxy error')) {
            console.warn('Failed to parse error response as JSON:', jsonError.message);
          }
          throw new Error(
            `RSS Proxy error: ${response.status} ${response.statusText} for URL: ${feedUrl}`
          );
        }
      } else {
        throw new Error(
          `RSS Proxy error: ${response.status} ${response.statusText} for URL: ${feedUrl}`
        );
      }
    }

    return response;
  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error instanceof Error) {
      if (error.message.includes('RSS Proxy error')) {
        // Already has context, just re-throw
        throw error;
      }
      // Add context to network errors
      throw new Error(`Failed to fetch via proxy: ${error.message} (URL: ${feedUrl})`);
    }
    throw error;
  }
}

/**
 * Default export for convenience
 */
export default fetchViaProxy;
