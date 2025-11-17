import { AggregatedVideo, SortOption, DurationFilter, VideoCategory } from '@/types/video';

/**
 * Format duration string to seconds for comparison
 */
export function durationToSeconds(duration: string | undefined): number {
  if (!duration) return 0;
  
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]; // MM:SS
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
  }
  return 0;
}

/**
 * Parse view count string to number
 */
export function parseViewCount(viewCount: string | undefined): number {
  if (!viewCount) return 0;
  
  const match = viewCount.match(/([\d.]+)([KM])?/);
  if (!match) return 0;
  
  const num = parseFloat(match[1]);
  const unit = match[2];
  
  if (unit === 'M') return num * 1000000;
  if (unit === 'K') return num * 1000;
  return num;
}

/**
 * Sort videos based on sort option
 */
export function sortVideos(videos: AggregatedVideo[], sortBy: SortOption): AggregatedVideo[] {
  const sorted = [...videos];
  
  switch (sortBy) {
    case 'Latest':
      return sorted.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    
    case 'Most Viewed':
      return sorted.sort((a, b) => 
        parseViewCount(b.viewCount) - parseViewCount(a.viewCount)
      );
    
    case 'Duration':
      return sorted.sort((a, b) => 
        durationToSeconds(a.duration) - durationToSeconds(b.duration)
      );
    
    case 'Trending':
      return sorted.sort((a, b) => {
        const scoreA = calculateTrendingScore(a);
        const scoreB = calculateTrendingScore(b);
        return scoreB - scoreA;
      });
    
    default:
      return sorted;
  }
}

/**
 * Calculate trending score based on views, recency, and engagement
 */
function calculateTrendingScore(video: AggregatedVideo): number {
  const views = parseViewCount(video.viewCount);
  const daysSincePublished = 
    (Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
  
  // Higher score for more views and more recent videos
  const recencyFactor = Math.max(0, 1 - daysSincePublished / 30); // Decay over 30 days
  const viewFactor = Math.log10(views + 1) / 10; // Logarithmic scale
  
  return (views * recencyFactor) + (viewFactor * 1000000);
}

/**
 * Filter videos by duration
 */
export function filterByDuration(
  videos: AggregatedVideo[], 
  filter: DurationFilter
): AggregatedVideo[] {
  if (filter === 'all') return videos;
  
  return videos.filter(video => {
    const seconds = durationToSeconds(video.duration);
    
    switch (filter) {
      case 'short':
        return seconds > 0 && seconds <= 300; // 0-5 minutes
      case 'medium':
        return seconds > 300 && seconds <= 1200; // 5-20 minutes
      case 'long':
        return seconds > 1200; // 20+ minutes
      default:
        return true;
    }
  });
}

/**
 * Filter videos by date range
 */
export function filterByDate(
  videos: AggregatedVideo[], 
  dateFilter: string
): AggregatedVideo[] {
  if (dateFilter === 'all') return videos;
  
  const now = Date.now();
  const videoDate = (date: string) => new Date(date).getTime();
  
  return videos.filter(video => {
    const publishedTime = videoDate(video.publishedAt);
    const diffMs = now - publishedTime;
    
    switch (dateFilter) {
      case 'today':
        return diffMs < 24 * 60 * 60 * 1000;
      case 'week':
        return diffMs < 7 * 24 * 60 * 60 * 1000;
      case 'month':
        return diffMs < 30 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  });
}

/**
 * Filter videos by category
 */
export function filterByCategory(
  videos: AggregatedVideo[], 
  category: VideoCategory
): AggregatedVideo[] {
  if (category === 'All') return videos;
  
  // Map display categories to video categories/topics
  const categoryMap: Record<VideoCategory, string[]> = {
    'All': [],
    'Breaking News': ['breaking', 'news', 'latest'],
    'AI/ML': ['ai', 'machine learning', 'artificial intelligence', 'ml'],
    'Startups': ['startup', 'startups', 'venture'],
    'Product Launches': ['launch', 'product', 'release', 'announcement'],
    'Interviews': ['interview', 'conversation', 'talk'],
    'Tutorials': ['tutorial', 'how to', 'guide', 'learn'],
    'Conferences': ['conference', 'keynote', 'summit', 'event'],
    'Quick Takes': ['quick', 'brief', 'summary'],
    'Deep Dives': ['deep dive', 'analysis', 'explained', 'review'],
  };
  
  const keywords = categoryMap[category] || [];
  if (keywords.length === 0) return videos;
  
  return videos.filter(video => {
    const searchText = `${video.title} ${video.description} ${video.category} ${video.topic || ''}`.toLowerCase();
    return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
  });
}

/**
 * Search videos by query
 */
export function searchVideos(
  videos: AggregatedVideo[], 
  query: string
): AggregatedVideo[] {
  if (!query.trim()) return videos;
  
  const lowerQuery = query.toLowerCase();
  
  return videos.filter(video => {
    const searchText = `${video.title} ${video.description} ${video.channelName} ${video.source} ${video.topic || ''}`.toLowerCase();
    return searchText.includes(lowerQuery);
  });
}

/**
 * Get relative time string
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}

/**
 * Get category color
 */
export function getCategoryColor(category: VideoCategory): string {
  const colorMap: Record<VideoCategory, string> = {
    'All': 'bg-primary/20 text-primary border-primary/30',
    'Breaking News': 'bg-red-500/20 text-red-400 border-red-500/30',
    'AI/ML': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Startups': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Product Launches': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Interviews': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Tutorials': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Conferences': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Quick Takes': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Deep Dives': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  };
  
  return colorMap[category] || colorMap['All'];
}

