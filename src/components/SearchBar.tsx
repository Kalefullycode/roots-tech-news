import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, Filter, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import SearchService from '@/services/SearchService';

interface SearchBarProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
  availableCategories?: string[];
  availableSources?: string[];
  standalone?: boolean; // If true, shows results dropdown instead of calling onSearch
}

interface SearchFilters {
  category?: string;
  source?: string;
}

// Fetch all articles for searching
async function fetchAllArticles() {
  const response = await fetch('/.netlify/functions/fetch-rss');
  if (!response.ok) throw new Error('Failed to fetch articles');
  const data = await response.json();
  return data.articles;
}

const SearchBar = ({ 
  onSearch, 
  availableCategories = [], 
  availableSources = [], 
  standalone = true // Default to standalone mode (shows results)
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch articles for real-time search
  const { data: articles } = useQuery({
    queryKey: ['all-articles'],
    queryFn: fetchAllArticles,
    staleTime: 300000, // 5 minutes
    enabled: standalone // Only fetch if in standalone mode
  });

  // Filter articles based on search query and filters
  const searchResults = articles && query.trim().length > 2
    ? articles
        .filter((article: any) => {
          const searchText = `${article.title} ${article.description}`.toLowerCase();
          const matchesQuery = searchText.includes(query.toLowerCase());
          
          const matchesCategory = !filters.category || 
            article.category?.toLowerCase().includes(filters.category.toLowerCase()) ||
            article.source?.toLowerCase().includes(filters.category.toLowerCase());
          
          const matchesSource = !filters.source || 
            article.source?.toLowerCase().includes(filters.source.toLowerCase());
          
          return matchesQuery && matchesCategory && matchesSource;
        })
        .slice(0, 5) // Top 5 results
    : [];

  // Extract available categories and sources from articles
  const dynamicCategories = articles
    ? Array.from(new Set(articles.map((a: any) => a.category))).slice(0, 10)
    : availableCategories;
  
  const dynamicSources = articles
    ? Array.from(new Set(articles.map((a: any) => a.source))).slice(0, 10)
    : availableSources;

  useEffect(() => {
    setRecentSearches(SearchService.getRecentSearches());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      SearchService.addRecentSearch(finalQuery);
      setRecentSearches(SearchService.getRecentSearches());
      
      if (standalone) {
        // In standalone mode, show results dropdown
        setShowResults(true);
        setShowSuggestions(false);
      } else if (onSearch) {
        // In callback mode, call the parent's search handler
        onSearch(finalQuery, filters);
        setShowSuggestions(false);
        setShowResults(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setFilters({});
    setShowResults(false);
    setShowSuggestions(false);
    if (onSearch && !standalone) {
      onSearch('', {});
    }
    inputRef.current?.focus();
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters };
    if (value === 'all') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    
    if (standalone && query.trim().length > 2) {
      // In standalone mode, filters affect visible results
      setShowResults(true);
    } else if (onSearch && !standalone) {
      onSearch(query, newFilters);
    }
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search AI & tech news..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (standalone && e.target.value.length > 2) {
              setShowResults(true);
              setShowSuggestions(false);
            } else if (e.target.value.length <= 2) {
              setShowResults(false);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length > 2 && standalone) {
              setShowResults(true);
            } else {
              setShowSuggestions(true);
            }
          }}
          className="pl-10 pr-20 h-12 text-base bg-background/60 backdrop-blur-sm border-border/60 focus:border-primary/70 rounded-xl"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-8 w-8 p-0 relative ${activeFiltersCount > 0 ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Filter className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="absolute top-14 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-sm border-border/60">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-32">
              <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
              <Select
                value={filters.category || 'all'}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {dynamicCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-32">
              <label className="text-sm font-medium text-foreground mb-2 block">Source</label>
              <Select
                value={filters.source || 'all'}
                onValueChange={(value) => handleFilterChange('source', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {dynamicSources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

      {/* Search Results - Live Articles (Standalone Mode) */}
      {standalone && showResults && searchResults.length > 0 && (
        <Card 
          ref={suggestionsRef}
          className="absolute top-14 left-0 right-0 z-50 max-h-[500px] overflow-y-auto bg-background/95 backdrop-blur-sm border-border/60"
        >
          <div className="p-3 border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                {activeFiltersCount > 0 && <span className="text-muted-foreground"> with {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}</span>}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResults(false)}
                className="h-6 text-xs"
              >
                Close
              </Button>
            </div>
          </div>
          
          {searchResults.map((article: any, index: number) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 hover:bg-accent/50 transition-colors border-b border-border/30 last:border-b-0"
              onClick={() => {
                setShowResults(false);
                SearchService.addRecentSearch(query);
              }}
            >
              <div className="flex gap-3">
                {article.image && (
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-20 h-20 object-cover rounded flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-foreground font-semibold text-sm mb-1 line-clamp-2 flex items-start gap-2">
                    {article.title}
                    <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                  </h4>
                  <p className="text-muted-foreground text-xs line-clamp-2 mb-2">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="secondary" className="text-xs">
                      {article.source}
                    </Badge>
                    <span className="text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </Card>
      )}

      {/* No Results (Standalone Mode) */}
      {standalone && showResults && query.length > 2 && searchResults.length === 0 && (
        <Card 
          ref={suggestionsRef}
          className="absolute top-14 left-0 right-0 z-50 p-6 text-center bg-background/95 backdrop-blur-sm border-border/60"
        >
          <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium mb-2">No results found for "{query}"</p>
          <p className="text-sm text-muted-foreground mb-4">
            Try searching for: AI, machine learning, startups, tech news
          </p>
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilters({});
                setShowFilters(false);
              }}
            >
              Clear {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}
            </Button>
          )}
        </Card>
      )}

      {/* Recent Searches (shown when no active search) */}
      {showSuggestions && !showResults && (recentSearches.length > 0) && (
        <Card 
          ref={suggestionsRef}
          className="absolute top-14 left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur-sm border-border/60"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Recent Searches</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  SearchService.clearRecentSearches();
                  setRecentSearches([]);
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-accent/80 transition-colors duration-200 flex items-center gap-1"
                  onClick={() => {
                    setQuery(search);
                    handleSearch(search);
                  }}
                >
                  <Clock className="h-3 w-3" />
                  {search}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;