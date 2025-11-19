interface Article {
  id?: string;
  title: string;
  url?: string;
  source?: string;
  sourceName?: string;
  sourceDomain?: string;
  author?: string;
  timeAgo?: string;
  points?: number;
  comments?: number;
  publishedAt?: string;
  rank?: number;
  category?: string;
}

interface NewsListItemProps {
  article?: Article;
  index?: number;
  title?: string;
  url?: string;
  source?: string;
  sourceName?: string;
  sourceDomain?: string;
  author?: string;
  timeAgo?: string;
  points?: number;
  comments?: number;
  domain?: string;
  rank?: number;
  onClick?: () => void;
  variant?: 'default' | 'compact'; // 'default' uses news-list-item, 'compact' uses news-item
}

// Helper function to get colors and priority based on source AND content
const getSourceStyle = (
  sourceDomain?: string, 
  sourceName?: string,
  articleTitle?: string,
  articleCategory?: string
): { color: string; priority: 'High' | 'Medium' | 'Low' } => {
  const domain = (sourceDomain || '').toLowerCase().replace('www.', '');
  const name = (sourceName || '').toLowerCase();
  const title = (articleTitle || '').toLowerCase();
  const category = (articleCategory || '').toLowerCase();
  const searchText = `${domain} ${name}`;

  // Check if article is AI-related - always HIGH priority
  const isAI = category === 'ai' || 
               title.includes('ai') ||
               title.includes('gpt') ||
               title.includes('llm') ||
               title.includes('artificial intelligence') ||
               title.includes('openai') ||
               title.includes('anthropic') ||
               title.includes('deepmind') ||
               title.includes('machine learning') ||
               title.includes('neural network');

  // Check if article is Tech-related
  const isTech = category === 'tech' || 
                 category === 'security' ||
                 title.includes('tech') ||
                 title.includes('technology') ||
                 title.includes('cyber') ||
                 title.includes('software') ||
                 title.includes('hardware') ||
                 title.includes('startup') ||
                 title.includes('innovation');

  const styles: Record<string, { color: string; priority: 'High' | 'Medium' | 'Low' }> = {
    'techcrunch.com': { color: '#00a400', priority: 'High' },
    'techcrunch': { color: '#00a400', priority: 'High' },
    'venturebeat.com': { color: '#007bff', priority: 'Medium' },
    'venturebeat': { color: '#007bff', priority: 'Medium' },
    'arstechnica.com': { color: '#ff4500', priority: 'High' },
    'arstechnica': { color: '#ff4500', priority: 'High' },
    'theverge.com': { color: '#2563eb', priority: 'High' },
    'theverge': { color: '#2563eb', priority: 'High' },
    'wired.com': { color: '#10b981', priority: 'High' },
    'wired': { color: '#10b981', priority: 'High' },
    'cyberinsider.com': { color: '#ef4444', priority: 'High' },
    'cyberinsider': { color: '#ef4444', priority: 'High' },
    'openai.com': { color: '#8b5cf6', priority: 'High' },
    'openai': { color: '#8b5cf6', priority: 'High' },
    'mit.edu': { color: '#06b6d4', priority: 'High' },
    'mit': { color: '#06b6d4', priority: 'High' },
    'hackernews': { color: '#f97316', priority: 'High' },
    'hnrss': { color: '#f97316', priority: 'High' },
    'reuters.com': { color: '#3b82f6', priority: 'High' },
    'reuters': { color: '#3b82f6', priority: 'High' },
    'apnews.com': { color: '#3b82f6', priority: 'High' },
    'apnews': { color: '#3b82f6', priority: 'High' },
    'cnbc.com': { color: '#3b82f6', priority: 'High' },
    'cnbc': { color: '#3b82f6', priority: 'High' },
    'zdnet.com': { color: '#3b82f6', priority: 'High' },
    'zdnet': { color: '#3b82f6', priority: 'High' },
    'default': { color: '#a0aec0', priority: 'Low' },
  };

  // AI articles always get HIGH priority
  if (isAI) {
    const baseStyle = styles[domain] || styles[searchText.split(' ')[0]] || styles['default'];
    return { color: baseStyle.color, priority: 'High' };
  }

  // Tech articles get HIGH priority
  if (isTech) {
    const baseStyle = styles[domain] || styles[searchText.split(' ')[0]] || styles['default'];
    return { color: baseStyle.color, priority: 'High' };
  }

  // Check for exact domain match first
  if (styles[domain]) {
    return styles[domain];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(styles)) {
    if (searchText.includes(key) && key !== 'default') {
      return value;
    }
  }

  return styles['default'];
};

export default function NewsListItem({ 
  article,
  index,
  title,
  url,
  source,
  sourceName,
  sourceDomain,
  author,
  timeAgo,
  points,
  comments,
  domain,
  rank,
  onClick,
  variant = 'default',
}: NewsListItemProps) {
  // Use article object if provided, otherwise use individual props
  const articleTitle = article?.title || title || '';
  const articleUrl = article?.url || url || '#';
  const articleSource = article?.source || source;
  const articleSourceName = article?.sourceName || sourceName || articleSource;
  const articleSourceDomain = article?.sourceDomain || sourceDomain || domain || (() => {
    if (!articleUrl || articleUrl === '#') return '';
    try {
      return new URL(articleUrl).hostname.replace('www.', '');
    } catch {
      return '';
    }
  })();
  const articleAuthor = article?.author || author;
  const articleTimeAgo = article?.timeAgo || timeAgo;
  const articlePoints = article?.points ?? points;
  const articleComments = article?.comments ?? comments;
  const articleRank = article?.rank ?? rank ?? (index !== undefined ? index + 1 : undefined);

  const sourceStyle = getSourceStyle(
    articleSourceDomain, 
    articleSourceName,
    articleTitle,
    article?.category || ''
  );

  const handleClick = () => {
    if (articleUrl && articleUrl !== '#' && articleUrl.startsWith('http')) {
      window.open(articleUrl, '_blank', 'noopener,noreferrer');
    } else if (articleUrl && articleUrl !== '#' && !articleUrl.startsWith('http')) {
      // Handle relative URLs
      window.location.href = articleUrl;
    }
    onClick?.();
  };

  // Compact variant with horizontal layout
  if (variant === 'compact') {
    return (
      <div className="news-item">
        {articleSourceName && (
          <span className="source-badge" style={{ color: sourceStyle.color }}>
            {articleSourceName}
          </span>
        )}
        <span className={`priority-badge priority-${sourceStyle.priority.toLowerCase()}`}>
          {sourceStyle.priority}
        </span>
        <span 
          className="title cursor-pointer hover:text-primary transition-colors"
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Read article: ${articleTitle}`}
        >
          {articleTitle}
        </span>
        {articleTimeAgo && (
          <span className="time-ago">{articleTimeAgo}</span>
        )}
      </div>
    );
  }

  // Default variant with new structure
  return (
    <li className="news-item">
      {articleRank !== undefined && (
        <span className="rank">{articleRank}.</span>
      )}
      <div className="story-details">
        <span 
          className="title cursor-pointer hover:text-primary transition-colors"
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Read article: ${articleTitle}`}
        >
          {articleTitle}
        </span>
        <div className="metadata">
          {articleSourceName && (
            <span className="source" style={{ color: sourceStyle.color }}>
              {articleSourceName}
            </span>
          )}
          <span className={`priority-badge priority-${sourceStyle.priority.toLowerCase()}`}>
            {sourceStyle.priority}
          </span>
          {articleTimeAgo && (
            <span className="timestamp">{articleTimeAgo}</span>
          )}
          {articlePoints !== undefined && (
            <span className="points">{articlePoints} points</span>
          )}
          {articleAuthor && (
            <span className="author">by {articleAuthor}</span>
          )}
          {articleComments !== undefined && articleComments > 0 && (
            <>
              <span className="separator">|</span>
              <span 
                onClick={(e) => {
                  if (articleUrl && articleUrl !== '#') {
                    e.stopPropagation();
                    if (articleUrl.startsWith('http')) {
                      window.open(`${articleUrl}#comments`, '_blank', 'noopener,noreferrer');
                    } else {
                      window.location.href = `${articleUrl}#comments`;
                    }
                  }
                }}
                className="comments-link cursor-pointer hover:text-primary transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && articleUrl && articleUrl !== '#') {
                    e.preventDefault();
                    e.stopPropagation();
                    if (articleUrl.startsWith('http')) {
                      window.open(`${articleUrl}#comments`, '_blank', 'noopener,noreferrer');
                    } else {
                      window.location.href = `${articleUrl}#comments`;
                    }
                  }
                }}
              >
                {articleComments} {articleComments === 1 ? 'comment' : 'comments'}
              </span>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

