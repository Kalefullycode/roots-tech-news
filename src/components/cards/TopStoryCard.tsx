import { Clock } from "lucide-react";
import aiArticle from "@/assets/ai-article.webp";

interface TopStoryCardProps {
  article: {
    id?: string;
    title: string;
    description?: string;
    url?: string;
    imageUrl?: string;
    image?: string;
    category?: string;
    categories?: string[];
    source?: string;
    author?: string;
    publishedAt?: string;
    pubDate?: string;
    date?: string;
    timeAgo?: string;
    emoji?: string;
  };
}

export default function TopStoryCard({ article }: TopStoryCardProps) {
  const handleClick = () => {
    if (article.url && article.url !== '#') {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  const imageUrl = article.imageUrl || article.image || aiArticle;
  
  // Extract emoji from title if it starts with one, otherwise use provided emoji or default
  const titleWithEmoji = article.title;
  const emoji = article.emoji || (titleWithEmoji.match(/^[\p{Emoji}]/u)?.[0] || '⚡');
  const titleWithoutEmoji = titleWithEmoji.replace(/^[\p{Emoji}]\s*/u, '').trim() || titleWithEmoji;
  
  // Handle categories - support both single category and array
  const categories = article.categories || (article.category ? [article.category] : ['Tech']);
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'Just now';
    }
  };
  
  const displayDate = article.date || formatDate(article.publishedAt || article.pubDate);
  const author = article.author || article.source || 'Tech News';

  return (
    <div 
      className="top-story-card cursor-pointer group"
      onClick={handleClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Read article: ${titleWithoutEmoji}`}
    >
      <img 
        src={imageUrl} 
        alt={titleWithoutEmoji} 
        className="featured-image"
        loading="eager"
        onError={(e) => {
          (e.target as HTMLImageElement).src = aiArticle;
        }}
      />
      
      <div className="card-content">
        <div className="category-badges">
          {categories.map((cat, index) => (
            <span key={index} className="badge">
              {cat}
            </span>
          ))}
        </div>
        
        <h3 className="card-title">
          {emoji} {titleWithoutEmoji}
        </h3>
        
        <p className="card-metadata">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {displayDate}
          </span>
          <span className="separator">•</span>
          <span>by {author}</span>
        </p>
      </div>
    </div>
  );
}

