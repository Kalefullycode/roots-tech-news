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
  const { data: allNews, ...queryState } = useQuery({
    queryKey: ['news'],
    queryFn: () => NewsService.fetchAggregatedNews(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    retry: 2,
  });

  const filteredNews = allNews?.filter(article => 
    article.category.toLowerCase() === category.toLowerCase()
  ) || [];

  return {
    data: filteredNews,
    ...queryState
  };
};

export const useTrendingNews = () => {
  const { data: allNews, ...queryState } = useQuery({
    queryKey: ['news'],
    queryFn: () => NewsService.fetchAggregatedNews(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    retry: 2,
  });

  const trendingNews = allNews?.slice(0, 4) || [];

  return {
    data: trendingNews,
    ...queryState
  };
};