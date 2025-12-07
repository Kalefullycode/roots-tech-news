interface NewsItem {
  id?: string;
  title: string;
  url: string;
  source?: string | { id: string; name: string };
  publishedAt?: string;
}

export class NewsDeduplicator {
  private seenUrls = new Set<string>();
  private seenTitles = new Set<string>();

  // Normalize URL for comparison
  private normalizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      // Remove tracking params, www, trailing slashes
      parsed.searchParams.delete('utm_source');
      parsed.searchParams.delete('utm_medium');
      parsed.searchParams.delete('utm_campaign');
      parsed.searchParams.delete('utm_content');
      parsed.searchParams.delete('ref');
      parsed.searchParams.delete('source');
      let normalized = parsed.origin + parsed.pathname;
      return normalized.replace(/\/$/, '').replace('://www.', '://').toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }

  // Normalize title for fuzzy matching
  private normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')  // Remove punctuation
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim()
      .slice(0, 60);           // Compare first 60 chars
  }

  // Calculate similarity between two titles (Jaccard index)
  private titleSimilarity(title1: string, title2: string): number {
    const words1 = new Set(this.normalizeTitle(title1).split(' ').filter(w => w.length > 2));
    const words2 = new Set(this.normalizeTitle(title2).split(' ').filter(w => w.length > 2));
    
    if (words1.size === 0 || words2.size === 0) {
      return 0;
    }
    
    const intersection = [...words1].filter(w => words2.has(w)).length;
    const union = new Set([...words1, ...words2]).size;
    
    return union > 0 ? intersection / union : 0;
  }

  // Check if item is duplicate
  isDuplicate(item: NewsItem): boolean {
    const normalizedUrl = this.normalizeUrl(item.url);
    const normalizedTitle = this.normalizeTitle(item.title);

    // Exact URL match
    if (this.seenUrls.has(normalizedUrl)) {
      return true;
    }

    // Exact title match
    if (this.seenTitles.has(normalizedTitle)) {
      return true;
    }

    // Fuzzy title match (>70% similar)
    for (const seenTitle of this.seenTitles) {
      if (this.titleSimilarity(item.title, seenTitle) > 0.7) {
        return true;
      }
    }

    return false;
  }

  // Add item to seen set
  markSeen(item: NewsItem): void {
    this.seenUrls.add(this.normalizeUrl(item.url));
    this.seenTitles.add(this.normalizeTitle(item.title));
  }

  // Filter array, removing duplicates
  deduplicate<T extends NewsItem>(items: T[]): T[] {
    const unique: T[] = [];
    
    for (const item of items) {
      if (!this.isDuplicate(item)) {
        this.markSeen(item);
        unique.push(item);
      }
    }
    
    return unique;
  }

  // Reset for new page load
  reset(): void {
    this.seenUrls.clear();
    this.seenTitles.clear();
  }
}

// Singleton instance for cross-component deduplication
export const globalDeduplicator = new NewsDeduplicator();

