interface Article {
  id?: string;
  title: string;
  url?: string;
  source?: string;
  author?: string;
  timeAgo?: string;
  points?: number;
  comments?: number;
  publishedAt?: string;
}

interface NewsListItemProps {
  article?: Article;
  index: number;
  title?: string;
  url?: string;
  source?: string;
  author?: string;
  timeAgo?: string;
  points?: number;
  comments?: number;
  domain?: string;
  onClick?: () => void;
  variant?: 'default' | 'compact'; // 'default' uses news-list-item, 'compact' uses news-item
}

export default function NewsListItem({ 
  article,
  index,
  title,
  url,
  source,
  author,
  timeAgo,
  points,
  comments,
  domain,
  onClick,
  variant = 'default',
}: NewsListItemProps) {
  // Use article object if provided, otherwise use individual props
  const articleTitle = article?.title || title || '';
  const articleUrl = article?.url || url || '#';
  const articleSource = article?.source || source;
  const articleAuthor = article?.author || author;
  const articleTimeAgo = article?.timeAgo || timeAgo;
  const articlePoints = article?.points ?? points;
  const articleComments = article?.comments ?? comments;
  const articleId = article?.id;

  // Extract domain from URL if not provided
  const displayDomain = domain || (() => {
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

  // Compact variant with horizontal layout
  if (variant === 'compact') {
    return (
      <div className="news-item">
        {articleSource && (
          <span className="source-badge">{articleSource}</span>
        )}
        <a 
          href={articleUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="title"
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          {articleTitle}
        </a>
        {articleTimeAgo && (
          <span className="time-ago">{articleTimeAgo}</span>
        )}
      </div>
    );
  }

  // Default variant with vertical layout
  return (
    <div className="news-list-item">
      <span className="rank">{index + 1}.</span>
      <div className="content">
        <a 
          href={articleUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="title"
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          {articleTitle}
        </a>
        {displayDomain && (
          <span className="domain">({displayDomain})</span>
        )}
        <div className="metadata">
          {articlePoints !== undefined && (
            <span>{articlePoints} points</span>
          )}
          {articleAuthor && (
            <span>by {articleAuthor}</span>
          )}
          {articleSource && !articleAuthor && (
            <span>{articleSource}</span>
          )}
          {articleTimeAgo && (
            <span>{articleTimeAgo}</span>
          )}
          {articleComments !== undefined && articleComments > 0 && (
            <>
              <span className="text-muted-foreground">|</span>
              <a 
                href={articleUrl && articleUrl !== '#' ? `${articleUrl}#comments` : '#'}
                onClick={(e) => {
                  if (articleUrl && articleUrl !== '#') {
                    e.preventDefault();
                    e.stopPropagation();
                    if (articleUrl.startsWith('http')) {
                      window.open(`${articleUrl}#comments`, '_blank', 'noopener,noreferrer');
                    } else {
                      window.location.href = `${articleUrl}#comments`;
                    }
                  } else {
                    e.preventDefault();
                  }
                }}
                className="hover:text-primary transition-colors"
              >
                {articleComments} {articleComments === 1 ? 'comment' : 'comments'}
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

