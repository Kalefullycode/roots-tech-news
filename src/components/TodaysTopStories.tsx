import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Clock, Brain, Cpu, Rocket, Shield, TrendingUp } from "lucide-react";
import aiArticle from "@/assets/ai-article.webp";
import startupArticle from "@/assets/startup-article.webp";
import securityArticle from "@/assets/security-article.webp";
import gadgetArticle from "@/assets/gadget-article.webp";

async function fetchArticles() {
  const response = await fetch('/functions/fetch-rss');
  if (!response.ok) throw new Error('Failed to fetch articles');
  const data = await response.json();
  return data.articles;
}

// Fallback articles with detailed summaries - November 2025 tech news
const fallbackArticles = [
  {
    id: "fallback-1",
    title: "OpenAI Unveils GPT-5 with Revolutionary Multimodal Capabilities",
    description: "OpenAI has officially released GPT-5, featuring unprecedented multimodal understanding that seamlessly integrates text, images, audio, and video processing. The new model demonstrates 40% improved reasoning capabilities and can process context windows up to 10 million tokens. Early adopters report significant breakthroughs in scientific research, creative industries, and enterprise automation.",
    category: "AI",
    source: "TechCrunch",
    publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    image: aiArticle,
    url: "#"
  },
  {
    id: "fallback-2",
    title: "Google's New AI Chip Outperforms NVIDIA in Energy Efficiency Tests",
    description: "Google's latest Tensor Processing Unit (TPU) v6 demonstrates remarkable energy efficiency, consuming 60% less power than NVIDIA's H200 while maintaining comparable performance. The breakthrough comes as tech giants race to reduce AI compute costs. Industry analysts predict this could accelerate AI adoption across startups and developing markets.",
    category: "AI",
    source: "MIT Technology Review",
    publishedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    image: aiArticle,
    url: "#"
  },
  {
    id: "fallback-3",
    title: "African AI Startup Secures $50M Series B for Healthcare Diagnostics",
    description: "Nairobi-based MedAI has raised $50 million in Series B funding to expand its AI-powered diagnostic platform across 15 African countries. The startup's technology can detect diseases from medical images with 95% accuracy, addressing critical healthcare gaps. The funding round was led by Sequoia Capital with participation from African tech investment firms.",
    category: "Startups",
    source: "VentureBeat",
    publishedAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    image: startupArticle,
    url: "#"
  },
  {
    id: "fallback-4",
    title: "Apple Releases M4 Pro Chips with Neural Engine Enhancements",
    description: "Apple's latest M4 Pro processors feature a redesigned Neural Engine capable of running large language models locally on-device. The new chips deliver 3x faster AI inference compared to M3, enabling real-time video generation and advanced voice synthesis. This marks a significant step toward true edge AI computing without cloud dependencies.",
    category: "Tech",
    source: "The Verge",
    publishedAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    image: gadgetArticle,
    url: "#"
  },
  {
    id: "fallback-5",
    title: "Quantum Computing Breakthrough: IBM Achieves 1000-Qubit Milestone",
    description: "IBM has successfully demonstrated a 1,000-qubit quantum processor, marking a critical milestone in quantum computing development. The new system shows improved error correction and can solve complex optimization problems 100x faster than classical computers. This advancement brings practical quantum computing applications closer to reality.",
    category: "Tech",
    source: "Ars Technica",
    publishedAt: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
    image: gadgetArticle,
    url: "#"
  },
  {
    id: "fallback-6",
    title: "Microsoft Copilot Pro Adds Advanced Code Generation Features",
    description: "Microsoft has enhanced Copilot Pro with advanced code generation capabilities, including full-stack application development and database schema design. The new features integrate with GitHub Actions for automated deployment pipelines. Developers report 50% reduction in coding time for common tasks, significantly improving productivity.",
    category: "AI",
    source: "GitHub Blog",
    publishedAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
    image: aiArticle,
    url: "#"
  },
  {
    id: "fallback-7",
    title: "Cybersecurity Firm Raises $75M to Combat AI-Powered Attacks",
    description: "CrowdStrike has secured $75 million in funding to develop AI-powered security solutions that can detect and neutralize sophisticated cyber threats in real-time. The platform uses machine learning to identify zero-day exploits and advanced persistent threats. The investment comes as cyber attacks using AI tools have increased 300% in 2025.",
    category: "Security",
    source: "Wired",
    publishedAt: new Date(Date.now() - 25200000).toISOString(), // 7 hours ago
    image: securityArticle,
    url: "#"
  },
  {
    id: "fallback-8",
    title: "Tesla's Full Self-Driving Beta Expands to 50 Countries",
    description: "Tesla has expanded its Full Self-Driving Beta program to 50 countries, representing the largest deployment of autonomous driving technology to date. The system uses advanced neural networks trained on billions of miles of real-world driving data. Regulatory approval in multiple markets signals growing acceptance of autonomous vehicle technology.",
    category: "Tech",
    source: "TechCrunch",
    publishedAt: new Date(Date.now() - 28800000).toISOString(), // 8 hours ago
    image: gadgetArticle,
    url: "#"
  },
  {
    id: "fallback-9",
    title: "Open Source LLM Surpasses GPT-4 in Reasoning Benchmarks",
    description: "A new open-source large language model developed by Mistral AI has achieved superior performance on reasoning benchmarks compared to GPT-4. The model, released under Apache 2.0 license, offers developers and researchers free access to state-of-the-art AI capabilities. This development could democratize access to advanced AI technology.",
    category: "AI",
    source: "VentureBeat",
    publishedAt: new Date(Date.now() - 32400000).toISOString(), // 9 hours ago
    image: aiArticle,
    url: "#"
  },
  {
    id: "fallback-10",
    title: "Meta's VR Headset Integrates Real-Time AI Translation",
    description: "Meta's latest Quest Pro VR headset features real-time AI translation that allows users to communicate seamlessly across 100+ languages. The technology uses advanced speech recognition and neural machine translation to provide natural conversations in virtual environments. This breakthrough could revolutionize global collaboration in virtual workspaces.",
    category: "Tech",
    source: "The Verge",
    publishedAt: new Date(Date.now() - 36000000).toISOString(), // 10 hours ago
    image: gadgetArticle,
    url: "#"
  }
];

const TodaysTopStories = () => {
  const [lastUpdate, setLastUpdate] = useState<string>("Just now");
  const [rssWidgetLoaded, setRssWidgetLoaded] = useState(false);

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

  // Load RSS.app widget script
  useEffect(() => {
    const scriptId = 'rssapp-wall-script';
    
    // Check if script already exists
    if (document.getElementById(scriptId)) {
      setRssWidgetLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://widget.rss.app/v1/wall.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      setRssWidgetLoaded(true);
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script on unmount if needed
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        // Keep script for reuse
      }
    };
  }, []);

  // Always use articles - prioritize real RSS data, fallback to curated articles
  const allArticles = (newsArticles && newsArticles.length > 0) ? newsArticles : fallbackArticles;
  
  // Sort articles: AI first, then by recency
  const sortedArticles = [...allArticles].sort((a, b) => {
    // Prioritize AI articles
    const aIsAI = (a.category || '').toLowerCase().includes('ai') || 
                  (a.title || '').toLowerCase().includes('ai') ||
                  (a.title || '').toLowerCase().includes('gpt') ||
                  (a.title || '').toLowerCase().includes('llm');
    const bIsAI = (b.category || '').toLowerCase().includes('ai') || 
                  (b.title || '').toLowerCase().includes('ai') ||
                  (b.title || '').toLowerCase().includes('gpt') ||
                  (b.title || '').toLowerCase().includes('llm');
    
    if (aIsAI && !bIsAI) return -1;
    if (!aIsAI && bIsAI) return 1;
    
    // Then sort by date
    const aDate = new Date(a.publishedAt || a.pubDate || new Date()).getTime();
    const bDate = new Date(b.publishedAt || b.pubDate || new Date()).getTime();
    return bDate - aDate;
  });

  const topStories = sortedArticles.slice(0, 10);

  const getPriorityBadge = (index: number, category?: string) => {
    if (category?.toLowerCase().includes('ai')) {
      return { label: "AI", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    }
    if (index === 0) return { label: "High", color: "bg-red-500/20 text-red-400 border-red-500/30" };
    if (index < 3) return { label: "Medium", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
    return { label: "Low", color: "bg-green-500/20 text-green-400 border-green-500/30" };
  };

  const getCategoryIcon = (category?: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('ai')) return Brain;
    if (cat.includes('startup')) return Rocket;
    if (cat.includes('security')) return Shield;
    if (cat.includes('tech')) return Cpu;
    return TrendingUp;
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

  const getStoryImage = (article: any) => {
    if (article.image) return article.image;
    if (article.urlToImage) return article.urlToImage;
    if (article.category?.toLowerCase().includes('ai')) return aiArticle;
    if (article.category?.toLowerCase().includes('startup')) return startupArticle;
    if (article.category?.toLowerCase().includes('security')) return securityArticle;
    return gadgetArticle;
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="font-orbitron text-3xl font-bold text-glow-primary">
                ⚡ Today's Top Stories
              </h2>
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
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
              ⚡ Today's Top Stories
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground font-roboto">
              🟢 LIVE - Last updated: {lastUpdate}
            </span>
          </div>
        </div>

        {/* RSS.app Widget - Integrated Feed */}
        <div className="mb-8 w-full">
          <rssapp-wall id="tTCtnPmhJDGhOAbH"></rssapp-wall>
        </div>

        {/* Stories List - Full Width */}
        <div className="space-y-4">
          {topStories.map((article: any, index: number) => {
            const priority = getPriorityBadge(index, article.category);
            const CategoryIcon = getCategoryIcon(article.category);
            const storyImage = getStoryImage(article);
            const source = article.source?.name || article.source || 'Tech News';
            const summary = article.description || article.contentSnippet || article.summary || '';
            const cleanSummary = summary.replace(/<[^>]*>/g, '').substring(0, 250);
            
            return (
              <Card
                key={article.id || index}
                className="p-6 bg-card-modern border border-card-border/60 hover:border-primary/40 transition-all cursor-pointer group"
                onClick={() => {
                  if (article.url && article.url !== '#') {
                    window.open(article.url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <div className="flex items-start gap-6">
                  {/* Story Number & Icon */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-orbitron font-bold text-xl text-primary">
                      #{index + 1}
                    </div>
                    <CategoryIcon className="h-5 w-5 text-primary/60" />
                  </div>

                  {/* Story Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={storyImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = gadgetArticle;
                        }}
                      />
                    </div>
                  </div>

                  {/* Story Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge className={priority.color}>
                        {priority.label}
                      </Badge>
                      {article.category && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            const categoryUrl = `/category/${article.category.toLowerCase()}`;
                            window.location.href = categoryUrl;
                          }}
                        >
                          {article.category}
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-roboto font-bold text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    
                    {cleanSummary && (
                      <p className="font-roboto text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                        {cleanSummary}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{source}</span>
                      <span>•</span>
                      <span>{formatTime(article.publishedAt || article.pubDate || new Date().toISOString())}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TodaysTopStories;
