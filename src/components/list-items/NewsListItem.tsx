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

// Color mapping for source badges - different colors for different domains
const getSourceColor = (domain?: string): string => {
  if (!domain) return 'purple';
  
  const cleanDomain = domain.replace('www.', '').toLowerCase();
  
  // Major tech publications
  if (cleanDomain.includes('techcrunch') || cleanDomain.includes('theverge')) {
    return 'blue';
  }
  if (cleanDomain.includes('wired') || cleanDomain.includes('arstechnica')) {
    return 'green';
  }
  if (cleanDomain.includes('mit') || cleanDomain.includes('nature')) {
    return 'cyan';
  }
  if (cleanDomain.includes('venturebeat') || cleanDomain.includes('forbes')) {
    return 'pink';
  }
  if (cleanDomain.includes('reuters') || cleanDomain.includes('bloomberg')) {
    return 'orange';
  }
  
  // AI-focused sources
  if (cleanDomain.includes('ai') || cleanDomain.includes('openai') || cleanDomain.includes('anthropic')) {
    return 'purple';
  }
  
  // Default
  return 'purple';
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

  const badgeColor = getSourceColor(displayDomain);
  const badgeColorClasses = {
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    pink: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
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
        <span className={`source-badge ${badgeColorClasses[badgeColor as keyof typeof badgeColorClasses]}`}>
          {displayDomain.replace('www.', '')}
        </span>
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
