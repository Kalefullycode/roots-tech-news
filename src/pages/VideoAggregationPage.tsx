import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HeroSection } from '@/components/video-aggregation/HeroSection';
import { StickyNav } from '@/components/video-aggregation/StickyNav';
import { VideoFilters } from '@/components/video-aggregation/VideoFilters';
import { VideoCard } from '@/components/video-aggregation/VideoCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Youtube } from 'lucide-react';
import { useVideoAggregation } from '@/hooks/useVideoAggregation';
import { VideoAggregationFilters, AggregatedVideo, ViewMode, VideoSection } from '@/types/video';

const INITIAL_FILTERS: VideoAggregationFilters = {
  category: 'All',
  searchQuery: '',
  sortBy: 'Latest',
  dateFilter: 'all',
  sourceFilter: 'all',
  durationFilter: 'all',
  topicFilter: 'all',
};

// Define content sections
const CONTENT_SECTIONS: Array<{ id: string; title: string; category: VideoAggregationFilters['category'] }> = [
  { id: 'latest', title: 'Latest Tech News', category: 'Breaking News' },
  { id: 'trending', title: 'Trending This Week', category: 'All' },
  { id: 'ai-ml', title: 'AI & ML', category: 'AI/ML' },
  { id: 'startups', title: 'Startup Ecosystem', category: 'Startups' },
  { id: 'products', title: 'Product Launches', category: 'Product Launches' },
  { id: 'conferences', title: 'Conference Coverage', category: 'Conferences' },
  { id: 'interviews', title: 'Interviews', category: 'Interviews' },
  { id: 'tutorials', title: 'Tutorials', category: 'Tutorials' },
  { id: 'quick', title: 'Quick Bytes', category: 'Quick Takes' },
];

export default function VideoAggregationPage() {
  const [filters, setFilters] = useState<VideoAggregationFilters>(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [featuredVideo, setFeaturedVideo] = useState<AggregatedVideo | null>(null);
  const [displayedVideos, setDisplayedVideos] = useState<AggregatedVideo[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const { videos, allVideos, isLoading, sources, topics } = useVideoAggregation(filters);

  // Set featured video on load
  useEffect(() => {
    if (allVideos.length > 0 && !featuredVideo) {
      // Get most viewed recent video as featured
      const sorted = [...allVideos]
        .sort((a, b) => {
          const aViews = parseInt(a.viewCount?.replace(/[^0-9]/g, '') || '0');
          const bViews = parseInt(b.viewCount?.replace(/[^0-9]/g, '') || '0');
          return bViews - aViews;
        })
        .slice(0, 1);
      if (sorted[0]) {
        setFeaturedVideo(sorted[0]);
      }
    }
  }, [allVideos, featuredVideo]);

  // Initialize displayed videos
  useEffect(() => {
    setDisplayedVideos(videos.slice(0, 24)); // Initial load: 24 videos
  }, [videos]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && displayedVideos.length < videos.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            const nextBatch = videos.slice(displayedVideos.length, displayedVideos.length + 12);
            setDisplayedVideos((prev) => [...prev, ...nextBatch]);
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [displayedVideos.length, videos.length, isLoadingMore, videos]);

  const handleFiltersChange = useCallback((newFilters: Partial<VideoAggregationFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setDisplayedVideos([]); // Reset displayed videos when filters change
  }, []);

  const handleCategoryChange = useCallback((category: VideoAggregationFilters['category']) => {
    setFilters((prev) => ({ ...prev, category }));
    setDisplayedVideos([]);
    // Scroll to top when category changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClearSearch = useCallback(() => {
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
  }, []);

  const handlePlayVideo = useCallback((video: AggregatedVideo) => {
    setFeaturedVideo(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Group videos by sections for display
  const videoSections = useMemo(() => {
    if (filters.category !== 'All' || filters.searchQuery) {
      // If filtering, show single section
      return [];
    }

    return CONTENT_SECTIONS.map((section): VideoSection => {
      const sectionVideos = allVideos
        .filter((video) => {
          if (section.category === 'All') {
            // For trending, get most viewed recent videos
            return true;
          }
          return video.category === section.category;
        })
        .slice(0, 6);

      return {
        id: section.id,
        title: section.title,
        category: section.category,
        videos: sectionVideos,
      };
    }).filter((section) => section.videos.length > 0);
  }, [allVideos, filters.category, filters.searchQuery]);

  return (
    <>
      <Helmet>
        <title>Video Aggregation | Roots Tech News</title>
        <meta
          name="description"
          content="Watch the latest tech videos from top channels including TechCrunch, MKBHD, The Verge, AI Explained, and more. Stay updated with breaking news, product launches, tutorials, and interviews."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          {featuredVideo && (
            <div className="mb-8">
              <HeroSection
                featuredVideo={featuredVideo}
                onClose={() => setFeaturedVideo(null)}
              />
            </div>
          )}

          {/* Filters */}
          <div className="mb-6">
            <VideoFilters
              filters={filters}
              viewMode={viewMode}
              onFiltersChange={handleFiltersChange}
              onViewModeChange={setViewMode}
              onClearSearch={handleClearSearch}
            />
          </div>

          {/* Sticky Navigation */}
          <StickyNav
            activeCategory={filters.category}
            onCategoryChange={handleCategoryChange}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <span className="ml-4 text-lg text-muted-foreground">Loading videos...</span>
            </div>
          )}

          {/* Error State */}
          {!isLoading && videos.length === 0 && (
            <Card className="p-12 text-center">
              <Youtube className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No Videos Found</h2>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search query.
              </p>
              <Button onClick={() => setFilters(INITIAL_FILTERS)}>Reset Filters</Button>
            </Card>
          )}

          {/* Video Sections or Grid */}
          {!isLoading && videos.length > 0 && (
            <>
              {videoSections.length > 0 && filters.category === 'All' && !filters.searchQuery ? (
                // Show sections when no filters
                <div className="space-y-12">
                  {videoSections.map((section) => (
                    <section key={section.id} id={section.id}>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-foreground">
                          {section.title}
                        </h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCategoryChange(section.category)}
                        >
                          View All →
                        </Button>
                      </div>
                      <div
                        className={
                          viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-4'
                        }
                      >
                        {section.videos.map((video) => (
                          <VideoCard
                            key={video.id}
                            video={video}
                            viewMode={viewMode}
                            onPlay={handlePlayVideo}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                // Show filtered grid/list
                <>
                  <div className="mb-4 text-sm text-muted-foreground">
                    Showing {displayedVideos.length} of {videos.length} videos
                  </div>
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-4'
                    }
                  >
                    {displayedVideos.map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        viewMode={viewMode}
                        onPlay={handlePlayVideo}
                      />
                    ))}
                  </div>

                  {/* Infinite scroll trigger */}
                  {displayedVideos.length < videos.length && (
                    <div ref={observerTarget} className="h-20 flex items-center justify-center">
                      {isLoadingMore && (
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      )}
                    </div>
                  )}

                  {/* Load More Button (fallback) */}
                  {displayedVideos.length < videos.length && !isLoadingMore && (
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={() => {
                          setIsLoadingMore(true);
                          setTimeout(() => {
                            const nextBatch = videos.slice(
                              displayedVideos.length,
                              displayedVideos.length + 12
                            );
                            setDisplayedVideos((prev) => [...prev, ...nextBatch]);
                            setIsLoadingMore(false);
                          }, 300);
                        }}
                      >
                        Load More Videos
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}

