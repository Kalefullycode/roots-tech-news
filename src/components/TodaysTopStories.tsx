import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Clock } from "lucide-react";

async function fetchArticles() {
  const response = await fetch('/functions/fetch-rss');
  if (!response.ok) throw new Error('Failed to fetch articles');
  const data = await response.json();
  return data.articles;
}

const TodaysTopStories = () => {
  const [lastUpdate, setLastUpdate] = useState<string>("Just now");

  const { data: newsArticles, isLoading } = useQuery({
    queryKey: ['top-stories'],
    queryFn: fetchArticles,
    refetchInterval: 900000, // Refresh every 15 minutes
    staleTime: 60000,
    retry: 2,
    onSuccess: () => {
      setLastUpdate("Just now");
    }
  });

  // Update "last updated" text every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setLastUpdate(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const articles = newsArticles || [];
  const topStories = articles.slice(0, 10);

  const getPriorityBadge = (index: number, category?: string) => {
    if (category?.toLowerCase().includes('ai')) {
      return { label: "AI", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    }
    if (index === 0) return { label: "High", color: "bg-red-500/20 text-red-400 border-red-500/30" };
    if (index < 3) return { label: "Medium", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
    return { label: "Low", color: "bg-green-500/20 text-green-400 border-green-500/30" };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="font-orbitron text-3xl font-bold text-glow-primary">
                Today's Top Stories
              </h2>
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-gradient-to-b from-transparent to-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="font-orbitron text-3xl font-bold text-glow-primary">
              Today's Top Stories
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground font-roboto">
              LIVE - Last updated: {lastUpdate}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stories List */}
          <div className="lg:col-span-2 space-y-4">
            {topStories.length > 0 ? (
              topStories.map((article: any, index: number) => {
                const priority = getPriorityBadge(index, article.category);
                return (
                  <Card
                    key={article.id || index}
                    className="p-5 bg-card-modern border border-card-border/60 hover:border-primary/40 transition-all cursor-pointer group"
                    onClick={() => {
                      if (article.url && article.url !== '#') {
                        window.open(article.url, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-orbitron font-bold text-lg text-primary">
                          #{index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge className={priority.color}>
                            {priority.label}
                          </Badge>
                          {article.category && (
                            <Badge variant="secondary" className="text-xs">
                              {article.category}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-roboto font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{article.source || 'Tech News'}</span>
                          <span>•</span>
                          <span>{formatTime(article.publishedAt || new Date().toISOString())}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No stories available at the moment.</p>
              </div>
            )}
          </div>

          {/* Right Sidebar - Top AI Tools */}
          <aside className="lg:col-span-1">
            <Card className="bg-card-modern border border-card-border/60 p-6 sticky top-24">
              <h3 className="font-orbitron font-bold text-xl mb-4 flex items-center gap-2 text-glow-accent">
                <Zap className="h-5 w-5 text-accent" />
                Top AI Tools
              </h3>
              <div className="space-y-4">
                {[
                  { name: "ChatGPT", icon: "🤖", desc: "AI Assistant", url: "https://chat.openai.com" },
                  { name: "Claude", icon: "🧠", desc: "AI Conversations", url: "https://claude.ai" },
                  { name: "Midjourney", icon: "🎨", desc: "AI Art", url: "https://midjourney.com" }
                ].map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg hover:from-primary/20 hover:to-accent/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{tool.icon}</span>
                      <div>
                        <h4 className="font-roboto font-bold text-foreground group-hover:text-primary transition-colors">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">{tool.desc}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default TodaysTopStories;

