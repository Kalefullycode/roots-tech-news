import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { youtubeService } from '@/services/YouTubeService';
import { AggregatedVideo, VideoAggregationFilters } from '@/types/video';
import {
  sortVideos,
  filterByCategory,
  filterByDate,
  filterByDuration,
  searchVideos,
} from '@/utils/videoUtils';

// Map channel names to sources
const CHANNEL_SOURCE_MAP: Record<string, string> = {
  'TechCrunch': 'TechCrunch',
  'The Verge': 'The Verge',
  'Marques Brownlee': 'MKBHD',
  'CNET': 'CNET',
  'Engadget': 'Engadget',
  'Two Minute Papers': 'Two Minute Papers',
  'AI Explained': 'AI Explained',
  'Lex Fridman': 'Lex Fridman',
  'Bloomberg': 'Bloomberg Tech',
  'Fireship': 'Fireship',
};

// Extract source from channel name
function getSource(channelName: string): string {
  return CHANNEL_SOURCE_MAP[channelName] || channelName;
}

// Categorize video based on title and description
function categorizeVideo(video: AggregatedVideo): string {
  const text = `${video.title} ${video.description}`.toLowerCase();
  
  if (text.includes('breaking') || text.includes('news')) return 'Breaking News';
  if (text.includes('ai') || text.includes('machine learning') || text.includes('ml')) return 'AI/ML';
  if (text.includes('startup') || text.includes('venture')) return 'Startups';
  if (text.includes('launch') || text.includes('release') || text.includes('announcement')) return 'Product Launches';
  if (text.includes('interview') || text.includes('conversation') || text.includes('talk')) return 'Interviews';
  if (text.includes('tutorial') || text.includes('how to') || text.includes('guide')) return 'Tutorials';
  if (text.includes('conference') || text.includes('keynote') || text.includes('summit')) return 'Conferences';
  if (text.includes('quick') || text.includes('brief') || text.includes('summary')) return 'Quick Takes';
  if (text.includes('deep dive') || text.includes('analysis') || text.includes('explained')) return 'Deep Dives';
  
  return video.category || 'All';
}

async function fetchAggregatedVideos(): Promise<AggregatedVideo[]> {
  try {
    const videos = await youtubeService.fetchAllVideos();
    
    // Transform to AggregatedVideo format
    return videos.map((video): AggregatedVideo => ({
      ...video,
      source: getSource(video.channelName),
      topic: categorizeVideo(video as AggregatedVideo),
      category: categorizeVideo(video as AggregatedVideo) as any,
    }));
  } catch (error) {
    console.error('Error fetching aggregated videos:', error);
    return [];
  }
}

export function useVideoAggregation(filters: VideoAggregationFilters) {
  const { data: allVideos = [], isLoading, error } = useQuery({
    queryKey: ['aggregated-videos'],
    queryFn: fetchAggregatedVideos,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  const filteredVideos = useMemo(() => {
    let result = [...allVideos];

    // Apply filters in order
    if (filters.searchQuery) {
      result = searchVideos(result, filters.searchQuery);
    }

    if (filters.category !== 'All') {
      result = filterByCategory(result, filters.category);
    }

    if (filters.dateFilter !== 'all') {
      result = filterByDate(result, filters.dateFilter);
    }

    if (filters.durationFilter !== 'all') {
      result = filterByDuration(result, filters.durationFilter);
    }

    if (filters.sourceFilter && filters.sourceFilter !== 'all') {
      result = result.filter(v => v.source === filters.sourceFilter);
    }

    if (filters.topicFilter && filters.topicFilter !== 'all') {
      result = result.filter(v => v.topic === filters.topicFilter);
    }

    // Sort
    result = sortVideos(result, filters.sortBy);

    return result;
  }, [allVideos, filters]);

  // Get unique sources for filter
  const sources = useMemo(() => {
    const uniqueSources = new Set(allVideos.map(v => v.source));
    return Array.from(uniqueSources).sort();
  }, [allVideos]);

  // Get unique topics for filter
  const topics = useMemo(() => {
    const uniqueTopics = new Set(allVideos.map(v => v.topic).filter(Boolean));
    return Array.from(uniqueTopics).sort();
  }, [allVideos]);

  return {
    videos: filteredVideos,
    allVideos,
    isLoading,
    error,
    sources,
    topics,
  };
}

