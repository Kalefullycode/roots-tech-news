import { useEffect, useState, lazy, Suspense } from "react";
import { Helmet } from 'react-helmet-async';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Youtube, Play, ExternalLink, Search, Filter, TrendingUp } from "lucide-react";
import YouTubeService, { YouTubeVideo } from "@/services/YouTubeService";
import { Skeleton } from "@/components/ui/skeleton";

// RSS.app Feed IDs - Replace URLs with actual Feed IDs from RSS.app dashboard
// 
// SETUP INSTRUCTIONS:
// 1. Go to https://rss.app/new-rss-feed/create-youtube-rss-feed
// 2. Create feeds for each category below
// 3. After creating each feed, go to "Embed" section and copy the Feed ID
// 4. Replace the URLs below with your Feed IDs (short alphanumeric strings)
//
// Example: 'AI Videos': 'tTCtnPmhJDGhOAbH' (not a URL!)
const RSSAPP_FEEDS = {
  'All Videos': import.meta.env.VITE_RSSAPP_FEED_ID || '', // Main feed ID from env or set here
  'AI Videos': '', // Replace with feed ID from RSS.app
  'AI News': '', // Replace with feed ID from RSS.app
  'Cyber Security': '', // Replace with feed ID from RSS.app
  'Virtual Reality': '', // Replace with feed ID from RSS.app
  'Business': '', // Replace with feed ID from RSS.app
  'World News': '', // Replace with feed ID from RSS.app
  'Technology': '', // Replace with feed ID from RSS.app
  'Venture Capital': '', // Replace with feed ID from RSS.app
  'Artificial Intelligence': '', // Replace with feed ID from RSS.app
};

// Temporary fallback URLs (for reference - these need to be converted to feed IDs)
const RSSAPP_FEED_URLS = {
  'AI Videos': 'https://rss.app/rss-feed?keyword=AI%20videos',
  'AI News': 'https://rss.app/rss-feed?keyword=AI%20News',
  'Cyber Security': 'https://rss.app/rss-feed?keyword=Cyber%20Security',
  'Virtual Reality': 'https://rss.app/rss-feed?keyword=Virtual%20Reality',
  'Business': 'https://rss.app/rss-feed?topicId=business',
  'World News': 'https://rss.app/rss-feed?topicId=world-news',
  'Technology': 'https://rss.app/discover/technology',
  'Venture Capital': 'https://rss.app/rss-feed?keyword=Venture%20Capital',
  'Artificial Intelligence': 'https://rss.app/rss-feed?keyword=Artificial%20Intelligence',
};

// Get feed ID from URL (RSS.app widget needs feed IDs, not URLs)
// Feed IDs are short alphanumeric strings like 'tTCtnPmhJDGhOAbH'
const getFeedIdFromUrl = (urlOrId: string): string => {
  // If it's already a feed ID (short alphanumeric, no http/rss.app), return as is
  if (!urlOrId.includes('rss.app') && !urlOrId.includes('http') && !urlOrId.includes('/') && urlOrId.length < 50) {
    return urlOrId;
  }
  // If empty, return empty (will show setup message)
  if (!urlOrId || urlOrId.trim() === '') {
    return '';
  }
  // For URLs, try to extract ID (though RSS.app widget needs actual feed IDs)
  const feedIdMatch = urlOrId.match(/feed\/([^/?]+)/);
  const discoverMatch = urlOrId.match(/discover\/([^/?]+)/);
  return feedIdMatch ? feedIdMatch[1] : (discoverMatch ? discoverMatch[1] : '');
};

const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));

const YouTubePage = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);
  const [rssappLoaded, setRssappLoaded] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<string>('All Videos');
  const [useRSSApp] = useState(true); // Always use RSS.app with keyword feeds

  const fetchVideosFromService = async () => {
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

  // Load RSS.app widget script
  useEffect(() => {
    const scriptId = 'rssapp-youtube-wall-script';
    
    // Check if script already exists
    if (document.getElementById(scriptId)) {
      setRssappLoaded(true);
      setIsLoading(false);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://widget.rss.app/v1/wall.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      setRssappLoaded(true);
      setIsLoading(false);
    };
    script.onerror = () => {
      console.error('Failed to load RSS.app widget');
      setIsLoading(false);
      // Fallback to YouTubeService
      fetchVideosFromService();
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount if component is unmounted
      const existingScript = document.getElementById(scriptId);
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  // Update feed when category changes
  useEffect(() => {
    if (rssappLoaded && selectedFeed) {
      setIsLoading(true);
      // Force widget to reload with new feed
      setTimeout(() => {
        const wallElement = document.querySelector('rssapp-wall');
        if (wallElement) {
          // Remove old widget
          wallElement.remove();
        }
        // Create new widget with updated feed
        const wrapper = document.querySelector('.rssapp-wrapper');
        if (wrapper) {
          const newWall = document.createElement('rssapp-wall');
          const feedUrl = RSSAPP_FEEDS[selectedFeed as keyof typeof RSSAPP_FEEDS] || RSSAPP_FEEDS['All Videos'];
          const feedId = getFeedIdFromUrl(feedUrl);
          newWall.setAttribute('id', feedId);
          wrapper.appendChild(newWall);
          setIsLoading(false);
        }
      }, 100);
    }
  }, [selectedFeed, rssappLoaded]);

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
        <title>Latest AI & Tech Videos - RootsTechNews | 200+ Top Creators</title>
        <meta name="description" content="Watch the latest AI and technology videos from 200+ top creators. Stay updated with ChatGPT, Claude, Google AI, and tech innovations." />
        <meta property="og:title" content="Latest AI & Tech Videos | RootsTechNews" />
        <meta property="og:description" content="200+ top AI & tech creators in one place" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rootstechnews.com/videos" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Latest AI & Tech Videos" />
        <meta name="twitter:description" content="200+ top AI & tech creators in one place" />
        <link rel="canonical" href="https://rootstechnews.com/videos" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <Suspense fallback={<div className="h-20 bg-background border-b border-border" />}>
          <Header />
        </Suspense>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b border-purple-500/20">
          <div className="container mx-auto px-4 py-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-600/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
                <Youtube className="h-12 w-12 text-red-500" />
              </div>
              <div>
                <h1 className="font-orbitron text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                  🎥 Latest AI & Tech Videos
                </h1>
                <p className="text-xl text-gray-300 mt-2">
                  Stay ahead with the latest insights from 200+ top AI and technology creators
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-400">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span>
                {useRSSApp ? '200+ channels' : `${videos.length} videos`} • Updated every 2-4 hours from top tech channels
              </span>
            </div>
          </div>
        </section>

        {/* Filter Buttons Section - Show for both RSS.app and YouTubeService */}
          <section className="bg-gray-900/50 border-b border-purple-500/20 sticky top-16 z-40 backdrop-blur-md">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col lg:flex-row gap-4">
              {/* Search - Only show if not using RSS.app */}
              {!useRSSApp && (
                <form onSubmit={handleSearch} className="flex-1 relative">
                  <label htmlFor="youtube-search-input" className="sr-only">
                    Search videos
                  </label>
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <Input
                    id="youtube-search-input"
                    name="search"
                    type="search"
                    placeholder="Search videos by title, channel, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-gray-800 border-purple-500/30 focus:border-purple-500 text-base text-white placeholder-gray-500"
                    aria-label="Search videos by title, channel, or description"
                  />
                </form>
              )}

              {/* Category Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
                {useRSSApp ? (
                  // Filter buttons for RSS.app keyword feeds
                  Object.keys(RSSAPP_FEEDS).map((category) => (
                    <Button
                      key={category}
                      onClick={() => {
                        setSelectedFeed(category);
                        setIsLoading(true);
                      }}
                      variant={selectedFeed === category ? 'default' : 'outline'}
                      className={`whitespace-nowrap ${
                        selectedFeed === category
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white'
                          : 'bg-gray-800/50 border-purple-500/30 text-gray-300 hover:border-purple-500/50'
                      }`}
                    >
                      {category}
                    </Button>
                  ))
                ) : (
                  // Filter buttons for YouTubeService (dynamic categories)
                  categories.map((category) => {
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
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white' 
                            : 'bg-gray-800/50 border-purple-500/30 text-gray-300 hover:border-purple-500/50'
                        }`}
                      >
                        {category} ({count})
                      </Button>
                    );
                  })
                )}
              </div>
              </div>

            {/* Results Count - Only show if not using RSS.app */}
            {!useRSSApp && (
              <div className="mt-4 text-sm text-gray-400">
                Showing <span className="text-purple-400 font-semibold">{filteredVideos.length}</span> videos
                {searchQuery && <span> for "{searchQuery}"</span>}
                {selectedCategory !== 'All' && <span> in {selectedCategory}</span>}
              </div>
            )}
            </div>
          </section>

        {/* Videos Grid */}
        <main className="container mx-auto px-4 py-12">
          {useRSSApp ? (
            // RSS.app Widget Integration with multiple feeds
            <div className="youtube-feed-container">
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg animate-pulse h-64 border border-purple-500/10" />
                  ))}
                </div>
              )}
              {rssappLoaded && (
                <div className="rssapp-wrapper">
                  {(() => {
                    const feedUrl = RSSAPP_FEEDS[selectedFeed as keyof typeof RSSAPP_FEEDS] || RSSAPP_FEEDS['All Videos'];
                    const feedId = getFeedIdFromUrl(feedUrl);
                    
                    if (!feedId || feedId.trim() === '') {
                      return (
                        <div className="text-center py-12 bg-gray-900/50 border border-purple-500/20 rounded-2xl">
                          <Youtube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="font-orbitron text-xl font-bold text-white mb-2">
                            Feed ID Required for "{selectedFeed}"
                          </h3>
                          <p className="text-gray-400 mb-4 max-w-2xl mx-auto">
                            To set up this feed:
                          </p>
                          <ol className="text-left text-gray-300 text-sm mb-6 max-w-xl mx-auto space-y-2">
                            <li>1. Go to <a href="https://rss.app/new-rss-feed/create-youtube-rss-feed" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">RSS.app YouTube Feed Creator</a></li>
                            <li>2. Create a feed for "{selectedFeed}"</li>
                            <li>3. Add YouTube channels and keywords</li>
                            <li>4. Copy the Feed ID from the "Embed" section</li>
                            <li>5. Replace the empty string in <code className="bg-gray-800 px-2 py-1 rounded">RSSAPP_FEEDS['{selectedFeed}']</code> with your Feed ID</li>
                          </ol>
                          {RSSAPP_FEED_URLS[selectedFeed as keyof typeof RSSAPP_FEED_URLS] && (
                            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg max-w-xl mx-auto">
                              <p className="text-blue-300 text-xs mb-2">Reference URL for this category:</p>
                              <code className="text-blue-200 text-xs break-all">{RSSAPP_FEED_URLS[selectedFeed as keyof typeof RSSAPP_FEED_URLS]}</code>
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    return (
                      <>
                        <rssapp-wall 
                          key={`${selectedFeed}-${Date.now()}`}
                          id={feedId}
                        ></rssapp-wall>
                      </>
                    );
                  })()}
                </div>
              )}
              {!rssappLoaded && !isLoading && (
                <>
                  {/* Quick Fix: Embedded YouTube Channels */}
                  <div className="mb-8">
                    <h2 className="font-orbitron text-2xl font-bold text-white mb-6 text-center">
                      Latest AI & Tech Videos - Quick Preview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Sabrina Ramonov - Using channel embed */}
                      <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all">
                        <div className="aspect-video bg-gray-800">
                          <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed?listType=user_uploads&list=sabrina_ramonov"
                            title="Sabrina Ramonov - Latest Videos"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full rounded-t-lg"
                          ></iframe>
                        </div>
                        <div className="p-4">
                          <h3 className="font-orbitron text-sm font-semibold text-white mb-1">Sabrina Ramonov</h3>
                          <p className="text-xs text-gray-400">AI & Tech Content</p>
                        </div>
                      </div>

                      {/* Stefan Mischook - Using channel embed */}
                      <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all">
                        <div className="aspect-video bg-gray-800">
                          <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed?listType=user_uploads&list=StefanMischook"
                            title="Stefan Mischook - Latest Videos"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full rounded-t-lg"
                          ></iframe>
                        </div>
                        <div className="p-4">
                          <h3 className="font-orbitron text-sm font-semibold text-white mb-1">Stefan Mischook</h3>
                          <p className="text-xs text-gray-400">Web Development & Tech</p>
                        </div>
                      </div>

                      {/* AI Explained - Using channel ID */}
                      <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all">
                        <div className="aspect-video bg-gray-800">
                          <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed?listType=user_uploads&list=UCqYPhGiB9tkShZorfgcL2lA"
                            title="AI Explained - Latest Videos"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full rounded-t-lg"
                          ></iframe>
                        </div>
                        <div className="p-4">
                          <h3 className="font-orbitron text-sm font-semibold text-white mb-1">AI Explained</h3>
                          <p className="text-xs text-gray-400">AI News & Analysis</p>
                        </div>
                      </div>

                      {/* Two Minute Papers */}
                      <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all">
                        <div className="aspect-video bg-gray-800">
                          <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed?listType=user_uploads&list=UCBJycsmduvYEL83R_U4JriQ"
                            title="Two Minute Papers - Latest Videos"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full rounded-t-lg"
                          ></iframe>
                        </div>
                        <div className="p-4">
                          <h3 className="font-orbitron text-sm font-semibold text-white mb-1">Two Minute Papers</h3>
                          <p className="text-xs text-gray-400">AI Research & Papers</p>
                        </div>
                      </div>

                      {/* Nicky Saunders */}
                      <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all">
                        <div className="aspect-video bg-gray-800">
                          <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed?listType=user_uploads&list=NickySaunders"
                            title="Nicky Saunders - Latest Videos"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full rounded-t-lg"
                          ></iframe>
                        </div>
                        <div className="p-4">
                          <h3 className="font-orbitron text-sm font-semibold text-white mb-1">Nicky Saunders</h3>
                          <p className="text-xs text-gray-400">AI & Tech News</p>
                        </div>
                      </div>

                      {/* Marques Brownlee */}
                      <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-500/50 transition-all">
                        <div className="aspect-video bg-gray-800">
                          <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed?listType=user_uploads&list=UCXuqSBlHAE6Xw-yeJA0Tunw"
                            title="Marques Brownlee - Latest Videos"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full rounded-t-lg"
                          ></iframe>
                        </div>
                        <div className="p-4">
                          <h3 className="font-orbitron text-sm font-semibold text-white mb-1">Marques Brownlee</h3>
                          <p className="text-xs text-gray-400">Tech Reviews</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fallback Message */}
                  <div className="text-center py-12 bg-gray-900/50 border border-purple-500/20 rounded-2xl">
                    <Youtube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-orbitron text-xl font-bold text-white mb-2">
                      RSS.app Feed Not Configured
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Please set VITE_RSSAPP_FEED_ID in your environment variables for full video feed
                    </p>
                  <Button 
                    onClick={fetchVideosFromService}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Load Videos from YouTube Service
                  </Button>
                </div>
                </>
              )}
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-lg bg-gray-800/50" />
              ))}
            </div>
          ) : filteredVideos.length === 0 ? (
            <Card className="text-center py-16 bg-gray-900/50 border border-purple-500/20">
              <Youtube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-orbitron text-xl font-bold text-white mb-2">
                No videos found
              </h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                variant="outline"
                className="border-purple-500 hover:bg-purple-500/10 text-purple-400"
              >
                Clear filters
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <Card 
                  key={video.id}
                  className="overflow-hidden bg-gray-900/50 border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105 group cursor-pointer"
                  onClick={() => window.open(video.url, '_blank')}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-800 overflow-hidden">
                    <img 
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-4 shadow-lg shadow-purple-500/50">
                        <Play className="h-8 w-8 text-white fill-white" />
                      </div>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                      <Youtube className="h-3 w-3 mr-1" />
                      Video
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-orbitron text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors min-h-[2.5rem]">
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-400 truncate">{video.channelName}</span>
                      <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-400">
                        {video.category}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 min-h-[2rem]">
                      {video.description}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                      <span className="text-xs text-gray-500">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </span>
                      <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
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

