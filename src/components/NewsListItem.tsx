import { ExternalLink, Clock } from 'lucide-react';

interface NewsListItemProps {
  index: number;
  title: string;
  url?: string;
  source?: string;
  timeAgo?: string;
  points?: number;
  comments?: number;
  domain?: string;
  onClick?: () => void;
}

export default function NewsListItem({
  index,
  title,
  url,
  source,
  timeAgo,
  points,
  comments,
  domain,
  onClick,
}: NewsListItemProps) {
  const handleClick = () => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    onClick?.();
  };

  // Extract domain from URL if not provided
  const displayDomain = domain || (() => {
    if (!url || url === '#') return '';
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return '';
    }
  })();

  return (
    <div className="news-list-item flex items-start gap-3 py-2 px-1 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer group">
      {/* Number */}
      <div className="flex-shrink-0 w-8 text-right">
        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
          {index + 1}.
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title and Link */}
        <div className="flex items-start gap-2 mb-1">
          <a
            href={url || '#'}
            onClick={(e) => {
              e.preventDefault();
              handleClick();
            }}
            className="text-sm text-gray-900 dark:text-gray-100 hover:underline flex-1"
          >
            {title}
          </a>
          {url && url !== '#' && (
            <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          {points !== undefined && (
            <>
              <span>{points} points</span>
              <span>•</span>
            </>
          )}
          {source && (
            <>
              <span>{source}</span>
              <span>•</span>
            </>
          )}
          {displayDomain && (
            <>
              <span className="text-gray-400 dark:text-gray-500">{displayDomain}</span>
              <span>•</span>
            </>
          )}
          {timeAgo && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </span>
          )}
          {comments !== undefined && (
            <>
              <span>•</span>
              <a
                href={url ? `${url}#comments` : '#'}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="hover:underline"
              >
                {comments} comments
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

