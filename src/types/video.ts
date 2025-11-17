import { YouTubeVideo } from '@/services/YouTubeService';

export type VideoCategory = 
  | 'All' 
  | 'Breaking News' 
  | 'AI/ML' 
  | 'Startups' 
  | 'Product Launches' 
  | 'Interviews' 
  | 'Tutorials' 
  | 'Conferences' 
  | 'Quick Takes' 
  | 'Deep Dives';

export type SortOption = 'Latest' | 'Trending' | 'Most Viewed' | 'Duration';
export type ViewMode = 'grid' | 'list';
export type DurationFilter = 'all' | 'short' | 'medium' | 'long';

export interface VideoAggregationFilters {
  category: VideoCategory;
  searchQuery: string;
  sortBy: SortOption;
  dateFilter: string; // 'all' | 'today' | 'week' | 'month'
  sourceFilter: string; // 'all' | specific source
  durationFilter: DurationFilter;
  topicFilter: string; // 'all' | specific topic
}

export interface AggregatedVideo extends YouTubeVideo {
  source: string; // e.g., 'TechCrunch', 'MKBHD', etc.
  topic?: string;
  trendingScore?: number;
  engagementScore?: number;
}

export interface VideoSection {
  id: string;
  title: string;
  category: VideoCategory;
  videos: AggregatedVideo[];
}

export interface WatchLaterVideo {
  id: string;
  addedAt: string;
  video: AggregatedVideo;
}

