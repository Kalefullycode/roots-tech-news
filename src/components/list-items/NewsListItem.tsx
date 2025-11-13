interface Article {
  id?: string;
  title: string;
  url?: string;
  domain?: string;
  source?: string;
  author?: string;
  timeAgo?: string;
  emoji?: string;
  publishedAt?: string;
}

interface NewsListItemProps {
  article?: Article;
  index?: number;
  title?: string;
  url?: string;
  domain?: string;
  source?: string;
  timeAgo?: string;
  emoji?: string;
  onClick?: () => void;
}

// Source configuration with color and priority mapping
interface SourceConfig {
  color: string;
  priority: 'high' | 'medium' | 'low';
  inlineColor: string; // CSS color for inline styling
}

// Helper function to map sources to colors and priorities
const getSourceConfig = (domain?: string, source?: string): SourceConfig => {
  if (!domain && !source) {
    return { color: 'purple', priority: 'low', inlineColor: '#a855f7' };
  }
  
  const cleanDomain = (domain || '').replace('www.', '').toLowerCase();
  const cleanSource = (source || '').toLowerCase();
  const searchText = `${cleanDomain} ${cleanSource}`;
  
  // High Priority Sources - Major publications & AI companies
  if (searchText.includes('techcrunch')) {
    return { color: 'blue', priority: 'high', inlineColor: '#3b82f6' };
  }
  if (searchText.includes('theverge')) {
    return { color: 'blue', priority: 'high', inlineColor: '#2563eb' };
  }
  if (searchText.includes('wired')) {
    return { color: 'green', priority: 'high', inlineColor: '#10b981' };
  }
  if (searchText.includes('arstechnica')) {
    return { color: 'green', priority: 'high', inlineColor: '#059669' };
  }
  if (searchText.includes('openai') || searchText.includes('anthropic')) {
    return { color: 'purple', priority: 'high', inlineColor: '#8b5cf6' };
  }
  if (searchText.includes('google') && searchText.includes('ai')) {
    return { color: 'purple', priority: 'high', inlineColor: '#9333ea' };
  }
  if (searchText.includes('deepmind')) {
    return { color: 'purple', priority: 'high', inlineColor: '#7c3aed' };
  }
  if (searchText.includes('mit') || searchText.includes('technology review')) {
    return { color: 'cyan', priority: 'high', inlineColor: '#06b6d4' };
  }
  if (searchText.includes('hackernews') || searchText.includes('hnrss')) {
    return { color: 'orange', priority: 'high', inlineColor: '#f97316' };
  }
  if (searchText.includes('cyberinsider')) {
    return { color: 'red', priority: 'high', inlineColor: '#ef4444' };
  }
  
  // Medium Priority Sources
  if (searchText.includes('venturebeat')) {
    return { color: 'pink', priority: 'medium', inlineColor: '#ec4899' };
  }
  if (searchText.includes('forbes')) {
    return { color: 'pink', priority: 'medium', inlineColor: '#db2777' };
  }
  if (searchText.includes('reuters')) {
    return { color: 'orange', priority: 'medium', inlineColor: '#ea580c' };
  }
  if (searchText.includes('bloomberg')) {
    return { color: 'orange', priority: 'medium', inlineColor: '#c2410c' };
  }
  if (searchText.includes('engadget')) {
    return { color: 'green', priority: 'medium', inlineColor: '#34d399' };
  }
  if (searchText.includes('reddit')) {
    return { color: 'orange', priority: 'medium', inlineColor: '#fb923c' };
  }
  if (searchText.includes('arxiv')) {
    return { color: 'cyan', priority: 'medium', inlineColor: '#22d3ee' };
  }
  
  // AI-focused sources (medium priority)
  if (searchText.includes('ai') || searchText.includes('machine learning')) {
    return { color: 'purple', priority: 'medium', inlineColor: '#a855f7' };
  }
  
  // Low Priority - Default
  return { color: 'purple', priority: 'low', inlineColor: '#9333ea' };
};

export default function NewsListItem({ 
  article,
  index,
  title,
  url,
  domain,
  source,
  timeAgo,
  emoji,
  onClick,
}: NewsListItemProps) {
  // Use article object if provided, otherwise use individual props
  const articleTitle = article?.title || title || '';
  const articleUrl = article?.url || url || '#';
  const articleDomain = article?.domain || domain;
  const articleTimeAgo = article?.timeAgo || timeAgo;
  const articleEmoji = article?.emoji || emoji;

  // Extract domain from URL if not provided
  const displayDomain = articleDomain || (() => {
    if (!articleUrl || articleUrl === '#') return '';
    try {
      return new URL(articleUrl).hostname.replace('www.', '');
    } catch {
      return '';
    }
  })();

  const handleClick = () => {
    if (articleUrl && articleUrl !== '#' && articleUrl.startsWith('http')) {
      window.open(articleUrl, '_blank', 'noopener,noreferrer');
    } else if (articleUrl && articleUrl !== '#' && !articleUrl.startsWith('http')) {
      // Handle relative URLs
      window.location.href = articleUrl;
    }
    onClick?.();
  };

  const sourceConfig = getSourceConfig(displayDomain, article?.source || source);
  const badgeColorClasses = {
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  // Extract emoji from title if it starts with one, otherwise use provided emoji
  const titleWithEmoji = articleTitle;
  const emojiPrefix = articleEmoji || (titleWithEmoji.match(/^[\p{Emoji}]/u)?.[0] || '');
  const titleWithoutEmoji = emojiPrefix 
    ? titleWithEmoji.replace(/^[\p{Emoji}]\s*/u, '').trim() || titleWithEmoji
    : titleWithEmoji;

  return (
    <div className="news-list-item">
      {displayDomain && (
        <div className="flex items-center gap-2">
          <span 
            className={`source-badge ${badgeColorClasses[sourceConfig.color as keyof typeof badgeColorClasses]}`}
            style={{ color: sourceConfig.inlineColor }}
          >
            {displayDomain.replace('www.', '')}
          </span>
          <span className={`priority-badge priority-${sourceConfig.priority}`} title={`${sourceConfig.priority} priority source`}>
            {sourceConfig.priority === 'high' && '🔥'}
            {sourceConfig.priority === 'medium' && '⭐'}
            {sourceConfig.priority === 'low' && '•'}
          </span>
        </div>
      )}
      
      <a 
        href={articleUrl} 
        className="title"
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        {emojiPrefix && `${emojiPrefix} `}
        {titleWithoutEmoji}
      </a>
      
      {articleTimeAgo && (
        <span className="time-ago">{articleTimeAgo}</span>
      )}
    </div>
  );
}
