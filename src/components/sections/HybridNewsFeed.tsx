import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import TopStoryCard from "../cards/TopStoryCard";
import NewsListItem from "../NewsListItem";
import NewsletterForm from "../forms/NewsletterForm";
import { addEmojiPrefix } from "@/utils/emojiPrefix";
import { Zap } from "lucide-react";

interface Article {
  id?: string;
  title: string;
  description?: string;
  url?: string;
  image?: string;
  category?: string;
  source?: string | { name?: string };
  publishedAt?: string;
  pubDate?: string;
  timeAgo?: string;
}

async function fetchArticles(): Promise<Article[]> {
  const response = await fetch('/functions/fetch-rss');
  if (!response.ok) throw new Error('Failed to fetch articles');
  const data = await response.json();
  return data.articles || [];
}

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

export default function HybridNewsFeed() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['hybrid-news-feed'],
    queryFn: fetchArticles,
    refetchInterval: 900000, // Refresh every 15 minutes
    staleTime: 60000,
    retry: 2,
  });

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="hybrid-news-feed">
            {/* Left Column Skeleton */}
            <div className="left-column">
              <Skeleton className="h-10 w-48 mb-6" />
              <div className="space-y-4">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
            {/* Right Column Skeleton */}
            <div className="right-column">
              <Skeleton className="h-[500px] w-full mb-6" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Process articles
  const allArticles = articles || [];
  
  // Sort articles: AI first, then by recency
  const sortedArticles = [...allArticles].sort((a, b) => {
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
    
    const aDate = new Date(a.publishedAt || a.pubDate || new Date()).getTime();
    const bDate = new Date(b.publishedAt || b.pubDate || new Date()).getTime();
    return bDate - aDate;
  });

  // Get top story (first article)
  const topStory = sortedArticles[0] ? {
    ...sortedArticles[0],
    title: addEmojiPrefix(sortedArticles[0].title, sortedArticles[0].category),
    timeAgo: formatTime(sortedArticles[0].publishedAt || sortedArticles[0].pubDate || new Date().toISOString()),
    source: typeof sortedArticles[0].source === 'object' 
      ? sortedArticles[0].source?.name 
      : sortedArticles[0].source,
  } : null;

  // Get other stories (skip first one, take next 12)
  const otherStories = sortedArticles.slice(1, 13).map((article, index) => ({
    ...article,
    title: addEmojiPrefix(article.title, article.category),
    timeAgo: formatTime(article.publishedAt || article.pubDate || new Date().toISOString()),
    source: typeof article.source === 'object' 
      ? article.source?.name 
      : article.source,
    index: index + 1, // Start from 1 since we skipped the first
  }));

  // Fallback if no articles
  if (!topStory) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 text-muted-foreground">
            <p>No articles available at this time. Please check back later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="hybrid-news-feed">
          {/* Left Column - Dense News List */}
          <div className="left-column">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="section-title font-orbitron text-2xl font-bold text-glow-primary">
                The Daily Byte
              </h2>
            </div>
            
            <div className="news-list-container bg-card/30 rounded-lg p-4 border border-border/50">
              {otherStories.map((story) => (
                <NewsListItem
                  key={story.id || `story-${story.index}`}
                  article={{
                    id: story.id,
                    title: story.title,
                    url: story.url,
                    source: story.source,
                    timeAgo: story.timeAgo,
                    publishedAt: story.publishedAt || story.pubDate,
                  }}
                  index={story.index || 0}
                />
              ))}
            </div>

            <div className="mt-6 text-center">
              <a 
                href="/news" 
                className="inline-block rounded-lg bg-purple-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-colors"
              >
                Explore All News →
              </a>
            </div>
          </div>

          {/* Right Column - Top Story Card + Newsletter */}
          <div className="right-column">
            <div>
              <h3 className="font-orbitron text-lg font-bold text-glow-primary mb-4">
                Featured Story
              </h3>
              <TopStoryCard article={topStory} />
            </div>

            {/* Newsletter Signup */}
            <div className="bg-card-modern border border-card-border/60 rounded-lg p-6">
              <NewsletterForm variant="compact" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

