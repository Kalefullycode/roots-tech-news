import { useEffect, useState, lazy, Suspense } from "react";
import { Helmet } from 'react-helmet-async';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Youtube, Play, ExternalLink, Search, Filter, TrendingUp } from "lucide-react";
import YouTubeService, { YouTubeVideo } from "@/services/YouTubeService";
import { Skeleton } from "@/components/ui/skeleton";

const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));

const YouTubePage = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const fetchedVideos = await YouTubeService.fetchAllVideos();
        setVideos(fetchedVideos);
        setFilteredVideos(fetchedVideos);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(fetchedVideos.map(v => v.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch YouTube videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    let filtered = videos;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(v => v.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(v => 
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredVideos(filtered);
  }, [searchQuery, selectedCategory, videos]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <Helmet>
        <title>Tech Videos - RootsTechNews | Latest AI, Startup & Technology Videos</title>
        <meta name="description" content="Watch the latest tech videos on AI, startups, gadgets, and innovation. Curated collection of YouTube content from top tech channels." />
        <meta property="og:title" content="Tech Videos - RootsTechNews" />
        <meta property="og:description" content="Latest AI, Startup & Technology Videos" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://rootstechnews.com/videos" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <Suspense fallback={<div className="h-20 bg-background border-b border-border" />}>
          <Header />
        </Suspense>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background via-background to-red-900/10 border-b border-border">
          <div className="container mx-auto px-4 py-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-red-500/20 rounded-2xl border border-red-500/30">
                <Youtube className="h-12 w-12 text-red-500" />
              </div>
              <div>
                <h1 className="font-orbitron text-5xl font-bold text-glow-primary">
                  Tech Videos
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                  Latest AI, Startup & Innovation Content
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span>
                {videos.length} videos • Updated hourly from top tech channels
              </span>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="bg-card/30 border-b border-border sticky top-16 z-40 backdrop-blur-md">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search videos by title, channel, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-input border-border focus:border-red-500 text-base"
                />
              </form>

              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                {categories.map((category) => {
                  const count = category === 'All' 
                    ? videos.length 
                    : videos.filter(v => v.category === category).length;
                  
                  return (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      className={`whitespace-nowrap ${
                        selectedCategory === category 
                          ? 'bg-red-500 hover:bg-red-600 border-red-600' 
                          : 'hover:border-red-500/50'
                      }`}
                    >
                      {category} ({count})
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing <span className="text-accent font-semibold">{filteredVideos.length}</span> videos
              {searchQuery && <span> for "{searchQuery}"</span>}
              {selectedCategory !== 'All' && <span> in {selectedCategory}</span>}
            </div>
          </div>
        </section>

        {/* Videos Grid */}
        <main className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-lg" />
              ))}
            </div>
          ) : filteredVideos.length === 0 ? (
            <Card className="text-center py-16 bg-card-modern border border-card-border/60">
              <Youtube className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-orbitron text-xl font-bold text-foreground mb-2">
                No videos found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                variant="outline"
                className="border-red-500 hover:bg-red-500/10"
              >
                Clear filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <Card 
                  key={video.id}
                  className="overflow-hidden bg-card-modern border border-card-border/60 hover:border-red-500/50 transition-all hover-lift group cursor-pointer"
                  onClick={() => window.open(video.url, '_blank')}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    <img 
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-red-500 rounded-full p-4">
                        <Play className="h-8 w-8 text-white fill-white" />
                      </div>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white border-red-600">
                      <Youtube className="h-3 w-3 mr-1" />
                      Video
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-orbitron text-sm font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-red-500 transition-colors min-h-[2.5rem]">
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-muted-foreground truncate">{video.channelName}</span>
                      <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                        {video.category}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                      {video.description}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-red-500 transition-colors" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <Suspense fallback={<div className="h-32 bg-muted" />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default YouTubePage;

