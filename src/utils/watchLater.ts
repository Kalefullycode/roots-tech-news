import { AggregatedVideo, WatchLaterVideo } from '@/types/video';

const STORAGE_KEY = 'roots-tech-news-watch-later';

/**
 * Get all watch later videos from localStorage
 */
export function getWatchLaterVideos(): WatchLaterVideo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const videos = JSON.parse(stored) as WatchLaterVideo[];
    // Filter out videos older than 90 days
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
    return videos.filter(v => new Date(v.addedAt).getTime() > ninetyDaysAgo);
  } catch (error) {
    console.error('Error reading watch later videos:', error);
    return [];
  }
}

/**
 * Add video to watch later
 */
export function addToWatchLater(video: AggregatedVideo): void {
  try {
    const videos = getWatchLaterVideos();
    
    // Check if already exists
    if (videos.some(v => v.video.id === video.id)) {
      return;
    }
    
    const newVideo: WatchLaterVideo = {
      id: video.id,
      addedAt: new Date().toISOString(),
      video,
    };
    
    videos.unshift(newVideo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch (error) {
    console.error('Error adding to watch later:', error);
  }
}

/**
 * Remove video from watch later
 */
export function removeFromWatchLater(videoId: string): void {
  try {
    const videos = getWatchLaterVideos();
    const filtered = videos.filter(v => v.video.id !== videoId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from watch later:', error);
  }
}

/**
 * Check if video is in watch later
 */
export function isInWatchLater(videoId: string): boolean {
  const videos = getWatchLaterVideos();
  return videos.some(v => v.video.id === videoId);
}

/**
 * Clear all watch later videos
 */
export function clearWatchLater(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing watch later:', error);
  }
}

