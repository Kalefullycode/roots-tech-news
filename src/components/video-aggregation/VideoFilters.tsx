import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search, Grid3x3, List, X } from 'lucide-react';
import { VideoCategory, SortOption, ViewMode, DurationFilter, VideoAggregationFilters } from '@/types/video';

interface VideoFiltersProps {
  filters: VideoAggregationFilters;
  viewMode: ViewMode;
  onFiltersChange: (filters: Partial<VideoAggregationFilters>) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onClearSearch: () => void;
}

const CATEGORIES: VideoCategory[] = [
  'All',
  'Breaking News',
  'AI/ML',
  'Startups',
  'Product Launches',
  'Interviews',
  'Tutorials',
  'Conferences',
  'Quick Takes',
  'Deep Dives',
];

const SORT_OPTIONS: SortOption[] = ['Latest', 'Trending', 'Most Viewed', 'Duration'];
const DATE_FILTERS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];
const DURATION_FILTERS: { value: DurationFilter; label: string }[] = [
  { value: 'all', label: 'All Durations' },
  { value: 'short', label: 'Short (<5 min)' },
  { value: 'medium', label: 'Medium (5-20 min)' },
  { value: 'long', label: 'Long (20+ min)' },
];

export function VideoFilters({
  filters,
  viewMode,
  onFiltersChange,
  onViewModeChange,
  onClearSearch,
}: VideoFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search videos..."
          value={filters.searchQuery}
          onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
          className="pl-10 pr-10"
        />
        {filters.searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={onClearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <Select
          value={filters.category}
          onValueChange={(value) => onFiltersChange({ category: value as VideoCategory })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Filter */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => onFiltersChange({ sortBy: value as SortOption })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Select
          value={filters.dateFilter}
          onValueChange={(value) => onFiltersChange({ dateFilter: value })}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            {DATE_FILTERS.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Duration Filter */}
        <Select
          value={filters.durationFilter}
          onValueChange={(value) => onFiltersChange({ durationFilter: value as DurationFilter })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            {DURATION_FILTERS.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* View Mode Toggle */}
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => value && onViewModeChange(value as ViewMode)}
          className="ml-auto"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Grid3x3 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}

