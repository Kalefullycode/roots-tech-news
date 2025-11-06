import { useEffect, useState, lazy, Suspense } from "react";
import { Helmet } from 'react-helmet-async';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Youtube, Play, ExternalLink, TrendingUp, Sparkles } from "lucide-react";
import YouTubeService, { YouTubeVideo } from "@/services/YouTubeService";
import { Skeleton } from "@/components/ui/skeleton";

const Header = lazy(() => import("@/components/Header"));
const Footer = lazy(() => import("@/components/Footer"));

interface TopicSection {
  icon: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
}

const TOPIC_SECTIONS: TopicSection[] = [
  {
    icon: '🎨',
    title: 'AI Design Tools',
    description: 'Master Midjourney, DALL-E, Canva AI, Figma AI & more',
    keywords: ['Midjourney', 'Canva AI', 'Figma AI', 'DALL-E', 'AI design'],
    category: 'Design'
  },
  {
    icon: '🎬',
    title: 'AI Film & Video Production',
    description: 'Create stunning videos with Runway, Sora, Pika, HeyGen & more',
    keywords: ['Runway AI', 'Sora', 'HeyGen', 'Pika', 'AI video generation'],
    category: 'Video'
  },
  {
    icon: '✂️',
    title: 'AI Video Editing & Content Creation',
    description: 'Edit videos faster with CapCut AI, Descript, Pictory & InVideo',
    keywords: ['CapCut AI', 'Descript', 'InVideo', 'AI video editing'],
    category: 'Editing'
  },
  {
    icon: '💰',
    title: 'Make Money with AI',
    description: 'AI side hustles, freelancing, businesses & passive income',
    keywords: ['make money with AI', 'AI side hustle', 'AI freelancing', 'AI business'],
    category: 'Business'
  }
];

const TOP_CREATORS = [
  { name: 'Sabrina Ramonov', handle: '@sabrina_ramonov', description: 'AI Automation Expert', icon: '🍄' },
  { name: 'Stefan Mischook', handle: '@StefanMischook', description: '275K subscribers', icon: '💻' },
  { name: 'Nicky Saunders', handle: '@NickySaunders', description: 'AI Content Creation', icon: '🎨' },
  { name: 'Matt Wolfe', handle: '@mreflow', description: 'AI Tool Reviews', icon: '🧠' },
  { name: 'Two Minute Papers', handle: '@TwoMinutePapers', description: 'AI Research', icon: '📊' },
  { name: 'AI Explained', handle: '@aiexplained-official', description: 'AI News & Analysis', icon: '🤖' },
];

const AIVideosPage = () => {
  const [videosByTopic, setVideosByTopic] = useState<Record<string, YouTubeVideo[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('just now');

  useEffect(() => {
    const fetchVideosForTopics = async () => {
      setIsLoading(true);
      const videos: Record<string, YouTubeVideo[]> = {};

      try {
        // Fetch all videos first
        const allVideos = await YouTubeService.fetchAllVideos();

        // Filter videos by topic keywords
        for (const topic of TOPIC_SECTIONS) {
          const topicVideos = allVideos.filter(video => {
            const searchText = `${video.title} ${video.description} ${video.channelName}`.toLowerCase();
            return topic.keywords.some(keyword => 
              searchText.includes(keyword.toLowerCase())
            );
          });
          videos[topic.category] = topicVideos.slice(0, 6); // Top 6 per topic
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setVideosByTopic(videos);
        setIsLoading(false);
      }
    };

    fetchVideosForTopics();

    // Update timestamp
    const updateTimestamp = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setLastUpdate(timeString);
    };

    updateTimestamp();
    const interval = setInterval(updateTimestamp, 60000); // Update every minute

    // Refresh videos every hour
    const refreshInterval = setInterval(fetchVideosForTopics, 60 * 60 * 1000);

    // Auto-refresh page every hour to get fresh YouTube embeds
    const pageRefreshTimeout = setTimeout(() => {
      window.location.reload();
    }, 60 * 60 * 1000); // 60 minutes

    return () => {
      clearInterval(interval);
      clearInterval(refreshInterval);
      clearTimeout(pageRefreshTimeout);
    };
  }, []);

  const getVideoEmbedUrl = (video: YouTubeVideo): string => {
    return `https://www.youtube.com/embed/${video.id}`;
  };

  return (
    <>
      <Helmet>
        <title>Latest AI Videos - Design, Film & Money Making | RootsTechNews</title>
        <meta name="description" content="Watch the latest AI tool tutorials for design, film, video creation and making money. Updated hourly with fresh content from top AI creators." />
        <meta name="keywords" content="AI design tools, AI video creation, make money with AI, AI film tools, Midjourney, Runway AI, Sora, AI tutorials, AI side hustle" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Suspense fallback={<div className="h-20 bg-background border-b border-border" />}>
          <Header />
        </Suspense>

        {/* Page Header */}
        <header className="text-center py-16 px-4 border-b border-purple-500/20">
          <div className="container mx-auto max-w-4xl">
            <h1 className="font-orbitron text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
              🎨 Latest AI Video Tutorials
            </h1>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Learn AI tools for design, film, video creation & making money. Updated every hour with fresh content.
            </p>
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold">LIVE - Updated {lastUpdate}</span>
            </div>
          </div>
        </header>

        {/* Topic Sections */}
        <main className="container mx-auto px-4 py-12 space-y-16">
          {TOPIC_SECTIONS.map((topic) => (
            <section key={topic.category} className="bg-gray-900/50 border border-purple-500/20 rounded-2xl p-8 md:p-12">
              {/* Topic Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="text-5xl">{topic.icon}</div>
                <div className="flex-1">
                  <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-2">
                    {topic.title}
                  </h2>
                  <p className="text-gray-400 text-lg">{topic.description}</p>
                </div>
              </div>

              {/* Videos Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-lg bg-gray-800/50" />
                  ))}
                </div>
              ) : videosByTopic[topic.category]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videosByTopic[topic.category].map((video) => (
                    <Card
                      key={video.id}
                      className="bg-gray-800/50 border border-purple-500/20 overflow-hidden hover:border-purple-500/50 transition-all group"
                    >
                      {/* Video Embed */}
                      <div className="relative aspect-video bg-gray-900">
                        <iframe
                          src={getVideoEmbedUrl(video)}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            onClick={() => window.open(video.url, '_blank')}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Watch on YouTube
                          </Button>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="p-4">
                        <h3 className="font-orbitron text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            {topic.icon} {topic.category}
                          </span>
                          <span>⏱️ Updated hourly</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Youtube className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No videos found for this topic. Try refreshing the page.</p>
                </div>
              )}
            </section>
          ))}

          {/* Top AI Creators Section */}
          <section className="bg-gray-900/50 border border-purple-500/20 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-5xl">⭐</div>
              <div className="flex-1">
                <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-2">
                  Top AI Creators to Follow
                </h2>
                <p className="text-gray-400 text-lg">Subscribe to these channels for daily AI updates</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TOP_CREATORS.map((creator) => (
                <Card
                  key={creator.handle}
                  className="bg-gray-800/50 border border-purple-500/20 text-center p-6 hover:border-purple-500/50 transition-all"
                >
                  <div className="text-5xl mb-4">{creator.icon}</div>
                  <h3 className="font-orbitron text-lg font-semibold text-white mb-2">
                    {creator.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{creator.description}</p>
                  <Button
                    onClick={() => window.open(`https://www.youtube.com/${creator.handle}`, '_blank')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Youtube className="w-4 h-4 mr-2" />
                    Watch Channel
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        </main>

        <Suspense fallback={<div className="h-32 bg-muted" />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default AIVideosPage;

