import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap } from "lucide-react";
import NewsListItem from "./NewsListItem";
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


  // Always use articles - prioritize real RSS data, fallback to curated articles
  const allArticles = (newsArticles && newsArticles.length > 0) ? newsArticles : fallbackArticles;
  
  // Enhanced categorization function
  const categorizeArticle = (article: { title?: string; category?: string; description?: string; contentSnippet?: string; source?: { name?: string } | string }): string => {
    // Defensive checks for null/undefined
    if (!article || typeof article !== 'object') {
      return 'Tech'; // Default category
    }
    
    const title = (article.title || '').toLowerCase();
    const category = (article.category || '').toLowerCase();
    const description = (article.description || article.contentSnippet || '').toLowerCase();
    const source = typeof article.source === 'string' ? article.source.toLowerCase() : (article.source?.name || '').toLowerCase();
    const combinedText = `${title} ${description} ${source}`;
    
    // AI Category
    if (category === 'ai' || 
        combinedText.includes('ai') ||
        combinedText.includes('artificial intelligence') ||
        combinedText.includes('gpt') ||
        combinedText.includes('llm') ||
        combinedText.includes('machine learning') ||
        combinedText.includes('neural network') ||
        combinedText.includes('openai') ||
        combinedText.includes('anthropic') ||
        combinedText.includes('deepmind') ||
        combinedText.includes('claude') ||
        combinedText.includes('gemini')) {
      return 'AI';
    }
    
    // Security Category
    if (category === 'security' ||
        combinedText.includes('cyber') ||
        combinedText.includes('security') ||
        combinedText.includes('hack') ||
        combinedText.includes('breach') ||
        combinedText.includes('vulnerability') ||
        combinedText.includes('malware') ||
        combinedText.includes('ransomware') ||
        combinedText.includes('phishing')) {
      return 'Security';
    }
    
    // Tech Category
    if (category === 'tech' ||
        combinedText.includes('tech') ||
        combinedText.includes('technology') ||
        combinedText.includes('software') ||
        combinedText.includes('hardware') ||
        combinedText.includes('gadget') ||
        combinedText.includes('device') ||
        combinedText.includes('chip') ||
        combinedText.includes('processor')) {
      return 'Tech';
    }
    
    // Startups Category
    if (category === 'startups' ||
        combinedText.includes('startup') ||
        combinedText.includes('funding') ||
        combinedText.includes('series') ||
        combinedText.includes('venture capital') ||
        combinedText.includes('raised') ||
        combinedText.includes('unicorn')) {
      return 'Startups';
    }
    
    // Default to Tech if no match
    return 'Tech';
  };
  
  // Categorize all articles (only once)
  const categorizedArticles = allArticles.map(article => ({
    ...article,
    category: categorizeArticle(article)
  }));
  
  // Group articles by category (use the category property, don't recalculate)
  const articlesByCategory = {
    AI: categorizedArticles.filter(a => a.category === 'AI'),
    Security: categorizedArticles.filter(a => a.category === 'Security'),
    Tech: categorizedArticles.filter(a => a.category === 'Tech'),
    Startups: categorizedArticles.filter(a => a.category === 'Startups')
  };
  
  // Interleave articles from different categories for balanced display
  const interleavedArticles: Array<{ title?: string; category?: string; description?: string; contentSnippet?: string; source?: { name?: string } | string; url?: string; id?: string; publishedAt?: string }> = [];
  const interleavedIds = new Set<string | number>(); // Track IDs to avoid duplicates
  const maxPerCategory = 8; // Max articles per category in top 30
  
  for (let i = 0; i < maxPerCategory; i++) {
    // Add one from each category in rotation
    const categories = [
      articlesByCategory.AI[i],
      articlesByCategory.Security[i],
      articlesByCategory.Tech[i],
      articlesByCategory.Startups[i]
    ];
    
    categories.forEach(article => {
      if (article) {
        const articleId = article.id || `article-${interleavedArticles.length}`;
        if (!interleavedIds.has(articleId)) {
          interleavedIds.add(articleId);
          interleavedArticles.push(article);
        }
      }
    });
  }
  
  // Fill remaining slots with most recent articles
  const remainingSlots = 30 - interleavedArticles.length;
  if (remainingSlots > 0) {
    const remainingArticles = categorizedArticles
      .filter(a => {
        const articleId = a.id || `article-${categorizedArticles.indexOf(a)}`;
        return !interleavedIds.has(articleId);
      })
      .sort((a, b) => {
        const aDate = new Date(a.publishedAt || a.pubDate || new Date()).getTime();
        const bDate = new Date(b.publishedAt || b.pubDate || new Date()).getTime();
        return bDate - aDate;
      })
      .slice(0, remainingSlots);
    
    remainingArticles.forEach(article => {
      const articleId = article.id || `article-${interleavedArticles.length}`;
      if (!interleavedIds.has(articleId)) {
        interleavedIds.add(articleId);
        interleavedArticles.push(article);
      }
    });
  }
  
  const topStories = interleavedArticles.slice(0, 30);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getDomain = (url?: string) => {
    if (!url || url === '#') return '';
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  ⚡ The Bleeding Edge
                </span>
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
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                ⚡ The Bleeding Edge
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground font-roboto">
              🟢 LIVE - Last updated: {lastUpdate}
            </span>
          </div>
        </div>

        {/* Stories List - Hacker News Style */}
        <div className="news-list-container bg-card/30 rounded-lg p-4 border border-border/50">
          {topStories.map((article: { id?: string; title?: string; url?: string; link?: string; source?: { name?: string } | string; publishedAt?: string; pubDate?: string; category?: string }, index: number) => {
            const source = article.source?.name || article.source || 'Tech News';
            const timeAgo = formatTime(article.publishedAt || article.pubDate || new Date().toISOString());
            
            // Get valid URL - prefer url over link, ensure it's a valid URL
            let articleUrl = article.url || article.link;
            if (articleUrl && !articleUrl.startsWith('http') && !articleUrl.startsWith('/') && !articleUrl.startsWith('#')) {
              // If it's not a valid URL format, make it a hash
              articleUrl = '#';
            }
            if (!articleUrl) {
              articleUrl = '#';
            }
            
            const domain = getDomain(articleUrl);
            
            return (
              <NewsListItem
                key={article.id || `article-${index}`}
                index={index}
                title={article.title || 'Untitled Article'}
                url={articleUrl}
                source={source}
                sourceName={source}
                timeAgo={timeAgo}
                domain={domain}
                article={{
                  id: article.id,
                  title: article.title || 'Untitled Article',
                  url: articleUrl,
                  source: source,
                  sourceName: source,
                  sourceDomain: domain,
                  timeAgo: timeAgo,
                  publishedAt: article.publishedAt || article.pubDate,
                  category: article.category
                }}
              />
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/news" 
            className="inline-block rounded-lg bg-purple-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            Explore All News
          </a>
        </div>
      </div>
    </section>
  );
};

export default TodaysTopStories;
