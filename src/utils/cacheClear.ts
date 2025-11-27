/**
 * Client-side cache clearing utilities
 * Helps resolve browser cache issues that can cause React Error #31
 */

/**
 * Clear all application caches
 */
export function clearAllCaches(): void {
  // Clear localStorage
  try {
    localStorage.clear();
    console.log('✅ Cleared localStorage');
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }

  // Clear sessionStorage
  try {
    sessionStorage.clear();
    console.log('✅ Cleared sessionStorage');
  } catch (error) {
    console.warn('Failed to clear sessionStorage:', error);
  }

  // Clear service worker cache if available
  if ('serviceWorker' in navigator && 'caches' in window) {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('🗑️ Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('✅ Cleared all service worker caches');
    }).catch((error) => {
      console.warn('Failed to clear service worker caches:', error);
    });
  }

  // Clear IndexedDB if available
  if ('indexedDB' in window) {
    // Note: IndexedDB clearing requires more complex logic
    // This is a basic implementation
    try {
      indexedDB.databases().then((databases) => {
        databases.forEach((db) => {
          if (db.name) {
            indexedDB.deleteDatabase(db.name);
            console.log('🗑️ Deleting IndexedDB:', db.name);
          }
        });
      });
    } catch (error) {
      console.warn('Failed to clear IndexedDB:', error);
    }
  }
}

/**
 * Add cache-busting query parameter to URLs
 */
export function addCacheBuster(url: string): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_cb=${Date.now()}`;
}

/**
 * Reload page with cache cleared
 */
export function reloadWithCacheClear(): void {
  clearAllCaches();
  
  // Add cache-busting parameter to current URL
  const url = new URL(window.location.href);
  url.searchParams.set('_cb', Date.now().toString());
  
  // Force reload
  window.location.href = url.toString();
}

/**
 * Check if we should clear cache based on error patterns
 */
export function shouldClearCache(): boolean {
  // Check for common error indicators in localStorage
  try {
    const errorCount = parseInt(localStorage.getItem('error-count') || '0', 10);
    return errorCount > 3;
  } catch {
    return false;
  }
}

/**
 * Increment error count
 */
export function incrementErrorCount(): void {
  try {
    const current = parseInt(localStorage.getItem('error-count') || '0', 10);
    localStorage.setItem('error-count', String(current + 1));
  } catch {
    // Ignore errors
  }
}

/**
 * Reset error count
 */
export function resetErrorCount(): void {
  try {
    localStorage.removeItem('error-count');
  } catch {
    // Ignore errors
  }
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).RootsTechCacheClear = {
    clearAllCaches,
    reloadWithCacheClear,
    shouldClearCache,
    incrementErrorCount,
    resetErrorCount
  };
}


