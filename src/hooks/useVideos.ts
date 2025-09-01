import { useQuery } from '@tanstack/react-query';
import VideoService from '@/services/VideoService';

export const useVideos = () => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: () => VideoService.fetchLatestVideos(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    retry: 2,
  });
};

export const useVideosByCategory = (category: string) => {
  return useQuery({
    queryKey: ['videos', category],
    queryFn: () => VideoService.fetchVideosByCategory(category),
    staleTime: 10 * 60 * 1000,
    retry: 2,
    enabled: !!category
  });
};

export const useVideoCategories = () => {
  return VideoService.getCategories();
};

export const useVideoChannels = () => {
  return VideoService.getChannels();
};