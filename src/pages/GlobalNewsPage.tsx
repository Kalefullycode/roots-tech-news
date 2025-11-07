import { useEffect, useState, lazy, Suspense } from "react";
import { Helmet } from 'react-helmet-async';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, TrendingUp, Clock, RefreshCw, ExternalLink, Podcast } from "lucide-react";
import { NewsArticle } from "@/services/NewsService";
import EnhancedRSSService from "@/services/EnhancedRSSService";
import PodcastService, { PodcastEpisode } from "@/services/PodcastService";
import PodcastCard from "@/components/cards/PodcastCard";
import { Skeleton } from "@/components/ui/skeleton";

const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));

type TabCategory = 'all' | 'ai' | 'tech' | 'startups' | 'funding' | 'research' | 'cybersecurity' | 'enterprise';
type Region = 'north-america' | 'europe' | 'asia' | 'middle-east' | 'africa' | 'oceania';

const REGIONS = [
  { id: 'north-america' as Region, name: 'North America', flag: '🇺🇸', count: 0 },
  { id: 'europe' as Region, name: 'Europe', flag: '🇪🇺', count: 0 },
  { id: 'asia' as Region, name: 'Asia', flag: '🇨🇳', count: 0 },
  { id: 'middle-east' as Region, name: 'Middle East', flag: '🇦🇪', count: 0 },
  { id: 'africa' as Region, name: 'Africa', flag: '🌍', count: 0 },
  { id: 'oceania' as Region, name: 'Oceania', flag: '🇦🇺', count: 0 },
];

const GlobalNewsPage = () => {
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [techPodcasts, setTechPodcasts] = useState<PodcastEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [breakingNews, setBreakingNews] = useState<string>('Loading latest breaking news...');

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const [articles, podcasts] = await Promise.all([
          EnhancedRSSService.fetchAllRSSFeeds(),
          PodcastService.fetchAllPodcasts()
        ]);
        
        setAllArticles(articles);
        setFilteredArticles(articles);
        
        // Filter podcasts for tech topics: AI, quantum computing, VR/AR, space computing, glasses, 2029, future tech
        const techTopics = [
          'ai', 'artificial intelligence', 'tech', 'technology', 
          'quantum', 'quantum computing', 'quantum computer',
          'vr', 'virtual reality', 'ar', 'augmented reality', 'glasses', 'headset',
          'space', 'space computing', 'space tech', 'nasa', 'spacex',
          'future', '2029', 'trillion', 'investor', 'founder', 'early'
        ];
        const filteredPodcasts = podcasts.filter(podcast => {
          const searchText = `${podcast.title} ${podcast.description} ${podcast.category}`.toLowerCase();
          return techTopics.some(topic => searchText.includes(topic));
        }).slice(0, 6);
        setTechPodcasts(filteredPodcasts);
        
        setLastUpdate(new Date());
        
        // Update breaking news ticker
        if (articles.length > 0) {
          const breakingText = articles.slice(0, 10)
            .map(article => `${article.title} • `)
            .join('');
          setBreakingNews(breakingText + breakingText); // Duplicate for seamless loop
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();

    // Update timestamp every minute
    const timestampInterval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000);

    // Refresh news every hour
    const refreshInterval = setInterval(fetchNews, 60 * 60 * 1000);

    // Auto-refresh page every hour
    const pageRefreshTimeout = setTimeout(() => {
      window.location.reload();
    }, 60 * 60 * 1000);

    return () => {
      clearInterval(timestampInterval);
      clearInterval(refreshInterval);
      clearTimeout(pageRefreshTimeout);
    };
  }, []);

  useEffect(() => {
    let filtered = [...allArticles];

    // Filter by tab category
    if (activeTab !== 'all') {
      const categoryMap: Record<TabCategory, string[]> = {
        'all': [],
        'ai': ['AI', 'Artificial Intelligence', 'Machine Learning'],
        'tech': ['Tech', 'Technology', 'Gadgets'],
        'startups': ['Startups', 'Venture'],
        'funding': ['Funding', 'Investment', 'Venture Capital'],
        'research': ['Research', 'Science', 'Study'],
        'cybersecurity': ['Security', 'Cybersecurity', 'Hacking'],
        'enterprise': ['Enterprise', 'Business', 'Corporate'],
      };

      const keywords = categoryMap[activeTab] || [];
      if (keywords.length > 0) {
        filtered = filtered.filter(article => {
          const searchText = `${article.title} ${article.description} ${article.category}`.toLowerCase();
          return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
        });
      }
    }

    // Filter by region (placeholder - would need region data in articles)
    // For now, we'll just show all articles

    setFilteredArticles(filtered);
  }, [activeTab, selectedRegion, allArticles]);

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const featuredStory = filteredArticles[0];
  const trendingStories = filteredArticles.slice(1, 4);
  const aiNews = filteredArticles.filter(a => 
    a.title.toLowerCase().includes('ai') || 
    a.title.toLowerCase().includes('artificial intelligence') ||
    a.category === 'AI'
  ).slice(0, 6);
  // Filter tech news including quantum computing, VR/AR, space computing, AI
  const techNews = filteredArticles.filter(a => {
    const searchText = `${a.title} ${a.description} ${a.category}`.toLowerCase();
    const techKeywords = [
      'tech', 'technology', 'quantum', 'vr', 'virtual reality', 'ar', 'augmented reality',
      'glasses', 'headset', 'space computing', 'space tech', 'ai', 'artificial intelligence',
      'future', '2029', 'trillion', 'investor', 'founder'
    ];
    return a.category === 'Tech' || techKeywords.some(keyword => searchText.includes(keyword));
  }).slice(0, 6);
  const startupNews = filteredArticles.filter(a => 
    a.category === 'Startups' || 
    a.title.toLowerCase().includes('startup') ||
    a.title.toLowerCase().includes('funding')
  ).slice(0, 6);

  return (
    <>
      <Helmet>
        <title>Global AI & Tech News - Live Updates Every Hour | RootsTechNews</title>
        <meta name="description" content="Breaking AI and tech news from around the globe. Live updates every hour from 100+ sources worldwide. Stay informed with RootsTechNews." />
        <meta name="keywords" content="AI news, tech news, global tech news, breaking tech news, artificial intelligence news, technology updates, tech industry news, startup news, AI updates" />
        <meta property="og:title" content="Global AI & Tech News - Live Updates" />
        <meta property="og:description" content="Breaking news from 100+ sources worldwide" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rootstechnews.com/news" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Suspense fallback={<div className="h-20 bg-background border-b border-border" />}>
          <Header />
        </Suspense>

        {/* Header */}
        <header className="text-center py-16 px-4 border-b border-purple-500/20">
          <div className="container mx-auto max-w-4xl">
            <h1 className="font-orbitron text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              🌍 Global AI & Tech News
            </h1>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Breaking news from 100+ sources worldwide • Updated every hour
            </p>
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full border-2 border-red-500/30 mb-6">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-wide">LIVE</span>
            </div>
            <div className="flex justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Last updated: <strong className="text-white">{lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</strong>
              </span>
              <span className="flex items-center gap-2">
                📰 Sources: <strong className="text-white">127 publications</strong>
              </span>
              <span className="flex items-center gap-2">
                🌍 Regions: <strong className="text-white">6 continents</strong>
              </span>
            </div>
          </div>
        </header>

        {/* Breaking News Ticker */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 py-4 mb-8 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 bg-black/30 px-6 flex items-center z-10">
            <span className="font-bold text-white text-sm uppercase tracking-wide">🔥 BREAKING</span>
          </div>
          <div className="ml-32 md:ml-40 overflow-hidden">
            <div className="inline-block whitespace-nowrap animate-scroll text-white font-semibold">
              {breakingNews}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="container mx-auto px-4 mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {(['all', 'ai', 'tech', 'startups', 'funding', 'research', 'cybersecurity', 'enterprise'] as TabCategory[]).map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? 'default' : 'outline'}
                className={`whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white'
                    : 'bg-gray-800/50 border-purple-500/30 text-gray-300 hover:border-purple-500/50'
                }`}
              >
                {tab === 'all' && '🌍'}
                {tab === 'ai' && '🤖'}
                {tab === 'tech' && '💻'}
                {tab === 'startups' && '🚀'}
                {tab === 'funding' && '💰'}
                {tab === 'research' && '🔬'}
                {tab === 'cybersecurity' && '🔒'}
                {tab === 'enterprise' && '🏢'}
                <span className="ml-2 capitalize">{tab === 'all' ? 'All News' : tab}</span>
              </Button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 pb-12">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading latest global news...</p>
            </div>
          ) : (
            <>
              {/* Featured + Trending Section */}
              <section className="mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Featured Main Story */}
                  {featuredStory && (
                    <Card className="lg:col-span-2 bg-gray-800/50 border-purple-500/20 overflow-hidden hover:border-purple-500/50 transition-all group">
                      <div className="aspect-video bg-gray-900 relative overflow-hidden">
                        <img
                          src={featuredStory.urlToImage || '/placeholder.svg'}
                          alt={featuredStory.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-4">FEATURED</Badge>
                        <h2 className="font-orbitron text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                          <a href={featuredStory.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {featuredStory.title}
                          </a>
                        </h2>
                        <p className="text-gray-400 mb-4 line-clamp-3">
                          {featuredStory.description || 'Read more about this story...'}
                        </p>
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">📰 {featuredStory.source.name}</span>
                          <span className="flex items-center gap-1">🕐 {formatTime(featuredStory.publishedAt)}</span>
                          <span className="flex items-center gap-1">🌍 Global</span>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Trending Stories Sidebar */}
                  <aside className="space-y-4">
                    {trendingStories.map((story, index) => (
                      <Card
                        key={story.url}
                        className="bg-gray-800/50 border-purple-500/20 p-4 hover:border-pink-500/50 transition-all hover:translate-x-1"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-yellow-500 rounded-lg flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white mb-2 line-clamp-2 hover:text-pink-400 transition-colors">
                              <a href={story.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {story.title}
                              </a>
                            </h3>
                            <p className="text-xs text-gray-500">
                              {story.source.name} • {formatTime(story.publishedAt)}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </aside>
                </div>
              </section>

              {/* Global Map View */}
              <section className="mb-16 bg-gray-800/30 border border-purple-500/20 rounded-2xl p-8">
                <div className="text-center mb-8">
                  <h3 className="font-orbitron text-2xl font-bold text-white mb-2">🗺️ News by Region</h3>
                  <p className="text-gray-400">Click a region to filter news stories</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {REGIONS.map((region) => (
                    <Card
                      key={region.id}
                      onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                      className={`bg-gray-800/50 border-2 text-center p-6 cursor-pointer transition-all hover:border-purple-500/50 hover:-translate-y-1 ${
                        selectedRegion === region.id ? 'border-purple-500' : 'border-purple-500/20'
                      }`}
                    >
                      <div className="text-4xl mb-3">{region.flag}</div>
                      <div className="font-bold text-white mb-1">{region.name}</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                        {filteredArticles.length}
                      </div>
                      <div className="text-xs text-gray-500">stories today</div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* AI News Section */}
              <section className="mb-16">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-500/20">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🤖</div>
                    <div>
                      <h2 className="font-orbitron text-3xl font-bold text-white">Artificial Intelligence News</h2>
                      <p className="text-gray-400 text-sm">Latest developments in AI, machine learning, and neural networks</p>
                    </div>
                  </div>
                  <Button variant="outline" className="bg-purple-500/15 border-purple-500/30 text-purple-400 hover:bg-purple-500/25">
                    View All →
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiNews.length > 0 ? (
                    aiNews.map((article) => (
                      <Card key={article.url} className="bg-gray-800/50 border-purple-500/20 overflow-hidden hover:border-purple-500/50 transition-all group">
                        <div className="aspect-video bg-gray-900 relative overflow-hidden">
                          <img
                            src={article.urlToImage || '/placeholder.svg'}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <div className="p-5">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-3 text-xs">
                            {article.source.name}
                          </Badge>
                          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {article.title}
                            </a>
                          </h3>
                          <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                            {article.description || 'Read more...'}
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(article.publishedAt)}
                            </span>
                            <span className="bg-gray-700/50 px-2 py-1 rounded text-xs">🌍 Global</span>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12 text-gray-400">
                      No AI news articles found. Try refreshing the page.
                    </div>
                  )}
                </div>
              </section>

              {/* Technology Section - Matching Latest Tech Podcasts Design */}
              <section className="technology-section-redesigned mb-16">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Podcast className="h-8 w-8 text-purple-500" />
                    <h2 className="section-heading font-orbitron text-foreground">
                      #Technology
                    </h2>
                  </div>
                </div>

                <div className="podcast-grid">
                  {/* Combine tech articles and podcasts */}
                  {techPodcasts.length > 0 ? (
                    techPodcasts.map((podcast) => (
                      <PodcastCard key={podcast.id} podcast={podcast} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      Loading technology podcasts and articles...
                    </div>
                  )}
                  
                  {/* Also show tech articles converted to podcast-like format */}
                  {techNews.length > 0 && techNews.slice(0, 6 - techPodcasts.length).map((article) => {
                    // Convert article to podcast-like format for PodcastCard
                    const podcastEpisode: PodcastEpisode = {
                      id: article.url,
                      title: article.title,
                      description: article.description || 'Read more about this technology story...',
                      thumbnail: article.urlToImage || '/placeholder.svg',
                      podcastName: article.source.name,
                      publishedAt: article.publishedAt,
                      url: article.url,
                      category: article.category || 'Tech'
                    };
                    return <PodcastCard key={article.url} podcast={podcastEpisode} />;
                  })}
                </div>
              </section>

              {/* Startup & Funding Section */}
              <section className="mb-16">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-500/20">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🚀</div>
                    <div>
                      <h2 className="font-orbitron text-3xl font-bold text-white">Startups & Funding</h2>
                      <p className="text-gray-400 text-sm">Latest startup launches, funding rounds, and venture capital news</p>
                    </div>
                  </div>
                  <Button variant="outline" className="bg-purple-500/15 border-purple-500/30 text-purple-400 hover:bg-purple-500/25">
                    View All →
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {startupNews.length > 0 ? (
                    startupNews.map((article) => (
                      <Card key={article.url} className="bg-gray-800/50 border-purple-500/20 overflow-hidden hover:border-purple-500/50 transition-all group">
                        <div className="aspect-video bg-gray-900 relative overflow-hidden">
                          <img
                            src={article.urlToImage || '/placeholder.svg'}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <div className="p-5">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-3 text-xs">
                            {article.source.name}
                          </Badge>
                          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                            <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {article.title}
                            </a>
                          </h3>
                          <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                            {article.description || 'Read more...'}
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(article.publishedAt)}
                            </span>
                            <span className="bg-gray-700/50 px-2 py-1 rounded text-xs">🌍 Global</span>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12 text-gray-400">
                      No startup news articles found. Try refreshing the page.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </main>

        <Suspense fallback={<div className="h-32 bg-muted" />}>
          <Footer />
        </Suspense>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        /* Technology Section Styling */
        .technology-section-redesigned {
          background-color: #0d0d1a;
          padding: 4rem 2rem;
        }
        
        .section-heading {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0;
        }
        
        .podcast-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        @media (min-width: 768px) {
          .podcast-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }
        
        /* Article Card Redesigned */
        .article-card-redesigned {
          background-color: #1c1c2b;
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid #2d2d3f;
          transition: all 0.3s ease;
        }
        
        .article-card-redesigned:hover {
          transform: translateY(-5px);
          border-color: #8b5cf6;
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .category-badge {
          background-color: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .duration {
          color: #a0aec0;
          font-size: 0.9rem;
        }
        
        .card-body h3 {
          color: #ffffff;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .card-body p {
          color: #a0aec0;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
        }
        
        .date {
          color: #718096;
          font-size: 0.9rem;
        }
        
        .listen-button {
          background-color: #8b5cf6;
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background-color 0.3s ease;
        }
        
        .listen-button:hover {
          background-color: #7c3aed;
        }
        
        @media (max-width: 768px) {
          .technology-section-redesigned {
            padding: 2rem 1rem;
          }
          
          .section-heading {
            font-size: 2rem;
            margin-bottom: 2rem;
          }
          
          .podcast-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default GlobalNewsPage;

