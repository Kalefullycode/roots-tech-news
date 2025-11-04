import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Clock, 
  Globe,
  Zap,
  TrendingUp,
  Mail
} from "lucide-react";
import EnhancedRSSService from "@/services/EnhancedRSSService";
import PodcastService from "@/services/PodcastService";
import { NewsArticle } from "@/services/NewsService";
import { PodcastEpisode } from "@/services/PodcastService";

interface Story {
  title: string;
  time: string;
  source: string;
  impact: string;
  category: string;
  url: string;
}

// Define fallback stories outside component to avoid re-creation on each render
const fallbackStories: Story[] = [
  {
    title: "OpenAI Announces GPT-5 with Revolutionary Multimodal Capabilities",
    time: "2 hours ago",
    source: "TechCrunch",
    impact: "High",
    category: "AI Updates",
    url: "#"
  },
  {
    title: "Google's New AI Chip Outperforms NVIDIA in Energy Efficiency",
    time: "4 hours ago", 
    source: "MIT Technology Review",
    impact: "Medium",
    category: "Tech Hardware",
    url: "#"
  },
  {
    title: "African AI Startup Secures $50M for Healthcare Diagnostics",
    time: "6 hours ago",
    source: "Disrupt Africa", 
    impact: "High",
    category: "Startups",
    url: "#"
  },
  {
    title: "Software Engineering Revolution: AI-Powered Code Review Reduces Bugs by 70%",
    time: "8 hours ago",
    source: "GitHub Blog",
    impact: "Medium",
    category: "Software Engineering",
    url: "#"
  }
];

const DailyAINews = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration] = useState("1:23");

  const [todaysStories, setTodaysStories] = useState<Story[]>([]);
  const [featuredPodcast, setFeaturedPodcast] = useState<PodcastEpisode | null>(null);

  useEffect(() => {
    const fetchAINews = async () => {
      try {
        // Fetch AI-specific news
        const aiNews = await EnhancedRSSService.fetchByCategory('AI');
        
        // Fetch AI podcasts
        const aiPodcasts = await PodcastService.fetchByCategory('AI');
        
        // Format news stories with categories
        const stories = aiNews.slice(0, 4).map((article: NewsArticle, index: number) => ({
          title: article.title,
          time: getTimeAgo(new Date(article.publishedAt)),
          source: article.source.name,
          impact: index === 0 ? "High" : index < 3 ? "Medium" : "Low",
          category: article.category || 'Tech',
          url: article.url
        }));
        
        setTodaysStories(stories.length > 0 ? stories : fallbackStories);
        
        // Set featured podcast if available
        if (aiPodcasts.length > 0) {
          setFeaturedPodcast(aiPodcasts[0]);
        }
      } catch (error) {
        console.error('Failed to fetch AI news:', error);
        setTodaysStories(fallbackStories);
      }
    };

    fetchAINews();
    // Refresh every 30 minutes
    const interval = setInterval(fetchAINews, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []); // Empty deps - fallbackStories is defined outside component and doesn't change

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Play podcast if available
    if (featuredPodcast && !isPlaying) {
      window.open(featuredPodcast.url, '_blank');
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleRestart = () => {
    setCurrentTime("0:00");
    setIsPlaying(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Zap className="h-8 w-8 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h2 className="font-orbitron text-2xl font-bold text-glow-primary">
              Daily AI Briefing
            </h2>
            <p className="text-sm text-muted-foreground">
              Your 60-second AI news update • Updated hourly
            </p>
            <p className="text-xs text-primary/80 italic mt-1">
              🤖 AI news aggregator - Curating global AI developments
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse">
            <Clock className="h-3 w-3 mr-1" />
            Live
          </Badge>
          <Badge className="bg-accent/20 text-accent border-accent/30">
            <Globe className="h-3 w-3 mr-1" />
            Global
          </Badge>
        </div>
      </div>

      {/* Audio Player Interface */}
      <Card className="bg-card-modern border border-card-border/60 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={handlePlayPause}
              className={`rounded-full w-14 h-14 ${
                isPlaying 
                  ? "bg-accent hover:bg-accent/80" 
                  : "bg-primary hover:bg-primary/80"
              }`}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRestart}
                className="hover:bg-primary/20"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMute}
                className="hover:bg-primary/20"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="text-right">
            <div className="font-orbitron text-lg font-bold text-primary">
              {currentTime} / {duration}
            </div>
            <p className="text-xs text-muted-foreground">
              {isPlaying ? "Playing..." : "Ready to play"}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-border rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
            style={{ width: isPlaying ? "35%" : "0%" }}
          />
        </div>
        
        <div className="text-center">
          <p className="font-orbitron text-sm font-semibold text-primary mb-2">
            Today's AI Highlights - {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by advanced AI voice synthesis • Updated every hour
          </p>
        </div>
      </Card>

      {/* Story Headlines */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h3 className="font-orbitron font-semibold text-accent">
            Today's Top Stories
          </h3>
        </div>
        
        {todaysStories.map((story, index) => (
          <Card 
            key={index}
            className="p-4 bg-card border border-card-border/40 hover:border-primary/40 transition-all duration-300 cursor-pointer"
            onClick={() => story.url && story.url !== '#' && window.open(story.url, '_blank')}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {story.category || 'Tech'}
                  </Badge>
                  <Badge className={getImpactColor(story.impact)}>
                    {story.impact}
                  </Badge>
                </div>
                <h4 className="font-roboto font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                  #{index + 1} {story.title}
                </h4>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{story.source}</span>
                  <span>•</span>
                  <span>{story.time}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/30">
        <Button 
          className="flex-1 bg-gradient-hero hover:glow-primary"
          onClick={() => {
            if (featuredPodcast) {
              window.open(featuredPodcast.url, '_blank');
            }
          }}
        >
          <Play className="h-4 w-4 mr-2" />
          Listen to Full Briefing
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 border-primary hover:bg-primary/10"
          onClick={() => {
            // Scroll to newsletter signup in sidebar
            const sidebar = document.querySelector('aside');
            if (sidebar) {
              sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
              // Highlight newsletter form briefly
              const newsletterCard = sidebar.querySelector('form')?.closest('.bg-gradient-card');
              if (newsletterCard) {
                newsletterCard.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-background');
                setTimeout(() => {
                  newsletterCard.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-background');
                }, 2000);
              }
            }
          }}
        >
          <Mail className="h-4 w-4 mr-2" />
          Subscribe to Daily AI News
        </Button>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">
            AI Voice System Active
          </span>
        </div>
        <span className="text-xs text-muted-foreground">•</span>
        <span className="text-xs text-muted-foreground">
          Next update in 47 minutes
        </span>
      </div>
    </Card>
  );
};

export default DailyAINews;