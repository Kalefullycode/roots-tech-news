import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NewsArticle } from '@/services/NewsService';
import SearchService from '@/services/SearchService';
import RSSService from '@/services/RSSService';

interface SearchFilters {
  category?: string;
  source?: string;
}

interface UseSearchOptions {
  initialQuery?: string;
  initialFilters?: SearchFilters;
}

export const useSearch = (options: UseSearchOptions = {}) => {
  const [query, setQuery] = useState(options.initialQuery || '');
  const [filters, setFilters] = useState<SearchFilters>(options.initialFilters || {});
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([]);

  // Fetch all articles for search
  const { data: allArticles, isLoading } = useQuery({
    queryKey: ['search-articles'],
    queryFn: () => RSSService.fetchAllRSSFeeds(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });

  // Initialize search service when articles are loaded
  useEffect(() => {
    if (allArticles) {
      SearchService.initializeSearch(allArticles);
    }
  }, [allArticles]);

  // Perform search when query or filters change
  useEffect(() => {
    if (allArticles) {
      const results = SearchService.search(query, filters);
      setSearchResults(results);
    }
  }, [query, filters, allArticles]);

  // Get available filter options
  const filterOptions = useMemo(() => {
    if (!allArticles) return { categories: [], sources: [] };
    
    return {
      categories: SearchService.getCategories(),
      sources: SearchService.getSources()
    };
  }, [allArticles]);

  const search = (newQuery: string, newFilters: SearchFilters = {}) => {
    setQuery(newQuery);
    setFilters(newFilters);
  };

  const clearSearch = () => {
    setQuery('');
    setFilters({});
  };

  return {
    query,
    filters,
    searchResults,
    filterOptions,
    isLoading,
    search,
    clearSearch,
    setQuery,
    setFilters
  };
};

export const usePopularTags = () => {
  const { data: allArticles } = useQuery({
    queryKey: ['search-articles'],
    queryFn: () => RSSService.fetchAllRSSFeeds(),
    staleTime: 5 * 60 * 1000,
  });

  return useMemo(() => {
    if (!allArticles) return [];
    
    SearchService.initializeSearch(allArticles);
    return SearchService.getPopularTags();
  }, [allArticles]);
};