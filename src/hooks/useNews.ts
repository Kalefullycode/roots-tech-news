import { useQuery } from '@tanstack/react-query';
import NewsService, { NewsArticle } from '@/services/NewsService';

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => NewsService.fetchAggregatedNews(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    retry: 2,
  });
};

export const useNewsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['news', category],
    queryFn: async () => {
      const allNews = await NewsService.fetchAggregatedNews();
      return allNews.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
      );
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useTrendingNews = () => {
  return useQuery({
    queryKey: ['trending-news'],
    queryFn: async () => {
      const allNews = await NewsService.fetchAggregatedNews();
      // Return most recent 4 articles for trending
      return allNews.slice(0, 4);
    },
    staleTime: 3 * 60 * 1000, // 3 minutes for trending
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 2,
  });
};