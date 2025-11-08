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
    if (articleUrl && articleUrl !== '#') {
      window.open(articleUrl, '_blank', 'noopener,noreferrer');
    }
    onClick?.();
  };

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
          {articleComments !== undefined && (
            <>
              <span>|</span>
              <a 
                href={articleId ? `/item/${articleId}` : `${articleUrl}#comments`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {articleComments} comments
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

