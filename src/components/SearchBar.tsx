import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchService from '@/services/SearchService';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  availableCategories?: string[];
  availableSources?: string[];
}

interface SearchFilters {
  category?: string;
  source?: string;
}

const SearchBar = ({ onSearch, availableCategories = [], availableSources = [] }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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
      onSearch(finalQuery, filters);
      setShowSuggestions(false);
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
    onSearch('', {});
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
    onSearch(query, newFilters);
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
          placeholder="Search tech news, articles, and videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
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
                  {availableCategories.map(category => (
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
                  {availableSources.map(source => (
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

      {/* Search Suggestions */}
      {showSuggestions && (recentSearches.length > 0) && (
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