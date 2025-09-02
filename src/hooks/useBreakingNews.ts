import { useState, useEffect } from 'react';

interface BreakingNewsItem {
  id: string;
  headline: string;
  timestamp: string;
  urgency: 'breaking' | 'urgent' | 'trending';
  source: string;
  url: string;
}

// Hook to fetch and manage breaking news updates
export const useBreakingNews = () => {
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date>(new Date());

  // Generate realistic breaking news based on current events and trends
  const generateBreakingNews = (): BreakingNewsItem[] => {
    const newsTemplates = [
      {
        headlines: [
          '🚨 OpenAI GPT-5 just achieved AGI milestone - First AI to pass comprehensive reasoning tests',
          '🤖 Google DeepMind announces breakthrough in protein folding prediction accuracy',
          '⚡ Microsoft Azure AI reaches 1 trillion parameter language model milestone',
          '🧠 Anthropic Claude 4 demonstrates human-level problem solving capabilities'
        ],
        urgency: 'breaking' as const,
        sources: ['TechCrunch', 'MIT Technology Review', 'Ars Technica', 'The Information']
      },
      {
        headlines: [
          '⚡ NVIDIA stock jumps 12% after announcing revolutionary quantum-AI chip breakthrough',
          '💰 Tesla reports 50% increase in Full Self-Driving revenue this quarter',
          '📊 Meta stock rises on surprise metaverse user growth numbers',
          '🔥 Amazon Web Services announces new AI infrastructure spending'
        ],
        urgency: 'urgent' as const,
        sources: ['Reuters', 'Bloomberg', 'CNBC', 'Financial Times']
      },
      {
        headlines: [
          '🌍 African startup raises $200M Series C for AI-powered climate monitoring satellites',
          '🚀 SpaceX successfully deploys 60 Starlink satellites with AI navigation systems',
          '📱 Apple iPhone 16 Pro Max breaks pre-order records with new AI features',
          '🏥 AI diagnostic tool approved by FDA shows 95% accuracy in early cancer detection'
        ],
        urgency: 'trending' as const,
        sources: ['Disrupt Africa', 'Space News', 'The Verge', 'MedTech Dive']
      }
    ];

    const generatedNews: BreakingNewsItem[] = [];
    
    newsTemplates.forEach((template, templateIndex) => {
      const randomHeadline = template.headlines[Math.floor(Math.random() * template.headlines.length)];
      const randomSource = template.sources[Math.floor(Math.random() * template.sources.length)];
      
      // Generate realistic timestamps (within the last 4 hours)
      const minutesAgo = Math.floor(Math.random() * 240) + (templateIndex * 30); // Spread across 4 hours
      const timestamp = new Date(Date.now() - minutesAgo * 60 * 1000);

      generatedNews.push({
        id: `news-${Date.now()}-${templateIndex}`,
        headline: randomHeadline,
        timestamp: timestamp.toISOString(),
        urgency: template.urgency,
        source: randomSource,
        url: '#' // Would be real URLs in production
      });
    });

    // Add one more recent breaking news
    const recentBreaking = {
      id: `breaking-${Date.now()}`,
      headline: '🔥 JUST IN: Major tech conference announces AI safety breakthrough after emergency session',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      urgency: 'breaking' as const,
      source: 'Tech News Live',
      url: '#'
    };

    return [recentBreaking, ...generatedNews].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  // Fetch breaking news (in production, this would call real APIs)
  const fetchBreakingNews = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, you would fetch from real news APIs like:
      // - NewsAPI
      // - Reuters API  
      // - Associated Press API
      // - Custom RSS feeds
      
      const freshNews = generateBreakingNews();
      setBreakingNews(freshNews);
      setLastFetch(new Date());
    } catch (error) {
      console.error('Failed to fetch breaking news:', error);
      // Fallback to generated content
      setBreakingNews(generateBreakingNews());
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize and set up hourly updates
  useEffect(() => {
    // Initial fetch
    fetchBreakingNews();

    // Set up hourly updates
    const hourlyInterval = setInterval(() => {
      fetchBreakingNews();
    }, 60 * 60 * 1000); // Every hour

    // Set up more frequent updates for breaking news (every 15 minutes)
    const breakingInterval = setInterval(() => {
      // Only refresh if we have breaking or urgent news
      const hasUrgentNews = breakingNews.some(news => 
        news.urgency === 'breaking' || news.urgency === 'urgent'
      );
      
      if (hasUrgentNews) {
        fetchBreakingNews();
      }
    }, 15 * 60 * 1000); // Every 15 minutes

    return () => {
      clearInterval(hourlyInterval);
      clearInterval(breakingInterval);
    };
  }, []);

  // Manual refresh function
  const refreshNews = () => {
    fetchBreakingNews();
  };

  // Get time until next update
  const getTimeUntilNextUpdate = () => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    const minutesUntilUpdate = Math.floor((nextHour.getTime() - now.getTime()) / (60 * 1000));
    return minutesUntilUpdate;
  };

  return {
    breakingNews,
    isLoading,
    lastFetch,
    refreshNews,
    getTimeUntilNextUpdate
  };
};